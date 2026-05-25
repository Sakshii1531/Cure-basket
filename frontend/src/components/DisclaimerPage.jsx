import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const DEFAULTS = {
  heroTitle: "Disclaimer Policy",
  heroSub: "Please read our medical and operational disclaimers carefully.",
  warning: "CureBasket.com does not authorize, endorse, or manufacture medical goods. We serve purely as an online sourcing platform. Never disregard medical advice or delay seeking it due to any details read on this platform.",
  sections: [
    {
      title: "Medical Information & Advice Disclaimer",
      content: "All health-related information and product descriptions on CureBasket.com are for informational purposes only. We do not provide clinical diagnosis, medical guidance, or treatment plans. You should never rely on our digital information as a replacement for advice from your certified general practitioner or qualified specialist."
    },
    {
      title: "Brand and Intellectual Property",
      content: "Any brand names, logos, or trademarks referenced on this website are the property of their respective owners. Their mention here is purely for identification and referencing generic equivalents. CureBasket is not affiliated with or endorsed by the brand patent holders."
    },
    {
      title: "Product Sourcing & FDA Status",
      content: "Generic and brand drugs shipped from international pharmacies (including India) are regulated and approved by local equivalent authorities. They might look slightly different in packaging or color compared to local retail formats in your home country, despite containing identical active pharmaceutical ingredients (APIs)."
    },
    {
      title: "Importing and Legal Compliance",
      content: "It is the customer's sole responsibility to ensure that buying and importing medications through our platform complies with local import laws, prescriptions regulations, and customs guidelines in their respective country of residence."
    }
  ]
};

function DisclaimerPage() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    api.get('/settings/public/cms')
      .then(res => {
        if (res.data?.data?.disclaimer) {
          setContent(prev => ({
            ...prev,
            ...res.data.data.disclaimer
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

      {/* Main Body */}
      <div className="max-w-[950px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-8">
        
        {/* Caution Box */}
        {content.warning && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-6 shadow-sm">
            <div className="flex gap-4">
              <svg className="w-8 h-8 text-red-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-red-800 uppercase tracking-wide">Critical Medical Disclaimer</h3>
                <p className="text-[13.5px] md:text-[14.5px] font-medium text-red-700 leading-relaxed">
                  {content.warning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid List */}
        <div className="grid grid-cols-1 gap-6">
          {(content.sections || []).map((item, index) => (
            <div key={index} className="bg-white border border-gray-100 border-l-4 border-l-[#f5b23e] rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <h3 className="text-[18px] font-bold text-[#004D4D]">{item.title}</h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 font-medium leading-relaxed text-justify">{item.content || item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default DisclaimerPage
