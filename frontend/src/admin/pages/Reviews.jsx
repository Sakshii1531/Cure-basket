import React, { useState, useEffect } from 'react';

function Reviews() {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('cb_reviews');
    const defaultReviews = [
      { id: 1, user: 'John Doe', rating: 5, comment: 'Great service and fast delivery!', status: 'Approved', date: '2026-05-01' },
      { id: 2, user: 'Jane Smith', rating: 4, comment: 'Good products but delivery was a bit slow.', status: 'Pending', date: '2026-05-02' },
    ];
    return saved ? JSON.parse(saved) : defaultReviews;
  });

  useEffect(() => {
    localStorage.setItem('cb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleStatusChange = (id, status) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reviews & Testimonials</h2>
        <p className="text-gray-500 text-sm">Manage user reviews and testimonials.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Comment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reviews.map((review) => (
              <tr key={review.id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">{review.user}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-md truncate">{review.comment}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    review.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                    review.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select 
                      value={review.status}
                      onChange={(e) => handleStatusChange(review.id, e.target.value)}
                      className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approve</option>
                      <option value="Rejected">Reject</option>
                    </select>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    >
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
    </div>
  );
}

export default Reviews;
