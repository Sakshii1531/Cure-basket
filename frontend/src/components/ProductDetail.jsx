import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import mounjaroImg from '../assets/mounjaro.png'
import ozempicImg from '../assets/ozempic.png'
import zepboundImg from '../assets/zepbound.png'

function ProductDetail({ onBack }) {
  const location = useLocation()
  const product = location.state?.product
  
  const [selectedPharmacy, setSelectedPharmacy] = useState('CVS')

  // Mock data matching the new UI style
  const productData = {
    name: product?.name || "Wegovy",
    genericName: "semaglutide",
    image: product?.image || "https://placehold.co/100x100/white/004D4D?text=Wegovy",
    tabs: ["Drug Info", "Brand-name medications", "Side Effects", "Dosage", "Medicare"],
    prescription: "Wegovy 1.5mg (30 tablets)",
    price: "149.00",
    pharmacies: [
      { name: "CVS Pharmacy", price: "149.00", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/CVS_Pharmacy_logo.svg/512px-CVS_Pharmacy_logo.svg.png" },
      { name: "Walgreens", price: "149.00", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Walgreens_Logo.svg/512px-Walgreens_Logo.svg.png" },
      { name: "Walmart", price: "149.00", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/512px-Walmart_logo.svg.png" },
    ]
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const popularOffers = [
    {
      id: 1,
      name: "Mounjaro",
      description: "4 pens of 2.5mg/0.5ml 1 carton",
      discount: "22% off",
      oldPrice: "$1,336.53",
      newPrice: "$25.00",
      image: mounjaroImg
    },
    {
      id: 2,
      name: "Ozempic",
      description: "1 prefilled 2mg pen of 2mg/3ml 1 carton",
      discount: "97.8% off",
      oldPrice: "$1,475.69",
      newPrice: "$25.00",
      image: ozempicImg
    },
    {
      id: 3,
      name: "Zepbound",
      description: "4 prefilled pens of 2.5mg/0.5ml 1 carton",
      discount: "23% off",
      oldPrice: "$1,281.02",
      newPrice: "$25.00",
      image: zepboundImg
    }
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      {/* Top Header Section */}
      <div className="max-w-[1050px] mx-auto px-4 pt-2">
        <div className="flex justify-between items-start mb-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <h1 className="text-[30px] font-medium text-gray-900 tracking-tight">{productData.name}</h1>
            </div>
            <span className="text-[16px] text-black font-medium">{productData.genericName}</span>

            <div className="flex flex-wrap gap-2 mt-4">
              {productData.tabs.map(tab => (
                <button key={tab} className="px-4 py-1.5 rounded-full border border-black text-[12px] font-medium text-black hover:bg-gray-50 transition-colors">
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="w-32 h-32 mr-12">
            <img src={productData.image} alt="Product" className="w-full h-full object-contain" />
          </div>
        </div>



        {/* Sponsored Banner */}
        <div className="bg-[#f0f9f9] rounded-xl p-4 flex items-center justify-between mb-8 cursor-pointer hover:bg-[#e0f2f2] transition-colors max-w-[480px]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#004D4D] rounded-full flex items-center justify-center text-white text-[12px] font-bold">i</div>
            <span className="text-[#004D4D] font-semibold text-[13px]">Explore {productData.name} ({productData.genericName}) info</span>
            <svg className="w-4 h-4 text-[#004D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>

      </div>

      <hr className="border-black" />

      <div className="max-w-[1050px] mx-auto px-4">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
          
          {/* Left Column */}
          <div className="space-y-8 border-r border-black pr-12 pt-8">
            {/* Prescription & Switch Container */}
            <div className="max-w-[480px]">
              <div className="bg-white border border-gray-400 rounded-md py-3 px-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Prescription</div>
                    <div className="text-[16px] font-semibold text-[#004D4D]">{productData.prescription}</div>
                  </div>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-[#004D4D] hover:opacity-80 pt-1 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-[#f0f9f9] border border-gray-400 rounded-md py-3 px-4 flex items-center justify-between">
                <span className="text-[14px] font-semibold text-black">Switch to {productData.name} pen starting at $199</span>
                <button className="bg-white border border-black px-6 py-1 rounded-full font-semibold text-[13px] hover:bg-gray-50 transition-all text-black">
                  Switch
                </button>
              </div>
            </div>




          </div>

          {/* Right Column: Price/Coupon Card */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4 max-w-[350px] pt-8">
            {/* Available Dosages */}
            <div className="pb-4">
              <h3 className="text-[16px] font-semibold text-[#004D4D] mb-2">Available Dosages</h3>
              <div className="flex gap-3">
                <div className="px-4 py-1.5 border border-[#004D4D] rounded-full text-[#004D4D] font-semibold text-[13px] cursor-pointer hover:bg-[#004D4D] hover:text-white transition-all">
                  6 mg
                </div>
                <div className="px-4 py-1.5 border border-[#004D4D] rounded-full text-[#004D4D] font-semibold text-[13px] cursor-pointer hover:bg-[#004D4D] hover:text-white transition-all">
                  1%
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-gray-700">Quantity:</span>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-[#004D4D] rounded-[10px] px-3 py-1.5 pr-7 text-[13px] font-semibold text-[#004D4D] focus:outline-none min-w-[60px]">
                      <option selected>1</option>
                      <option>2</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-[#004D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <button className="flex-grow border border-[#004D4D] text-[#004D4D] font-bold py-1.5 rounded-full text-[13px] hover:bg-[#004D4D] hover:text-white transition-all tracking-wide uppercase">
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Product Info Bar */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="bg-[#FFC043] rounded-[10px] px-16 py-2.5 flex flex-nowrap justify-between items-center gap-4 mt-4 w-full overflow-hidden shadow-sm">
          <div className="text-[11px] whitespace-nowrap"><span className="font-bold">SKU:</span> 2593</div>
          <div className="text-[11px] whitespace-nowrap"><span className="font-bold">Generic For:</span> Stromectol</div>
          <div className="text-[11px] whitespace-nowrap"><span className="font-bold">Active Ingredient:</span> Ivermectin</div>
          <div className="text-[11px] whitespace-nowrap"><span className="font-bold">Manufacturer:</span> Admed Pharma Pvt. Ltd. (India)</div>
        </div>
      </div>

      {/* Popular Offers Section */}
      <div className="bg-[#f7f7f7] py-16 mt-16">
        <div className="max-w-[1050px] mx-auto px-4">
          <h2 className="text-[28px] font-bold text-gray-900 mb-8">Popular offers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-[32px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_50px_rgba(0,0,0,0.1)] transition-all flex flex-col relative overflow-hidden group border border-gray-100">
                {/* Grey Side Accent */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[22px] h-[75%] bg-[#C4C4C4] rounded-r-[16px]"></div>

                {/* Discount Tag */}
                <div className="absolute top-6 right-6 bg-white border border-gray-200 px-3 py-1.5 rounded-[8px] flex items-center gap-2 text-[18px] font-bold text-black shadow-sm">
                  <svg className="w-5 h-5 text-[#008080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                  {offer.discount}
                </div>

                {/* Product Image */}
                <div className="h-44 flex items-center justify-center mb-8 px-4">
                  <img src={offer.image} alt={offer.name} className="max-h-full object-contain mix-blend-multiply drop-shadow-md" />
                </div>

                {/* Product Info */}
                <div className="flex-grow pl-2">
                  <h3 className="text-[28px] font-bold text-black mb-2 leading-tight">{offer.name}</h3>
                  <p className="text-[18px] text-[#666666] mb-6 leading-snug">{offer.description}</p>
                  
                  {/* Divider */}
                  <div className="w-full h-[1.5px] bg-[#E0E0E0] mb-6"></div>
                  
                  <div className="mt-auto">
                    <div className="text-[16px] text-[#888888] font-medium line-through mb-1">{offer.oldPrice}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[24px] font-medium text-black">As low as</span>
                      <span className="text-[28px] font-bold text-black">{offer.newPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Learn more about link */}
                <div className="mt-8 pl-2 flex items-center gap-2 text-[#00529B] font-bold text-[17px] cursor-pointer hover:opacity-80 transition-opacity">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <circle cx="11" cy="11" r="3"/>
                  </svg>
                  Learn more about {offer.name}
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center items-center gap-6 mt-12">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            </div>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Prescription Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] w-full max-w-[480px] shadow-2xl relative overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 pb-0 flex justify-between items-center">
              <h2 className="text-[24px] font-semibold text-gray-900">Edit prescription</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Medication options */}
              <div>
                <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Medication options</label>
                <div className="relative">
                  <select className="w-full h-[48px] px-4 rounded-[10px] border border-gray-300 bg-white appearance-none text-gray-400 font-medium focus:border-[#004D4D] focus:ring-1 focus:ring-[#004D4D] outline-none transition-all">
                    <option>{productData.name} (brand)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div>
                <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Form</label>
                <div className="relative">
                  <select className="w-full h-[48px] px-4 rounded-[10px] border border-gray-300 bg-white appearance-none text-[#004D4D] font-medium text-[15px] focus:border-[#004D4D] focus:ring-1 focus:ring-[#004D4D] outline-none transition-all">
                    <option>carton</option>
                    <option selected>tablet</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Dosage</label>
                <div className="relative">
                  <select className="w-full h-[48px] px-4 rounded-[10px] border border-gray-300 bg-white appearance-none text-[#004D4D] font-medium text-[15px] focus:border-[#004D4D] focus:ring-1 focus:ring-[#004D4D] outline-none transition-all">
                    <option selected>1.5mg</option>
                    <option>4mg</option>
                    <option>9mg</option>
                    <option>25mg</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Quantity</label>
                <div className="relative">
                  <select className="w-full h-[48px] px-4 rounded-[10px] border border-gray-300 bg-white appearance-none text-[#004D4D] font-medium text-[15px] focus:border-[#004D4D] focus:ring-1 focus:ring-[#004D4D] outline-none transition-all">
                    <option selected>30 tablets</option>
                    <option>60 tablets</option>
                    <option>90 tablets</option>
                    <option>Custom quantity...</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="h-[48px] rounded-full border-2 border-[#004D4D] text-[#004D4D] font-bold text-[15px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="h-[48px] rounded-full bg-[#004D4D] text-white font-bold text-[15px] hover:opacity-90 transition-opacity"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
