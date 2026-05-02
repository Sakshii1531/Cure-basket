import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productImg from '../assets/product.png'
import med1 from '../assets/med1.png'

// Note: In a real app, these would be dynamic based on the product
const packageOptions = [
  { id: 1, label: '10 Tablets', price: 12.00, perTablet: 1.20 },
  { id: 2, label: '30 Tablets', price: 30.00, perTablet: 1.00, popular: true },
  { id: 3, label: '60 Tablets', price: 55.00, perTablet: 0.91 },
  { id: 4, label: '120 Tablets', price: 95.00, perTablet: 0.79 },
]

function ProductDetail({ onBack }) {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product
  
  const [selectedPackage, setSelectedPackage] = useState(packageOptions[1])
  const [quantity, setQuantity] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button onClick={() => navigate('/')} className="text-[#006D6D] font-bold hover:underline">Return Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 py-4">
        <nav className="flex items-center gap-2 text-[12px] font-medium text-gray-500">
          <span className="cursor-pointer hover:text-[#006D6D]" onClick={() => navigate('/')}>Home</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="cursor-pointer hover:text-[#006D6D]">All Medicines</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="cursor-pointer hover:text-[#006D6D]">Anti Infectives</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1250px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        
        {/* Left Column: Product Visuals & Info */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
            {/* Gallery Section */}
            <div className="bg-white rounded-[32px] border border-gray-100 pt-8 px-8 pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative">
              <div className="absolute top-6 left-6">
                <span className="bg-[#006D6D] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">BEST SELLER</span>
              </div>
              <div className="absolute top-6 right-6">
                <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
              </div>

              {/* Main Image */}
              <div className="flex items-center justify-center pt-10 pb-6 h-auto overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full max-h-[700px] object-contain transform scale-[1.45]" />
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center items-center gap-3 mt-4">
                <button className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
                </button>
                {[0, 1, 2].map(idx => (
                  <div 
                    key={idx}
                    onClick={() => setActiveThumb(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-2 cursor-pointer transition-all ${activeThumb === idx ? 'border-[#006D6D]' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <img src={product.image} alt="thumb" className="w-full h-full object-contain opacity-70" />
                  </div>
                ))}
                <button className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* Prescription Required Label */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-gray-900">Prescription Required</div>
                  <div className="text-[11px] text-gray-500">This is a prescription medicine</div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-4 pt-2">
              <div>
                <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
                <div className="space-y-1">
                  <div className="text-[13px]"><span className="text-gray-500 font-medium">Generic Name:</span> <span className="text-[#006D6D] font-bold cursor-pointer hover:underline">Ivermectin</span></div>
                  <div className="text-[13px]"><span className="text-gray-500 font-medium">Category:</span> <span className="text-[#006D6D] font-bold cursor-pointer hover:underline">Anti Infectives</span></div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[12px] text-gray-600 leading-relaxed max-w-[480px]">
                  Ivermectin is used to treat certain parasitic infections in the body such as strongyloidiasis and onchocerciasis.
                </p>
                <button className="text-[#006D6D] text-[12px] font-bold flex items-center gap-1 hover:underline">
                  View full description
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#FFD200]">{"★★★★★".split('').map((s, i) => <span key={i} className="text-base">★</span>)}</div>
                  <span className="text-gray-900 font-bold text-[12px]">4.8 <span className="text-gray-400 font-medium ml-1">(120 reviews)</span></span>
                </div>
                <div className="h-3 w-[1px] bg-gray-300"></div>
                <button className="text-[#006D6D] font-bold text-[12px] hover:underline">Write a review</button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="flex flex-col items-center text-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7F7] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 leading-tight">FDA<br/>Approved</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7F7] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 leading-tight">Genuine<br/>Medicine</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7F7] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 leading-tight">Secure<br/>Payments</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-[#E6F7F7] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 leading-tight">Discreet<br/>Shipping</span>
                </div>
              </div>

              {/* Inline Upload Banner */}
              <div className="bg-[#FFF8E7] rounded-xl p-3 flex items-center justify-between gap-3 mt-16 border border-[#FFD200]/20 max-w-[420px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-gray-900 leading-tight">Upload Prescription</div>
                    <div className="text-[10px] text-gray-500 leading-tight mt-0.5">Upload and our pharmacist will review it.</div>
                  </div>
                </div>
                <button className="bg-white border-2 border-gray-100 px-3 py-1 rounded-lg font-bold text-[11px] hover:bg-gray-50 transition-all shadow-sm shrink-0">
                  Upload Now 
                  <svg className="w-2.5 h-2.5 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Cart Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 pt-3 px-6 pb-3 md:pt-4 md:px-7 md:pb-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sticky top-24">
            <div className="bg-[#FFF8E7] text-[#FBB03B] text-[9px] font-black px-2 py-0.5 rounded-md w-fit mb-1.5 uppercase tracking-tighter">Save 62%</div>
            
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[22px] md:text-[26px] font-bold text-gray-900">${selectedPackage.price.toFixed(2)}</span>
                <span className="text-gray-400 line-through text-[12px]">$31.50</span>
              </div>
              <div className="text-[#006D6D] font-bold text-[10px] mt-0.5">You save $19.50 (62%)</div>
              <div className="text-gray-400 text-[8px] mt-0.5">Inclusive of all taxes</div>
            </div>

            {/* Package Selection */}
            <div className="space-y-1.5 mb-1.5">
              <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">Select Quantity (Package)</h4>
              <div className="space-y-1.5">
                {packageOptions.map(pkg => (
                  <label 
                    key={pkg.id}
                    className={`flex items-center justify-between py-1.5 px-2.5 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage.id === pkg.id ? 'border-[#006D6D] bg-[#E6F7F7]/20' : 'border-gray-100 hover:border-gray-200'}`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${selectedPackage.id === pkg.id ? 'border-[#006D6D]' : 'border-gray-300'}`}>
                        {selectedPackage.id === pkg.id && <div className="w-1.5 h-1.5 rounded-full bg-[#006D6D]"></div>}
                      </div>
                      <span className="text-[11px] font-bold text-gray-900">{pkg.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-gray-900">${pkg.price.toFixed(2)}</div>
                      <div className={`text-[8.5px] font-medium ${selectedPackage.id === pkg.id ? 'text-[#006D6D]' : 'text-gray-400'}`}>${pkg.perTablet.toFixed(2)} / Tablet</div>
                    </div>
                    {pkg.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#FFF8E7] border border-[#FFD200]/30 px-2 py-0.5 rounded-full text-[8px] font-bold text-[#FBB03B] shadow-sm">
                        You save $6 (Most Popular)
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">Quantity</span>
              <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all font-bold text-sm"
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  readOnly
                  className="w-7 text-center bg-transparent font-bold text-gray-900 text-[11px] focus:outline-none"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button className="w-full bg-[#FFD200] text-gray-900 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,210,0,0.1)] hover:scale-[1.01] transition-all text-[13px]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Add to Cart
              </button>
              <button className="w-full bg-white border-2 border-gray-100 text-gray-900 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all text-[13px]">
                <svg className="w-4 h-4 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Features Bar */}
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 mt-12 mb-8">
        <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              title: 'Fast & Discreet Delivery', 
              desc: 'Get medicines delivered to your doorstep',
              icon: <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2.5a1.5 1.5 0 01-3 0V16m-4 0h4m-4 0a1 1 0 00-1 1v2.5a1.5 1.5 0 01-3 0V16" />
            },
            { 
              title: '100% Genuine Medicines', 
              desc: 'Sourced from licensed pharmacies',
              icon: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            },
            { 
              title: 'Secure Payments', 
              desc: 'Your payments are safe & encrypted',
              icon: <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            },
            { 
              title: '24/7 Customer Support', 
              desc: 'We are here to help you anytime',
              icon: <><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></>
            }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <svg className="w-5 h-5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  {item.icon}
                  {idx === 0 && <path d="M13 9h4l3 3v4a1 1 0 01-1 1h-3" />}
                </svg>
              </div>
              <div>
                <div className="text-[12px] font-bold text-gray-900">{item.title}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 mt-8 mb-16">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex items-center gap-8 px-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
            {['Product Information', 'Uses', 'Side Effects', 'How to Use', 'Safety Advice', 'FAQs', 'Reviews (120)'].map((tab, idx) => (
              <button 
                key={tab} 
                className={`py-5 text-[13px] font-bold whitespace-nowrap transition-all relative ${idx === 0 ? 'text-[#006D6D]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab}
                {idx === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#006D6D] rounded-t-full"></div>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-12 items-start">
            {/* Left side: Specs */}
            <div className="space-y-5">
              {[
                { label: 'Manufacturer', value: 'Ajanta Pharma Ltd.' },
                { label: 'Salt Composition', value: 'Ivermectin (12 mg)' },
                { label: 'Packaging', value: '10 Tablets in 1 Strip' },
                { label: 'Storage', value: 'Store below 30°C. Protect from light & moisture.' },
                { label: 'Prescription', value: 'Required' },
                { label: 'Delivery Time', value: 'Usually delivers in 1-2 days', highlight: true }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-12">
                  <div className="w-32 text-[13px] font-bold text-gray-400 shrink-0">{item.label}</div>
                  <div className="flex-1">
                    {item.highlight ? (
                      <span className="bg-[#E6F7F7] text-[#006D6D] text-[11px] font-bold px-3 py-1 rounded-full">{item.value}</span>
                    ) : (
                      <span className="text-[13px] font-bold text-gray-700">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Why Choose Us */}
            <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-[16px] font-bold text-gray-900 mb-4">Why choose CureBasket?</h3>
                <div className="space-y-3">
                  {[
                    'Lowest prices guaranteed',
                    'Genuine medicines from trusted pharmacies',
                    'Secure payments & data protection',
                    'Discreet packaging & on-time delivery',
                    '24/7 customer support'
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#E6F7F7] flex items-center justify-center mt-0.5 shrink-0">
                        <svg className="w-2.5 h-2.5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-[12px] font-bold text-gray-600 leading-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Graphic Asset */}
              <div className="absolute bottom-0 -right-4 w-48 h-48 opacity-90 pointer-events-none">
                <img src={productImg} alt="CureBasket Product" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 mt-12 mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-gray-900">Frequently Bought Together</h2>
          <button 
            onClick={() => navigate('/all-products')}
            className="flex items-center gap-2 text-[#006D6D] text-[13px] font-bold hover:gap-3 transition-all"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <div className="relative group">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Doxycycline 100 mg Tablet', qty: '10 Tablets', price: '$8.50' },
              { name: 'Albendazole 400 mg Tablet', qty: '1 Tablet', price: '$2.20' },
              { name: 'Vitamin C 500 mg Tablet', qty: '10 Tablets', price: '$4.10' },
              { name: 'Zincovit Tablet', qty: '15 Tablets', price: '$3.30' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-5 group/card">
                <div className="flex items-start gap-4">
                  <div className="w-28 h-20 rounded-lg flex items-center justify-center shrink-0">
                    <img src={med1} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-tight h-8">{item.name}</h3>
                    <p className="text-[11px] font-bold text-gray-400 mt-1">{item.qty}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[15px] font-bold text-gray-900">{item.price}</span>
                      <button className="flex items-center gap-1.5 border-2 border-[#006D6D]/10 text-[#006D6D] px-3 py-1 rounded-lg text-[12px] font-bold hover:bg-[#006D6D] hover:text-white hover:border-[#006D6D] transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2.5"/></svg>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Arrows (Visual placeholders as per screenshot) */}
          <button className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-[#006D6D] transition-all hidden lg:flex">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-[#006D6D] transition-all hidden lg:flex">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
