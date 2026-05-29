import React, { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = useCallback(() => setShowPassword(v => !v), [])

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password || form.password.length < 8) errs.password = 'Min 8 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError('')
    try {
      await login(form.email, form.password)
      const from = typeof location.state?.from === 'string'
        ? location.state.from
        : (location.state?.from?.pathname || '/account')
      navigate(from)
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
    <div className="min-h-screen bg-section flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[380px] bg-white rounded-[24px] p-6 md:p-8 border border-border/50">
        <div className="mb-6">
          <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
            <div className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-gray-500 group-hover:text-primary transition-colors">Back</span>
          </Link>

          <h1 className="text-[22px] font-black text-[#014D4E] leading-tight">Welcome back</h1>
          <p className="text-gray-500 text-[13px] font-medium mt-0.5">Login to access your orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] font-medium px-3 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {apiError}
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Email Address</label>
            <div className="relative">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full border-2 rounded-xl px-4 py-2 text-[13px] font-medium outline-none transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
              />
              {errors.email && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium flex items-center gap-1">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-0.5">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-primary hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full border-2 rounded-xl px-4 pr-10 py-2 text-[13px] font-medium outline-none transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-[10px] mt-0.5 font-medium flex items-center gap-1">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl text-[14px] mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="pt-4 mt-4 border-t border-gray-300 text-center -mx-6 md:-mx-8">
            <p className="text-gray-500 text-[13px] font-medium">
              New here?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">Create account</Link>
            </p>
          </div>
        </form>
      </div>
      
      <p className="mt-6 text-center text-[11px] text-gray-400 font-medium">
        By continuing, you agree to our{' '}
        <Link to="/terms-conditions" className="text-primary font-bold hover:underline">Terms</Link> &{' '}
        <Link to="/privacy-policy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
      </p>
    </div>
  )
}

export default LoginPage
