import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAdminChatSocket } from '../../context/AdminChatSocketContext';

const STATUS_BADGE = {
  waiting_human: 'bg-amber-50 text-amber-600',
  human_active: 'bg-emerald-50 text-emerald-600',
  resolved: 'bg-gray-100 text-gray-500',
  async: 'bg-blue-50 text-blue-600',
  bot: 'bg-violet-50 text-violet-600',
};

const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function DashboardChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const { socket, refreshUnread } = useAdminChatSocket();
  const messagesEndRef = useRef(null);
  const selectedIdRef = useRef(null);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  const loadList = useCallback(async () => {
    try {
      const res = await api.get('/chat/admin/conversations');
      setConversations(res.data.data);
    } catch {
      /* keep prior list on transient errors */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadThread = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/chat/admin/conversations/${id}`);
      setThread(res.data.data);
    } catch {
      /* ignore */
    }
  }, []);

  // Initial load + slow fallback poll (live updates arrive via socket).
  useEffect(() => {
    loadList();
    const t = setInterval(loadList, 30000);
    return () => clearInterval(t);
  }, [loadList]);

  // Load the open thread + join its live room; slow fallback poll.
  useEffect(() => {
    if (!selectedId) return;
    loadThread(selectedId);
    socket?.emit('conversation:join', { conversationId: selectedId });
    const t = setInterval(() => loadThread(selectedId), 30000);
    return () => {
      clearInterval(t);
      socket?.emit('conversation:leave', { conversationId: selectedId });
    };
  }, [selectedId, loadThread, socket]);

  // Live: refresh list on any change, and the open thread on new messages.
  useEffect(() => {
    if (!socket) return;
    const onUpdated = () => loadList();
    const onMessage = ({ conversationId: cid }) => {
      loadList();
      if (String(cid) === String(selectedIdRef.current)) loadThread(selectedIdRef.current);
    };
    socket.on('conversation:updated', onUpdated);
    socket.on('message:new', onMessage);
    return () => {
      socket.off('conversation:updated', onUpdated);
      socket.off('message:new', onMessage);
    };
  }, [socket, loadList, loadThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages?.length]);

  const sendReply = async (e) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text || !selectedId) return;
    setSending(true);
    try {
      await api.post(`/chat/admin/conversations/${selectedId}/messages`, { text });
      setReply('');
      await loadThread(selectedId);
      loadList();
      refreshUnread();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const customerName = (c) => c?.customer?.user?.name || c?.customer?.name || 'Guest';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">Customer Conversations</h3>
          {conversations.some((c) => c.unreadForAdmin) && (
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
        <Link to="/admin/chat" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
          All Conversations
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="flex" style={{ height: '380px' }}>
        {/* Conversation list */}
        <div className="w-72 border-r border-gray-100 flex flex-col shrink-0 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-400 text-sm">Loading…</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No conversations yet.</div>
          ) : (
            conversations.map((c) => (
              <button
                key={c._id}
                onClick={() => setSelectedId(c._id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  selectedId === c._id ? 'bg-secondary/40' : ''
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm truncate flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${c.customerOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      title={c.customerOnline ? 'Online now' : 'Away'}
                    ></span>
                    {customerName(c)}
                    {c.unreadForAdmin && <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0">{fmtTime(c.lastMessageAt)}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {c.lastMessageSender === 'admin' ? 'You: ' : ''}{c.lastMessageText || 'New conversation'}
                </p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-500'}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Thread */}
        <div className="flex-1 flex flex-col min-w-0">
          {!thread ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to reply.
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${thread.conversation.customerOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
                  {customerName(thread.conversation)}
                  <span className={`text-[10px] font-semibold ${thread.conversation.customerOnline ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {thread.conversation.customerOnline ? 'Online' : 'Away'}
                  </span>
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {thread.messages.map((m) => {
                  const isAdmin = m.sender === 'admin';
                  const isSystem = m.sender === 'system';
                  if (isSystem) {
                    return (
                      <div key={m._id} className="text-center">
                        <span className="text-[11px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{m.text}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={m._id} className={`flex flex-col max-w-[75%] ${isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <div className={`p-3 text-[13px] leading-relaxed shadow-sm break-words rounded-2xl ${
                        isAdmin ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {m.senderName ? `${m.senderName} · ` : ''}{fmtTime(m.createdAt)}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              <form onSubmit={sendReply} className="border-t border-gray-100 p-3 flex gap-2 items-center">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply…"
                  className="flex-1 border-2 border-gray-100 focus:border-primary bg-gray-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!reply.trim() || sending}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-40"
                >
                  {sending ? '…' : 'Send'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardChat;
