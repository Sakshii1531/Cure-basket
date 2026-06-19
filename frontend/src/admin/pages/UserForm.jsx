import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, can } = useAuth();
  
  const isEditMode = !!id;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    customRole: '',
    address: '',
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch custom roles if the current admin is superadmin or has roles/users access
    if (currentUser?.role === 'superadmin' || can('roles', 'read') || can('users', 'write')) {
      api.get('/roles')
        .then(res => {
          setRoles(res.data.data);
        })
        .catch(err => {
          console.error('Failed to load custom roles:', err);
        });
    }

    if (isEditMode) {
      api.get(`/users/${id}`)
        .then(res => {
          const u = res.data.data;
          setForm({
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            password: '', // Leave password empty by default on edit
            role: u.role || 'user',
            customRole: u.customRole?._id || u.customRole || '',
            address: u.address || '',
          });
        })
        .catch(err => {
          toast.error(err.response?.data?.error || 'Failed to load user details');
          navigate('/admin/users');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode, currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    
    if (!isEditMode && (!form.password || form.password.length < 8)) {
      errs.password = 'Password must be at least 8 characters';
    } else if (isEditMode && form.password && form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      customRole: form.role === 'admin' ? (form.customRole || null) : null,
      address: form.address,
    };

    // Only send password if provided
    if (form.password) {
      payload.password = form.password;
    }

    try {
      if (isEditMode) {
        await api.put(`/users/${id}`, payload);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', payload);
        toast.success('User created successfully');
      }
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit User' : 'Add User'}</h2>
          <p className="text-gray-500 text-sm">
            {isEditMode ? 'Modify existing user profile and roles.' : 'Create a new user account.'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
              }`}
              required
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
              }`}
              required
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Password {isEditMode ? '(leave blank to keep unchanged)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
              }`}
              required={!isEditMode}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Role *</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="user">User (Customer)</option>
              <option value="admin">Admin (Staff)</option>
              {currentUser?.role === 'superadmin' && (
                <option value="superadmin">Super Admin</option>
              )}
            </select>
          </div>

          {form.role === 'admin' && (currentUser?.role === 'superadmin' || can('roles', 'read') || can('users', 'write')) && (
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Custom Role</label>
              <select
                name="customRole"
                value={form.customRole}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No custom role (Standard Admin)</option>
                {roles.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Primary Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter user's primary address..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
