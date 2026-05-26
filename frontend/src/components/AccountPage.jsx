import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const AccountPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn, user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('My Orders')
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    if (isLoggedIn) {
      api.get('/auth/me')
        .then(res => setAddresses(res.data.user?.addresses || []))
        .catch(() => {})
    }
  }, [isLoggedIn])

  const [profileForm, setProfileForm] = useState({
    firstName: 'Sakshi',
    lastName: 'Dwivedi',
    email: 'sakshidwivedi406@gmail.com',
    dob: '',
    gender: 'Female',
    changePassword: false,
    contactNumber: '7389961407',
    callForOffers: 'No',
    findUs: '',
    timeFrom: '',
    timeTo: '',
    timezone: 'CST'
  })
  const [profileSaved, setProfileSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.name?.split(' ')[0] || 'Sakshi',
        lastName: user.name?.split(' ').slice(1).join(' ') || 'Dwivedi',
        email: user.email || 'sakshidwivedi406@gmail.com',
        dob: user.dob || '',
        gender: user.gender || 'Female',
        changePassword: false,
        contactNumber: user.phone || '7389961407',
        callForOffers: user.callForOffers || 'No',
        findUs: user.findUs || '',
        timeFrom: user.timeFrom || '',
        timeTo: user.timeTo || '',
        timezone: user.timezone || 'CST'
      })
    }
  }, [user])

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  useEffect(() => {
    if (isLoggedIn) {
      setLoadingOrders(true)
      api.get('/orders/my-orders')
        .then(res => setOrders(res.data.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoadingOrders(false))
    }
  }, [isLoggedIn])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getMemberSince = () => {
    if (!user?.createdAt) return 'Member since 0 years, 0 months & 2 days'
    try {
      const created = new Date(user.createdAt)
      const now = new Date()
      let years = now.getFullYear() - created.getFullYear()
      let months = now.getMonth() - created.getMonth()
      let days = now.getDate() - created.getDate()
      if (days < 0) {
        months -= 1
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
      }
      if (months < 0) {
        years -= 1
        months += 12
      }
      return `Member since ${years} years, ${months} months & ${days} days`
    } catch (e) {
      return 'Member since 0 years, 0 months & 2 days'
    }
  }

  const menuTabs = [
    {
      label: 'My Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      )
    },
    {
      label: 'Refill Reminder',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      )
    },
    {
      label: 'Rewards Points',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
        </svg>
      )
    },
    {
      label: 'Referral Program',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      )
    },
    {
      label: 'Wishlist',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      )
    },
    {
      label: 'Product Reviews',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.258.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.551-.387-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z"/>
        </svg>
      )
    },
    {
      label: 'Service Reviews',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
        </svg>
      )
    },
    {
      label: 'Your Addresses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      )
    },
    {
      label: 'Edit Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      )
    }
  ]

  if (!isLoggedIn) {
    return (
      <div className="bg-[#f4f6f5] min-h-screen py-12 px-4 font-sans selection:bg-[#006D6D]/20 text-[#333] flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#e6f2f2] rounded-full flex items-center justify-center text-[#006D6D] mx-auto mb-4 text-[24px]">👤</div>
          <h2 className="text-[20px] font-semibold text-gray-800 font-sans">Access Your Account</h2>
          <p className="text-[14px] text-gray-500 mt-2.5 mb-6 font-sans">Please log in to view your orders, prescriptions, and manage addresses.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#006D6D] hover:bg-[#005a5a] text-white py-2.5 rounded-md font-semibold text-[15px] transition-all font-sans"
          >
            Login or Sign Up
          </button>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'My Orders':
        if (loadingOrders) {
          return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] flex items-center justify-center text-gray-400 text-[15px] font-sans">
              Loading your orders...
            </div>
          )
        }
        if (orders.length > 0) {
          return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] space-y-4 font-sans">
              <h3 className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Your Recent Orders</h3>
              {orders.map((order) => {
                const itemCount = (order.items || []).length
                return (
                  <div key={order._id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="text-[15px] font-semibold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</h4>
                      <p className="text-[13px] text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-[12px] font-bold bg-[#e6f2f2] text-[#006D6D]">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end font-sans">
                      <span className="text-[14px] text-gray-500 font-semibold">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
                      <span className="text-[18px] font-bold text-gray-850">₹{order.totalAmount}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] font-sans">
            <div className="bg-[#fffdf8] border border-[#fbf2e3] rounded p-4 text-[#7d5b24] text-[14.5px] flex items-center gap-2.5">
              <span className="text-[18px] shrink-0">⚠️</span>
              <span className="font-semibold">You have placed no orders.</span>
            </div>
          </div>
        )
      case 'Refill Reminder':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] font-sans">
            <div className="bg-[#fffdf8] border border-[#fbf2e3] rounded p-4 text-[#7d5b24] text-[14.5px] flex items-center gap-2.5">
              <span className="text-[18px] shrink-0">⚠️</span>
              <span className="font-semibold">You have no active refill reminders.</span>
            </div>
          </div>
        )
      case 'Rewards Points':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center p-8 font-sans">
            <div className="w-16 h-16 bg-[#e6f2f2] rounded-full flex items-center justify-center text-[#006D6D] mb-4 text-[24px]">🎯</div>
            <h3 className="text-[18px] font-semibold text-gray-800">Your Rewards Balance</h3>
            <p className="text-[32px] font-bold text-[#006D6D] mt-1">0 Points</p>
            <p className="text-[13px] text-gray-400 mt-2 max-w-sm">Earn points on every order and redeem them for exclusive discounts.</p>
          </div>
        )
      case 'Referral Program':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center p-8 font-sans">
            <div className="w-16 h-16 bg-[#e6f2f2] rounded-full flex items-center justify-center text-[#006D6D] mb-4 text-[24px]">👥</div>
            <h3 className="text-[18px] font-semibold text-gray-800">Refer & Earn</h3>
            <p className="text-[13.5px] text-gray-500 mt-2 max-w-sm">Invite your friends to CureBasket. When they place their first order, you both get 500 bonus points!</p>
            <button className="mt-4 bg-[#006D6D] hover:bg-[#005a5a] text-white px-6 py-2.5 rounded-md text-[14px] font-semibold transition-all font-sans">Get Referral Link</button>
          </div>
        )
      case 'Wishlist':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] font-sans">
            <div className="bg-[#fffdf8] border border-[#fbf2e3] rounded p-4 text-[#7d5b24] text-[14.5px] flex items-center gap-2.5">
              <span className="text-[18px] shrink-0">⚠️</span>
              <span className="font-semibold">Your wishlist is currently empty.</span>
            </div>
          </div>
        )
      case 'Product Reviews':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] font-sans">
            <div className="bg-[#fffdf8] border border-[#fbf2e3] rounded p-4 text-[#7d5b24] text-[14.5px] flex items-center gap-2.5">
              <span className="text-[18px] shrink-0">⚠️</span>
              <span className="font-semibold">You have not submitted any product reviews.</span>
            </div>
          </div>
        )
      case 'Service Reviews':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] font-sans">
            <div className="bg-[#fffdf8] border border-[#fbf2e3] rounded p-4 text-[#7d5b24] text-[14.5px] flex items-center gap-2.5">
              <span className="text-[18px] shrink-0">⚠️</span>
              <span className="font-semibold">You have not submitted any service reviews.</span>
            </div>
          </div>
        )
      case 'Your Addresses':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] space-y-6 font-sans">
            <h3 className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-2">Your Saved Addresses</h3>
            {addresses.length === 0 ? (
              <div className="bg-[#fffdf8] border border-[#fbf2e3] rounded p-4 text-[#7d5b24] text-[14.5px] flex items-center gap-2.5">
                <span className="text-[18px] shrink-0">⚠️</span>
                <span className="font-semibold">You have no saved addresses yet.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr, i) => (
                  <div key={addr._id || i} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                    <h4 className="text-[14px] font-semibold text-primary flex items-center gap-2">
                      {addr.name}
                      {i === 0 && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">Default</span>}
                    </h4>
                    <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">{addr.street}, {addr.city}</p>
                    <p className="text-[12px] text-gray-400 mt-1">{addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => navigate('/checkout')} className="mt-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-md text-[14px] font-semibold transition-all font-sans">Manage Addresses</button>
          </div>
        )
      case 'Edit Profile':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] text-[13.5px] font-sans">
            <h3 className="text-[17px] font-bold text-gray-850 uppercase tracking-wider mb-5 pb-1 border-b border-gray-50">EDIT PROFILE</h3>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 font-sans">
              
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-[#006D6D] mb-1.5 block font-sans">First Name<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={profileForm.firstName} 
                    onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#006D6D] mb-1.5 block font-sans">Last Name<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={profileForm.lastName} 
                    onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#006D6D] mb-1.5 block font-sans">Email<span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    value={profileForm.email} 
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 font-sans"
                  />
                </div>
              </div>

              {/* DOB and Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="text-[13px] font-semibold text-[#006D6D] mb-1.5 block font-sans">Date of Birth</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={profileForm.dob} 
                      onChange={(e) => setProfileForm({...profileForm, dob: e.target.value})}
                      className="border border-gray-300 rounded pl-3 pr-10 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 bg-white font-sans"
                    />
                    <span className="absolute right-3 top-2 text-[#006D6D] text-[16px] pointer-events-none select-none">📅</span>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-[13px] font-semibold text-[#006D6D] mb-2.5 block font-sans">Gender</label>
                  <div className="flex flex-wrap items-center gap-6 mt-1">
                    {['Male', 'Female', 'Non-binary'].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer text-[13.5px] font-medium text-gray-700 select-none font-sans">
                        <input 
                          type="radio" 
                          name="gender" 
                          value={g} 
                          checked={profileForm.gender === g}
                          onChange={() => setProfileForm({...profileForm, gender: g})}
                          className="w-4.5 h-4.5 text-[#006D6D] border-gray-300 focus:ring-[#006D6D]"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Change Password Checkbox */}
              <div className="pt-1 flex items-center gap-2 select-none">
                <input 
                  type="checkbox" 
                  id="changePassword" 
                  checked={profileForm.changePassword}
                  onChange={(e) => setProfileForm({...profileForm, changePassword: e.target.checked})}
                  className="w-4.5 h-4.5 text-[#006D6D] border-gray-300 rounded focus:ring-[#006D6D] cursor-pointer font-sans"
                />
                <label htmlFor="changePassword" className="text-[13.5px] font-semibold text-gray-700 cursor-pointer font-sans">Change Password</label>
              </div>

              {/* MORE INFORMATION Header Banner */}
              <div className="bg-[#006D6D] text-white px-4 py-2.5 rounded font-bold text-[13px] uppercase tracking-wider mt-6 mb-4 select-none font-sans">
                MORE INFORMATION
              </div>

              {/* More Information Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="text-[13px] font-semibold text-[#006D6D] mb-1.5 block font-sans">Contact Number</label>
                  <input 
                    type="text" 
                    value={profileForm.contactNumber} 
                    onChange={(e) => setProfileForm({...profileForm, contactNumber: e.target.value})}
                    placeholder="contact no *"
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#006D6D] mb-1.5 block font-sans">Call For Offers</label>
                  <select 
                    value={profileForm.callForOffers} 
                    onChange={(e) => setProfileForm({...profileForm, callForOffers: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 bg-white cursor-pointer font-sans"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#006D6D] mb-1.5 block font-sans">How did you find us?</label>
                  <select 
                    value={profileForm.findUs} 
                    onChange={(e) => setProfileForm({...profileForm, findUs: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 bg-white cursor-pointer font-sans"
                  >
                    <option value="">Select option</option>
                    <option value="Search Engine">Search Engine (Google, Bing, etc.)</option>
                    <option value="Friend / Family">Friend / Family</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Time to Call selectors */}
              <div className="pt-1">
                <label className="text-[13px] font-semibold text-[#006D6D] mb-1.5 block font-sans">Preferable Time to Call</label>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 max-w-sm">
                  <select 
                    value={profileForm.timeFrom} 
                    onChange={(e) => setProfileForm({...profileForm, timeFrom: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 bg-white cursor-pointer font-sans"
                  >
                    <option value="">Start</option>
                    {Array.from({length: 12}).map((_, i) => (
                      <option key={i} value={`${i+1} AM`}>{i+1} AM</option>
                    ))}
                    {Array.from({length: 12}).map((_, i) => (
                      <option key={i} value={`${i+1} PM`}>{i+1} PM</option>
                    ))}
                  </select>
                  <span className="text-[13.5px] text-gray-500 font-semibold select-none font-sans">to</span>
                  <select 
                    value={profileForm.timeTo} 
                    onChange={(e) => setProfileForm({...profileForm, timeTo: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 bg-white cursor-pointer font-sans"
                  >
                    <option value="">End</option>
                    {Array.from({length: 12}).map((_, i) => (
                      <option key={i} value={`${i+1} AM`}>{i+1} AM</option>
                    ))}
                    {Array.from({length: 12}).map((_, i) => (
                      <option key={i} value={`${i+1} PM`}>{i+1} PM</option>
                    ))}
                  </select>
                  <select 
                    value={profileForm.timezone} 
                    onChange={(e) => setProfileForm({...profileForm, timezone: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 bg-white cursor-pointer font-sans"
                  >
                    <option value="CST">CST</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                    <option value="GMT">GMT</option>
                    <option value="IST">IST</option>
                  </select>
                </div>
              </div>

              {/* SAVE Actions Row */}
              <div className="flex items-center gap-4 pt-3 font-sans">
                <button 
                  onClick={handleSaveProfile}
                  className="bg-[#006D6D] hover:bg-[#005a5a] text-white font-semibold px-6 py-2 rounded text-[13.5px] uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm font-sans"
                >
                  SAVE
                </button>
                {profileSaved && (
                  <span className="text-green-600 font-semibold text-[13.5px] animate-pulse font-sans">✓ Profile updated successfully!</span>
                )}
              </div>

            </form>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-[#f4f6f5] min-h-screen py-8 px-4 font-sans selection:bg-[#006D6D]/20 text-[#333] antialiased">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[14.5px] text-gray-500 mb-6 px-1 select-none font-sans">
          <span className="text-[#006D6D] text-[16px]">🏠</span>
          <span className="hover:underline cursor-pointer font-medium font-sans" onClick={() => navigate('/')}>My Account</span>
          <span className="text-gray-400 font-bold">&gt;</span>
          <span className="text-gray-700 font-semibold font-sans">{activeTab}</span>
        </div>

        {/* Tab Selection Card (YOUR ACCOUNT) */}
        <div className="bg-white rounded-lg border border-gray-200 py-3.5 px-5 shadow-sm mb-6 max-w-5xl mx-auto font-sans">
          <h2 className="text-[16px] font-bold text-gray-855 uppercase tracking-wide border-b border-gray-100 pb-1.5 mb-3 font-sans">MY ACCOUNT</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-2.5">
            {menuTabs.map((tab) => {
              const isSelected = activeTab === tab.label
              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    if (tab.onClick) tab.onClick()
                    else setActiveTab(tab.label)
                  }}
                  className={`flex flex-col items-center justify-center text-center p-2.5 sm:p-3.5 rounded-lg text-[11.5px] sm:text-[13px] font-semibold border transition-all duration-150 group font-sans ${
                    isSelected 
                      ? 'bg-[#e6f2f2] border-[#b3d9d9] text-[#006D6D] shadow-inner font-bold' 
                      : 'bg-transparent border-transparent text-gray-600 hover:text-[#006D6D] hover:bg-[#e6f2f2]/30'
                  }`}
                >
                  <div className={`mb-1.5 transition-all duration-150 ${isSelected ? 'text-[#006D6D] scale-105' : 'text-[#006D6D]/80 group-hover:scale-105'}`}>
                    {tab.icon}
                  </div>
                  <span className="leading-tight font-sans">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start font-sans">
          
          {/* Left Column: Combined User details & Manage Address Card */}
          <div className="space-y-6 lg:col-span-1 order-2 lg:order-1 font-sans">
            
            {/* Combined User & Address Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-6 font-sans">
              
              {/* User Profile Section */}
              <div className="font-sans">
                <h2 className="text-[20px] font-bold text-gray-800 tracking-tight leading-none font-sans">{user?.name || 'Ujjawal K'}</h2>
                <p className="text-[13px] text-gray-400 mt-2 font-medium tracking-tight mb-4 font-sans">{getMemberSince()}</p>
                
                <div className="border-t border-gray-100 pt-4 flex items-center gap-2.5 text-gray-600 text-[14px] font-semibold font-sans">
                  <span className="text-[#006D6D] text-[16px]">✉️</span>
                  <span className="truncate font-sans">{user?.email || 'sakshidwivedi406@gmail.com'}</span>
                </div>
              </div>

              {/* Manage Address Section */}
              <div className="border-t border-gray-100 pt-5 font-sans">
                <div className="flex items-center gap-2.5 text-[#006D6D] border-b border-gray-100 pb-2.5 mb-4 font-sans">
                  <span className="text-[18px]">🏠</span>
                  <h3 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider font-sans">Manage Address</h3>
                </div>

                <div className="space-y-4 font-sans">
                  {addresses.length === 0 ? (
                    <p className="text-[13px] text-gray-400 font-sans">No saved addresses yet.</p>
                  ) : addresses.map((addr, i) => (
                    <div key={addr._id || i} className={i > 0 ? "border-t border-gray-100 pt-4" : ""}>
                      <h4 className="text-[12.5px] font-bold text-primary uppercase tracking-wider font-sans">
                        {addr.name} {i === 0 && <span className="text-[10px] text-gray-400 font-normal lowercase">(Default)</span>}
                      </h4>
                      <p className="text-[13.5px] text-gray-500 font-semibold mt-1.5 leading-relaxed font-sans">
                        {addr.street}, {addr.city}
                      </p>
                      <p className="text-[12px] text-gray-400 font-sans">{addr.phone}</p>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 pt-4">
                    <button 
                      onClick={() => navigate('/checkout')} 
                      className="text-[13.5px] font-bold text-[#006D6D] hover:underline flex items-center gap-1 uppercase tracking-wider font-sans"
                    >
                      <span className="text-[15px] font-bold font-sans">+</span> Manage Addresses
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Tab View Box */}
          <div className="lg:col-span-2 order-1 lg:order-2 font-sans">
            {renderTabContent()}
          </div>

        </div>

      </div>
    </div>
  )
}

export default AccountPage
