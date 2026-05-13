import React, { useState, useEffect } from 'react';

function OrderShipping() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('cb_order_shipping');
    const defaultData = {
      minOrderAmount: '500',
      shippingCharges: '50',
      freeShippingThreshold: '1000',
      shippingPolicy: 'We deliver within 3-5 business days. Remote areas may take longer.'
    };
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem('cb_order_shipping', JSON.stringify(data));
  }, [data]);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Order & Shipping details updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Order & Shipping Details</h2>
        <p className="text-gray-500 text-sm">Manage order limits, shipping charges, and policies.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Min Order Amount (₹)</label>
              <input 
                type="number"
                value={data.minOrderAmount}
                onChange={(e) => setData({...data, minOrderAmount: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Shipping Charges (₹)</label>
              <input 
                type="number"
                value={data.shippingCharges}
                onChange={(e) => setData({...data, shippingCharges: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Free Shipping Above (₹)</label>
              <input 
                type="number"
                value={data.freeShippingThreshold}
                onChange={(e) => setData({...data, freeShippingThreshold: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Shipping Policy</label>
            <textarea 
              value={data.shippingPolicy}
              onChange={(e) => setData({...data, shippingPolicy: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              rows="5"
            ></textarea>
          </div>

          <div>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderShipping;
