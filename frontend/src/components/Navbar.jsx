import curebasketLogo from '../assets/logo1.png'

function Navbar({
  isPrescriptionMenuOpen, setIsPrescriptionMenuOpen,
  isOnlineCareMenuOpen, setIsOnlineCareMenuOpen,
  isHealthInfoMenuOpen, setIsHealthInfoMenuOpen,
  isGoldMembershipMenuOpen, setIsGoldMembershipMenuOpen,
  isAllCategoriesMenuOpen, setIsAllCategoriesMenuOpen,
  isMensHealthOpen, setIsMensHealthOpen,
}) {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div
        className="relative"
        onMouseLeave={() => {
          setIsPrescriptionMenuOpen(false)
          setIsOnlineCareMenuOpen(false)
          setIsHealthInfoMenuOpen(false)
          setIsGoldMembershipMenuOpen(false)
          setIsAllCategoriesMenuOpen(false)
          setIsMensHealthOpen(false)
        }}
      >
        {/* Navbar */}
        <nav className="navbar h-[80px] flex items-center">
          <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between px-4 md:px-8 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group shrink-0">
              <img src={curebasketLogo} alt="CureBasket Logo" className="w-12 h-12 object-contain" />
              <span className="text-[24px] font-bold tracking-tight text-[#006D6D]">CureBasket</span>
            </div>

            {/* Nav Links */}
            <div className="hidden xl:flex items-center gap-6 shrink-0">
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
                      <a href="#" className="px-5 py-3 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 border-b border-gray-100 transition-colors">The Blue Pill (Sildenafil)</a>
                      <a href="#" className="px-5 py-3 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 border-b border-gray-100 transition-colors">The WeekEndPill (Tadalafil)</a>
                      <a href="#" className="px-5 py-3 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors">Vardenafil</a>
                    </div>
                  </div>
                )}
              </div>

              <a href="#" className="nav-link text-[13px]">Eye Care</a>

              <a href="#" className="nav-link flex items-center gap-2 text-[13px]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Track Order
              </a>
            </div>

            {/* Search Bar Integrated */}
            <div className="hidden lg:flex flex-1 max-w-[400px] items-center relative mx-4">
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
              <button className="text-gray-800 p-1">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
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
              <div className="space-y-2">
                {['Acid Reflux', 'Acne', 'Alcohol & Drug Treatment', 'Allergy', 'Alpha Blockers', 'Alzheimers', 'Angina Pectoris Anti-Anginals', 'Anthelmintic & Anti-worm', 'Anti Amebics', 'Anti Androgen', 'Anti Cancer', 'Anti Coagulants', 'Anti Convulsant'].map(cat => (
                  <div key={cat} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
              <div className="space-y-2">
                {['Anti Emetic', 'Anti Migraine', 'Anti Parkinsonian', 'Anti Viral', 'Antibiotics', 'Antifungal', 'Asthma', 'Available Products', 'Beauty & Skin Care', 'Best selling Products', 'Birth Control', 'Bladder Prostate', 'Diabetes'].map(cat => (
                  <div key={cat} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
              <div className="space-y-2">
                {['ED Pills Online', 'Eye Care', 'Featured Products', 'Free Shipping Products', 'Gastro Health', 'Hair Loss', 'Heart & Blood Pressure', 'HIV & Herpes', 'Hypothyroidism', 'Immunosuppressive', 'Infertility Therapy', 'Melasma'].map(cat => (
                  <div key={cat} className="text-[13.5px] text-gray-700 hover:text-primary cursor-pointer transition-colors leading-tight">{cat}</div>
                ))}
              </div>
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
  )
}

export default Navbar
