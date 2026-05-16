import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const STATUS_COLORS = {
  Pending: 'bg-amber-50 text-amber-600',
  Reviewed: 'bg-blue-50 text-blue-600',
  Dispensed: 'bg-emerald-50 text-emerald-600',
  Rejected: 'bg-red-50 text-red-600',
};

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api.get('/prescriptions')
      .then(res => setPrescriptions(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load prescriptions'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/prescriptions/${id}/status`, { status });
      setPrescriptions(prev => prev.map(p => p._id === id ? res.data.data : p));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `http://localhost:5001${path}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
        <p className="text-gray-500 text-sm">Review and manage user uploaded prescriptions.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Loading...</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-sm font-medium">No prescriptions uploaded yet.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Pkg/Qty</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {prescriptions.map((rx) => (
                  <tr key={rx._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{new Date(rx.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                          {rx.medicine?.image ? (
                            <img src={rx.medicine.image} alt={rx.medicine.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          )}
                        </div>
                        <span className="font-bold text-gray-900 line-clamp-1">{rx.medicine?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-900">{rx.packageLabel}</div>
                      <div className="text-[10px] text-gray-400">Qty: {rx.quantity}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{rx.user?.name || 'Unknown'}<br /><span className="text-xs text-gray-400 font-normal">{rx.user?.email}</span></td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[rx.status] || 'bg-gray-50 text-gray-600'}`}>
                        {rx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {rx.image && (
                          <button
                            onClick={() => setSelectedImage(getImageUrl(rx.image))}
                            className="px-3 py-1.5 bg-[#006D6D] text-white rounded-lg text-xs font-bold hover:bg-[#005c5c] transition-colors"
                          >
                            View
                          </button>
                        )}
                        <select
                          value={rx.status}
                          onChange={(e) => handleStatusChange(rx._id, e.target.value)}
                          className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Dispensed">Dispensed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-xl overflow-hidden p-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 text-white hover:bg-black/70 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
              </svg>
            </button>
            <img src={selectedImage} alt="Prescription" className="max-w-full max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Prescriptions;
