import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../utils/api';
import { createChatSocket } from '../utils/socket';
import { useAuth } from './AuthContext';

const AdminChatSocketContext = createContext(null);

const playNotificationSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch {
    // best-effort audio playback
  }
};

// One shared socket for the whole admin area (live inbox, threads, unread bell, real-time order alerts).
export function AdminChatSocketProvider({ children }) {
  const { isLoggedIn, can, user } = useAuth();
  const isAdmin = isLoggedIn && (user?.role === 'admin' || user?.role === 'superadmin' || can('chat', 'read') || can('orders', 'read'));
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [orderNotifications, setOrderNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('cb_order_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const markOrderNotificationsAsRead = useCallback(() => {
    setOrderNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('cb_order_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearOrderNotifications = useCallback(() => {
    setOrderNotifications([]);
    localStorage.removeItem('cb_order_notifications');
  }, []);

  const refreshUnread = useCallback(() => {
    if (!isAdmin) return;
    api.get('/chat/admin/unread-count')
      .then((r) => setUnreadCount(r.data.data.count))
      .catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const s = createChatSocket();
    socketRef.current = s;
    s.connect();
    setSocket(s);

    refreshUnread();
    s.on('conversation:updated', refreshUnread);

    // Real-time pop-up notification when a user places a new order
    const handleNewOrder = (newOrder) => {
      playNotificationSound();

      setOrderNotifications(prev => {
        const item = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          orderId: newOrder.orderId,
          customerName: newOrder.customerName || 'Customer',
          totalAmount: newOrder.totalAmount,
          itemsCount: newOrder.itemsCount,
          createdAt: newOrder.createdAt || new Date().toISOString(),
          read: false
        };
        const updated = [item, ...prev].slice(0, 20); // Keep last 20
        localStorage.setItem('cb_order_notifications', JSON.stringify(updated));
        return updated;
      });
    };

    s.on('order:new', handleNewOrder);

    const t = setInterval(refreshUnread, 30000);

    return () => {
      clearInterval(t);
      s.off('conversation:updated', refreshUnread);
      s.off('order:new', handleNewOrder);
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [isAdmin, refreshUnread, navigate]);

  return (
    <AdminChatSocketContext.Provider value={{
      socket,
      unreadCount,
      refreshUnread,
      orderNotifications,
      markOrderNotificationsAsRead,
      clearOrderNotifications
    }}>
      {children}
    </AdminChatSocketContext.Provider>
  );
}

export function useAdminChatSocket() {
  return useContext(AdminChatSocketContext) || {
    socket: null,
    unreadCount: 0,
    refreshUnread: () => {},
    orderNotifications: [],
    markOrderNotificationsAsRead: () => {},
    clearOrderNotifications: () => {}
  };
}
