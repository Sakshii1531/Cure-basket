import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthGate } from '../hooks/useAuthGate'
import med1 from '../assets/med1.png'
import med2 from '../assets/med2.png'
import med3 from '../assets/med3.png'
import med4 from '../assets/med4.png'

const productsData = {
  'Insulin & Diabetes Care': [
    {
      id: 1,
      name: 'Lantus Solostar',
      strength: '100 IU/ml',
      manufacturer: 'Sanofi Aventis',
      packaging: '5 Pen (3ml)',
      price: 42.00,
      originalPrice: 62.00,
      discount: '32% OFF',
      image: med1
    },
    {
      id: 2,
      name: 'Humalog KwikPen',
      strength: '100 IU/ml',
      manufacturer: 'Eli Lilly',
      packaging: '5 Pen (3ml)',
      price: 45.00,
      originalPrice: 67.00,
      discount: '33% OFF',
      image: med2
    },
    {
      id: 3,
      name: 'Novorapid FlexPen',
      strength: '100 IU/ml',
      manufacturer: 'Novo Nordisk',
      packaging: '5 Pen (3ml)',
      price: 41.00,
      originalPrice: 60.00,
      discount: '32% OFF',
      image: med3
    },
    {
      id: 4,
      name: 'Levemir FlexPen',
      strength: '100 IU/ml',
      manufacturer: 'Novo Nordisk',
      packaging: '5 Pen (3ml)',
      price: 44.00,
      originalPrice: 65.00,
      discount: '32% OFF',
      image: med4
    }
  ]
}

const CategoryProductList = () => {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const decodedName = decodeURIComponent(categoryName)
  
  // Default to Insulin data if category not found in mock
  const products = productsData[decodedName] || productsData['Insulin & Diabetes Care']
  const displayTitle = decodedName.split(' ')[0] // e.g. "Insulin"

  const handleProductClick = (product) => {
    navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product } })
  }

  const { guardedAction } = useAuthGate()

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
          <h1 className="text-[17px] font-bold text-gray-900">{displayTitle}</h1>
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
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
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
        <span className="text-[12px] font-bold text-gray-500">{products.length * 6} Products</span>
      </div>

      {/* Product List */}
      <div className="px-3 space-y-3">
        {products.map((product) => (
          <div 
            key={product.id} 
            onClick={() => handleProductClick(product)}
            className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex gap-4 cursor-pointer active:scale-[0.98] transition-all"
          >
            {/* Left: Image */}
            <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-50">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Right: Details */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-gray-900 leading-tight">{product.name}</h3>
                  <p className="text-[12px] font-bold text-gray-900 mt-0.5">{product.strength}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); /* wishlist logic */ }}
                  className="text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
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
                
                <div className="flex flex-col items-end gap-1.5">
                   <button 
                    onClick={(e) => { e.stopPropagation(); guardedAction(() => alert('Added to cart!'))() }}
                    className="bg-[#006D6D] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold active:scale-95 transition-all"
                   >
                    Add to Cart
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* wishlist logic */ }}
                    className="text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Repetitive data to show scroll like in screenshot */}
        {[1, 2].map(i => (
           <div 
            key={`extra-${i}`} 
            onClick={() => handleProductClick({ name: 'Novorapid FlexPen' })}
            className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex gap-4 cursor-pointer active:scale-[0.98] transition-all"
           >
            <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-50">
              <img src={med1} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-gray-900 leading-tight">Novorapid FlexPen</h3>
                  <p className="text-[12px] font-bold text-gray-900 mt-0.5">100 IU/ml</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-1">Novo Nordisk</p>
              <p className="text-[11px] text-gray-400 font-medium">5 Pen (3ml)</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-black text-gray-900">$41.00</span>
                    <span className="text-[11px] text-gray-400 line-through font-medium">$60.00</span>
                  </div>
                  <span className="text-[10px] font-black text-green-600">32% OFF</span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                   <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="bg-[#006D6D] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold active:scale-95 transition-all"
                   >
                    Add to Cart
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryProductList
