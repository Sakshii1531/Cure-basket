import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      if (form.email === 'admin123@gmail.com' && form.password === 'admin123') {
        localStorage.setItem('isAdminLoggedIn', 'true')
        navigate('/admin')
      } else {
        setErrors({ email: 'Invalid credentials' })
      }
    }, 1200)
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[400px] bg-white rounded-[24px] p-8 shadow-xl border border-gray-100">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#E6F7F7] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#006D6D] uppercase tracking-wider">CureBasket</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Admin Portal</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Login to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@curebasket.com"
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
            />
            {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-[#006D6D] bg-gray-50 focus:bg-white'}`}
            />
            {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006D6D] text-white font-bold py-3.5 rounded-xl text-sm mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#006D6D]/20 hover:bg-[#005a5a] transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </>
            ) : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
