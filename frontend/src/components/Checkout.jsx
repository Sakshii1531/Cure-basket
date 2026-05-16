import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const emptyForm = { name: '', street: '', city: '', phone: '' }

const Checkout = () => {
  const navigate = useNavigate()
  const { items, cartTotal, clearCart } = useCart()
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [orderError, setOrderError] = useState('')

  const shippingCost = shippingMethod === 'express' ? 25 : 10
  const total = cartTotal + shippingCost

  const openAddNew = () => {
    setEditingAddress(null)
    setForm(emptyForm)
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (addr) => {
    setEditingAddress(addr.id)
    setForm({ name: addr.name, street: addr.street, city: addr.city, phone: addr.phone })
    setErrors({})
    setShowModal(true)
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.street.trim()) newErrors.street = 'Street address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    if (editingAddress !== null) {
      setAddresses(prev => prev.map(a => a.id === editingAddress ? { ...a, ...form } : a))
    } else {
      const newId = Date.now()
      const newAddr = { id: newId, ...form }
      setAddresses(prev => [...prev, newAddr])
      setSelectedAddress(newId)
    }
    setShowModal(false)
  }

  const handleContinueToPayment = () => {
    if (items.length === 0) return
    if (!selectedAddress) {
      setOrderError('Please add and select a shipping address.')
      return
    }
    const addr = addresses.find(a => a.id === selectedAddress)
    navigate('/payment', {
      state: {
        orderItems: items.map(i => ({
          medicine: i._id || i.id,
          name: i.name,
          price: i.price,
          quantity: i.qty,
        })),
        totalAmount: total,
        shippingAddress: { name: addr.name, street: addr.street, city: addr.city, phone: addr.phone },
        shippingMethod,
      },
    })
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="bg-white border-b border-gray-100 px-4 md:px-12 py-3 sticky top-0 z-50 grid grid-cols-3 items-center">
        <div className="flex justify-start">
          <button onClick={() => navigate(-1)} className="p-1 group flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="hidden md:inline font-medium text-gray-500 text-[13px]">Back</span>
          </button>
        </div>
        <div className="flex justify-center">
          <h1 className="text-[15px] md:text-[18px] font-semibold text-gray-800 whitespace-nowrap">Checkout</h1>
        </div>
        <div className="flex justify-end"></div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div className="flex items-start justify-center mb-10 md:mb-12 max-w-[500px] mx-auto gap-0 px-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#006D6D] text-white flex items-center justify-center font-bold text-[12px] md:text-[14px] shadow-lg shadow-[#006D6D]/20">1</div>
            <span className="text-[10px] md:text-[11px] font-bold text-[#006D6D]">Address</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-[16px] md:mt-[18px] mx-2 md:mx-3"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-[12px] md:text-[14px]">2</div>
            <span className="text-[10px] md:text-[11px] font-medium text-gray-400">Payment</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-[16px] md:mt-[18px] mx-2 md:mx-3"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-[12px] md:text-[14px]">3</div>
            <span className="text-[10px] md:text-[11px] font-medium text-gray-400">Review</span>
          </div>
        </div>

        {orderError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {orderError}
          </div>
        )}

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[15px] md:text-[16px] font-bold text-gray-900">Shipping Address</h2>
              <button onClick={openAddNew} className="text-[#006D6D] text-[12px] font-bold hover:underline">+ Add New</button>
            </div>
            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
                <p className="text-gray-400 text-sm mb-3">No addresses saved</p>
                <button onClick={openAddNew} className="text-[#006D6D] text-sm font-bold hover:underline">+ Add Address</button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`bg-white rounded-2xl border-2 p-5 relative shadow-sm cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-[#006D6D]' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="absolute top-5 left-5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === addr.id ? 'border-[#006D6D]' : 'border-gray-300'}`}>
                        {selectedAddress === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[#006D6D]"></div>}
                      </div>
                    </div>
                    <div className="pl-10">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-[14px] font-bold text-gray-900">{addr.name}</h3>
                          <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">
                            {addr.street}<br/>
                            {addr.city}<br/>
                            {addr.phone}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(addr) }}
                          className="text-[#006D6D] text-[12px] font-bold hover:underline"
                        >Edit</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-[15px] md:text-[16px] font-bold text-gray-900 mb-4">Shipping Method</h2>
            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-[#006D6D] bg-[#E6F7F7]/20' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                onClick={() => setShippingMethod('standard')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'standard' ? 'border-[#006D6D]' : 'border-gray-300'}`}>
                    {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-[#006D6D]"></div>}
                  </div>
                  <span className="text-[13px] font-semibold text-gray-900">Standard Shipping (7-14 Days)</span>
                </div>
                <span className="text-[13px] font-bold text-gray-900">₹10.00</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-[#006D6D] bg-[#E6F7F7]/20' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                onClick={() => setShippingMethod('express')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'express' ? 'border-[#006D6D]' : 'border-gray-300'}`}>
                    {shippingMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-[#006D6D]"></div>}
                  </div>
                  <span className="text-[13px] font-semibold text-gray-900">Express Shipping (3-7 Days)</span>
                </div>
                <span className="text-[13px] font-bold text-gray-900">₹25.00</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-[15px] font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.itemKey || item._id} className="flex justify-between text-[13px] text-gray-600">
                  <span>{item.name} × {item.qty}</span>
                  <span className="font-semibold">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between text-[13px] text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold">₹{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold text-gray-900">
                <span>Total</span>
                <span className="text-[#006D6D]">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinueToPayment}
          disabled={items.length === 0}
          className="w-full bg-[#006D6D] text-white font-bold py-4 rounded-xl text-[15px] shadow-lg hover:bg-[#005a5a] transition-all active:scale-[0.98] mt-8 disabled:opacity-60"
        >
          Continue to Payment
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[500px] p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-bold text-gray-900">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'e.g. John Doe' },
                { key: 'street', label: 'Street Address', placeholder: 'e.g. 123, Main Street, Apt 4B' },
                { key: 'city', label: 'City, State & ZIP', placeholder: 'e.g. Mumbai, MH 400001' },
                { key: 'phone', label: 'Phone Number', placeholder: 'e.g. +91 98765 43210' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wide">{label}</label>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={`w-full mt-1.5 px-4 py-3 rounded-xl border-2 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-[#006D6D] ${errors[key] ? 'border-red-400' : 'border-gray-100'}`}
                  />
                  {errors[key] && <p className="text-[11px] text-red-500 mt-1">{errors[key]}</p>}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-semibold text-[14px] hover:bg-gray-50 transition-all"
              >Cancel</button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-[#006D6D] text-white font-bold text-[14px] hover:bg-[#005a5a] transition-all shadow-md"
              >{editingAddress ? 'Save Changes' : 'Add Address'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
