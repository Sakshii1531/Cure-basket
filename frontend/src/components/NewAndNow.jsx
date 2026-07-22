import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import { useAuthGate } from '../hooks/useAuthGate'
import { isOutOfStock } from '../utils/stockUtils'
import productImg from '../assets/product.png'
import ImageWithFallback from './ImageWithFallback'
import pharm1 from '../assets/pharm-1.png'
import pharm2 from '../assets/pharm-2.png'
import pharm3 from '../assets/pharm-3.png'
import pharm4 from '../assets/pharm-4.png'
import pharm5 from '../assets/pharm-5.png'

import med3 from '../assets/med3.png'
import med4 from '../assets/med4.png'
import weightLossImg from '../assets/med1.png'
import diabetes1 from '../assets/diabetes-1.png'
import diabetes2 from '../assets/diabetes-2.png'
import card3_1 from '../assets/3-card1.png'
import card3_2 from '../assets/3-card2.png'
import hairLossImg from '../assets/med2.png'

const fallbackImages = [pharm1, pharm2, pharm3, pharm4, pharm5]

function discountBadge(price, mrp) {
  if (!mrp || mrp <= price) return null
  const pct = Math.round(((mrp - price) / mrp) * 100)
  return pct > 0 ? `${pct}% OFF` : null
}

function NewAndNow({ title = "New and now", onProductClick }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { guardedAction } = useAuthGate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/medicines?isNewAndBest=true&status=Active&limit=100')
      .then(res => setProducts(res.data.data || []))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const handleClick = (product) => {
    if (onProductClick) {
      onProductClick(product)
    } else {
      navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product } })
    }
  }

  return (
    <div className="bg-white pt-2 pb-1 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-2 mx-auto px-2">
          <h2 className="text-[22px] md:text-[34px] font-semibold text-gray-900 tracking-tight">
            {title === "New and best" || title === "NOW AVAILABLE" || title === " NOW AVAILABLE" || title === "Now Available" || title === "NowAvailable" ? (
              <>
                <span className="text-[#006D6D]">Now</span> <span className="text-[#f39c12]">Available</span>
              </>
            ) : title}
          </h2>
        </div>

        {/* Cards Scroll Container */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-2 scroll-smooth">
          {products.length > 0 ? (
            (() => {
              const groupedCategories = [];
              const categoryMap = {};

              products.forEach((product) => {
                const catName = product.category?.name || "Uncategorized";
                if (!categoryMap[catName]) {
                  categoryMap[catName] = {
                    categoryName: catName,
                    products: []
                  };
                  groupedCategories.push(categoryMap[catName]);
                }
                categoryMap[catName].products.push(product);
              });

              return groupedCategories.map((group, groupIdx) => {
                if (group.products.length === 1) {
                  const product = group.products[0];
                  const imgSrc = product.image && product.image !== 'no-photo.jpg'
                    ? product.image
                    : fallbackImages[groupIdx % fallbackImages.length];

                  // Alternate banner gradients
                  const gradientClass = groupIdx % 2 === 0
                    ? "bg-gradient-to-tr from-[#d1e9f5] to-[#f4cfdf]"
                    : "bg-gradient-to-tr from-[#fff2cc] via-[#f2fcfc] to-[#f9e5ef]";

                  return (
                    <div
                      key={product._id}
                      onClick={() => handleClick(product)}
                      className="w-[350px] md:w-[410px] min-w-[350px] md:min-w-[410px] max-w-[350px] md:max-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col transition-shadow cursor-pointer hover:shadow-lg shrink-0"
                    >
                      <div className="bg-[#006D6D] text-white py-2.5 md:py-4 px-4 text-center font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase">
                        {group.categoryName}
                      </div>
                      <div className={`flex-grow p-3 md:p-5 ${gradientClass} flex flex-row items-center gap-2 md:gap-4 min-h-[120px] md:min-h-[180px]`}>
                        <div className="flex-grow flex flex-col justify-center text-left w-[55%]">
                          <h3 className="text-[16px] md:text-[18px] font-bold leading-tight mb-1 text-gray-900">
                            Need a <span className="text-[#006D6D]">{group.categoryName.toLowerCase()}</span> plan?
                          </h3>
                          <p className="text-black/80 text-[11px] md:text-[12px] leading-relaxed line-clamp-4">
                            {product.description || `Get expert guidance and personalized care to help you achieve your ${group.categoryName.toLowerCase()} goals safely and effectively.`}
                          </p>
                        </div>
                        <div className="w-[40%] h-24 md:h-32 flex items-center justify-center shrink-0 bg-white/20 backdrop-blur-xs rounded-xl overflow-hidden p-1.5 border border-white/30">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            fallbackSrc={fallbackImages[groupIdx % fallbackImages.length]}
                            className="w-full h-full bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const displayedProducts = group.products.slice(0, 2);
                  const hasMore = group.products.length > 2;
                  return (
                    <div key={group.categoryName} className="w-[350px] md:w-[410px] min-w-[350px] md:min-w-[410px] max-w-[350px] md:max-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col transition-shadow shrink-0">
                      <div className="bg-[#006D6D] text-white py-2.5 md:py-4 px-4 text-center font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase">
                        {group.categoryName}
                      </div>
                      <div className="p-2 md:p-4 flex flex-col gap-1.5 md:gap-2 h-full justify-start min-h-[120px] md:min-h-[180px]">
                        {displayedProducts.map((product, idx) => {
                          const imgSrc = product.image && product.image !== 'no-photo.jpg'
                            ? product.image
                            : fallbackImages[(groupIdx + idx) % fallbackImages.length];
                          const isLast = idx === displayedProducts.length - 1;
                          const genericSub = product.genericName
                            ? (product.genericName.toLowerCase().startsWith('generic') ? product.genericName : `Generic ${product.genericName}`)
                            : '';
                          const outOfStock = isOutOfStock(product)
                          return (
                            <div
                              key={product._id}
                              onClick={() => handleClick(product)}
                              className={`flex items-center gap-4 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-dotted border-gray-300' : ''} ${outOfStock ? 'opacity-60 bg-gray-50/50 cursor-not-allowed' : ''}`}
                            >
                              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                                <ImageWithFallback
                                  src={product.image}
                                  alt={product.name}
                                  fallbackSrc={fallbackImages[(groupIdx + idx) % fallbackImages.length]}
                                  className="w-full h-full bg-transparent"
                                />
                              </div>
                              <div className="flex-grow text-left">
                                <h4 className="font-black text-[18px] text-gray-900 tracking-tight leading-tight flex items-center gap-2">
                                  {product.name}
                                  {outOfStock && <span className="bg-red-50 text-red-600 border border-red-200 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase shrink-0">OOS</span>}
                                </h4>
                                {genericSub && (
                                  <p className="text-[12px] text-gray-500 font-bold leading-normal">
                                    {genericSub}
                                  </p>
                                )}
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <div className="font-black text-[22px] text-gray-900 flex items-baseline gap-1 leading-none">
                                  ${product.price}
                                  <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                                  <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {hasMore && (
                          <div className="pt-2 border-t border-gray-100 mt-2">
                            <button
                              onClick={() => navigate(`/category/${encodeURIComponent(group.categoryName)}`)}
                              className="w-full py-2 bg-gray-50 hover:bg-[#006D6D]/5 text-[#006D6D] rounded-xl font-bold text-[13px] md:text-[14px] transition-all flex items-center justify-center gap-1 border border-gray-100 hover:border-[#006D6D]/20 active:scale-98"
                            >
                              <span>Show All Medicines ({group.products.length})</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              });
            })()
          ) : (
            <>
              {/* Card 1: Weight Loss Treatment Banner */}
              <div
                onClick={() => onProductClick?.({ name: "Weight Loss Treatment", category: "Weight Loss", image: weightLossImg })}
                className="w-[350px] md:w-[410px] min-w-[350px] md:min-w-[410px] max-w-[350px] md:max-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col transition-shadow cursor-pointer hover:shadow-lg"
              >
                <div className="bg-[#006D6D] text-white py-2.5 md:py-4 px-4 text-center font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase">
                  Weight Loss Treatment
                </div>
                <div className="flex-grow p-3 md:p-5 bg-gradient-to-tr from-[#d1e9f5] to-[#f4cfdf] flex flex-row items-center gap-2 md:gap-4 min-h-[120px] md:min-h-[180px]">
                  <div className="flex-grow flex flex-col justify-center text-left w-[55%]">
                    <h3 className="text-[16px] md:text-[18px] font-bold leading-tight mb-1 text-gray-900">
                      Need a <span className="text-[#006D6D]">weight loss</span> plan?
                    </h3>
                    <p className="text-black/80 text-[11px] md:text-[12px] leading-relaxed line-clamp-4">
                      Get expert guidance and personalized care to help you achieve your weight goals safely and effectively.
                    </p>
                  </div>
                  <div className="w-[40%] h-24 md:h-32 flex items-center justify-center shrink-0 bg-white/20 backdrop-blur-xs rounded-xl overflow-hidden p-1.5 border border-white/30">
                    <img
                      src={weightLossImg}
                      className="w-full h-full object-contain"
                      alt="Medication"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Diabetes Management */}
              <div className="w-[350px] md:w-[410px] min-w-[350px] md:min-w-[410px] max-w-[350px] md:max-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col transition-shadow">
                <div className="bg-[#121212] text-white py-2.5 md:py-4 px-4 text-center font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase">
                  Diabetes Management
                </div>
                <div className="p-2 md:p-4 flex flex-col gap-1.5 md:gap-2 h-full justify-start min-h-[120px] md:min-h-[180px]">
                  <div
                    onClick={() => onProductClick?.({ name: "Generic Glucophage", category: "Diabetes", image: diabetes1 })}
                    className="flex items-center gap-4 py-0 border-b-[3px] border-dotted border-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <img src={diabetes1} className="w-full h-full object-contain" alt="Metformin" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Insulin-Sensitizing</h4>
                      <p className="text-[12px] text-gray-500 font-bold">Generic Glucophage</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="font-black text-[22px] text-gray-900 flex items-baseline gap-1 leading-none">
                        $12 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                        <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => onProductClick?.({ name: "Brand Medication (Diabetes)", category: "Diabetes", image: diabetes2 })}
                    className="flex items-center gap-4 py-0 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <img src={diabetes2} className="w-full h-full object-contain" alt="Januvia" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-[18px] text-gray-900 tracking-tight">SGLT2 Inhibitor</h4>
                      <p className="text-[12px] text-gray-500 font-bold">Brand Medication</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="font-black text-[22px] text-gray-900 flex items-baseline gap-1 leading-none">
                        $89 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                        <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: ED Treatment */}
              <div className="w-[350px] md:w-[410px] min-w-[350px] md:min-w-[410px] max-w-[350px] md:max-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col transition-shadow">
                <div className="bg-[#006D6D] text-white py-2.5 md:py-4 px-4 text-center font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase">
                  Erectile Dysfunction Treatment
                </div>
                <div className="p-2 md:p-4 flex flex-col gap-1.5 md:gap-2 h-full justify-start min-h-[120px] md:min-h-[180px]">
                  {/* Product 1 */}
                  <div
                    onClick={() => onProductClick?.({ name: "Sildenafil (Generic Viagra)", category: "ED Treatment", image: card3_1 })}
                    className="flex items-center gap-4 py-0 border-b-[3px] border-dotted border-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <img src={card3_1} className="w-full h-full object-contain" alt="Sildenafil" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Sildenafil</h4>
                      <p className="text-[12px] text-gray-500 font-bold">Generic Viagra</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="font-black text-[22px] text-gray-900 flex items-baseline gap-1 leading-none">
                        $18 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                        <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                      </div>
                    </div>
                  </div>
                  {/* Product 2 */}
                  <div
                    onClick={() => onProductClick?.({ name: "Tadalafil (Generic Cialis)", category: "ED Treatment", image: card3_2 })}
                    className="flex items-center gap-4 py-0 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <img src={card3_2} className="w-full h-full object-contain" alt="Tadalafil" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Tadalafil</h4>
                      <p className="text-[12px] text-gray-500 font-bold">Generic Cialis</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="font-black text-[22px] text-gray-900 flex items-baseline gap-1 leading-none">
                        $21 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                        <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Hair Loss Treatment Banner */}
              <div
                onClick={() => onProductClick?.({ name: "Hair Loss Treatment", category: "Hair Loss", image: hairLossImg })}
                className="w-[350px] md:w-[410px] min-w-[350px] md:min-w-[410px] max-w-[350px] md:max-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col transition-shadow cursor-pointer hover:shadow-lg"
              >
                <div className="bg-[#006D6D] text-white py-2.5 md:py-4 px-4 text-center font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase">
                  Hair Loss Treatment
                </div>
                <div className="flex-grow p-3 md:p-5 bg-gradient-to-tr from-[#fff2cc] via-[#f2fcfc] to-[#f9e5ef] flex flex-row items-center gap-2 md:gap-4 min-h-[120px] md:min-h-[180px]">
                  <div className="flex-grow flex flex-col justify-center text-left w-[55%]">
                    <h3 className="text-[16px] md:text-[18px] font-bold leading-tight mb-1 text-gray-900">
                      Struggling with <span className="text-[#006D6D]">hair loss?</span>
                    </h3>
                    <p className="text-black/80 text-[11px] md:text-[12px] leading-relaxed line-clamp-4">
                      Regain your confidence with treatments designed to strengthen, restore, and protect your hair.
                    </p>
                  </div>
                  <div className="w-[40%] h-24 md:h-32 flex items-center justify-center shrink-0 bg-white/20 backdrop-blur-xs rounded-xl overflow-hidden p-1.5 border border-white/30">
                    <img
                      src={hairLossImg}
                      className="w-full h-full object-contain"
                      alt="Hair Loss Medication"
                    />
                  </div>
                </div>
              </div>

              {/* Card 5: Anxiety & Depression */}
              <div className="w-[350px] md:w-[410px] min-w-[350px] md:min-w-[410px] max-w-[350px] md:max-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col transition-shadow">
                <div className="bg-[#006D6D] text-white py-2.5 md:py-4 px-4 text-center font-bold text-[13px] md:text-[14px] tracking-[0.15em] uppercase">
                  Anxiety & Depression
                </div>
                <div className="p-2 md:p-4 flex flex-col gap-1.5 md:gap-2 h-full justify-start min-h-[120px] md:min-h-[180px]">
                  <div
                    onClick={() => onProductClick?.({ name: "Sertraline (Generic Zoloft)", category: "Mental Health", image: med3 })}
                    className="flex items-center gap-4 py-0 border-b border-dotted border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <img src={med3} className="w-full h-full object-contain brightness-110" alt="Sertraline" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Sertraline</h4>
                      <p className="text-[12px] text-gray-500 font-bold">Generic Zoloft</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="font-black text-[22px] text-gray-900 flex items-baseline gap-1 leading-none">
                        $15 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                        <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => onProductClick?.({ name: "Fluoxetine (Generic Prozac)", category: "Mental Health", image: med4 })}
                    className="flex items-center gap-4 py-0 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <img src={med4} className="w-full h-full object-contain hue-rotate-90" alt="Fluoxetine" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Fluoxetine</h4>
                      <p className="text-[12px] text-gray-500 font-bold">Generic Prozac</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="font-black text-[22px] text-gray-900 flex items-baseline gap-1 leading-none">
                        $15 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                        <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewAndNow
