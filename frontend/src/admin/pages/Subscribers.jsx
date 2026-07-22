import React, { useState, useEffect } from 'react';
import { SkeletonTable } from '../components/Skeleton';
import { toast } from 'sonner';
import api from '../../utils/api';

function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'subscribed' | 'unsubscribed'

  const fetchSubscribers = () => {
    setLoading(true);
    api.get('/subscribers')
      .then(res => {
        setSubscribers(res.data.data);
        setError('');
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load subscribers');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleToggleStatus = async (subscriber) => {
    const isSubscribed = subscriber.status === 'subscribed';
    try {
      if (isSubscribed) {
        // Unsubscribe
        const res = await api.post('/subscribers/unsubscribe', { email: subscriber.email });
        setSubscribers(prev => prev.map(s => s._id === subscriber._id ? { ...s, status: 'unsubscribed' } : s));
        toast.success(res.data.message || 'Subscriber unsubscribed');
      } else {
        // Subscribe/Resubscribe
        const res = await api.post('/subscribers', { email: subscriber.email });
        setSubscribers(prev => prev.map(s => s._id === subscriber._id ? { ...s, status: 'subscribed' } : s));
        toast.success(res.data.message || 'Subscriber resubscribed');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update subscription status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscriber? This will permanently remove their records.')) {
      return;
    }
    try {
      await api.delete(`/subscribers/${id}`);
      setSubscribers(prev => prev.filter(s => s._id !== id));
      toast.success('Subscriber deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete subscriber');
    }
  };

  // Filter & Search Logic
  const filteredSubscribers = subscribers.filter(s => {
    const matchesSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalCount = subscribers.length;
  const activeCount = subscribers.filter(s => s.status === 'subscribed').length;
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h2>
          <p className="text-gray-500 text-sm">Monitor user email subscriptions and newsletter opt-outs.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Emails</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{loading ? '...' : totalCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Subscribers</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{loading ? '...' : activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-gray-400">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Unsubscribed</p>
          <p className="text-2xl font-black text-gray-500 mt-1">{loading ? '...' : unsubscribedCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Status Filter buttons */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {['all', 'subscribed', 'unsubscribed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <SkeletonTable />
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4 w-12">S.No.</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Date Subscribed</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSubscribers.map((sub, idx) => (
                <tr key={sub._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-semibold text-xs">#{idx + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{sub.email}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(sub.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      sub.status === 'subscribed'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      
                      {/* Unsubscribe / Re-subscribe button */}
                      <button
                        onClick={() => handleToggleStatus(sub)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                          sub.status === 'subscribed'
                            ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {sub.status === 'subscribed' ? 'Unsubscribe' : 'Subscribe'}
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete record"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm">
                    No subscribers found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default Subscribers;
