import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  {
    label: 'My Orders',
    path: '/orders',
    icon: (
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label: 'Prescriptions',
    path: '/all-products',
    icon: (
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label: 'Addresses',
    path: '/checkout',
    icon: (
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label: 'Payment Methods',
    path: '/payment',
    icon: (
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label: 'Notifications',
    path: '/',
    icon: (
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
]

const AccountPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn, user, logout, openLoginModal } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-50 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[17px] font-bold text-gray-900">Account</h1>
        </div>

      </div>

      {/* Profile Card */}
      <div className="p-3">
        {isLoggedIn ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-[#006D6D] rounded-full flex items-center justify-center text-white text-[18px] font-bold shadow-lg shadow-[#006D6D]/20 shrink-0">
              {initials}
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">{user?.name || 'User'}</h2>
              <p className="text-[12px] text-gray-500 font-medium">{user?.email || user?.phone || ''}</p>
              <button onClick={() => navigate('/edit-profile')} className="flex items-center gap-1 text-[#006D6D] text-[12px] font-bold mt-0.5 hover:underline">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[14px] font-bold text-gray-700">Not logged in</h2>
              <button
                onClick={() => openLoginModal('login')}
                className="text-[12px] font-bold text-[#006D6D] hover:underline text-left"
              >
                Login or Sign Up →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Menu List */}
      <div className="px-3">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-gray-50 ${index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="shrink-0">
                {item.icon}
              </div>
              <span className="flex-1 text-[13px] font-bold text-gray-700">{item.label}</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-full bg-white border border-red-100 py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:bg-red-50 group"
          >
            <svg className="w-4 h-4 text-red-500 group-active:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[13px] font-black text-red-500 uppercase tracking-wider">Logout</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default AccountPage
