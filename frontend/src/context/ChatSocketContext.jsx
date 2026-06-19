import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../utils/api';
import { createChatSocket, getChatSessionId } from '../utils/socket';
import { useAuth } from './AuthContext';

const ChatSocketContext = createContext(null);

// Customer-side live chat. Holds ONE socket connection for the whole site so the
// visitor receives messages (and a toast / browser notification) even while the
// chat widget is closed and they're browsing elsewhere. The conversation itself
// is created lazily (on open or first send) so we never spam the chemist's inbox
// with empty conversations for visitors who never chat.
export function ChatSocketProvider({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { user, isLoggedIn } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [supportOnline, setSupportOnline] = useState(true);
  const [isReturning, setIsReturning] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // Guest must share name/email once before chatting; logged-in users never do.
  const [needsGuestForm, setNeedsGuestForm] = useState(false);

  const socketRef = useRef(null);
  const sessionId = useRef(getChatSessionId());
  const conversationId = useRef(localStorage.getItem('cb_chat_conversation') || null);
  const initedRef = useRef(false);
  const isOpenRef = useRef(false);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  const mergeMessages = useCallback((incoming) => {
    const list = Array.isArray(incoming) ? incoming : [incoming];
    if (!list.length) return;
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m._id));
      const fresh = list.filter((m) => m && !seen.has(m._id));
      return fresh.length ? [...prev, ...fresh] : prev;
    });
  }, []);

  const ensureNotificationPermission = useCallback(() => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default') Notification.requestPermission().catch(() => {});
  }, []);

  // Create/resume the visitor's conversation and load full history. Lazy — only
  // called when the widget opens or a message is sent.
  const initConversation = useCallback(async () => {
    if (initedRef.current) return;
    initedRef.current = true;
    try {
      const payload = isLoggedIn && user
        ? { sessionId: sessionId.current, name: user.name, email: user.email }
        : { sessionId: sessionId.current };
      const res = await api.post('/chat/conversations', payload);
      const { conversation, messages: history, supportOnline: online, isReturning: returning, greeting } = res.data.data;

      conversationId.current = conversation._id;
      localStorage.setItem('cb_chat_conversation', conversation._id);
      setSupportOnline(online);
      setIsReturning(!!returning);

      // Show prior history; otherwise an ephemeral greeting line (not persisted).
      setMessages(history.length
        ? history
        : [{ _id: 'greeting', sender: 'system', text: greeting, createdAt: new Date().toISOString() }]);

      // A guest with no name on record must fill the one-time pre-chat form.
      setNeedsGuestForm(!isLoggedIn && !conversation.customer?.name);

      socketRef.current?.emit('conversation:join', { conversationId: conversation._id });
    } catch {
      initedRef.current = false; // allow a retry
    }
  }, [isLoggedIn, user]);

  const openWidget = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
    ensureNotificationPermission();
    initConversation();
  }, [ensureNotificationPermission, initConversation]);

  // A non-customer message arrived → show inline (widget open) or surface a
  // clickable toast + browser notification (visitor is away / on another tab).
  const handleIncoming = useCallback((message) => {
    mergeMessages(message);
    const away = !isOpenRef.current || document.visibilityState === 'hidden';
    if (!away) return;

    setUnreadCount((c) => c + 1);
    const preview = (message.text || 'New message').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 90);

    toast('💬 New message from CureBasket Support', {
      description: preview,
      action: { label: 'View', onClick: () => window.dispatchEvent(new Event('open-chat-widget')) },
    });

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && document.visibilityState === 'hidden') {
      try {
        const n = new Notification('CureBasket Support', { body: preview, tag: 'cb-chat' });
        n.onclick = () => { window.focus(); window.dispatchEvent(new Event('open-chat-widget')); n.close(); };
      } catch { /* some platforms reject — the toast still shows */ }
    }
  }, [mergeMessages]);

  // Establish the socket once (customer pages only). Background room-join lets
  // toasts fire for an existing conversation even before the widget is opened.
  useEffect(() => {
    if (isAdminRoute) return;
    const socket = createChatSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      if (conversationId.current) socket.emit('conversation:join', { conversationId: conversationId.current });
    });
    socket.on('message:new', ({ conversationId: cid, message }) => {
      if (conversationId.current && String(cid) !== String(conversationId.current)) return;
      if (message.sender === 'user') { mergeMessages(message); return; } // own echo from another tab
      handleIncoming(message);
    });

    socket.connect();
    return () => { socket.off(); socket.disconnect(); socketRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminRoute]);

  // On login, link any guest chat history to the account, then reconnect with
  // the fresh token and reload history into the open thread.
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || isAdminRoute) return;
    if (isLoggedIn && user) {
      api.post('/chat/link', { sessionId: sessionId.current }).catch(() => {});
    }
    if (initedRef.current) {
      initedRef.current = false;
      socket.disconnect();
      socket.connect();
      initConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user?._id]);

  // Global "open the chat" event (toasts, notifications, other UI).
  useEffect(() => {
    const handler = () => openWidget();
    window.addEventListener('open-chat-widget', handler);
    return () => window.removeEventListener('open-chat-widget', handler);
  }, [openWidget]);

  // Send a customer message (optimistic; the server echo dedupes by _id).
  const sendMessage = useCallback(async (text) => {
    const body = (text || '').trim();
    if (!body) return;
    if (!conversationId.current) await initConversation();

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { _id: tempId, sender: 'user', text: body, createdAt: new Date().toISOString() }]);
    try {
      const res = await api.post(`/chat/conversations/${conversationId.current}/messages`, { sessionId: sessionId.current, text: body });
      const saved = res.data.data;
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m._id !== tempId);
        return withoutTemp.some((m) => m._id === saved._id) ? withoutTemp : [...withoutTemp, saved];
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      toast.error(err.response?.data?.error || 'Failed to send. Please try again.');
      throw err;
    }
  }, [initConversation]);

  // Guest submits their one-time details; conversation is enriched server-side.
  const submitGuestDetails = useCallback(async ({ name, email, subject }) => {
    const res = await api.post('/chat/conversations', { sessionId: sessionId.current, name, email, subject });
    const conv = res.data.data.conversation;
    conversationId.current = conv._id;
    localStorage.setItem('cb_chat_conversation', conv._id);
    setNeedsGuestForm(false);
    socketRef.current?.emit('conversation:join', { conversationId: conv._id });
  }, []);

  const value = {
    isOpen, openWidget, closeWidget: () => setIsOpen(false),
    messages, supportOnline, isReturning, unreadCount,
    needsGuestForm, sendMessage, submitGuestDetails,
    markRead: () => setUnreadCount(0),
    ensureNotificationPermission,
  };

  return <ChatSocketContext.Provider value={value}>{children}</ChatSocketContext.Provider>;
}

export function useChatSocket() {
  const ctx = useContext(ChatSocketContext);
  if (!ctx) throw new Error('useChatSocket must be used inside ChatSocketProvider');
  return ctx;
}
