import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const defaultAddresses = [
  {
    id: 1,
    name: "John Doe",
    street: "123, Main Street, Apt 4B",
    city: "New York, NY 10001, USA",
    phone: "+1 123 456 7890"
  }
]

const emptyForm = { name: '', street: '', city: '', phone: '' }

const Checkout = () => {
  const navigate = useNavigate()
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [addresses, setAddresses] = useState(defaultAddresses)
  const [selectedAddress, setSelectedAddress] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null) // null = add new
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

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
      setAddresses(prev => [...prev, { id: newId, ...form }])
      setSelectedAddress(newId)
    }
    setShowModal(false)
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
          <h1 className="text-[15px] md:text-[18px] font-semibold text-gray-800 whitespace-nowrap">Checkout</h1>
        </div>
        <div className="flex justify-end"></div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="flex items-start justify-center mb-12 max-w-[500px] mx-auto gap-0">
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#006D6D] text-white flex items-center justify-center font-bold text-[14px] shadow-lg shadow-[#006D6D]/20">1</div>
            <span className="text-[11px] font-bold text-[#006D6D]">Address</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-[18px] mx-3"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-[14px]">2</div>
            <span className="text-[11px] font-medium text-gray-400">Payment</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-[18px] mx-3"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-[14px]">3</div>
            <span className="text-[11px] font-medium text-gray-400">Review</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Shipping Address */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[15px] md:text-[16px] font-bold text-gray-900">Shipping Address</h2>
              <button onClick={openAddNew} className="text-[#006D6D] text-[12px] font-bold hover:underline">+ Add New</button>
            </div>
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
          </div>

          {/* Shipping Method */}
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
                <span className="text-[13px] font-bold text-gray-900">$10.00</span>
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
                <span className="text-[13px] font-bold text-gray-900">$25.00</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button onClick={() => navigate('/payment')} className="w-full bg-[#006D6D] text-white font-bold py-4 rounded-xl text-[15px] shadow-lg hover:bg-[#005a5a] transition-all active:scale-[0.98] mt-12">
          Continue to Payment
        </button>
      </div>

      {/* Address Modal */}
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
                { key: 'city', label: 'City, State & ZIP', placeholder: 'e.g. New York, NY 10001, USA' },
                { key: 'phone', label: 'Phone Number', placeholder: 'e.g. +1 123 456 7890' },
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
