import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DEFAULT_DATA = {
  minOrderAmount: '500',
  shippingCharges: '50',
  freeShippingThreshold: '1000',
  shippingPolicy: 'We deliver within 3-5 business days. Remote areas may take longer.'
};

function OrderShipping() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get('/settings/order_shipping')
      .then(res => { if (res.data.data) setData(res.data.data); })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings/order_shipping', data);
      setToast('Order & Shipping details updated successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch {
      setToast('Failed to save. Please try again.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Order & Shipping Details</h2>
        <p className="text-gray-500 text-sm">Manage order limits, shipping charges, and policies.</p>
      </div>

      {toast && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${toast.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {toast}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                value={data.minOrderAmount}
                onChange={(e) => setData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Shipping Charges (₹)</label>
              <input
                type="number"
                value={data.shippingCharges}
                onChange={(e) => setData(prev => ({ ...prev, shippingCharges: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Free Shipping Above (₹)</label>
              <input
                type="number"
                value={data.freeShippingThreshold}
                onChange={(e) => setData(prev => ({ ...prev, freeShippingThreshold: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Shipping Policy</label>
            <textarea
              value={data.shippingPolicy}
              onChange={(e) => setData(prev => ({ ...prev, shippingPolicy: e.target.value }))}
              className={inputClass}
              rows="5"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderShipping;
