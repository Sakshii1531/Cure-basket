import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SignupPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError('')
    try {
      await register(form.name, form.email, form.password, form.phone)
      navigate('/account')
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
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Phone (Optional)</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 800 000 0000"
              className="w-full border-2 border-gray-100 focus:border-primary bg-gray-50 focus:bg-white rounded-xl px-4 py-2 text-[13px] font-medium outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className={`w-full border-2 rounded-xl px-4 py-2 text-[13px] font-medium outline-none transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
            />
            {errors.password && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.password}</p>}
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
        <span className="text-primary font-bold cursor-pointer">Terms</span> &{' '}
        <span className="text-primary font-bold cursor-pointer">Privacy</span>
      </p>
    </div>
  )
}

export default SignupPage
