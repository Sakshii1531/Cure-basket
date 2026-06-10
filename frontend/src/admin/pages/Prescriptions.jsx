import { SkeletonTable } from '../components/Skeleton';
import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const STATUS_COLORS = {
  Pending:  'bg-amber-50 text-amber-600',
  Reviewed: 'bg-blue-50 text-blue-600',
  Dispensed:'bg-emerald-50 text-emerald-600',
  Rejected: 'bg-red-50 text-red-600',
};

const ORDER_STATUS_COLORS = {
  Delivered: 'text-emerald-600',
  Shipped:   'text-blue-600',
  Processing:'text-amber-600',
  Cancelled: 'text-red-600',
  Pending:   'text-gray-500',
};

function Prescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // For the order detail side-panel (reuse the Orders panel pattern)
  const [orderPanelId, setOrderPanelId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    api.get('/prescriptions')
      .then(res => setPrescriptions(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load prescriptions'))
      .finally(() => setLoading(false));
  }, []);

  // Load order detail when panel is opened
  useEffect(() => {
    if (!orderPanelId) { setOrderDetail(null); return; }
    setOrderLoading(true);
    api.get(`/orders/${orderPanelId}`)
      .then(res => setOrderDetail(res.data.data))
      .catch(() => toast.error('Failed to load order details'))
      .finally(() => setOrderLoading(false));
  }, [orderPanelId]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/prescriptions/${id}/status`, { status });
      setPrescriptions(prev => prev.map(p => p._id === id ? { ...p, ...res.data.data } : p));
      toast.success('Prescription status updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    return `${base}${path}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
        <p className="text-gray-500 text-sm">Review and manage user uploaded prescriptions.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {loading ? (
        <SkeletonTable />
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
                  <th className="px-6 py-4">Linked Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {prescriptions.map((rx) => {
                  const linkedOrder = rx.order;
                  return (
                    <tr key={rx._id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </td>

                      {/* Medicine */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                            {rx.medicine?.image ? (
                              <img src={rx.medicine.image} alt={rx.medicine.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="font-bold text-gray-900 line-clamp-1">{rx.medicine?.name || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Pkg/Qty */}
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-gray-900">{rx.packageLabel || '—'}</div>
                        <div className="text-[10px] text-gray-400">Qty: {rx.quantity || '—'}</div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{rx.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-400 font-normal">{rx.user?.email}</p>
                      </td>

                      {/* Linked Order */}
                      <td className="px-6 py-4">
                        {linkedOrder ? (
                          <button
                            onClick={() => setOrderPanelId(linkedOrder._id || linkedOrder)}
                            className="group flex items-center gap-1.5 px-3 py-1.5 bg-[#006D6D]/10 hover:bg-[#006D6D]/20 text-[#006D6D] rounded-lg text-xs font-bold transition-colors border border-[#006D6D]/20"
                            title={`View Order #${(linkedOrder._id || linkedOrder).toString().slice(-8).toUpperCase()}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            <span className="font-mono">
                              #{(linkedOrder._id || linkedOrder).toString().slice(-8).toUpperCase()}
                            </span>
                            {linkedOrder.status && (
                              <span className={`text-[10px] font-bold ${ORDER_STATUS_COLORS[linkedOrder.status] || 'text-gray-500'}`}>
                                · {linkedOrder.status}
                              </span>
                            )}
                            <svg className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                            </svg>
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-300 font-medium italic">No order linked</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[rx.status] || 'bg-gray-50 text-gray-600'}`}>
                          {rx.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {rx.image && (
                            <button
                              onClick={() => setSelectedImage(getImageUrl(rx.image))}
                              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
                            >
                              View Rx
                            </button>
                          )}
                          <select
                            value={rx.status}
                            onChange={(e) => handleStatusChange(rx._id, e.target.value)}
                            className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Dispensed">Dispensed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Prescription Image Lightbox ───────────────────────────────────── */}
      {selectedImage && (() => {
        const isPdf = selectedImage.toLowerCase().split('?')[0].endsWith('.pdf');
        return (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
            <div
              className={`relative bg-white rounded-xl overflow-hidden p-2 ${isPdf ? 'w-[90vw] max-w-4xl h-[85vh] flex flex-col' : 'max-w-3xl max-h-[90vh]'}`}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 text-white hover:bg-black/70 rounded-full transition-colors z-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
                </svg>
              </button>
              {isPdf ? (
                <iframe src={selectedImage} title="Prescription PDF" className="w-full h-full border-0 rounded-lg grow" />
              ) : (
                <img src={selectedImage} alt="Prescription" className="max-w-full max-h-[80vh] object-contain" />
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Order Detail Side Panel ───────────────────────────────────────── */}
      {orderPanelId && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setOrderPanelId(null)}
            style={{ animation: 'fadeIn 0.2s ease' }}
          />

          {/* Slide-in panel */}
          <div
            className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-white z-50 shadow-2xl flex flex-col"
            style={{ animation: 'slideIn 0.3s cubic-bezier(0.32, 0.72, 0, 1)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <div>
                  <h2 className="text-[16px] font-black text-gray-900">
                    Order #{orderPanelId.toString().slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-[11px] text-gray-400">Linked to this prescription</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { navigate('/admin/orders'); setOrderPanelId(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
                  title="Go to Orders page"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Open in Orders
                </button>
                <button
                  onClick={() => setOrderPanelId(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {orderLoading ? (
                <div className="flex items-center justify-center py-20">
                  <svg className="animate-spin h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                </div>
              ) : !orderDetail ? (
                <p className="text-sm text-gray-400 text-center py-10">Order not found.</p>
              ) : (() => {
                const o = orderDetail;
                const addr = o.shippingAddress || {};
                return (
                  <div className="space-y-5">
                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-3">
                      <InfoCard label="Order ID" value={`#${o._id.slice(-8).toUpperCase()}`} mono />
                      <InfoCard label="Date" value={new Date(o.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})} />
                      <InfoCard label="Order Status" value={o.status} colorClass={ORDER_STATUS_COLORS[o.status]} />
                      <InfoCard label="Payment" value={o.paymentStatus} colorClass={o.paymentStatus === 'Paid' ? 'text-emerald-600' : o.paymentStatus === 'Failed' ? 'text-red-600' : 'text-amber-600'} />
                      <InfoCard label="Total" value={`$${Number(o.totalAmount).toFixed(2)}`} bold />
                    </div>

                    {/* Customer */}
                    <section>
                      <SLabel>Customer</SLabel>
                      <div className="bg-gray-50 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase shrink-0">
                          {o.user?.name ? o.user.name.split(' ').map(n => n[0]).join('').slice(0,2) : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{o.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{o.user?.email || '—'}</p>
                        </div>
                      </div>
                    </section>

                    {/* Items */}
                    <section>
                      <SLabel>Items ({(o.items || []).length})</SLabel>
                      <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                        {(o.items || []).map((item, i) => (
                          <div key={i} className="flex gap-3 p-3 bg-white">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                              {item.medicine?.image
                                ? <img src={item.medicine.image} alt={item.name} className="w-full h-full object-contain p-1"/>
                                : <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-gray-900 truncate">{item.name}</p>
                              <p className="text-[11px] text-gray-400">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                            </div>
                            <p className="text-[13px] font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                        <div className="flex justify-between px-3 py-2.5 bg-gray-50">
                          <span className="text-xs font-black text-gray-700">Total</span>
                          <span className="text-sm font-black text-primary">${Number(o.totalAmount).toFixed(2)}</span>
                        </div>
                      </div>
                    </section>

                    {/* Shipping */}
                    {(addr.name || addr.street) && (
                      <section>
                        <SLabel>Shipping Address</SLabel>
                        <div className="bg-gray-50 rounded-xl p-3.5 space-y-0.5">
                          {addr.name && <p className="text-sm font-bold text-gray-900">{addr.name}</p>}
                          {addr.street && <p className="text-xs text-gray-500">{addr.street}</p>}
                          {addr.city && <p className="text-xs text-gray-500">{addr.city}</p>}
                          {addr.phone && <p className="text-xs text-gray-500 flex items-center gap-1 pt-1">📞 {addr.phone}</p>}
                        </div>
                      </section>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function SLabel({ children }) {
  return <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{children}</p>;
}

function InfoCard({ label, value, mono, bold, colorClass }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3.5 py-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-bold truncate ${colorClass || 'text-gray-900'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  );
}

export default Prescriptions;
