import React, { useState, useEffect } from 'react'
import pharm1 from '../assets/pharm-1.png'
import pharm2 from '../assets/pharm-2.png'
import pharm3 from '../assets/pharm-3.png'
import pharm4 from '../assets/pharm-4.png'
import pharm5 from '../assets/pharm-5.png'
import pharm6 from '../assets/pharm-6.png'

const banners = [pharm1, pharm2, pharm3, pharm4, pharm5, pharm6]

const ZepboundPromo = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white pt-12 pb-0 px-4 md:px-12 mb-8">
      <div className="max-w-[1300px] mx-auto overflow-hidden rounded-[32px] shadow-lg relative group">
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="min-w-full h-[350px] md:h-[500px]">
              <img 
                src={banner} 
                alt={`Pharmacy Banner ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default ZepboundPromo
