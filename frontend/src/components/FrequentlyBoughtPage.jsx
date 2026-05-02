import React, { useEffect } from 'react'
import med1 from '../assets/med1.png'
import med2 from '../assets/med2.png'
import med3 from '../assets/med3.png'
import med4 from '../assets/med4.png'
import med5 from '../assets/med5.png'

const frequentlyBought = [
  { id: 1, name: 'Doxycycline 100 mg Tablet', qty: '10 Tablets', price: '8.50', image: med1 },
  { id: 2, name: 'Albendazole 400 mg Tablet', qty: '1 Tablet', price: '2.20', image: med1 },
  { id: 3, name: 'Vitamin C 500 mg Tablet', qty: '10 Tablets', price: '4.10', image: med1 },
  { id: 4, name: 'Zincovit Tablet', qty: '15 Tablets', price: '3.30', image: med1 },
  { id: 5, name: 'Azithromycin 500 mg', qty: '3 Tablets', price: '12.00', image: med2 },
  { id: 6, name: 'Paracetamol 650 mg', qty: '15 Tablets', price: '5.50', image: med3 },
  { id: 7, name: 'Pantoprazole 40 mg', qty: '10 Tablets', price: '9.30', image: med4 },
  { id: 8, name: 'Montelukast 10 mg', qty: '10 Tablets', price: '11.20', image: med5 },
]

function FrequentlyBoughtPage({ onBack, onProductClick }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[32px] md:text-[42px] font-bold text-gray-900 tracking-tight mb-4">
            Frequently Bought Together
          </h1>
          <p className="text-gray-500 text-[16px] max-w-2xl leading-relaxed font-medium">
            Explore products that our customers frequently purchase together for comprehensive health management.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {frequentlyBought.map((product) => (
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default FrequentlyBoughtPage
