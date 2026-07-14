import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

// Country dial codes for the phone field. `code` (ISO) is the unique option
// value since several countries share a dial code (e.g. +1 US/CA).
const COUNTRY_CODES = [
  { code: 'IN', flag: '🇮🇳', dial: '+91' },
  { code: 'US', flag: '🇺🇸', dial: '+1' },
  { code: 'GB', flag: '🇬🇧', dial: '+44' },
  { code: 'AE', flag: '🇦🇪', dial: '+971' },
  { code: 'AU', flag: '🇦🇺', dial: '+61' },
  { code: 'CA', flag: '🇨🇦', dial: '+1' },
  { code: 'SG', flag: '🇸🇬', dial: '+65' },
  { code: 'SA', flag: '🇸🇦', dial: '+966' },
  { code: 'BD', flag: '🇧🇩', dial: '+880' },
  { code: 'PK', flag: '🇵🇰', dial: '+92' },
  { code: 'LK', flag: '🇱🇰', dial: '+94' },
  { code: 'NP', flag: '🇳🇵', dial: '+977' },
  { code: 'MY', flag: '🇲🇾', dial: '+60' },
  { code: 'ID', flag: '🇮🇩', dial: '+62' },
  { code: 'ZA', flag: '🇿🇦', dial: '+27' },
  { code: 'NG', flag: '🇳🇬', dial: '+234' },
  { code: 'DE', flag: '🇩🇪', dial: '+49' },
  { code: 'FR', flag: '🇫🇷', dial: '+33' },
  { code: 'IT', flag: '🇮🇹', dial: '+39' },
  { code: 'ES', flag: '🇪🇸', dial: '+34' },
  { code: 'NL', flag: '🇳🇱', dial: '+31' },
  { code: 'BR', flag: '🇧🇷', dial: '+55' },
  { code: 'JP', flag: '🇯🇵', dial: '+81' },
  { code: 'CN', flag: '🇨🇳', dial: '+86' },
  { code: 'NZ', flag: '🇳🇿', dial: '+64' },
]

const SignupPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [country, setCountry] = useState('IN')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)

  const dialCode = (COUNTRY_CODES.find((c) => c.code === country) || COUNTRY_CODES[0]).dial

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    else if (/\d/.test(form.name)) errs.name = 'Full name cannot contain numbers'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    const localDigits = form.phone.replace(/\D/g, '')
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required'
    } else if (localDigits.length !== 10) {
      errs.phone = 'Enter a valid phone number'
    }
    if (!form.password || form.password.length < 8) {
      errs.password = 'Min 8 characters'
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Confirm password is required'
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
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
      const fullPhone = `${dialCode}${form.phone.replace(/\D/g, '')}`
      await register(form.name, form.email, form.password, fullPhone)
      // Opt the user into the newsletter if they left the box checked.
      // Fire-and-forget: a subscribe failure must not block account creation.
      if (subscribeNewsletter) {
        api.post('/subscribers', { email: form.email }).catch(() => { })
      }
      const from = typeof location.state?.from === 'string'
        ? location.state.from
        : (location.state?.from?.pathname || '/')
      navigate(from)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    let { name, value } = e.target
    if (name === 'name') {
      value = value.replace(/\d/g, '')
    } else if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10)
    }
    setForm(f => ({ ...f, [name]: value }))
    setErrors(er => ({ ...er, [name]: '' }))
    setApiError('')
  }

  return (
    <div className="min-h-screen bg-section flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[400px] bg-white rounded-[24px] p-6 md:p-8 border border-border/50">
        <div className="mb-6">
          <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
            <div className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-gray-500 group-hover:text-primary transition-colors">Back</span>
          </Link>

          <h1 className="text-[22px] font-black text-[#014D4E] leading-tight">Create account</h1>
          <p className="text-gray-500 text-[13px] font-medium mt-0.5">Join CureBasket for better healthcare</p>
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
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full border-2 rounded-xl px-4 py-2 text-[13px] font-medium outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
            />
            {errors.name && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full border-2 rounded-xl px-4 py-2 text-[13px] font-medium outline-none transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Phone Number</label>
            <div className={`flex items-stretch border-2 rounded-xl overflow-hidden transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-100 focus-within:border-primary bg-gray-50 focus-within:bg-white'}`}>
              <select
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                aria-label="Country code"
                className="bg-transparent pl-3 pr-2 py-2 text-[13px] font-bold text-gray-700 outline-none border-r-2 border-gray-100 cursor-pointer"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
                ))}
              </select>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={handleChange}
                placeholder="800 000 0000"
                className="flex-1 bg-transparent px-3 py-2 text-[13px] font-medium outline-none"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full border-2 rounded-xl pl-4 pr-12 py-2 text-[13px] font-medium outline-none transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 cursor-pointer"
                tabIndex={-1}
                aria-label="Toggle password visibility"
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
            </div>
            {errors.password && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.password}</p>}
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Confirm Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full border-2 rounded-xl pl-4 pr-12 py-2 text-[13px] font-medium outline-none transition-all ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 cursor-pointer"
                tabIndex={-1}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
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
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.confirmPassword}</p>}
          </div>


          <div className="flex items-start gap-2 mt-1">
            <input
              type="checkbox"
              id="subscribe-newsletter"
              checked={subscribeNewsletter}
              onChange={(e) => setSubscribeNewsletter(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="subscribe-newsletter" className="text-[12px] font-medium text-gray-600 cursor-pointer select-none leading-snug">
              Subscribe to our newsletter for health tips, exclusive discounts &amp; new product updates.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl text-[14px] mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="pt-4 mt-4 border-t border-gray-300 text-center -mx-6 md:-mx-8">
            <p className="text-gray-500 text-[13px] font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
            </p>
          </div>
        </form>
      </div>

      <p className="mt-6 text-center text-[11px] text-gray-400 font-medium">
        By creating an account, you agree to our{' '}
        <Link to="/terms-conditions" className="text-primary font-bold hover:underline">Terms</Link> &{' '}
        <Link to="/privacy-policy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
      </p>
    </div>
  )
}

export default SignupPage
