import React from 'react'
import promoImg from '../assets/promo_banner.png'
import usePromoBanners from '../hooks/usePromoBanners'

function QualityCareBanner() {
  const cms = usePromoBanners('qualityCare')

  return (
    <section className="bg-white py-4 md:py-6 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto bg-[#f0fafa] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center relative overflow-hidden">
        <div className="flex-1 z-10">
          <h1 className="text-[28px] md:text-[40px] font-bold leading-tight">
            <span className="text-[#006D6D]">{cms.title1}</span><br />
            <span className="text-[#FBB03B]">{cms.title2}</span>
          </h1>
          <p className="text-[14px] md:text-[16px] text-gray-700 mt-4 max-w-[400px]">
            {cms.description}
          </p>
          <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
            <button className="bg-[#FBB03B] text-white px-8 py-3.5 rounded-[12px] font-bold text-[16px] flex items-center gap-2 hover:bg-[#e6a035] transition-all shadow-md">
              {cms.buttonText}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <span className="text-[#006D6D] font-semibold text-[14px]">{cms.badge}</span>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center gap-8 z-10 px-4">
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#FBB03B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.159 3.659A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Affordable<br/>prices</span>
          </div>
          <div className="h-16 w-[1px] bg-gray-300 self-center" />
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 5.714z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Secure &<br/>trusted</span>
          </div>
          <div className="h-16 w-[1px] bg-gray-300 self-center" />
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#FBB03B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-4.446-3.605-8.159-7.737-8.159H5.25m11.947 4.909c1.796 0 3.251 1.455 3.251 3.251m-12.33 3.398h13.848" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Fast & discreet<br/>delivery</span>
          </div>
        </div>

        <div className="flex-1 hidden md:flex justify-end relative z-10">
          <div className="relative">
            <img src={promoImg} alt="CureBasket Medicines" className="w-[480px] object-contain" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#006D6D] opacity-[0.05] rounded-full blur-3xl -z-10" />
          </div>
        </div>

        <div className="absolute right-[-80px] top-[-80px] w-[400px] h-[400px] bg-[#006D6D] opacity-[0.03] rounded-full pointer-events-none" />
      </div>
    </section>
  )
}

export default QualityCareBanner
