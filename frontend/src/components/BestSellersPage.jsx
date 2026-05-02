import React, { useEffect } from 'react'
import ivermectinImg from '../assets/med1.png'
import aretGelImg from '../assets/med2.png'
import mebexImg from '../assets/med3.png'
import pharm1 from '../assets/pharm-1.png'
import pharm2 from '../assets/pharm-2.png'
import pharm3 from '../assets/pharm-3.png'
import pharm4 from '../assets/pharm-4.png'
import pharm5 from '../assets/pharm-5.png'

const bestSellers = [
  {
    id: 1,
    name: "Austro Ivermectin 12 mg",
    generic: "(Ivermectin)",
    rating: "4.8",
    reviews: "120",
    price: "115",
    image: ivermectinImg,
    badge: "Best Seller",
    badgeBg: "bg-[#FFD200]",
    badgeText: "text-gray-900"
  },
  {
    id: 2,
    name: "A Ret Gel - 0.1%",
    generic: "(Tretinoin Gel)",
    rating: "4.6",
    reviews: "98",
    originalPrice: "45.00",
    price: "40.50",
    image: aretGelImg,
    badge: "10% OFF",
    badgeBg: "bg-[#006D6D]",
    badgeText: "text-white"
  },
  {
    id: 3,
    name: "Mebex 100mg",
    generic: "(Mebendazole)",
    rating: "4.7",
    reviews: "76",
    originalPrice: "63.00",
    price: "60.00",
    image: mebexImg,
    badge: "5% OFF",
    badgeBg: "bg-[#006D6D]",
    badgeText: "text-white"
  },
  {
    id: 4,
    name: "Metformin 500mg",
    generic: "(Diabetes Care)",
    rating: "4.9",
    reviews: "210",
    price: "12",
    image: pharm1,
    badge: "Best Value",
    badgeBg: "bg-[#FFD200]",
    badgeText: "text-gray-900"
  },
  {
    id: 5,
    name: "Atorvastatin 20mg",
    generic: "(Cholesterol)",
    rating: "4.5",
    reviews: "145",
    price: "24",
    image: pharm2,
    badge: "Popular",
    badgeBg: "bg-[#006D6D]",
    badgeText: "text-white"
  },
  {
    id: 6,
    name: "Lisinopril 10mg",
    generic: "(Blood Pressure)",
    rating: "4.6",
    reviews: "89",
    price: "15",
    image: pharm3,
    badge: "Verified",
    badgeBg: "bg-[#006D6D]",
    badgeText: "text-white"
  },
  {
    id: 7,
    name: "Amoxicillin 500mg",
    generic: "(Antibiotics)",
    rating: "4.8",
    reviews: "167",
    price: "18",
    image: pharm4,
    badge: "Top Rated",
    badgeBg: "bg-[#FFD200]",
    badgeText: "text-gray-900"
  },
  {
    id: 8,
    name: "Sertraline 50mg",
    generic: "(Mental Health)",
    rating: "4.7",
    reviews: "132",
    price: "20",
    image: pharm5,
    badge: "Safe Care",
    badgeBg: "bg-[#006D6D]",
    badgeText: "text-white"
  }
]

function BestSellersPage({ onProductClick, onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 py-8 md:py-12">
        {/* Breadcrumbs / Back */}
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
            Best Sellers
          </h1>
          <p className="text-gray-500 text-[18px] max-w-2xl leading-relaxed">
            Discover our most trusted and high-demand medications. Handpicked for quality, effectiveness, and value.
          </p>
        </div>

        {/* Filter Bar Placeholder */}
        <div className="flex flex-wrap gap-4 mb-10 pb-6 border-b border-gray-100">
          <span className="px-6 py-2 rounded-full bg-[#E6F7F7] text-[#006D6D] font-bold text-[14px]">All Products ({bestSellers.length})</span>
          <span className="px-6 py-2 rounded-full bg-gray-50 text-gray-500 font-bold text-[14px] cursor-pointer hover:bg-gray-100 transition-colors">Chronic Care</span>
          <span className="px-6 py-2 rounded-full bg-gray-50 text-gray-500 font-bold text-[14px] cursor-pointer hover:bg-gray-100 transition-colors">Acute Meds</span>
          <span className="px-6 py-2 rounded-full bg-gray-50 text-gray-500 font-bold text-[14px] cursor-pointer hover:bg-gray-100 transition-colors">Mental Health</span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <div 
              key={product.id}
              onClick={() => onProductClick?.(product)}
              className="bg-white rounded-[24px] border border-gray-200 px-4 py-3 relative flex flex-col h-full cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow group"
            >
              {/* Badge */}
              <div className={`absolute top-1 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm z-10 ${product.badgeBg} ${product.badgeText}`}>
                {product.badge}
              </div>

              <div className="flex flex-col flex-grow">
                {/* Image Section */}
                <div className="w-full h-[180px] flex items-center justify-center mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col">
                  <h3 className="text-[17px] font-bold text-gray-900 leading-tight mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[#006D6D] font-semibold text-[13px] mb-3">
                    {product.generic}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    <svg className="w-4 h-4 text-[#FFD200]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-[14px] font-bold text-gray-900">{product.rating}</span>
                    <span className="text-[14px] text-gray-400">({product.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Price and Button Row */}
              <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-50">
                <div className="flex flex-col">
                  {product.originalPrice && (
                    <span className="text-[12px] text-gray-400 line-through font-medium leading-none mb-0.5">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-[28px] font-black text-gray-900 leading-none">
                    ${product.price}
                  </span>
                </div>
                
                <button className="w-11 h-11 bg-[#FFD200] rounded-full flex items-center justify-center text-white shadow-md active:scale-95 hover:bg-[#f39c12] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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

export default BestSellersPage
