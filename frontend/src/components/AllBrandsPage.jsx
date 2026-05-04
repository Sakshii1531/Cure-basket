import React, { useEffect } from 'react'
import brand1 from '../assets/brands/brand1.png'
import brand2 from '../assets/brands/brand2.png'
import brand3 from '../assets/brands/brand3.png'
import brand4 from '../assets/brands/brand4.png'
import brand5 from '../assets/brands/brand5.png'

const brands = [
  { id: 1, name: 'Brand 1', logo: brand1 },
  { id: 2, name: 'Brand 2', logo: brand2 },
  { id: 3, name: 'Brand 3', logo: brand3 },
  { id: 4, name: 'Brand 4', logo: brand4 },
  { id: 5, name: 'Brand 5', logo: brand5 },
]

function AllBrandsPage({ onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white min-h-screen">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <div 
              key={brand.id}
              className="bg-white border border-gray-200 rounded-[24px] p-4 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all cursor-pointer h-[140px] group"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-w-[100%] max-h-[100%] object-contain mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllBrandsPage
