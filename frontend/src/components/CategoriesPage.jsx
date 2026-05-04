import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const categories = [
  {
    id: 1,
    name: 'Insulin & Diabetes Care',
    desc: 'All types of insulin, needles, pumps',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M19.5 13.5L13.5 19.5M13 3l3-3m-8 13l3-3m-6 6l-3 3M11 8l2 2m-2-2l-2-2m2 2l2-2m-2 2l-2 2m5-3l1.5 1.5m-3-3l1.5 1.5m6.5 1.5l1.5 1.5m-3-3l1.5 1.5m-11 5L15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 2,
    name: 'Prescription Medications',
    desc: 'Upload & order prescriptions',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 3,
    name: 'Non-Prescription (OTC)',
    desc: 'Pain relief, vitamins, cold & flu',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 4,
    name: "Men's Health",
    desc: 'Hair loss, ED, testosterone',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M10 14l-7 7m0 0h5m-5 0V16m7-2a7 7 0 119.9-9.9L10 14z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 5,
    name: "Women's Health",
    desc: 'Feminine care, PCOS, menopause',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 6,
    name: 'Weight Loss',
    desc: 'GLP-1, orlistat, diet supplements',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 7,
    name: 'Chronic Conditions',
    desc: 'BP, cholesterol, thyroid, asthma',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 8,
    name: 'First Aid & Wellness',
    desc: 'Bandages, sanitizers, hygiene',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
]

const CategoriesPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-50 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[20px] font-bold text-gray-900">Categories</h1>
        </div>
        <div className="relative">
          <svg className="w-7 h-7 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#006D6D] transition-all text-[15px]"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="px-4">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {filteredCategories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => navigate('/all-products')}
              className={`w-full flex items-center gap-4 p-5 text-left transition-colors active:bg-gray-50 ${index !== filteredCategories.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                {cat.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-bold text-gray-900 leading-tight mb-1">{cat.name}</h3>
                <p className="text-[12px] text-gray-500 font-medium">{cat.desc}</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage
