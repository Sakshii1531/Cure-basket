import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import api from '../utils/api';
import { createChatSocket } from '../utils/socket';
import { useAuth } from './AuthContext';

const AdminChatSocketContext = createContext(null);

// One shared socket for the whole admin area (live inbox, threads, unread bell).
// Mounted inside AdminLayout once the user is confirmed as a chat-capable admin.
export function AdminChatSocketProvider({ children }) {
  const { isLoggedIn, can } = useAuth();
  const enabled = isLoggedIn && can('chat', 'read');

  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback(() => {
    if (!enabled) return;
    api.get('/chat/admin/unread-count')
      .then((r) => setUnreadCount(r.data.data.count))
      .catch(() => {});
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const s = createChatSocket();
    socketRef.current = s;
    s.connect();
    setSocket(s);

    refreshUnread();
    s.on('conversation:updated', refreshUnread);
    // Slow safety net in case a socket event is missed (reconnect gaps, etc.).
    const t = setInterval(refreshUnread, 30000);

    return () => {
      clearInterval(t);
      s.off();
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [enabled, refreshUnread]);

  return (
    <AdminChatSocketContext.Provider value={{ socket, unreadCount, refreshUnread }}>
      {children}
    </AdminChatSocketContext.Provider>
  );
}

export function useAdminChatSocket() {
  return useContext(AdminChatSocketContext) || { socket: null, unreadCount: 0, refreshUnread: () => {} };
}
