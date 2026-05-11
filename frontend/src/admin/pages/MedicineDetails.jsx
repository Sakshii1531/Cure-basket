import React, { useState, useEffect } from 'react';

function MedicineDetails() {
  const [medicineDetails, setMedicineDetails] = useState(() => {
    const saved = localStorage.getItem('cb_medicine_details');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDetails, setCurrentDetails] = useState(null);

  useEffect(() => {
    localStorage.setItem('cb_medicine_details', JSON.stringify(medicineDetails));
  }, [medicineDetails]);

  const filteredDetails = medicineDetails.filter(detail => {
    return detail.medicineName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenModal = (details = null) => {
    setCurrentDetails(details || { 
      id: Date.now(),
      medicineName: '',
      manufacturer: '',
      salt: '',
      uses: '',
      sideEffects: '',
      howToUse: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const exists = medicineDetails.some(d => d.id === currentDetails.id);
    if (exists) {
      setMedicineDetails(medicineDetails.map(d => d.id === currentDetails.id ? currentDetails : d));
    } else {
      setMedicineDetails([...medicineDetails, currentDetails]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete these details?')) {
      setMedicineDetails(medicineDetails.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medicine Details Management</h2>
          <p className="text-gray-500 text-sm">Add and manage detailed information for medicines from scratch.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#006D6D] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005c5c] transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Medicine Details
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search by medicine name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] focus:border-transparent w-full"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Manufacturer</th>
                <th className="px-6 py-4">Salt Composition</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDetails.map((detail) => (
                <tr key={detail.id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{detail.medicineName}</td>
                  <td className="px-6 py-4 text-gray-500">{detail.manufacturer || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-500">{detail.salt || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(detail)}
                        className="text-[#006D6D] font-bold text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(detail.id)}
                        className="text-red-600 font-bold text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDetails.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                    No medicine details added yet. Click "Add Medicine Details" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && currentDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentDetails.medicineName ? 'Edit Details' : 'Add Details'}</h3>
                <p className="text-sm text-gray-500">Fill in the information for the medicine.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Medicine Name</label>
                <input 
                  type="text" 
                  value={currentDetails.medicineName}
                  onChange={(e) => setCurrentDetails({...currentDetails, medicineName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  placeholder="e.g. Lantus Solostar"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Manufacturer</label>
                  <input 
                    type="text" 
                    value={currentDetails.manufacturer || ''}
                    onChange={(e) => setCurrentDetails({...currentDetails, manufacturer: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    placeholder="e.g. Pfizer"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Salt Composition</label>
                  <input 
                    type="text" 
                    value={currentDetails.salt || ''}
                    onChange={(e) => setCurrentDetails({...currentDetails, salt: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    placeholder="e.g. Metformin"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Uses (One per line)</label>
                <textarea 
                  value={currentDetails.uses || ''}
                  onChange={(e) => setCurrentDetails({...currentDetails, uses: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  rows="4"
                  placeholder="Enter uses, one per line..."
                ></textarea>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Side Effects (One per line)</label>
                <textarea 
                  value={currentDetails.sideEffects || ''}
                  onChange={(e) => setCurrentDetails({...currentDetails, sideEffects: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  rows="4"
                  placeholder="Enter side effects, one per line..."
                ></textarea>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">How to Use (One per line)</label>
                <textarea 
                  value={currentDetails.howToUse || ''}
                  onChange={(e) => setCurrentDetails({...currentDetails, howToUse: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  rows="4"
                  placeholder="Enter instructions, one per line..."
                ></textarea>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicineDetails;
