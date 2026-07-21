import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { OrderDetailDrawer } from './OrdersPage'

const AccountPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn, user, setUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('My Orders')
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [shippingCharges, setShippingCharges] = useState(0)
  const [freeThreshold, setFreeThreshold] = useState(0)
  
  const [addresses, setAddresses] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [myReviews, setMyReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)

  useEffect(() => {
    if (activeTab === 'Wishlist') {
      const list = JSON.parse(localStorage.getItem('cb_wishlist') || '[]')
      setWishlistItems(list)
    }
  }, [activeTab])

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressForm, setAddressForm] = useState({
    name: '',
    street: '',
    city: '',
    phone: ''
  })
  const [addressSaving, setAddressSaving] = useState(false)
  const [addressError, setAddressError] = useState('')
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [deleteAddressId, setDeleteAddressId] = useState(null)

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault()

    // Validate city name (no digits allowed)
    if (/\d/.test(addressForm.city)) {
      setAddressError('City name cannot contain numbers.')
      return
    }

    setAddressSaving(true)
    setAddressError('')
    try {
      let res;
      if (editingAddressId) {
        res = await api.put(`/auth/me/addresses/${editingAddressId}`, addressForm)
        toast.success('Address updated successfully.')
      } else {
        res = await api.post('/auth/me/addresses', addressForm)
        toast.success('Address added successfully.')
      }
      setAddresses(res.data.addresses)
      if (setUser && res.data.addresses) {
        setUser(prev => prev ? { ...prev, addresses: res.data.addresses } : prev)
      }
      closeAddressModal()
    } catch (err) {
      setAddressError(err.response?.data?.error || 'Failed to save address. Please try again.')
    } finally {
      setAddressSaving(false)
    }
  }

  const closeAddressModal = () => {
    setShowAddressModal(false)
    setEditingAddressId(null)
    setAddressForm({ name: '', street: '', city: '', phone: '' })
    setAddressError('')
  }

  const openAddAddressModal = () => {
    setEditingAddressId(null)
    setAddressForm({ name: '', street: '', city: '', phone: '' })
    setAddressError('')
    setShowAddressModal(true)
  }

  const handleEditAddressClick = (addr) => {
    setEditingAddressId(addr._id)
    setAddressForm({
      name: addr.name,
      street: addr.street,
      city: addr.city,
      phone: addr.phone
    })
    setAddressError('')
    setShowAddressModal(true)
  }

  const handleDeleteAddressClick = (addressId) => {
    setDeleteAddressId(addressId)
  }

  useEffect(() => {
    if (isLoggedIn) {
      api.get('/auth/me')
        .then(res => setAddresses(res.data.user?.addresses || []))
        .catch(() => {})
    }
  }, [isLoggedIn])

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    dob: '',
    gender: '',
    changePassword: false,
    contactNumber: '',
    callForOffers: 'No',
    findUs: '',
    timeFrom: '',
    timeTo: '',
    timezone: 'CST'
  })
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')

  // ── Change Password Modal ──────────────────────────────────────────────────
  const [showPwModal, setShowPwModal] = useState(false)

  useEffect(() => {
    if (showAddressModal || showPwModal || deleteAddressId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showAddressModal, showPwModal, deleteAddressId])

  const [pwTab, setPwTab] = useState('current') // 'current' | 'email'
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLockUntil, setPwLockUntil] = useState(null) // Date when lock expires
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })

  const openPwModal = () => {
    setPwTab('current')
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setPwError('')
    setPwSuccess('')
    setShowPw({ current: false, new: false, confirm: false })
    setShowPwModal(true)
  }

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')

    // Check local lockout state first
    if (pwLockUntil && pwLockUntil > Date.now()) {
      const mins = Math.ceil((pwLockUntil - Date.now()) / 60000)
      toast.error(`Account locked. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.`)
      return
    }

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    setPwLoading(true)
    try {
      await api.put('/auth/me/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      setPwSuccess('Password updated successfully!')
      setPwLockUntil(null)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password updated successfully!')
    } catch (err) {
      const data = err.response?.data || {}
      if (data.code === 'PW_LOCKED') {
        const lockExpiry = Date.now() + (data.minutesLeft || 30) * 60 * 1000
        setPwLockUntil(lockExpiry)
        const msg = `Too many failed attempts. You are locked out for ${data.minutesLeft || 30} minutes.`
        setPwError(msg)
        toast.error(msg, { duration: 6000 })
      } else if (data.code === 'PW_WRONG') {
        const left = data.attemptsLeft ?? '?'
        const msg = `Incorrect password. You have ${left} attempt${left !== 1 ? 's' : ''} remaining.`
        setPwError(msg)
        toast.warning(msg, { duration: 5000 })
      } else {
        const msg = data.error || 'Failed to update password. Please try again.'
        setPwError(msg)
        toast.error(msg)
      }
    } finally {
      setPwLoading(false)
    }
  }

  const handleSendResetEmail = async () => {
    setPwError('')
    setPwSuccess('')
    setPwLoading(true)
    try {
      await api.post('/auth/forgot-password', { email: user?.email })
      setPwSuccess(`Reset link sent to ${user?.email}. Check your inbox!`)
    } catch (err) {
      setPwError(err.response?.data?.error || 'Failed to send reset email. Please try again.')
    } finally {
      setPwLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        dob: user.dob || '',
        gender: user.gender || '',
        contactNumber: user.phone || '',
      }))
    }
  }, [user])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!profileForm.fullName.trim()) {
      setProfileError('Full name is required.')
      return
    }
    setProfileSaving(true)
    setProfileError('')
    try {
      const res = await api.put('/auth/me', {
        name: profileForm.fullName.trim(),
        phone: profileForm.contactNumber,
        dob: profileForm.dob,
        gender: profileForm.gender,
      })
      if (res.data.user) setUser(res.data.user)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Failed to save profile. Please try again.')
    } finally {
      setProfileSaving(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      setLoadingOrders(true)
      api.get('/orders/my-orders')
        .then(res => setOrders(res.data.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoadingOrders(false))

      api.get('/settings/public/order_shipping')
        .then(res => {
          if (res.data && res.data.data) {
            const charges = parseFloat(res.data.data.shippingCharges);
            const threshold = parseFloat(res.data.data.freeShippingThreshold);
            if (!isNaN(charges)) setShippingCharges(charges);
            if (!isNaN(threshold)) setFreeThreshold(threshold);
          }
        })
        .catch(() => {});

      setLoadingReviews(true)
      api.get('/reviews/my-reviews')
        .then(res => setMyReviews(res.data.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoadingReviews(false))
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
                const displayedTotal = Number(order.totalAmount) || 0;
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
                      <span className="text-[18px] font-bold text-gray-850">${displayedTotal.toFixed(2)}</span>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 text-[#006D6D] text-[13px] font-bold border border-[#006D6D]/30 bg-[#006D6D]/5 hover:bg-[#006D6D]/10 px-3.5 py-2 rounded-xl transition-colors shrink-0"
                      >
                        View Details
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
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

      case 'Wishlist':
        if (wishlistItems.length === 0) {
          return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] font-sans">
              <div className="bg-[#fffdf8] border border-[#fbf2e3] rounded p-4 text-[#7d5b24] text-[14.5px] flex items-center gap-2.5">
                <span className="text-[18px] shrink-0">⚠️</span>
                <span className="font-semibold">Your wishlist is currently empty.</span>
              </div>
            </div>
          )
        }
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] space-y-4 font-sans">
            <h3 className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Your Wishlist</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistItems.map((item) => (
                <div key={item._id} className="border border-gray-150 rounded-xl p-4 bg-white hover:border-gray-300 transition-all flex items-center gap-4 relative">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-[14px] font-bold text-gray-900 truncate">{item.name}</h4>
                    {item.genericName && (
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.genericName}</p>
                    )}
                    <p className="text-[14px] font-bold text-[#006D6D] mt-2">${item.price}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => navigate(`/product/${item.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product: item } })}
                      className="bg-[#E6F7F7] text-[#006D6D] hover:bg-[#CFF4F4] px-3 py-1.5 rounded-md text-[11px] font-bold transition-all"
                    >
                      View
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        const updated = wishlistItems.filter(i => String(i._id) !== String(item._id))
                        setWishlistItems(updated)
                        localStorage.setItem('cb_wishlist', JSON.stringify(updated))
                      }}
                      className="text-red-500 hover:text-red-700 text-[11px] font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'Product Reviews': {
        if (loadingReviews) {
          return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] flex items-center justify-center text-gray-400 text-[15px] font-sans">
              Loading your reviews...
            </div>
          )
        }
        if (myReviews.length === 0) {
          return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] font-sans">
              <div className="bg-[#fffdf8] border border-[#fbf2e3] rounded p-4 text-[#7d5b24] text-[14.5px] flex items-center gap-2.5">
                <span className="text-[18px] shrink-0">⚠️</span>
                <span className="font-semibold">You have not submitted any product reviews.</span>
              </div>
            </div>
          )
        }
        const reviewStatusBadge = {
          approved: 'bg-[#e6f2f2] text-[#006D6D]',
          pending:  'bg-[#fff8e7] text-[#b7791f]',
          rejected: 'bg-red-50 text-red-500',
        }
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] space-y-4 font-sans">
            <h3 className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Your Product Reviews</h3>
            {myReviews.map((review) => (
              <div key={review._id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-semibold text-gray-800 truncate">{review.medicine?.name || 'Product'}</h4>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-[#FFB800]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.965a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.453a1 1 0 00-.364 1.118l1.287 3.966c.3.92-.755 1.688-1.54 1.118l-3.375-2.453a1 1 0 00-1.176 0l-3.375 2.453c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.22 9.392c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.965z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold capitalize shrink-0 ${reviewStatusBadge[review.status] || 'bg-gray-100 text-gray-500'}`}>
                    {review.status}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-[13.5px] text-gray-600 mt-2.5 leading-relaxed">{review.comment}</p>
                )}
                <p className="text-[12px] text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                {review.status === 'pending' && (
                  <p className="text-[12px] text-[#b7791f] mt-1">Awaiting approval — it will appear on the product page once our team reviews it.</p>
                )}
              </div>
            ))}
          </div>
        )
      }

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
                  <div key={addr._id || i} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[14px] font-semibold text-primary flex items-center gap-2">
                        {addr.name}
                        {i === 0 && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">Default</span>}
                      </h4>
                      <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">{addr.street}, {addr.city}</p>
                      <p className="text-[12px] text-gray-400 mt-1">{addr.phone}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-3 text-[12px] font-semibold">
                      <button
                        onClick={() => handleEditAddressClick(addr)}
                        className="text-[#006D6D] hover:underline"
                      >
                        Edit
                      </button>
                      <span className="text-gray-300 font-normal">|</span>
                      <button
                        onClick={() => handleDeleteAddressClick(addr._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={openAddAddressModal} className="mt-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-md text-[14px] font-semibold transition-all font-sans">+ Add New Address</button>
          </div>
        )
      case 'Edit Profile':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] text-[13.5px] font-sans">
            <h3 className="text-[17px] font-bold text-gray-850 uppercase tracking-wider mb-5 pb-1 border-b border-gray-50">EDIT PROFILE</h3>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 font-sans">
              
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[13px] font-semibold text-[#006D6D] mb-1.5 block font-sans">Full Name<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
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

              {/* Change Password Button */}
              <div className="pt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={openPwModal}
                  className="flex items-center gap-2 bg-[#e6f2f2] hover:bg-[#cde8e8] border border-[#b3d9d9] text-[#006D6D] font-semibold px-4 py-2 rounded text-[13px] transition-all duration-200 select-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                  Change Password
                </button>
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
                  disabled={profileSaving}
                  className="bg-[#006D6D] hover:bg-[#005a5a] text-white font-semibold px-6 py-2 rounded text-[13.5px] uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm font-sans disabled:opacity-60"
                >
                  {profileSaving ? 'SAVING…' : 'SAVE'}
                </button>
                {profileSaved && (
                  <span className="text-green-600 font-semibold text-[13.5px] animate-pulse font-sans">✓ Profile updated successfully!</span>
                )}
                {profileError && (
                  <span className="text-red-500 font-semibold text-[13.5px] font-sans">{profileError}</span>
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
                <h2 className="text-[20px] font-bold text-gray-800 tracking-tight leading-none font-sans capitalize">{user?.name || 'Ujjawal K'}</h2>
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
                      <div className="flex items-center justify-between">
                        <h4 className="text-[12.5px] font-bold text-primary uppercase tracking-wider font-sans">
                          {addr.name} {i === 0 && <span className="text-[10px] text-gray-400 font-normal lowercase">(default)</span>}
                        </h4>
                        <div className="flex items-center gap-2 text-[12px] font-semibold">
                          <button
                            onClick={() => handleEditAddressClick(addr)}
                            className="text-[#006D6D] hover:underline"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300 font-normal">|</span>
                          <button
                            onClick={() => handleDeleteAddressClick(addr._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-[13.5px] text-gray-500 font-semibold mt-1.5 leading-relaxed font-sans">
                        {addr.street}, {addr.city}
                      </p>
                      <p className="text-[12px] text-gray-400 font-sans">{addr.phone}</p>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 pt-4">
                    <button 
                      onClick={openAddAddressModal} 
                      className="text-[13.5px] font-bold text-[#006D6D] hover:underline flex items-center gap-1 uppercase tracking-wider font-sans"
                    >
                      <span className="text-[15px] font-bold font-sans">+</span> Add New Address
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

      {/* ══════════════ ADD ADDRESS MODAL ══════════════ */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={closeAddressModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity" 
          />
          
          {/* Modal Content Card */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#006D6D] to-[#005a5a] px-6 py-4 flex items-center justify-between text-white">
              <h3 className="text-[16px] font-bold tracking-tight">
                {editingAddressId ? 'Edit Shipping Address' : 'Add New Shipping Address'}
              </h3>
              <button 
                onClick={closeAddressModal}
                className="text-white/80 hover:text-white text-[18px] leading-none transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {addressError && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-2.5 rounded-lg font-medium">
                {addressError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddAddressSubmit} className="p-6 space-y-4 font-sans text-[13.5px]">
              <div>
                <label className="text-[12.5px] font-semibold text-[#006D6D] mb-1.5 block">Address Label / Name (e.g. Home, Office)<span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Home, Work"
                  value={addressForm.name} 
                  onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                  className="border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 font-sans"
                />
              </div>

              <div>
                <label className="text-[12.5px] font-semibold text-[#006D6D] mb-1.5 block">Street Address / Area<span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Street No, Building Name, Area"
                  value={addressForm.street} 
                  onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                  className="border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12.5px] font-semibold text-[#006D6D] mb-1.5 block">City / Town<span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Delhi, Mumbai"
                    value={addressForm.city} 
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value.replace(/\d/g, '')})}
                    className="border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[12.5px] font-semibold text-[#006D6D] mb-1.5 block">Phone Number<span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    required
                    pattern="[\+]?[0-9\s\-]{7,15}"
                    placeholder="Phone number"
                    value={addressForm.phone} 
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    className="border border-gray-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] font-semibold text-gray-700 font-sans"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 font-sans">
                <button 
                  type="button"
                  onClick={closeAddressModal}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={addressSaving}
                  className="px-5 py-2 bg-[#006D6D] text-white rounded-lg font-semibold hover:bg-[#005a5a] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {addressSaving ? 'Saving...' : (editingAddressId ? 'Update Address' : 'Save Address')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Address Confirmation Modal */}
      {deleteAddressId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-[9999] p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setDeleteAddressId(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity" 
          />
          
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 p-6 font-sans">
            <h3 className="text-[17px] font-bold text-gray-900 mb-2">Delete Address</h3>
            <p className="text-gray-500 text-[13.5px] mb-6 leading-relaxed">
              Are you sure you want to delete this shipping address? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 font-semibold text-[13px]">
              <button
                onClick={() => setDeleteAddressId(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = deleteAddressId;
                  setDeleteAddressId(null);
                  try {
                    const res = await api.delete(`/auth/me/addresses/${id}`)
                    setAddresses(res.data.addresses)
                    if (setUser && res.data.addresses) {
                      setUser(prev => prev ? { ...prev, addresses: res.data.addresses } : prev)
                    }
                    toast.success('Address deleted successfully.')
                  } catch (err) {
                    toast.error(err.response?.data?.error || 'Failed to delete address.')
                  }
                }}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
      {/* ══════════════ CHANGE PASSWORD MODAL ══════════════ */}
      {showPwModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setShowPwModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity"
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#006D6D] to-[#005a5a] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                <h3 className="text-[16px] font-bold tracking-tight">Change Password</h3>
              </div>
              <button
                onClick={() => setShowPwModal(false)}
                className="text-white/70 hover:text-white text-[20px] leading-none transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => { setPwTab('current'); setPwError(''); setPwSuccess('') }}
                className={`flex-1 py-3 text-[13px] font-semibold transition-all ${pwTab === 'current' ? 'text-[#006D6D] border-b-2 border-[#006D6D] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                🔑 Use Current Password
              </button>
              <button
                onClick={() => { setPwTab('email'); setPwError(''); setPwSuccess('') }}
                className={`flex-1 py-3 text-[13px] font-semibold transition-all ${pwTab === 'email' ? 'text-[#006D6D] border-b-2 border-[#006D6D] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ✉️ Reset via Email
              </button>
            </div>

            <div className="p-6">
              {/* Locked-out banner */}
              {pwLockUntil && pwLockUntil > Date.now() && (
                <div className="mb-4 bg-red-50 border border-red-300 text-red-700 text-[13px] px-4 py-3 rounded-lg font-medium flex items-center gap-2">
                  <span>🔒</span>
                  <span>Account locked for <strong>{Math.ceil((pwLockUntil - Date.now()) / 60000)} min</strong>. Too many wrong attempts.</span>
                </div>
              )}
              {/* Feedback messages */}
              {pwError && !pwLockUntil && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-2.5 rounded-lg font-medium flex items-center gap-2">
                  <span>⚠️</span> {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-[13px] px-4 py-2.5 rounded-lg font-medium flex items-center gap-2">
                  <span>✓</span> {pwSuccess}
                </div>
              )}

              {/* TAB: Current Password */}
              {pwTab === 'current' && (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                  <p className="text-[12.5px] text-gray-500 mb-2">Enter your current password to set a new one.</p>
                  <div>
                    <label className="text-[12.5px] font-semibold text-[#006D6D] mb-1.5 block">Current Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPw.current ? 'text' : 'password'}
                        required
                        placeholder="Your current password"
                        value={pwForm.currentPassword}
                        onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                        className="border border-gray-200 rounded-lg px-3.5 py-2.5 pr-10 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] text-gray-700 font-sans"
                      />
                      <button type="button" onClick={() => setShowPw(s => ({ ...s, current: !s.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw.current ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[12.5px] font-semibold text-[#006D6D] mb-1.5 block">New Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPw.new ? 'text' : 'password'}
                        required
                        placeholder="Min. 8 characters"
                        value={pwForm.newPassword}
                        onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                        className="border border-gray-200 rounded-lg px-3.5 py-2.5 pr-10 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] text-gray-700 font-sans"
                      />
                      <button type="button" onClick={() => setShowPw(s => ({ ...s, new: !s.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw.new ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[12.5px] font-semibold text-[#006D6D] mb-1.5 block">Confirm New Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPw.confirm ? 'text' : 'password'}
                        required
                        placeholder="Repeat new password"
                        value={pwForm.confirmPassword}
                        onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                        className="border border-gray-200 rounded-lg px-3.5 py-2.5 pr-10 focus:outline-none focus:border-[#006D6D] w-full text-[13.5px] text-gray-700 font-sans"
                      />
                      <button type="button" onClick={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw.confirm ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowPwModal(false)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all text-[13px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={pwLoading || (pwLockUntil && pwLockUntil > Date.now())}
                      className="px-5 py-2 bg-[#006D6D] text-white rounded-lg font-semibold hover:bg-[#005a5a] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-1.5 text-[13px]"
                    >
                      {pwLoading ? 'Updating...' : pwLockUntil && pwLockUntil > Date.now() ? '🔒 Locked' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB: Email Reset */}
              {pwTab === 'email' && (
                <div className="space-y-4">
                  <div className="bg-[#f0fafa] border border-[#b3d9d9] rounded-xl p-4 text-[13px] text-[#006D6D]">
                    <p className="font-semibold mb-1">Reset via Email</p>
                    <p className="text-gray-600 text-[12.5px] leading-relaxed">
                      We'll send a password reset link to your registered email address:
                    </p>
                    <p className="font-bold text-[#006D6D] mt-1.5 text-[13.5px]">{user?.email}</p>
                  </div>
                  <p className="text-[12px] text-gray-400">The link will be valid for 10 minutes.</p>
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowPwModal(false)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all text-[13px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendResetEmail}
                      disabled={pwLoading || !!pwSuccess}
                      className="px-5 py-2 bg-[#006D6D] text-white rounded-lg font-semibold hover:bg-[#005a5a] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-1.5 text-[13px]"
                    >
                      {pwLoading ? 'Sending...' : pwSuccess ? 'Link Sent ✓' : 'Send Reset Link'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AccountPage
