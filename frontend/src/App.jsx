import { useState } from 'react'

import curebasketLogo from './assets/curebasket.png'
import goli1 from './assets/card-3.1.png'
import goli2 from './assets/card-3.2.png'
import joinImage from './assets/join-image.png'
import card1 from './assets/card-1.png'
import card2_1 from './assets/card-2.1.png'
import card2_2 from './assets/card-2.2.png'
import card2_3 from './assets/card-2.3.png'



function App() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [isPrescriptionMenuOpen, setIsPrescriptionMenuOpen] = useState(false)
  const [isOnlineCareMenuOpen, setIsOnlineCareMenuOpen] = useState(false)
  const [isHealthInfoMenuOpen, setIsHealthInfoMenuOpen] = useState(false)
  const [isGoldMembershipMenuOpen, setIsGoldMembershipMenuOpen] = useState(false)
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false)
  const [isHcpPageOpen, setIsHcpPageOpen] = useState(() => window.location.hash === '#hcp')

  if (isHcpPageOpen) {
    return (
      <div className="h-screen overflow-hidden bg-white font-inter">
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
    <div className="min-h-screen bg-background font-inter">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="max-w-[1450px] mx-auto w-full flex justify-end items-center px-4 md:px-12">
          <div className="flex items-center gap-2 text-text-primary">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
            <span className="text-gray-600">Are you a healthcare professional? <a href="#hcp" className="text-primary underline font-semibold" onClick={() => setIsHcpPageOpen(true)}>Join CureBasket for HCPs</a></span>
          </div>
        </div>
      </div>

      {/* Navbar Container */}
      <div className="relative" onMouseLeave={() => { setIsPrescriptionMenuOpen(false); setIsOnlineCareMenuOpen(false); setIsHealthInfoMenuOpen(false); setIsGoldMembershipMenuOpen(false); }}>
        {/* Navbar */}
        <nav className="navbar">
          <div className="max-w-[1450px] mx-auto w-full flex items-center justify-between px-4 md:px-12">
            <div className="flex items-center gap-10">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer group">
                <img src={curebasketLogo} alt="CureBasket Logo" className="w-9 h-9 object-contain" />
                <span className="text-[22px] font-bold tracking-tight text-primary">CureBasket</span>
              </div>
              
              {/* Nav Links */}
              <div className="hidden lg:flex items-center gap-6">
                <div 
                  className="relative py-2 h-full flex items-center"
                  onMouseEnter={() => { setIsPrescriptionMenuOpen(true); setIsOnlineCareMenuOpen(false); setIsHealthInfoMenuOpen(false); }}
                >
                  <a href="#" className={`nav-link ${isPrescriptionMenuOpen ? 'nav-link-active' : ''}`}>Prescription savings</a>
                </div>
                <div 
                  className="relative py-2 h-full flex items-center"
                  onMouseEnter={() => { setIsOnlineCareMenuOpen(true); setIsPrescriptionMenuOpen(false); setIsHealthInfoMenuOpen(false); setIsGoldMembershipMenuOpen(false); }}
                >
                  <a
                    href="#"
                    className={`nav-link ${isOnlineCareMenuOpen ? 'nav-link-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsOnlineCareMenuOpen(true)
                      setIsPrescriptionMenuOpen(false)
                      setIsHealthInfoMenuOpen(false)
                      setIsGoldMembershipMenuOpen(false)
                    }}
                  >
                    Online care
                  </a>
                </div>
                <div
                  className="relative py-2 h-full flex items-center"
                  onMouseEnter={() => { setIsHealthInfoMenuOpen(true); setIsPrescriptionMenuOpen(false); setIsOnlineCareMenuOpen(false); setIsGoldMembershipMenuOpen(false); }}
                >
                  <a
                    href="#"
                    className={`nav-link ${isHealthInfoMenuOpen ? 'nav-link-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsHealthInfoMenuOpen(true)
                      setIsPrescriptionMenuOpen(false)
                      setIsOnlineCareMenuOpen(false)
                      setIsGoldMembershipMenuOpen(false)
                    }}
                  >
                    Health info
                  </a>
                </div>
                <div
                  className="relative py-2 h-full flex items-center"
                  onMouseEnter={() => { setIsGoldMembershipMenuOpen(true); setIsPrescriptionMenuOpen(false); setIsOnlineCareMenuOpen(false); setIsHealthInfoMenuOpen(false); }}
                >
                  <a
                    href="#"
                    className={`nav-link ${isGoldMembershipMenuOpen ? 'nav-link-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsGoldMembershipMenuOpen(true)
                      setIsPrescriptionMenuOpen(false)
                      setIsOnlineCareMenuOpen(false)
                      setIsHealthInfoMenuOpen(false)
                    }}
                  >
                    Gold membership
                  </a>
                </div>
                
                <button className="bg-primary text-white px-4 py-1.5 rounded-full font-semibold text-[14px] flex items-center gap-2 hover:bg-primary-dark transition-all ml-2 shadow-sm active:scale-95">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 6V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H6c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2zM10 4h4v2h-4V4zm5 11h-2v2h-2v-2H9v-2h2v-2h2v2h2v2z" />
                  </svg>
                  Get weight loss treatment
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-[14px] font-semibold text-gray-600 hover:text-black transition-colors">Log in</button>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors group">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mega Menu */}
        {isPrescriptionMenuOpen && (
          <div 
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-2xl pt-6 pb-6 z-[60] animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => setIsPrescriptionMenuOpen(true)}
          >
            <div className="max-w-[1450px] mx-auto px-4 md:px-12 flex justify-start gap-12 text-left">
              {/* Column 1: Intro */}
              <div className="w-[280px] space-y-4">
                <h3 className="text-[26px] font-bold text-black tracking-tight leading-tight">Prescription savings</h3>
                <p className="text-gray-600 leading-normal text-[14px]">
                  Stop paying too much for your prescriptions. Compare prices, get pharmacy coupons, and save up to 80%.
                </p>
                <button className="border-2 border-black rounded-full px-5 py-2 font-bold hover:bg-black hover:text-white transition-all inline-flex items-center gap-2 text-[14px]">
                  Get prescription savings 
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              {/* Column 2: Ways to Save & Popular Meds */}
              <div className="w-[200px] space-y-5">
                <div>
                  <h4 className="font-bold text-black mb-2 text-[15px]">Ways to save</h4>
                  <ul className="space-y-1 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Search for pharmacy coupons</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Get a prescription savings card</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Join CureBasket Gold</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Save on brand-name medications</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Earn CureBasket Rewards</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Explore ED subscriptions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2 text-[15px]">Popular medications</h4>
                  <ul className="space-y-1 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Sildenafil</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Ozempic</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Wegovy</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Zepbound</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Humira</li>
                  </ul>
                </div>
              </div>

              {/* Column 3: Resources & About */}
              <div className="w-[180px] space-y-5">
                <div>
                  <h4 className="font-bold text-black mb-2 text-[15px]">Resources</h4>
                  <ul className="space-y-1 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Pharmacies near you</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Find a Gold pharmacy</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">CureBasket for pets</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2 text-[15px]">About CureBasket</h4>
                  <ul className="space-y-1 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">About us</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">How CureBasket works</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">How we help</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">What we believe</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Our impact</li>
                  </ul>
                </div>
              </div>

              {/* Column 4: Browser Card */}
              <div className="flex-1 flex justify-end">
                <div className="bg-white border border-gray-200 rounded-[16px] p-6 space-y-3 shadow-sm max-w-[280px]">
                  <h4 className="text-[18px] font-bold text-black tracking-tight">Browse medications</h4>
                  <p className="text-gray-600 text-[13px] leading-tight">
                    Research prescriptions and over-the-counter <a href="#" className="text-primary underline font-medium">medications from A to Z</a>, compare drug prices.
                  </p>
                  <div className="grid grid-cols-7 gap-y-2 gap-x-1 pt-2">
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                      <button key={letter} className="text-primary font-bold hover:underline py-0.5 text-[13px]">{letter}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Online Care Mega Menu */}
        {isOnlineCareMenuOpen && (
          <div 
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-2xl pt-6 pb-6 z-[60] animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => setIsOnlineCareMenuOpen(true)}
          >
            <div className="max-w-[1450px] mx-auto px-4 md:px-12 flex justify-start gap-12 text-left">
              {/* Column 1: Intro */}
              <div className="w-[280px] space-y-4 -ml-4">
                <h3 className="text-[26px] font-bold text-black tracking-tight leading-tight">Online care</h3>
                <p className="text-gray-600 leading-normal text-[14px]">
                  Virtual care for hundreds of conditions. No insurance required. Connect with a provider in minutes.
                </p>
              </div>

              {/* Column 2: ED & Hair Loss */}
              <div className="w-[280px] space-y-8">
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">ED treatment</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Tadalafil (generic Cialis)</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Sildenafil (generic Viagra)</li>
                    <li className="text-primary font-bold hover:underline cursor-pointer pt-1">Explore ED subscriptions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">Men&apos;s hair loss treatment</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Finasteride (generic Propecia)</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Oral minoxidil</li>
                    <li className="text-primary font-bold hover:underline cursor-pointer pt-1">Explore hair loss subscriptions</li>
                  </ul>
                </div>
              </div>

              {/* Column 3: Weight Loss */}
              <div className="w-[240px] space-y-5">
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">Weight loss treatment</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Foundayo™</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Wegovy pill</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Wegovy pen</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Zepbound pen</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Zepbound vial</li>
                    <li className="text-primary font-bold hover:underline cursor-pointer pt-1">Explore weight loss subscriptions</li>
                  </ul>
                </div>
              </div>

              {/* Column 4: Other Treatment */}
              <div className="w-[280px] space-y-5">
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">Other treatment</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">UTI (Urinary Tract Infection)</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">General cough, cold, and sinus</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Birth control</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Acne treatment &amp; prevention</li>
                    <li className="text-primary font-bold hover:underline cursor-pointer pt-1">See all services</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Health Info Mega Menu */}
        {isHealthInfoMenuOpen && (
          <div
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-2xl pt-6 pb-8 z-[60] animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => setIsHealthInfoMenuOpen(true)}
          >
            <div className="max-w-[1450px] mx-auto px-4 md:px-12 flex justify-start gap-14 text-left">
              <div className="w-[270px] space-y-4">
                <h3 className="text-[26px] font-bold text-black tracking-tight leading-tight">CureBasket Health</h3>
                <p className="text-gray-600 leading-[1.55] text-[14px]">
                  Find expert answers to your health questions so you can make the best decisions for yourself and your family.
                </p>
                <button className="border-2 border-black rounded-full px-5 py-2 font-bold hover:bg-black hover:text-white transition-all inline-flex items-center gap-2 text-[14px]">
                  Explore CureBasket Health
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className="w-[260px] space-y-8">
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">Health conditions</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Diabetes</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Hypertension</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Allergies</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Autoimmune</li>
                    <li className="text-primary font-bold hover:underline cursor-pointer pt-1">Show all topics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">Medications &amp; treatment</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Medications</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Classes of medications</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Medication comparisons</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">GLP-1 medications</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Dosage guide</li>
                  </ul>
                </div>
              </div>

              <div className="w-[250px] space-y-8">
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">Access &amp; affordability</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Insurance</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Medicare</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Telehealth</li>
                    <li className="text-primary font-bold hover:underline cursor-pointer pt-1">Show all topics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">Well-being</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Sleep</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Diet &amp; nutrition</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Weight loss</li>
                    <li className="text-primary font-bold hover:underline cursor-pointer pt-1">Show all topics</li>
                  </ul>
                </div>
              </div>

              <div className="w-[220px] space-y-5">
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">More</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">About CureBasket Health</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Our editorial guidelines</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Newsletters</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Videos</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Research</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Pet health</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {isGoldMembershipMenuOpen && (
          <div
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-2xl pt-6 pb-8 z-[60] animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => setIsGoldMembershipMenuOpen(true)}
          >
            <div className="max-w-[1450px] mx-auto px-4 md:px-12 flex justify-start gap-14 text-left items-start">
              <div className="w-[270px] space-y-4">
                <h3 className="text-[26px] font-bold text-black tracking-tight leading-tight">CureBasket Gold</h3>
                <p className="text-gray-600 leading-[1.55] text-[14px]">
                  Our monthly healthcare membership can help you save thousands on your prescription costs.
                </p>
                <button className="border-2 border-black rounded-full px-5 py-2 font-bold hover:bg-black hover:text-white transition-all inline-flex items-center gap-2 text-[14px]">
                  Explore CureBasket Gold
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className="w-[210px] space-y-5">
                <div>
                  <h4 className="font-bold text-black mb-4 text-[15px]">Resources</h4>
                  <ul className="space-y-3 text-[13.5px] text-gray-700">
                    <li className="hover:text-primary cursor-pointer transition-colors">Find a Gold pharmacy</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Gold FAQs</li>
                  </ul>
                </div>
              </div>

              <div className="flex-1 flex justify-end">
                <div className="w-full max-w-[590px] rounded-[22px] border border-black/20 bg-white px-6 py-6 shadow-sm">
                  <div className="flex gap-6 items-start">
                    <div className="relative w-[136px] h-[128px] shrink-0">
                      <div className="absolute left-[10px] top-[24px] h-[12px] w-[12px] rounded-full bg-[#ffcf24] border border-black/70" />
                      <div className="absolute left-[112px] top-[18px] h-[10px] w-[10px] rounded-full bg-[#ffcf24] border border-black/70" />
                      <div className="absolute left-[94px] top-[82px] h-[12px] w-[12px] rounded-full bg-[#ffcf24] border border-black/70" />
                      <div className="absolute left-[35px] top-[90px] h-[8px] w-[8px] rounded-full bg-[#ffcf24] border border-black/70" />

                      <div className="absolute left-[56px] top-[8px] h-[18px] w-[18px] rounded-full bg-[#1f1f1f]" />
                      <div className="absolute left-[67px] top-[14px] h-[24px] w-[22px] rounded-t-[12px] rounded-br-[12px] rounded-bl-[8px] bg-[#1f1f1f] border border-black/70" />
                      <div className="absolute left-[81px] top-[20px] h-[10px] w-[9px] rounded-full bg-[#1f1f1f]" />
                      <div className="absolute left-[69px] top-[19px] h-[17px] w-[17px] rounded-[10px] bg-[#c7b089] border border-black/80" />
                      <div className="absolute left-[64px] top-[33px] h-[26px] w-[28px] rounded-[12px] bg-[#ecf1f3] border border-black/80" />
                      <div className="absolute left-[59px] top-[34px] h-[18px] w-[12px] rotate-[22deg] rounded-full bg-[#67b784] border border-black/70" />
                      <div className="absolute left-[87px] top-[38px] h-[26px] w-[10px] rotate-[-12deg] rounded-full bg-[#d9e0e7] border border-black/70" />
                      <div className="absolute left-[66px] top-[56px] h-[14px] w-[24px] rounded-b-[12px] rounded-t-[4px] bg-[#7cc3a0] border border-black/70" />
                      <div className="absolute left-[67px] top-[52px] h-[12px] w-[12px] rotate-[8deg] rounded-full bg-[#c7b089] border border-black/70" />
                      <div className="absolute left-[86px] top-[59px] h-[10px] w-[12px] rotate-[-18deg] rounded-full bg-[#c7b089] border border-black/70" />

                      <div className="absolute left-[40px] top-[56px] h-[42px] w-[44px] rotate-[7deg] rounded-[5px] border border-black/80 bg-[#ffd600]" />
                      <div className="absolute left-[79px] top-[59px] h-[38px] w-[30px] rotate-[7deg] rounded-[5px] border border-black/80 bg-[#f4f4f4]" />

                      <div className="absolute left-[48px] top-[70px] h-[40px] w-[12px] rotate-[33deg] rounded-full bg-[#222] border border-black/70" />
                      <div className="absolute left-[80px] top-[72px] h-[38px] w-[12px] rotate-[12deg] rounded-full bg-[#222] border border-black/70" />
                      <div className="absolute left-[43px] top-[104px] h-[22px] w-[2px] rotate-[46deg] bg-black/80" />
                      <div className="absolute left-[83px] top-[102px] h-[24px] w-[2px] rotate-[78deg] bg-black/80" />
                      <div className="absolute left-[39px] top-[120px] h-[2px] w-[18px] rotate-[16deg] bg-black/80" />
                      <div className="absolute left-[83px] top-[121px] h-[2px] w-[18px] rotate-[-10deg] bg-black/80" />

                      <div className="absolute left-[0] bottom-[10px] h-[1px] w-[136px] bg-black/55" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-[18px] font-bold leading-[1.15] text-black max-w-[290px]">
                        Enjoy more savings &amp; benefits with Gold
                      </h4>
                      <ul className="pt-4 space-y-3">
                        <li className="flex items-start gap-3 text-[13.5px] text-gray-600">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffcf24] text-white font-black">✓</span>
                          <span>Up to $2,862/yr in savings when you fill 2+ prescriptions a month</span>
                        </li>
                        <li className="flex items-start gap-3 text-[13.5px] text-gray-600">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffcf24] text-white font-black">✓</span>
                          <span>Free home delivery on eligible medications</span>
                        </li>
                        <li className="flex items-start gap-3 text-[13.5px] text-gray-600">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffcf24] text-white font-black">✓</span>
                          <span>Discounted virtual care visits for $19</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Section */}
      <section className="px-4 md:px-12 pt-3 pb-6 md:pt-4 md:pb-8 bg-[#f7f2ea] border-t border-[#d8d1c7]">
        <div
          className="max-w-[1200px] mx-auto relative"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsSearchMenuOpen(false)
            }
          }}
        >
          <div className="bg-white rounded-full border-2 border-[#2a2a2a] shadow-[0_12px_30px_rgba(191,162,116,0.18)] p-[3px] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              placeholder="Search for a medication or condition"
              className="flex-1 px-5 py-2.5 text-[16px] text-[#5f6f8a] bg-transparent outline-none placeholder:text-[#5f6f8a]"
              onFocus={() => setIsSearchMenuOpen(true)}
              onClick={() => setIsSearchMenuOpen(true)}
            />
            <button
              className="shrink-0 rounded-full bg-[#111111] text-white px-5 py-2.5 font-semibold text-[16px] flex items-center justify-center gap-2.5 min-w-[160px]"
              onClick={() => setIsSearchMenuOpen(true)}
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              Start saving
            </button>
          </div>

          {isSearchMenuOpen && (
            <div className="absolute left-0 right-0 top-full mt-6 rounded-[34px] border-2 border-[#2a2a2a] bg-white px-7 py-7 shadow-[0_18px_36px_rgba(125,97,53,0.24)] z-20">
              <h3 className="text-[18px] font-semibold text-black">Most popular searches</h3>
              <div className="pt-5 space-y-5">
                {['Foundayo', 'Wegovy', 'Tadalafil (Cialis)', 'Sildenafil', 'Atorvastatin'].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={`w-full flex items-center gap-4 rounded-[14px] px-3 py-3 text-left transition-colors ${index === 4 ? 'bg-[#f3f1ed]' : 'hover:bg-[#f8f6f2]'}`}
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f8f6f2]">
                      <svg className="h-7 w-7 text-[#1f1f1f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 3h6" />
                        <path d="M10 3v3" />
                        <path d="M14 3v3" />
                        <path d="M8.5 6h7a2 2 0 0 1 2 2v10.5A1.5 1.5 0 0 1 16 20H8a1.5 1.5 0 0 1-1.5-1.5V8a2 2 0 0 1 2-2Z" />
                        <path d="M12 10v6" />
                        <path d="M9 13h6" />
                      </svg>
                    </span>
                    <span className="text-[17px] text-black">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 pt-3 text-[16px] text-black">
            <span className="font-bold">Popular searches:</span>
            <span className="border-b border-dotted border-black/40 pb-0.5 hover:border-transparent transition-colors cursor-pointer">Foundayo™</span>
            <span className="border-b border-dotted border-black/40 pb-0.5 hover:border-transparent transition-colors cursor-pointer">Wegovy</span>
            <span className="border-b border-dotted border-black/40 pb-0.5 hover:border-transparent transition-colors cursor-pointer">Tadalafil (Cialis)</span>
            <span className="border-b border-dotted border-black/40 pb-0.5 hover:border-transparent transition-colors cursor-pointer">Sildenafil (Viagra)</span>
            <span className="border-b border-dotted border-black/40 pb-0.5 hover:border-transparent transition-colors cursor-pointer">Atorvastatin</span>
          </div>
        </div>
      </section>

      {/* Treatment Cards Section */}
      <section className="px-4 md:px-12 py-10 bg-[#f7f2ea]">
        <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Weight Loss */}
          <div className="bg-white rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full transform hover:scale-[1.01] transition-transform duration-300">
            <div className="bg-[#00A8A8] py-5 text-center">
              <span className="text-white font-bold text-[13px] tracking-[0.15em] uppercase">Weight Loss Treatment</span>
            </div>



            <div className="flex-1 pt-7 p-4 bg-gradient-to-br from-[#fff5f8] to-[#ffe8f0] relative overflow-hidden">


              <div className="relative z-10">
                <h3 className="text-[17px] font-bold text-[#1a1a1a] leading-[1.1] max-w-[260px]">
                  Need a <span className="text-[#005c8a]">GLP-1 prescription</span> for weight loss?
                </h3>
                <p className="text-[12px] text-[#1a1a1a] mt-1.5 max-w-[220px] leading-[1.3] opacity-90">

                  Get unlimited online care and access to low-cost brand-name GLP-1s.
                </p>
                <div className="mt-10">
                  <button className="bg-[#111] text-white rounded-full px-5 py-2 font-bold text-[13px] flex items-center gap-1.5 hover:bg-black transition-all shadow-md active:scale-95 group">

                    Get started 
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card Assets Image */}
              <div className="absolute -right-3 bottom-2 w-[145px] pointer-events-none">
                <img 
                  src={card1} 
                  alt="Weight Loss Products" 
                  className="w-full h-auto object-contain drop-shadow-[-10px_20px_30px_rgba(0,0,0,0.1)]"
                />
              </div>
            </div>
          </div>







          {/* Card 2: Save on Medication */}
          <div className="bg-white rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full transform hover:scale-[1.01] transition-transform duration-300">
            <div className="bg-[#111] py-1.5 text-center">
              <span className="text-white font-bold text-[13px] tracking-[0.05em] uppercase">Save on GLP-1 Medication</span>
            </div>
            <div className="flex-1 bg-white">
              {[
                { name: 'Foundayo™', desc: '', price: '149', img: card2_1 },
                { name: 'Zepbound®', desc: 'KwikPen and others', price: '299', img: card2_2 },
                { name: 'Wegovy®', desc: 'Tablet, pen, and HD pen', price: '149', img: card2_3 }
              ].map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="p-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 flex items-center justify-center shrink-0">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[18px] text-[#1a1a1a] leading-tight">{item.name}</h4>
                        {item.desc && <p className="text-[12px] text-gray-500 font-medium mt-0.5">{item.desc}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="block text-[11px] text-gray-500 font-bold leading-none mb-0.5">As low as</span>
                        <div className="flex items-start">
                          <span className="text-[14px] font-bold text-[#1a1a1a] mt-0.5">$</span>
                          <span className="text-[24px] font-black text-[#1a1a1a] leading-none">{item.price}</span>
                        </div>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#1a1a1a] group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                  {idx !== 2 && (
                    <div className="border-b-[1.5px] border-dotted border-gray-900/60 mx-0"></div>
                  )}
                </div>
              ))}
            </div>
          </div>




          {/* Card 3: ED Treatment */}
          <div className="bg-white rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full transform hover:scale-[1.01] transition-transform duration-300">
            <div className="bg-[#006093] py-1.5 text-center">
              <span className="text-white font-bold text-[12px] tracking-widest uppercase">ED Treatment</span>
            </div>
            <div className="flex-1 bg-white">
              {[
                { name: 'Sildenafil', sub: 'Generic Viagra', price: '18', img: goli1 },
                { name: 'Tadalafil', sub: 'Generic Cialis', price: '21', img: goli2 }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-colors ${idx === 0 ? 'border-b border-dotted border-gray-300' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-contain drop-shadow-lg hover:scale-110 transition-transform rotate-[-15deg]"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-[18px] text-[#111] leading-none group-hover:text-[#006093] transition-colors">{item.name}</h4>
                      <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase tracking-tighter opacity-80">{item.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[14px] font-bold text-[#111]">$</span>
                        <span className="text-[26px] font-black text-[#111] leading-none">{item.price}</span>
                        <span className="text-[12px] text-gray-500 font-bold ml-0.5">/ mo.</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>



        </div>
      </section>


      {/* Hero Section */}
      <header className="px-4 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 max-w-[1200px] mx-auto">
        <div className="flex-1 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary font-semibold text-sm">
            Welcome to the future of healthcare
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary leading-tight">
            Your Health, <br />
            <span className="text-primary">Our Top Priority.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-lg leading-snug">
            Access world-class medical consultation and medicines from the comfort of your home. Clean, simple, and professional care for everyone.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary px-8 py-4 text-lg">Book Consultation</button>
            <button className="btn-outline px-8 py-4 text-lg">Browse Medicines</button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute -inset-4 gradient-bg opacity-10 blur-3xl rounded-full"></div>
          <img 
            src="/medical_hero_image_new_1776859368254.png" 
            alt="Medical Hero" 
            className="relative rounded-2xl shadow-2xl border-8 border-white w-full object-cover"
          />
        </div>
      </header>

      {/* Stats Section */}
      <section className="section">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center space-y-2">
              <h3 className="text-3xl font-bold text-primary">10k+</h3>
              <p className="text-text-secondary">Verified Doctors</p>
            </div>
            <div className="card text-center space-y-2">
              <h3 className="text-3xl font-bold text-primary">500k+</h3>
              <p className="text-text-secondary">Satisfied Patients</p>
            </div>
            <div className="card text-center space-y-2">
              <h3 className="text-3xl font-bold text-primary">24/7</h3>
              <p className="text-text-secondary">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 md:px-8 py-20 max-w-[1200px] mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Our Medical Services</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            We provide a wide range of services to ensure you get the best medical attention whenever you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Online Pharmacy', icon: '💊', desc: 'Order medicines and get them delivered to your doorstep.' },
            { title: 'Doctor Consultation', icon: '👨‍⚕️', desc: 'Schedule video calls with top-rated medical specialists.' },
            { title: 'Lab Tests', icon: '🧪', desc: 'Book blood tests and health checkups from trusted labs.' },
            { title: 'Health Records', icon: '📁', desc: 'Securely store and manage all your medical documents.' }
          ].map((service, index) => (
            <div key={index} className="card group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:gradient-bg group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-text-secondary text-sm leading-normal">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 md:px-8 bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">CureBasket</span>
          </div>
          <p className="text-text-secondary text-sm">
            © 2024 CureBasket Healthcare. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
