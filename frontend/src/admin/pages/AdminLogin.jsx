import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn, authLoading, user } = useAuth();

  // Redirect already-authenticated admins straight to the dashboard
  if (!authLoading && isLoggedIn && (user?.role === 'admin' || user?.role === 'superadmin')) {
    return <Navigate to="/admin" replace />;
  }

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    try {
      const user = await login(form.email, form.password);

      if (user.role !== 'admin' && user.role !== 'superadmin') {
        setApiError('You do not have admin access.');
        return;
      }

      navigate('/admin');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
    setApiError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-100 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-bold text-primary uppercase tracking-wider">CureBasket</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Admin Portal</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Login to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] font-medium px-3 py-2.5 rounded-xl flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {apiError}
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 block">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@curebasket.com"
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
            />
            {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
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
                style={{ textTransform: 'none' }}
                className={`w-full border-2 rounded-xl pl-4 pr-12 py-3 text-sm font-medium outline-none transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-sm mt-2 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-70"
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
  );
};

export default AdminLogin;
