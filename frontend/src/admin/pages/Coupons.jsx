import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const EMPTY = { code: '', discountType: 'percent', value: '', minOrder: 0, maxDiscount: '', usageLimit: '', expiresAt: '', isActive: true };

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    api.get('/coupons')
      .then(res => setCoupons(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load coupons'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setCurrent({
        ...coupon,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
        maxDiscount: coupon.maxDiscount ?? '',
        usageLimit: coupon.usageLimit ?? '',
      });
    } else {
      setCurrent({ ...EMPTY });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      code: current.code.toUpperCase(),
      discountType: current.discountType,
      value: Number(current.value),
      minOrder: Number(current.minOrder) || 0,
      maxDiscount: current.maxDiscount !== '' ? Number(current.maxDiscount) : null,
      usageLimit: current.usageLimit !== '' ? Number(current.usageLimit) : null,
      expiresAt: current.expiresAt || null,
      isActive: current.isActive,
    };
    try {
      if (current._id) {
        const res = await api.put(`/coupons/${current._id}`, payload);
        setCoupons(prev => prev.map(c => c._id === current._id ? res.data.data : c));
      } else {
        const res = await api.post('/coupons', payload);
        setCoupons(prev => [...prev, res.data.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const fmt = (c) => c.discountType === 'percent' ? `${c.value}%` : `₹${c.value}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Coupons & Offers</h2>
          <p className="text-gray-500 text-sm">Manage discount coupons and promotional offers.</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#006D6D] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005c5c] transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Coupon
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Loading...</div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium mb-4">No coupons created yet.</p>
            <button onClick={() => openModal()} className="bg-[#006D6D] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005c5c]">Create Coupon</button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min Order</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Expires</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((c) => (
                <tr key={c._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 font-mono">{c.code}</td>
                  <td className="px-6 py-4 font-semibold">{fmt(c)}{c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''}</td>
                  <td className="px-6 py-4">₹{c.minOrder}</td>
                  <td className="px-6 py-4">{c.usedCount}/{c.usageLimit ?? '∞'}</td>
                  <td className="px-6 py-4">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(c)} className="p-1.5 text-gray-400 hover:text-[#006D6D] rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.128-1.897l8.934-8.934Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(c._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && current && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{current._id ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Coupon Code</label>
                <input type="text" value={current.code} onChange={e => setCurrent({...current, code: e.target.value.toUpperCase()})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] font-mono" placeholder="WELCOME10" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Discount Type</label>
                  <select value={current.discountType} onChange={e => setCurrent({...current, discountType: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]">
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Value</label>
                  <input type="number" min="0" step="0.01" value={current.value} onChange={e => setCurrent({...current, value: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Min Order (₹)</label>
                  <input type="number" min="0" value={current.minOrder} onChange={e => setCurrent({...current, minOrder: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Max Discount (₹) <span className="text-gray-400 font-normal">optional</span></label>
                  <input type="number" min="0" value={current.maxDiscount} onChange={e => setCurrent({...current, maxDiscount: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" placeholder="No cap" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Usage Limit <span className="text-gray-400 font-normal">optional</span></label>
                  <input type="number" min="1" value={current.usageLimit} onChange={e => setCurrent({...current, usageLimit: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" placeholder="Unlimited" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Expiry Date <span className="text-gray-400 font-normal">optional</span></label>
                  <input type="date" value={current.expiresAt} onChange={e => setCurrent({...current, expiresAt: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={current.isActive} onChange={e => setCurrent({...current, isActive: e.target.checked})} className="w-4 h-4 rounded border-gray-300" />
                Active
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coupons;
