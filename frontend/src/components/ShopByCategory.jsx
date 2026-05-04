import React from 'react'
import { useNavigate } from 'react-router-dom'
import weightLossImg from '../assets/allergy.png'
import skinCareImg from '../assets/skin-care.png'
import diabetesImg from '../assets/diabetes.png'
import med2 from '../assets/med2.png'
import med5 from '../assets/med5.png'
import acneImg from '../assets/acne.png'
import painImg from '../assets/pain-relief.png'
import cancerImg from '../assets/anti-cancer.png'
import eyeImg from '../assets/eye-care.png'
import antibioticImg from '../assets/antibiotic.png'

const treatments = [
  {
    id: 1,
    titleLine1: "Allergy",
    titleLine2: "treatment",
    slug: "allergy",
    price: "39",
    image: weightLossImg,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-gray-900",
    titleColor2: "text-[#004D4D]",
    isWeightLoss: true,
    hasLeftBar: true
  },
  {
    id: 2,
    titleLine1: "Beauty &",
    titleLine2: "Skin Care",
    slug: "skin-care",
    price: "16",
    image: skinCareImg,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-[#004D4D]",
    titleColor2: "text-gray-900",
    hasLeftBar: true
  },
  {
    id: 3,
    titleLine1: "Diabetes",
    titleLine2: "treatment",
    slug: "diabetes",
    price: "18",
    image: diabetesImg,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-[#004D4D]",
    titleColor2: "text-gray-900",
    hasLeftBar: true
  },
  {
    id: 4,
    titleLine1: "Hair Loss",
    titleLine2: "treatment",
    slug: "hair-loss",
    price: "16",
    image: med2,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-[#004D4D]",
    titleColor2: "text-gray-900",
    hasLeftBar: true
  },
  {
    id: 5,
    titleLine1: "Acne",
    titleLine2: "treatment",
    slug: "acne",
    price: "12",
    image: acneImg,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-[#004D4D]",
    titleColor2: "text-gray-900",
    hasLeftBar: true
  },
  {
    id: 6,
    titleLine1: "Pain",
    titleLine2: "Relief",
    slug: "pain",
    price: "9",
    image: painImg,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-[#004D4D]",
    titleColor2: "text-gray-900",
    hasLeftBar: true
  },
  {
    id: 7,
    titleLine1: "Anti",
    titleLine2: "Cancer",
    slug: "anti-cancer",
    price: "89",
    image: cancerImg,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-[#004D4D]",
    titleColor2: "text-gray-900",
    hasLeftBar: true
  },
  {
    id: 8,
    titleLine1: "Eye",
    titleLine2: "Care",
    slug: "eye-care",
    price: "15",
    image: eyeImg,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-[#004D4D]",
    titleColor2: "text-gray-900",
    hasLeftBar: true
  },
  {
    id: 9,
    titleLine1: "Antibiotics",
    titleLine2: "treatment",
    slug: "antibiotics",
    price: "14",
    image: antibioticImg,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-[#004D4D]",
    titleColor2: "text-gray-900",
    hasLeftBar: true
  },
  {
    id: 10,
    titleLine1: "Sexual",
    titleLine2: "Wellness",
    slug: "sexual-wellness",
    price: "22",
    image: med5,
    bg: "bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8]",
    titleColor1: "text-[#004D4D]",
    titleColor2: "text-gray-900",
    hasLeftBar: true
  }
]

const scrollTreatments = [...treatments, ...treatments]

function ShopByCategory() {
  const navigate = useNavigate()

  return (
    <section className="relative -mt-[180px] pt-44 pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] h-[200%] bg-[#fef6f6] rounded-t-[100%] translate-y-32"></div>
      
      <div className="relative z-10 w-full text-center overflow-hidden">
        <h2 className="text-[32px] md:text-[44px] font-semibold text-black leading-tight mb-2">
          Category
        </h2>
        <p className="text-black text-[16px] md:text-[18px] max-w-none mx-auto mb-12">
          Includes a wide range of genuine medicines for daily health needs. Easy ordering with fast home delivery.
        </p>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            width: fit-content;
            animation: scroll 40s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="animate-scroll gap-6 px-4">
          {scrollTreatments.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              onClick={() => navigate(`/all-products?category=${item.slug}`)}
              className={`${item.bg} rounded-[24px] p-8 relative overflow-hidden flex flex-col items-start text-left h-[220px] w-[350px] md:w-[410px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] group cursor-pointer border border-gray-100 shrink-0`}
            >
              {item.hasLeftBar && (
                <div className="absolute left-0 top-0 h-[60%] w-3 bg-[#004D4D] rounded-br-[40px] z-20"></div>
              )}

              <div className="flex flex-col z-10">
                <span className={`${item.titleColor1} text-[28px] md:text-[34px] font-semibold leading-[1.1]`}>
                  {item.titleLine1}
                </span>
                <span className={`${item.titleColor2} text-[28px] md:text-[34px] font-semibold leading-[1.1]`}>
                  {item.titleLine2}
                </span>
              </div>

              <div className="mt-2 z-10">
                <svg className="w-24 h-24 text-[#004D4D]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M25,25 Q40,80 85,80" />
                  <path d="M68,68 L85,80 L70,92" />
                </svg>
              </div>

              <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-[#FFD200] flex flex-col items-center justify-center z-20 shadow-lg border-[4px] border-white/20">
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-tight">Starting at</span>
                <div className="flex items-start">
                  <span className="text-[14px] font-bold text-gray-900 mt-1">$</span>
                  <span className="text-[34px] font-black text-gray-900 leading-none">{item.price}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-800 lowercase">per month</span>
              </div>

              <div className="absolute bottom-0 right-0 w-[65%] h-[55%] bg-[#004D4D] rounded-tl-[100%] z-0"></div>

              <div className={`absolute bottom-0 right-4 z-10 ${item.id === 1 ? 'w-[180px]' : item.id === 2 ? 'w-[190px]' : item.id === 3 ? 'w-[180px]' : item.id === 6 ? 'w-[110px]' : 'w-[180px]'} h-auto pointer-events-none`}>
                <img 
                   src={item.image} 
                   alt={item.titleLine1} 
                   className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopByCategory
