import React from 'react'
import { useNavigate } from 'react-router-dom'

function InsuranceCoveragePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[24px] md:text-[44px] font-bold tracking-tight">Shipping Insurance Coverage</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            Your health and peace of mind are our priority. Learn about our free comprehensive transit insurance.
          </p>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-[950px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-8">
        
        {/* Intro Highlight Box */}
        <div className="bg-[#E6F7F7] border-l-4 border-[#006D6D] rounded-r-2xl p-6 shadow-sm">
          <div className="flex gap-4">
            <svg className="w-8 h-8 text-[#006D6D] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="space-y-1">
              <h3 className="text-[16px] font-bold text-[#004D4D] uppercase tracking-wide">100% Free & Automatic Coverage</h3>
              <p className="text-[13.5px] md:text-[14.5px] font-medium text-gray-700 leading-relaxed">
                Every single order placed on CureBasket is automatically backed by our complimentary Comprehensive Transit Insurance. There are absolutely no extra fees, hidden premiums, or opt-ins required at checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#E6F7F7] rounded-xl flex items-center justify-center text-[#006D6D] mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#004D4D]">Loss & Theft Protection</h3>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
              If your shipment is confirmed lost by the delivery carrier or gets stuck in customs for more than 21 business days, we will immediately initiate a 100% free reshipment of your medicines or issue a full refund.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#E6F7F7] rounded-xl flex items-center justify-center text-[#006D6D] mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#004D4D]">Damage & Spillage Cover</h3>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
              Pharmaceutical items are highly sensitive. If your parcel arrives damaged, broken, or has broken safety seals due to rough handling during transit, our policy guarantees a complete reshipment at no cost.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#E6F7F7] rounded-xl flex items-center justify-center text-[#006D6D] mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#004D4D]">Delivery Guarantee</h3>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
              We stand fully behind our fulfillment network. You only pay for successful deliveries. If our partner courier network fails to complete delivery, your money is securely protected and fully refundable.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#E6F7F7] rounded-xl flex items-center justify-center text-[#006D6D] mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.97 5.97 0 00-.75-2.985m-.938-2.078a9.75 9.75 0 00-4.722-.988 9.75 9.75 0 00-4.722.988m4.722-.988a9.002 9.002 0 00-4.682 2.72A3.001 3.001 0 003.75 18c0 .225.012.447.037.666A11.944 11.944 0 0112 21c2.17 0 4.207-.576 5.963-1.584a1.8 1.8 0 00.177-.073M15 7.5a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#004D4D]">Hassle-Free Claims</h3>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
              Filing a claim is simple. Just contact our 24/7 Support with your Order ID. For damaged goods, provide a photo of the parcel and the contents, and we will dispatch a replacement package within 24 hours.
            </p>
          </div>

        </div>

        {/* Back Button */}
        <div className="pt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#006D6D] hover:bg-[#005a5a] text-white font-bold px-12 py-3 rounded-full text-[14px] uppercase tracking-wider transition-colors shadow-md"
          >
            Go Back
          </button>
        </div>

      </div>
    </div>
  )
}

export default InsuranceCoveragePage
