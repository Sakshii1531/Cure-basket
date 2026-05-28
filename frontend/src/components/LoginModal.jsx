import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, register, pendingIntent, clearIntent } = useAuth()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', otp: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPhase, setForgotPhase] = useState(1)

  useEffect(() => {
    if (!isLoginModalOpen) {
      setForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', otp: '' })
      setErrors({})
      setApiError('')
      setLoading(false)
      setSuccess(false)
      setShowPassword(false)
      setTab('login')
      setForgotPhase(1)
    }
  }, [isLoginModalOpen])

  useEffect(() => {
    setErrors({})
    setApiError('')
    setShowPassword(false)
    setForgotPhase(1)
  }, [tab])

  if (!isLoginModalOpen) return null

  const validate = () => {
    const errs = {}
    if (tab === 'signup' && !form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters'
    if (tab === 'signup') {
      if (!form.confirmPassword) {
        errs.confirmPassword = 'Confirm password is required'
      } else if (form.password !== form.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError('')
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password, form.phone)
      }
      setSuccess(true)
      if (pendingIntent) {
        const { fn, args } = pendingIntent
        clearIntent()
        setTimeout(() => fn(...(args || [])), 300)
      }
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setApiError('')
    try {
      await api.post('/auth/forgot-password-otp', { email: form.email })
      setForgotPhase(2)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.otp || form.otp.length !== 6) errs.otp = 'Enter a 6-digit OTP'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setApiError('')
    try {
      await api.post('/auth/verify-otp', { email: form.email, otp: form.otp })
      setForgotPhase(3)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters'
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Confirm password is required'
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setApiError('')
    try {
      await api.post('/auth/reset-password-otp', {
        email: form.email,
        otp: form.otp,
        password: form.password
      })
      setForgotPhase(4)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
    setApiError('')
  }

  return (
    <div className="fixed inset-0 z-[1100] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsLoginModalOpen(false)}
      />

      <div className="relative w-full md:max-w-[420px] bg-white rounded-t-[32px] md:rounded-[32px] px-6 pt-5 pb-8 md:p-8 shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95 duration-300">
        <div className="md:hidden w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 md:top-5 md:right-5 p-1.5 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-[#E6F7F7] rounded-full flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[#006D6D] uppercase tracking-wider">CureBasket</span>
          </div>
          <h2 className="text-[22px] md:text-[24px] font-black text-gray-900 leading-tight">
            {tab === 'login' ? 'Welcome back' : tab === 'signup' ? 'Create account' : 'Reset Password'}
          </h2>
          <p className="text-gray-500 text-[13px] font-medium mt-1">
            {tab === 'login'
              ? 'Login to continue your order'
              : tab === 'signup'
              ? 'Sign up to start shopping'
              : 'Follow the steps to recover your account'}
          </p>
        </div>

        {tab !== 'forgot' && (
          <div className="flex bg-gray-100 rounded-xl p-1 mb-5 gap-1">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === 'login' ? 'bg-white text-[#006D6D] shadow-sm' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === 'signup' ? 'bg-white text-[#006D6D] shadow-sm' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[18px] font-black text-gray-900">You're in!</h3>
            <p className="text-gray-500 text-[13px] mt-1">Welcome to CureBasket</p>
          </div>
        ) : tab === 'forgot' ? (
          <div className="space-y-4">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] font-medium px-3 py-2 rounded-xl">
                {apiError}
              </div>
            )}

            {forgotPhase === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] font-medium outline-none transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#006D6D] text-white font-bold py-3.5 rounded-xl text-[14px] mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#006D6D]/20 hover:bg-[#005a5a] transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  <button type="button" onClick={() => setTab('login')} className="font-semibold text-[#006D6D] hover:underline">
                    Back to Login
                  </button>
                </p>
              </form>
            )}

            {forgotPhase === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Enter OTP</label>
                  <input
                    name="otp"
                    type="text"
                    maxLength="6"
                    value={form.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] font-medium outline-none transition-colors ${errors.otp ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
                  />
                  {errors.otp && <p className="text-red-500 text-[11px] mt-1">{errors.otp}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#006D6D] text-white font-bold py-3.5 rounded-xl text-[14px] mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#006D6D]/20 hover:bg-[#005a5a] transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-4 flex justify-between px-2">
                  <button type="button" onClick={() => setForgotPhase(1)} className="font-semibold text-[#006D6D] hover:underline">
                    Back
                  </button>
                  <button type="button" onClick={() => setTab('login')} className="font-semibold text-gray-500 hover:underline">
                    Cancel
                  </button>
                </p>
              </form>
            )}

            {forgotPhase === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">New Password</label>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] font-medium outline-none transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
                  />
                  {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] font-medium outline-none transition-colors ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="show-forgot-passwords"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#006D6D] focus:ring-[#006D6D] cursor-pointer"
                  />
                  <label htmlFor="show-forgot-passwords" className="text-[12px] font-bold text-gray-600 cursor-pointer select-none">
                    Show Password
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#006D6D] text-white font-bold py-3.5 rounded-xl text-[14px] mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#006D6D]/20 hover:bg-[#005a5a] transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            {forgotPhase === 4 && (
              <div className="py-6 text-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-black text-gray-900">Success!</h3>
                <p className="text-gray-500 text-[13px] mt-1">Your password is successfully changed.</p>
                
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setForgotPhase(1);
                  }}
                  className="w-full bg-[#006D6D] text-white font-bold py-3.5 rounded-xl text-[14px] mt-6 flex items-center justify-center gap-2 shadow-lg shadow-[#006D6D]/20 hover:bg-[#005a5a] transition-all active:scale-[0.98]"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] font-medium px-3 py-2 rounded-xl">
                {apiError}
              </div>
            )}

            {tab === 'signup' && (
              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] font-medium outline-none transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
                />
                {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] font-medium outline-none transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
            </div>

            {tab === 'signup' && (
              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Phone (optional)</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 800 000 0000"
                  className="w-full border-2 border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-[14px] font-medium outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Password</label>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] font-medium outline-none transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
              />
              {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
            </div>

            {tab === 'signup' && (
              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-[14px] font-medium outline-none transition-colors ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-modal-passwords"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#006D6D] focus:ring-[#006D6D] cursor-pointer"
                />
                <label htmlFor="show-modal-passwords" className="text-[12px] font-bold text-gray-600 cursor-pointer select-none">
                  Show Password
                </label>
              </div>
              {tab === 'login' && (
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-[12px] font-bold text-[#006D6D] hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006D6D] text-white font-bold py-3.5 rounded-xl text-[14px] mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#006D6D]/20 hover:bg-[#005a5a] transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {tab === 'login' ? 'Logging in...' : 'Creating account...'}
                </>
              ) : tab === 'login' ? 'Login to CureBasket' : 'Create Account'}
            </button>

            <p className="text-center text-[11px] text-gray-400 font-medium mt-3 pb-1">
              By continuing, you agree to our{' '}
              <span className="text-[#006D6D] font-bold cursor-pointer">Terms</span> &{' '}
              <span className="text-[#006D6D] font-bold cursor-pointer">Privacy Policy</span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginModal
