import * as XLSX from 'xlsx';
import { SkeletonTable } from '../components/Skeleton';
import { toast } from 'sonner';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import uploadImage from '../../utils/uploadImage';

// ── Excel template columns ────────────────────────────────────────────────────
const TEMPLATE_HEADERS = [
  'Title', 'Category', 'Price Label', 'Pack Size', 'Quantity Options',
  'Price Per Unit', 'Total Price', 'Old Price', 'Discount', 'Description',
  'Precautions', 'Side Effects', 'How To Use', 'SKU', 'Generic For',
  'Active Ingredient', 'Manufacturer', 'Country Origin', 'Uses', 'Packs',
];

const TEMPLATE_SAMPLE = [
  'Paracetamol 500mg', 'Pain Relief', 'USD', '10 Tablets/Strip', '1, 2, 5',
  '0.50', '5.00', '6.00', '17', 'A common pain reliever and fever reducer.',
  'Avoid if allergic to paracetamol. Do not exceed recommended dose.',
  'Nausea, rash (rare)', 'Take 1-2 tablets every 4-6 hours as needed.',
  '10012', 'Acetaminophen', 'Paracetamol', 'Generic Pharma Inc.', 'USA', 'Pain relief, fever reduction',
  '10 Tablets:10:5.00:6.00 | 30 Tablets:30:13.50:18.00',
];

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, TEMPLATE_SAMPLE]);
  // Make header row bold by setting column widths for readability
  ws['!cols'] = TEMPLATE_HEADERS.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, 'Medicines');
  XLSX.writeFile(wb, 'medicine_upload_template.xlsx');
}

const EMPTY_FORM = {
  title: '', genericFor: '', category: '', brand: '',
  priceLabel: 'USD', packSize: '', quantityOptions: '1',
  pricePerUnit: '', totalPrice: '', oldPrice: '', discount: '',
  sku: '', description: '', activeIngredient: '', manufacturer: '',
  countryOrigin: '', stock: '', status: 'Active', image: '', images: [],
  packages: [], packaging: '', storage: '',
  prescription: 'Required', deliveryTime: 'Usually delivers in 1-2 days',
  uses: '', sideEffects: '', howToUse: '',
  isNewAndBest: false, isBestSeller: false,
  precautions: [], faqs: [],
};

function Medicines() {
  const updateDiscount = (totalPriceVal, oldPriceVal) => {
    const total = parseFloat(totalPriceVal);
    const old = parseFloat(oldPriceVal);
    if (!isNaN(total) && !isNaN(old) && old > total && old > 0) {
      const pct = ((old - total) / old) * 100;
      return pct.toFixed(2);
    }
    return '';
  };

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Excel upload state
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelPreview, setExcelPreview] = useState(null); // { headers, rows }
  const [excelUploading, setExcelUploading] = useState(false);
  const [excelResult, setExcelResult] = useState(null); // { summary, errors }
  const excelInputRef = useRef(null);

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

  useEffect(() => {
    if (isModalOpen || isExcelModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isExcelModalOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const filtered = medicines.filter(m => {
    const displayName = m.title || m.name || '';
    const matchSearch =
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.genericFor || m.genericName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'All' || m.category?._id?.toString() === selectedCategory;
    return matchSearch && matchCat;
  });

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/medicines/${deleteId}`);
      setMedicines(prev => prev.filter(m => m._id !== deleteId));
      setDeleteId(null);
      toast.success('Medicine deleted');
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const openModal = (med = null) => {
    if (med) {
      setCurrent({
        ...EMPTY_FORM,
        ...med,
        title:           med.title || med.name || '',
        category:        med.category?._id || med.category || '',
        brand:           med.brand?._id || med.brand || '',
        priceLabel:      med.priceLabel || 'USD',
        packSize:        med.packSize || '',
        quantityOptions: Array.isArray(med.quantityOptions) && med.quantityOptions.length > 0
          ? med.quantityOptions.join(', ')
          : '1',
        pricePerUnit:     med.pricePerUnit ?? med.price ?? '',
        totalPrice:       med.totalPrice ?? '',
        oldPrice:         med.oldPrice ?? med.mrp ?? '',
        discount:         med.discount ?? '',
        sku:              med.sku ?? '',
        description:      med.description || '',
        genericFor:       med.genericFor || med.genericName || '',
        activeIngredient: med.activeIngredient || med.saltComposition || '',
        manufacturer:     med.manufacturer || '',
        countryOrigin:    med.countryOrigin || '',
        images:           med.images || [],
        packages:         med.packages || [],
        packaging:        med.packaging || '',
        storage:          med.storage || '',
        prescription:     med.prescription || 'Required',
        deliveryTime:     med.deliveryTime || 'Usually delivers in 1-2 days',
        uses:             med.uses || '',
        sideEffects:      med.sideEffects || '',
        howToUse:         med.howToUse || '',
        precautions:      med.precautions || med.safetyAdvice || [],
        faqs:             med.faqs || [],
      });
    } else {
      setCurrent({ ...EMPTY_FORM, category: categories[0]?._id || '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (current.image === '__uploading__') {
      toast.error('Please wait for the image to finish uploading');
      return;
    }

    const pricePerUnit = Number(current.pricePerUnit);
    const totalPrice = current.totalPrice ? Number(current.totalPrice) : pricePerUnit;

    if (isNaN(pricePerUnit) || pricePerUnit <= 0) {
      setSaveError('Price Per Unit must be greater than 0');
      return;
    }

    if (isNaN(totalPrice) || totalPrice <= 0) {
      setSaveError('Total Price must be greater than 0');
      return;
    }

    if (current.oldPrice !== '' && current.oldPrice != null) {
      const oldPrice = Number(current.oldPrice);
      if (isNaN(oldPrice) || oldPrice <= 0) {
        setSaveError('Old Price must be greater than 0');
        return;
      }
      if (oldPrice <= totalPrice) {
        setSaveError('Old Price must be greater than Total Price');
        toast.error('Old Price must be greater than Total Price');
        return;
      }
    }

    if (/\d/.test(current.countryOrigin)) {
      setSaveError('Country of Origin cannot contain numbers');
      toast.error('Country of Origin cannot contain numbers');
      return;
    }

    const stock = Number(current.stock);
    if (isNaN(stock) || stock <= 0) {
      setSaveError('Stock must be greater than 0');
      toast.error('Stock must be greater than 0');
      return;
    }

    setSaving(true);
    setSaveError('');
    const parsedQtyOptions = String(current.quantityOptions)
      .split(',')
      .map(n => Number(n.trim()))
      .filter(n => !isNaN(n) && n > 0);

    // Normalize packs: keep only rows with a price, compute per-unit from units
    const parsedPackages = (current.packages || [])
      .filter(p => p.price !== '' && p.price != null && !isNaN(Number(p.price)))
      .map(p => {
        const price = Number(p.price);
        const units = Number(p.units) || 0;
        return {
          label:    p.label || (units > 0 ? `${units} Pack` : '1 Pack'),
          price,
          oldPrice: p.oldPrice !== '' && p.oldPrice != null ? Number(p.oldPrice) : undefined,
          units:    units > 0 ? units : undefined,
          perUnit:  units > 0 ? Number((price / units).toFixed(2)) : price,
          popular:  Boolean(p.popular),
        };
      });
    // Ensure exactly one pack is flagged as "Best Value"
    if (parsedPackages.length > 0 && !parsedPackages.some(p => p.popular)) {
      parsedPackages[0].popular = true;
    }

    const payload = {
      ...current,
      packages: parsedPackages,
      quantityOptions: parsedQtyOptions.length > 0 ? parsedQtyOptions : [1],
      pricePerUnit:    Number(current.pricePerUnit),
      totalPrice:      totalPrice,
      priceLabel:      current.priceLabel || 'USD',
      price:           Number(current.pricePerUnit),
      stock:           Number(current.stock) || 0,
      brand:           current.brand || undefined,
      oldPrice:        current.oldPrice !== '' ? Number(current.oldPrice) : undefined,
      mrp:             current.oldPrice !== '' ? Number(current.oldPrice) : undefined,
      discount:        current.discount !== '' ? Number(current.discount) : undefined,
      sku:             current.sku !== '' ? Number(current.sku) : undefined,
    };

    try {
      if (current._id) {
        const res = await api.put(`/medicines/${current._id}`, payload);
        setMedicines(prev => prev.map(m => m._id === current._id ? res.data.data : m));
        toast.success('Medicine updated');
      } else {
        const res = await api.post('/medicines', payload);
        setMedicines(prev => [res.data.data, ...prev]);
        toast.success('Medicine added');
      }
      setIsModalOpen(false);
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Failed to save medicine');
    } finally {
      setSaving(false);
    }
  };

  // ── Package (pack pricing) handlers ────────────────────────────────────────
  const addPackage = () =>
    setCurrent(c => ({
      ...c,
      packages: [...(c.packages || []), { label: '', price: '', oldPrice: '', units: '', popular: false }],
    }));

  const updatePackage = (idx, field, value) =>
    setCurrent(c => ({
      ...c,
      packages: c.packages.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    }));

  const removePackage = (idx) =>
    setCurrent(c => ({ ...c, packages: c.packages.filter((_, i) => i !== idx) }));

  const setPopularPackage = (idx) =>
    setCurrent(c => ({
      ...c,
      packages: c.packages.map((p, i) => ({ ...p, popular: i === idx })),
    }));

  // ── Excel upload handlers ──────────────────────────────────────────────────
  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExcelFile(file);
    setExcelResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        if (rows.length < 2) {
          setExcelPreview(null);
          return;
        }
        setExcelPreview({
          headers: rows[0],
          rows: rows.slice(1, 6), // show first 5 data rows as preview
        });
      } catch {
        setExcelPreview(null);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExcelUpload = async () => {
    if (!excelFile) return;
    setExcelUploading(true);
    setExcelResult(null);
    try {
      const formData = new FormData();
      formData.append('file', excelFile);
      const res = await api.post('/medicines/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExcelResult(res.data);
      if (res.data.summary.inserted > 0) {
        // Refresh medicines list
        const medsRes = await api.get('/medicines?limit=100');
        setMedicines(medsRes.data.data);
        toast.success(`Imported ${res.data.summary.inserted} medicine(s)`);
      }
    } catch (err) {
      setExcelResult({ success: false, error: err.response?.data?.error || 'Upload failed' });
    } finally {
      setExcelUploading(false);
    }
  };

  const resetExcelModal = () => {
    setExcelFile(null);
    setExcelPreview(null);
    setExcelResult(null);
    if (excelInputRef.current) excelInputRef.current.value = '';
  };

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedMedicines = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medicines Management</h2>
          <p className="text-gray-500 text-sm">Manage your inventory, prices, and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { resetExcelModal(); setIsExcelModalOpen(true); }}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Upload Excel
          </button>
          <button
            onClick={() => openModal()}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Medicine
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.replace(/\s/g, ''))}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
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
            className="bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary px-3 py-2 w-full md:w-auto"
          >
            <option value="All">All</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedMedicines.map((med) => (
                  <tr key={med._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {med.image && med.image !== 'no-photo.jpg' ? (
                          <img src={med.image} alt={med.title || med.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1H9L8 4zm.5 5h7L15 10H9l-.5-1zm.5 5h7l-1 1H10l-.5-1z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{med.title || med.name}</p>
                        <p className="text-xs text-gray-500">
                          {med.packages?.length > 0
                            ? `${med.packages.length} pack${med.packages.length > 1 ? 's' : ''}`
                            : (med.packSize || '')}
                          {med.genericFor || med.genericName ? ` · ${med.genericFor || med.genericName}` : ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{med.category?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{med.sku ?? '—'}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{med.priceLabel || 'USD'} {med.pricePerUnit ?? med.price}</p>
                      {med.oldPrice || med.mrp ? (
                        <p className="text-xs text-gray-400 line-through">
                          {med.priceLabel || 'USD'} {med.oldPrice ?? med.mrp}
                        </p>
                      ) : null}
                      {med.discount ? (
                        <span className="text-xs text-emerald-600 font-semibold">{med.discount}% off</span>
                      ) : null}
                    </td>
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
                        <button onClick={() => openModal(med)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-teal-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.128-1.897l8.934-8.934Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button onClick={() => { setDeleteId(med._id); setDeleteError(''); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedMedicines.length === 0 && (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-sm">No medicines found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6 rounded-b-xl border-x border-b border-gray-100">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                  </span>{' '}
                  of <span className="font-medium">{filtered.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      aria-current={currentPage === page ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                        currentPage === page
                          ? 'z-10 bg-primary text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                          : 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Add/Edit Medicine Modal ─────────────────────────────────────────── */}
      {isModalOpen && current && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl p-6 shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{current._id ? 'Edit Medicine' : 'Add Medicine'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

              {/* Section 1: Core Info */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Core Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Title <span className="text-red-500">*</span></label>
                    <input type="text" value={current.title} onChange={e => setCurrent({...current, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Category <span className="text-red-500">*</span></label>
                    <select value={current.category} onChange={e => setCurrent({...current, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">SKU</label>
                    <input type="number" min="0" placeholder="e.g. 10012" value={current.sku} onChange={e => setCurrent({...current, sku: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <p className="text-[10px] text-gray-400 mt-0.5">Same SKU can be used for different pack sizes</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Brand (Optional)</label>
                    <select value={current.brand || ''} onChange={e => setCurrent({...current, brand: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">No Brand</option>
                      {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Description</label>
                    <textarea value={current.description} onChange={e => setCurrent({...current, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" rows="3" placeholder="General medicine description..." />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Packaging */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Pricing & Packaging</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Price Label</label>
                    <select value={current.priceLabel || 'USD'} onChange={e => setCurrent({...current, priceLabel: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Pack Size <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. 10 Tablets, 500mg Strip" value={current.packSize} onChange={e => setCurrent({...current, packSize: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Quantity Options <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="1, 2, 5, 10" value={current.quantityOptions} onChange={e => setCurrent({...current, quantityOptions: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
                    <p className="text-[10px] text-gray-400 mt-0.5">Comma-separated</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Price Per Unit ({current.priceLabel || 'USD'}) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0.01" 
                      placeholder="0.00" 
                      value={current.pricePerUnit} 
                      onChange={e => {
                        const val = e.target.value;
                        setCurrent(prev => ({
                          ...prev,
                          pricePerUnit: val,
                          totalPrice: val,
                          discount: updateDiscount(val, prev.oldPrice)
                        }));
                      }} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Old Price ({current.priceLabel || 'USD'})</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0.01" 
                      placeholder="Leave blank if no discount" 
                      value={current.oldPrice} 
                      onChange={e => {
                        const val = e.target.value;
                        setCurrent(prev => ({
                          ...prev,
                          oldPrice: val,
                          discount: updateDiscount(prev.totalPrice, val)
                        }));
                      }} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Discount (%)</label>
                    <input type="number" step="0.01" min="0" max="100" placeholder="0" value={current.discount} onChange={e => setCurrent({...current, discount: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Stock <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      min="1" 
                      step="1" 
                      placeholder="e.g. 100" 
                      value={current.stock} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val !== '' && Number(val) <= 0) {
                          toast.error('Stock must be greater than 0');
                        }
                        setCurrent({...current, stock: val});
                      }} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Status</label>
                    <select value={current.status} onChange={e => setCurrent({...current, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="Active">Active</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2b: Pack Pricing (multiple packs with independent prices) */}
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Pack Pricing (Optional)</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Offer multiple packs at different prices (e.g. 1 Pack $1, 10 Pack $8). When set, these override the price fields above on the product page.</p>
                  </div>
                  <button type="button" onClick={addPackage} className="shrink-0 text-xs font-semibold text-primary border border-primary/40 rounded-lg px-3 py-1.5 hover:bg-primary/5">+ Add Pack</button>
                </div>

                {(!current.packages || current.packages.length === 0) ? (
                  <p className="text-xs text-gray-400 italic">No packs added. The single price above will be used.</p>
                ) : (
                  <div className="space-y-3">
                    {current.packages.map((pkg, idx) => {
                      const price = Number(pkg.price) || 0;
                      const units = Number(pkg.units) || 0;
                      const perUnit = units > 0 ? (price / units).toFixed(2) : (price ? price.toFixed(2) : '0.00');
                      return (
                        <div key={idx} className="grid grid-cols-2 md:grid-cols-12 gap-3 items-end bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="md:col-span-3">
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">Pack Label</label>
                            <input type="text" placeholder="e.g. 10 Pack" value={pkg.label} onChange={e => updatePackage(idx, 'label', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">Units</label>
                            <input type="number" min="1" placeholder="10" value={pkg.units} onChange={e => updatePackage(idx, 'units', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">Price ({current.priceLabel || 'USD'})</label>
                            <input type="number" step="0.01" min="0" placeholder="8.00" value={pkg.price} onChange={e => updatePackage(idx, 'price', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">Old Price</label>
                            <input type="number" step="0.01" min="0" placeholder="optional" value={pkg.oldPrice} onChange={e => updatePackage(idx, 'oldPrice', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div className="md:col-span-2 flex flex-col gap-1">
                            <span className="text-[11px] font-semibold text-gray-600">Per unit</span>
                            <span className="text-sm font-medium text-gray-700 py-2">${perUnit}</span>
                          </div>
                          <div className="md:col-span-1 flex items-center justify-end gap-3 pb-2">
                            <label className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 cursor-pointer" title="Mark as Best Value (default selected)">
                              <input type="radio" name="popularPack" checked={Boolean(pkg.popular)} onChange={() => setPopularPackage(idx)} className="accent-primary" />
                              Best
                            </label>
                            <button type="button" onClick={() => removePackage(idx)} className="text-red-500 hover:text-red-600 text-lg leading-none" title="Remove pack">×</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 3: Product Details */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Product Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Generic For</label>
                    <input type="text" value={current.genericFor} onChange={e => setCurrent({...current, genericFor: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Acetaminophen" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Active Ingredient</label>
                    <input type="text" value={current.activeIngredient} onChange={e => setCurrent({...current, activeIngredient: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Paracetamol 500mg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Manufacturer</label>
                    <input type="text" value={current.manufacturer} onChange={e => setCurrent({...current, manufacturer: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Country of Origin</label>
                    <input type="text" value={current.countryOrigin} onChange={e => setCurrent({...current, countryOrigin: e.target.value.replace(/\d/g, '')})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. India" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Packaging</label>
                    <input type="text" value={current.packaging} onChange={e => setCurrent({...current, packaging: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 10 Tabs/Strip" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Storage</label>
                    <input type="text" value={current.storage} onChange={e => setCurrent({...current, storage: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Store below 25°C" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Delivery Time</label>
                    <input type="text" value={current.deliveryTime} onChange={e => setCurrent({...current, deliveryTime: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Usually delivers in 1-2 days" />
                  </div>
                </div>
              </div>

              {/* Section 4: Clinical Info */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Clinical Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Uses (Therapeutic / Dose Use)</label>
                    <textarea value={current.uses} onChange={e => setCurrent({...current, uses: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" rows="3" placeholder="List therapeutic uses, one per line..." />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Side Effects</label>
                    <textarea value={current.sideEffects} onChange={e => setCurrent({...current, sideEffects: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" rows="3" placeholder="List side effects, one per line..." />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">How To Use</label>
                    <textarea value={current.howToUse} onChange={e => setCurrent({...current, howToUse: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" rows="3" placeholder="Dosage and usage instructions..." />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Prescription</label>
                    <select value={current.prescription} onChange={e => setCurrent({...current, prescription: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="Required">Required</option>
                      <option value="Not Required">Not Required</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 5: Precautions */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Precautions</h4>
                <div className="space-y-3">
                  {current.precautions?.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                      <div className="flex gap-2 items-center">
                        <input type="text" placeholder="Label (e.g. Alcohol, Pregnancy)" value={item.label} onChange={e => {
                          const updated = [...current.precautions];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setCurrent({...current, precautions: updated});
                        }} className="flex-1 text-xs p-1.5 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary" />
                        <select value={item.status} onChange={e => {
                          const updated = [...current.precautions];
                          updated[idx] = { ...updated[idx], status: e.target.value };
                          setCurrent({...current, precautions: updated});
                        }} className="text-xs p-1.5 rounded border border-gray-200">
                          <option value="Safe">Safe</option>
                          <option value="Caution">Caution</option>
                          <option value="Unsafe">Unsafe</option>
                          <option value="Consult Doctor">Consult Doctor</option>
                        </select>
                        <button type="button" onClick={() => setCurrent({...current, precautions: current.precautions.filter((_, i) => i !== idx)})} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                      </div>
                      <textarea placeholder="Precaution details..." value={item.description} onChange={e => {
                        const updated = [...current.precautions];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setCurrent({...current, precautions: updated});
                      }} className="w-full text-xs p-1.5 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary" rows="2" />
                    </div>
                  ))}
                  <button type="button" onClick={() => setCurrent({...current, precautions: [...(current.precautions || []), { label: '', status: 'Caution', description: '' }]})} className="text-xs text-primary font-bold hover:underline">+ Add Precaution</button>
                </div>
              </div>

              {/* Section 6: Media & Flags */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Media & Display</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Upload Image</label>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setCurrent(prev => ({...prev, image: '__uploading__'}));
                      try {
                        const url = await uploadImage(file, 'cure-basket/medicines');
                        setCurrent(prev => ({...prev, image: url}));
                      } catch {
                        setCurrent(prev => ({...prev, image: ''}));
                      }
                    }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    {current.image === '__uploading__' && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
                    {current.image && current.image !== 'no-photo.jpg' && current.image !== '__uploading__' && (
                      <img src={current.image} alt="Preview" className="mt-2 w-20 h-20 object-contain rounded-lg border border-gray-100" />
                    )}
                  </div>
                  <div className="flex flex-col gap-3 pt-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={current.isNewAndBest || false} onChange={e => setCurrent({...current, isNewAndBest: e.target.checked})} className="w-4 h-4 rounded" />
                      Now Available
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={current.isBestSeller || false} onChange={e => setCurrent({...current, isBestSeller: e.target.checked})} className="w-4 h-4 rounded" />
                      Customer Favourite
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 7: FAQs */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">FAQs</h4>
                <div className="space-y-3">
                  {current.faqs?.map((faq, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2 relative">
                      <button type="button" onClick={() => setCurrent({...current, faqs: current.faqs.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg">×</button>
                      <input type="text" placeholder="Question" value={faq.question} onChange={e => {
                        const newFaqs = [...current.faqs];
                        newFaqs[idx] = { ...newFaqs[idx], question: e.target.value };
                        setCurrent({...current, faqs: newFaqs});
                      }} className="w-full text-xs p-1.5 rounded border border-gray-200 pr-8 focus:outline-none focus:ring-1 focus:ring-primary" />
                      <textarea placeholder="Answer" value={faq.answer} onChange={e => {
                        const newFaqs = [...current.faqs];
                        newFaqs[idx] = { ...newFaqs[idx], answer: e.target.value };
                        setCurrent({...current, faqs: newFaqs});
                      }} className="w-full text-xs p-1.5 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary" rows="2" />
                    </div>
                  ))}
                  <button type="button" onClick={() => setCurrent({...current, faqs: [...(current.faqs || []), { question: '', answer: '' }]})} className="text-xs text-primary font-bold hover:underline">+ Add FAQ</button>
                </div>
              </div>

              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{saveError}</div>
              )}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button 
                  type="submit" 
                  disabled={saving || current.image === '__uploading__'} 
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : (current.image === '__uploading__' ? 'Uploading Image...' : 'Save Medicine')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Excel Upload Modal ──────────────────────────────────────────────── */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Bulk Upload via Excel</h3>
                <p className="text-sm text-gray-500 mt-0.5">Upload an Excel file to import multiple medicines at once. Existing medicines (matched by title + pack size) will be skipped.</p>
              </div>
              <button onClick={() => setIsExcelModalOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
                </svg>
              </button>
            </div>

            {/* Step 1: Download Template */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Step 1: Download the template</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Fill in the template with your medicine data and upload it below.</p>
                </div>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Template
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {TEMPLATE_HEADERS.map(h => (
                  <span key={h} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono">{h}</span>
                ))}
              </div>
              <p className="text-[11px] text-emerald-700 mt-2">
                <span className="font-semibold">Packs</span> (optional): add multiple pack sizes with their own prices, e.g.{' '}
                <span className="font-mono bg-emerald-100 px-1 rounded">10 Tablets:10:5.00:6.00 | 30 Tablets:30:13.50:18.00</span>{' '}
                — each pack is <span className="font-mono">Label:Units:Price:OldPrice</span> (OldPrice optional), separated by <span className="font-mono">|</span>. Leave blank to use the single Pack Size + Price fields instead.
              </p>
            </div>

            {/* Step 2: Upload File */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">Step 2: Upload your filled Excel file</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <input
                  ref={excelInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelFileChange}
                  className="hidden"
                  id="excel-upload-input"
                />
                <label htmlFor="excel-upload-input" className="cursor-pointer">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {excelFile ? (
                    <p className="text-sm font-semibold text-primary">{excelFile.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Click to select an <span className="font-semibold text-gray-700">.xlsx</span> or <span className="font-semibold text-gray-700">.xls</span> file</p>
                  )}
                </label>
                {excelFile && (
                  <button type="button" onClick={resetExcelModal} className="mt-2 text-xs text-red-500 hover:underline">Remove file</button>
                )}
              </div>
            </div>

            {/* Preview */}
            {excelPreview && !excelResult && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Preview (first 5 rows)</p>
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        {excelPreview.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {excelPreview.rows.map((row, ri) => (
                        <tr key={ri}>
                          {excelPreview.headers.map((_, ci) => (
                            <td key={ci} className="px-3 py-2 text-gray-700 whitespace-nowrap max-w-[140px] truncate">{String(row[ci] ?? '')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Upload Result */}
            {excelResult && (
              <div className={`mb-5 p-4 rounded-xl border ${excelResult.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                {excelResult.success ? (
                  <>
                    <p className="font-semibold text-emerald-800 text-sm mb-2">Upload Complete</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-emerald-700 font-bold">{excelResult.summary.inserted} inserted</span>
                      <span className="text-gray-500">{excelResult.summary.skipped} skipped (duplicates)</span>
                      {excelResult.summary.errors > 0 && (
                        <span className="text-red-600 font-semibold">{excelResult.summary.errors} errors</span>
                      )}
                    </div>
                    {excelResult.errors?.length > 0 && (
                      <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                        {excelResult.errors.map((e, i) => (
                          <p key={i} className="text-xs text-red-600">Row {e.row}: {e.error}</p>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-red-700 text-sm font-semibold">{excelResult.error}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setIsExcelModalOpen(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50"
              >
                {excelResult?.success ? 'Close' : 'Cancel'}
              </button>
              {!excelResult && (
                <button
                  type="button"
                  onClick={handleExcelUpload}
                  disabled={!excelFile || excelUploading}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {excelUploading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Importing...
                    </>
                  ) : 'Upload & Import'}
                </button>
              )}
              {excelResult?.success && excelResult.summary.errors > 0 && (
                <button
                  type="button"
                  onClick={resetExcelModal}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90"
                >
                  Upload Another File
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ────────────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete medicine?</h3>
            <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
            {deleteError && <p className="text-sm text-red-600 mb-3">{deleteError}</p>}
            <div className="flex justify-end gap-3">
              <button onClick={() => { setDeleteId(null); setDeleteError(''); }} disabled={deleting} className="px-4 py-2 border border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              <button onClick={confirmDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 disabled:opacity-60">{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Medicines;
