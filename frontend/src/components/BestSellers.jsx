import React from 'react'
import { useNavigate } from 'react-router-dom'
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

function BestSellers({ onProductClick }) {
  const navigate = useNavigate()
  const visibleProducts = bestSellers.slice(0, 3)

  return (
    <section className="bg-white py-12 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-[28px] md:text-[34px] font-semibold text-gray-900 tracking-tight">
              Best Sellers
            </h2>
          </div>
          <button 
            onClick={() => navigate('/best-sellers')}
            className="flex items-center gap-2 text-[#006D6D] font-bold text-[16px] hover:underline"
          >
            View all
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProducts.map((product) => (
            <div 
              key={product.id}
              onClick={() => onProductClick?.(product)}
              className="bg-white rounded-[24px] border border-gray-200 px-4 py-3 relative flex flex-col h-full cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              {/* Badge */}
              <div className={`absolute top-1 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm z-10 ${product.badgeBg} ${product.badgeText}`}>
                {product.badge}
              </div>

              <div className="flex items-start gap-4 mt-1 flex-grow">
                {/* Image Section */}
                <div className="w-[160px] h-[150px] shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col pt-2">
                  <h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 leading-tight mb-0.5">
                    {product.name}
                  </h3>
                  <p className="text-[#006D6D] font-semibold text-[13px] mb-2">
                    {product.generic}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <svg className="w-3.5 h-3.5 text-[#FFD200]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-[13px] font-bold text-gray-900">{product.rating}</span>
                    <span className="text-[13px] text-gray-400">({product.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Price and Button Row */}
              <div className="mt-1 flex justify-between items-end">
                <div className="flex flex-col">
                  {product.originalPrice && (
                    <span className="text-[12px] text-gray-400 line-through font-medium leading-none mb-0.5">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-[26px] font-black text-gray-900 leading-none">
                    ${product.price}
                  </span>
                </div>
                
                <button className="w-10 h-10 bg-[#FFD200] rounded-full flex items-center justify-center text-white shadow-md active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellers
