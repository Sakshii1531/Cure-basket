import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import curebasketLogo from '../assets/logo1.png'

function Navbar({
  isPrescriptionMenuOpen,
  setIsPrescriptionMenuOpen,
  isOnlineCareMenuOpen,
  setIsOnlineCareMenuOpen,
  isHealthInfoMenuOpen,
  setIsHealthInfoMenuOpen,
  isGoldMembershipMenuOpen,
  setIsGoldMembershipMenuOpen,
  isAllCategoriesMenuOpen,
  setIsAllCategoriesMenuOpen,
  isMensHealthOpen,
  setIsMensHealthOpen,
  openSupport
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const goToCategory = (cat) => {
    setIsAllCategoriesMenuOpen(false)
    setIsMensHealthOpen(false)
    navigate(`/category/${encodeURIComponent(cat)}`)
  }

  return (
    <div className="sticky top-0 z-50 bg-white">
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="xl:hidden pl-4 pr-4 py-0 flex flex-col gap-0 border-b border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-end justify-between py-0">
          {/* Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer py-0 mb-[-8px]">
            <img src={curebasketLogo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          <div className="flex flex-col items-end gap-0.5 justify-center py-0 pb-1">
            {/* Top row: Contact */}
            <div className="flex items-center gap-3 text-[#006D6D] pr-1">
              <button 
                onClick={() => openSupport('contact')}
                className="flex items-center gap-1 active:scale-95 transition-transform"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span className="text-[10px] font-bold">Contact Us</span>
              </button>
              <button 
                onClick={() => openSupport('call')}
                className="flex items-center gap-1 active:scale-95 transition-transform"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span className="text-[10px] font-bold">Click to Call</span>
              </button>
            </div>
            {/* Bottom row: Icons */}
            <div className="flex items-center gap-4">
              <button className="text-gray-800">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </button>
              <div className="w-[1px] h-6 bg-gray-200"></div>
              <button className="text-gray-800">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </button>
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-800 ml-1">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative hidden xl:block"
        onMouseLeave={() => {
          setIsPrescriptionMenuOpen(false)
          setIsOnlineCareMenuOpen(false)
          setIsHealthInfoMenuOpen(false)
          setIsGoldMembershipMenuOpen(false)
          setIsAllCategoriesMenuOpen(false)
          setIsMensHealthOpen(false)
        }}
      >
        {/* Navbar (Desktop Only) */}
        <nav className="navbar h-[80px] flex items-center shadow-sm">
          <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between px-8 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group shrink-0">
              <img src={curebasketLogo} alt="CureBasket Logo" className="w-12 h-12 object-contain" />
              <span className="text-[24px] font-bold tracking-tight text-[#006D6D]">CureBasket</span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6 shrink-0">
              <a href="#" className="nav-link text-[13px]">Medicines</a>
              
              <div className="flex flex-col items-center translate-y-2">
                <a href="#" className="nav-link text-[13px]">Upload Rx</a>
                <span className="bg-[#f39c12] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm whitespace-nowrap -mt-0.5">Fast order</span>
              </div>

              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setIsAllCategoriesMenuOpen(true)}
              >
                <a href="#" className="nav-link flex items-center gap-1 text-[13px]">
                  All Categories
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </a>
              </div>

              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => { setIsMensHealthOpen(true); setIsAllCategoriesMenuOpen(false) }}
              >
                <a href="#" className="nav-link flex items-center gap-1 text-[13px]">
                  Men's Health
                  <svg className={`w-3.5 h-3.5 transition-transform ${isMensHealthOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </a>
                {isMensHealthOpen && (
                  <div className="absolute top-full left-0 min-w-[240px] bg-white border border-gray-200 shadow-xl z-[70] mt-0">
                    <div className="flex flex-col">
                      <button onClick={() => goToCategory('Sildenafil')} className="px-5 py-3 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 border-b border-gray-100 transition-colors text-left">The Blue Pill (Sildenafil)</button>
                      <button onClick={() => goToCategory('Tadalafil')} className="px-5 py-3 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 border-b border-gray-100 transition-colors text-left">The WeekEndPill (Tadalafil)</button>
                      <button onClick={() => goToCategory('Vardenafil')} className="px-5 py-3 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors text-left">Vardenafil</button>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => goToCategory('Eye Care')} className="nav-link text-[13px]">Eye Care</button>

              <button onClick={() => navigate('/track-order')} className="nav-link flex items-center gap-2 text-[13px]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Track Order
              </button>
            </div>

            {/* Search Bar Integrated */}
            <div className="flex flex-1 max-w-[400px] items-center relative mx-4">
              <input 
                type="text" 
                placeholder="Search for medicines or conditions..." 
                className="w-full h-11 pl-5 pr-12 rounded-full border border-gray-200 focus:outline-none focus:border-[#006D6D] text-[14px] shadow-sm"
              />
              <button className="absolute right-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 shrink-0">
              <button className="bg-[#006D6D] text-white px-6 py-2.5 rounded-full font-bold text-[14px] hover:bg-[#005a5a] transition-all shadow-md">
                Start Saving
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] xl:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={curebasketLogo} alt="Logo" className="w-8 h-8" />
                    <span className="font-bold text-[#006D6D] text-[18px]">CureBasket</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="space-y-4">
                    <a href="#" className="block text-[15px] font-bold text-gray-800">Medicines</a>
                    <a href="#" className="block text-[15px] font-bold text-gray-800 flex items-center gap-2">
                      Upload Rx
                      <span className="bg-[#f39c12] text-white text-[9px] px-2 py-0.5 rounded-full">Fast order</span>
                    </a>
                    <a href="#" className="block text-[15px] font-bold text-gray-800">All Categories</a>
                    <a href="#" className="block text-[15px] font-bold text-gray-800">Men's Health</a>
                    <a href="#" className="block text-[15px] font-bold text-gray-800">Eye Care</a>
                    <a href="#" className="block text-[15px] font-bold text-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                      Track Order
                    </a>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <button className="w-full bg-[#006D6D] text-white py-3 rounded-xl font-bold text-[14px]">
                      Start Saving
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Categories Mega Menu (Desktop Only) */}
        {isAllCategoriesMenuOpen && (
          <div
            className="hidden xl:block absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-2xl pt-8 pb-10 z-[60] animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => setIsAllCategoriesMenuOpen(true)}
          >
            <div className="max-w-[1450px] mx-auto px-4 md:px-12 grid grid-cols-4 gap-12">
              <div className="space-y-2">
                {['Acid Reflux', 'Acne', 'Alcohol & Drug Treatment', 'Allergy', 'Alpha Blockers', 'Alzheimers', 'Angina Pectoris Anti-Anginals', 'Anthelmintic & Anti-worm', 'Anti Amebics', 'Anti Androgen', 'Anti Cancer', 'Anti Coagulants', 'Anti Convulsant'].map(cat => (
                  <div key={cat} onClick={() => goToCategory(cat)} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
              <div className="space-y-2">
                {['Anti Emetic', 'Anti Migraine', 'Anti Parkinsonian', 'Anti Viral', 'Antibiotics', 'Antifungal', 'Asthma', 'Available Products', 'Beauty & Skin Care', 'Best selling Products', 'Birth Control', 'Bladder Prostate', 'Diabetes'].map(cat => (
                  <div key={cat} onClick={() => goToCategory(cat)} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
              <div className="space-y-2">
                {['ED Pills Online', 'Eye Care', 'Featured Products', 'Free Shipping Products', 'Gastro Health', 'Hair Loss', 'Heart & Blood Pressure', 'HIV & Herpes', 'Hypothyroidism', 'Immunosuppressive', 'Infertility Therapy', 'Melasma'].map(cat => (
                  <div key={cat} onClick={() => goToCategory(cat)} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
              <div className="space-y-2">
                {["Men's Health", 'New Products', 'Offers', 'Osteoporosis', 'Others', 'Pain Relief', 'Quit Smoking', 'Sildenafil Citrate', 'Stock Clearance', 'Weight Loss', "Women's Day", "Women's Health"].map(cat => (
                  <div key={cat} onClick={() => goToCategory(cat)} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
