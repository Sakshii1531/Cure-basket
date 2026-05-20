import { toast } from 'sonner';
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired link. Please request a new one.');
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
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">Choose a new password for your account.</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">New Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="Min. 8 characters"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              placeholder="Repeat new password"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="font-semibold text-primary hover:underline">Back to Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
