import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import med1 from '../assets/med1.png'
import med2 from '../assets/med2.png'
import med3 from '../assets/med3.png'
import med4 from '../assets/med4.png'
import med5 from '../assets/med5.png'

// Category Banners (AI Generated)
import allergyBanner from '../assets/allergy_banner_1777890268903.png'
import diabetesBanner from '../assets/diabetes_banner_1777890391063.png'
import skinCareBanner from '../assets/skin_care_banner_1777890407540.png'
import antibioticsBanner from '../assets/antibiotics_banner_1777890422969.png'
import painBanner from '../assets/pain_relief_banner_1777890437621.png'
import hairLossBanner from '../assets/hair_loss_banner_1777890597175.png'

const frequentlyBought = [
  { id: 1, name: 'Doxycycline 100 mg Tablet', qty: '10 Tablets', price: '8.50', image: med1, category: 'allergy' },
  { id: 2, name: 'Albendazole 400 mg Tablet', qty: '1 Tablet', price: '2.20', image: med1, category: 'allergy' },
  { id: 3, name: 'Vitamin C 500 mg Tablet', qty: '10 Tablets', price: '4.10', image: med1, category: 'allergy' },
  { id: 4, name: 'Zincovit Tablet', qty: '15 Tablets', price: '3.30', image: med1, category: 'allergy' },
  { id: 5, name: 'Azithromycin 500 mg', qty: '3 Tablets', price: '12.00', image: med2, category: 'antibiotics' },
  { id: 6, name: 'Paracetamol 650 mg', qty: '15 Tablets', price: '5.50', image: med3, category: 'pain' },
  { id: 7, name: 'Pantoprazole 40 mg', qty: '10 Tablets', price: '9.30', image: med4, category: 'diabetes' },
  { id: 8, name: 'Montelukast 10 mg', qty: '10 Tablets', price: '11.20', image: med5, category: 'allergy' },
  { id: 9, name: 'Metformin 500 mg', qty: '30 Tablets', price: '15.00', image: med2, category: 'diabetes' },
  { id: 10, name: 'Glimepiride 2 mg', qty: '15 Tablets', price: '8.00', image: med3, category: 'diabetes' },
  { id: 11, name: 'Face Wash Premium', qty: '100 ml', price: '12.50', image: med5, category: 'skin-care' },
  { id: 12, name: 'Moisturizer Gel', qty: '50g', price: '9.90', image: med1, category: 'skin-care' },
  { id: 13, name: 'Sunscreen SPF 50', qty: '60 ml', price: '18.00', image: med4, category: 'skin-care' },
]

function FrequentlyBoughtPage({ onBack, onProductClick }) {
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getCategoryDetails = (category) => {
    if (!category) return null;
    const details = {
      allergy: { color: 'bg-[#E6F7F7]', textColor: 'text-[#006D6D]', image: allergyBanner },
      diabetes: { color: 'bg-[#FFF8E7]', textColor: 'text-[#FBB03B]', image: diabetesBanner },
      pain: { color: 'bg-[#f0f9ff]', textColor: 'text-[#3B82F6]', image: painBanner },
      'skin-care': { color: 'bg-pink-50', textColor: 'text-pink-600', image: skinCareBanner },
      antibiotics: { color: 'bg-purple-50', textColor: 'text-purple-600', image: antibioticsBanner },
      'hair-loss': { color: 'bg-indigo-50', textColor: 'text-indigo-600', image: hairLossBanner },
      acne: { color: 'bg-teal-50', textColor: 'text-teal-600', image: allergyBanner },
      'anti-cancer': { color: 'bg-red-50', textColor: 'text-red-600', image: painBanner },
      'eye-care': { color: 'bg-sky-50', textColor: 'text-sky-600', image: allergyBanner },
      'sexual-wellness': { color: 'bg-rose-50', textColor: 'text-rose-600', image: skinCareBanner },
      default: { color: 'bg-gray-50', textColor: 'text-gray-900', image: allergyBanner }
    }
    return details[category.toLowerCase()] || details.default
  }

  const filteredProducts = categoryFilter 
    ? frequentlyBought.filter(p => p.category === categoryFilter.toLowerCase())
    : frequentlyBought

  const catDetails = getCategoryDetails(categoryFilter)

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 py-8 md:py-12">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#006D6D] transition-colors mb-8 font-bold text-[14px] group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        {/* Category Banner */}
        {categoryFilter && catDetails && (
          <div className={`mb-8 md:mb-12 rounded-[24px] md:rounded-[32px] p-6 md:p-12 relative overflow-hidden flex items-center border border-gray-100 shadow-sm min-h-[200px] md:min-h-[300px]`}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
               <img src={catDetails.image} alt="banner" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
            </div>
            
            <div className="z-10 relative">
               <span className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-widest mb-4 md:mb-6 inline-block text-gray-800 shadow-sm">Category Spotlight</span>
               <h1 className="text-[28px] md:text-[60px] font-black leading-[1.1] capitalize text-gray-900 drop-shadow-sm">
                 {categoryFilter.replace('-', ' ')} <br/>
                 <span className={catDetails.textColor}>Solutions</span>
               </h1>
               <p className="text-gray-700 text-[13px] md:text-[18px] mt-4 md:mt-6 max-w-lg font-bold leading-relaxed hidden sm:block">
                 Genuine medicines and premium healthcare products for your {categoryFilter.replace('-', ' ')} needs, delivered fast to your doorstep.
               </p>
               <div className="mt-6 md:mt-8 flex gap-3 md:gap-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-2 shadow-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    <span className="text-[10px] md:text-[12px] font-bold text-gray-800">100% Genuine</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-2 shadow-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z"/></svg>
                    <span className="text-[10px] md:text-[12px] font-bold text-gray-800">Fast Delivery</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Header (Simplified if banner exists) */}
        {!categoryFilter && (
          <div className="mb-8 md:mb-12">
            <h1 className="text-[28px] md:text-[42px] font-bold text-gray-900 tracking-tight mb-3 md:mb-4 capitalize">
              Frequently Bought Together
            </h1>
            <p className="text-gray-500 text-[14px] md:text-[16px] max-w-2xl leading-relaxed font-medium">
              Explore products that our customers frequently purchase together for comprehensive health management.
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => onProductClick?.(product)}
                className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-full h-40 flex items-center justify-center mb-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex-grow flex flex-col">
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1 leading-tight group-hover:text-[#006D6D] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[13px] font-bold text-gray-400 mb-4">{product.qty}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[20px] font-black text-gray-900">${product.price}</span>
                    <button className="flex items-center gap-2 bg-[#E6F7F7] text-[#006D6D] px-4 py-2 rounded-xl text-[13px] font-black hover:bg-[#006D6D] hover:text-white transition-all active:scale-95">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              <h3 className="text-[18px] font-bold text-gray-900">No products found</h3>
              <p className="text-gray-500 text-[14px] mt-1">We are adding more products to this category soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FrequentlyBoughtPage
