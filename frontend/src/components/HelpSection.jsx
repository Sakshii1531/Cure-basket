import React from 'react'

const steps = [
  {
    step: "Step 1",
    title: "Upload Prescription",
    desc: "Upload your prescription in just 30 seconds",
    icon: (
      <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    bgColor: "bg-[#E6F7F7]"
  },
  {
    step: "Step 2",
    title: "Compare Prices",
    desc: "We compare prices from trusted pharmacies",
    icon: (
      <svg className="w-8 h-8 text-[#FBB03B]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3" />
      </svg>
    ),
    bgColor: "bg-[#FFF8E7]"
  },
  {
    step: "Step 3",
    title: "Place Order",
    desc: "Choose the best price and place your order",
    icon: (
      <svg className="w-8 h-8 text-[#FBB03B]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    bgColor: "bg-[#FFF8E7]"
  },
  {
    step: "Step 4",
    title: "Fast Delivery",
    desc: "Get medicines delivered to your doorstep",
    icon: (
      <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M1 11h15l3 3v5H1v-8zM16 11l3 3M1 11V5h12v6M5 19a2 2 0 100 4 2 2 0 000-4zM16 19a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
    bgColor: "bg-[#E6F7F7]"
  }
]

const HelpSection = () => {
  return (
    <section className="bg-white pb-28 pt-0 px-4 md:px-12 overflow-hidden">
      <div className="max-w-[1250px] mx-auto">
        <h2 className="text-[22px] md:text-[34px] font-semibold text-gray-900 mb-10 tracking-tight">
          How CureBasket works?
        </h2>
        
        <div className="relative flex flex-col lg:flex-row justify-between items-stretch gap-0">
          {steps.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 bg-white rounded-[20px] border border-gray-200 p-3 md:p-6 flex items-center gap-2 md:gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative z-10">
                {/* Icon Circle */}
                <div className={`w-11 h-11 md:w-16 md:h-16 rounded-full ${item.bgColor} flex items-center justify-center shrink-0`}>
                  <div className="scale-[0.65] md:scale-100">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <span className="text-[#006D6D] font-bold text-[11px] md:text-[13px] uppercase tracking-wider mb-0 md:mb-1 leading-none">
                    {item.step}
                  </span>
                  <h3 className="text-[14px] md:text-[16px] font-bold text-gray-900 leading-tight mb-0.5 md:mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-[11px] md:text-[12px] leading-snug max-w-[180px]">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Dotted Connector (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-12 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#006D6D] shrink-0"></div>
                  <div className="flex-grow border-t-[3px] border-dotted border-[#006D6D]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#006D6D] shrink-0"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HelpSection
