import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const emptyForm = { name: '', street: '', city: '', phone: '' }

const addrId = (addr) => addr._id?.toString() || addr.id?.toString()

const countryStates = {
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
    'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
    'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
    'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ],
  'India': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ],
  'United Kingdom': [
    'England', 'Scotland', 'Wales', 'Northern Ireland'
  ],
  'Canada': [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'
  ],
  'Australia': [
    'New South Wales', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia',
    'Australian Capital Territory', 'Northern Territory'
  ]
}

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { items: cartItems, cartTotal } = useCart()
  const { isLoggedIn } = useAuth()
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [orderError, setOrderError] = useState('')
  const [addrLoading, setAddrLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Custom visual preferences states matching screenshot
  const [activeTab, setActiveTab] = useState('shipping')
  const [billingSame, setBillingSame] = useState(true)
  const [callFrom, setCallFrom] = useState('2 AM')
  const [callTo, setCallTo] = useState('5 AM')
  const [timeZone, setTimeZone] = useState('GMT')

  // Inline address card form states matching design
  const [showInlineForm, setShowInlineForm] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [company, setCompany] = useState('')
  const [street1, setStreet1] = useState('')
  const [street2, setStreet2] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('United States')
  const [cityField, setCityField] = useState('')
  const [stateField, setStateField] = useState('Alabama')
  const [saveInAddressBook, setSaveInAddressBook] = useState(true)

  const fileInputRef = React.useRef(null)
  const [selectedRxFile, setSelectedRxFile] = useState(null)
  const [uploadingRx, setUploadingRx] = useState(false)
  const [rxError, setRxError] = useState('')
  const [uploadedRxId, setUploadedRxId] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setRxError('File size exceeds 5MB limit.')
      return
    }
    setSelectedRxFile(file)
    setRxError('')
    setUploadingRx(true)
    const formData = new FormData()
    formData.append('prescription', file)
    try {
      const res = await api.post('/prescriptions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data?.success) {
        setUploadedRxId(res.data.data?._id || res.data.data?.id)
        setUploadSuccess(true)
      }
    } catch (err) {
      setRxError(err.response?.data?.error || 'Upload failed. Please try again.')
      setSelectedRxFile(null)
      setUploadSuccess(false)
    } finally {
      setUploadingRx(false)
    }
  }

  const handleInlineAddNew = () => {
    setEditingAddress(null)
    setFirstName('')
    setLastName('')
    setMobileNo('')
    setCompany('')
    setStreet1('')
    setStreet2('')
    setZipCode('')
    setCountry('United States')
    setCityField('')
    setStateField('Alabama')
    setFormErrors({})
    setShowInlineForm(true)
  }

  const handleInlineEdit = (addr) => {
    setEditingAddress(addrId(addr))
    const nameParts = addr.name.split(' ')
    setFirstName(nameParts[0] || '')
    setLastName(nameParts.slice(1).join(' ') || '')
    setMobileNo(addr.phone || '')
    
    let s1 = addr.street || ''
    let s2 = ''
    let comp = ''
    const compMatch = s1.match(/\(([^)]+)\)/)
    if (compMatch) {
      comp = compMatch[1]
      s1 = s1.replace(/\(([^)]+)\)/, '').trim()
    }
    const parts = s1.split(',')
    s1 = parts[0] ? parts[0].trim() : ''
    s2 = parts.slice(1).join(',').trim()
    setStreet1(s1)
    setStreet2(s2)
    setCompany(comp)
    
    let cField = addr.city || ''
    let stField = 'Alabama'
    let zCode = ''
    let cntry = 'United States'
    const cityParts = cField.split(',')
    if (cityParts.length >= 3) {
      cField = cityParts[0] ? cityParts[0].trim() : ''
      const stateZipStr = cityParts[1] ? cityParts[1].trim() : ''
      const zipIndex = stateZipStr.lastIndexOf(' ')
      if (zipIndex !== -1) {
        stField = stateZipStr.substring(0, zipIndex).trim()
        zCode = stateZipStr.substring(zipIndex + 1).trim()
      } else {
        stField = stateZipStr
        zCode = ''
      }
      cntry = cityParts.slice(2).join(',').trim() || 'United States'
    } else if (cityParts.length === 2) {
      cField = cityParts[0] ? cityParts[0].trim() : ''
      const stateZipStr = cityParts[1] ? cityParts[1].trim() : ''
      const zipIndex = stateZipStr.lastIndexOf(' ')
      if (zipIndex !== -1) {
        stField = stateZipStr.substring(0, zipIndex).trim()
        zCode = stateZipStr.substring(zipIndex + 1).trim()
      } else {
        stField = stateZipStr
        zCode = ''
      }
    }

    const validCountry = countryStates[cntry] ? cntry : 'United States'
    const statesForCountry = countryStates[validCountry]
    const validState = statesForCountry.includes(stField) ? stField : (statesForCountry[0] || '')

    setCityField(cField)
    setStateField(validState)
    setZipCode(zCode)
    setCountry(validCountry)
    setFormErrors({})
    setShowInlineForm(true)
  }

  const handleInlineSave = async () => {
    const errs = {}
    if (!firstName.trim()) errs.firstName = 'First Name is required'
    if (!lastName.trim()) errs.lastName = 'Last Name is required'
    
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/
    if (!mobileNo.trim()) {
      errs.mobileNo = 'Mobile No is required'
    } else if (!phoneRegex.test(mobileNo.trim())) {
      errs.mobileNo = 'Mobile number must be 10-15 digits (e.g. 9876567890)'
    }

    if (company.trim() && (company.trim().length < 2 || company.trim().length > 50)) {
      errs.company = 'Company name must be between 2 and 50 characters'
    }

    if (!street1.trim()) errs.street1 = 'Street Address 1 is required'

    const zipTrimmed = zipCode.trim()
    if (!zipTrimmed) {
      errs.zipCode = 'Zip Code is required'
    } else {
      if (country === 'India' && !/^\d{6}$/.test(zipTrimmed)) {
        errs.zipCode = 'Zip code must be 6 digits for India (e.g. 110001)'
      } else if (country === 'United States' && !/^\d{5}(-\d{4})?$/.test(zipTrimmed)) {
        errs.zipCode = 'Zip code must be 5 digits for United States (e.g. 90210)'
      } else if (country === 'United Kingdom' && !/^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i.test(zipTrimmed)) {
        errs.zipCode = 'Invalid UK postcode format (e.g. SW1A 1AA)'
      } else if (country === 'Canada' && !/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(zipTrimmed)) {
        errs.zipCode = 'Invalid Canada postal code format (e.g. K1A 0B1)'
      } else if (country === 'Australia' && !/^\d{4}$/.test(zipTrimmed)) {
        errs.zipCode = 'Zip code must be 4 digits for Australia (e.g. 2000)'
      }
    }

    if (!cityField.trim()) errs.cityField = 'City is required'

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs)
      return
    }
    setSaving(true)
    const mappedName = `${firstName} ${lastName}`.trim()
    const mappedStreet = `${street1}${street2 ? ', ' + street2 : ''}${company ? ' (' + company + ')' : ''}`
    const mappedCity = `${cityField}, ${stateField} ${zipCode}, ${country}`
    const mappedForm = {
      name: mappedName,
      street: mappedStreet,
      city: mappedCity,
      phone: mobileNo
    }
    try {
      if (isLoggedIn) {
        if (editingAddress) {
          const res = await api.put(`/auth/me/addresses/${editingAddress}`, mappedForm)
          setAddresses(res.data.addresses)
        } else {
          const res = await api.post('/auth/me/addresses', mappedForm)
          const updated = res.data.addresses
          setAddresses(updated)
          setSelectedAddress(addrId(updated[updated.length - 1]))
        }
      } else {
        if (editingAddress !== null) {
          setAddresses(prev => prev.map(a => addrId(a) === editingAddress ? { ...a, ...mappedForm } : a))
        } else {
          const tmpId = Date.now().toString()
          setAddresses(prev => [...prev, { _id: tmpId, ...mappedForm }])
          setSelectedAddress(tmpId)
        }
      }
      setShowInlineForm(false)
      setEditingAddress(null)
    } catch (err) {
      setFormErrors({ _api: err.response?.data?.error || 'Failed to save address' })
    } finally {
      setSaving(false)
    }
  }

  // Redirect to cart if navigated here with no items and no buyNow state
  useEffect(() => {
    const isBuyNow = !!location.state?.product
    if (!isBuyNow && cartItems.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [])

  // Buy Now: location.state has { product, selectedPackage, quantity }
  const buyNow = location.state?.product ? location.state : null
  const items = buyNow
    ? [{
        itemKey: `buy_${buyNow.product._id}`,
        _id: buyNow.product._id,
        name: buyNow.product.title || buyNow.product.name,
        price: buyNow.selectedPackage?.price ?? (Number(buyNow.product.pricePerUnit) || Number(buyNow.product.price) || 0),
        qty: buyNow.quantity || 1,
        image: buyNow.product.image || null,
      }]
    : cartItems

  const subtotal = buyNow
    ? items[0].price * items[0].qty
    : cartTotal

  const shippingCost = shippingMethod === 'express' ? 25 : 10

  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [availableCoupons, setAvailableCoupons] = useState([])

  useEffect(() => {
    api.get('/coupons/active')
      .then(res => setAvailableCoupons(res.data.data || []))
      .catch(() => {})
  }, [])

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError('')
    setCouponSuccess('')
    try {
      const res = await api.post('/coupons/validate', {
        code: couponInput.trim(),
        orderTotal: subtotal
      })
      if (res.data.success) {
        setAppliedCoupon(res.data.data)
        setCouponSuccess(`Coupon "${res.data.data.code}" applied! Discount: $${res.data.data.discount}`)
      }
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Invalid coupon code')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponSuccess('')
    setCouponError('')
  }

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0
  const total = Math.max(0, subtotal - discountAmount + shippingCost)

  // Load addresses from DB on mount
  useEffect(() => {
    if (!isLoggedIn) return
    setAddrLoading(true)
    api.get('/auth/me')
      .then(res => {
        const dbAddrs = res.data.user?.addresses || []
        setAddresses(dbAddrs)
        if (dbAddrs.length > 0) setSelectedAddress(addrId(dbAddrs[0]))
      })
      .catch(() => {})
      .finally(() => setAddrLoading(false))
  }, [isLoggedIn])

  const openAddNew = () => {
    setEditingAddress(null)
    setForm(emptyForm)
    setFormErrors({})
    setShowModal(true)
  }

  const openEdit = (addr) => {
    setEditingAddress(addrId(addr))
    setForm({ name: addr.name, street: addr.street, city: addr.city, phone: addr.phone })
    setFormErrors({})
    setShowModal(true)
  }

  const validateForm = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.street.trim()) errs.street = 'Street address is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    setSaving(true)
    try {
      if (isLoggedIn) {
        if (editingAddress) {
          const res = await api.put(`/auth/me/addresses/${editingAddress}`, form)
          setAddresses(res.data.addresses)
        } else {
          const res = await api.post('/auth/me/addresses', form)
          const updated = res.data.addresses
          setAddresses(updated)
          setSelectedAddress(addrId(updated[updated.length - 1]))
        }
      } else {
        if (editingAddress !== null) {
          setAddresses(prev => prev.map(a => addrId(a) === editingAddress ? { ...a, ...form } : a))
        } else {
          const tmpId = Date.now().toString()
          setAddresses(prev => [...prev, { _id: tmpId, ...form }])
          setSelectedAddress(tmpId)
        }
      }
      setShowModal(false)
    } catch (err) {
      setFormErrors({ _api: err.response?.data?.error || 'Failed to save address' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (addr) => {
    const id = addrId(addr)
    try {
      if (isLoggedIn) {
        const res = await api.delete(`/auth/me/addresses/${id}`)
        setAddresses(res.data.addresses)
      } else {
        setAddresses(prev => prev.filter(a => addrId(a) !== id))
      }
      if (selectedAddress === id) setSelectedAddress(null)
    } catch {
      // best-effort
    }
  }

  const handleContinueToPayment = () => {
    if (items.length === 0) return
    if (!selectedAddress) {
      setOrderError('Shipping Address is required.')
      return
    }
    const addr = addresses.find(a => addrId(a) === selectedAddress)
    if (!addr) {
      setOrderError('Selected address not found.')
      return
    }
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
    <div className="bg-[#fcfcfc] min-h-screen pb-16 font-sans">
      <div className="h-1.5 bg-[#FFD200] w-full"></div>
      
      {/* Back navigation */}
      <div className="max-w-[1250px] mx-auto px-4 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-bold text-[13px]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1250px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Checkout Tabs and Forms) */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm">
            
            {/* Tabs Bar */}
            <div className="flex justify-between md:justify-start gap-8 border-b border-gray-200 pb-3 mb-6 relative">
              <button
                onClick={() => setActiveTab('shipping')}
                className={`text-[12px] md:text-[14px] font-black uppercase tracking-wider pb-3 transition-all relative ${activeTab === 'shipping' ? 'text-gray-900 font-extrabold' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Shipping Address
                {activeTab === 'shipping' && <div className="absolute bottom-[-13px] left-0 right-0 h-[4px] bg-[#006D6D]"></div>}
              </button>
              
              <button
                onClick={() => {
                  if (!selectedAddress) {
                    setOrderError('Shipping Address is required.')
                    return
                  }
                  setActiveTab('medical')
                }}
                className={`text-[12px] md:text-[14px] font-black uppercase tracking-wider pb-3 transition-all relative ${activeTab === 'medical' ? 'text-gray-900 font-extrabold' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Medical Conditions
                {activeTab === 'medical' && <div className="absolute bottom-[-13px] left-0 right-0 h-[4px] bg-[#006D6D]"></div>}
              </button>
              
              <button
                onClick={() => {
                  if (!selectedAddress) {
                    setOrderError('Shipping Address is required.')
                    return
                  }
                  setActiveTab('payment')
                }}
                className={`text-[12px] md:text-[14px] font-black uppercase tracking-wider pb-3 transition-all relative ${activeTab === 'payment' ? 'text-gray-900 font-extrabold' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Payment Method
                {activeTab === 'payment' && <div className="absolute bottom-[-13px] left-0 right-0 h-[4px] bg-[#006D6D]"></div>}
              </button>
            </div>

            {/* Tab 1: Shipping Address */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                {showInlineForm ? (
                  /* Inline form matching the design in the screenshot exactly */
                  <div className="bg-white rounded-[8px] p-1.5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      
                      {/* First Name */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Prashant"
                          value={firstName}
                          onChange={e => {
                            setFirstName(e.target.value)
                            if (formErrors.firstName) setFormErrors(prev => ({ ...prev, firstName: '' }))
                          }}
                          className={`w-full border rounded-[6px] px-3.5 py-2.5 text-[13.5px] text-gray-800 outline-none focus:border-[#006D6D] ${formErrors.firstName ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {formErrors.firstName && <p className="text-[10px] text-red-500 mt-0.5 ml-1">{formErrors.firstName}</p>}
                      </div>

                      {/* Last Name */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Dahiya"
                          value={lastName}
                          onChange={e => {
                            setLastName(e.target.value)
                            if (formErrors.lastName) setFormErrors(prev => ({ ...prev, lastName: '' }))
                          }}
                          className={`w-full border rounded-[6px] px-3.5 py-2.5 text-[13.5px] text-gray-800 outline-none focus:border-[#006D6D] ${formErrors.lastName ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {formErrors.lastName && <p className="text-[10px] text-red-500 mt-0.5 ml-1">{formErrors.lastName}</p>}
                      </div>

                      {/* Mobile No */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500">
                          Mobile No <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 9876567890 or +91 98765 67890"
                          value={mobileNo}
                          onChange={e => {
                            setMobileNo(e.target.value)
                            if (formErrors.mobileNo) setFormErrors(prev => ({ ...prev, mobileNo: '' }))
                          }}
                          className={`w-full border rounded-[6px] px-3.5 py-2.5 text-[13.5px] text-gray-800 outline-none focus:border-[#006D6D] ${formErrors.mobileNo ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {formErrors.mobileNo && <p className="text-[10px] text-red-500 mt-0.5 ml-1">{formErrors.mobileNo}</p>}
                      </div>

                      {/* Company */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500">
                          Company
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Acme Corp (Optional)"
                          value={company}
                          onChange={e => {
                            setCompany(e.target.value)
                            if (formErrors.company) setFormErrors(prev => ({ ...prev, company: '' }))
                          }}
                          className={`w-full border rounded-[6px] px-3.5 py-2.5 text-[13.5px] text-gray-800 outline-none focus:border-[#006D6D] ${formErrors.company ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {formErrors.company && <p className="text-[10px] text-red-500 mt-0.5 ml-1">{formErrors.company}</p>}
                      </div>

                      {/* Street Address 1 */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500">
                          Street Address 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. House No. 123, Sector 4"
                          value={street1}
                          onChange={e => {
                            setStreet1(e.target.value)
                            if (formErrors.street1) setFormErrors(prev => ({ ...prev, street1: '' }))
                          }}
                          className={`w-full border rounded-[6px] px-3.5 py-2.5 text-[13.5px] text-gray-800 outline-none focus:border-[#006D6D] ${formErrors.street1 ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {formErrors.street1 && <p className="text-[10px] text-red-500 mt-0.5 ml-1">{formErrors.street1}</p>}
                      </div>

                      {/* Street Address 2 */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500">
                          Street Address 2
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Apartment, Suite, Unit, etc. (Optional)"
                          value={street2}
                          onChange={e => setStreet2(e.target.value)}
                          className="w-full border border-gray-300 rounded-[6px] px-3.5 py-2.5 text-[13.5px] text-gray-800 outline-none focus:border-[#006D6D]"
                        />
                      </div>

                      {/* Zip Code */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500">
                          Zip Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 110001 (India) or 90210 (US)"
                          value={zipCode}
                          onChange={e => {
                            setZipCode(e.target.value)
                            if (formErrors.zipCode) setFormErrors(prev => ({ ...prev, zipCode: '' }))
                          }}
                          className={`w-full border rounded-[6px] px-3.5 py-2.5 text-[13.5px] text-gray-800 outline-none focus:border-[#006D6D] ${formErrors.zipCode ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {formErrors.zipCode && <p className="text-[10px] text-red-500 mt-0.5 ml-1">{formErrors.zipCode}</p>}
                      </div>

                      {/* Country */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500 z-10">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <select
                            value={country}
                            onChange={e => {
                              const selectedCountry = e.target.value
                              setCountry(selectedCountry)
                              const states = countryStates[selectedCountry] || []
                              setStateField(states[0] || '')
                            }}
                            className="w-full border border-gray-300 rounded-[6px] px-3.5 py-2.5 text-[13.5px] font-bold text-gray-800 bg-white outline-none focus:border-[#006D6D] appearance-none cursor-pointer"
                          >
                            {Object.keys(countryStates).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <span className="absolute right-3 pointer-events-none text-gray-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      {/* City */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. New Delhi"
                          value={cityField}
                          onChange={e => {
                            setCityField(e.target.value)
                            if (formErrors.cityField) setFormErrors(prev => ({ ...prev, cityField: '' }))
                          }}
                          className={`w-full border rounded-[6px] px-3.5 py-2.5 text-[13.5px] text-gray-800 outline-none focus:border-[#006D6D] ${formErrors.cityField ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {formErrors.cityField && <p className="text-[10px] text-red-500 mt-0.5 ml-1">{formErrors.cityField}</p>}
                      </div>

                      {/* State */}
                      <div className="relative mt-2">
                        <label className="absolute top-[-7px] left-3 bg-white px-1.5 text-[11px] font-bold text-gray-500 z-10">
                          State <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <select
                            value={stateField}
                            onChange={e => setStateField(e.target.value)}
                            className="w-full border border-gray-300 rounded-[6px] px-3.5 py-2.5 text-[13.5px] font-bold text-gray-800 bg-white outline-none focus:border-[#006D6D] appearance-none cursor-pointer"
                          >
                            {(countryStates[country] || []).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <span className="absolute right-3 pointer-events-none text-gray-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Save in address book checkbox */}
                    <div className="mt-4">
                      <label className="flex items-center gap-2.5 select-none cursor-pointer group w-fit">
                        <input
                          type="checkbox"
                          checked={saveInAddressBook}
                          onChange={e => setSaveInAddressBook(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 accent-[#006D6D] cursor-pointer"
                        />
                        <span className="text-[12.5px] font-bold text-gray-700">Save in address book</span>
                      </label>
                    </div>

                    {formErrors._api && (
                      <p className="text-[11px] text-red-500 font-semibold mt-2">{formErrors._api}</p>
                    )}

                    {/* Form Buttons */}
                    <div className="pt-6 flex justify-between items-center border-t border-gray-100 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowInlineForm(false)}
                        className="border border-gray-400 text-gray-600 font-bold px-8 py-2 rounded-[4px] uppercase text-[12px] hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleInlineSave}
                        disabled={saving}
                        className="bg-[#006D6D] hover:bg-[#005a5a] text-white font-bold px-12 py-2.5 rounded-full uppercase text-[12px] shadow-md tracking-wider transition-colors disabled:opacity-60"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>

                  </div>
                ) : (
                  /* Standard saved addresses list view */
                  <>
                    {addresses.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => {
                          const id = addrId(addr)
                          const isSel = selectedAddress === id
                          return (
                            <div
                              key={id}
                              onClick={() => {
                                setSelectedAddress(id)
                                setOrderError('')
                              }}
                              className={`border-2 rounded-[12px] p-4 cursor-pointer transition-all relative ${isSel ? 'border-[#006D6D] bg-[#E6F7F7]/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="pr-4">
                                  <h4 className="text-[14px] font-bold text-gray-900">{addr.name}</h4>
                                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                                    {addr.street}, {addr.city}
                                  </p>
                                  <p className="text-[12px] text-gray-500 mt-0.5">{addr.phone}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleInlineEdit(addr) }}
                                    className="text-[#006D6D] text-[11px] font-bold hover:underline"
                                  >Edit</button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(addr) }}
                                    className="text-red-500 text-[11px] font-bold hover:underline"
                                  >Delete</button>
                                </div>
                              </div>
                              {isSel && (
                                <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-[#006D6D] flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div>
                      <button
                        onClick={handleInlineAddNew}
                        className="bg-[#E6F7F7] hover:bg-[#CFF4F4] border border-[#006D6D]/20 text-[#006D6D] font-bold px-5 py-2.5 rounded-[4px] text-[12px] uppercase tracking-wide transition-colors"
                      >
                        + Add Your Shipping Address
                      </button>
                    </div>

                    <div>
                      <label className="flex items-center gap-2.5 select-none cursor-pointer mt-2 group w-fit">
                        <input
                          type="checkbox"
                          checked={billingSame}
                          onChange={e => setBillingSame(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 accent-[#006D6D] cursor-pointer"
                        />
                        <span className="text-[13px] font-bold text-gray-700">Billing Address Same as Shipping Address</span>
                      </label>
                    </div>

                    {/* Preferable Time to Call */}
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-[12px] font-black text-gray-800 uppercase tracking-wider mb-3">Preferable Time to Call *</h4>
                      <div className="grid grid-cols-3 gap-4 max-w-[500px]">
                        {/* From Selector */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 mb-1">From</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                            <select
                              value={callFrom}
                              onChange={e => setCallFrom(e.target.value)}
                              className="pl-9 pr-8 py-2 border border-gray-300 rounded-[6px] text-[13px] bg-white outline-none focus:border-[#006D6D] appearance-none cursor-pointer w-full font-bold text-gray-700"
                            >
                              {['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'].map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <span className="absolute right-3 pointer-events-none text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* To Selector */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 mb-1">To</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                            <select
                              value={callTo}
                              onChange={e => setCallTo(e.target.value)}
                              className="pl-9 pr-8 py-2 border border-gray-300 rounded-[6px] text-[13px] bg-white outline-none focus:border-[#006D6D] appearance-none cursor-pointer w-full font-bold text-gray-700"
                            >
                              {['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'].map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <span className="absolute right-3 pointer-events-none text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Time Zone Selector */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 mb-1">Time Zone</label>
                          <div className="relative flex items-center">
                            <select
                              value={timeZone}
                              onChange={e => setTimeZone(e.target.value)}
                              className="pl-3 pr-8 py-2 border border-gray-300 rounded-[6px] text-[13px] bg-white outline-none focus:border-[#006D6D] appearance-none cursor-pointer w-full font-bold text-gray-700"
                            >
                              {['GMT', 'EST', 'IST', 'PST', 'CST', 'AEST', 'BST'].map(tz => (
                                <option key={tz} value={tz}>{tz}</option>
                              ))}
                            </select>
                            <span className="absolute right-3 pointer-events-none text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          if (!selectedAddress) {
                            setOrderError('Shipping Address is required.')
                            return
                          }
                          setOrderError('')
                          setActiveTab('medical')
                        }}
                        className="bg-[#006D6D] hover:bg-[#005a5a] text-white font-bold px-12 py-3.5 rounded-full text-[14px] uppercase tracking-wider transition-all shadow-md active:scale-95"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab 2: Medical Conditions */}
            {activeTab === 'medical' && (
              <div className="space-y-6">
                <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-wider">Medical Conditions</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  We care about your health. Please share any medical conditions or upload prescriptions if you are ordering restricted medication.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Existing Conditions / Allergies (Optional)</label>
                    <textarea
                      placeholder="e.g. Asthma, Penicillin allergy, Diabetes..."
                      className="w-full border border-gray-200 rounded-[12px] p-3 text-[13px] h-24 outline-none focus:border-[#006D6D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Doctor's Prescription (Optional / Required for Prescription Medicines)</label>
                    <div
                      onClick={() => !uploadingRx && !uploadSuccess && fileInputRef.current.click()}
                      className={`border-2 border-dashed rounded-[12px] p-6 text-center bg-gray-50 transition-colors ${uploadSuccess ? 'border-green-400 bg-green-50/10' : 'border-gray-200 hover:bg-gray-100/50 cursor-pointer'}`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="hidden"
                      />
                      {uploadingRx ? (
                        <div className="flex flex-col items-center justify-center py-2">
                          <svg className="animate-spin h-8 w-8 text-[#006D6D] mb-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span className="text-[13px] font-bold text-gray-600 animate-pulse">Uploading prescription...</span>
                        </div>
                      ) : uploadSuccess ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2 shadow-md shadow-green-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-[13.5px] font-bold text-gray-900 truncate max-w-[280px]">{selectedRxFile?.name}</span>
                          <p className="text-[11px] text-green-600 font-bold mt-1">Uploaded successfully!</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedRxFile(null)
                              setUploadedRxId(null)
                              setUploadSuccess(false)
                              setRxError('')
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                            className="mt-3 text-red-500 hover:text-red-700 text-[11px] font-black uppercase tracking-wider hover:underline"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                          </svg>
                          <span className="text-[13px] font-bold text-gray-600">Choose file or drag here to upload</span>
                          <p className="text-[10px] text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                        </>
                      )}
                    </div>
                    {rxError && <p className="text-[11px] text-red-500 font-bold mt-1.5">{rxError}</p>}
                  </div>
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className="bg-white border border-gray-200 text-gray-600 font-bold px-8 py-3 rounded-full text-[14px] uppercase tracking-wider hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className="bg-[#006D6D] hover:bg-[#005a5a] text-white font-bold px-12 py-3.5 rounded-full text-[14px] uppercase tracking-wider transition-all shadow-md"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Payment Method */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-wider">Payment Method</h3>
                <p className="text-[13px] text-gray-500">Choose how you want to complete your order:</p>
                
                <div className="space-y-3">
                  {[
                    { id: 'card', name: 'Credit / Debit Card', desc: 'Secure payment via SSL payment gateway' },
                    { id: 'upi', name: 'UPI / Net Banking', desc: 'Pay instantly using PhonePe, GPay, Paytm or Net Banking' },
                    { id: 'cod', name: 'Cash on Delivery (COD)', desc: 'Pay when your package arrives at your address' },
                  ].map(pm => (
                    <div
                      key={pm.id}
                      className="border border-gray-200 rounded-[12px] p-4 bg-white flex items-center justify-between cursor-pointer hover:border-[#006D6D]/50 transition-all"
                    >
                      <div>
                        <h4 className="text-[14px] font-bold text-gray-900">{pm.name}</h4>
                        <p className="text-[12px] text-gray-400 mt-0.5">{pm.desc}</p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        {pm.id === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#006D6D]"></div>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => setActiveTab('medical')}
                    className="bg-white border border-gray-200 text-gray-600 font-bold px-8 py-3 rounded-full text-[14px] uppercase tracking-wider hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    className="bg-[#006D6D] hover:bg-[#005a5a] text-white font-bold px-12 py-3.5 rounded-full text-[14px] uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Order Summary Card) */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-[8px] p-5 shadow-sm">
            <h2 className="text-[16px] md:text-[18px] font-extrabold text-[#006D6D] tracking-wide mb-3 uppercase">
              Order Summary
            </h2>
            
            <div className="flex justify-between items-center text-[13px] text-gray-500 pb-3 border-b border-gray-150">
              <span>Cart Items</span>
              <span className="font-semibold text-gray-800">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
            </div>

            {/* Cart Items Loop */}
            <div className="py-4 space-y-4 max-h-[250px] overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.itemKey || item._id} className="flex gap-4 items-center">
                  {/* Product Image */}
                  <div className="w-[64px] h-[64px] border border-gray-200 rounded-[12px] p-1.5 bg-white flex items-center justify-center shrink-0">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                      onError={e => { e.target.src = 'https://via.placeholder.com/150' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-extrabold text-gray-800 truncate leading-tight">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-gray-400 mt-1 font-bold">
                      Pack Size
                    </div>
                    <div className="text-[11.5px] text-gray-600 font-bold leading-tight mt-0.5">
                      30 Tablet/s X {item.qty}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-150 pt-4 pb-3">
              {/* Coupon Code Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => {
                    setCouponInput(e.target.value)
                    setCouponError('')
                    setCouponSuccess('')
                  }}
                  disabled={appliedCoupon}
                  placeholder="Coupon Code"
                  className="flex-1 bg-white border border-gray-300 rounded-[4px] px-3 py-2 text-[13px] outline-none focus:border-[#006D6D] disabled:opacity-60 font-semibold text-gray-700"
                />
                {appliedCoupon ? (
                  <button
                    onClick={handleRemoveCoupon}
                    className="bg-red-50 text-red-600 font-extrabold px-4 rounded-[4px] text-[12px] border border-red-100 hover:bg-red-100 transition-colors"
                  >
                    REMOVE
                  </button>
                ) : (
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="bg-[#E6F7F7] hover:bg-[#CFF4F4] border border-[#006D6D]/20 text-[#006D6D] font-black px-6 rounded-[4px] text-[12px] uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    APPLY
                  </button>
                )}
              </div>

              {couponError && <p className="text-[11px] text-red-500 font-semibold mt-1.5">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-green-600 font-semibold mt-1.5">{couponSuccess}</p>}

              {/* Dynamic Available Coupons Box List */}
              {availableCoupons.length > 0 && (
                <div className="mt-4 space-y-2">
                  {availableCoupons.map(coupon => {
                    const isDisabled = subtotal < coupon.minOrder || appliedCoupon
                    const isCurrent = appliedCoupon?.code === coupon.code
                    return (
                      <div
                        key={coupon._id}
                        onClick={() => {
                          if (!isDisabled) {
                            setCouponInput(coupon.code)
                            setCouponLoading(true)
                            setCouponError('')
                            setCouponSuccess('')
                            api.post('/coupons/validate', {
                              code: coupon.code,
                              orderTotal: subtotal
                            })
                            .then(res => {
                              if (res.data.success) {
                                setAppliedCoupon(res.data.data)
                                setCouponSuccess(`Coupon "${res.data.data.code}" applied! Discount: $${res.data.data.discount}`)
                              }
                            })
                            .catch(err => {
                              setCouponError(err.response?.data?.error || 'Invalid coupon code')
                            })
                            .finally(() => {
                              setCouponLoading(false)
                            })
                          }
                        }}
                        className={`border rounded-[8px] p-3 flex justify-between items-center transition-all cursor-pointer relative ${
                          isCurrent
                            ? 'border-[#006D6D] bg-[#E6F7F7]/30'
                            : isDisabled
                            ? 'border-gray-150 bg-gray-50/50 opacity-60 cursor-not-allowed'
                            : 'border-gray-200 hover:border-[#006D6D]/50 bg-white'
                        }`}
                      >
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-[13px] font-black text-gray-800">
                            {coupon.discountType === 'percent' ? `${coupon.value}% OFF on all Products` : `Flat $${coupon.value} OFF`}
                          </div>
                          <div className="mt-2.5">
                            <span className="border border-gray-300 rounded-[4px] px-2.5 py-1 text-[11px] font-black text-gray-600 bg-gray-50 select-all uppercase">
                              {coupon.code}
                            </span>
                          </div>
                        </div>
                        {/* Radio Button */}
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isCurrent ? 'border-[#006D6D]' : 'border-gray-300'}`}>
                          {isCurrent && <div className="w-2 h-2 rounded-full bg-[#006D6D]"></div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pricing Subtotals Breakdown */}
            <div className="border-t border-gray-150 pt-4 space-y-3 text-[13.5px] font-semibold text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-extrabold text-gray-900">US$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Handling</span>
                <span className="font-extrabold text-gray-900">US$ {shippingCost.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-extrabold">-US$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Free comprehensive insurance coverage */}
            <div className="border-t border-gray-150 pt-4 pb-1 text-[12px] font-semibold text-gray-500 leading-normal">
              Free comprehensive insurance coverage
              <Link to="/insurance-coverage" className="text-blue-500 hover:text-blue-700 underline font-bold ml-1.5">
                Know More
              </Link>
            </div>

            {/* Order Total final row */}
            <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-[17px] font-extrabold text-gray-900">
              <span className="uppercase tracking-wide text-[14px]">Order Total</span>
              <span className="text-[#006D6D] text-[20px] font-extrabold font-mono">US$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
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

            {formErrors._api && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-2.5 rounded-xl mb-4">
                {formErrors._api}
              </div>
            )}

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
                    className={`w-full mt-1.5 px-4 py-3 rounded-xl border-2 text-[14px] text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-[#006D6D] ${formErrors[key] ? 'border-red-400' : 'border-gray-150'}`}
                  />
                  {formErrors[key] && <p className="text-[11px] text-red-500 mt-1">{formErrors[key]}</p>}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-150 text-gray-600 font-semibold text-[14px] hover:bg-gray-50 transition-all"
              >Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-[#006D6D] text-white font-bold text-[14px] hover:bg-[#005a5a] transition-all shadow-md disabled:opacity-60"
              >{saving ? 'Saving...' : editingAddress ? 'Save Changes' : 'Add Address'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
