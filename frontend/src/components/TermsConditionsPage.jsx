import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const DEFAULTS = {
  heroTitle: "Terms & Conditions",
  heroSub: "Please read these terms carefully before accessing or using our services.",
  warning: "Important Notice: By utilizing this platform to purchase generic or brand medicines, you verify that you are under the care of a licensed physician who has authorized these medications for your health regime.",
  sections: [
    { title: "1. Introduction", content: "Welcome to CureBasket.com. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions. Please review them carefully. If you do not agree to these terms, you must not use this site." },
    { title: "2. Age and Eligibility", content: "You must be at least 21 years of age to use this website or make purchases. By placing an order, you represent and warrant that you are of legal age and that you possess the legal authority to enter into a binding agreement." },
    { title: "3. Prescription Requirement", content: "Certain products offered on CureBasket require a valid prescription from a licensed healthcare provider. We reserve the right to verify prescriptions and hold or cancel orders if a valid prescription is not uploaded or provided upon request." },
    { title: "4. No Medical Advice", content: "The content, articles, and product information available on CureBasket.com are for informational purposes only. They do not constitute medical advice, diagnosis, or treatment. Always consult with your doctor or healthcare professional before starting any new medication." },
    { title: "5. Pricing, Orders and Payments", content: "All prices are listed in USD unless stated otherwise. We reserve the right to refuse or cancel any order for any reason, including product availability, pricing errors, or suspicion of fraud. Payment must be processed securely before shipment." },
    { title: "6. Shipping & Customs", content: "CureBasket ships healthcare products globally. Customers are responsible for ensuring that the products ordered are legal for import into their respective country. CureBasket is not liable for customs delays, confiscations, or local importing taxes." }
  ]
};

function TermsConditionsPage() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    api.get('/settings/public/cms')
      .then(res => {
        if (res.data?.data?.terms) {
          setContent(prev => ({
            ...prev,
            ...res.data.data.terms
          }))
        }
      })
      .catch(() => {})
  }, [])

  const activeSections = (content.sections || []).map((sec, idx) => ({
    id: sec.id || `sec-${idx}`,
    title: sec.title,
    content: sec.content
  }));

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[24px] md:text-[44px] font-bold tracking-tight">{content.heroTitle}</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            {content.heroSub}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Quick Sticky Index Sidebar */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="sticky top-24 bg-[#E6F7F7] border border-[#006D6D]/10 rounded-[20px] p-6 space-y-4">
              <h3 className="text-[16px] font-bold text-[#004D4D] tracking-wide uppercase">Table of Contents</h3>
              <nav className="flex flex-col gap-2">
                {activeSections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-[13.5px] font-semibold text-gray-600 hover:text-[#006D6D] transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal Texts */}
          <div className="flex-grow space-y-10">
            {content.warning && (
              <div className="bg-[#f5b23e]/10 border-l-4 border-[#f5b23e] rounded-r-xl p-5 mb-8">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-[#d48806] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-[13px] md:text-[14px] font-semibold text-[#d48806] leading-relaxed">
                    <strong>Important Notice:</strong> {content.warning}
                  </p>
                </div>
              </div>
            )}

            {activeSections.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-3">
                <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 border-b border-gray-100 pb-2">
                  {section.title}
                </h2>
                <p className="text-[14.5px] md:text-[16px] text-gray-600 font-medium leading-relaxed text-left md:text-justify">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default TermsConditionsPage
