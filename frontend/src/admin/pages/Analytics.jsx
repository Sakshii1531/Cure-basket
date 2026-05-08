import React, { useState, useEffect } from 'react';

function Analytics() {
  const [orders] = useState(() => {
    const saved = localStorage.getItem('cb_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const totalRevenue = orders.reduce((acc, order) => {
    const amount = parseFloat(order.total.replace('$', ''));
    return acc + amount;
  }, 0);

  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
        <p className="text-gray-500 text-sm">View your store's sales performance and data.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toFixed(2)}</h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Avg. Order Value</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">${avgOrderValue.toFixed(2)}</h3>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Sales Overview</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-400 text-sm">Chart will appear here when more data is available.</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
