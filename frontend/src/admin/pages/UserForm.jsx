import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import CountryFlag from '../components/CountryFlag';
import { COUNTRY_CODES } from '../components/CountrySelect';

const parsePhone = (fullPhone) => {
  if (!fullPhone) return { countryCode: '+91', number: '' };
  const clean = fullPhone.trim().replace(/\s+/g, '');
  const match = clean.match(/^(\+\d+)(\d{10})$/);
  if (match) {
    return { countryCode: match[1], number: match[2] };
  }
  return { countryCode: '+91', number: clean };
};

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
    confirmPassword: '',
    role: 'user',
    customRole: '',
    address: '',
  });

  const [phoneCountry, setPhoneCountry] = useState('IN');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          const parsed = parsePhone(u.phone);
          const matchedCountry = COUNTRY_CODES.find(c => c.dial === parsed.countryCode) || COUNTRY_CODES.find(c => c.code === 'IN');
          setPhoneCountry(matchedCountry ? matchedCountry.code : 'IN');
          setForm({
            name: u.name || '',
            email: u.email || '',
            phone: parsed.number || '',
            password: '', // Leave password empty by default on edit
            confirmPassword: '',
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
    let value = e.target.value;
    if (e.target.name === 'name') {
      value = value.replace(/[0-9]/g, '');
    } else if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setForm({ ...form, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    
    if (form.phone && form.phone.length !== 10) {
      errs.phone = 'Phone number must be exactly 10 digits';
    }

    if (!isEditMode && (!form.password || form.password.length < 8)) {
      errs.password = 'Password must be at least 8 characters';
    } else if (isEditMode && form.password && form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (!isEditMode || form.password) {
      if (form.password !== form.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    const phoneDial = (COUNTRY_CODES.find(c => c.code === phoneCountry) || COUNTRY_CODES[0]).dial;
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone ? `${phoneDial} ${form.phone}` : '',
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
        navigate(`/admin/users/${id}`);
      } else {
        await api.post('/users', payload);
        toast.success('User created successfully');
        navigate('/admin/users');
      }
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
            <div className="relative flex items-center">
              {/* Country code selector overlay */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-gray-200 pr-2 h-5 select-none pointer-events-none z-10">
                <CountryFlag countryCode={phoneCountry} size="16px" />
                <span className="text-xs text-gray-500 font-bold">
                  {(COUNTRY_CODES.find(c => c.code === phoneCountry) || COUNTRY_CODES[0]).dial}
                </span>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <select
                value={phoneCountry}
                onChange={(e) => setPhoneCountry(e.target.value)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-transparent font-semibold bg-transparent focus:outline-none pr-1.5 h-5 cursor-pointer w-[80px] opacity-0 z-20"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code} className="text-gray-900 bg-white">
                    {c.dial} ({c.code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                className={`w-full bg-gray-50 border rounded-lg pl-[92px] pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Password {isEditMode ? '(leave blank to keep unchanged)' : '*'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-gray-50 border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                }`}
                required={!isEditMode}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Confirm Password {isEditMode ? '(leave blank to keep unchanged)' : '*'}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-gray-50 border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                }`}
                required={!isEditMode && !!form.password}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {isEditMode && (
            <>
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
            </>
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
