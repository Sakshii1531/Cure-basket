import React from 'react'
import med3 from '../assets/med3.png'
import med4 from '../assets/med4.png'

import weightLossImg from '../assets/med1.png'

import diabetes1 from '../assets/diabetes-1.png'
import diabetes2 from '../assets/diabetes-2.png'

import card3_1 from '../assets/3-card1.png'
import card3_2 from '../assets/3-card2.png'

import hairLossImg from '../assets/med2.png'

function NewAndNow({ title = "New and now", onProductClick }) {
  return (
    <div className="bg-white pt-2 pb-1 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-2 mx-auto px-2">
          <h2 className="text-[28px] md:text-[34px] font-semibold text-gray-900 tracking-tight">
            {title === "New and best" ? (
              <>
                <span className="text-[#006D6D]">New</span> and <span className="text-[#f39c12]">best</span>
              </>
            ) : title}
          </h2>
        </div>

        {/* Cards Scroll Container */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-2 scroll-smooth">
          
          {/* Card 1: Weight Loss Treatment Banner */}
          <div 
            onClick={() => onProductClick?.({ name: "Weight Loss Treatment", category: "Weight Loss", image: weightLossImg })}
            className="min-w-[350px] md:min-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col h-full transition-shadow cursor-pointer hover:shadow-lg"
          >
            <div className="bg-[#006D6D] text-white py-4 px-4 text-center font-bold text-[14px] tracking-[0.15em] uppercase">
              Weight Loss Treatment
            </div>
            <div className="flex-grow p-4 bg-gradient-to-tr from-[#d1e9f5] to-[#f4cfdf] relative flex flex-col min-h-[180px]">
              <h3 className="text-[18px] md:text-[20px] font-bold leading-[1.2] mb-1 text-gray-900 max-w-[50%]">
                Need a <span className="text-[#006D6D]">weight loss treatment</span> plan?
              </h3>
              <p className="text-black text-[12px] leading-relaxed mb-3 max-w-[50%]">
                Get expert guidance and personalized care to help you achieve your weight goals safely and effectively.
              </p>
              
              {/* Product Images */}
              <img 
                src={weightLossImg} 
                className="absolute bottom-0 -right-6 w-[70%] h-auto object-contain" 
                alt="Medication" 
              />
            </div>
          </div>

          {/* Card 2: Diabetes Management */}
          <div className="min-w-[350px] md:min-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col h-full transition-shadow">
            <div className="bg-[#121212] text-white py-4 px-4 text-center font-bold text-[14px] tracking-[0.15em] uppercase">
              Diabetes Management
            </div>
            <div className="p-4 flex flex-col gap-2 h-full justify-start min-h-[180px]">
              <div 
                onClick={() => onProductClick?.({ name: "Generic Glucophage", category: "Diabetes", image: diabetes1 })}
                className="flex items-center gap-4 py-0 border-b-[3px] border-dotted border-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                   <img src={diabetes1} className="w-full h-full object-contain" alt="Metformin" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Insulin-Sensitizing</h4>
                  <p className="text-[12px] text-gray-500 font-bold">Generic Glucophage</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="font-black text-[28px] text-gray-900 flex items-baseline gap-1 leading-none">
                    $12 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                    <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => onProductClick?.({ name: "Brand Medication (Diabetes)", category: "Diabetes", image: diabetes2 })}
                className="flex items-center gap-4 py-0 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                   <img src={diabetes2} className="w-full h-full object-contain" alt="Januvia" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-[18px] text-gray-900 tracking-tight">SGLT2 Inhibitor</h4>
                  <p className="text-[12px] text-gray-500 font-bold">Brand Medication</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="font-black text-[28px] text-gray-900 flex items-baseline gap-1 leading-none">
                    $89 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                    <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: ED Treatment */}
          <div className="min-w-[350px] md:min-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col h-full transition-shadow">
            <div className="bg-[#006D6D] text-white py-4 px-4 text-center font-bold text-[14px] tracking-[0.15em] uppercase">
              Erectile Dysfunction Treatment
            </div>
            <div className="p-4 flex flex-col gap-2 h-full justify-start min-h-[180px]">
              {/* Product 1 */}
              <div 
                onClick={() => onProductClick?.({ name: "Sildenafil (Generic Viagra)", category: "ED Treatment", image: card3_1 })}
                className="flex items-center gap-4 py-0 border-b-[3px] border-dotted border-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                   <img src={card3_1} className="w-full h-full object-contain" alt="Sildenafil" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Sildenafil</h4>
                  <p className="text-[12px] text-gray-500 font-bold">Generic Viagra</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="font-black text-[28px] text-gray-900 flex items-baseline gap-1 leading-none">
                    $18 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                    <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                  </div>
                </div>
              </div>
              {/* Product 2 */}
              <div 
                onClick={() => onProductClick?.({ name: "Tadalafil (Generic Cialis)", category: "ED Treatment", image: card3_2 })}
                className="flex items-center gap-4 py-0 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                   <img src={card3_2} className="w-full h-full object-contain" alt="Tadalafil" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Tadalafil</h4>
                  <p className="text-[12px] text-gray-500 font-bold">Generic Cialis</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="font-black text-[28px] text-gray-900 flex items-baseline gap-1 leading-none">
                    $21 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                    <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Hair Loss Treatment Banner */}
          <div 
            onClick={() => onProductClick?.({ name: "Hair Loss Treatment", category: "Hair Loss", image: hairLossImg })}
            className="min-w-[350px] md:min-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col h-full transition-shadow cursor-pointer hover:shadow-lg"
          >
            <div className="bg-[#006D6D] text-white py-4 px-4 text-center font-bold text-[14px] tracking-[0.15em] uppercase">
              Hair Loss Treatment
            </div>
            <div className="flex-grow p-4 bg-gradient-to-tr from-[#fff2cc] via-[#f2fcfc] to-[#f9e5ef] relative flex flex-col min-h-[180px]">
              <h3 className="text-[18px] md:text-[20px] font-bold leading-[1.2] mb-1 text-gray-900 max-w-[50%]">
                Struggling with <span className="text-[#006D6D]">hair loss?</span>
              </h3>
              <p className="text-black text-[12px] leading-relaxed mb-3 max-w-[50%]">
                Regain your confidence with treatments designed to strengthen, restore, and protect your hair.
              </p>
              
              {/* Product Images */}
              <img 
                src={hairLossImg} 
                className="absolute bottom-4 right-0 w-[50%] h-auto object-contain" 
                alt="Hair Loss Medication" 
              />
            </div>
          </div>


          {/* Card 5: Anxiety & Depression */}
          <div className="min-w-[350px] md:min-w-[410px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col h-full transition-shadow">
            <div className="bg-[#006D6D] text-white py-4 px-4 text-center font-bold text-[14px] tracking-[0.15em] uppercase">
              Anxiety & Depression
            </div>
            <div className="p-4 flex flex-col gap-2 h-full justify-start min-h-[180px]">
              <div 
                onClick={() => onProductClick?.({ name: "Sertraline (Generic Zoloft)", category: "Mental Health", image: med3 })}
                className="flex items-center gap-4 py-0 border-b border-dotted border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                   <img src={med3} className="w-full h-full object-contain brightness-110" alt="Sertraline" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Sertraline</h4>
                  <p className="text-[12px] text-gray-500 font-bold">Generic Zoloft</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="font-black text-[28px] text-gray-900 flex items-baseline gap-1 leading-none">
                    $15 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                    <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => onProductClick?.({ name: "Fluoxetine (Generic Prozac)", category: "Mental Health", image: med4 })}
                className="flex items-center gap-4 py-0 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                   <img src={med4} className="w-full h-full object-contain hue-rotate-90" alt="Fluoxetine" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-[18px] text-gray-900 tracking-tight">Fluoxetine</h4>
                  <p className="text-[12px] text-gray-500 font-bold">Generic Prozac</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="font-black text-[28px] text-gray-900 flex items-baseline gap-1 leading-none">
                    $15 <span className="text-[13px] text-gray-600 font-black">/ mo.</span>
                    <span className="text-gray-300 font-normal text-[24px] ml-1">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewAndNow
