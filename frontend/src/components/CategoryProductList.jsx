import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthGate } from '../hooks/useAuthGate'
import med1 from '../assets/med1.png'
import med2 from '../assets/med2.png'
import med3 from '../assets/med3.png'
import med4 from '../assets/med4.png'

const productsData = {
  'Insulin & Diabetes Care': [
    { id: 1, name: 'Lantus Solostar', generic: '(Insulin Glargine)', rating: '4.8', reviews: '210', price: '42.00', originalPrice: '62.00', badge: '32% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
    { id: 2, name: 'Humalog KwikPen', generic: '(Insulin Lispro)', rating: '4.7', reviews: '185', price: '45.00', originalPrice: '67.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
    { id: 3, name: 'Novorapid FlexPen', generic: '(Insulin Aspart)', rating: '4.9', reviews: '240', price: '41.00', originalPrice: '60.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
    { id: 4, name: 'Levemir FlexPen', generic: '(Insulin Detemir)', rating: '4.6', reviews: '130', price: '44.00', originalPrice: '65.00', badge: '32% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
  "Men's Health": [
    { id: 1, name: 'Finasteride 1mg', generic: '(Hair Loss)', rating: '4.7', reviews: '320', price: '18.00', originalPrice: '28.00', badge: '36% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
    { id: 2, name: 'Sildenafil 50mg', generic: '(ED Treatment)', rating: '4.8', reviews: '410', price: '22.00', originalPrice: '35.00', badge: 'Top Rated', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
    { id: 3, name: 'Minoxidil 5%', generic: '(Hair Regrowth)', rating: '4.6', reviews: '280', price: '15.00', originalPrice: '22.00', badge: '32% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
    { id: 4, name: 'Testosterone Gel', generic: '(Hormone Therapy)', rating: '4.5', reviews: '160', price: '38.00', originalPrice: '55.00', badge: '31% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
  'Sildenafil': [
    { id: 1, name: 'Viagra 50mg', generic: '(Sildenafil)', rating: '4.9', reviews: '520', price: '28.00', originalPrice: '42.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med1 },
    { id: 2, name: 'Sildenafil 25mg', generic: '(Low Dose ED)', rating: '4.6', reviews: '180', price: '14.00', originalPrice: '21.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
    { id: 3, name: 'Sildenafil 100mg', generic: '(High Dose ED)', rating: '4.8', reviews: '390', price: '32.00', originalPrice: '48.00', badge: 'Popular', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med3 },
    { id: 4, name: 'Kamagra 50mg', generic: '(Sildenafil)', rating: '4.5', reviews: '220', price: '18.00', originalPrice: '27.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
  'Tadalafil': [
    { id: 1, name: 'Cialis 10mg', generic: '(Weekend Pill)', rating: '4.9', reviews: '480', price: '34.00', originalPrice: '50.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med2 },
    { id: 2, name: 'Tadalafil 5mg', generic: '(Daily Use)', rating: '4.7', reviews: '310', price: '22.00', originalPrice: '33.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med3 },
    { id: 3, name: 'Tadalafil 20mg', generic: '(ED Treatment)', rating: '4.8', reviews: '270', price: '38.00', originalPrice: '56.00', badge: 'Top Rated', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med1 },
    { id: 4, name: 'Vidalista 20mg', generic: '(Tadalafil)', rating: '4.6', reviews: '195', price: '19.00', originalPrice: '28.00', badge: '32% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
  'Vardenafil': [
    { id: 1, name: 'Levitra 10mg', generic: '(Vardenafil)', rating: '4.8', reviews: '340', price: '36.00', originalPrice: '54.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
    { id: 2, name: 'Vardenafil 20mg', generic: '(ED Treatment)', rating: '4.6', reviews: '210', price: '26.00', originalPrice: '39.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
    { id: 3, name: 'Zhewitra 10mg', generic: '(Vardenafil)', rating: '4.5', reviews: '150', price: '18.00', originalPrice: '27.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
    { id: 4, name: 'Vardenafil 5mg', generic: '(Low Dose)', rating: '4.7', reviews: '180', price: '16.00', originalPrice: '24.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
  'Eye Care': [
    { id: 1, name: 'Lumigan Eye Drops', generic: '(Bimatoprost)', rating: '4.8', reviews: '190', price: '29.00', originalPrice: '42.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
    { id: 2, name: 'Travatan Z Drops', generic: '(Travoprost)', rating: '4.6', reviews: '140', price: '26.00', originalPrice: '38.00', badge: '32% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
    { id: 3, name: 'Restasis Eye Drops', generic: '(Cyclosporine)', rating: '4.7', reviews: '175', price: '34.00', originalPrice: '50.00', badge: 'Top Rated', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med2 },
    { id: 4, name: 'Systane Ultra', generic: '(Lubricant Drops)', rating: '4.9', reviews: '310', price: '12.00', originalPrice: '18.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
  'Hair Loss': [
    { id: 1, name: 'Finasteride 1mg', generic: '(DHT Blocker)', rating: '4.8', reviews: '380', price: '18.00', originalPrice: '28.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med2 },
    { id: 2, name: 'Minoxidil 5% Foam', generic: '(Hair Regrowth)', rating: '4.7', reviews: '290', price: '14.00', originalPrice: '20.00', badge: '30% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
    { id: 3, name: 'Dutasteride 0.5mg', generic: '(DHT Inhibitor)', rating: '4.6', reviews: '210', price: '24.00', originalPrice: '36.00', badge: 'Popular', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med3 },
    { id: 4, name: 'Biotin 10000mcg', generic: '(Hair Vitamins)', rating: '4.9', reviews: '450', price: '9.00', originalPrice: '14.00', badge: '36% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
  'Diabetes': [
    { id: 1, name: 'Metformin 500mg', generic: '(Type 2 Diabetes)', rating: '4.9', reviews: '520', price: '8.00', originalPrice: '13.00', badge: 'Best Value', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med1 },
    { id: 2, name: 'Glipizide 5mg', generic: '(Blood Sugar)', rating: '4.6', reviews: '230', price: '11.00', originalPrice: '17.00', badge: '35% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
    { id: 3, name: 'Januvia 100mg', generic: '(Sitagliptin)', rating: '4.7', reviews: '310', price: '42.00', originalPrice: '62.00', badge: 'Popular', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med3 },
    { id: 4, name: 'Jardiance 10mg', generic: '(Empagliflozin)', rating: '4.8', reviews: '280', price: '48.00', originalPrice: '70.00', badge: '31% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
  'Weight Loss': [
    { id: 1, name: 'Orlistat 120mg', generic: '(Fat Blocker)', rating: '4.6', reviews: '340', price: '32.00', originalPrice: '48.00', badge: 'Popular', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
    { id: 2, name: 'Phentermine 37.5mg', generic: '(Appetite Suppressant)', rating: '4.5', reviews: '220', price: '27.00', originalPrice: '40.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
    { id: 3, name: 'Semaglutide 0.5mg', generic: '(GLP-1 Agonist)', rating: '4.9', reviews: '480', price: '85.00', originalPrice: '120.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
    { id: 4, name: 'Topiramate 25mg', generic: '(Weight Control)', rating: '4.6', reviews: '190', price: '14.00', originalPrice: '21.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
  "Women's Health": [
    { id: 1, name: 'Estradiol Patch', generic: '(Hormone Therapy)', rating: '4.7', reviews: '260', price: '28.00', originalPrice: '42.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
    { id: 2, name: 'Progesterone 200mg', generic: '(Hormone Support)', rating: '4.8', reviews: '310', price: '22.00', originalPrice: '34.00', badge: 'Top Rated', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
    { id: 3, name: 'Clomiphene 50mg', generic: '(Fertility)', rating: '4.6', reviews: '180', price: '19.00', originalPrice: '29.00', badge: '34% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
    { id: 4, name: 'Levonorgestrel', generic: '(Emergency)', rating: '4.9', reviews: '420', price: '12.00', originalPrice: '18.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med4 },
  ],
  'Anti Cancer': [
    { id: 1, name: 'Imatinib 400mg', generic: '(CML Treatment)', rating: '4.8', reviews: '190', price: '89.00', originalPrice: '130.00', badge: 'Verified', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
    { id: 2, name: 'Tamoxifen 20mg', generic: '(Breast Cancer)', rating: '4.7', reviews: '240', price: '24.00', originalPrice: '36.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
    { id: 3, name: 'Letrozole 2.5mg', generic: '(Aromatase Inhibitor)', rating: '4.6', reviews: '175', price: '32.00', originalPrice: '48.00', badge: 'Popular', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
    { id: 4, name: 'Capecitabine 500mg', generic: '(Chemo Oral)', rating: '4.5', reviews: '130', price: '76.00', originalPrice: '110.00', badge: '31% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med3 },
  ],
  'Heart & Blood Pressure': [
    { id: 1, name: 'Amlodipine 5mg', generic: '(Calcium Blocker)', rating: '4.9', reviews: '480', price: '9.00', originalPrice: '14.00', badge: 'Best Value', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med1 },
    { id: 2, name: 'Lisinopril 10mg', generic: '(ACE Inhibitor)', rating: '4.8', reviews: '390', price: '8.00', originalPrice: '13.00', badge: '38% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
    { id: 3, name: 'Atorvastatin 20mg', generic: '(Cholesterol)', rating: '4.7', reviews: '520', price: '11.00', originalPrice: '17.00', badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
    { id: 4, name: 'Metoprolol 50mg', generic: '(Beta Blocker)', rating: '4.6', reviews: '310', price: '10.00', originalPrice: '15.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
  ],
}

const defaultProducts = [
  { id: 1, name: 'Generic Medicine A', generic: '(General Use)', rating: '4.6', reviews: '120', price: '12.00', originalPrice: '18.00', badge: '33% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med1 },
  { id: 2, name: 'Generic Medicine B', generic: '(General Use)', rating: '4.7', reviews: '95', price: '15.00', originalPrice: '22.00', badge: 'Popular', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med2 },
  { id: 3, name: 'Generic Medicine C', generic: '(General Use)', rating: '4.8', reviews: '200', price: '9.00', originalPrice: '14.00', badge: 'Best Value', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900', image: med3 },
  { id: 4, name: 'Generic Medicine D', generic: '(General Use)', rating: '4.5', reviews: '80', price: '11.00', originalPrice: '17.00', badge: '35% OFF', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white', image: med4 },
]

const CategoryProductList = () => {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const decodedName = decodeURIComponent(categoryName)
  const { guardedAction } = useAuthGate()

  const products = productsData[decodedName] || defaultProducts

  const handleProductClick = (product) => {
    navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product } })
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-50 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[17px] font-bold text-gray-900">{decodedName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="relative">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#006D6D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </div>
        </div>
      </div>

      {/* Product Count */}
      <div className="px-4 py-3">
        <span className="text-[12px] font-bold text-gray-500">{products.length} Products</span>
      </div>

      {/* ── Grid Cards (BestSellers style) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 px-4 pb-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="bg-white rounded-[20px] md:rounded-[24px] border border-gray-100 md:border-gray-200 px-3 py-1.5 md:px-4 md:py-2.5 relative flex flex-col cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow active:scale-[0.98]"
          >
            {/* Badge */}
            <div className={`absolute top-2 right-2 md:top-1 md:right-4 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-sm z-10 ${product.badgeBg} ${product.badgeText}`}>
              {product.badge}
            </div>

            {/* Image + Content */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 mt-1 flex-grow">
              {/* Image */}
              <div className="w-full md:w-[160px] h-[80px] md:h-[130px] shrink-0 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
              </div>
              {/* Content */}
              <div className="flex flex-col w-full text-left md:pt-2">
                <h3 className="text-[13px] md:text-[18px] font-bold text-gray-900 leading-tight mb-0.5 min-h-[32px] md:min-h-[44px] flex items-center">
                  {product.name}
                </h3>
                <p className="text-[#006D6D] font-semibold text-[11px] md:text-[13px] mb-0.5 md:mb-1">
                  {product.generic}
                </p>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-0.5 md:mb-1">
                  <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-[#FFD200]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="text-[10px] md:text-[13px] font-bold text-gray-900">{product.rating}</span>
                  <span className="text-[10px] md:text-[13px] text-gray-400">({product.reviews})</span>
                </div>
              </div>
            </div>

            {/* Price + Button */}
            <div className="mt-1 flex justify-between items-end">
              <div className="flex flex-col justify-end">
                {product.originalPrice ? (
                  <span className="text-[10px] md:text-[12px] text-gray-400 line-through font-medium leading-none mb-0.5">
                    ${product.originalPrice}
                  </span>
                ) : (
                  <span className="text-[10px] md:text-[12px] text-transparent leading-none mb-0.5 select-none">$0.00</span>
                )}
                <span className="text-[16px] md:text-[22px] font-black text-gray-900 leading-none">
                  ${product.price}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); guardedAction(() => alert('Added to cart!'))() }}
                className="w-7 h-7 md:w-10 md:h-10 bg-[#FFD200] rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryProductList
