import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const DEFAULTS = {
  heroTitle: "Refunds & Returns Policy",
  heroSub: "Read our clear policies regarding customer satisfaction, parcel returns, and refund channels.",
  warning: "We stand by our shipping guarantees. Standard medical prescription supplies fall under strict global safety guidelines. Therefore, we do not require physical product returns to process authentic shipping refund claims.",
  sections: [
    {
      title: "100% Money-Back Guarantee",
      desc: "If your parcel is lost in transit, damaged during shipment, or holds incorrect items, we provide a full refund or free reshipment without any additional charges."
    },
    {
      title: "Delivery Timeline Window",
      desc: "For express shipping, if your delivery exceeds 21 business days, please contact our support team. We will immediately initiate a complete check or issue a full refund."
    },
    {
      title: "Eligible Sourcing Issues",
      desc: "If a medication does not match your prescription dosage or shows manufacturing anomalies, we require digital photographic evidence to process your claim immediately."
    }
  ]
};

function RefundPolicyPage() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    api.get('/settings/public/cms')
      .then(res => {
        if (res.data?.data?.refundPolicy) {
          setContent(prev => ({
            ...prev,
            ...res.data.data.refundPolicy
          }))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight">{content.heroTitle}</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            {content.heroSub}
          </p>
        </div>
      </div>

      {/* Policy Details */}
      <div className="max-w-[950px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-10">
        
        {/* Money Back Shield Visual */}
        {content.warning && (
          <div className="bg-[#f5b23e]/10 border border-[#f5b23e]/25 rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-[#d48806] shrink-0 shadow-sm border border-teal-50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-[18px] font-bold text-gray-900">Your Health Sourcing is Protected</h3>
              <p className="text-[14px] md:text-[15.5px] text-gray-600 font-medium leading-relaxed">
                {content.warning}
              </p>
            </div>
          </div>
        )}

        {/* Grid Lists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(content.sections || []).map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <h4 className="text-[16px] font-bold text-[#004D4D]">{item.title}</h4>
              <p className="text-[13.5px] text-gray-600 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Support Callout */}
        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-[14px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Need immediate assistance with an order?</p>
          <p className="text-[15px] font-medium text-gray-700">
            Email us anytime at <span className="font-bold text-[#006D6D]">support@curebasket.com</span> or open the Support window to chat.
          </p>
        </div>

      </div>
    </div>
  )
}

export default RefundPolicyPage
