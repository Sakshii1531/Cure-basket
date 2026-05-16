import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

function StatCard({ name, value, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-100 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">{name}</p>
        </>
      )}
    </div>
  );
}

const STATUS_COLORS = {
  Delivered: 'bg-emerald-50 text-emerald-600',
  Processing: 'bg-amber-50 text-amber-600',
  Shipped: 'bg-blue-50 text-blue-600',
  Pending: 'bg-gray-50 text-gray-600',
  Cancelled: 'bg-red-50 text-red-600',
};

function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics/summary')
      .then(res => setSummary(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const stats = summary ? [
    { name: 'Total Orders', value: summary.orders.total.toLocaleString() },
    { name: 'Orders This Month', value: summary.orders.thisMonth.toLocaleString() },
    { name: 'Revenue This Month', value: `₹${summary.revenue.thisMonth.toLocaleString()}` },
    { name: 'Total Users', value: summary.users.total.toLocaleString() },
    { name: 'Total Medicines', value: summary.medicines.total.toLocaleString() },
    { name: 'Pending Prescriptions', value: summary.prescriptions.pending.toLocaleString() },
  ] : Array(6).fill({ name: '', value: '' });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Admin'}!</h2>
        <p className="text-gray-500 text-sm">Here's what's happening with your pharmacy today.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} name={stat.name} value={stat.value} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[#006D6D] text-sm font-semibold hover:underline">View All</Link>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-50 rounded" />)}
            </div>
          ) : summary?.recentOrders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {summary.recentOrders.map((order) => (
                    <tr key={order._id} className="text-sm text-gray-700">
                      <td className="py-4 font-semibold text-gray-900">{order.user?.name || 'Unknown'}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                      <td className="py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No orders yet.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/admin/medicines"
                className="w-full bg-[#E6F7F7] text-[#006D6D] px-4 py-3 rounded-xl font-semibold text-sm hover:bg-[#CFF4F4] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Medicine
              </Link>
              <Link
                to="/admin/prescriptions"
                className="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Prescriptions {summary?.prescriptions?.pending > 0 && `(${summary.prescriptions.pending} pending)`}
              </Link>
            </div>
          </div>

          {summary && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-500">Orders by Status</span>
              </div>
              <div className="space-y-2">
                {Object.entries(summary.orders.byStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex justify-between text-xs">
                    <span className="text-gray-700">{status}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
