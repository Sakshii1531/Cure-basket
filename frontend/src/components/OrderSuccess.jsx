import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const [orderId] = React.useState(() => `CB-${Math.floor(100000 + Math.random() * 900000)}`)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Save order to localStorage for Admin Panel
    const savedOrders = JSON.parse(localStorage.getItem('cb_orders') || '[]');
    if (!savedOrders.some(o => o.id === orderId)) {
      const newOrder = {
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        customer: 'John Doe',
        total: '$70.00',
        status: 'Pending',
        items: ['Paracetamol 500mg', 'Amoxicillin 250mg']
      };
      localStorage.setItem('cb_orders', JSON.stringify([...savedOrders, newOrder]));
    }
  }, [orderId])

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-[520px] w-full text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-[#E6F7F7] flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#006D6D] flex items-center justify-center shadow-xl shadow-[#006D6D]/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {/* Ripple rings */}
            <div className="absolute inset-0 rounded-full border-2 border-[#006D6D]/20 animate-ping"></div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-[30px] md:text-[36px] font-black text-gray-900 mb-3">
          Order Placed!
        </h1>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-2">
          Your order has been successfully placed. We'll send a confirmation to your email shortly.
        </p>

        {/* Order ID */}
        <div className="inline-flex items-center gap-2 bg-[#E6F7F7] border border-[#006D6D]/10 px-4 py-2 rounded-full mt-4 mb-8">
          <span className="text-[12px] text-gray-500 font-medium">Order ID:</span>
          <span className="text-[13px] font-black text-[#006D6D] tracking-wider">{orderId}</span>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8 text-left space-y-4">
          <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-wide">Order Details</h2>

          <div className="divide-y divide-gray-50">
            {[
              { label: 'Delivery Address', value: '123, Main Street, Apt 4B, New York, NY 10001' },
              { label: 'Payment Method', value: 'Visa •••• 3456' },
              { label: 'Estimated Delivery', value: '7–14 Business Days' },
              { label: 'Order Total', value: '$70.00' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start py-3 gap-4">
                <span className="text-[12px] text-gray-400 font-medium shrink-0">{label}</span>
                <span className="text-[13px] font-semibold text-gray-800 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Info */}
        <div className="bg-[#FFF8E7] border border-[#FFD200]/30 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FFD200]/20 flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2.5a1.5 1.5 0 01-3 0V16m-4 0h4m-4 0a1 1 0 00-1 1v2.5a1.5 1.5 0 01-3 0V16" strokeWidth="2" strokeLinecap="round"/>
              <path d="M13 9h4l3 3v4a1 1 0 01-1 1h-3" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-[12px] text-gray-700 font-medium text-left leading-relaxed">
            You'll receive a <span className="font-bold text-gray-900">tracking link</span> via email once your order is dispatched.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#006D6D] text-white font-bold py-4 rounded-xl text-[15px] shadow-lg hover:bg-[#005a5a] transition-all active:scale-[0.98]"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/track-order', { state: { orderId } })}
            className="w-full bg-white border-2 border-gray-100 text-gray-700 font-semibold py-4 rounded-xl text-[15px] hover:bg-gray-50 transition-all"
          >
            Track My Order
          </button>
        </div>

      </div>
    </div>
  )
}

export default OrderSuccess
