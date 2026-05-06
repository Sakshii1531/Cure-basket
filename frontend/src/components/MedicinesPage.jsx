import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import med1 from '../assets/med1.png'
import med2 from '../assets/med2.png'
import med3 from '../assets/med3.png'
import med4 from '../assets/med4.png'

const allMedicines = [
  { id: 101, name: 'Lantus Solostar', generic: '(Insulin Glargine)', rating: '4.8', reviews: '210', price: '42.00', originalPrice: '62.00', badge: '32% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
  { id: 102, name: 'Viagra 50mg', generic: '(Sildenafil)', rating: '4.9', reviews: '520', price: '28.00', originalPrice: '42.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med1 },
  { id: 103, name: 'Finasteride 1mg', generic: '(Hair Loss)', rating: '4.7', reviews: '320', price: '18.00', originalPrice: '28.00', badge: '36% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
  { id: 104, name: 'Cialis 10mg', generic: '(Weekend Pill)', rating: '4.9', reviews: '480', price: '34.00', originalPrice: '50.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med2 },
  { id: 105, name: 'Metformin 500mg', generic: '(Diabetes Care)', rating: '4.9', reviews: '210', price: '12.00', originalPrice: '18.00', badge: 'Best Value', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
  { id: 106, name: 'Lumigan Eye Drops', generic: '(Bimatoprost)', rating: '4.8', reviews: '190', price: '29.00', originalPrice: '42.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
  { id: 107, name: 'Amoxicillin 500mg', generic: '(Antibiotics)', rating: '4.8', reviews: '167', price: '18.00', originalPrice: '26.00', badge: 'Top Rated', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med4 },
  { id: 108, name: 'Amlodipine 5mg', generic: '(Calcium Blocker)', rating: '4.9', reviews: '480', price: '9.00', originalPrice: '14.00', badge: 'Best Value', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med1 },
  { id: 109, name: 'Atorvastatin 20mg', generic: '(Cholesterol)', rating: '4.7', reviews: '520', price: '11.00', originalPrice: '17.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
  { id: 110, name: 'Humalog KwikPen', generic: '(Insulin Lispro)', rating: '4.7', reviews: '185', price: '45.00', originalPrice: '67.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
  { id: 111, name: 'Sildenafil 50mg', generic: '(ED Treatment)', rating: '4.8', reviews: '410', price: '22.00', originalPrice: '35.00', badge: 'Top Rated', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
  { id: 112, name: 'Systane Ultra', generic: '(Lubricant Drops)', rating: '4.9', reviews: '310', price: '12.00', originalPrice: '18.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
]

function MedicinesPage({ onProductClick }) {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 py-8 md:py-12">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#006D6D] transition-colors mb-6 font-medium group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] md:text-[42px] font-bold text-gray-900 tracking-tight mb-3">
            All Medicines
          </h1>
          <p className="text-gray-500 text-[16px] max-w-2xl leading-relaxed">
            Browse our wide range of genuine medications across all health categories. Trusted quality, delivered to you.
          </p>
        </div>

        {/* Filter Bar (Simplified) */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
           <span className="text-[14px] font-bold text-gray-500">{allMedicines.length} Medicines Found</span>
           <div className="flex items-center gap-2">
              <span className="text-[14px] text-gray-400 font-medium">Sort by:</span>
              <select className="bg-transparent border-none font-bold text-[14px] text-[#006D6D] focus:ring-0 cursor-pointer">
                 <option>Popularity</option>
                 <option>Price: Low to High</option>
                 <option>Price: High to Low</option>
              </select>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {allMedicines.map((product) => (
            <div 
              key={product.id}
              onClick={() => onProductClick?.(product)}
              className="bg-white rounded-[24px] border border-gray-100 p-4 md:p-6 relative flex flex-col h-full cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 group"
            >
              {/* Badge */}
              <div className={`absolute top-3 right-3 px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-sm z-10 ${product.badgeBg} ${product.badgeText}`}>
                {product.badge}
              </div>

              <div className="flex flex-col flex-grow">
                {/* Image Section */}
                <div className="w-full h-[120px] md:h-[160px] flex items-center justify-center mb-4 md:mb-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col text-left">
                  <h3 className="text-[14px] md:text-[17px] font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#006D6D] transition-colors min-h-[40px] md:min-h-[44px]">
                    {product.name}
                  </h3>
                  <p className="text-[#006D6D] font-semibold text-[11px] md:text-[13px] mb-2 md:mb-3">
                    {product.generic}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    <svg className="w-3 md:w-4 h-3 md:h-4 text-[#FFD200]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-[12px] md:text-[14px] font-bold text-gray-900">{product.rating}</span>
                    <span className="text-[12px] md:text-[14px] text-gray-400">({product.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Price and Button Row */}
              <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-50">
                <div className="flex flex-col text-left">
                  {product.originalPrice && (
                    <span className="text-[10px] md:text-[12px] text-gray-400 line-through font-medium leading-none mb-0.5">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-[20px] md:text-[24px] font-black text-gray-900 leading-none">
                    ${product.price}
                  </span>
                </div>
                
                <button className="w-9 h-9 md:w-11 md:h-11 bg-[#FFD200] rounded-full flex items-center justify-center text-white shadow-md active:scale-95 hover:bg-[#f39c12] transition-colors">
                  <svg className="w-5 md:w-6 h-5 md:h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MedicinesPage
