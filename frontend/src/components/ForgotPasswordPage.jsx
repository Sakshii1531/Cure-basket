import { toast } from 'sonner';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-6">
            <span className="text-2xl font-extrabold text-primary">CureBasket</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email and we'll send a reset link.</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold">Check your inbox</p>
            <p className="text-gray-500 text-sm">
              If an account exists for <strong>{email}</strong>, a reset link has been sent. It expires in 10 minutes.
            </p>
            <Link to="/login" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              <Link to="/login" className="font-semibold text-primary hover:underline">Back to Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
