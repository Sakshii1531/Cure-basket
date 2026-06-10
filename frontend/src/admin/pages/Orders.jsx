import { SkeletonTable } from '../components/Skeleton';
import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const STATUS_COLORS = {
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Shipped:   'bg-blue-50 text-blue-700 border-blue-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  Processing:'bg-amber-50 text-amber-700 border-amber-200',
  Pending:   'bg-gray-100 text-gray-600 border-gray-200',
};

const PAYMENT_COLORS = {
  Paid:    'bg-emerald-50 text-emerald-600',
  Failed:  'bg-red-50 text-red-600',
  Pending: 'bg-amber-50 text-amber-600',
};

const RX_STATUS_COLORS = {
  Pending:  'bg-amber-50 text-amber-600',
  Reviewed: 'bg-blue-50 text-blue-600',
  Dispensed:'bg-emerald-50 text-emerald-600',
  Rejected: 'bg-red-50 text-red-600',
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  return `${base}${path}`;
};

/* ─── Order Detail Side Panel ───────────────────────────────────────────── */
export function OrderDetailPanel({ order, onClose, onStatusChange }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [rxLoading, setRxLoading] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [updatingRx, setUpdatingRx] = useState({});

  // Lock body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Load prescriptions for this user when panel opens
  useEffect(() => {
    if (!order?.user?._id && !order?.user) return;
    const userId = order.user?._id || order.user;
    setRxLoading(true);
    api.get('/prescriptions', { params: { user: userId, limit: 50 } })
      .then(res => setPrescriptions(res.data.data || []))
      .catch(() => {})
      .finally(() => setRxLoading(false));
  }, [order]);

  const handleRxStatusChange = async (rxId, status) => {
    setUpdatingRx(prev => ({ ...prev, [rxId]: true }));
    try {
      const res = await api.put(`/prescriptions/${rxId}/status`, { status });
      setPrescriptions(prev => prev.map(p => p._id === rxId ? res.data.data : p));
      toast.success('Prescription status updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update prescription');
    } finally {
      setUpdatingRx(prev => ({ ...prev, [rxId]: false }));
    }
  };

  if (!order) return null;

  const addr = order.shippingAddress || {};
  const customer = order.user || {};
  const shortId = order._id.slice(-8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease' }}
      />

      {/* Slide-in panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[560px] bg-white z-50 shadow-2xl flex flex-col"
        style={{ animation: 'slideIn 0.3s cubic-bezier(0.32, 0.72, 0, 1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h2 className="text-lg font-black text-gray-900 font-mono">#{shortId}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">{date}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0 mt-0.5"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ── Status control ── */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-sm font-bold text-gray-700 flex-1">Order Status</span>
            <select
              value={order.status}
              onChange={e => onStatusChange(order._id, e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* ── Customer Info ── */}
          <section>
            <SectionLabel icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            }>Customer</SectionLabel>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-base uppercase shrink-0">
                {customer.name ? customer.name.split(' ').map(n => n[0]).join('').slice(0,2) : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-gray-900 truncate">{customer.name || 'Unknown'}</p>
                <p className="text-[12px] text-gray-400 truncate">{customer.email || '—'}</p>
                {customer.phone && <p className="text-[12px] text-gray-400 mt-0.5">{customer.phone}</p>}
              </div>
            </div>
          </section>

          {/* ── Ordered Items ── */}
          <section>
            <SectionLabel icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            }>Items Ordered ({(order.items || []).length})</SectionLabel>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3.5 bg-white hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    {item.medicine?.image
                      ? <img src={item.medicine.image} alt={item.name} className="w-full h-full object-contain p-1 rounded-lg" />
                      : <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold text-gray-900 truncate leading-snug">{item.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                  </div>
                  <p className="text-[13.5px] font-black text-gray-900 shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              {/* Total row */}
              <div className="flex justify-between items-center px-3.5 py-3 bg-gray-50">
                <span className="text-sm font-black text-gray-700">Order Total</span>
                <span className="text-base font-black text-primary">${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* ── Payment ── */}
          <section>
            <SectionLabel icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            }>Payment</SectionLabel>
            <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-[13px] font-bold text-gray-900">Payment Status</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Order #{shortId}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${PAYMENT_COLORS[order.paymentStatus] || 'bg-gray-50 text-gray-500'}`}>
                {order.paymentStatus}
              </span>
            </div>
          </section>

          {/* ── Shipping Address ── */}
          {(addr.name || addr.street || addr.city || addr.phone) && (
            <section>
              <SectionLabel icon={
                <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></>
              }>Shipping Address</SectionLabel>
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                {addr.name && <p className="text-[13.5px] font-bold text-gray-900">{addr.name}</p>}
                {addr.street && <p className="text-[12.5px] text-gray-500">{addr.street}</p>}
                {addr.city && <p className="text-[12.5px] text-gray-500">{addr.city}</p>}
                {addr.phone && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <p className="text-[12.5px] text-gray-500">{addr.phone}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Prescriptions ── */}
          <section>
            <SectionLabel icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            }>Prescriptions</SectionLabel>

            {rxLoading ? (
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <svg className="animate-spin w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span className="text-sm text-gray-400">Loading prescriptions...</span>
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-[12px] text-gray-400 font-medium">No prescriptions uploaded by this customer.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map(rx => {
                  const imgUrl = getImageUrl(rx.image);
                  const isPdf = imgUrl?.toLowerCase().split('?')[0].endsWith('.pdf');
                  return (
                    <div key={rx._id} className="border border-gray-100 rounded-xl p-4 bg-white space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail */}
                          <div
                            className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                            onClick={() => imgUrl && setLightboxImg(imgUrl)}
                            title="Click to view full image"
                          >
                            {imgUrl ? (
                              isPdf ? (
                                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                              ) : (
                                <img src={imgUrl} alt="Prescription" className="w-full h-full object-cover"/>
                              )
                            ) : (
                              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-[12px] font-bold text-gray-900 truncate">
                              {rx.medicine?.name || 'General Prescription'}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {new Date(rx.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
                            </p>
                            {rx.packageLabel && (
                              <p className="text-[11px] text-gray-400">Pkg: {rx.packageLabel} {rx.quantity ? `· Qty: ${rx.quantity}` : ''}</p>
                            )}
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${RX_STATUS_COLORS[rx.status] || 'bg-gray-50 text-gray-500'}`}>
                          {rx.status}
                        </span>
                      </div>

                      {/* Actions row */}
                      <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                        {imgUrl && (
                          <button
                            onClick={() => setLightboxImg(imgUrl)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            View
                          </button>
                        )}
                        <select
                          value={rx.status}
                          disabled={!!updatingRx[rx._id]}
                          onChange={e => handleRxStatusChange(rx._id, e.target.value)}
                          className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary bg-white disabled:opacity-60"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Dispensed">Dispensed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <div className="pb-4"/>
        </div>
      </div>

      {/* Prescription Lightbox */}
      {lightboxImg && (() => {
        const isPdf = lightboxImg.toLowerCase().split('?')[0].endsWith('.pdf');
        return (
          <div
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <div
              className={`relative bg-white rounded-2xl overflow-hidden ${isPdf ? 'w-[90vw] max-w-4xl h-[85vh] flex flex-col' : 'max-w-3xl max-h-[90vh]'}`}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center z-10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
              {isPdf
                ? <iframe src={lightboxImg} title="Prescription PDF" className="w-full flex-1 border-0"/>
                : <img src={lightboxImg} alt="Prescription" className="max-w-full max-h-[85vh] object-contain"/>
              }
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}

/* ─── Section Label helper ─────────────────────────────────────────────── */
function SectionLabel({ icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{children}</p>
    </div>
  );
}

/* ─── Main Orders Page ─────────────────────────────────────────────────── */
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { status });
      const updated = res.data.data;
      setOrders(prev => prev.map(o => o._id === id ? updated : o));
      // Keep selected order in sync
      if (selectedOrder?._id === id) setSelectedOrder(updated);
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-gray-500 text-sm">Manage and track customer orders.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {loading ? (
        <SkeletonTable />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-400 text-sm font-medium">No orders placed yet.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className={`text-sm text-gray-700 hover:bg-gray-50 transition-colors ${selectedOrder?._id === order._id ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-6 py-4 font-bold text-primary font-mono text-xs">
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{order.user?.name || 'Unknown'}</p>
                        {order.user?.email && (
                          <p className="text-[11px] text-gray-400 truncate max-w-[150px]">{order.user.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">${Number(order.totalAmount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${PAYMENT_COLORS[order.paymentStatus] || 'bg-gray-50 text-gray-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details button */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                          View
                        </button>
                        {/* Status dropdown */}
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
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

      {/* Order Detail Side Panel */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default Orders;
