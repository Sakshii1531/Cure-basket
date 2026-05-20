import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingIntent, setPendingIntent] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalType, setLoginModalType] = useState('login');
  const [redirectTo, setRedirectTo] = useState(null);

  // Clear auth state when api.js detects a 401 (expired/revoked token)
  useEffect(() => {
    const handler = () => {
      setUser(null);
      setIsLoggedIn(false);
    };
    window.addEventListener('cb:unauthorized', handler);
    return () => window.removeEventListener('cb:unauthorized', handler);
  }, []);

  // Validate the session on app load
  useEffect(() => {
    const token = localStorage.getItem('cb_token');
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      setAuthLoading(false);
      return;
    }

    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        setUser(null);
        setIsLoggedIn(false);
        // Only wipe the token when the server explicitly rejects it (401).
        // Network errors or server failures (5xx) should not evict a valid token.
        if (err.response?.status === 401) {
          localStorage.removeItem('cb_token');
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  // Execute pending intent immediately after login
  useEffect(() => {
    if (isLoggedIn && pendingIntent?.fn) {
      pendingIntent.fn(...(pendingIntent.args || []));
      clearIntent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('cb_token', res.data.token);
    }
    setUser(res.data.user);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    return res.data.user;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    if (res.data.token) {
      localStorage.setItem('cb_token', res.data.token);
    }
    setUser(res.data.user);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    return res.data.user;
  };

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('cb_token');
    setUser(null);
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('cb:logout'));
  };

  const requireAuth = (intent) => {
    if (isLoggedIn) return true;
    setPendingIntent(intent);
    setRedirectTo('/login');
    return false;
  };

  const openLoginModal = (tab = 'login') => {
    setLoginModalType(tab);
    setIsLoginModalOpen(true);
  };

  const clearIntent = () => setPendingIntent(null);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      authLoading,
      login,
      register,
      logout,
      requireAuth,
      pendingIntent,
      clearIntent,
      isLoginModalOpen,
      setIsLoginModalOpen,
      loginModalType,
      setLoginModalType,
      openLoginModal,
      redirectTo,
      setRedirectTo,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
