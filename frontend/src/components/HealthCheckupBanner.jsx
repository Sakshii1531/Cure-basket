import React from 'react'
import healthImg from '../assets/health_banner.png'

function HealthCheckupBanner() {
  return (
    <section className="bg-white py-4 md:py-6 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto bg-[#f0f9ff] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center relative overflow-hidden">
        {/* Left Section: Text and CTA */}
        <div className="flex-1 z-10">
          <h1 className="text-[28px] md:text-[40px] font-bold leading-tight">
            <span className="text-[#006D6D]">Full Body</span><br />
            <span className="text-[#3B82F6]">Health Checkups</span>
          </h1>
          <p className="text-[14px] md:text-[16px] text-gray-700 mt-4 max-w-[400px]">
            Home sample collection. NABL certified labs. Accurate results in 24 hours.
          </p>
          
          <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
            <button className="bg-[#3B82F6] text-white px-8 py-3.5 rounded-[12px] font-bold text-[16px] flex items-center gap-2 hover:bg-[#2563eb] transition-all shadow-md">
              Book a Test
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <span className="text-[#006D6D] font-semibold text-[14px]">Starting from just ₹499!</span>
          </div>
        </div>

        {/* Middle Section: Trust Pillars */}
        <div className="hidden lg:flex flex-1 justify-center gap-8 z-10 px-4">
          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#3B82F6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Home Sample<br/>Collection</span>
          </div>
          
          <div className="h-16 w-[1px] bg-gray-300 self-center" />

          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 5.714z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Certified<br/>Labs</span>
          </div>

          <div className="h-16 w-[1px] bg-gray-300 self-center" />

          <div className="flex flex-col items-center text-center min-w-[100px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
              <svg className="w-8 h-8 text-[#3B82F6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-800 leading-tight">24 Hour<br/>Results</span>
          </div>
        </div>

        {/* Right Section: Graphic */}
        <div className="flex-1 hidden md:flex justify-end relative z-10">
          <div className="relative">
            <img src={healthImg} alt="Health Checkup" className="w-[480px] object-contain" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#3B82F6] opacity-[0.05] rounded-full blur-3xl -z-10" />
          </div>
        </div>

        {/* Background Decorative Blob */}
        <div className="absolute right-[-80px] top-[-80px] w-[400px] h-[400px] bg-[#3B82F6] opacity-[0.03] rounded-full pointer-events-none" />
      </div>
    </section>
  )
}

export default HealthCheckupBanner
