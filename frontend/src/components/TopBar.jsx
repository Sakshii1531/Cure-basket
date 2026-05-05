function TopBar({ openSupport }) {
  return (
    <div className="top-bar hidden xl:block">
      <div className="max-w-[1450px] mx-auto w-full flex justify-end items-center px-4 md:px-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => openSupport('contact')}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-[13.5px] font-bold group"
          >
            <svg className="w-4 h-4 text-primary group-hover:text-primary-dark transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contact Us
          </button>
          <button 
            onClick={() => openSupport('call')}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-[13.5px] font-bold group"
          >
            <svg className="w-4 h-4 text-primary group-hover:text-primary-dark transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Click to Call
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopBar
