import React from 'react'
import { useNavigate } from 'react-router-dom'
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

const PopularBrands = () => {
  const navigate = useNavigate()

  return (
    <section className="bg-white py-12 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[28px] md:text-[34px] font-semibold text-gray-900 tracking-tight">
            Popular Brands
          </h2>
          <button 
            onClick={() => navigate('/all-brands')}
            className="flex items-center gap-2 text-[#006D6D] font-bold text-[16px] hover:underline"
          >
            View all
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide no-scrollbar">
          {brands.map((brand) => (
            <div 
              key={brand.id}
              className="bg-white border border-gray-200 rounded-[24px] p-2 flex items-center justify-center transition-all cursor-pointer h-[110px] min-w-[160px] md:min-w-[220px] shrink-0 hover:border-[#006D6D]/30"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-w-[95%] max-h-[95%] object-contain mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularBrands
