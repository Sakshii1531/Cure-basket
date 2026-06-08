import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AboutUs from './AboutUs'
import api from '../utils/api'

const DEFAULTS = {
  heroTitle: "About CureBasket",
  heroSub: "Your trusted global partner for high-quality, affordable healthcare and medicines delivered right to your doorstep.",
  stats: [
    { value: "15+", label: "Years of Service" },
    { value: "1M+", label: "Happy Customers" },
    { value: "99.9%", label: "Safe Deliveries" },
    { value: "24/7", label: "Customer Support" }
  ],
  values: [
    { title: "Quality Guaranteed", description: "We source medications exclusively from WHO-GMP certified suppliers and reputable manufacturers, ensuring absolute safety." },
    { title: "Absolute Privacy", description: "Your health records, order history, and personal details are encrypted and kept strictly confidential. Privacy is our top priority." },
    { title: "Affordable Care", description: "By sourcing quality generic alternatives directly, we offer deep discounts and up to 70% savings compared to standard offline drugstores." }
  ]
};

const VALUE_ICONS = [
  (
    <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  (
    <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  (
    <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
];

function AboutUsPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    api.get('/settings/public/cms')
      .then(res => {
        if (res.data?.data?.aboutUs) {
          setContent(prev => ({
            ...prev,
            ...res.data.data.aboutUs
          }))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center overflow-hidden">
        {/* Floating background decorative shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-5 right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>

        <div className="max-w-[1200px] mx-auto relative z-10 space-y-4">
          <h1 className="text-[24px] md:text-[48px] font-bold tracking-tight">{content.heroTitle}</h1>
          <p className="text-[15px] md:text-[18px] text-[#CFF4F4] max-w-2xl mx-auto font-medium">
            {content.heroSub}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-[1250px] mx-auto px-4 py-8 md:py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.06)] rounded-[24px] p-6 md:p-8">
          {(content.stats || []).map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="text-[28px] md:text-[40px] font-extrabold text-[#f5b23e]">{stat.value}</div>
              <div className="text-[12px] md:text-[14px] font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Details (Re-using the customized home-page About Us layout, but rendered fully) */}
      <div className="pb-16 pt-4">
        <AboutUs />
      </div>

      {/* Additional Values section */}
      <div className="bg-[#fef6f6] py-16 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto space-y-12">
          <h2 className="text-[24px] md:text-[32px] font-bold text-center text-[#004D4D] uppercase tracking-wider">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(content.values || []).map((value, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#f5b23e]/10 flex items-center justify-center">
                  {VALUE_ICONS[i % VALUE_ICONS.length]}
                </div>
                <h3 className="text-[18px] font-bold text-gray-900">{value.title}</h3>
                <p className="text-[14px] text-gray-600 font-medium leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage
