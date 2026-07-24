import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import ImageWithFallback from './ImageWithFallback'

const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const statusColor = {
  Delivered: 'text-green-600 bg-green-50 border-green-200',
  Shipped:   'text-blue-600 bg-blue-50 border-blue-200',
  Processing:'text-yellow-700 bg-yellow-50 border-yellow-200',
  Cancelled: 'text-red-600 bg-red-50 border-red-200',
  Pending:   'text-orange-600 bg-orange-50 border-orange-200',
}

const paymentColor = {
  Paid:    'text-green-600 bg-green-50',
  Pending: 'text-yellow-700 bg-yellow-50',
  Failed:  'text-red-600 bg-red-50',
}

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered']

function StatusTracker({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-[12px] font-bold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        Order Cancelled
      </div>
    )
  }
  const currentIdx = statusSteps.indexOf(status)
  return (
    <div className="flex items-center gap-0">
      {statusSteps.map((step, i) => {
        const done   = i <= currentIdx
        const active = i === currentIdx
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                done
                  ? 'bg-[#006D6D] border-[#006D6D]'
                  : 'bg-white border-gray-200'
              }`}>
                {done ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-200"/>
                )}
              </div>
              <span className={`text-[9px] font-bold mt-1 whitespace-nowrap ${active ? 'text-[#006D6D]' : done ? 'text-gray-500' : 'text-gray-300'}`}>
                {step}
              </span>
            </div>
            {i < statusSteps.length - 1 && (
              <div className={`flex-1 h-[2px] mx-1 mb-4 rounded ${i < currentIdx ? 'bg-[#006D6D]' : 'bg-gray-200'}`} style={{minWidth: 16}}/>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export function OrderDetailDrawer({ order, onClose }) {
  const [shippingCharges, setShippingCharges] = useState(0)
  const [freeThreshold, setFreeThreshold] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    api.get('/settings/public/order_shipping')
      .then(res => {
        if (res.data && res.data.data) {
          const charges = parseFloat(res.data.data.shippingCharges);
          const threshold = parseFloat(res.data.data.freeShippingThreshold);
          if (!isNaN(charges)) setShippingCharges(charges);
          if (!isNaN(threshold)) setFreeThreshold(threshold);
        }
      })
      .catch(() => {});
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!order) return null

  const addr = order.shippingAddress || {}
  const shortId = order._id.slice(-8).toUpperCase()
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const rawSubtotal = (order.items || []).reduce((sum, item) => {
    const p = Number(item.price ?? item.medicine?.price ?? 0) || 0;
    const q = Number(item.quantity) || 1;
    return sum + (p * q);
  }, 0);

  const subtotal = (order.subtotal !== undefined && order.subtotal !== null)
    ? Number(order.subtotal)
    : rawSubtotal;
  const discountAmount = Number(order.discountAmount) || 0;
  const shippingFee = (order.shippingFee !== undefined && order.shippingFee !== null)
    ? Number(order.shippingFee)
    : (freeThreshold > 0 && subtotal >= freeThreshold ? 0 : shippingCharges);

  const displayedTotal = Number(order.totalAmount) || Math.max(0, subtotal + shippingFee - discountAmount);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease' }}
      />

      {/* Drawer panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: 'calc(100vh - 120px)', animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200"/>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-[17px] font-black text-gray-900">Order #{shortId}</h2>
            <p className="text-[12px] text-gray-400 font-medium mt-0.5">{date}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${statusColor[order.status] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>
              {order.status}
            </span>
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

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Order Progress Tracker */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Order Progress</p>
            <StatusTracker status={order.status} />
          </div>

          {/* Items */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">
              Items Ordered ({order.items?.length || 0})
            </p>
            <div className="divide-y divide-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
              {(order.items || []).map((item, idx) => {
                const medImg = item.medicine?.image || null
                const unitPrice = Number(item.price ?? item.medicine?.price ?? (order.totalAmount && (order.items || []).length === 1 ? order.totalAmount : 0)) || 0;
                const itemQty = Number(item.quantity) || 1;
                const itemTotal = unitPrice * itemQty;
                return (
                  <div key={idx} className="flex gap-4 p-4 bg-white">
                    {/* Product image or placeholder */}
                    <div className="w-[56px] h-[56px] shrink-0 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                      {medImg ? (
                        <ImageWithFallback src={medImg} alt={item.name} className="w-full h-full bg-transparent" />
                      ) : (
                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13.5px] font-bold text-gray-900 leading-tight truncate">{item.name}</h4>
                      <p className="text-[12px] text-gray-400 mt-0.5 font-medium">Qty: {itemQty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[14px] font-black text-gray-900">${itemTotal.toFixed(2)}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">${unitPrice.toFixed(2)} each</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shipping Address */}
          {(addr.name || addr.street || addr.city || addr.phone) && (
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Shipping Address</p>
              <div className="bg-gray-50 rounded-2xl p-4 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#006D6D]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  {addr.name && <p className="text-[13.5px] font-bold text-gray-900">{addr.name}</p>}
                  {addr.street && <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{addr.street}</p>}
                  {addr.city && <p className="text-[12px] text-gray-500 leading-relaxed">{addr.city}</p>}
                  {addr.phone && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      <p className="text-[12px] text-gray-500 font-medium">{addr.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Payment</p>
            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#006D6D]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">Payment Status</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Order #{shortId}</p>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${paymentColor[order.paymentStatus] || 'text-gray-600 bg-gray-100'}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2.5">Price Breakdown</p>
            <div className="bg-white rounded-2xl p-4 space-y-3">
              {/* Highlighted Items Table */}
              <div className="space-y-2">
                {(order.items || []).map((item, idx) => {
                  const uPrice = Number(item.price ?? item.medicine?.price ?? (order.totalAmount && (order.items || []).length === 1 ? order.totalAmount : 0)) || 0;
                  const iQty = Number(item.quantity) || 1;
                  const pkgLabel = item.pkg?.label || item.packageLabel || item.packSize;
                  return (
                    <div key={idx} className="bg-[#E6F7F7]/60 rounded-xl p-3 flex items-center justify-between transition-all">
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13.5px] font-extrabold text-gray-900 truncate">{item.name}</span>
                          {pkgLabel && (
                            <span className="bg-[#006D6D] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                              Package: {pkgLabel}
                            </span>
                          )}
                        </div>
                        <div className="text-[11.5px] text-gray-500 font-semibold mt-1">
                          Quantity: <span className="font-bold text-gray-800">{iQty}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[14px] font-black text-[#006D6D]">${(uPrice * iQty).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Financial Summary */}
              <div className="pt-2 border-t border-gray-100 space-y-2 text-[13px]">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>

                {shippingFee > 0 && (
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-gray-800">${shippingFee.toFixed(2)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between items-center">
                  <span className="text-[14px] font-black text-gray-900 uppercase tracking-wide">Total</span>
                  <span className="text-[17px] font-black text-[#006D6D]">${displayedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom padding for safe area */}
          <div className="pb-4"/>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  )
}

const ITEMS_PER_PAGE = 5

const OrdersPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [shippingCharges, setShippingCharges] = useState(0)
  const [freeThreshold, setFreeThreshold] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(res => setOrders(res.data.data || []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load orders'))
      .finally(() => setLoading(false))

    api.get('/settings/public/order_shipping')
      .then(res => {
        if (res.data && res.data.data) {
          const charges = parseFloat(res.data.data.shippingCharges);
          const threshold = parseFloat(res.data.data.freeShippingThreshold);
          if (!isNaN(charges)) setShippingCharges(charges);
          if (!isNaN(threshold)) setFreeThreshold(threshold);
        }
      })
      .catch(() => {});
  }, [])

  // Reset page when tab or search changes
  useEffect(() => { setCurrentPage(1) }, [activeTab, searchTerm])

  const tabFiltered = activeTab === 'All'
    ? orders
    : orders.filter(o => o.status === activeTab)

  const searchFiltered = searchTerm.trim()
    ? tabFiltered.filter(o =>
        o._id.slice(-8).toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        (o.items || []).some(item => item.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()))
      )
    : tabFiltered

  const totalPages = Math.max(1, Math.ceil(searchFiltered.length / ITEMS_PER_PAGE))
  const paginatedOrders = searchFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto w-full flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[20px] font-bold text-gray-900">My Orders</h1>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[61px] z-40 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex px-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3.5 text-[14px] font-bold transition-all relative ${activeTab === tab ? 'text-[#006D6D]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#006D6D] rounded-t-full"/>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by order ID or medicine name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] focus:outline-none focus:border-[#006D6D] shadow-sm"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-[12px] text-gray-400 mt-1.5 ml-1">
            {searchFiltered.length} result{searchFiltered.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Orders list */}
      <div className="max-w-4xl mx-auto p-4 md:py-4 space-y-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading orders...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 text-sm">{error}</div>
        ) : paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => {
            const colorClass = statusColor[order.status] || 'text-gray-600 bg-gray-50 border-gray-200'
            const itemCount = (order.items || []).length
            const previewItem = order.items?.[0]

            const cardRawSubtotal = (order.items || []).reduce((sum, item) => sum + (Number(item.price ?? item.medicine?.price ?? 0) * (Number(item.quantity) || 1)), 0);
            const cardSubtotal = (order.subtotal !== undefined && order.subtotal !== null) ? Number(order.subtotal) : cardRawSubtotal;
            const cardShipping = (order.shippingFee !== undefined && order.shippingFee !== null)
              ? Number(order.shippingFee)
              : (freeThreshold > 0 && cardSubtotal >= freeThreshold ? 0 : shippingCharges);
            const cardDiscount = Number(order.discountAmount) || 0;
            const cardTotal = Number(order.totalAmount) || Math.max(0, cardSubtotal + cardShipping - cardDiscount);

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Top row */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[15px] font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <p className="text-[12px] text-gray-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${colorClass}`}>
                    {order.status}
                  </span>
                </div>

                {/* Item preview */}
                {previewItem && (
                  <div className="mt-3 flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {previewItem.medicine?.image ? (
                        <ImageWithFallback src={previewItem.medicine.image} alt="" className="w-full h-full bg-transparent p-1 rounded-lg" />
                      ) : (
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-gray-800 truncate">{previewItem.name}</p>
                      {itemCount > 1 && (
                        <p className="text-[11px] text-gray-400 mt-0.5">+{itemCount - 1} more item{itemCount > 2 ? 's' : ''}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom row */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1.5 text-[#006D6D] text-[13px] font-bold border border-[#006D6D]/30 bg-[#006D6D]/5 hover:bg-[#006D6D]/10 px-3.5 py-2 rounded-xl transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    View Details
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span className="text-[20px] font-black text-gray-900">${cardTotal.toFixed(2)}</span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-bold text-gray-800">No orders found</h3>
            <p className="text-[13px] text-gray-400 mt-1">
              {searchTerm ? `No orders match "${searchTerm}"` : 'Looks like you haven\'t placed any orders yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="max-w-4xl mx-auto px-4 pb-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 disabled:opacity-40 hover:border-[#006D6D] hover:text-[#006D6D] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
            <button
              key={pg}
              onClick={() => setCurrentPage(pg)}
              className={`w-9 h-9 rounded-xl text-[13px] font-bold border transition-colors ${
                pg === currentPage
                  ? 'bg-[#006D6D] text-white border-[#006D6D]'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-[#006D6D] hover:text-[#006D6D]'
              }`}
            >
              {pg}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 disabled:opacity-40 hover:border-[#006D6D] hover:text-[#006D6D] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

export default OrdersPage
