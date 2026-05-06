import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthGate } from '../hooks/useAuthGate'
import med1 from '../assets/med1.png'
import med2 from '../assets/med2.png'
import med3 from '../assets/med3.png'
import med4 from '../assets/med4.png'

const productsData = {
  'Insulin & Diabetes Care': [
    { id: 1, name: 'Lantus Solostar', strength: '100 IU/ml', manufacturer: 'Sanofi Aventis', packaging: '5 Pen (3ml)', price: 42.00, originalPrice: 62.00, discount: '32% OFF', image: med1 },
    { id: 2, name: 'Humalog KwikPen', strength: '100 IU/ml', manufacturer: 'Eli Lilly', packaging: '5 Pen (3ml)', price: 45.00, originalPrice: 67.00, discount: '33% OFF', image: med2 },
    { id: 3, name: 'Novorapid FlexPen', strength: '100 IU/ml', manufacturer: 'Novo Nordisk', packaging: '5 Pen (3ml)', price: 41.00, originalPrice: 60.00, discount: '32% OFF', image: med3 },
    { id: 4, name: 'Levemir FlexPen', strength: '100 IU/ml', manufacturer: 'Novo Nordisk', packaging: '5 Pen (3ml)', price: 44.00, originalPrice: 65.00, discount: '32% OFF', image: med4 },
  ],
  "Men's Health": [
    { id: 1, name: 'Finasteride 1mg', strength: '1mg', manufacturer: 'Cipla', packaging: '30 Tablets', price: 18.00, originalPrice: 28.00, discount: '36% OFF', image: med2 },
    { id: 2, name: 'Sildenafil 50mg', strength: '50mg', manufacturer: 'Sun Pharma', packaging: '4 Tablets', price: 22.00, originalPrice: 35.00, discount: '37% OFF', image: med3 },
    { id: 3, name: 'Minoxidil 5%', strength: '5%', manufacturer: 'Dr. Reddy\'s', packaging: '60ml Solution', price: 15.00, originalPrice: 22.00, discount: '32% OFF', image: med1 },
    { id: 4, name: 'Testosterone Gel', strength: '1%', manufacturer: 'Abbott', packaging: '30g Tube', price: 38.00, originalPrice: 55.00, discount: '31% OFF', image: med4 },
  ],
  'Sildenafil': [
    { id: 1, name: 'Viagra 50mg', strength: '50mg', manufacturer: 'Pfizer', packaging: '4 Tablets', price: 28.00, originalPrice: 42.00, discount: '33% OFF', image: med1 },
    { id: 2, name: 'Sildenafil 25mg', strength: '25mg', manufacturer: 'Sun Pharma', packaging: '4 Tablets', price: 14.00, originalPrice: 21.00, discount: '33% OFF', image: med2 },
    { id: 3, name: 'Sildenafil 100mg', strength: '100mg', manufacturer: 'Cipla', packaging: '4 Tablets', price: 32.00, originalPrice: 48.00, discount: '33% OFF', image: med3 },
    { id: 4, name: 'Kamagra 50mg', strength: '50mg', manufacturer: 'Ajanta Pharma', packaging: '4 Tablets', price: 18.00, originalPrice: 27.00, discount: '33% OFF', image: med4 },
  ],
  'Tadalafil': [
    { id: 1, name: 'Cialis 10mg', strength: '10mg', manufacturer: 'Eli Lilly', packaging: '4 Tablets', price: 34.00, originalPrice: 50.00, discount: '32% OFF', image: med2 },
    { id: 2, name: 'Tadalafil 5mg', strength: '5mg', manufacturer: 'Sun Pharma', packaging: '14 Tablets', price: 22.00, originalPrice: 33.00, discount: '33% OFF', image: med3 },
    { id: 3, name: 'Tadalafil 20mg', strength: '20mg', manufacturer: 'Cipla', packaging: '4 Tablets', price: 38.00, originalPrice: 56.00, discount: '32% OFF', image: med1 },
    { id: 4, name: 'Vidalista 20mg', strength: '20mg', manufacturer: 'Centurion', packaging: '10 Tablets', price: 19.00, originalPrice: 28.00, discount: '32% OFF', image: med4 },
  ],
  'Vardenafil': [
    { id: 1, name: 'Levitra 10mg', strength: '10mg', manufacturer: 'Bayer', packaging: '4 Tablets', price: 36.00, originalPrice: 54.00, discount: '33% OFF', image: med3 },
    { id: 2, name: 'Vardenafil 20mg', strength: '20mg', manufacturer: 'Sun Pharma', packaging: '4 Tablets', price: 26.00, originalPrice: 39.00, discount: '33% OFF', image: med1 },
    { id: 3, name: 'Zhewitra 10mg', strength: '10mg', manufacturer: 'Sunrise Remedies', packaging: '10 Tablets', price: 18.00, originalPrice: 27.00, discount: '33% OFF', image: med2 },
    { id: 4, name: 'Vardenafil 5mg', strength: '5mg', manufacturer: 'Cipla', packaging: '10 Tablets', price: 16.00, originalPrice: 24.00, discount: '33% OFF', image: med4 },
  ],
  'Eye Care': [
    { id: 1, name: 'Lumigan Eye Drops', strength: '0.01%', manufacturer: 'Allergan', packaging: '3ml Bottle', price: 29.00, originalPrice: 42.00, discount: '31% OFF', image: med3 },
    { id: 2, name: 'Travatan Z Drops', strength: '0.004%', manufacturer: 'Alcon', packaging: '2.5ml', price: 26.00, originalPrice: 38.00, discount: '32% OFF', image: med1 },
    { id: 3, name: 'Restasis Eye Drops', strength: '0.05%', manufacturer: 'Allergan', packaging: '30 Vials', price: 34.00, originalPrice: 50.00, discount: '32% OFF', image: med2 },
    { id: 4, name: 'Systane Ultra', strength: '0.4%', manufacturer: 'Alcon', packaging: '10ml', price: 12.00, originalPrice: 18.00, discount: '33% OFF', image: med4 },
  ],
  'Hair Loss': [
    { id: 1, name: 'Finasteride 1mg', strength: '1mg', manufacturer: 'Cipla', packaging: '30 Tablets', price: 18.00, originalPrice: 28.00, discount: '36% OFF', image: med2 },
    { id: 2, name: 'Minoxidil 5% Foam', strength: '5%', manufacturer: 'Kirkland', packaging: '60g', price: 14.00, originalPrice: 20.00, discount: '30% OFF', image: med1 },
    { id: 3, name: 'Dutasteride 0.5mg', strength: '0.5mg', manufacturer: 'GSK', packaging: '30 Capsules', price: 24.00, originalPrice: 36.00, discount: '33% OFF', image: med3 },
    { id: 4, name: 'Biotin 10000mcg', strength: '10000mcg', manufacturer: 'Nature\'s Bounty', packaging: '120 Softgels', price: 9.00, originalPrice: 14.00, discount: '36% OFF', image: med4 },
  ],
  'Acne': [
    { id: 1, name: 'Tretinoin 0.025%', strength: '0.025%', manufacturer: 'Janssen', packaging: '20g Cream', price: 16.00, originalPrice: 24.00, discount: '33% OFF', image: med1 },
    { id: 2, name: 'Clindamycin Gel', strength: '1%', manufacturer: 'Galderma', packaging: '30g', price: 12.00, originalPrice: 18.00, discount: '33% OFF', image: med2 },
    { id: 3, name: 'Benzoyl Peroxide', strength: '5%', manufacturer: 'Stiefel', packaging: '60g Wash', price: 8.00, originalPrice: 12.00, discount: '33% OFF', image: med3 },
    { id: 4, name: 'Adapalene 0.1%', strength: '0.1%', manufacturer: 'Galderma', packaging: '45g Gel', price: 19.00, originalPrice: 28.00, discount: '32% OFF', image: med4 },
  ],
  'Allergy': [
    { id: 1, name: 'Cetirizine 10mg', strength: '10mg', manufacturer: 'UCB Pharma', packaging: '30 Tablets', price: 7.00, originalPrice: 11.00, discount: '36% OFF', image: med3 },
    { id: 2, name: 'Loratadine 10mg', strength: '10mg', manufacturer: 'Schering', packaging: '30 Tablets', price: 6.00, originalPrice: 10.00, discount: '40% OFF', image: med1 },
    { id: 3, name: 'Fexofenadine 180mg', strength: '180mg', manufacturer: 'Sanofi', packaging: '30 Tablets', price: 14.00, originalPrice: 21.00, discount: '33% OFF', image: med2 },
    { id: 4, name: 'Fluticasone Spray', strength: '50mcg', manufacturer: 'GSK', packaging: '150 Doses', price: 18.00, originalPrice: 26.00, discount: '31% OFF', image: med4 },
  ],
  'Diabetes': [
    { id: 1, name: 'Metformin 500mg', strength: '500mg', manufacturer: 'Merck', packaging: '60 Tablets', price: 8.00, originalPrice: 13.00, discount: '38% OFF', image: med1 },
    { id: 2, name: 'Glipizide 5mg', strength: '5mg', manufacturer: 'Pfizer', packaging: '30 Tablets', price: 11.00, originalPrice: 17.00, discount: '35% OFF', image: med2 },
    { id: 3, name: 'Januvia 100mg', strength: '100mg', manufacturer: 'MSD', packaging: '28 Tablets', price: 42.00, originalPrice: 62.00, discount: '32% OFF', image: med3 },
    { id: 4, name: 'Jardiance 10mg', strength: '10mg', manufacturer: 'Boehringer', packaging: '30 Tablets', price: 48.00, originalPrice: 70.00, discount: '31% OFF', image: med4 },
  ],
  'Weight Loss': [
    { id: 1, name: 'Orlistat 120mg', strength: '120mg', manufacturer: 'Roche', packaging: '42 Capsules', price: 32.00, originalPrice: 48.00, discount: '33% OFF', image: med2 },
    { id: 2, name: 'Phentermine 37.5mg', strength: '37.5mg', manufacturer: 'Gate Pharma', packaging: '30 Tablets', price: 27.00, originalPrice: 40.00, discount: '33% OFF', image: med1 },
    { id: 3, name: 'Semaglutide 0.5mg', strength: '0.5mg', manufacturer: 'Novo Nordisk', packaging: '4 Pens', price: 85.00, originalPrice: 120.00, discount: '29% OFF', image: med3 },
    { id: 4, name: 'Topiramate 25mg', strength: '25mg', manufacturer: 'Janssen', packaging: '60 Tablets', price: 14.00, originalPrice: 21.00, discount: '33% OFF', image: med4 },
  ],
  "Women's Health": [
    { id: 1, name: 'Estradiol Patch', strength: '0.05mg', manufacturer: 'Mylan', packaging: '8 Patches', price: 28.00, originalPrice: 42.00, discount: '33% OFF', image: med1 },
    { id: 2, name: 'Progesterone 200mg', strength: '200mg', manufacturer: 'Besins', packaging: '30 Capsules', price: 22.00, originalPrice: 34.00, discount: '35% OFF', image: med3 },
    { id: 3, name: 'Clomiphene 50mg', strength: '50mg', manufacturer: 'Sanofi', packaging: '10 Tablets', price: 19.00, originalPrice: 29.00, discount: '34% OFF', image: med2 },
    { id: 4, name: 'Levonorgestrel', strength: '1.5mg', manufacturer: 'Bayer', packaging: '1 Tablet', price: 12.00, originalPrice: 18.00, discount: '33% OFF', image: med4 },
  ],
  'Anti Cancer': [
    { id: 1, name: 'Imatinib 400mg', strength: '400mg', manufacturer: 'Novartis', packaging: '30 Tablets', price: 89.00, originalPrice: 130.00, discount: '32% OFF', image: med4 },
    { id: 2, name: 'Tamoxifen 20mg', strength: '20mg', manufacturer: 'AstraZeneca', packaging: '30 Tablets', price: 24.00, originalPrice: 36.00, discount: '33% OFF', image: med1 },
    { id: 3, name: 'Letrozole 2.5mg', strength: '2.5mg', manufacturer: 'Novartis', packaging: '30 Tablets', price: 32.00, originalPrice: 48.00, discount: '33% OFF', image: med2 },
    { id: 4, name: 'Capecitabine 500mg', strength: '500mg', manufacturer: 'Roche', packaging: '120 Tablets', price: 76.00, originalPrice: 110.00, discount: '31% OFF', image: med3 },
  ],
  'Asthma': [
    { id: 1, name: 'Ventolin Inhaler', strength: '100mcg', manufacturer: 'GSK', packaging: '200 Doses', price: 14.00, originalPrice: 21.00, discount: '33% OFF', image: med1 },
    { id: 2, name: 'Seretide 250', strength: '250/25mcg', manufacturer: 'GSK', packaging: '120 Doses', price: 38.00, originalPrice: 56.00, discount: '32% OFF', image: med2 },
    { id: 3, name: 'Montelukast 10mg', strength: '10mg', manufacturer: 'MSD', packaging: '30 Tablets', price: 12.00, originalPrice: 18.00, discount: '33% OFF', image: med3 },
    { id: 4, name: 'Budesonide Inhaler', strength: '200mcg', manufacturer: 'AstraZeneca', packaging: '200 Doses', price: 22.00, originalPrice: 33.00, discount: '33% OFF', image: med4 },
  ],
  'Heart & Blood Pressure': [
    { id: 1, name: 'Amlodipine 5mg', strength: '5mg', manufacturer: 'Pfizer', packaging: '30 Tablets', price: 9.00, originalPrice: 14.00, discount: '36% OFF', image: med1 },
    { id: 2, name: 'Lisinopril 10mg', strength: '10mg', manufacturer: 'AstraZeneca', packaging: '30 Tablets', price: 8.00, originalPrice: 13.00, discount: '38% OFF', image: med2 },
    { id: 3, name: 'Atorvastatin 20mg', strength: '20mg', manufacturer: 'Pfizer', packaging: '30 Tablets', price: 11.00, originalPrice: 17.00, discount: '35% OFF', image: med3 },
    { id: 4, name: 'Metoprolol 50mg', strength: '50mg', manufacturer: 'AstraZeneca', packaging: '30 Tablets', price: 10.00, originalPrice: 15.00, discount: '33% OFF', image: med4 },
  ],
}

// Default fallback for categories without specific data
const defaultProducts = [
  { id: 1, name: 'Generic Medicine A', strength: '10mg', manufacturer: 'Sun Pharma', packaging: '30 Tablets', price: 12.00, originalPrice: 18.00, discount: '33% OFF', image: med1 },
  { id: 2, name: 'Generic Medicine B', strength: '20mg', manufacturer: 'Cipla', packaging: '30 Tablets', price: 15.00, originalPrice: 22.00, discount: '32% OFF', image: med2 },
  { id: 3, name: 'Generic Medicine C', strength: '5mg', manufacturer: 'Dr. Reddy\'s', packaging: '30 Capsules', price: 9.00, originalPrice: 14.00, discount: '36% OFF', image: med3 },
  { id: 4, name: 'Generic Medicine D', strength: '50mg', manufacturer: 'Lupin', packaging: '30 Tablets', price: 11.00, originalPrice: 17.00, discount: '35% OFF', image: med4 },
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

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between shadow-sm">
        <button className="flex items-center gap-2 text-[13px] font-bold text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Filter
        </button>
        <div className="w-px h-4 bg-gray-200"></div>
        <button className="flex items-center gap-2 text-[13px] font-bold text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sort
        </button>
        <div className="w-px h-4 bg-gray-200"></div>
        <button className="p-1 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Product Count */}
      <div className="px-4 py-3">
        <span className="text-[12px] font-bold text-gray-500">{products.length} Products</span>
      </div>

      {/* ══════════════ MOBILE: 2-Column Grid ══════════════ */}
      <div className="md:hidden px-3">
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer active:scale-[0.97] transition-all flex flex-col"
            >
              {/* Image */}
              <div className="bg-gray-50 flex items-center justify-center p-3 h-[130px]">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
              </div>

              {/* Details */}
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-2">{product.name}</h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{product.strength}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{product.manufacturer}</p>

                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[14px] font-black text-gray-900">${product.price.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                </div>
                <span className="text-[9px] font-black text-green-600 mt-0.5">{product.discount}</span>

                <button
                  onClick={(e) => { e.stopPropagation(); guardedAction(() => alert('Added to cart!'))() }}
                  className="mt-2 w-full bg-[#006D6D] text-white py-1.5 rounded-lg text-[11px] font-bold active:scale-95 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ DESKTOP: Original List Layout (unchanged) ══════════════ */}
      <div className="hidden md:block px-3 space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex gap-4 cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-50">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-gray-900 leading-tight">{product.name}</h3>
                  <p className="text-[12px] font-bold text-gray-900 mt-0.5">{product.strength}</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-1">{product.manufacturer}</p>
              <p className="text-[11px] text-gray-400 font-medium">{product.packaging}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-black text-gray-900">${product.price.toFixed(2)}</span>
                    <span className="text-[11px] text-gray-400 line-through font-medium">${product.originalPrice.toFixed(2)}</span>
                  </div>
                  <span className="text-[10px] font-black text-green-600">{product.discount}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); guardedAction(() => alert('Added to cart!'))() }}
                  className="bg-[#006D6D] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold active:scale-95 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryProductList
