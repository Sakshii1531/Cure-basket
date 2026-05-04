import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Payment = () => {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [form, setForm] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' })
  const [errors, setErrors] = useState({})

  const handleInput = (key, value) => {
    let formatted = value
    if (key === 'cardNumber') {
      formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    if (key === 'expiry') {
      formatted = value.replace(/\D/g, '').slice(0, 4)
      if (formatted.length >= 3) formatted = formatted.slice(0, 2) + ' / ' + formatted.slice(2)
    }
    if (key === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 3)
    }
    setForm(prev => ({ ...prev, [key]: formatted }))
  }

  const validate = () => {
    if (paymentMethod !== 'card') return true
    const newErrors = {}
    if (form.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Enter a valid 16-digit card number'
    if (form.expiry.length < 7) newErrors.expiry = 'Enter valid expiry date'
    if (form.cvv.length < 3) newErrors.cvv = 'Enter valid CVV'
    if (!form.name.trim()) newErrors.name = 'Name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validate()) navigate('/review')
  }

  const methods = [
    { id: 'card', label: 'Credit / Debit Card', extra: (
      <div className="flex items-center gap-2 mt-1 ml-9">
        <span className="bg-[#1A1F71] text-white text-[8px] font-black px-2 py-0.5 rounded">VISA</span>
        <span className="bg-[#EB001B] text-white text-[8px] font-black px-2 py-0.5 rounded">MC</span>
        <span className="bg-[#2557D6] text-white text-[8px] font-black px-2 py-0.5 rounded">AMEX</span>
        <span className="bg-[#FF6600] text-white text-[8px] font-black px-2 py-0.5 rounded">DISC</span>
      </div>
    )},
    { id: 'paypal', label: 'PayPal', extra: (
      <div className="ml-9 mt-1">
        <span className="text-[#003087] font-black text-[13px]">Pay<span className="text-[#009cde]">Pal</span></span>
      </div>
    )},
    { id: 'bitcoin', label: 'Bitcoin' },
    { id: 'bank', label: 'Bank Transfer' },
  ]

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
          <h1 className="text-[16px] md:text-[20px] font-semibold text-gray-800 whitespace-nowrap">Checkout</h1>
        </div>
        <div className="flex justify-end"></div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="flex items-start justify-center mb-12 max-w-[500px] mx-auto gap-0">
          {/* Step 1 - done */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-[#006D6D] text-[#006D6D] flex items-center justify-center font-bold text-[14px]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-[12px] font-medium text-gray-400">Address</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-[#006D6D]/40 mt-[18px] mx-3"></div>
          {/* Step 2 - active */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#006D6D] text-white flex items-center justify-center font-bold text-[14px] shadow-lg shadow-[#006D6D]/20">2</div>
            <span className="text-[12px] font-bold text-[#006D6D]">Payment</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-[18px] mx-3"></div>
          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-[14px]">3</div>
            <span className="text-[12px] font-medium text-gray-400">Review</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-[16px] font-bold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-1">
              {methods.map(method => (
                <div key={method.id}>
                  <label
                    className="flex items-center gap-3 py-3 cursor-pointer"
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${paymentMethod === method.id ? 'border-[#006D6D]' : 'border-gray-300'}`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[#006D6D]"></div>}
                    </div>
                    <span className={`text-[14px] font-semibold ${paymentMethod === method.id ? 'text-gray-900' : 'text-gray-500'}`}>{method.label}</span>
                  </label>
                  {paymentMethod === method.id && method.extra && (
                    <div className="mb-2">{method.extra}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card Details - only show if card selected */}
          {paymentMethod === 'card' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-[16px] font-bold text-gray-900 mb-5">Card Details</h2>
              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Card Number</label>
                  <input
                    type="text"
                    value={form.cardNumber}
                    onChange={e => handleInput('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full mt-1.5 px-4 py-3 rounded-xl border-2 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-[#006D6D] ${errors.cardNumber ? 'border-red-400' : 'border-gray-100'}`}
                  />
                  {errors.cardNumber && <p className="text-[11px] text-red-500 mt-1">{errors.cardNumber}</p>}
                </div>
                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Expiry Date</label>
                    <input
                      type="text"
                      value={form.expiry}
                      onChange={e => handleInput('expiry', e.target.value)}
                      placeholder="MM / YY"
                      className={`w-full mt-1.5 px-4 py-3 rounded-xl border-2 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-[#006D6D] ${errors.expiry ? 'border-red-400' : 'border-gray-100'}`}
                    />
                    {errors.expiry && <p className="text-[11px] text-red-500 mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">CVV</label>
                    <input
                      type="text"
                      value={form.cvv}
                      onChange={e => handleInput('cvv', e.target.value)}
                      placeholder="123"
                      className={`w-full mt-1.5 px-4 py-3 rounded-xl border-2 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-[#006D6D] ${errors.cvv ? 'border-red-400' : 'border-gray-100'}`}
                    />
                    {errors.cvv && <p className="text-[11px] text-red-500 mt-1">{errors.cvv}</p>}
                  </div>
                </div>
                {/* Name on Card */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Name on Card</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleInput('name', e.target.value)}
                    placeholder="John Doe"
                    className={`w-full mt-1.5 px-4 py-3 rounded-xl border-2 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-[#006D6D] ${errors.name ? 'border-red-400' : 'border-gray-100'}`}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-[#006D6D] text-white font-bold py-4 rounded-xl text-[16px] shadow-lg hover:bg-[#005a5a] transition-all active:scale-[0.98] mt-8"
        >
          Continue to Review
        </button>
      </div>
    </div>
  )
}

export default Payment
