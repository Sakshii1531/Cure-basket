import React, { useState, useEffect } from 'react';

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState(() => {
    const saved = localStorage.getItem('cb_prescriptions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cb_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  const handleStatusChange = (id, status) => {
    setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, status } : p));
  };

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
        <p className="text-gray-500 text-sm">Review and manage user uploaded prescriptions.</p>
      </div>

      {prescriptions.length === 0 ? (
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">File Name</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{rx.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{rx.fileName}</td>
                  <td className="px-6 py-4 text-gray-500">{rx.fileSize}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      rx.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      rx.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedImage(rx.fileData)}
                        className="px-3 py-1.5 bg-[#006D6D] text-white rounded-lg text-xs font-bold hover:bg-[#005c5c] transition-colors"
                      >
                        View
                      </button>
                      <select 
                        value={rx.status}
                        onChange={(e) => handleStatusChange(rx.id, e.target.value)}
                        className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approve</option>
                        <option value="Rejected">Reject</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-xl overflow-hidden p-2" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 text-white hover:bg-black/70 rounded-full transition-colors"
            >
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
