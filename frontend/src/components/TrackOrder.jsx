import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../utils/api'

// Map order status → which timeline steps are complete
const TIMELINE = [
  { key: 'placed',     label: 'Order Placed',     desc: 'Your order has been received' },
  { key: 'confirmed',  label: 'Order Confirmed',   desc: 'Payment verified & order confirmed' },
  { key: 'shipped',    label: 'Shipped',            desc: 'Order dispatched for delivery' },
  { key: 'delivered',  label: 'Delivered',          desc: 'Order delivered to your address' },
]

const STATUS_PROGRESS = {
  Pending:    1, // placed
  Processing: 2, // confirmed
  Shipped:    3, // shipped
  Delivered:  4, // delivered
  Cancelled:  0,
}

const STATUS_COLORS = {
  Pending:    'bg-[#FFF8E7] text-[#FBB03B]',
  Processing: 'bg-[#E6F7F7] text-[#006D6D]',
  Shipped:    'bg-blue-50 text-blue-600',
  Delivered:  'bg-green-50 text-green-600',
  Cancelled:  'bg-red-50 text-red-500',
}

const TrackOrder = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const passedOrderId = location.state?.orderId || ''
  const [inputId, setInputId] = useState(passedOrderId)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async () => {
    const id = inputId.trim()
    if (!id) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await api.get(`/orders/${id}`)
      setOrder(res.data.data)
    } catch (err) {
      const status = err.response?.status
      if (status === 404) setError('No order found with that ID. Please check and try again.')
      else if (status === 403) setError('You are not authorized to view this order.')
      else if (status === 401) setError('Please log in to track your order.')
      else setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-track if orderId is passed in navigation state
  useEffect(() => {
    if (passedOrderId) handleTrack()
  }, [])

  const progress = order ? (STATUS_PROGRESS[order.status] ?? 1) : 0
  const isCancelled = order?.status === 'Cancelled'

  const formatAddress = (addr) => {
    if (!addr) return 'N/A'
    return [addr.name, addr.street, addr.city].filter(Boolean).join(', ')
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-12 py-3 sticky top-0 z-50 grid grid-cols-3 items-center">
        <div className="flex justify-start">
          <button onClick={() => navigate(-1)} className="p-1 group flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="hidden md:inline font-medium text-gray-500 text-[13px]">Back</span>
          </button>
        </div>
        <div className="flex justify-center">
          <h1 className="text-[16px] md:text-[20px] font-semibold text-gray-800 whitespace-nowrap">Track Order</h1>
        </div>
        <div className="flex justify-end"></div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Enter Order ID</label>
          <div className="flex gap-3 mt-2">
            <input
              type="text"
              value={inputId}
              onChange={e => { setInputId(e.target.value); setOrder(null); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              placeholder="e.g. 6847a1c3f0d2e..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-[14px] text-gray-900 placeholder-gray-300 outline-none focus:border-[#006D6D] transition-all font-mono"
            />
            <button
              onClick={handleTrack}
              disabled={loading || !inputId.trim()}
              className="px-5 py-3 bg-[#006D6D] text-white font-bold text-[14px] rounded-xl hover:bg-[#005a5a] transition-all active:scale-[0.97] shadow-md disabled:opacity-60 flex items-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              )}
              Track
            </button>
          </div>
          {error && (
            <p className="mt-3 text-[12px] text-red-500 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              {error}
            </p>
          )}
        </div>

        {order && (
          <div className="space-y-4">
            {/* Order Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[15px] font-bold text-gray-900">Order Info</h2>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: 'Order ID', value: <span className="font-mono text-[11px]">{order._id}</span> },
                  { label: 'Placed On', value: new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Delivery Address', value: formatAddress(order.shippingAddress) },
                  { label: 'Total Amount', value: `₹${Number(order.totalAmount).toFixed(2)}` },
                  { label: 'Payment', value: order.paymentStatus },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[12px] text-gray-400 font-medium shrink-0">{label}</span>
                    <span className="text-[12px] font-semibold text-gray-800 text-right">{value}</span>
                  </div>
                ))}
              </div>

              {/* Items */}
              {order.items?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">Items Ordered</p>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-[12px]">
                        <span className="text-gray-700 font-medium">{item.name || item.medicine?.name || 'Medicine'} × {item.quantity}</span>
                        <span className="text-gray-900 font-bold">₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Timeline */}
            {!isCancelled ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-[15px] font-bold text-gray-900 mb-5">Tracking Timeline</h2>
                <div className="relative">
                  <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-gray-100"></div>
                  <div className="space-y-6">
                    {TIMELINE.map((step, i) => {
                      const stepNum = i + 1
                      const isDone = progress >= stepNum
                      const isCurrent = progress === stepNum - 1 + 1 && progress < TIMELINE.length
                      // isCurrent: this is the "in progress" step
                      const isActiveStep = stepNum === progress + (progress < TIMELINE.length ? 1 : 0) && !isDone
                      return (
                        <div key={step.key} className="flex gap-5 relative">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${isDone ? 'bg-[#006D6D] border-[#006D6D]' : isActiveStep ? 'bg-white border-[#FFD200]' : 'bg-white border-gray-200'}`}>
                            {isDone
                              ? <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              : isActiveStep
                              ? <div className="w-3 h-3 rounded-full bg-[#FFD200]"></div>
                              : <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                            }
                          </div>
                          <div className="flex-1 pt-1.5">
                            <p className={`text-[14px] font-bold ${isDone ? 'text-gray-900' : isActiveStep ? 'text-[#006D6D]' : 'text-gray-300'}`}>{step.label}</p>
                            <p className={`text-[12px] mt-0.5 ${isDone ? 'text-gray-500' : isActiveStep ? 'text-gray-500' : 'text-gray-200'}`}>{step.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-red-700">Order Cancelled</p>
                  <p className="text-[12px] text-red-500 mt-0.5">This order has been cancelled.</p>
                </div>
              </div>
            )}

            {/* Help */}
            <div className="bg-[#E6F7F7] border border-[#006D6D]/10 rounded-2xl p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-[#006D6D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/></svg>
              <p className="text-[12px] text-[#006D6D] font-medium">Need help? Contact our support team at <span className="font-bold">support@curebasket.com</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrder
