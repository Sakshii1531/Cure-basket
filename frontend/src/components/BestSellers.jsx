import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import ivermectinImg from '../assets/med1.png'
import aretGelImg from '../assets/med2.png'
import mebexImg from '../assets/med3.png'
import pharm1 from '../assets/pharm-1.png'
import pharm2 from '../assets/pharm-2.png'
import pharm3 from '../assets/pharm-3.png'
import pharm4 from '../assets/pharm-4.png'
import pharm5 from '../assets/pharm-5.png'

const staticBestSellers = [
  { id: 1, name: "Austro Ivermectin 12 mg", generic: "(Ivermectin)", rating: "4.8", reviews: "120", price: 115, image: ivermectinImg, badge: "Best Seller", badgeBg: "bg-[#FFD200]", badgeText: "text-gray-900" },
  { id: 2, name: "A Ret Gel - 0.1%", generic: "(Tretinoin Gel)", rating: "4.6", reviews: "98", originalPrice: 45, price: 40.50, image: aretGelImg, badge: "10% OFF", badgeBg: "bg-[#006D6D]", badgeText: "text-white" },
  { id: 3, name: "Mebex 100mg", generic: "(Mebendazole)", rating: "4.7", reviews: "76", originalPrice: 63, price: 60, image: mebexImg, badge: "5% OFF", badgeBg: "bg-[#006D6D]", badgeText: "text-white" },
  { id: 4, name: "Metformin 500mg", generic: "(Diabetes Care)", rating: "4.9", reviews: "210", price: 12, image: pharm1, badge: "Best Value", badgeBg: "bg-[#FFD200]", badgeText: "text-gray-900" },
  { id: 5, name: "Atorvastatin 20mg", generic: "(Cholesterol)", rating: "4.5", reviews: "145", price: 24, image: pharm2, badge: "Popular", badgeBg: "bg-[#006D6D]", badgeText: "text-white" },
  { id: 6, name: "Lisinopril 10mg", generic: "(Blood Pressure)", rating: "4.6", reviews: "89", price: 15, image: pharm3, badge: "Verified", badgeBg: "bg-[#006D6D]", badgeText: "text-white" },
  { id: 7, name: "Amoxicillin 500mg", generic: "(Antibiotics)", rating: "4.8", reviews: "167", price: 18, image: pharm4, badge: "Top Rated", badgeBg: "bg-[#FFD200]", badgeText: "text-gray-900" },
  { id: 8, name: "Sertraline 50mg", generic: "(Mental Health)", rating: "4.7", reviews: "132", price: 20, image: pharm5, badge: "Safe Care", badgeBg: "bg-[#006D6D]", badgeText: "text-white" },
]

const fallbackImages = [ivermectinImg, aretGelImg, mebexImg, pharm1, pharm2, pharm3, pharm4, pharm5]
const badges = [
  { badge: "Best Seller", badgeBg: "bg-[#FFD200]", badgeText: "text-gray-900" },
  { badge: "10% OFF", badgeBg: "bg-[#006D6D]", badgeText: "text-white" },
  { badge: "Popular", badgeBg: "bg-[#006D6D]", badgeText: "text-white" },
  { badge: "Top Rated", badgeBg: "bg-[#FFD200]", badgeText: "text-gray-900" },
]

function BestSellers({ onProductClick }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [products, setProducts] = useState(staticBestSellers)

  useEffect(() => {
    api.get('/medicines?limit=8&isBestSeller=true')
      .then(res => {
        const data = res.data.data
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.map((m, i) => ({
            id: m._id,
            _id: m._id,
            name: m.name,
            generic: m.genericName ? `(${m.genericName})` : '',
            rating: m.rating || '4.5',
            reviews: m.reviewCount || '0',
            price: m.price,
            originalPrice: m.originalPrice || null,
            image: m.image || fallbackImages[i % fallbackImages.length],
            ...badges[i % badges.length],
          })))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-white pt-2 pb-12 md:py-12 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8 px-1">
          <div className="flex items-center gap-2 md:gap-3">
            <h2 className="text-[22px] md:text-[34px] font-bold text-gray-900 tracking-tight">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => navigate('/best-sellers')}
            className="flex items-center gap-1 md:gap-2 text-[#006D6D] font-bold text-[14px] md:text-[16px] hover:underline"
          >
            View all
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-6 px-1 scroll-smooth">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductClick?.(product)}
              className="min-w-[170px] md:min-w-[400px] bg-white rounded-[20px] md:rounded-[24px] border border-gray-100 md:border-gray-200 px-3 py-1.5 md:px-4 md:py-2.5 relative flex flex-col h-full cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow"
            >
              <div className={`absolute top-2 right-2 md:top-1 md:right-4 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-sm z-10 ${product.badgeBg} ${product.badgeText}`}>
                {product.badge}
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 mt-1 flex-grow">
                <div className="w-full md:w-[160px] h-[80px] md:h-[130px] shrink-0 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                    onError={e => { e.target.src = ivermectinImg }}
                  />
                </div>

                <div className="flex flex-col w-full text-left md:pt-2">
                  <h3 className="text-[13px] md:text-[18px] font-bold text-gray-900 leading-tight mb-0.5 min-h-[32px] md:min-h-[44px] flex items-center">
                    {product.name}
                  </h3>
                  <p className="text-[#006D6D] font-semibold text-[11px] md:text-[13px] mb-0.5 md:mb-1">
                    {product.generic}
                  </p>

                  <div className="flex items-center gap-1 mb-0.5 md:mb-1">
                    <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-[#FFD200]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-[10px] md:text-[13px] font-bold text-gray-900">{product.rating}</span>
                    <span className="text-[10px] md:text-[13px] text-gray-400">({product.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="mt-1 flex justify-between items-end">
                <div className="flex flex-col justify-end">
                  {product.originalPrice ? (
                    <span className="text-[10px] md:text-[12px] text-gray-400 line-through font-medium leading-none mb-0.5">
                      ₹{product.originalPrice}
                    </span>
                  ) : (
                    <span className="text-[10px] md:text-[12px] text-transparent leading-none mb-0.5 select-none">₹0</span>
                  )}
                  <span className="text-[16px] md:text-[22px] font-black text-gray-900 leading-none">
                    ₹{product.price}
                  </span>
                </div>

                <button
                  onClick={e => { e.stopPropagation(); addToCart(product) }}
                  className="w-7 h-7 md:w-10 md:h-10 bg-[#FFD200] rounded-full flex items-center justify-center text-white shadow-md active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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
