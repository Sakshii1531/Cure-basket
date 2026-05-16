import React from 'react'
import deliveryImg from '../assets/delivery_banner.png'
import healthImg from '../assets/health_banner.png'
import usePromoBanners from '../hooks/usePromoBanners'

const PromoBanners = () => {
  const delivery = usePromoBanners('expressDelivery')
  const health = usePromoBanners('healthCheckup')

  return (
    <section className="bg-white py-8 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#fff8f0] rounded-[32px] p-6 md:p-8 flex items-center relative overflow-hidden group cursor-pointer border border-transparent hover:border-[#FBB03B]/20 transition-all">
          <div className="flex-1 z-10">
            <h3 className="text-[#FBB03B] font-black text-[22px] md:text-[26px] leading-tight mb-2">
              {delivery.title1}<br/>
              <span className="text-[#006D6D]">{delivery.title2}</span>
            </h3>
            <p className="text-gray-600 text-[13px] md:text-[14px] mb-6 max-w-[180px]">
              {delivery.description}
            </p>
            <button className="bg-[#006D6D] text-white px-6 py-2.5 rounded-full font-bold text-[14px] flex items-center gap-2 shadow-sm hover:bg-[#005a5a] transition-all">
              {delivery.buttonText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
          <div className="w-1/2 flex justify-end z-10">
            <img src={deliveryImg} alt="Express Delivery" className="w-full max-w-[200px] object-contain group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-[#FBB03B] opacity-[0.05] rounded-full blur-2xl" />
        </div>

        <div className="bg-[#f0f9ff] rounded-[32px] p-6 md:p-8 flex items-center relative overflow-hidden group cursor-pointer border border-transparent hover:border-[#3B82F6]/20 transition-all">
          <div className="flex-1 z-10">
            <h3 className="text-[#006D6D] font-black text-[22px] md:text-[26px] leading-tight mb-2">
              {health.title1}<br/>
              <span className="text-[#3B82F6]">{health.title2}</span>
            </h3>
            <p className="text-gray-600 text-[13px] md:text-[14px] mb-6 max-w-[180px]">
              {health.description}
            </p>
            <button className="bg-[#3B82F6] text-white px-6 py-2.5 rounded-full font-bold text-[14px] flex items-center gap-2 shadow-sm hover:bg-[#2563eb] transition-all">
              {health.buttonText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          <div className="w-1/2 flex justify-end z-10">
            <img src={healthImg} alt="Health Checkup" className="w-full max-w-[200px] object-contain group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-[#3B82F6] opacity-[0.05] rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  )
}

export default PromoBanners
