import React from 'react'
import deliveryImg from '../assets/delivery_banner.png'
import usePromoBanners from '../hooks/usePromoBanners'

function ExpressDeliveryBanner() {
  const cms = usePromoBanners('expressDelivery')

  return (
    <section className="bg-white py-4 md:py-6 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto bg-[#fff8f0] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center relative overflow-hidden">
        <div className="flex-1 z-10">
          <h1 className="text-[28px] md:text-[40px] font-bold leading-tight">
            <span className="text-[#FBB03B]">{cms.title1}</span><br />
            <span className="text-[#006D6D]">{cms.title2}</span>
          </h1>
          <p className="text-[14px] md:text-[16px] text-gray-700 mt-4 max-w-[400px]">
            {cms.description}
          </p>
          <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
            <button className="bg-[#006D6D] text-white px-8 py-3.5 rounded-[12px] font-bold text-[16px] flex items-center gap-2 hover:bg-[#005a5a] transition-all shadow-md">
              {cms.buttonText}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <span className="text-[#FBB03B] font-semibold text-[14px]">{cms.badge}</span>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center gap-8 z-10 px-4">
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#FBB03B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">15 Minute<br/>Promise</span>
          </div>
          <div className="h-16 w-[1px] bg-gray-300 self-center" />
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Lightning<br/>Fast</span>
          </div>
          <div className="h-16 w-[1px] bg-gray-300 self-center" />
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#FBB03B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Safe &<br/>Secure</span>
          </div>
        </div>

        <div className="flex-1 hidden md:flex justify-end relative z-10">
          <div className="relative">
            <img src={deliveryImg} alt="Express Delivery" className="w-[480px] object-contain" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FBB03B] opacity-[0.05] rounded-full blur-3xl -z-10" />
          </div>
        </div>

        <div className="absolute right-[-80px] top-[-80px] w-[400px] h-[400px] bg-[#FBB03B] opacity-[0.03] rounded-full pointer-events-none" />
      </div>
    </section>
  )
}

export default ExpressDeliveryBanner
