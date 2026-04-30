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
    <div className="sticky top-0 z-50 bg-[#f7f2ea]">
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
        <nav className="navbar">
          <div className="max-w-[1450px] mx-auto w-full flex items-center justify-between px-4 md:px-12">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group shrink-0">
              <img src={curebasketLogo} alt="CureBasket Logo" className="w-14 h-14 object-contain" />
              <span className="text-[28px] font-bold tracking-tight text-primary">CureBasket</span>
            </div>

            {/* Nav Links */}
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
                onMouseEnter={() => { setIsMensHealthOpen(true); setIsAllCategoriesMenuOpen(false) }}
              >
                <a href="#" className="nav-link flex items-center gap-1.5">
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
