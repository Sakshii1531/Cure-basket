import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

// Local images as fallback keyed by lowercase category name
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

const IMAGE_MAP = {
  'allergy': weightLossImg,
  'skin care': skinCareImg,
  'beauty & skin care': skinCareImg,
  'beauty': skinCareImg,
  'diabetes': diabetesImg,
  'hair loss': med2,
  'acne': acneImg,
  'pain relief': painImg,
  'pain': painImg,
  'anti cancer': cancerImg,
  'anti-cancer': cancerImg,
  'cancer': cancerImg,
  'eye care': eyeImg,
  'antibiotics': antibioticImg,
  'antibiotic': antibioticImg,
  'sexual wellness': med5,
}

function getCategoryImage(name) {
  return IMAGE_MAP[name.toLowerCase()] || weightLossImg
}

function splitTitle(name) {
  const words = name.trim().split(' ')
  if (words.length <= 1) return [name, '']
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function ShopByCategory() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get('/categories?limit=500')
      .then(res => setCategories(res.data.data || []))
      .catch(() => {})
  }, [])

  // Double for infinite scroll animation
  const scrollItems = categories.length > 0 ? [...categories, ...categories] : []

  if (categories.length === 0) return null

  return (
    <section className="relative -mt-[140px] md:-mt-[180px] pt-32 md:pt-44 pb-10 md:pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] h-[200%] bg-[#fef6f6] rounded-t-[100%] translate-y-24 md:translate-y-32" />

      <div className="relative z-10 w-full text-center overflow-hidden">
        <h2 className="text-[28px] md:text-[44px] font-semibold text-[#004d4d] leading-tight mb-2 px-4">
          Category
        </h2>
        <p className="text-gray-600 text-[14px] md:text-[18px] max-w-2xl mx-auto mb-8 md:mb-12 px-4 leading-relaxed">
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
          @media (max-width: 768px) {
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
          }
        `}} />

        <div className="animate-scroll gap-4 md:gap-6 px-4">
          {scrollItems.map((cat, index) => {
            const [line1, line2] = splitTitle(cat.name)
            const isUploaded = cat.image && cat.image !== 'no-photo.jpg' && cat.image !== '__uploading__'
            const img = isUploaded ? cat.image : getCategoryImage(cat.name)
            return (
              <div
                key={`${cat._id}-${index}`}
                onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                className="bg-gradient-to-r from-[#e0f2fe] via-[#fdf2f8] to-[#fdf2f8] rounded-[20px] md:rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col items-start text-left h-[180px] md:h-[220px] w-[280px] md:w-[410px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] group cursor-pointer border border-gray-100 shrink-0"
              >
                <div className="absolute left-0 top-0 h-[60%] w-2 md:w-3 bg-primary rounded-br-[40px] z-20" />

                <div className="flex flex-col z-10">
                  <span className="text-primary text-[22px] md:text-[34px] font-semibold leading-[1.1]">{line1}</span>
                  {line2 && (
                    <span className="text-gray-900 text-[22px] md:text-[34px] font-semibold leading-[1.1]">{line2}</span>
                  )}
                </div>

                <div className="mt-2 z-10">
                  <svg className="w-16 h-16 md:w-24 md:h-24 text-primary" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M25,25 Q40,80 85,80" />
                    <path d="M68,68 L85,80 L70,92" />
                  </svg>
                </div>

                <div className="absolute top-6 right-6 md:top-8 md:right-8 w-18 h-18 md:w-24 md:h-24 rounded-full bg-accent flex flex-col items-center justify-center z-20 shadow-lg border-[3px] md:border-4 border-white/20">
                  <span className="text-[9px] md:text-[11px] font-black text-gray-900 uppercase tracking-tight">Explore</span>
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>

                {isUploaded ? (
                  <div className="absolute bottom-0 right-0 w-[65%] h-[55%] bg-primary rounded-tl-[100%] z-0 overflow-hidden flex items-end justify-end">
                    <img src={img} alt={cat.name} className="w-full h-full object-cover pointer-events-none" loading="lazy" />
                  </div>
                ) : (
                  <>
                    <div className="absolute bottom-0 right-0 w-[65%] h-[55%] bg-primary rounded-tl-[100%] z-0" />
                    <div className="absolute bottom-0 right-2 md:right-4 z-10 w-[130px] md:w-[180px] h-auto pointer-events-none">
                      <img src={img} alt={cat.name} className="w-full h-full object-contain drop-shadow-xl" loading="lazy" />
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ShopByCategory
