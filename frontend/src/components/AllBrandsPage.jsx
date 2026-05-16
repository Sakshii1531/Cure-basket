import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function AllBrandsPage({ onBack }) {
  const navigate = useNavigate()
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    api.get('/brands')
      .then(res => {
        const data = res.data.data
        if (Array.isArray(data)) {
          setBrands(data.map(b => ({ id: b._id, name: b.name, logo: b.logo || null })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 py-8 md:py-12">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#006D6D] transition-colors mb-6 font-medium group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[36px] md:text-[48px] font-bold text-gray-900 tracking-tight mb-4">
            All Popular Brands
          </h1>
          <p className="text-gray-500 text-[18px] max-w-2xl leading-relaxed">
            We partner with the world's leading pharmaceutical manufacturers to ensure you receive the highest quality medications and healthcare products.
          </p>
        </div>

        {/* Brands Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[24px] h-[140px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {brands.map((brand) => (
              <div 
                key={brand.id}
                onClick={() => navigate(`/medicines?brand=${brand.id}&brandName=${encodeURIComponent(brand.name)}`)}
                className="bg-white border border-gray-100 rounded-[24px] p-4 flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:border-[#006D6D]/30 transition-all cursor-pointer h-[140px] group"
              >
                {brand.logo ? (
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="max-w-[90%] max-h-[70%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
                  />
                ) : null}
                <span className="text-[15px] md:text-[18px] font-bold text-gray-700 text-center" style={{ display: brand.logo ? 'none' : 'block' }}>
                  {brand.name}
                </span>
                <p className="text-[12px] text-gray-400 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Medicines</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllBrandsPage
