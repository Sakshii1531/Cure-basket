import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import med1 from '../assets/med1.png'

const Review = () => {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)
  const [agreeError, setAgreeError] = useState(false)

  // Address state
  const [address, setAddress] = useState({
    name: "John Doe",
    street: "123, Main Street, Apt 4B",
    city: "New York, NY 10001, USA",
    phone: "+1 123 456 7890"
  })
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressForm, setAddressForm] = useState({ ...address })
  const [addressErrors, setAddressErrors] = useState({})

  // Payment state
  const [payment, setPayment] = useState({ cardNumber: '•••• •••• •••• 3456', name: 'John Doe' })
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentForm, setPaymentForm] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' })
  const [paymentErrors, setPaymentErrors] = useState({})

  const subtotal = 95.00
  const shipping = 10.00
  const discount = 35.00
  const total = subtotal + shipping - discount

  // Address handlers
  const openAddressEdit = () => {
    setAddressForm({ ...address })
    setAddressErrors({})
    setShowAddressModal(true)
  }

  const validateAddress = () => {
    const errors = {}
    if (!addressForm.name.trim()) errors.name = 'Name is required'
    if (!addressForm.street.trim()) errors.street = 'Street is required'
    if (!addressForm.city.trim()) errors.city = 'City is required'
    if (!addressForm.phone.trim()) errors.phone = 'Phone is required'
    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  const saveAddress = () => {
    if (!validateAddress()) return
    setAddress({ ...addressForm })
    setShowAddressModal(false)
  }

  // Payment handlers
  const handlePaymentInput = (key, value) => {
    let formatted = value
    if (key === 'cardNumber') {
      formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    if (key === 'expiry') {
      formatted = value.replace(/\D/g, '').slice(0, 4)
      if (formatted.length >= 3) formatted = formatted.slice(0, 2) + ' / ' + formatted.slice(2)
    }
    if (key === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 3)
    setPaymentForm(prev => ({ ...prev, [key]: formatted }))
  }

  const openPaymentEdit = () => {
    setPaymentForm({ cardNumber: '', expiry: '', cvv: '', name: payment.name })
    setPaymentErrors({})
    setShowPaymentModal(true)
  }

  const validatePayment = () => {
    const errors = {}
    if (paymentForm.cardNumber.replace(/\s/g, '').length < 16) errors.cardNumber = 'Enter a valid 16-digit card number'
    if (paymentForm.expiry.length < 7) errors.expiry = 'Enter valid expiry date'
    if (paymentForm.cvv.length < 3) errors.cvv = 'Enter valid CVV'
    if (!paymentForm.name.trim()) errors.name = 'Name is required'
    setPaymentErrors(errors)
    return Object.keys(errors).length === 0
  }

  const savePayment = () => {
    if (!validatePayment()) return
    const last4 = paymentForm.cardNumber.replace(/\s/g, '').slice(-4)
    setPayment({ cardNumber: `•••• •••• •••• ${last4}`, name: paymentForm.name })
    setShowPaymentModal(false)
  }

  const handlePlaceOrder = () => {
    if (!agreed) { setAgreeError(true); return }
    setAgreeError(false)
    navigate('/order-success')
  }

  const inputClass = (err) =>
    `w-full mt-1.5 px-4 py-3 rounded-xl border-2 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-[#006D6D] ${err ? 'border-red-400' : 'border-gray-100'}`

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
          <h1 className="text-[16px] md:text-[20px] font-semibold text-gray-800 whitespace-nowrap">Review Order</h1>
        </div>
        <div className="flex justify-end"></div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="flex items-start justify-center mb-12 max-w-[500px] mx-auto gap-0">
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-[#006D6D] text-[#006D6D] flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-[12px] font-medium text-gray-400">Address</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-[#006D6D]/40 mt-[18px] mx-3"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-[#006D6D] text-[#006D6D] flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-[12px] font-medium text-gray-400">Payment</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-[#006D6D]/40 mt-[18px] mx-3"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#006D6D] text-white flex items-center justify-center font-bold text-[14px] shadow-lg shadow-[#006D6D]/20">3</div>
            <span className="text-[12px] font-bold text-[#006D6D]">Review</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[15px] font-bold text-gray-900">Shipping Address</h2>
              <button onClick={openAddressEdit} className="text-[#006D6D] text-[13px] font-bold hover:underline">Edit</button>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              {address.name}<br/>
              {address.street}<br/>
              {address.city}<br/>
              {address.phone}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[15px] font-bold text-gray-900">Payment Method</h2>
              <button onClick={openPaymentEdit} className="text-[#006D6D] text-[13px] font-bold hover:underline">Edit</button>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-[#1A1F71] text-white text-[8px] font-black px-2 py-0.5 rounded">VISA</span>
              <span className="text-[13px] text-gray-600">{payment.cardNumber}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50">
              <h2 className="text-[15px] font-bold text-gray-900">Order Items</h2>
            </div>
            {[
              { name: "Lantus Solostar 100 IU/ml", desc: "5 Pen (3ml)", price: 42.00 },
              { name: "Humalog KwikPen 100 IU/ml", desc: "5 Pen (3ml)", price: 45.00 },
              { name: "BD Ultra-Fine Pen Needles", desc: "4mm (32G) - 100's", price: 8.00 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-gray-50 last:border-0">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <img src={med1} alt={item.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-gray-900 leading-tight">{item.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <span className="text-[14px] font-bold text-gray-900">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-[15px] font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-[13px] text-gray-500">Subtotal</span><span className="text-[13px] font-semibold text-gray-900">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-[13px] text-gray-500">Shipping</span><span className="text-[13px] font-semibold text-gray-900">${shipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-[13px] text-gray-500">Discount</span><span className="text-[13px] font-semibold text-[#FFD200]">-${discount.toFixed(2)}</span></div>
              <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[15px] font-bold text-gray-900">Total</span>
                <span className="text-[20px] font-black text-[#006D6D]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => { setAgreed(!agreed); setAgreeError(false) }}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreed ? 'bg-[#006D6D] border-[#006D6D]' : agreeError ? 'border-red-400' : 'border-gray-300'}`}
              >
                {agreed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-[12px] text-gray-500 leading-relaxed">
                I have read and agree to the <span className="text-[#006D6D] font-bold cursor-pointer hover:underline">Terms & Conditions</span> and <span className="text-[#006D6D] font-bold cursor-pointer hover:underline">Privacy Policy</span>
              </span>
            </label>
            {agreeError && <p className="text-[11px] text-red-500 mt-1 ml-8">Please accept the terms to continue</p>}
          </div>
        </div>

        <button onClick={handlePlaceOrder} className="w-full bg-[#006D6D] text-white font-bold py-4 rounded-xl text-[16px] shadow-lg hover:bg-[#005a5a] transition-all active:scale-[0.98] mt-8">
          Place Order
        </button>
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2"/></svg>
          <span className="text-[11px] font-medium">Your payment information is secure</span>
        </div>
      </div>

      {/* Address Edit Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddressModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[500px] p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-bold text-gray-900">Edit Shipping Address</h2>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'e.g. John Doe' },
                { key: 'street', label: 'Street Address', placeholder: 'e.g. 123, Main Street, Apt 4B' },
                { key: 'city', label: 'City, State & ZIP', placeholder: 'e.g. New York, NY 10001, USA' },
                { key: 'phone', label: 'Phone Number', placeholder: 'e.g. +1 123 456 7890' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{label}</label>
                  <input
                    type="text"
                    value={addressForm[key]}
                    onChange={e => setAddressForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={inputClass(addressErrors[key])}
                  />
                  {addressErrors[key] && <p className="text-[11px] text-red-500 mt-1">{addressErrors[key]}</p>}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddressModal(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-semibold text-[14px] hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={saveAddress} className="flex-1 py-3 rounded-xl bg-[#006D6D] text-white font-bold text-[14px] hover:bg-[#005a5a] transition-all shadow-md">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Edit Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[500px] p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-bold text-gray-900">Edit Payment Method</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Card Number</label>
                <input type="text" value={paymentForm.cardNumber} onChange={e => handlePaymentInput('cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" className={inputClass(paymentErrors.cardNumber)} />
                {paymentErrors.cardNumber && <p className="text-[11px] text-red-500 mt-1">{paymentErrors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Expiry Date</label>
                  <input type="text" value={paymentForm.expiry} onChange={e => handlePaymentInput('expiry', e.target.value)} placeholder="MM / YY" className={inputClass(paymentErrors.expiry)} />
                  {paymentErrors.expiry && <p className="text-[11px] text-red-500 mt-1">{paymentErrors.expiry}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">CVV</label>
                  <input type="text" value={paymentForm.cvv} onChange={e => handlePaymentInput('cvv', e.target.value)} placeholder="123" className={inputClass(paymentErrors.cvv)} />
                  {paymentErrors.cvv && <p className="text-[11px] text-red-500 mt-1">{paymentErrors.cvv}</p>}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Name on Card</label>
                <input type="text" value={paymentForm.name} onChange={e => handlePaymentInput('name', e.target.value)} placeholder="John Doe" className={inputClass(paymentErrors.name)} />
                {paymentErrors.name && <p className="text-[11px] text-red-500 mt-1">{paymentErrors.name}</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-semibold text-[14px] hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={savePayment} className="flex-1 py-3 rounded-xl bg-[#006D6D] text-white font-bold text-[14px] hover:bg-[#005a5a] transition-all shadow-md">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Review
