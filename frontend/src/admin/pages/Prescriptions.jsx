import { SkeletonTable } from '../components/Skeleton';
import { toast } from 'sonner';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

/* ── Constants ──────────────────────────────────────────────────────────── */
const STATUS_COLORS = {
  Pending:  'bg-amber-50 text-amber-600 border-amber-200',
  Reviewed: 'bg-blue-50 text-blue-600 border-blue-200',
  Dispensed:'bg-emerald-50 text-emerald-600 border-emerald-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
};

const ORDER_STATUS_COLORS = {
  Delivered: 'text-emerald-600',
  Shipped:   'text-blue-600',
  Processing:'text-amber-600',
  Cancelled: 'text-red-600',
  Pending:   'text-gray-500',
};

const ORDER_BADGE_COLORS = {
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Shipped:   'bg-blue-50 text-blue-700 border-blue-200',
  Processing:'bg-amber-50 text-amber-700 border-amber-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  Pending:   'bg-gray-100 text-gray-600 border-gray-200',
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function getImageUrl(p) {
  if (!p) return null;
  if (p.startsWith('http') || p.startsWith('data:')) return p;
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  return `${base}${p}`;
}

function SLabel({ children }) {
  return <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{children}</p>;
}

function InfoCard({ label, value, mono, colorClass }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3.5 py-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-bold truncate ${colorClass || 'text-gray-900'} ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </p>
    </div>
  );
}

/* ── Prescription Detail Panel ───────────────────────────────────────────── */
function PrescriptionDetailPanel({ rx, onClose, onStatusChange, onDelete, onOpenOrder }) {
  const imgUrl = getImageUrl(rx.image);
  const isPdf  = imgUrl?.toLowerCase().split('?')[0].endsWith('.pdf');
  const [lightbox, setLightbox] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const medicineName = rx.medicine?.name || (rx.order?.items && rx.order.items.map(i => i.name).join(', ')) || 'N/A';
  const packageLabel = rx.packageLabel || '—';
  const quantityLabel = rx.quantity?.toString() || (rx.order?.items && rx.order.items.map(i => i.quantity).join(', ')) || '—';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(rx._id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/45 z-40 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease' }}
      />
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[520px] bg-white z-50 shadow-2xl flex flex-col"
        style={{ animation: 'slideIn 0.3s cubic-bezier(0.32,0.72,0,1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-[16px] font-black text-gray-900">Prescription Details</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Uploaded {new Date(rx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Delete button */}
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deleting ? 'Deleting…' : 'Confirm'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Prescription document — image/PDF for uploads, contact info for fax/email */}
          <section>
            <SLabel>Prescription Document</SLabel>
            {rx.submissionMethod === 'fax' ? (
              <div className="border border-gray-100 rounded-2xl bg-gray-50 px-5 py-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-600 border border-purple-200">Sent via Fax</span>
                </div>
                <p className="text-xs text-gray-400 mb-0.5">Customer's fax number</p>
                <p className="text-lg font-black text-gray-900 font-mono">{rx.faxNumber || '—'}</p>
                <p className="text-xs text-gray-400 mt-2">Check your fax machine for a prescription sent from this number.</p>
              </div>
            ) : rx.submissionMethod === 'email' ? (
              <div className="border border-gray-100 rounded-2xl bg-gray-50 px-5 py-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">Sent via Email</span>
                </div>
                <p className="text-xs text-gray-400 mb-0.5">Customer's sender email</p>
                <p className="text-base font-black text-gray-900 break-all">{rx.senderEmail || '—'}</p>
                <p className="text-xs text-gray-400 mt-2">Search your inbox for a prescription sent from this address.</p>
              </div>
            ) : imgUrl ? (
              <div
                className="relative border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 cursor-pointer group"
                onClick={() => setLightbox(true)}
                style={{ minHeight: 160 }}
              >
                {isPdf ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <svg className="w-14 h-14 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <p className="text-sm font-bold text-gray-700">PDF Document</p>
                    <p className="text-xs text-gray-400">Click to open</p>
                  </div>
                ) : (
                  <img
                    src={imgUrl}
                    alt="Prescription"
                    className="w-full max-h-[240px] object-contain p-2"
                  />
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Click to view full size
                  </span>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl py-10 text-center">
                <p className="text-sm text-gray-400">No document attached</p>
              </div>
            )}
          </section>

          {/* Info grid */}
          <section>
            <SLabel>Details</SLabel>
            <div className="grid grid-cols-2 gap-2.5">
              <InfoCard label="Status" value={rx.status} colorClass={
                rx.status === 'Dispensed' ? 'text-emerald-600' :
                rx.status === 'Reviewed'  ? 'text-blue-600'    :
                rx.status === 'Rejected'  ? 'text-red-600'     : 'text-amber-600'
              }/>
              <InfoCard label="Method" value={
                rx.submissionMethod === 'fax' ? 'Fax' :
                rx.submissionMethod === 'email' ? 'Email' : 'Upload'
              } />
              <InfoCard label="Medicine" value={medicineName} />
              <InfoCard label="Package" value={packageLabel} />
              <InfoCard label="Quantity" value={quantityLabel} />
            </div>
          </section>

          {/* Notes */}
          {rx.notes && (
            <section>
              <SLabel>Notes</SLabel>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800 leading-relaxed">
                {rx.notes}
              </div>
            </section>
          )}

          {/* Customer */}
          <section>
            <SLabel>Customer</SLabel>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase shrink-0">
                {rx.user?.name ? rx.user.name.split(' ').map(n => n[0]).join('').slice(0,2) : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{rx.user?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-400 truncate">{rx.user?.email || '—'}</p>
              </div>
            </div>
          </section>

          {/* Linked Order */}
          <section>
            <SLabel>Linked Order</SLabel>
            {rx.order ? (
              <div className="border border-gray-100 rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                    <p className="text-sm font-black text-gray-900 font-mono">
                      #{(rx.order._id || rx.order).toString().slice(-8).toUpperCase()}
                    </p>
                    {rx.order.status && (
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${ORDER_BADGE_COLORS[rx.order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {rx.order.status}
                      </span>
                    )}
                    {rx.order.totalAmount != null && (
                      <p className="text-xs text-gray-400 mt-1">${Number(rx.order.totalAmount).toFixed(2)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenOrder(rx.order._id || rx.order)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    View Order
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 italic">No order linked to this prescription</p>
              </div>
            )}
          </section>

          {/* Status update */}
          <section>
            <SLabel>Update Status</SLabel>
            <div className="flex gap-2 flex-wrap">
              {['Pending','Reviewed','Dispensed','Rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange(rx._id, s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    rx.status === s
                      ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <div className="pb-4"/>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <div
            className={`relative bg-white rounded-2xl overflow-hidden ${isPdf ? 'w-[90vw] max-w-4xl h-[85vh] flex flex-col' : 'max-w-3xl max-h-[90vh]'}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center z-10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
            {isPdf
              ? <iframe src={imgUrl} title="Prescription PDF" className="w-full flex-1 border-0"/>
              : <img src={imgUrl} alt="Prescription" className="max-w-full max-h-[85vh] object-contain"/>
            }
          </div>
        </div>
      )}
    </>
  );
}

/* ── Order Detail Panel ──────────────────────────────────────────────────── */
function OrderDetailPanel({ orderId, onClose, navigate }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    api.get(`/orders/${orderId}`)
      .then(res => setOrder(res.data.data))
      .catch(() => toast.error('Failed to load order details'))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/45 z-[55] backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease' }}
      />
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[60] shadow-2xl flex flex-col"
        style={{ animation: 'slideIn 0.3s cubic-bezier(0.32,0.72,0,1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <div>
              <h2 className="text-[15px] font-black text-gray-900">
                {order ? `Order #${order._id.slice(-8).toUpperCase()}` : 'Order Details'}
              </h2>
              <p className="text-[11px] text-gray-400">Linked to this prescription</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { navigate('/admin/orders'); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Open in Orders
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <svg className="animate-spin h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : !order ? (
            <p className="text-sm text-gray-400 text-center py-10">Order not found.</p>
          ) : (
            <div className="space-y-5">
              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <InfoCard label="Order ID" value={`#${order._id.slice(-8).toUpperCase()}`} mono />
                <InfoCard label="Date" value={new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} />
                <InfoCard label="Status" value={order.status} colorClass={ORDER_STATUS_COLORS[order.status]} />
                <InfoCard label="Payment" value={order.paymentStatus} colorClass={order.paymentStatus==='Paid'?'text-emerald-600':order.paymentStatus==='Failed'?'text-red-600':'text-amber-600'} />
                <InfoCard label="Total" value={`$${Number(order.totalAmount).toFixed(2)}`} />
              </div>

              {/* Customer */}
              <section>
                <SLabel>Customer</SLabel>
                <div className="bg-gray-50 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase shrink-0">
                    {order.user?.name ? order.user.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email || '—'}</p>
                  </div>
                </div>
              </section>

              {/* Items */}
              <section>
                <SLabel>Items Ordered ({(order.items||[]).length})</SLabel>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {(order.items||[]).map((item,i) => (
                    <div key={i} className="flex gap-3 p-3 bg-white">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        {item.medicine?.image
                          ? <img src={item.medicine.image} alt={item.name} className="w-full h-full object-contain p-1"/>
                          : <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                      </div>
                      <p className="text-[13px] font-black text-gray-900 shrink-0">${(item.price*item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between px-3 py-2.5 bg-gray-50">
                    <span className="text-xs font-black text-gray-700">Total</span>
                    <span className="text-sm font-black text-primary">${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </section>

              {/* Shipping */}
              {(order.shippingAddress?.name || order.shippingAddress?.street) && (
                <section>
                  <SLabel>Shipping Address</SLabel>
                  <div className="bg-gray-50 rounded-xl p-3.5 space-y-0.5">
                    {order.shippingAddress.name   && <p className="text-sm font-bold text-gray-900">{order.shippingAddress.name}</p>}
                    {order.shippingAddress.street && <p className="text-xs text-gray-500">{order.shippingAddress.street}</p>}
                    {order.shippingAddress.city   && <p className="text-xs text-gray-500">{order.shippingAddress.city}</p>}
                    {order.shippingAddress.phone  && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Main Prescriptions page ─────────────────────────────────────────────── */
function Prescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Panels
  const [selectedRx,  setSelectedRx]  = useState(null); // prescription detail panel
  const [orderPanelId, setOrderPanelId] = useState(null); // order detail panel
  const [deletingId,  setDeletingId]  = useState(null);  // row-level inline delete confirm

  useEffect(() => {
    api.get('/prescriptions')
      .then(res => setPrescriptions(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load prescriptions'))
      .finally(() => setLoading(false));
  }, []);

  /* ── Handlers ── */
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/prescriptions/${id}/status`, { status });
      setPrescriptions(prev => prev.map(p => p._id === id ? { ...p, ...res.data.data } : p));
      // keep panel in sync
      if (selectedRx?._id === id) setSelectedRx(prev => ({ ...prev, ...res.data.data }));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/prescriptions/${id}`);
      setPrescriptions(prev => prev.filter(p => p._id !== id));
      setDeletingId(null);
      toast.success('Prescription deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete prescription');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
        <p className="text-gray-500 text-sm">Review and manage user uploaded prescriptions.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {loading ? (
        <SkeletonTable />
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
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
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Medicine</th>
                  <th className="px-5 py-4">Pkg / Qty</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Linked Order</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {prescriptions.map((rx) => {
                  const linkedOrder = rx.order;
                  const isDeleting  = deletingId === rx._id;

                  const medicineName = rx.medicine?.name || (linkedOrder?.items && linkedOrder.items.map(i => i.name).join(', ')) || 'N/A';
                  const medicineImage = rx.medicine?.image || linkedOrder?.items?.[0]?.medicine?.image;
                  const packageLabel = rx.packageLabel || '—';
                  const quantityLabel = rx.quantity?.toString() || (linkedOrder?.items && linkedOrder.items.map(i => i.quantity).join(', ')) || '—';

                  return (
                    <tr
                      key={rx._id}
                      className={`text-sm text-gray-700 transition-colors ${selectedRx?._id === rx._id ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                    >
                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </td>

                      {/* Medicine */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                            {medicineImage
                              ? <img src={medicineImage} alt={medicineName} className="w-full h-full object-contain p-1"/>
                              : <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            }
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-gray-900 max-w-[130px] truncate text-[13px]">
                              {medicineName}
                            </span>
                            {rx.submissionMethod === 'fax' && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-200">FAX</span>
                            )}
                            {rx.submissionMethod === 'email' && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200">EMAIL</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Pkg/Qty */}
                      <td className="px-5 py-4">
                        <div className="text-xs font-bold text-gray-900">{packageLabel}</div>
                        <div className="text-[10px] text-gray-400">Qty: {quantityLabel}</div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900 text-[13px]">{rx.user?.name || 'Unknown'}</p>
                        <p className="text-[11px] text-gray-400 truncate max-w-[160px]">{rx.user?.email}</p>
                      </td>

                      {/* Linked Order */}
                      <td className="px-5 py-4">
                        {linkedOrder ? (
                          <button
                            onClick={() => setOrderPanelId(linkedOrder._id || linkedOrder)}
                            className="group flex items-center gap-1.5 px-2.5 py-1.5 bg-[#006D6D]/10 hover:bg-[#006D6D]/20 text-[#006D6D] rounded-lg text-xs font-bold transition-colors border border-[#006D6D]/20"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            <span className="font-mono">#{(linkedOrder._id || linkedOrder).toString().slice(-8).toUpperCase()}</span>
                            {linkedOrder.status && (
                              <span className={`text-[10px] font-bold ${ORDER_STATUS_COLORS[linkedOrder.status] || 'text-gray-400'}`}>
                                · {linkedOrder.status}
                              </span>
                            )}
                            <svg className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                            </svg>
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-300 italic">No order linked</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_COLORS[rx.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {rx.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {isDeleting ? (
                          /* Inline delete confirmation */
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[11px] text-red-600 font-bold mr-1">Delete?</span>
                            <button
                              onClick={() => handleDelete(rx._id)}
                              className="px-2.5 py-1.5 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700 transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-bold hover:bg-gray-200 transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* View Details */}
                            <button
                              onClick={() => setSelectedRx(rx)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                              title="View prescription details"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                              </svg>
                              View
                            </button>

                            {/* Status dropdown */}
                            <select
                              value={rx.status}
                              onChange={e => handleStatusChange(rx._id, e.target.value)}
                              className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewed">Reviewed</option>
                              <option value="Dispensed">Dispensed</option>
                              <option value="Rejected">Rejected</option>
                            </select>

                            {/* Delete */}
                            <button
                              onClick={() => setDeletingId(rx._id)}
                              className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 border border-red-100 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                              title="Delete prescription"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Prescription Detail Side Panel ──────────────────────────────── */}
      {selectedRx && !orderPanelId && (
        <PrescriptionDetailPanel
          rx={selectedRx}
          onClose={() => setSelectedRx(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onOpenOrder={(id) => { setOrderPanelId(id); }}
        />
      )}

      {/* ── Order Detail Side Panel (opens on top of rx panel) ──────────── */}
      {orderPanelId && (
        <OrderDetailPanel
          orderId={orderPanelId}
          onClose={() => setOrderPanelId(null)}
          navigate={navigate}
        />
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn  { from { opacity: 0; }                to { opacity: 1; }               }
      `}</style>
    </div>
  );
}

export default Prescriptions;
