import React from 'react'
import uploadImg from '../assets/upload.png'

function PrescriptionBanner() {
  return (
    <section className="bg-white py-2 md:py-3 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto bg-[#f0fafa] rounded-[24px] p-4 md:p-5 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        {/* Left Side: Icon and Text */}
        <div className="flex items-center gap-6 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-[16px] flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h3m-3 3h2" />
              <text x="12" y="18.5" fontSize="9" fontWeight="900" fill="currentColor" stroke="none" style={{ fontFamily: 'Arial, sans-serif' }}>Rx</text>
            </svg>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[15px] md:text-[17px] font-bold text-[#006D6D] leading-tight">
              Upload Prescription & Get Medicines Delivered
            </h2>
            <p className="text-[11px] md:text-[12px] text-gray-600 mt-1">
              Save time and order prescribed medicines with ease.
            </p>
          </div>
        </div>

        {/* Right Side: Button */}
        <div className="mt-6 md:mt-0 z-10 md:mr-80">
          <button className="flex items-center gap-2 px-8 py-3 rounded-[12px] border-2 border-[#006D6D] border-dotted text-[#006D6D] font-bold text-[15px] hover:bg-[#006D6D] hover:text-white transition-all bg-transparent">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Rx
          </button>
        </div>

        {/* Background Image Asset with Circle Highlight */}
        <div className="absolute right-0 top-0 h-full w-[300px] pointer-events-none hidden md:block">
          <div className="absolute right-[-20px] bottom-[-40px] w-56 h-56 bg-[#006D6D] opacity-[0.08] rounded-full" />
          <img 
            src={uploadImg} 
            alt="Prescription Banner Decoration" 
            className="absolute right-0 bottom-[-15px] h-full object-contain z-10" 
          />
        </div>
      </div>
    </section>
  )
}

export default PrescriptionBanner
