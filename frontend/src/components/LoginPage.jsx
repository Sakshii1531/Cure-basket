import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
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
      await login(form.email, form.password)
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
              <button type="button" className="text-[11px] font-bold text-primary hover:underline">Forgot?</button>
            </div>
            <div className="relative">
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full border-2 rounded-xl px-4 py-2 text-[13px] font-medium outline-none transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
              />
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
            {loading ? 'Logging in...' : 'Login to CureBasket'}
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
        <span className="text-primary font-bold cursor-pointer">Terms</span> &{' '}
        <span className="text-primary font-bold cursor-pointer">Privacy</span>
      </p>
    </div>
  )
}

export default LoginPage
