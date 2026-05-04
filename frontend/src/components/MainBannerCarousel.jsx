import React, { useState, useEffect } from 'react'
import promoImg from '../assets/promo_banner.png'
import deliveryImg from '../assets/delivery_banner.png'
import healthImg from '../assets/health_banner.png'
import plusImg from '../assets/membership_banner.png'

const slides = [
  {
    id: 1,
    bg: '#f0fafa',
    heading1: 'Quality care,',
    heading2: 'better savings',
    heading2Color: '#FBB03B',
    sub: 'Trusted medicines. Expert care. Savings you can count on.',
    cta: 'Upload Prescription',
    helper: 'It only takes 30 seconds!',
    image: promoImg,
    blobColor: '#006D6D',
    btnBg: '#FBB03B',
    btnColor: 'white',
    pillars: [
      { id: 1, text: 'Affordable\nprices', icon: 'price', color: '#FBB03B' },
      { id: 2, text: 'Secure &\ntrusted', icon: 'shield', color: '#006D6D' },
      { id: 3, text: 'Fast & discreet\ndelivery', icon: 'truck', color: '#FBB03B' }
    ]
  },
  {
    id: 2,
    bg: '#fff8f0',
    heading1: 'Express',
    heading2: 'Delivery in 15 Mins',
    heading2Color: '#006D6D',
    sub: 'Running out of essentials? Get them delivered to your doorstep in the blink of an eye.',
    cta: 'Order Now',
    helper: 'No minimum order value!',
    image: deliveryImg,
    blobColor: '#FBB03B',
    btnBg: '#006D6D',
    btnColor: 'white',
    pillars: [
      { id: 1, text: '15 Minute\nPromise', icon: 'clock', color: '#FBB03B' },
      { id: 2, text: 'Lightning\nFast', icon: 'flash', color: '#006D6D' },
      { id: 3, text: 'Safe &\nSecure', icon: 'shield', color: '#FBB03B' }
    ]
  },
  {
    id: 3,
    bg: '#f0f9ff',
    heading1: 'Full Body',
    heading2: 'Health Checkups',
    heading2Color: '#3B82F6',
    sub: 'Home sample collection. NABL certified labs. Accurate results in 24 hours.',
    cta: 'Book a Test',
    helper: 'Starting from just ₹499!',
    image: healthImg,
    blobColor: '#3B82F6',
    btnBg: '#3B82F6',
    btnColor: 'white',
    pillars: [
      { id: 1, text: 'Home Sample\nCollection', icon: 'home', color: '#3B82F6' },
      { id: 2, text: 'Certified\nLabs', icon: 'shield', color: '#006D6D' },
      { id: 3, text: '24 Hour\nResults', icon: 'clock', color: '#3B82F6' }
    ]
  },
  {
    id: 4,
    bg: '#f8f1ff',
    heading1: 'Join',
    heading2: 'CureBasket Plus',
    heading2Color: '#8B5CF6',
    sub: 'Save up to 25% on every order. Free delivery. Priority support. Premium health perks.',
    cta: 'Start Free Trial',
    helper: 'Only ₹199/month after!',
    image: plusImg,
    blobColor: '#8B5CF6',
    btnBg: '#8B5CF6',
    btnColor: 'white',
    pillars: [
      { id: 1, text: 'Extra 25%\nOff', icon: 'percent', color: '#8B5CF6' },
      { id: 2, text: 'Free\nDelivery', icon: 'truck', color: '#006D6D' },
      { id: 3, text: 'Priority\nSupport', icon: 'heart', color: '#8B5CF6' }
    ]
  }
]

const IconRenderer = ({ type, color }) => {
  const iconProps = { className: `w-8 h-8`, style: { color }, fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24" };
  switch (type) {
    case 'price':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.159 3.659A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 5.714z" />
        </svg>
      )
    case 'truck':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-4.446-3.605-8.159-7.737-8.159H5.25m11.947 4.909c1.796 0 3.251 1.455 3.251 3.251m-12.33 3.398h13.848" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'flash':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        </svg>
      )
    case 'home':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    case 'percent':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75m0 3v.75m0 3v.75m0 3v.75m0 3V18m15 0h1.5m-1.5-3h1.5m-1.5-3h1.5m-1.5-3h1.5m-1.5-3H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5h.75m11.25 0h.75m11.25 0h.75m-13.5 0h.75m-13.5 0h.75" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )
    default:
      return null
  }
}

function MainBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-white py-2 md:py-6 px-2 md:px-12">
      <div className="max-w-[1250px] mx-auto relative group overflow-hidden">
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id}
              className="min-w-full rounded-[24px] p-5 md:p-10 flex flex-col md:flex-row items-center relative overflow-hidden min-h-[260px] md:min-h-0"
              style={{ backgroundColor: slide.bg }}
            >
              {/* Left Section: Text and CTA */}
              <div className="flex-1 z-10 text-center md:text-left">
                <h1 className="text-[24px] md:text-[40px] font-bold leading-tight">
                  <span className="text-[#006D6D]">{slide.heading1}</span><br />
                  <span style={{ color: slide.heading2Color }}>{slide.heading2}</span>
                </h1>
                <p className="text-[13px] md:text-[16px] text-gray-700 mt-3 md:mt-4 max-w-[400px] mx-auto md:mx-0">
                  {slide.sub}
                </p>
                
                <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <button 
                    className="w-full md:w-auto px-8 md:px-10 py-3 md:py-3.5 rounded-[12px] font-bold text-[14px] md:text-[16px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap"
                    style={{ backgroundColor: slide.btnBg, color: slide.btnColor }}
                  >
                    {slide.cta}
                    <svg className="w-4 h-4 md:w-5 md:h-5 ml-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                  <span className="text-[#006D6D] font-semibold text-[12px] md:text-[14px] leading-tight">
                    {slide.helper.split('!')[0]}!<br className="hidden md:block" />
                    {slide.helper.split('!')[1] && <span className="opacity-80 font-normal">{slide.helper.split('!')[1]}</span>}
                  </span>
                </div>
              </div>

              {/* Middle Section: Trust Pillars (Hidden on mobile, show on LG) */}
              <div className="hidden lg:flex flex-1 justify-center gap-8 z-10 px-4">
                {slide.pillars.map((pillar, index) => (
                  <React.Fragment key={pillar.id}>
                    <div className="flex flex-col items-center text-center min-w-[100px]">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
                        <IconRenderer type={pillar.icon} color={pillar.color} />
                      </div>
                      <span className="text-[13px] font-bold text-gray-800 leading-tight whitespace-pre-line">{pillar.text}</span>
                    </div>
                    {index < slide.pillars.length - 1 && <div className="h-16 w-[1px] bg-gray-300 self-center" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Right Section: Graphic (Hidden on mobile/tablet, show on MD) */}
              <div className="flex-1 hidden md:flex justify-end relative z-10">
                <div className="relative">
                  <img src={slide.image} alt="Promotion" className="w-[300px] lg:w-[480px] object-contain" />
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 lg:w-64 h-48 lg:h-64 opacity-[0.05] rounded-full blur-3xl -z-10"
                    style={{ backgroundColor: slide.blobColor }}
                  />
                </div>
              </div>

              {/* Background Decorative Blob */}
              <div 
                className="absolute right-[-40px] md:right-[-80px] top-[-40px] md:top-[-80px] w-[200px] md:w-[400px] h-[200px] md:h-[400px] opacity-[0.03] rounded-full pointer-events-none" 
                style={{ backgroundColor: slide.blobColor }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm ${currentSlide === index ? 'w-6 md:w-8 bg-[#006D6D]' : 'w-2 md:w-2.5 bg-white/60 hover:bg-white'}`}
            />
          ))}
        </div>

        {/* Arrows (Hidden on mobile) */}
        <button 
          onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hidden md:flex items-center justify-center text-[#006D6D] opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <button 
          onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hidden md:flex items-center justify-center text-[#006D6D] opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>
    </section>
  )
}

export default MainBannerCarousel
