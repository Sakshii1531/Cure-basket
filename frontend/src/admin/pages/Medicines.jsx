import React, { useState, useEffect } from 'react';

// Mock imports for images (using the ones from the project if available, or fallbacks)
// Since we are in src/admin/pages, assets are in ../../assets/
import med1 from '../../assets/med1.png';
import med2 from '../../assets/med2.png';
import med3 from '../../assets/med3.png';
import med4 from '../../assets/med4.png';

const initialMedicines = [
  { id: 101, name: 'Lantus Solostar', generic: '(Insulin Glargine)', category: 'Diabetes', price: '42.00', stock: 50, status: 'Active', image: med1 },
  { id: 102, name: 'Viagra 50mg', generic: '(Sildenafil)', category: 'ED Treatment', price: '28.00', stock: 120, status: 'Active', image: med1 },
  { id: 103, name: 'Finasteride 1mg', generic: '(Hair Loss)', category: 'Hair Loss', price: '18.00', stock: 85, status: 'Active', image: med2 },
  { id: 104, name: 'Cialis 10mg', generic: '(Weekend Pill)', category: 'ED Treatment', price: '34.00', stock: 40, status: 'Active', image: med2 },
  { id: 105, name: 'Metformin 500mg', generic: '(Diabetes Care)', category: 'Diabetes', price: '12.00', stock: 200, status: 'Active', image: med3 },
  { id: 106, name: 'Lumigan Eye Drops', generic: '(Bimatoprost)', category: 'Eye Care', price: '29.00', stock: 15, status: 'Low Stock', image: med3 },
];

function Medicines() {
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('cb_medicines');
    return saved ? JSON.parse(saved) : initialMedicines;
  });
  
  const [brands] = useState(() => {
    const saved = localStorage.getItem('cb_brands');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState(null);

  useEffect(() => {
    localStorage.setItem('cb_medicines', JSON.stringify(medicines));
  }, [medicines]);

  const [customFields, setCustomFields] = useState(() => {
    const saved = localStorage.getItem('cb_custom_fields');
    return saved ? JSON.parse(saved) : [
      { id: 1, label: 'Manufacturer', type: 'text' },
      { id: 2, label: 'Salt Composition', type: 'text' },
      { id: 3, label: 'Uses', type: 'textarea' },
      { id: 4, label: 'Side Effects', type: 'textarea' },
      { id: 5, label: 'How to Use', type: 'textarea' }
    ];
  });
  
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  useEffect(() => {
    localStorage.setItem('cb_custom_fields', JSON.stringify(customFields));
  }, [customFields]);

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const newField = {
      id: Date.now(),
      label: newFieldLabel,
      type: newFieldType
    };
    setCustomFields([...customFields, newField]);
    setNewFieldLabel('');
  };

  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editingFieldLabel, setEditingFieldLabel] = useState('');

  const handleSaveFieldLabel = (id) => {
    if (!editingFieldLabel.trim()) return;
    setCustomFields(customFields.map(f => f.id === id ? { ...f, label: editingFieldLabel } : f));
    setEditingFieldId(null);
  };

  const handleDeleteField = (id) => {
    if (window.confirm('Are you sure you want to delete this field? Data for this field in all medicines will be lost.')) {
      setCustomFields(customFields.filter(f => f.id !== id));
    }
  };

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          med.generic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Diabetes', 'ED Treatment', 'Hair Loss', 'Eye Care', 'Mental Health'];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  const handleOpenModal = (medicine = null) => {
    setCurrentMedicine(medicine || { name: '', generic: '', category: 'Diabetes', price: '', stock: '', status: 'Active', image: med1 });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentMedicine.id) {
      // Edit
      setMedicines(medicines.map(med => med.id === currentMedicine.id ? currentMedicine : med));
    } else {
      // Add
      const newMed = { ...currentMedicine, id: Date.now() };
      setMedicines([...medicines, newMed]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medicines Management</h2>
          <p className="text-gray-500 text-sm">Manage your inventory, prices, and stock levels.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#006D6D] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005c5c] transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Medicine
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search medicines..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] focus:border-transparent w-full"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Category:</span>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] px-3 py-2 w-full md:w-auto"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
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
              {filteredMedicines.map((med) => (
                <tr key={med.id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                      <img src={med.image} alt={med.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{med.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{med.generic}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{med.category}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${med.price}</td>
                  <td className="px-6 py-4 font-semibold">{med.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      med.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                      med.status === 'Low Stock' ? 'bg-red-50 text-red-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {med.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(med)}
                        className="p-1.5 text-gray-400 hover:text-[#006D6D] hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.128-1.897l8.934-8.934Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(med.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{currentMedicine?.id ? 'Edit Medicine' : 'Add Medicine'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Info & Media</h4>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Name</label>
                    <input 
                      type="text" 
                      value={currentMedicine.name}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Generic Name</label>
                    <input 
                      type="text" 
                      value={currentMedicine.generic}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, generic: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Brand (Optional)</label>
                    <select 
                      value={currentMedicine.brand || ''}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, brand: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    >
                      <option value="">No Brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.name}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Category</label>
                      <select 
                        value={currentMedicine.category}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, category: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      >
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Price ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={currentMedicine.price}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, price: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Stock</label>
                      <input 
                        type="number" 
                        value={currentMedicine.stock}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, stock: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">Status</label>
                      <select 
                        value={currentMedicine.status}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, status: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      >
                        <option value="Active">Active</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  {/* Upload Image moved here */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Upload Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCurrentMedicine({...currentMedicine, image: reader.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    />
                    {currentMedicine.image && (
                      <div className="mt-2 w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden">
                        <img src={currentMedicine.image} alt="Preview" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Custom Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Custom Details</h4>
                  {/* Dynamic Custom Fields */}
                  <div className="space-y-4">
                    {customFields.map(field => (
                      <div key={field.id}>
                        <div className="flex justify-between items-center mb-1">
                          {editingFieldId === field.id ? (
                            <div className="flex gap-2 items-center w-full">
                              <input 
                                type="text" 
                                value={editingFieldLabel}
                                onChange={(e) => setEditingFieldLabel(e.target.value)}
                                className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                              />
                              <button 
                                type="button" 
                                onClick={() => handleSaveFieldLabel(field.id)}
                                className="text-xs text-[#006D6D] font-bold hover:underline"
                              >
                                Save
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setEditingFieldId(null)}
                                className="text-xs text-gray-500 hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                              <div className="flex gap-2">
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setEditingFieldId(field.id);
                                    setEditingFieldLabel(field.label);
                                  }}
                                  className="text-xs text-gray-400 hover:text-[#006D6D] hover:underline"
                                >
                                  Edit
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteField(field.id)}
                                  className="text-xs text-gray-400 hover:text-red-600 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                        {field.type === 'textarea' ? (
                          <textarea 
                            value={currentMedicine.customValues?.[field.id] || ''}
                            onChange={(e) => setCurrentMedicine({
                              ...currentMedicine, 
                              customValues: {
                                ...currentMedicine.customValues,
                                [field.id]: e.target.value
                              }
                            })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                            rows="3"
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={currentMedicine.customValues?.[field.id] || ''}
                            onChange={(e) => setCurrentMedicine({
                              ...currentMedicine, 
                              customValues: {
                                ...currentMedicine.customValues,
                                [field.id]: e.target.value
                              }
                            })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Field Inline */}
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs font-bold text-gray-600 mb-2">Add New Custom Field</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="Field Name (e.g. Uses)"
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      />
                      <select 
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                      </select>
                      <button 
                        type="button"
                        onClick={handleAddCustomField}
                        className="bg-[#006D6D] text-white px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-[#005c5c] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Checkboxes & Buttons */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={currentMedicine.isNewAndBest || false}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, isNewAndBest: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-[#006D6D] focus:ring-[#006D6D]"
                    />
                    Mark as "New and Best"
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={currentMedicine.isBestSeller || false}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, isBestSeller: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-[#006D6D] focus:ring-[#006D6D]"
                    />
                    Mark as "Best Seller"
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Medicines;
