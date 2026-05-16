import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import uploadImage from '../../utils/uploadImage';

const DEFAULT_CUSTOM_FIELDS = []; // We now use explicit fields in the model

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const [customFields, setCustomFields] = useState(DEFAULT_CUSTOM_FIELDS);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editingFieldLabel, setEditingFieldLabel] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/medicines?limit=100'),
      api.get('/categories'),
      api.get('/brands'),
    ])
      .then(([medsRes, catsRes, brandsRes]) => {
        setMedicines(medsRes.data.data);
        setCategories(catsRes.data.data);
        setBrands(brandsRes.data.data);
      })
      .catch(err => setError(err.response?.data?.error || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = medicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.genericName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'All' || m.category?._id === selectedCategory || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    try {
      await api.delete(`/medicines/${id}`);
      setMedicines(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const openModal = (med = null) => {
    if (med) {
      setCurrent({
        ...med,
        category: med.category?._id || med.category || '',
        brand: med.brand?._id || med.brand || '',
        price: med.price || '',
        mrp: med.mrp || '',
        images: med.images || [],
        packages: med.packages || [],
        manufacturer: med.manufacturer || '',
        saltComposition: med.saltComposition || '',
        packaging: med.packaging || '',
        storage: med.storage || '',
        prescription: med.prescription || 'Required',
        deliveryTime: med.deliveryTime || 'Usually delivers in 1-2 days',
        uses: med.uses || '',
        sideEffects: med.sideEffects || '',
        howToUse: med.howToUse || '',
        customValues: med.customValues ? Object.fromEntries(Object.entries(med.customValues)) : {},
      });
    } else {
      setCurrent({
        name: '', genericName: '', category: categories[0]?._id || '', brand: '',
        price: '', mrp: '', stock: '', status: 'Active', image: '', images: [],
        packages: [], manufacturer: '', saltComposition: '', packaging: '', storage: '',
        prescription: 'Required', deliveryTime: 'Usually delivers in 1-2 days',
        uses: '', sideEffects: '', howToUse: '',
        isNewAndBest: false, isBestSeller: false, customValues: {},
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...current,
      price: Number(current.price),
      mrp: Number(current.mrp || current.price),
      stock: Number(current.stock),
      packages: current.packages || [],
    };
    try {
      if (current._id) {
        const res = await api.put(`/medicines/${current._id}`, payload);
        setMedicines(prev => prev.map(m => m._id === current._id ? res.data.data : m));
      } else {
        const res = await api.post('/medicines', payload);
        setMedicines(prev => [res.data.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save medicine');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const id = newFieldLabel.toLowerCase().replace(/\s+/g, '_');
    setCustomFields(prev => [...prev, { id, label: newFieldLabel, type: newFieldType }]);
    setNewFieldLabel('');
  };

  const handleDeleteField = (id) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  const handleSaveFieldLabel = (id) => {
    if (!editingFieldLabel.trim()) return;
    setCustomFields(prev => prev.map(f => f.id === id ? { ...f, label: editingFieldLabel } : f));
    setEditingFieldId(null);
  };

  const setCustomValue = (fieldId, value) => {
    setCurrent(prev => ({ ...prev, customValues: { ...prev.customValues, [fieldId]: value } }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medicines Management</h2>
          <p className="text-gray-500 text-sm">Manage your inventory, prices, and stock levels.</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#006D6D] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005c5c] transition-colors flex items-center justify-center gap-2 shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Medicine
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] w-full"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Category:</span>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] px-3 py-2 w-full md:w-auto">
            <option value="All">All</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((med) => (
                  <tr key={med._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {med.image && med.image !== 'no-photo.jpg' ? (
                          <img src={med.image} alt={med.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1H9L8 4zm.5 5h7L15 10H9l-.5-1zm.5 5h7l-1 1H10l-.5-1z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{med.name}</p>
                        <p className="text-xs text-gray-500">{med.genericName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{med.category?.name || '—'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{med.price}</td>
                    <td className="px-6 py-4 font-semibold">{med.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${med.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : med.status === 'Low Stock' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                        {med.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(med)} className="p-1.5 text-gray-400 hover:text-[#006D6D] hover:bg-teal-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.128-1.897l8.934-8.934Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(med._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400 text-sm">No medicines found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && current && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{current._id ? 'Edit Medicine' : 'Add Medicine'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Info & Media</h4>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Name</label>
                    <input type="text" value={current.name} onChange={e => setCurrent({...current, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Generic Name</label>
                    <input type="text" value={current.genericName} onChange={e => setCurrent({...current, genericName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Brand (Optional)</label>
                    <select value={current.brand || ''} onChange={e => setCurrent({...current, brand: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]">
                      <option value="">No Brand</option>
                      {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Category</label>
                      <select value={current.category} onChange={e => setCurrent({...current, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" required>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Selling Price ($)</label>
                        <input type="number" step="0.01" min="0" value={current.price} onChange={e => setCurrent({...current, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" required />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">MRP (Original Price $)</label>
                        <input type="number" step="0.01" min="0" value={current.mrp} onChange={e => setCurrent({...current, mrp: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" required />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Stock</label>
                      <input type="number" min="0" value={current.stock} onChange={e => setCurrent({...current, stock: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" required />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Status</label>
                      <select value={current.status} onChange={e => setCurrent({...current, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]">
                        <option value="Active">Active</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Upload Image</label>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setCurrent({...current, image: '__uploading__'});
                      try {
                        const url = await uploadImage(file, 'cure-basket/medicines');
                        setCurrent(prev => ({...prev, image: url}));
                      } catch {
                        setCurrent(prev => ({...prev, image: ''}));
                      }
                    }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" />
                    {current.image === '__uploading__' && (
                      <p className="text-xs text-gray-400 mt-1">Uploading...</p>
                    )}
                    {current.image && current.image !== 'no-photo.jpg' && current.image !== '__uploading__' && (
                      <img src={current.image} alt="Preview" className="mt-2 w-20 h-20 object-contain rounded-lg border border-gray-100" />
                    )}
                  </div>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={current.isNewAndBest || false} onChange={e => setCurrent({...current, isNewAndBest: e.target.checked})} className="w-4 h-4 rounded" />
                      New & Best
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={current.isBestSeller || false} onChange={e => setCurrent({...current, isBestSeller: e.target.checked})} className="w-4 h-4 rounded" />
                      Best Seller
                    </label>
                  </div>
                </div>

                {/* Right: Medicinal Details & Packages */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Medicinal Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Manufacturer</label>
                      <input type="text" value={current.manufacturer} onChange={e => setCurrent({...current, manufacturer: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Salt Composition</label>
                      <input type="text" value={current.saltComposition} onChange={e => setCurrent({...current, saltComposition: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Packaging (e.g. 10 Tabs/Strip)</label>
                      <input type="text" value={current.packaging} onChange={e => setCurrent({...current, packaging: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Storage</label>
                      <input type="text" value={current.storage} onChange={e => setCurrent({...current, storage: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Uses (One per line)</label>
                    <textarea value={current.uses} onChange={e => setCurrent({...current, uses: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" rows="2" />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Side Effects (One per line)</label>
                    <textarea value={current.sideEffects} onChange={e => setCurrent({...current, sideEffects: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" rows="2" />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">How to Use (Steps per line)</label>
                    <textarea value={current.howToUse} onChange={e => setCurrent({...current, howToUse: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]" rows="2" />
                  </div>

                  {/* Packages Editor */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Package Options (Quantities)</h4>
                    <div className="space-y-2">
                      {current.packages.map((pkg, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                          <input type="text" placeholder="Label (10 Tabs)" value={pkg.label} onChange={e => {
                            const newPkgs = [...current.packages];
                            newPkgs[idx].label = e.target.value;
                            setCurrent({...current, packages: newPkgs});
                          }} className="w-24 text-xs p-1 rounded" />
                          <input type="number" placeholder="Price" value={pkg.price} onChange={e => {
                            const newPkgs = [...current.packages];
                            newPkgs[idx].price = Number(e.target.value);
                            setCurrent({...current, packages: newPkgs});
                          }} className="w-16 text-xs p-1 rounded" />
                          <input type="number" placeholder="MRP" value={pkg.mrp} onChange={e => {
                            const newPkgs = [...current.packages];
                            newPkgs[idx].mrp = Number(e.target.value);
                            setCurrent({...current, packages: newPkgs});
                          }} className="w-16 text-xs p-1 rounded" />
                          <label className="flex items-center gap-1 text-[10px] whitespace-nowrap">
                            <input type="checkbox" checked={pkg.popular} onChange={e => {
                              const newPkgs = [...current.packages];
                              newPkgs[idx].popular = e.target.checked;
                              setCurrent({...current, packages: newPkgs});
                            }} /> Popular
                          </label>
                          <button type="button" onClick={() => setCurrent({...current, packages: current.packages.filter((_, i) => i !== idx)})} className="text-red-500 text-xs">×</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setCurrent({...current, packages: [...current.packages, { label: '', price: 0, popular: false }]})} className="text-xs text-[#006D6D] font-bold">+ Add Package</button>
                    </div>
                  </div>

                  {/* Safety Advice Editor */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Safety Advice</h4>
                    <div className="space-y-3">
                      {current.safetyAdvice?.map((advice, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                          <div className="flex gap-2">
                            <input type="text" placeholder="Label (e.g. Alcohol)" value={advice.label} onChange={e => {
                              const newAdvice = [...current.safetyAdvice];
                              newAdvice[idx].label = e.target.value;
                              setCurrent({...current, safetyAdvice: newAdvice});
                            }} className="flex-1 text-xs p-1.5 rounded border border-gray-200" />
                            <select value={advice.status} onChange={e => {
                              const newAdvice = [...current.safetyAdvice];
                              newAdvice[idx].status = e.target.value;
                              setCurrent({...current, safetyAdvice: newAdvice});
                            }} className="text-xs p-1.5 rounded border border-gray-200">
                              <option value="Safe">Safe</option>
                              <option value="Unsafe">Unsafe</option>
                              <option value="Caution">Caution</option>
                              <option value="Consult Doctor">Consult Doctor</option>
                            </select>
                            <button type="button" onClick={() => setCurrent({...current, safetyAdvice: current.safetyAdvice.filter((_, i) => i !== idx)})} className="text-red-500 text-xs">×</button>
                          </div>
                          <textarea placeholder="Description" value={advice.description} onChange={e => {
                            const newAdvice = [...current.safetyAdvice];
                            newAdvice[idx].description = e.target.value;
                            setCurrent({...current, safetyAdvice: newAdvice});
                          }} className="w-full text-xs p-1.5 rounded border border-gray-200" rows="1" />
                        </div>
                      ))}
                      <button type="button" onClick={() => setCurrent({...current, safetyAdvice: [...(current.safetyAdvice || []), { label: '', status: 'Safe', description: '' }]})} className="text-xs text-[#006D6D] font-bold">+ Add Safety Advice</button>
                    </div>
                  </div>

                  {/* FAQs Editor */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">FAQs</h4>
                    <div className="space-y-3">
                      {current.faqs?.map((faq, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2 relative">
                          <button type="button" onClick={() => setCurrent({...current, faqs: current.faqs.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 text-red-500 text-xs">×</button>
                          <input type="text" placeholder="Question" value={faq.question} onChange={e => {
                            const newFaqs = [...current.faqs];
                            newFaqs[idx].question = e.target.value;
                            setCurrent({...current, faqs: newFaqs});
                          }} className="w-full text-xs p-1.5 rounded border border-gray-200 pr-8" />
                          <textarea placeholder="Answer" value={faq.answer} onChange={e => {
                            const newFaqs = [...current.faqs];
                            newFaqs[idx].answer = e.target.value;
                            setCurrent({...current, faqs: newFaqs});
                          }} className="w-full text-xs p-1.5 rounded border border-gray-200" rows="2" />
                        </div>
                      ))}
                      <button type="button" onClick={() => setCurrent({...current, faqs: [...(current.faqs || []), { question: '', answer: '' }]})} className="text-xs text-[#006D6D] font-bold">+ Add FAQ</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
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

export default Medicines;
