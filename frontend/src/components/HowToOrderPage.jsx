import React from 'react'
import { Link } from 'react-router-dom'

function HowToOrderPage() {
  const steps = [
    {
      num: "1",
      title: "Search & Select Medicines",
      desc: "Use our intelligent search bar or browse through medical categories to find brand or generic options. Adjust quantities and click 'Add to Cart'.",
      icon: (
        <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      num: "2",
      title: "Upload Prescription (Rx)",
      desc: "If any item in your cart requires a prescription, upload a photo or PDF of your doctor's slip during checkout or via the 'Upload Rx' dashboard.",
      icon: (
        <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      num: "3",
      title: "Secure Checkout & Payment",
      desc: "Enter your global shipping address. Choose from our fast and highly encrypted payment gateways to finalize your purchase securely.",
      icon: (
        <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      num: "4",
      title: "Pharmacist Review & Dispatch",
      desc: "Our qualified pharmacists review your order details. Once verified, the products are packed safely in tamper-proof boxes and dispatched.",
      icon: (
        <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      num: "5",
      title: "Global Doorstep Delivery",
      desc: "Your tracking number is shared immediately. Receive your healthcare supplies directly at your address via secure courier networks.",
      icon: (
        <svg className="w-6 h-6 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight">How To Place An Order</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            A simple, transparent, and step-by-step guide to ordering your medicines online.
          </p>
        </div>
      </div>

      {/* Steps Timeline Layout */}
      <div className="max-w-[850px] mx-auto px-4 md:px-8 py-16 md:py-24 relative">
        {/* Central connecting line for timeline on tablet/desktop */}
        <div className="absolute left-9 md:left-[39px] top-24 bottom-24 w-0.5 bg-[#006D6D]/15 pointer-events-none"></div>

        <div className="space-y-12">
          {steps.map((st, i) => (
            <div key={i} className="flex gap-6 md:gap-8 items-start relative group">
              {/* Stepper Circle */}
              <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full bg-[#f5b23e]/10 border-2 border-[#f5b23e] flex items-center justify-center font-bold text-[#d48806] text-[18px] md:text-[22px] shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10 shadow-sm shadow-[#f5b23e]/10">
                {st.num}
              </div>

              {/* Step Card Content */}
              <div className="flex-grow bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gray-50">
                    {st.icon}
                  </div>
                  <h3 className="text-[17px] md:text-[20px] font-bold text-gray-900 leading-tight">
                    {st.title}
                  </h3>
                </div>
                <p className="text-[13.5px] md:text-[15px] text-gray-600 font-medium leading-relaxed text-justify">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/medicines"
            className="bg-[#006D6D] text-white px-10 py-3.5 rounded-xl font-bold text-[14px] hover:bg-[#004D4D] transition-all duration-300 shadow-lg shadow-[#006D6D]/15 active:scale-95"
          >
            Start Shopping Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HowToOrderPage
