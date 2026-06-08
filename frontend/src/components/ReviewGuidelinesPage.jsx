import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const DEFAULTS = {
  heroTitle: "Review Guidelines",
  heroSub: "Learn about how to write useful, legal, and authentic reviews regarding your medical orders.",
  dos: [
    "Focus on your personal experience with the medicine's packaging, dispatch, and delivery speed.",
    "Describe customer support efficiency if you interacted with our pharmaceutical review teams.",
    "Be honest, clear, and respect standard community vocabulary.",
    "Mention generic equivalents and savings comparison compared to local retail formats."
  ],
  donts: [
    "Do not post clinical diagnoses, medical prescription dosages, or healthcare suggestions.",
    "Do not list personal contact detail (phone, address, emails) in reviews.",
    "Do not make claims regarding disease-curing capacities or professional clinical outcomes.",
    "Do not post unauthentic, copy-pasted, or third-party promotional material."
  ]
};

function ReviewGuidelinesPage() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    api.get('/settings/public/cms')
      .then(res => {
        if (res.data?.data?.reviewGuidelines) {
          setContent(prev => ({
            ...prev,
            ...res.data.data.reviewGuidelines
          }))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        {/* Floating background decorative shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#f5b23e]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-5 right-10 w-36 h-36 bg-[#f5b23e]/10 rounded-full blur-2xl"></div>

        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[24px] md:text-[44px] font-bold tracking-tight">{content.heroTitle}</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            {content.heroSub}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* DOs */}
          <div className="space-y-6">
            <h2 className="text-[20px] md:text-[24px] font-bold text-emerald-800 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[16px] font-extrabold">✓</span>
              What We Encourage (DOs)
            </h2>
            <ul className="space-y-4">
              {(content.dos || []).map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                  <p className="text-[14px] md:text-[15.5px] text-gray-600 font-medium leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* DONTs */}
          <div className="space-y-6">
            <h2 className="text-[20px] md:text-[24px] font-bold text-red-800 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[16px] font-extrabold">✕</span>
              What To Avoid (DONTs)
            </h2>
            <ul className="space-y-4">
              {(content.donts || []).map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span>
                  <p className="text-[14px] md:text-[15.5px] text-gray-600 font-medium leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ReviewGuidelinesPage
