import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import uploadImage from '../../utils/uploadImage';

function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);

  useEffect(() => {
    api.get('/brands')
      .then(res => setBrands(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load brands'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await api.delete(`/brands/${id}`);
      setBrands(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete brand');
    }
  };

  const handleOpenModal = (brand = null) => {
    setCurrentBrand(brand ? { ...brand } : { name: '', image: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentBrand._id) {
        const res = await api.put(`/brands/${currentBrand._id}`, { name: currentBrand.name, image: currentBrand.image });
        setBrands(prev => prev.map(b => b._id === currentBrand._id ? res.data.data : b));
      } else {
        const res = await api.post('/brands', { name: currentBrand.name, image: currentBrand.image });
        setBrands(prev => [...prev, res.data.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save brand');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Brands</h2>
          <p className="text-gray-500 text-sm">Manage popular brands shown on homepage.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-[#006D6D] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005c5c] transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Brand
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {brands.map((brand) => (
                <tr key={brand._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                      {brand.image && brand.image !== 'no-photo.jpg' ? (
                        <img src={brand.image} alt={brand.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{brand.name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(brand)} className="p-1.5 text-gray-400 hover:text-[#006D6D] rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.128-1.897l8.934-8.934Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(brand._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-400 text-sm">No brands found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{currentBrand?._id ? 'Edit Brand' : 'Add Brand'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={currentBrand.name}
                  onChange={(e) => setCurrentBrand({ ...currentBrand, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  placeholder="e.g., Himalaya"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Upload Brand Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setCurrentBrand(prev => ({ ...prev, image: '__uploading__' }));
                    try {
                      const url = await uploadImage(file, 'cure-basket/brands');
                      setCurrentBrand(prev => ({ ...prev, image: url }));
                    } catch {
                      setCurrentBrand(prev => ({ ...prev, image: '' }));
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                />
                {currentBrand.image === '__uploading__' && (
                  <p className="text-xs text-gray-400 mt-1">Uploading...</p>
                )}
                {currentBrand.image && currentBrand.image !== 'no-photo.jpg' && currentBrand.image !== '__uploading__' && (
                  <img src={currentBrand.image} alt="Preview" className="mt-2 w-16 h-16 object-contain rounded-lg border border-gray-100" />
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Brands;
