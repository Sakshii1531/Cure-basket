import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const categories = [
  {
    id: 1,
    name: 'Insulin & Diabetes Care',
    desc: 'All types of insulin, needles, pumps',
    icon: (
      <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M19.5 13.5L13.5 19.5M13 3l3-3m-8 13l3-3m-6 6l-3 3M11 8l2 2m-2-2l-2-2m2 2l2-2m-2 2l-2 2m5-3l1.5 1.5m-3-3l1.5 1.5m6.5 1.5l1.5 1.5m-3-3l1.5 1.5m-11 5L15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 2,
    name: 'Prescription Medications',
    desc: 'Upload & order prescriptions',
    icon: (
      <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 3,
    name: 'Non-Prescription (OTC)',
    desc: 'Pain relief, vitamins, cold & flu',
    icon: (
      <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 4,
    name: "Men's Health",
    desc: 'Hair loss, ED, testosterone',
    icon: (
      <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M10 14l-7 7m0 0h5m-5 0V16m7-2a7 7 0 119.9-9.9L10 14z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 5,
    name: "Women's Health",
    desc: 'Feminine care, PCOS, menopause',
    icon: (
      <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 6,
    name: 'Weight Loss',
    desc: 'GLP-1, orlistat, diet supplements',
    icon: (
      <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 7,
    name: 'Chronic Conditions',
    desc: 'BP, cholesterol, thyroid, asthma',
    icon: (
      <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 8,
    name: 'First Aid & Wellness',
    desc: 'Bandages, sanitizers, hygiene',
    icon: (
      <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
]

/* ─── Mobile-only flat list items (matching the screenshot style) ─── */
const mobileMenuItems = [
  { label: 'All Categories', path: null, isCategory: false, hasArrow: true },
  { label: "Men's Health", path: "/category/Men's Health", isCategory: true, hasArrow: true },
  { label: 'Eye Care', path: '/category/Eye Care', isCategory: true, hasArrow: false },
  { label: 'Track Order', path: '/track-order', isCategory: false, hasArrow: false },
  { label: 'Service Reviews', path: '/all-reviews', isCategory: false, hasArrow: false },
]

/* ─── Full list shown when All Categories is tapped ─── */
const allCategoriesList = [
  'Acid Reflux',
  'Acne',
  'Alcohol & Drug Treatment',
  'Allergy',
  'Alpha Blockers',
  'Alzheimers',
  'Angina Pectoris Anti-Anginals',
  'Anthelmintic & Anti-worm',
  'Anti Amebics',
  'Anti Androgen',
  'Anti Cancer',
  'Anti Coagulants',
  'Anti Convulsant',
  'Anti Emetic',
  'Anti Migraine',
  'Anti Parkinsonian',
  'Anti Viral',
  'Antibiotics',
  'Antifungal',
  'Asthma',
  'Available Products',
  'Beauty & Skin Care',
  'Best Selling Products',
  'Birth Control',
  'Bladder Prostate',
  'Diabetes',
  'ED Pills Online',
  'Eye Care',
  'Featured Products',
  'Free Shipping Products',
  'Gastro Health',
  'Hair Loss',
  'Heart & Blood Pressure',
  'HIV & Herpes',
  'Hypothyroidism',
  'Immunosuppressive',
  'Insulin & Diabetes Care',
  "Men's Health",
  'Non-Prescription (OTC)',
  'Pain Relief',
  'Prescription Medications',
  'Sexual Wellness',
  'Skin Care',
  'Sleep Disorders',
  'Thyroid',
  'Vitamins & Supplements',
  'Weight Loss',
  "Women's Health",
]

const mensHealthSubItems = [
  { label: "ALL MEN'S HEALTH", path: "/category/Men's Health" },
  { label: 'THE BLUE PILL (SILDENAFIL)', path: '/category/Sildenafil' },
  { label: 'THE WEEKENDPILL (TADALAFIL)', path: '/category/Tadalafil' },
  { label: 'VARDENAFIL', path: '/category/Vardenafil' },
]

const CategoriesPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [mensHealthExpanded, setMensHealthExpanded] = useState(false)

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMobileItemClick = (item) => {
    if (item.label === 'All Categories') {
      setShowAll(true)
    } else if (item.label === "Men's Health") {
      setMensHealthExpanded(prev => !prev)
    } else if (item.label === 'Service Reviews') {
      navigate('/')
      setTimeout(() => {
        document.getElementById('service-reviews')?.scrollIntoView({ behavior: 'smooth' })
      }, 400)
    } else if (item.path) {
      navigate(encodeURI(item.path))
    }
  }

  return (
    <>
      {/* ══════════════ ALL CATEGORIES OVERLAY (Mobile only) ══════════════ */}
      {showAll && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center px-4 py-4 border-b border-gray-100">
            <button
              onClick={() => setShowAll(false)}
              className="text-gray-800 font-bold text-[18px] leading-none w-8 h-8 flex items-center justify-center active:scale-90 transition-transform"
            >
              ✕
            </button>
          </div>
          {/* Scrollable Category List */}
          <div className="flex-1 overflow-y-auto" style={{ background: '#f2f2ee' }}>
            {allCategoriesList.map((cat, i) => (
              <button
                key={i}
                onClick={() => {
                  setShowAll(false)
                  navigate(`/category/${encodeURIComponent(cat)}`)
                }}
                className="w-full text-left px-5 py-[14px] text-[14px] font-medium text-gray-800 active:bg-gray-200 transition-colors"
                style={{ borderBottom: '1px solid #e0e0da' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* ══════════════ MOBILE VIEW ══════════════ */}
      <div className="md:hidden min-h-screen pb-24" style={{ background: '#f0f0eb' }}>

        {/* Sticky Header */}
        <div className="bg-white px-4 py-3 sticky top-0 z-50 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 active:scale-90 transition-transform">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-[16px] font-bold text-gray-900 tracking-tight">Categories</h1>
          </div>
          <div className="relative">
            <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#006D6D] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </div>
        </div>

        {/* Flat List */}
        <div className="mt-3 mx-0">
          {mobileMenuItems.map((item, index) => (
            <div key={index}>
              {/* Main Item Row */}
              <button
                onClick={() => handleMobileItemClick(item)}
                className="w-full flex items-center justify-between px-5 py-[15px] text-left active:bg-[#e8e8e2] transition-colors"
                style={{ borderBottom: mensHealthExpanded && item.label === "Men's Health" ? 'none' : '1px solid #d8d8d2' }}
              >
                <span
                  className="text-[13px] font-bold uppercase tracking-widest"
                  style={{ color: '#006D6D', letterSpacing: '0.08em' }}
                >
                  {item.label}
                </span>
                {item.hasArrow && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300"
                    style={{
                      background: '#006D6D',
                      transform: (item.label === "Men's Health" && mensHealthExpanded) ? 'rotate(-90deg)' : 'rotate(0deg)'
                    }}
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>

              {/* Men's Health Sub-items (accordion) */}
              {item.label === "Men's Health" && mensHealthExpanded && (
                <div style={{ background: '#e8e8e3', borderBottom: '1px solid #d8d8d2' }}>
                  {mensHealthSubItems.map((sub, si) => (
                    <button
                      key={si}
                      onClick={() => navigate(encodeURI(sub.path))}
                      className="w-full text-left px-8 py-[13px] active:bg-[#ddddd8] transition-colors"
                      style={{ borderBottom: si !== mensHealthSubItems.length - 1 ? '1px solid #d0d0ca' : 'none' }}
                    >
                      <span
                        className="text-[12px] font-bold uppercase tracking-widest"
                        style={{ color: '#006D6D', letterSpacing: '0.07em' }}
                      >
                        {sub.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ DESKTOP VIEW (unchanged) ══════════════ */}
      <div className="hidden md:block bg-[#f8f9fa] min-h-screen pb-20">
        {/* Header */}
        <div className="bg-white px-4 py-3 sticky top-0 z-50 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-[17px] font-bold text-gray-900">Categories</h1>
          </div>
          <div className="relative">
            <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#006D6D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#006D6D] transition-all text-[13px]"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="px-3">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {filteredCategories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                className={`w-full flex items-center gap-3 py-3.5 px-4 text-left transition-colors active:bg-gray-50 ${index !== filteredCategories.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="w-10 h-10 bg-[#E6F7F7] rounded-xl flex items-center justify-center shrink-0">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-gray-900 leading-tight mb-0.5">{cat.name}</h3>
                  <p className="text-[11px] text-gray-500 font-medium">{cat.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoriesPage
