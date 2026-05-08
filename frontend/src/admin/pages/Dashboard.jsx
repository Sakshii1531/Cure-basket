import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const stats = [
    { name: 'Total Medicines', value: '1,234', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1H9L8 4zm.5 5h7L15 10H9l-.5-1zm.5 5h7l-1 1H10l-.5-1z', color: 'bg-teal-500' },
    { name: 'Total Categories', value: '12', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', color: 'bg-blue-500' },
    { name: 'Total Orders', value: '856', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'bg-amber-500' },
    { name: 'Total Revenue', value: '$45,231', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-emerald-500' },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', status: 'Delivered', amount: '$120.00', date: '2026-05-08' },
    { id: '#ORD-002', customer: 'Jane Smith', status: 'Processing', amount: '$45.50', date: '2026-05-08' },
    { id: '#ORD-003', customer: 'Bob Johnson', status: 'Shipped', amount: '$89.99', date: '2026-05-07' },
    { id: '#ORD-004', customer: 'Alice Brown', status: 'Pending', amount: '$210.00', date: '2026-05-07' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, Admin!</h2>
        <p className="text-gray-500 text-sm">Here's what's happening with your pharmacy today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 max-w-[240px]">
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[#006D6D] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-sm text-gray-700">
                    <td className="py-4 font-semibold text-gray-900">{order.id}</td>
                    <td className="py-4">{order.customer}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === 'Processing' ? 'bg-amber-50 text-amber-600' :
                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-gray-900">{order.amount}</td>
                    <td className="py-4 text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-[#E6F7F7] text-[#006D6D] px-4 py-3 rounded-xl font-semibold text-sm hover:bg-[#CFF4F4] transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Medicine
              </button>
              <button className="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Export Reports
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
             <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-500">Stock Alerts</span>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">3 Low</span>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-gray-700">Paracetamol 500mg</span>
                   <span className="font-bold text-red-500">5 left</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-gray-700">Amoxicillin</span>
                   <span className="font-bold text-red-500">2 left</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
