import React from 'react'

function FeatureIcons() {
  return (
    <section className="bg-white pt-0 pb-4 md:pb-6 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto border border-gray-100 rounded-[20px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] bg-white p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* 100% Genuine */}
          <div className="flex items-center gap-4 px-2 md:px-4 py-2 md:py-0">
            <div className="w-12 h-12 rounded-full bg-[#006D6D] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[15px] text-gray-900 leading-tight">100% Genuine Medicines</h4>
              <p className="text-[12px] text-gray-500 leading-tight">Sourced from trusted manufacturers</p>
            </div>
          </div>

          {/* Secure Payments */}
          <div className="flex items-center gap-4 px-2 md:px-4 py-2 md:py-0">
            <div className="w-12 h-12 rounded-full bg-[#006D6D] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[15px] text-gray-900 leading-tight">Secure Payments</h4>
              <p className="text-[12px] text-gray-500 leading-tight">Your details are always protected</p>
            </div>
          </div>

          {/* Fast Delivery */}
          <div className="flex items-center gap-4 px-2 md:px-4 py-2 md:py-0">
            <div className="w-12 h-12 rounded-full bg-[#006D6D] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm11 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 7h11v9H2V7zm11 3h4l3 3v3h-7v-6z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[15px] text-gray-900 leading-tight">Fast & Discreet Delivery</h4>
              <p className="text-[12px] text-gray-500 leading-tight">Discreet packaging, on-time delivery</p>
            </div>
          </div>

          {/* Need Help? */}
          <div className="flex items-center gap-4 px-2 md:px-4 py-2 md:py-0">
            <div className="w-12 h-12 rounded-full bg-[#006D6D] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6M3 18a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3zm18 0a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[15px] text-gray-900 leading-tight">Need Help?</h4>
              <p className="text-[12px] text-gray-500 leading-tight">Our support team is here for you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureIcons
