import { useState } from 'react'
import img_trusted from '../assets/image-1.png'
import img_delivery from '../assets/image-2.png'
import img_fast from '../assets/image-3.png'

function WhyChoose() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="bg-[#fef6f6] pt-6 pb-8 md:pt-10 md:pb-12 px-4 md:px-12 border-b border-gray-50">
      <div className="max-w-[1250px] mx-auto">
        <h2 className="text-[22px] md:text-[34px] font-bold text-center text-[#004D4D] mb-0 md:mb-8 uppercase tracking-wider">
          Why Choose CureBasket?
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-12 lg:gap-20 items-start mb-6 md:mb-14">
          {/* Left: Benefit Icons */}
          <div className="w-full lg:w-[45%] flex justify-between items-start pt-0 md:pt-4 -mt-2.5 md:-mt-6">
            <div className="flex flex-col items-center text-center flex-1 px-2 group">
              <div className="flex items-end justify-center h-28 md:h-40 mb-1.5 transition-all duration-300">
                <img src={img_trusted} alt="Trusted Medicines" className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-[12px] md:text-[16px] font-bold text-[#004D4D] leading-tight">Trusted<br />Medicines</span>
            </div>
            <div className="flex flex-col items-center text-center flex-1 px-2 group">
              <div className="flex items-end justify-center h-28 md:h-40 mb-1.5 transition-all duration-300">
                <img src={img_delivery} alt="Super-fast Delivery" className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-[12px] md:text-[16px] font-bold text-[#004D4D] leading-tight">Super-fast<br />Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center flex-1 px-2 group">
              <div className="flex items-end justify-center h-28 md:h-40 mb-1.5 transition-all duration-300">
                <img src={img_fast} alt="Savings & Safety" className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-[12px] md:text-[16px] font-bold text-[#004D4D] leading-tight">Savings<br />& Safety</span>
            </div>
          </div>

          {/* Right: Text */}
          <div className="w-full lg:w-[55%] space-y-2.5 md:space-y-4">
            <p className="text-[13px] md:text-[15px] text-text-secondary leading-snug md:leading-relaxed font-medium text-justify">
              We believe in directing our skills and expertise in delivering and developing quality, in online pharmacy services which is not gained by accident. Our promise to deliver and maintain the present quality of work forms the basis of our work philosophy, a claim endorsed by online pharmacy reviews.
            </p>
            <p className="text-[13px] md:text-[15px] text-text-secondary leading-snug md:leading-relaxed font-medium text-justify">
              We believe that as we develop our work quality we will be one step closer to helping you enrich your lives with good health and happiness. We wish to see our consumers to live life filled with long life and comforts. This is CureBasket's commitment towards the community...
            </p>
            {isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1.5 md:gap-y-3 pt-3 md:pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5 md:space-y-3">
                  {['Hassle-Free Service', 'Our Community', 'Medications', 'Best Buy at Best Prices', 'Referral Programme'].map(item => (
                    <div key={item} className="flex items-center gap-2.5 group cursor-pointer w-fit">
                      <span className="text-[12px] md:text-[13px] font-bold text-gray-700 group-hover:text-primary transition-colors">{item}</span>
                      <svg className="w-2.5 h-2.5 text-[#8CB33E]" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 md:space-y-3">
                  {['Savings and Safety', 'Information', 'Health Supplements', 'Reliability'].map(item => (
                    <div key={item} className="flex items-center gap-2.5 group cursor-pointer w-fit">
                      <span className="text-[12px] md:text-[13px] font-bold text-gray-700 group-hover:text-primary transition-colors">{item}</span>
                      <svg className="w-2.5 h-2.5 text-[#8CB33E]" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-[#004D4D] text-white px-8 py-2.5 rounded-lg font-bold text-[14px] hover:bg-[#003333] transition-all duration-300 shadow-md active:scale-95"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default WhyChoose
