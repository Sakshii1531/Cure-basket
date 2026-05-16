import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import uploadImage from '../../utils/uploadImage';

const POSITIONS = ['main', 'promo', 'category', 'popup'];

function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    api.get('/banners')
      .then(res => setBanners(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load banners'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      setBanners(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const openModal = (banner = null) => {
    setCurrent(banner ? { ...banner } : { title: '', image: '', link: '', position: 'main', isActive: true, order: 0 });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (current._id) {
        const res = await api.put(`/banners/${current._id}`, current);
        setBanners(prev => prev.map(b => b._id === current._id ? res.data.data : b));
      } else {
        const res = await api.post('/banners', current);
        setBanners(prev => [...prev, res.data.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Banner Management</h2>
          <p className="text-gray-500 text-sm">Manage homepage banners and promotions.</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#006D6D] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005c5c] transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Banner
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Loading...</div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium mb-4">No banners added yet.</p>
            <button onClick={() => openModal()} className="bg-[#006D6D] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005c5c]">Add Banner</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => openModal(banner)} className="p-1.5 bg-white text-gray-600 hover:text-[#006D6D] rounded-lg shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.128-1.897l8.934-8.934Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="p-1.5 bg-white text-gray-600 hover:text-red-600 rounded-lg shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-black/50 text-white text-xs rounded-full font-medium capitalize">{banner.position}</span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{banner.title || 'Untitled Banner'}</h3>
                  {banner.link && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">{banner.link}</p>}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${banner.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && current && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{current._id ? 'Edit Banner' : 'Add Banner'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Banner Title</label>
                <input type="text" value={current.title} onChange={e => setCurrent({...current, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" placeholder="e.g., Summer Sale 50% Off" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Link URL</label>
                <input type="text" value={current.link} onChange={e => setCurrent({...current, link: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" placeholder="/category/diabetes" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Position</label>
                  <select value={current.position} onChange={e => setCurrent({...current, position: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]">
                    {POSITIONS.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Order</label>
                  <input type="number" min="0" value={current.order} onChange={e => setCurrent({...current, order: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Upload Banner Image</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setCurrent(prev => ({...prev, image: '__uploading__'}));
                  try {
                    const url = await uploadImage(file, 'cure-basket/banners');
                    setCurrent(prev => ({...prev, image: url}));
                  } catch {
                    setCurrent(prev => ({...prev, image: ''}));
                  }
                }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm" required={!current._id && !current.image} />
                {current.image === '__uploading__' && (
                  <p className="text-xs text-gray-400 mt-1">Uploading...</p>
                )}
                {current.image && current.image !== '__uploading__' && (
                  <img src={current.image} alt="Preview" className="mt-2 w-full h-24 object-cover rounded-lg border border-gray-100" />
                )}
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={current.isActive} onChange={e => setCurrent({...current, isActive: e.target.checked})} className="w-4 h-4 rounded" />
                Active
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banners;
