import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchReviews = (status = '') => {
    setLoading(true);
    const params = status ? `?status=${status}` : '';
    api.get(`/reviews${params}`)
      .then(res => setReviews(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    fetchReviews(status);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/reviews/${id}/status`, { status });
      setReviews(prev => prev.map(r => r._id === id ? res.data.data : r));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews & Testimonials</h2>
          <p className="text-gray-500 text-sm">Manage user reviews and testimonials.</p>
        </div>
        <div className="flex gap-2">
          {['', 'pending', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${statusFilter === s ? 'bg-[#006D6D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Medicine</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map((review) => (
                <tr key={review._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{review.user?.name || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{review.medicine?.name || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{review.comment}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      review.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                      review.status === 'rejected' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={review.status}
                        onChange={(e) => handleStatusChange(review._id, e.target.value)}
                        className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                      <button onClick={() => handleDelete(review._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400 text-sm">No reviews found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Reviews;
