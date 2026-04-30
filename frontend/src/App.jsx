import { useState, useEffect } from 'react'

import curebasketLogo from './assets/logo1.png'
import goli1 from './assets/card-3.1.png'
import goli2 from './assets/card-3.2.png'
import joinImage from './assets/join-image.png'
import card1 from './assets/card-1.png'
import card2_1 from './assets/card-2.1.png'
import card2_2 from './assets/card-2.2.png'
import card2_3 from './assets/card-2.3.png'
import section1 from './assets/section-1.png'
import section2 from './assets/section-2.png'
import section3 from './assets/section-3.png'
import section4 from './assets/section-4.png'
import banner1 from './assets/banner1.png'
import banner2 from './assets/banner2.png'
import banner3 from './assets/banner3.png'
import banner4 from './assets/banner4.png'
import med1 from './assets/med1.png'
import med2 from './assets/med2.png'
import med3 from './assets/med3.png'
import med4 from './assets/med4.png'
import med5 from './assets/med5.png'
import cat_allergy from './assets/allergy.png'
import cat_skin from './assets/skin-care.png'
import cat_acne from './assets/acne.png'
import cat_diabetes from './assets/diabetes.png'
import cat_antibiotics from './assets/antibiotic.png'
import cat_pain from './assets/pain-relief.png'
import cat_cancer from './assets/anti-cancer.png'
import cat_eye from './assets/eye-care.png'
import img_trusted from './assets/trusted.png'
import img_delivery from './assets/delivery.png'
import img_fast from './assets/fast.png'
import img_faq from './assets/medicine-heart.png'
import medico from './assets/medico.png'




function App() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [isPrescriptionMenuOpen, setIsPrescriptionMenuOpen] = useState(false)
  const [isOnlineCareMenuOpen, setIsOnlineCareMenuOpen] = useState(false)
  const [isHealthInfoMenuOpen, setIsHealthInfoMenuOpen] = useState(false)
  const [isGoldMembershipMenuOpen, setIsGoldMembershipMenuOpen] = useState(false)
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false)
  const [isAllCategoriesMenuOpen, setIsAllCategoriesMenuOpen] = useState(false)
  const [isMensHealthOpen, setIsMensHealthOpen] = useState(false)
  const [isHcpPageOpen, setIsHcpPageOpen] = useState(() => window.location.hash === '#hcp')
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isWhyChooseExpanded, setIsWhyChooseExpanded] = useState(false)
  const [isAboutExpanded, setIsAboutExpanded] = useState(false)
  const [activeFaqIndex, setActiveFaqIndex] = useState(null)
  const [isManufacturesExpanded, setIsManufacturesExpanded] = useState(false)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  
  const reviews = [
    { name: "Kate", title: "MRS.", date: "April 14, 2026", text: "Easy to order and order came in good time. Glad to have access to this pharmacy. Will be reorderin..." },
    { name: "Debra", title: "JUST WHAT I NEEDED", date: "April 14, 2026", text: "Went online, placed my order, and received it in no time. Super simple and Just what I needed!" },
    { name: "Janet", title: "GREAT SERVICE", date: "April 14, 2026", text: "Every time I place an order, they are fast and efficient. Orders come before their stated time lin..." },
    { name: "Kathleen", title: "MS.", date: "April 14, 2026", text: "I am a repeat buyer from CureBasket Pharmacy. For my recent purchase the ordering and purchase ..." },
    { name: "Sarah", title: "EXCELLENT", date: "April 15, 2026", text: "Very happy with the service. The packaging was discrete and secure. Definitely recommending to friends!" },
    { name: "Michael", title: "RELIABLE", date: "April 16, 2026", text: "Prompt delivery and authentic products. The customer support is also very helpful with queries." }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % (reviews.length + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [reviews.length])

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (isHcpPageOpen) {
    return (
      <div className="h-screen overflow-hidden bg-white font-sans">
        <div className="grid h-screen lg:grid-cols-[41%_59%]">
          <div className="bg-white px-7 py-8 md:px-12 lg:px-16 lg:py-12">
            <div className="flex items-center gap-3">
              <img src={curebasketLogo} alt="CureBasket Logo" className="w-10 h-10 object-contain" />
              <div className="flex items-baseline gap-2">
                <span className="text-[20px] font-bold tracking-tight text-primary">CureBasket</span>
                <span className="text-[13px] uppercase tracking-[0.18em] text-black/70">For HCPs</span>
              </div>
            </div>

            <div className="max-w-[500px] pt-8">
              <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-black">
                Join CureBasket for healthcare professionals
              </h1>

              <div className="pt-7 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd400]">
                    <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 5 4 4" />
                      <path d="m10 14 9-9" />
                      <path d="m6 8 10 10" />
                      <path d="m3 21 3-3" />
                      <path d="m6.5 17.5 4 4" />
                    </svg>
                  </span>
                  <span className="text-[16px] font-semibold text-black">Share coupons with patients</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd400]">
                    <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="6" width="14" height="12" rx="2" />
                      <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                      <path d="M7 12h6" />
                      <path d="M10 9v6" />
                      <path d="m18 17 1.5 1.5L22 16" />
                    </svg>
                  </span>
                  <span className="text-[16px] font-semibold text-black">Find manufacturer savings</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd400]">
                    <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16" />
                      <path d="M4 18h16" />
                      <path d="M8 6v12" />
                      <path d="m15 9 3 3-3 3" />
                      <path d="m9 15-3-3 3-3" />
                    </svg>
                  </span>
                  <span className="text-[16px] font-semibold text-black">Compare drugs by class</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd400]">
                    <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 20V10" />
                      <path d="M10 20V4" />
                      <path d="M16 20v-7" />
                      <path d="M22 20V8" />
                    </svg>
                  </span>
                  <span className="text-[16px] font-semibold text-black">See savings insights</span>
                </div>
              </div>

              <button className="mt-8 w-full max-w-[500px] rounded-full bg-[#1f5ead] px-8 py-4 text-[17px] font-semibold text-white">
                Let&apos;s go
              </button>

              <p className="pt-6 text-[14px] leading-[1.55] text-black/80">
                Not a healthcare professional?{' '}
                <button
                  type="button"
                  className="font-semibold text-primary underline"
                  onClick={() => {
                    window.location.hash = ''
                    setIsHcpPageOpen(false)
                  }}
                >
                  Go to CureBasket for patients
                </button>
              </p>

              <p className="max-w-[560px] pt-6 text-[14px] leading-[1.55] text-black/80">
                By continuing, you agree to the CureBasket for healthcare professionals Terms and Privacy Policy, and that we may share information about your use of our website with our partners and advertisers.
              </p>
            </div>
          </div>

          <div className="bg-[#fff2a6] px-8 py-10 md:px-10 lg:px-14 lg:py-14">
            <div className="mx-auto max-w-[680px]">
              <h2 className="text-center text-[31px] font-semibold leading-[1.08] tracking-[-0.03em] text-black">
                500,000+ HCPs use CureBasket to help their patients save on their prescriptions
              </h2>

              <div className="pt-8">
                <img src={joinImage} alt="Healthcare professional with patient" className="w-full max-h-[540px] rounded-[24px] object-cover shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="max-w-[1450px] mx-auto w-full flex justify-end items-center px-4 md:px-12">
          <div className="flex items-center gap-6">
            <a href="#contact" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-[13.5px] font-bold group">
              <svg className="w-4 h-4 text-primary group-hover:text-primary-dark transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Contact Us
            </a>
            <a href="tel:+18001234567" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-[13.5px] font-bold group">
              <svg className="w-4 h-4 text-primary group-hover:text-primary-dark transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Click to Call
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-50 bg-[#f7f2ea]">
        {/* Navbar Container */}
        <div className="relative" onMouseLeave={() => { setIsPrescriptionMenuOpen(false); setIsOnlineCareMenuOpen(false); setIsHealthInfoMenuOpen(false); setIsGoldMembershipMenuOpen(false); setIsAllCategoriesMenuOpen(false); setIsMensHealthOpen(false); }}>

        {/* Navbar */}
        <nav className="navbar">
          <div className="max-w-[1450px] mx-auto w-full flex items-center justify-between px-4 md:px-12">
            {/* Logo Area */}
            <div className="flex items-center gap-3 cursor-pointer group shrink-0">
              <img src={curebasketLogo} alt="CureBasket Logo" className="w-14 h-14 object-contain" />
              <span className="text-[28px] font-bold tracking-tight text-primary">CureBasket</span>
            </div>
            
            {/* Nav Links Area */}
            <div className="hidden lg:flex items-center gap-10">
                <div className="relative py-2 h-full flex items-center">
                  <a href="#" className="nav-link">Medicines</a>
                </div>
                <div className="relative py-2 h-full flex items-center">
                  <a href="#" className="nav-link">Upload Rx</a>
                </div>
                <div 
                  className="relative py-2 h-full flex items-center"
                  onMouseEnter={() => setIsAllCategoriesMenuOpen(true)}
                >
                  <a href="#" className="nav-link flex items-center gap-1.5">
                    All Categories
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </a>
                </div>
                <div 
                  className="relative py-2 h-full flex items-center"
                  onMouseEnter={() => { setIsMensHealthOpen(true); setIsAllCategoriesMenuOpen(false); }}
                >
                  <a 
                    href="#" 
                    className="nav-link flex items-center gap-1.5"
                  >
                    Men's Health
                    <svg className={`w-3.5 h-3.5 transition-transform ${isMensHealthOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </a>

                  {/* Men's Health Dropdown */}
                  {isMensHealthOpen && (
                    <div className="absolute top-full left-0 min-w-[240px] bg-white border border-gray-200 shadow-xl z-[70] mt-0">
                      <div className="flex flex-col">
                        <a href="#" className="px-5 py-3 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 border-b border-gray-100 transition-colors">
                          The Blue Pill (Sildenafil)
                        </a>
                        <a href="#" className="px-5 py-3 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 border-b border-gray-100 transition-colors">
                          The WeekEndPill (Tadalafil)
                        </a>
                        <a href="#" className="px-5 py-3 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">
                          Vardenafil
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative py-2 h-full flex items-center">
                  <a href="#" className="nav-link">Eye Care</a>
                </div>
                <div className="relative py-2 h-full flex items-center">
                  <a href="#" className="nav-link">Track Order</a>
                </div>
                

              </div>


          </div>
        </nav>
        
        {/* All Categories Mega Menu */}
        {isAllCategoriesMenuOpen && (
          <div 
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-2xl pt-8 pb-10 z-[60] animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => setIsAllCategoriesMenuOpen(true)}
          >
            <div className="max-w-[1450px] mx-auto px-4 md:px-12 grid grid-cols-4 gap-12">
              {/* Column 1 */}
              <div className="space-y-2">
                {['Acid Reflux', 'Acne', 'Alcohol & Drug Treatment', 'Allergy', 'Alpha Blockers', 'Alzheimers', 'Angina Pectoris Anti-Anginals', 'Anthelmintic & Anti-worm', 'Anti Amebics', 'Anti Androgen', 'Anti Cancer', 'Anti Coagulants', 'Anti Convulsant'].map(cat => (
                  <div key={cat} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
              
              {/* Column 2 */}
              <div className="space-y-2">
                {['Anti Emetic', 'Anti Migraine', 'Anti Parkinsonian', 'Anti Viral', 'Antibiotics', 'Antifungal', 'Asthma', 'Available Products', 'Beauty & Skin Care', 'Best selling Products', 'Birth Control', 'Bladder Prostate', 'Diabetes'].map(cat => (
                  <div key={cat} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
              
              {/* Column 3 */}
              <div className="space-y-2">
                {['ED Pills Online', 'Eye Care', 'Featured Products', 'Free Shipping Products', 'Gastro Health', 'Hair Loss', 'Heart & Blood Pressure', 'HIV & Herpes', 'Hypothyroidism', 'Immunosuppressive', 'Infertility Therapy', 'Melasma'].map(cat => (
                  <div key={cat} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
              
              {/* Column 4 */}
              <div className="space-y-2">
                {["Men's Health", 'New Products', 'Offers', 'Osteoporosis', 'Others', 'Pain Relief', 'Quit Smoking', 'Sildenafil Citrate', 'Stock Clearance', 'Weight Loss', "Women's Day", "Women's Health"].map(cat => (
                  <div key={cat} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
            </div>
          </div>
        )}


      </div>
    </div>

      {/* Banner Carousel Section */}
      <section className="bg-[#f7f2ea] pt-4 pb-2">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0">
          <div className="relative overflow-hidden bg-white group rounded-[24px] shadow-sm border border-gray-100">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-[350px] md:h-[480px]"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div key={index} className="min-w-full relative">
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="w-full h-full object-cover"
                  />
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

      {/* Feature Icons Section */}
      <section className="bg-[#f7f2ea] pt-24 pb-8">
        <div className="max-w-[1450px] mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
            <img src={section1} alt="Insurance Coverage" className="h-32 md:h-44 object-contain" />
            <img src={section2} alt="Wide Collection" className="h-32 md:h-44 object-contain" />
            <img src={section3} alt="Secured Site" className="h-32 md:h-44 object-contain" />
            <img src={section4} alt="Official Blog" className="h-32 md:h-44 object-contain" />
          </div>
        </div>
      </section>








      {/* Treatment Cards Section */}
      <section className="px-4 md:px-12 pt-16 pb-10 bg-white">


        <div className="max-w-[1200px] mx-auto mb-10 flex flex-col items-center text-center">
          <h2 className="text-[36px] font-bold text-[#006B6B] leading-none">Best Seller</h2>
        </div>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar">
            {/* Card 1: New Horizontal Layout */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              {/* Body: Horizontal Layout */}
              <div className="flex-1 p-5 flex items-center gap-8">
                
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med1} 
                    alt="Austro Ivermectin" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.8]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    Austro Ivermectin 12 mg
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Ivermectin)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">115</span>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Zepbound */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              <div className="flex-1 p-5 flex items-center gap-8">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med2} 
                    alt="Zepbound" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.4]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    A Ret Gel - 0.1%
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Tretinoin Gel)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">40.50</span>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Mebex */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              <div className="flex-1 p-5 flex items-center gap-8">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med3} 
                    alt="Mebex" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.4]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    Mebex 100mg
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Mebendazole)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">60.00</span>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: A Ret Gel 0.05% */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              <div className="flex-1 p-5 flex items-center gap-8">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med4} 
                    alt="A Ret Gel" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.4]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    A Ret Gel - 0.05%
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Tretinoin Gel)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">32.00</span>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: A Ret Gel 0.025% */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              <div className="flex-1 p-5 flex items-center gap-8">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med5} 
                    alt="A Ret Gel" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.4]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    A Ret Gel - .025%
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Tretinoin Gel)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">31.00</span>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Duplicate Section */}
      <section className="px-4 md:px-12 pt-16 pb-10 bg-white">


        <div className="max-w-[1200px] mx-auto mb-10 flex flex-col items-center text-center">
          <h2 className="text-[36px] font-bold text-[#006B6B] leading-none">New Arrival</h2>
        </div>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar">
            {/* Card 1: New Horizontal Layout */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              {/* Body: Horizontal Layout */}
              <div className="flex-1 p-5 flex items-center gap-8">
                
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med1} 
                    alt="Austro Ivermectin" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.8]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    Austro Ivermectin 12 mg
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Ivermectin)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">115</span>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Zepbound */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              <div className="flex-1 p-5 flex items-center gap-8">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med2} 
                    alt="Zepbound" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.4]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    A Ret Gel - 0.1%
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Tretinoin Gel)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">40.50</span>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Mebex */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              <div className="flex-1 p-5 flex items-center gap-8">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med3} 
                    alt="Mebex" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.4]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    Mebex 100mg
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Mebendazole)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">60.00</span>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: A Ret Gel 0.05% */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              <div className="flex-1 p-5 flex items-center gap-8">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med4} 
                    alt="A Ret Gel" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.4]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    A Ret Gel - 0.05%
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Tretinoin Gel)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">32.00</span>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: A Ret Gel 0.025% */}
            <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
              <div className="flex-1 p-5 flex items-center gap-8">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center">
                  <img 
                    src={med5} 
                    alt="A Ret Gel" 
                    className="w-full h-auto object-contain drop-shadow-md scale-[1.4]"
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">
                    A Ret Gel - .025%
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold mb-3">
                    (Tretinoin Gel)
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[14px] font-bold text-black">$</span>
                    <span className="text-[28px] font-black text-black leading-none">31.00</span>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refined Sponsored Section */}






      


      {/* Impact Section (Top Curved Only) */}
      <section className="relative -mt-[180px] pt-56 pb-2 overflow-hidden">
         {/* Large Top Arc Background */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] h-[200%] bg-[#fcf0f0] rounded-t-[100%] translate-y-32"></div>
         
         <div className="relative z-10 max-w-[1400px] mx-auto px-4 text-center">
            <h2 className="text-[32px] md:text-[44px] font-bold text-gray-900 leading-tight mb-4">
              Shop By Category
            </h2>
            
            <div className="flex overflow-x-auto gap-8 md:gap-16 pb-10 no-scrollbar justify-start px-4">
              {[
                { name: 'Allergy', img: cat_allergy },
                { name: 'Beauty & Skin Care', img: cat_skin },
                { name: 'Acne', img: cat_acne },
                { name: 'Diabetes', img: cat_diabetes },
                { name: 'Antibiotics', img: cat_antibiotics },
                { name: 'Pain Relief', img: cat_pain },
                { name: 'Anti Cancer', img: cat_cancer },
                { name: 'Eye Care', img: cat_eye },
                /* Repeat to give an infinite feel */
                { name: 'Allergy', img: cat_allergy },
                { name: 'Beauty & Skin Care', img: cat_skin },
                { name: 'Acne', img: cat_acne },
                { name: 'Diabetes', img: cat_diabetes },
                { name: 'Antibiotics', img: cat_antibiotics },
                { name: 'Pain Relief', img: cat_pain },
                { name: 'Anti Cancer', img: cat_cancer },
                { name: 'Eye Care', img: cat_eye },
                { name: 'Allergy', img: cat_allergy },
                { name: 'Beauty & Skin Care', img: cat_skin },
                { name: 'Acne', img: cat_acne },
                { name: 'Diabetes', img: cat_diabetes },
                { name: 'Antibiotics', img: cat_antibiotics },
                { name: 'Pain Relief', img: cat_pain },
                { name: 'Anti Cancer', img: cat_cancer },
                { name: 'Eye Care', img: cat_eye }
              ].map((cat, idx) => (
                <div key={idx} className="flex flex-col items-center gap-0 shrink-0 group cursor-pointer px-4">
                  <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px]">
                    <img 
                      src={cat.img} 
                      alt={cat.name} 
                      className={`w-full h-full object-contain ${cat.name === 'Pain Relief' ? 'scale-[0.7]' : ''}`}
                    />
                  </div>
                  <span className="text-[14px] md:text-[18px] font-bold text-[#005050] text-center max-w-[140px] leading-tight transition-colors -mt-4">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-[#fcf0f0] pt-6 pb-16 md:pt-10 md:pb-24 px-4 md:px-12 border-b border-gray-50">
        <div className="max-w-[1300px] mx-auto">
          {/* Section Heading */}
          <h2 className="text-[28px] md:text-[34px] font-bold text-center text-[#004D4D] mb-8 uppercase tracking-wider">
            Why Choose CureBasket?
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start mb-14">
            {/* Left: Benefits Icons */}
            <div className="w-full lg:w-[45%] flex justify-between items-start pt-4">
              {/* Item 1 */}
              <div className="flex flex-col items-center text-center flex-1 px-2 group">
                <div className="flex items-end justify-center h-28 md:h-40 mb-1.5 transition-all duration-300">
                  <img src={img_trusted} alt="Trusted Medicines" className="max-w-full max-h-full object-contain" />
                </div>
                <span className="text-[14px] md:text-[16px] font-bold text-[#004D4D] leading-tight">Trusted<br/>Medicines</span>
              </div>
              
              {/* Item 2 */}
              <div className="flex flex-col items-center text-center flex-1 px-2 group">
                <div className="flex items-end justify-center h-28 md:h-40 mb-1.5 transition-all duration-300">
                  <img src={img_delivery} alt="Super-fast Delivery" className="max-w-full max-h-full object-contain" />
                </div>
                <span className="text-[14px] md:text-[16px] font-bold text-[#004D4D] leading-tight">Super-fast<br/>Delivery</span>
              </div>
              
              {/* Item 3 */}
              <div className="flex flex-col items-center text-center flex-1 px-2 group">
                <div className="flex items-end justify-center h-28 md:h-40 mb-1.5 transition-all duration-300">
                  <img src={img_fast} alt="Savings & Safety" className="max-w-full max-h-full object-contain" />
                </div>
                <span className="text-[14px] md:text-[16px] font-bold text-[#004D4D] leading-tight">Savings<br/>& Safety</span>
              </div>
            </div>

            {/* Right: Text Description */}
            <div className="w-full lg:w-[55%] space-y-4">
              <p className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed font-medium text-justify">
                We believe in directing our skills and expertise in delivering and developing quality, in online pharmacy services which is not gained by accident. Our promise to deliver and maintain the present quality of work forms the basis of our work philosophy, a claim endorsed by online pharmacy reviews.
              </p>
              <p className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed font-medium text-justify">
                We believe that as we develop our work quality we will be one step closer to helping you enrich your lives with good health and happiness. We wish to see our consumers to live life filled with long life and comforts. This is CureBasket's commitment towards the community...
              </p>

              {/* Expanded Content */}
              {isWhyChooseExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    {['Hassle-Free Service', 'Our Community', 'Medications', 'Best Buy at Best Prices', 'Referral Programme'].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 group cursor-pointer w-fit">
                        <span className="text-[12px] md:text-[13px] font-bold text-gray-700 group-hover:text-primary transition-colors">{item}</span>
                        <svg className="w-2.5 h-2.5 text-[#8CB33E]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {['Savings and Safety', 'Information', 'Health Supplements', 'Reliability'].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 group cursor-pointer w-fit">
                        <span className="text-[12px] md:text-[13px] font-bold text-gray-700 group-hover:text-primary transition-colors">{item}</span>
                        <svg className="w-2.5 h-2.5 text-[#8CB33E]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Read More / Show Less Button */}
          <div className="flex justify-center">
            <button 
              onClick={() => setIsWhyChooseExpanded(!isWhyChooseExpanded)}
              className="bg-[#004D4D] text-white px-8 py-2.5 rounded-lg font-bold text-[14px] hover:bg-[#003333] transition-all duration-300 shadow-md active:scale-95"
            >
              {isWhyChooseExpanded ? 'Show Less' : 'Read More'}
            </button>
          </div>
        </div>
      </section>









      {/* About Us Section */}
      <section className="bg-[#f5f5f5] py-12 md:py-20 px-4 md:px-12 overflow-hidden">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.15em] mb-4 text-[#004D4D] text-center">
            About Us
          </h2>
          
          <div className="space-y-3">
            <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
              <span className="font-bold text-[#004D4D]">CureBasket.com</span> is a leading digital platform committed to serving the healthcare needs of people from across the globe. We feel proud when we look back years ago from now to the day when we invented the idea of having an online pharmacy store from where customers can buy medicine online. Since then, we are providing online pharmacy services in the USA and other countries as well. It is close to 2 decades now, and we are happily serving humankind.
            </p>
            
            <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
              Being an Indian pharmacy, we believe that all individuals deserve a healthy life at affordable prices. CureBasket had set new standards in the market to <span className="font-bold text-[#004D4D]">buy medicine online</span> years ago when people were hardly aware of online shopping terms. We are a one-stop destination for sourcing pharmaceutical, healthcare, and herbal products from the comfort of your home with complete privacy and payment security options. The availability of Indian medicine in the USA has given relief to millions of people who were often helpless in buying costly medication for certain treatments. Exhaustive searches on CureBasket Australia, CureBasket Canada and pharmacy online USA etc.
            </p>

            {isAboutExpanded && (
              <div className="pt-4 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-gray-200 mt-4">
                <div className="space-y-2">
                  <h3 className="text-[18px] font-bold text-[#004D4D] uppercase tracking-wide">
                    How does CureBasket works?
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
                    CureBasket is one of those online chemists whose endeavor is to simplify your search for generic medicines. On our website, you can either search by Brand-Name or by Generic Name to source the medicine you intend to buy. You can also mention the desired quantity of drugs required, add them to cart, and click check-out by providing your contact information to place the order with us. Your online drug transaction will be considered valid when you upload a prescription. After we receive a scanned copy of your prescription, you will be directed for the next step.
                  </p>
                  <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
                    We expect our site visitors to be at least 21 years of age and we encourage our customers to keep themselves informed about their respective country's laws related to online pharmacies and import of generic drugs for personal use. After placing the online order with us, our team ensures that you receive a timely notification to track the progress of your order to receive the same at your doorstep. Our team works all year round so that you call us or jump on a live chat with our representative in case of any query you may have. CureBasket shipping methods and techniques are designed in such a way so that you receive your order within the promised timeframe.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[18px] font-bold text-[#004D4D] uppercase tracking-wide">
                    The Additional Benefits CureBasket Offers
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-snug font-medium text-gray-700 text-justify">
                    The online medicine purchase from CureBasket ensures you to get the maximum benefits as best as possible. CureBasket chemist store offers a wide range of prescription and OTC products for the most common and critical diseases and treatments. With the help of most advance technology, people have access and freedom to compare and buy medicine with just a few clicks. Some additional benefits CureBasket offers to its customers are:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 pt-1">
                    {[
                      "Unparallel technology to source medicines and healthcare products",
                      "Wide range of brand and generic options",
                      "Product description to understand the benefits and consequences of medicine",
                      "User-friendly content on health, lifestyle, and fitness",
                      "Free shipping options with doorstep delivery",
                      "Great deals, discounts, and coupons on medicines to save money",
                      "Outstanding client support",
                      "Fair and transparent service policies to maintain a long-term relationship",
                      "Easy return, refund, and cancellation",
                      "Secure and fastest payment gateways"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#004D4D]/10 flex items-center justify-center text-[11px] font-bold text-[#004D4D]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[13px] md:text-[14px] font-medium text-gray-600 leading-tight">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="bg-[#004D4D] text-white px-10 py-3 rounded-xl font-bold text-[14px] hover:bg-[#003333] transition-all duration-300 shadow-lg active:scale-95"
            >
              {isAboutExpanded ? 'Show Less' : 'Read More'}
            </button>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-[#f5f5f5] py-12 md:py-16 px-4 md:px-12 overflow-hidden">
        <div className="max-w-[1300px] mx-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 px-8 md:px-12 lg:px-16 py-8 md:py-10">
          <h2 className="text-[28px] md:text-[36px] font-bold text-center text-[#004D4D] uppercase tracking-wider mb-6">
            FAQs
          </h2>
          
          <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8">
            {/* Left: Questions List */}
            <div className="w-full lg:w-[45%] flex flex-col gap-y-5">
              {[
                {
                  q: "How to check the expiry date of medicine online?",
                  a: "CureBasket has a team of pharmacists who ensure their customers do not get expired medicines and that the product is in good condition. Most medicines and health care products are available with a minimum expiry date of six months. If you wish to buy medicines for a longer expiry date, for example, more than a year or two, please email us so that we can check with our suppliers. We are a reliable drugstore and do not provides expired medication. You can easily find the expiry date on your medicine packaging after receiving the medicine."
                },
                {
                  q: "Can I buy medicine online?",
                  a: "Absolutely! You can buy medicine online at the lowest rates from the comforts of your place with a few clicks and get them delivered safely to your home. The entire process of online shopping is hassle-free and convenient. You must search for the products you need on our website, add them to your cart and then proceed with the checkout process. Prescription can be sent through email or you can Fax it. You can also check the website from time to time to learn about the added discount and massive deals available on purchasing medicines."
                },
                {
                  q: "What is CureBasket?",
                  a: "CureBasket.com is a one-stop destination for all your health care needs. It is an online pharmacy that brings thousands of medicinal products for you to choose from. You can buy medicine online with a few simple clicks. Ordering medicine from curebasket.com is quick and hassle-free. Find and select the required products, click on the add to cart button, send your prescription by email or FAX and proceed to make the payment; once your order is confirmed, the CureBasket team will begin prepping to deliver your medicine safely and on time. The team follows strict safety protocols to ensure that only authentic medications and health care items are delivered to you."
                },
                {
                  q: "Can I order medicine from India?",
                  a: "You can order medicine from a trusted online pharmacy, curebasket.com. With a legacy of over 15 years in the pharma business, the online pharmacy satisfies thousands of customers all around the globe. The online drugstore delivers health care essentials in the promised timeframe. You can get everything you need at this reliable place to maintain good health, from high-quality, authentic, affordable medications to general health care items. Buy medicine online from India's trusted pharmacy CureBasket.com from the comfort of your home."
                },
                {
                  q: "Is CureBasket a legitimate company?",
                  a: "Yes, CureBasket is a legitimate pharmacy which offers approved medications. It offers medicinal items with adequate directions for use and warnings to consumers about the serious health risks associated with the medicines. The online drug store has dedicated customer support round the clock; one can contact CureBasket via Email, chat and call options. Customers need to upload their medicinal prescriptions to place the order. After receiving your requirements, the order is dispensed and sent to you at the given address on time. The site also provides email and chat services to solve all the queries of its customers."
                },
                {
                  q: "How long does prescription medicine last?",
                  a: "The expiry date is the final day that guarantees a medication's full potency and safety. The expiry date exists on most medication labels, including prescription and over-the-counter products. Proper storage of medicinal items may help to extend their potency. Note that- bathrooms and medicine cabinets are not ideal places to store medications due to excessive heat and humid environments. Same way, medications should not be placed in cars. Medicines remain stable in dry, cool places away from light and moisture. Our team of Pharmacists makes sure that the products must have at least 6 months expiry at the time of shipping the order."
                }
              ].map((faq, index) => {
                const isOpen = activeFaqIndex === index;
                
                return (
                  <div key={index} className="w-full">
                    <div 
                      onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                      className={`flex flex-col px-8 py-3.5 border border-[#004D4D]/20 bg-white transition-all duration-300 shadow-sm rounded-[24px]
                        ${isOpen ? 'border-[#004D4D]/40' : 'hover:border-[#004D4D] hover:shadow-md cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] md:text-[14px] font-bold text-gray-700 leading-tight">{faq.q}</span>
                        <svg 
                          className={`w-4 h-4 text-[#004D4D] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} 
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>

                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                          <p className="text-[12px] md:text-[13px] leading-relaxed text-gray-600 text-justify font-medium">
                            {faq.a.split(/(CureBasket(?:\.com)?)/g).map((part, i) => 
                              part.toLowerCase().includes('curebasket') ? (
                                <span key={i} className="font-bold text-[#004D4D]">{part}</span>
                              ) : part
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Illustration Image */}
            <div className="w-full lg:w-[55%] flex justify-center">
              <img 
                src={img_faq} 
                alt="FAQ Help" 
                className="relative w-full max-w-[450px] h-auto object-contain drop-shadow-2xl" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Manufactures Section */}
      <section className="bg-white pt-16 md:pt-24 pb-16 md:pb-24 px-4 md:px-12">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-[20px] md:text-[24px] font-bold text-[#004D4D] uppercase tracking-wider mb-6">
            MANUFACTURES
          </h2>
          <p className={`text-[14px] md:text-[15px] text-gray-600 leading-tight tracking-tight text-justify mb-8 font-medium ${isManufacturesExpanded ? '' : 'line-clamp-2'}`}>
            We order our drugs from reputed international manufacturers and are made available for sale after careful scrutiny of the quality. This way we can spend more time and efforts to help you when you buy medicine online. These drugs sold in other countries are known by other brand names, but generically they are the same drugs.
            {isManufacturesExpanded && (
              <>
                {" "}Ranbaxy Laboratories Ltd. | Cipla Ltd. | Dr. Reddy'S Laboratories Ltd. | Nicholas Piramal India Ltd. | Aurobindo Pharma Ltd. | Glaxosmithkline Pharmaceuticals Ltd. | Lupin Ltd. | Cadila Healthcare Ltd. | Sun Pharmaceutical Inds. Ltd. | Wockhardt Ltd. | Aventis Pharma Ltd. | Orchid Chemicals & Pharmaceuticals Ltd. | Ipca Laboratories Ltd. | Alembic Ltd. | Pfizer Ltd. | Morepen Laboratories Ltd. | U S V Ltd. | Matrix Laboratories Ltd. | Biocon Ltd. | Novartis India Ltd. | Torrent Pharmaceuticals Ltd. | Abbott India Ltd. | Ranbaxy Laboratories Ltd. | Cipla Ltd. | Dr. Reddy'S Laboratories Ltd. | Nicholas Piramal India Ltd. | Aurobindo Pharma Ltd. | Glaxosmithkline Pharmaceuticals Ltd. | Lupin Ltd. | Cadila Healthcare Ltd. | Sun Pharmaceutical Inds. Ltd. | Wockhardt Ltd. | Aventis Pharma Ltd. | Orchid Chemicals & Pharmaceuticals Ltd. | Ipca Laboratories Ltd. | Alembic Ltd. | Pfizer Ltd. | Morepen Laboratories Ltd. | U S V Ltd. | Matrix Laboratories Ltd. | Biocon Ltd. | Novartis India Ltd. | Torrent Pharmaceuticals Ltd. | Abbott India Ltd. | Ranbaxy Laboratories Ltd. | Cipla Ltd. | Dr. Reddy'S Laboratories Ltd. | Nicholas Piramal India Ltd. | Aurobindo Pharma Ltd. | Glaxosmithkline Pharmaceuticals Ltd. | Lupin Ltd. | Cadila Healthcare Ltd. | Sun Pharmaceutical Inds. Ltd. | Wockhardt Ltd. | Aventis Pharma Ltd. | Orchid Chemicals & Pharmaceuticals Ltd. | Ipca Laboratories Ltd. | Alembic Ltd. | Pfizer Ltd. | Morepen Laboratories Ltd. | U S V Ltd. | Matrix Laboratories Ltd. | Biocon Ltd. | Novartis India Ltd. | Torrent Pharmaceuticals Ltd. | Abbott India Ltd.
              </>
            )}
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => setIsManufacturesExpanded(!isManufacturesExpanded)}
              className={`text-white px-10 py-3 rounded-xl font-bold text-[14px] transition-all duration-300 shadow-lg active:scale-95
                ${isManufacturesExpanded 
                  ? 'bg-gradient-to-r from-[#26CBC2] to-[#62E09A] hover:opacity-90' 
                  : 'bg-[#004D4D] hover:bg-[#003333]'
                }
              `}
            >
              {isManufacturesExpanded ? 'Show Less' : 'Read More'}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 px-4 md:px-12 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          {/* Header Rating */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-4">
              <span className="text-[48px] md:text-[56px] font-bold text-gray-800 leading-none">4.9</span>
              <div className="flex flex-col">
                <div className="flex text-yellow-400">
                  {"★★★★★".split('').map((s, i) => <span key={i} className="text-xl">★</span>)}
                </div>
                <span className="text-[#004D4D] font-bold text-[14px]">38324 Reviews</span>
              </div>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-[1100px] mx-auto overflow-hidden">
            {/* Navigation Arrows */}
            <button 
              onClick={() => setCurrentReviewIndex(prev => (prev - 1 + (reviews.length + 1)) % (reviews.length + 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#004D4D] hover:bg-gray-50 transition-all z-20 border border-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => setCurrentReviewIndex(prev => (prev + 1) % (reviews.length + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#004D4D] hover:bg-gray-50 transition-all z-20 border border-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Sliding Cards Track */}
            <div 
              className={`flex ${currentReviewIndex === 0 ? '' : 'transition-transform duration-700 ease-in-out'}`}
              style={{ transform: `translateX(-${currentReviewIndex * (100 / 4)}%)` }}
              onTransitionEnd={() => {
                if (currentReviewIndex >= reviews.length) {
                  setCurrentReviewIndex(0);
                }
              }}
            >
              {[...reviews, ...reviews.slice(0, 4)].map((rev, i) => (
                <div key={i} className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-2 py-4">
                  <div className="bg-[#f5f5f5] p-6 rounded-[20px] flex flex-col h-full shadow-sm hover:shadow-md transition-all border border-gray-200">
                    <span className="text-[#004D4D] font-bold text-[18px] mb-1">{rev.name}</span>
                    <div className="flex text-yellow-400 text-sm mb-3">
                      {"★★★★★".split('').map((s, idx) => <span key={idx}>★</span>)}
                    </div>
                    <h4 className="font-black text-gray-900 text-[14px] mb-3 uppercase tracking-tight">{rev.title}</h4>
                    <p className="text-gray-600 text-[13px] leading-snug text-justify mb-6 flex-grow font-medium line-clamp-4">
                      "{rev.text}" <span className="text-blue-500 cursor-pointer hover:underline">Read more</span>
                    </p>
                    <span className="text-gray-500 text-[12px] font-medium">{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-12">
            <button className="bg-[#004D4D] text-white px-12 py-3 rounded-xl font-bold text-[14px] transition-all shadow-lg hover:shadow-xl hover:bg-[#003333] active:scale-95">
              Read All Reviews
            </button>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="relative bg-[#f5f5f5] pt-12 pb-12 px-4 overflow-visible border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto relative">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
            
            {/* Left Side: Footer Links */}
            <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Column 1 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[14px] font-bold text-[#004D4D] uppercase tracking-wider">CureBasket</h4>
                <div className="flex flex-col gap-2">
                  {['About Us', 'Site Map', 'Terms And Conditions', 'Disclaimer', 'Blog', 'Articles', 'Referral Program'].map(link => (
                    <a key={link} href="#" className="text-[13px] text-gray-600 hover:text-[#004D4D] transition-colors">{link}</a>
                  ))}
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[14px] font-bold text-[#004D4D] uppercase tracking-wider">Categories</h4>
                <div className="flex flex-col gap-2">
                  {['New Products', 'Featured Products', 'Women\'s Health', 'Pain Relief'].map(link => (
                    <a key={link} href="#" className="text-[13px] text-gray-600 hover:text-[#004D4D] transition-colors">{link}</a>
                  ))}
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[14px] font-bold text-[#004D4D] uppercase tracking-wider">FAQs</h4>
                <div className="flex flex-col gap-2">
                  {['How to Place the Order', 'Refunds and Returns', 'Cancellation Policy', 'Frequently Asked Questions', 'Review Guidelines', 'About Indian Pharmacies'].map(link => (
                    <a key={link} href="#" className="text-[13px] text-gray-600 hover:text-[#004D4D] transition-colors">{link}</a>
                  ))}
                </div>
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[14px] font-bold text-[#004D4D] uppercase tracking-wider">Contact Us</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-[13px] text-gray-600 hover:text-[#004D4D] transition-colors">Click to Call</a>
                </div>
              </div>
            </div>

            {/* Right Side: Subscribe Section */}
            <div className="w-full lg:w-[380px] shrink-0 relative">
              {/* Medico overlapping image on right - adjusted positioning for this layout */}
              <img
                src={medico}
                alt="Medico"
                className="absolute -right-12 -bottom-12 h-[150px] md:h-[200px] w-auto object-contain pointer-events-none z-10"
              />
              <div className="relative z-0">
                <h3 className="text-[22px] md:text-[26px] font-bold text-[#004D4D] leading-tight mb-0 whitespace-nowrap">
                  Good news for your inbox
                </h3>
                <p className="text-[14px] text-gray-600 mb-2 font-medium">
                  Sign up for our newsletter for tips and discounts.
                </p>
                <div className="flex flex-col gap-3">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full max-w-[300px] h-[44px] px-5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#004D4D] text-gray-700 text-[14px] bg-white transition-all shadow-sm"
                  />
                  <button className="w-fit px-8 h-[42px] bg-[#004D4D] text-white rounded-full font-bold text-[14px] hover:bg-[#003333] transition-all shadow-md -mt-1">
                    Subscribe
                  </button>

                  {/* Social Media Icons Section */}
                  <div className="mt-4">
                    <h4 className="text-[18px] font-bold text-[#004D4D] mb-2">Follow CureBasket</h4>
                    <div className="flex flex-wrap gap-2">
                      {/* Instagram */}
                      <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                      </a>
                      {/* X (Twitter) */}
                      <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                      </a>
                      {/* Facebook */}
                      <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      </a>
                      {/* LinkedIn */}
                      <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
                      </a>

                      {/* YouTube */}
                      <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Accessibility & Copyright Section */}
      <section className="bg-white pt-16 pb-12 px-4 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[28px] font-bold text-[#004D4D] mb-2 tracking-tight">CureBasket</h2>
          <div className="w-full h-px bg-gray-200 mb-4"></div>
          <p className="text-[13px] text-black leading-relaxed mb-6 max-w-[1100px]">
            CureBasket works to make its website accessible to all, including those with disabilities. If you are having difficulty accessing this website, 
            please call or email us at <span className="underline font-medium hover:text-[#004D4D] cursor-pointer">1-855-268-2822</span> or <span className="underline font-medium hover:text-[#004D4D] cursor-pointer">ada@curebasket.com</span> so 
            that we can provide you with the services you require through alternative means.
          </p>
          <div className="text-[13px] text-black font-bold">
            Copyright ©2011–2026 CureBasket, Inc.
          </div>
        </div>
      </section>

    </div>
  )
}

export default App
