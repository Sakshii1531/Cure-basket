import React, { useState } from 'react'

const allFaqs = [
  {
    q: "How to check the expiry date of medicine online?",
    a: "CureBasket has a team of pharmacists who ensure their customers do not get expired medicines and that the product is in good condition. Most medicines and health care products are available with a minimum expiry date of six months. If you wish to buy medicines for a longer expiry date, for example, more than a year or two, please email us so that we can check with our suppliers. We are a reliable drugstore and do not provides expired medication. You can easily find the expiry date on your medicine packaging after receiving the medicine.",
    cat: "medicines"
  },
  {
    q: "Can I buy medicine online?",
    a: "Absolutely! You can buy medicine online at the lowest rates from the comforts of your place with a few clicks and get them delivered safely to your home. The entire process of online shopping is hassle-free and convenient. You must search for the products you need on our website, add them to your cart and then proceed with the checkout process.",
    cat: "general"
  },
  {
    q: "What is CureBasket?",
    a: "CureBasket.com is a one-stop destination for all your health care needs. It is an online pharmacy that brings thousands of medicinal products for you to choose from. You can buy medicine online with a few simple clicks.",
    cat: "general"
  },
  {
    q: "Can I order medicine from India?",
    a: "You can order medicine from a trusted online pharmacy, curebasket.com. With a legacy of over 15 years in the pharma business, the online pharmacy satisfies thousands of customers all around the globe.",
    cat: "general"
  },
  {
    q: "Is CureBasket a legitimate company?",
    a: "Yes, CureBasket is a legitimate pharmacy which offers approved medications. It offers medicinal items with adequate directions for use and warnings to consumers about the serious health risks associated with the medicines.",
    cat: "general"
  },
  {
    q: "How long does prescription medicine last?",
    a: "The expiry date is the final day that guarantees a medication's full potency and safety. The expiry date exists on most medication labels, including prescription and over-the-counter products. Our team of Pharmacists makes sure that the products must have at least 6 months expiry at the time of shipping the order.",
    cat: "medicines"
  },
  {
    q: "What is the typical shipping duration?",
    a: "Standard shipping takes 10 to 14 business days, whereas Express Shipping delivers within 5 to 9 business days. We provide global tracking numbers immediately upon warehouse dispatch.",
    cat: "shipping"
  },
  {
    q: "How do I pay securely?",
    a: "We process payments via secure, highly-encrypted bank transfer options, major credit/debit cards, and popular global electronic gateways. Your billing details are completely secure.",
    cat: "payments"
  }
]

function FAQsPage() {
  const [activeCat, setActiveCat] = useState("all")
  const [activeFaqIndex, setActiveFaqIndex] = useState(null)

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "general", name: "General Info" },
    { id: "medicines", name: "Medicines & Rx" },
    { id: "shipping", name: "Shipping" },
    { id: "payments", name: "Payments" }
  ]

  const filteredFaqs = activeCat === "all" 
    ? allFaqs 
    : allFaqs.filter(faq => faq.cat === activeCat)

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            Search for answers regarding our pharmacy sourcing, shipping, medicines quality, and payment gateways.
          </p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-12 md:py-16">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-gray-100 pb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCat(cat.id)
                setActiveFaqIndex(null)
              }}
              className={`px-5 py-2 rounded-xl text-[13.5px] md:text-[14.5px] font-bold transition-all
                ${activeCat === cat.id 
                  ? 'bg-[#f5b23e] text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQs list */}
        <div className="max-w-[800px] mx-auto flex flex-col gap-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = activeFaqIndex === index
            return (
              <div
                key={index}
                onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                className={`flex flex-col px-6 py-4 border border-gray-100 bg-white transition-all duration-300 shadow-sm rounded-2xl cursor-pointer
                  ${isOpen ? 'border-[#006D6D]/40 ring-1 ring-[#006D6D]/20 shadow-md' : 'hover:border-[#006D6D] hover:shadow-md'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] md:text-[15.5px] font-bold text-gray-800 leading-tight pr-4">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-4 h-4 text-[#006D6D] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[13px] md:text-[14.5px] leading-relaxed text-gray-600 font-medium text-justify">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default FAQsPage
