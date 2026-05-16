import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../utils/api'
import { useCart } from '../context/CartContext'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart } = useCart()
  const orderData = location.state

  const [processing, setProcessing] = useState(false)
  const [failed, setFailed] = useState(false)
  const [apiError, setApiError] = useState('')

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No order data found.</p>
          <button onClick={() => navigate('/cart')} className="text-[#006D6D] font-semibold hover:underline">
            Go to Cart
          </button>
        </div>
      </div>
    )
  }

  const { orderItems, totalAmount, shippingAddress, shippingMethod } = orderData

  const placeOrder = async (paymentStatus) => {
    setProcessing(true)
    setApiError('')
    try {
      const res = await api.post('/orders', {
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentStatus,
      })
      clearCart()
      navigate('/order-success', { state: { order: res.data.data, shippingMethod } })
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Please try again.')
      setProcessing(false)
    }
  }

  const handleSuccess = () => placeOrder('Paid')

  const handleFailure = async () => {
    setProcessing(true)
    setApiError('')
    try {
      await api.post('/orders', {
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentStatus: 'Failed',
      })
    } catch {
      // ignore — we still show the failure UI
    }
    setProcessing(false)
    setFailed(true)
  }

  if (failed) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-[460px] w-full text-center">
          <div className="flex justify-center mb-8">
            <div className="w-28 h-28 rounded-full bg-red-50 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-xl shadow-red-500/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-[28px] font-black text-gray-900 mb-3">Payment Failed</h1>
          <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
            Your payment could not be processed. Your order has been recorded with a failed payment status.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setFailed(false) }}
              className="w-full bg-[#006D6D] text-white font-bold py-4 rounded-xl text-[15px] shadow-lg hover:bg-[#005a5a] transition-all active:scale-[0.98]"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white border-2 border-gray-100 text-gray-700 font-semibold py-4 rounded-xl text-[15px] hover:bg-gray-50 transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="bg-white border-b border-gray-100 px-4 md:px-12 py-3 sticky top-0 z-50 grid grid-cols-3 items-center">
        <div className="flex justify-start">
          <button onClick={() => navigate(-1)} className="p-1 group flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="hidden md:inline font-medium text-gray-500 text-[13px]">Back</span>
          </button>
        </div>
        <div className="flex justify-center">
          <h1 className="text-[16px] md:text-[20px] font-semibold text-gray-800 whitespace-nowrap">Payment</h1>
        </div>
        <div className="flex justify-end"></div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div className="flex items-start justify-center mb-10 md:mb-12 max-w-[500px] mx-auto gap-0 px-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border-2 border-[#006D6D] text-[#006D6D] flex items-center justify-center font-bold text-[12px] md:text-[14px]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[10px] md:text-[11px] font-medium text-gray-400">Address</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-[#006D6D]/40 mt-[16px] md:mt-[18px] mx-2 md:mx-3"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#006D6D] text-white flex items-center justify-center font-bold text-[12px] md:text-[14px] shadow-lg shadow-[#006D6D]/20">2</div>
            <span className="text-[10px] md:text-[11px] font-bold text-[#006D6D]">Payment</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-[16px] md:mt-[18px] mx-2 md:mx-3"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-[12px] md:text-[14px]">3</div>
            <span className="text-[10px] md:text-[11px] font-medium text-gray-400">Confirm</span>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {apiError}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {orderItems.map((item, i) => (
                <div key={i} className="flex justify-between text-[13px] text-gray-600">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-[15px] font-bold text-gray-900">
              <span>Total</span>
              <span className="text-[#006D6D]">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#FFD200]/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16H12v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="text-[15px] font-bold text-gray-900">Test Payment Simulation</h2>
            </div>
            <p className="text-[12px] text-gray-500 mb-6 leading-relaxed pl-11">
              This is a mock payment gateway for development. Use the buttons below to simulate a payment outcome.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleSuccess}
                disabled={processing}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-[14px] font-black text-green-700">Simulate Success</div>
                  <div className="text-[11px] text-green-600 mt-0.5">Payment approved</div>
                </div>
              </button>

              <button
                onClick={handleFailure}
                disabled={processing}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-[14px] font-black text-red-700">Simulate Failure</div>
                  <div className="text-[11px] text-red-600 mt-0.5">Payment declined</div>
                </div>
              </button>
            </div>

            {processing && (
              <div className="flex items-center justify-center gap-3 mt-6 text-gray-500">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span className="text-[13px] font-medium">Processing payment...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
