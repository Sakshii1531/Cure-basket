import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../utils/api';

const STATUS_COLORS = {
  Delivered: 'bg-emerald-50 text-emerald-600',
  Shipped: 'bg-blue-50 text-blue-600',
  Cancelled: 'bg-red-50 text-red-600',
  Processing: 'bg-amber-50 text-amber-600',
  Pending: 'bg-gray-50 text-gray-600',
};

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch User Details
    api.get(`/users/${id}`)
      .then(res => {
        setUser(res.data.data);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load user details');
        toast.error('Failed to load user details');
      })
      .finally(() => setLoading(false));

    // Fetch User Orders
    api.get(`/orders?user=${id}&limit=100`)
      .then(res => {
        setOrders(res.data.data);
      })
      .catch(err => {
        console.error('Failed to load user orders:', err);
      })
      .finally(() => setOrdersLoading(false));
  }, [id]);

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

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
        {error || 'User not found.'}
      </div>
    );
  }

  const isLocked = user.lockUntil && new Date(user.lockUntil) > new Date();

  return (
    <div className="space-y-6">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/users')}
            className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <p className="text-gray-500 text-sm">View detailed user profile and metrics.</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/admin/users/${user._id}/edit`)}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.128-1.897l8.934-8.934Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Edit User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
          <div className="text-center pb-4 border-b border-gray-100">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-2xl uppercase mx-auto mb-3 border border-primary/20">
              {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-3 flex justify-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                user.role === 'superadmin' ? 'bg-purple-50 text-purple-600' :
                user.role === 'admin' ? 'bg-blue-50 text-blue-600' :
                'bg-gray-50 text-gray-600'
              }`}>
                {user.role}
              </span>
              {user.customRole?.name && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                  {user.customRole.name}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Info</h4>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-gray-500 font-medium">Phone:</span>
              <span className="text-gray-900 font-semibold">{user.phone || '—'}</span>
              <span className="text-gray-500 font-medium">Legacy Address:</span>
              <span className="text-gray-900 font-semibold">{user.address || '—'}</span>
              <span className="text-gray-500 font-medium">Joined:</span>
              <span className="text-gray-900 font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security State</h4>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-gray-500 font-medium">Failed Attempts:</span>
              <span className="text-gray-900 font-semibold">{user.loginAttempts ?? 0}</span>
              <span className="text-gray-500 font-medium">Lockout Status:</span>
              <span className={`font-semibold ${isLocked ? 'text-red-600' : 'text-emerald-600'}`}>
                {isLocked ? `Locked until ${new Date(user.lockUntil).toLocaleTimeString()}` : 'Unlocked / Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Addresses list and Order history */}
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Addresses */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Addresses</h3>
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div key={addr._id || idx} className="bg-gray-50 rounded-xl p-4 border border-gray-150 relative space-y-1">
                    <span className="absolute top-3 right-3 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">
                      {addr.name}
                    </span>
                    <p className="text-sm font-bold text-gray-900 pt-1">{addr.name}</p>
                    <p className="text-xs text-gray-600">{addr.street}, {addr.city}</p>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-2">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {addr.phone}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No saved addresses.</p>
            )}
          </div>

          {/* Order History */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order History</h3>
            {ordersLoading ? (
              <div className="flex justify-center items-center py-10">
                <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-primary font-mono text-xs">
                          {ord._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">
                          ${ord.totalAmount}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                            ord.paymentStatus === 'Failed' ? 'bg-red-50 text-red-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            STATUS_COLORS[ord.status] || 'bg-gray-50 text-gray-600'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No orders placed by this user yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
