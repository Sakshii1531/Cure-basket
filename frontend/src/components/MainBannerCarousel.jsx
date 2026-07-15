import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import promoImg from '../assets/promo_banner.png'
import deliveryImg from '../assets/delivery_banner.png'
import healthImg from '../assets/health_banner.png'
import plusImg from '../assets/membership_banner.png'

const STATIC_SLIDES = [
  {
    id: 'static-1',
    bg: '#f0fafa',
    heading1: 'Quality care,',
    heading2: 'better savings',
    heading2Color: '#FBB03B',
    sub: 'Trusted medicines. Expert care. Savings you can count on.',
    cta: 'Upload Prescription',
    ctaPath: '/upload-prescription',
    helper: 'It only takes 30 seconds!',
    image: promoImg,
    blobColor: '#006D6D',
    btnBg: '#FBB03B',
    btnColor: 'white',
    pillars: [
      { id: 1, text: 'Affordable\nprices', icon: 'price', color: '#FBB03B' },
      { id: 2, text: 'Secure &\ntrusted', icon: 'shield', color: '#006D6D' },
      { id: 3, text: 'Fast & discreet\ndelivery', icon: 'truck', color: '#FBB03B' },
    ],
  },
  {
    id: 'static-2',
    bg: '#fff8f0',
    heading1: 'Express',
    heading2: 'Delivery in 15 Mins',
    heading2Color: '#006D6D',
    sub: 'Running out of essentials? Get them delivered to your doorstep in the blink of an eye.',
    cta: 'Order Now',
    ctaPath: '/',
    helper: 'No minimum order value!',
    image: deliveryImg,
    blobColor: '#FBB03B',
    btnBg: '#006D6D',
    btnColor: 'white',
    pillars: [
      { id: 1, text: '15 Minute\nPromise', icon: 'clock', color: '#FBB03B' },
      { id: 2, text: 'Lightning\nFast', icon: 'flash', color: '#006D6D' },
      { id: 3, text: 'Safe &\nSecure', icon: 'shield', color: '#FBB03B' },
    ],
  },
  {
    id: 'static-3',
    bg: '#f0f9ff',
    heading1: 'Full Body',
    heading2: 'Health Checkups',
    heading2Color: '#3B82F6',
    sub: 'Home sample collection. NABL certified labs. Accurate results in 24 hours.',
    cta: 'Book a Test',
    ctaPath: '/',
    helper: 'Starting from just $499!',
    image: healthImg,
    blobColor: '#3B82F6',
    btnBg: '#3B82F6',
    btnColor: 'white',
    pillars: [
      { id: 1, text: 'Home Sample\nCollection', icon: 'home', color: '#3B82F6' },
      { id: 2, text: 'Certified\nLabs', icon: 'shield', color: '#006D6D' },
      { id: 3, text: '24 Hour\nResults', icon: 'clock', color: '#3B82F6' },
    ],
  },
  {
    id: 'static-4',
    bg: '#f8f1ff',
    heading1: 'Join',
    heading2: 'CureBasket Plus',
    heading2Color: '#8B5CF6',
    sub: 'Save up to 25% on every order. Free delivery. Priority support. Premium health perks.',
    cta: 'Start Free Trial',
    ctaPath: '/',
    helper: 'Only $199/month after!',
    image: plusImg,
    blobColor: '#8B5CF6',
    btnBg: '#8B5CF6',
    btnColor: 'white',
    pillars: [
      { id: 1, text: 'Extra 25%\nOff', icon: 'percent', color: '#8B5CF6' },
      { id: 2, text: 'Free\nDelivery', icon: 'truck', color: '#006D6D' },
      { id: 3, text: 'Priority\nSupport', icon: 'heart', color: '#8B5CF6' },
    ],
  },
]

const IconRenderer = ({ type, color }) => {
  const p = { className: 'w-8 h-8', style: { color }, fill: 'none', stroke: 'currentColor', strokeWidth: '2', viewBox: '0 0 24 24' }
  switch (type) {
    case 'price': return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.159 3.659A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
    case 'shield': return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 5.714z" /></svg>
    case 'truck': return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-4.446-3.605-8.159-7.737-8.159H5.25m11.947 4.909c1.796 0 3.251 1.455 3.251 3.251m-12.33 3.398h13.848" /></svg>
    case 'clock': return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    case 'flash': return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
    case 'home': return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
    case 'percent': return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-9.75 9a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" /></svg>
    case 'heart': return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
    default: return null
  }
}

function MainBannerCarousel() {
  const navigate = useNavigate()
  const [slides, setSlides] = useState(STATIC_SLIDES)
  const [useApiSlides, setUseApiSlides] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    api.get('/banners?position=main&isActive=true')
      .then(res => {
        const banners = (res.data.data || []).filter(b => b.image)
        if (banners.length > 0) {
          setSlides(banners)
          setUseApiSlides(true)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goTo = (index) => setCurrentSlide(index)
  const goPrev = () => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))
  const goNext = () => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))

  return (
    <section className="bg-white py-2 md:py-6 px-2 md:px-12">
      <div className="max-w-312.5 mx-auto relative group overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {useApiSlides ? (
            /* API banner slides — full-bleed image with title overlay */
            slides.map((banner) => (
              <div
                key={banner._id}
                className="min-w-full rounded-3xl overflow-hidden relative h-40 sm:h-56 md:h-auto md:min-h-[350px] cursor-pointer group"
                onClick={() => {
                  if (!banner.link) return;
                  const link = banner.link.trim();
                  // Ignore data URIs or blob URLs (accidental image URLs in the link field)
                  if (link.startsWith('data:') || link.startsWith('blob:')) return;
                  // External URL → open in new tab
                  if (link.startsWith('http://') || link.startsWith('https://')) {
                    window.open(link, '_blank', 'noopener,noreferrer');
                  } else {
                    // Internal path → React Router navigate
                    navigate(link);
                  }
                }}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-10 max-w-[70%]">
                  <h2 className="text-primary text-[16px] sm:text-[20px] md:text-[36px] font-bold leading-tight">{banner.title}</h2>
                  {banner.link && (
                    <span className="inline-flex items-center gap-1.5 mt-2 md:mt-3 px-3 py-1.5 md:px-5 md:py-2.5 bg-white/90 text-gray-900 rounded-lg md:rounded-xl font-bold text-xs md:text-sm">
                      Shop Now
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            /* Static fallback slides */
            slides.map((slide) => (
              <div
                key={slide.id}
                className="min-w-full rounded-3xl p-4 md:p-6 lg:p-8 flex flex-row md:flex-row items-center relative overflow-hidden min-h-0 group"
                style={{ backgroundColor: slide.bg }}
              >
                {/* Left: Text content */}
                <div className="flex-1 z-10 text-left">
                  <h1 className="text-[18px] sm:text-[22px] md:text-[40px] font-bold leading-tight">
                    <span className="text-primary">{slide.heading1}</span><br />
                    <span style={{ color: slide.heading2Color }}>{slide.heading2}</span>
                  </h1>
                  <p className="hidden sm:block text-[12px] md:text-[16px] text-gray-700 mt-2 md:mt-4 max-w-100">
                    {slide.sub}
                  </p>
                  <div className="mt-3 md:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-6">
                    <button
                      onClick={() => navigate(slide.ctaPath)}
                      className="px-4 sm:px-8 md:px-10 py-2 md:py-3.5 rounded-lg md:rounded-xl font-bold text-[12px] md:text-[16px] flex items-center justify-center gap-1.5 transition-all active:scale-95 whitespace-nowrap"
                      style={{ backgroundColor: slide.btnBg, color: slide.btnColor }}
                    >
                      {slide.cta}
                      <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                    <span className="hidden sm:inline text-primary font-semibold text-[11px] md:text-[14px] leading-tight">
                      {slide.helper}
                    </span>
                  </div>
                </div>

                {/* Middle: Pillars — desktop only */}
                <div className="hidden lg:flex flex-1 justify-center gap-8 z-10 px-4">
                  {slide.pillars.map((pillar, index) => (
                    <React.Fragment key={pillar.id}>
                      <div className="flex flex-col items-center text-center min-w-25">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3">
                          <IconRenderer type={pillar.icon} color={pillar.color} />
                        </div>
                        <span className="text-[13px] font-bold text-gray-800 leading-tight whitespace-pre-line">{pillar.text}</span>
                      </div>
                      {index < slide.pillars.length - 1 && <div className="h-16 w-px bg-gray-300 self-center" />}
                    </React.Fragment>
                  ))}
                </div>

                {/* Right: Image — visible on mobile too */}
                <div className="flex-shrink-0 flex justify-end relative z-10 ml-2 md:ml-0 md:flex-1">
                  <div className="relative">
                    <img src={slide.image} alt="Promotion" className="w-28 sm:w-40 md:w-60 lg:w-96 object-contain transition-transform duration-700 ease-in-out" />
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 md:w-40 lg:w-52 h-20 md:h-40 lg:h-52 opacity-[0.05] rounded-full blur-3xl -z-10"
                      style={{ backgroundColor: slide.blobColor }}
                    />
                  </div>
                </div>

                <div
                  className="absolute -right-10 md:-right-20 -top-10 md:-top-20 w-50 md:w-100 h-50 md:h-100 opacity-[0.03] rounded-full pointer-events-none"
                  style={{ backgroundColor: slide.blobColor }}
                />
              </div>
            ))
          )}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ease-out ${currentSlide === index ? 'w-6 md:w-8 bg-primary' : 'w-2 md:w-2.5 bg-white/60 hover:bg-white'}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hidden md:flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hidden md:flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>
    </section>
  )
}

export default MainBannerCarousel
