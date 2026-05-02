import React from 'react'

function SearchBar() {
  return (
    <div className="bg-[#f0fafa] py-4 px-4 md:px-12">
      <div className="max-w-[1050px] mx-auto">
        <div className="relative max-w-[1050px] mx-auto">
          <div className="flex items-center w-full bg-white rounded-full border border-gray-200 p-1 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow focus-within:shadow-[0_4px_25px_rgba(0,0,0,0.1)] mb-3">
            <input
              type="text"
              placeholder="Search for a medication or condition"
              className="flex-grow px-6 md:px-10 py-0.5 md:py-1 rounded-full focus:outline-none text-gray-700 text-[15px] md:text-[17px] placeholder:text-[12px] md:placeholder:text-[14px] placeholder-gray-400 font-medium"
            />
            <div className="flex items-center gap-2 shrink-0 pr-1">
              <button className="flex items-center justify-center bg-[#006D6D] text-white w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-[#005a5a] transition-all group">
                <svg 
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="bg-[#006D6D] text-white px-5 md:px-8 py-1.5 md:py-2 rounded-full hover:bg-[#005a5a] transition-all">
                <span className="font-bold text-[14px] md:text-[15px] tracking-tight whitespace-nowrap">Start saving</span>
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 mt-4">
            <span className="text-[13px] md:text-[14px] font-bold text-gray-800">Popular searches:</span>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              {['Foundayo™', 'Wegovy', 'Tadalafil (Cialis)', 'Sildenafil (Viagra)', 'Atorvastatin'].map((term) => (
                <a 
                  key={term} 
                  href="#" 
                  className="bg-white px-4 py-1.5 rounded-full text-[12px] md:text-[13.5px] font-bold text-[#006D6D] border border-gray-100 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
                >
                  {term}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
