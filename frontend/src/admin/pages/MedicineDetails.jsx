import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const EMPTY_FORM = {
  manufacturer: '',
  saltComposition: '',
  uses: '',
  sideEffects: '',
  howToUse: '',
};

function MedicineDetails() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [toast, setToast] = useState('');
  const [selected, setSelected] = useState(null); // { _id, name, ...rest }
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    api.get('/medicines')
      .then((res) => setMedicines(res.data.data || res.data || []))
      .catch(() => setApiError('Failed to load medicines. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = medicines.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (medicine) => {
    setSelected(medicine);
    setForm({
      manufacturer: medicine.manufacturer || '',
      saltComposition: medicine.saltComposition || '',
      uses: medicine.uses || '',
      sideEffects: medicine.sideEffects || '',
      howToUse: medicine.howToUse || '',
    });
    setSaveError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      const res = await api.put(`/medicines/${selected._id}`, form);
      const updated = res.data.data || res.data;
      setMedicines((prev) =>
        prev.map((m) => (m._id === selected._id ? { ...m, ...updated } : m))
      );
      setIsModalOpen(false);
      showToast(`Details updated for "${selected.name}"`);
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg bg-green-50 text-green-700 border border-green-200">
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medicine Details Management</h2>
          <p className="text-gray-500 text-sm">Edit detailed info (uses, side effects, how-to-use) for each medicine.</p>
        </div>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{apiError}</div>
      )}

      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by medicine name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-xs text-gray-400 font-medium">{filtered.length} medicine{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Manufacturer</th>
                <th className="px-6 py-4">Salt Composition</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                    {searchTerm ? `No medicines matching "${searchTerm}"` : 'No medicines found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((med) => (
                  <tr key={med._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{med.name}</td>
                    <td className="px-6 py-4 text-gray-500">{med.manufacturer || <span className="text-gray-300">—</span>}</td>
                    <td className="px-6 py-4 text-gray-500">{med.saltComposition || <span className="text-gray-300">—</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {med.uses && <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Uses</span>}
                        {med.sideEffects && <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Side Effects</span>}
                        {med.howToUse && <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">How To Use</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenModal(med)}
                        className="text-primary font-bold text-sm hover:underline"
                      >
                        Edit Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Details</h3>
                <p className="text-sm text-gray-500 mt-0.5">{selected.name}</p>
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

            {saveError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2.5 rounded-xl">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={form.manufacturer}
                    onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Pfizer"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Salt Composition</label>
                  <input
                    type="text"
                    value={form.saltComposition}
                    onChange={(e) => setForm((f) => ({ ...f, saltComposition: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Metformin 500mg"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Uses (one per line)</label>
                <textarea
                  value={form.uses}
                  onChange={(e) => setForm((f) => ({ ...f, uses: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4"
                  placeholder="Enter uses, one per line..."
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Side Effects (one per line)</label>
                <textarea
                  value={form.sideEffects}
                  onChange={(e) => setForm((f) => ({ ...f, sideEffects: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4"
                  placeholder="Enter side effects, one per line..."
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">How to Use (one per line)</label>
                <textarea
                  value={form.howToUse}
                  onChange={(e) => setForm((f) => ({ ...f, howToUse: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4"
                  placeholder="Enter instructions, one per line..."
                />
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
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Details'}
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
