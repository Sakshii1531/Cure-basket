import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const steps = [
  { label: 'Order Placed', desc: 'Your order has been received', done: true, time: 'Today, 1:22 PM' },
  { label: 'Order Confirmed', desc: 'Payment verified & order confirmed', done: true, time: 'Today, 1:25 PM' },
  { label: 'Processing', desc: 'Your order is being prepared', done: false, time: 'Estimated: Tomorrow' },
  { label: 'Shipped', desc: 'Order dispatched for delivery', done: false, time: '' },
  { label: 'Delivered', desc: 'Order delivered to your address', done: false, time: '' },
]

const TrackOrder = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const passedOrderId = location.state?.orderId || ''
  const [inputId, setInputId] = useState(passedOrderId)
  const [tracked, setTracked] = useState(!!passedOrderId)

  const handleTrack = () => {
    if (inputId.trim()) setTracked(true)
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
              onChange={e => { setInputId(e.target.value); setTracked(false) }}
              placeholder="e.g. CB-847291"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-[14px] text-gray-900 placeholder-gray-300 outline-none focus:border-[#006D6D] transition-all"
            />
            <button
              onClick={handleTrack}
              className="px-5 py-3 bg-[#006D6D] text-white font-bold text-[14px] rounded-xl hover:bg-[#005a5a] transition-all active:scale-[0.97] shadow-md"
            >Track</button>
          </div>
        </div>

        {/* Tracking Result */}
        {tracked && inputId.trim() && (
          <div className="space-y-4">
            {/* Order Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[15px] font-bold text-gray-900">Order Info</h2>
                <span className="bg-[#E6F7F7] text-[#006D6D] text-[11px] font-bold px-3 py-1 rounded-full">Processing</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Order ID', value: inputId.trim() },
                  { label: 'Placed On', value: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Delivery Address', value: '123, Main Street, Apt 4B, New York, NY 10001' },
                  { label: 'Estimated Delivery', value: '7–14 Business Days' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[12px] text-gray-400 font-medium shrink-0">{label}</span>
                    <span className="text-[12px] font-semibold text-gray-800 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-[15px] font-bold text-gray-900 mb-5">Tracking Timeline</h2>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-gray-100"></div>
                <div className="space-y-6">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-5 relative">
                      {/* Circle */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${step.done ? 'bg-[#006D6D] border-[#006D6D]' : i === steps.findIndex(s => !s.done) ? 'bg-white border-[#FFD200]' : 'bg-white border-gray-200'}`}>
                        {step.done
                          ? <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : i === steps.findIndex(s => !s.done)
                          ? <div className="w-3 h-3 rounded-full bg-[#FFD200]"></div>
                          : <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                        }
                      </div>
                      {/* Content */}
                      <div className="flex-1 pt-1.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`text-[14px] font-bold ${step.done ? 'text-gray-900' : i === steps.findIndex(s => !s.done) ? 'text-[#006D6D]' : 'text-gray-300'}`}>{step.label}</p>
                            <p className={`text-[12px] mt-0.5 ${step.done ? 'text-gray-500' : i === steps.findIndex(s => !s.done) ? 'text-gray-500' : 'text-gray-200'}`}>{step.desc}</p>
                          </div>
                          {step.time && <span className="text-[11px] text-gray-400 shrink-0 ml-2">{step.time}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
