import banner1 from '../assets/banner1.png'
import banner2 from '../assets/banner2.png'
import banner3 from '../assets/banner3.png'
import banner4 from '../assets/banner4.png'
import { useState, useEffect } from 'react'

const banners = [
  {
    image: banner1,
    title: "Enjoy",
    highlight: "10% Off",
    subtitle: "on Your Next Order",
    code: "SAVE10",
    description: "This offer is not valid on orders containing products with free shipping. Maximum discount US$ 25"
  },
  {
    image: banner2,
    title: "Fast & Reliable",
    highlight: "Free Delivery",
    subtitle: "on orders above $50",
    code: "FREESHIP",
    description: "Get your medicines delivered right to your doorstep within 24 hours. T&C Apply."
  },
  {
    image: banner3,
    title: "100% Genuine",
    highlight: "Trust & Quality",
    subtitle: "Verified Medicines",
    code: "TRUSTED",
    description: "We source our products directly from manufacturers to ensure the highest quality."
  },
  {
    image: banner4,
    title: "Talk to Us",
    highlight: "Expert Care",
    subtitle: "Online Consultation",
    code: "DOC247",
    description: "Connect with our expert pharmacists and doctors anytime, anywhere."
  }
]

function BannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-[#f7f2ea] pt-4 pb-2">
      <div className="max-w-[1300px] mx-auto px-4 md:px-0">
        <div className="relative overflow-hidden bg-white group rounded-[24px] shadow-sm border border-gray-100">
          <div
            className="flex transition-transform duration-700 ease-in-out h-[350px] md:h-[480px]"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div key={index} className="min-w-full relative">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${currentBanner === index ? 'w-10 bg-primary' : 'w-2.5 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BannerCarousel
