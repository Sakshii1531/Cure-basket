import React from 'react'
import plusImg from '../assets/membership_banner.png'
import usePromoBanners from '../hooks/usePromoBanners'

function CurePlusBanner() {
  const cms = usePromoBanners('curePlus')

  return (
    <section className="bg-white py-4 md:py-6 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto bg-[#f8f1ff] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center relative overflow-hidden">
        <div className="flex-1 z-10">
          <h1 className="text-[28px] md:text-[40px] font-bold leading-tight">
            <span className="text-[#006D6D]">{cms.title1}</span><br />
            <span className="text-[#8B5CF6]">{cms.title2}</span>
          </h1>
          <p className="text-[14px] md:text-[16px] text-gray-700 mt-4 max-w-[400px]">
            {cms.description}
          </p>
          <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
            <button className="bg-[#8B5CF6] text-white px-8 py-3.5 rounded-[12px] font-bold text-[16px] flex items-center gap-2 hover:bg-[#7c3aed] transition-all shadow-md">
              {cms.buttonText}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </button>
            <span className="text-[#006D6D] font-semibold text-[14px]">{cms.badge}</span>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center gap-8 z-10 px-4">
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#8B5CF6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75m0 3v.75m0 3v.75m0 3v.75m0 3V18m15 0h1.5m-1.5-3h1.5m-1.5-3h1.5m-1.5-3h1.5m-1.5-3H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5h.75m11.25 0h.75m11.25 0h.75m-13.5 0h.75m-13.5 0h.75" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Extra 25%<br/>Off</span>
          </div>
          <div className="h-16 w-[1px] bg-gray-300 self-center" />
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-4.446-3.605-8.159-7.737-8.159H5.25m11.947 4.909c1.796 0 3.251 1.455 3.251 3.251m-12.33 3.398h13.848" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Free<br/>Delivery</span>
          </div>
          <div className="h-16 w-[1px] bg-gray-300 self-center" />
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#8B5CF6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Priority<br/>Support</span>
          </div>
        </div>

        <div className="flex-1 hidden md:flex justify-end relative z-10">
          <div className="relative">
            <img src={plusImg} alt="CureBasket Plus" className="w-[480px] object-contain" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8B5CF6] opacity-[0.05] rounded-full blur-3xl -z-10" />
          </div>
        </div>

        <div className="absolute right-[-80px] top-[-80px] w-[400px] h-[400px] bg-[#8B5CF6] opacity-[0.03] rounded-full pointer-events-none" />
      </div>
    </section>
  )
}

export default CurePlusBanner
