import { useState } from 'react'
import img_faq from '../assets/medicine-heart.png'

const faqs = [
  {
    q: "How to check the expiry date of medicine online?",
    a: "CureBasket has a team of pharmacists who ensure their customers do not get expired medicines and that the product is in good condition. Most medicines and health care products are available with a minimum expiry date of six months. If you wish to buy medicines for a longer expiry date, for example, more than a year or two, please email us so that we can check with our suppliers. We are a reliable drugstore and do not provides expired medication. You can easily find the expiry date on your medicine packaging after receiving the medicine."
  },
  {
    q: "Can I buy medicine online?",
    a: "Absolutely! You can buy medicine online at the lowest rates from the comforts of your place with a few clicks and get them delivered safely to your home. The entire process of online shopping is hassle-free and convenient. You must search for the products you need on our website, add them to your cart and then proceed with the checkout process."
  },
  {
    q: "What is CureBasket?",
    a: "CureBasket.com is a one-stop destination for all your health care needs. It is an online pharmacy that brings thousands of medicinal products for you to choose from. You can buy medicine online with a few simple clicks."
  },
  {
    q: "Can I order medicine from India?",
    a: "You can order medicine from a trusted online pharmacy, curebasket.com. With a legacy of over 15 years in the pharma business, the online pharmacy satisfies thousands of customers all around the globe."
  },
  {
    q: "Is CureBasket a legitimate company?",
    a: "Yes, CureBasket is a legitimate pharmacy which offers approved medications. It offers medicinal items with adequate directions for use and warnings to consumers about the serious health risks associated with the medicines."
  },
  {
    q: "How long does prescription medicine last?",
    a: "The expiry date is the final day that guarantees a medication's full potency and safety. The expiry date exists on most medication labels, including prescription and over-the-counter products. Our team of Pharmacists makes sure that the products must have at least 6 months expiry at the time of shipping the order."
  }
]

function FAQItem({ faq, index, activeFaqIndex, setActiveFaqIndex }) {
  const isOpen = activeFaqIndex === index

  return (
    <div className="w-full">
      <div
        onClick={() => setActiveFaqIndex(isOpen ? null : index)}
        className={`flex flex-col px-8 py-3.5 border border-[#004D4D]/20 bg-white transition-all duration-300 shadow-sm rounded-[24px]
          ${isOpen ? 'border-[#004D4D]/40' : 'hover:border-[#004D4D] hover:shadow-md cursor-pointer'}
        `}
      >
        <div className="flex items-center justify-between">
          <span className="text-[13px] md:text-[14px] font-bold text-gray-700 leading-tight">{faq.q}</span>
          <svg
            className={`w-4 h-4 text-[#004D4D] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-[12px] md:text-[13px] leading-relaxed text-gray-600 text-justify font-medium">
              {faq.a.split(/(CureBasket(?:\.com)?)/g).map((part, i) =>
                part.toLowerCase().includes('curebasket') ? (
                  <span key={i} className="font-bold text-[#004D4D]">{part}</span>
                ) : part
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function FAQs() {
  const [activeFaqIndex, setActiveFaqIndex] = useState(null)

  return (
    <section className="bg-[#fef6f6] pb-12 md:pb-16 pt-0 px-4 md:px-12 overflow-hidden">
      <div className="max-w-[1250px] mx-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 px-8 md:px-12 lg:px-16 py-8 md:py-10">
        <h2 className="text-[28px] md:text-[36px] font-bold text-center text-[#004D4D] uppercase tracking-wider mb-6">
          FAQs
        </h2>
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8">
          <div className="w-full lg:w-[45%] flex flex-col gap-y-5">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                activeFaqIndex={activeFaqIndex}
                setActiveFaqIndex={setActiveFaqIndex}
              />
            ))}
          </div>
          <div className="w-full lg:w-[55%] flex justify-center">
            <img src={img_faq} alt="FAQ Help" className="relative w-full max-w-[450px] h-auto object-contain drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQs
