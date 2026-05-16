import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import brand1 from '../assets/brands/brand1.png'
import brand2 from '../assets/brands/brand2.png'
import brand3 from '../assets/brands/brand3.png'
import brand4 from '../assets/brands/brand4.png'
import brand5 from '../assets/brands/brand5.png'

const staticBrands = [
  { id: 1, name: 'Brand 1', image: brand1 },
  { id: 2, name: 'Brand 2', image: brand2 },
  { id: 3, name: 'Brand 3', image: brand3 },
  { id: 4, name: 'Brand 4', image: brand4 },
  { id: 5, name: 'Brand 5', image: brand5 },
]

const PopularBrands = () => {
  const navigate = useNavigate()
  const [brands, setBrands] = useState(staticBrands)

  useEffect(() => {
    api.get('/brands?limit=10')
      .then(res => {
        const data = res.data.data
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data.map(b => ({ id: b._id, name: b.name, image: b.image || null })))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-white pt-8 pb-2 md:py-12 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-[22px] md:text-[34px] font-semibold text-gray-900 tracking-tight">
            Popular Brands
          </h2>
          <button
            onClick={() => navigate('/all-brands')}
            className="flex items-center gap-1 md:gap-2 text-[#006D6D] font-bold text-[14px] md:text-[16px] hover:underline"
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
              onClick={() => navigate(`/medicines?brand=${brand.id}&brandName=${encodeURIComponent(brand.name)}`)}
              className="bg-white border border-gray-200 rounded-[24px] p-4 flex flex-col items-center justify-center transition-all cursor-pointer h-[130px] md:h-[150px] min-w-[160px] md:min-w-[220px] shrink-0 hover:border-[#006D6D]/30 group"
            >
              <div className="flex-1 flex items-center justify-center w-full mb-2">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#006D6D]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#006D6D] font-bold text-xl">{brand.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <span className="text-[14px] md:text-[16px] font-bold text-gray-700 text-center line-clamp-1">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularBrands
