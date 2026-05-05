import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [pendingIntent, setPendingIntent] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginModalType, setLoginModalType] = useState('contact')

  // Restore login state from localStorage on app load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cb_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        setIsLoggedIn(true)
      }
    } catch {
      localStorage.removeItem('cb_user')
    }
  }, [])

  const login = (userData) => {
    const userObj = { ...userData, token: 'mock-token-' + Date.now() }
    localStorage.setItem('cb_user', JSON.stringify(userObj))
    setUser(userObj)
    setIsLoggedIn(true)
    setIsLoginModalOpen(false)
  }

  const logout = () => {
    localStorage.removeItem('cb_user')
    setUser(null)
    setIsLoggedIn(false)
  }

  const requireAuth = (intent) => {
    if (isLoggedIn) return true
    setPendingIntent(intent)
    setIsLoginModalOpen(true)
    return false
  }

  const openLoginModal = (tab = 'login') => {
    setLoginModalType(tab)
    setIsLoginModalOpen(true)
  }

  const clearIntent = () => setPendingIntent(null)

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      login,
      logout,
      requireAuth,
      pendingIntent,
      clearIntent,
      isLoginModalOpen,
      setIsLoginModalOpen,
      loginModalType,
      setLoginModalType,
      openLoginModal
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
