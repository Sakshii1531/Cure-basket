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

  // Validate the httpOnly cookie session on app load
  useEffect(() => {
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setUser(null);
        setIsLoggedIn(false);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    return res.data.user;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    setUser(res.data.user);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    return res.data.user;
  };

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {});
    setUser(null);
    setIsLoggedIn(false);
  };

  const requireAuth = (intent) => {
    if (isLoggedIn) return true;
    setPendingIntent(intent);
    window.location.href = '/login'; // Fallback for when navigate isn't available
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
