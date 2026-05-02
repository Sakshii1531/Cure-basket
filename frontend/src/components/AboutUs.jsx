import { useState } from 'react'

function AboutUs() {
  const [isExpanded, setIsExpanded] = useState(false)

  const benefits = [
    "Unparallel technology to source medicines and healthcare products",
    "Wide range of brand and generic options",
    "Product description to understand the benefits and consequences of medicine",
    "User-friendly content on health, lifestyle, and fitness",
    "Free shipping options with doorstep delivery",
    "Great deals, discounts, and coupons on medicines to save money",
    "Outstanding client support",
    "Fair and transparent service policies to maintain a long-term relationship",
    "Easy return, refund, and cancellation",
    "Secure and fastest payment gateways"
  ]

  return (
    <section className="bg-[#fef6f6] pb-12 md:pb-20 pt-0 px-4 md:px-12 overflow-hidden">
      <div className="max-w-[1250px] mx-auto">
        <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.15em] mb-4 text-[#004D4D] text-center">
          About Us
        </h2>

        <div className="space-y-3">
          <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
            <span className="font-bold text-[#004D4D]">CureBasket.com</span> is a leading digital platform committed to serving the healthcare needs of people from across the globe. We feel proud when we look back years ago from now to the day when we invented the idea of having an online pharmacy store from where customers can buy medicine online. Since then, we are providing online pharmacy services in the USA and other countries as well. It is close to 2 decades now, and we are happily serving humankind.
          </p>
          <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
            Being an Indian pharmacy, we believe that all individuals deserve a healthy life at affordable prices. CureBasket had set new standards in the market to <span className="font-bold text-[#004D4D]">buy medicine online</span> years ago when people were hardly aware of online shopping terms. We are a one-stop destination for sourcing pharmaceutical, healthcare, and herbal products from the comfort of your home with complete privacy and payment security options.
          </p>

          {isExpanded && (
            <div className="pt-4 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-gray-200 mt-4">
              <div className="space-y-2">
                <h3 className="text-[18px] font-bold text-[#004D4D] uppercase tracking-wide">How does CureBasket works?</h3>
                <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
                  CureBasket is one of those online chemists whose endeavor is to simplify your search for generic medicines. On our website, you can either search by Brand-Name or by Generic Name to source the medicine you intend to buy.
                </p>
                <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
                  We expect our site visitors to be at least 21 years of age and we encourage our customers to keep themselves informed about their respective country's laws related to online pharmacies and import of generic drugs for personal use.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-[18px] font-bold text-[#004D4D] uppercase tracking-wide">The Additional Benefits CureBasket Offers</h3>
                <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
                  The online medicine purchase from CureBasket ensures you to get the maximum benefits as best as possible.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 pt-1">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#004D4D]/10 flex items-center justify-center text-[11px] font-bold text-[#004D4D]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[13px] md:text-[14px] font-medium text-gray-600 leading-tight">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-[#004D4D] text-white px-10 py-3 rounded-xl font-bold text-[14px] hover:bg-[#003333] transition-all duration-300 shadow-lg active:scale-95"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
