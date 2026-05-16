import React from 'react'

function SearchBar() {
  return (
    <div className="bg-white md:bg-[#f0fafa] py-3 md:py-4 px-4 md:px-12">
      <div className="max-w-[1050px] mx-auto">
        <div className="relative max-w-[1050px] mx-auto">
          <div className="flex items-center w-full bg-white rounded-lg md:rounded-full border border-gray-300 md:border-gray-200 p-0 shadow-sm md:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow focus-within:shadow-[0_4px_25px_rgba(0,0,0,0.1)] mb-3 overflow-hidden">
            <input
              type="text"
              placeholder="Search for a medication or condition"
              className="flex-grow px-4 md:px-10 py-3 md:py-1 focus:outline-none text-gray-700 text-[14px] md:text-[17px] placeholder:text-[12px] md:placeholder:text-[14px] placeholder-gray-400 font-medium"
            />
            <div className="flex items-center gap-0 shrink-0">
              <div className="w-[1px] h-8 bg-gray-100 md:hidden"></div>
              <button className="flex items-center justify-center bg-transparent md:bg-[#006D6D] text-gray-400 md:text-white w-12 h-12 md:w-10 md:h-10 rounded-none md:rounded-full hover:bg-gray-50 md:hover:bg-[#005a5a] transition-all group md:mr-1.5">
                <svg 
                  className="w-6 h-6 md:w-5 md:h-5 transition-transform group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4">
            <span className="text-[13px] md:text-[14px] font-bold text-gray-800 shrink-0 hidden md:block">Popular searches:</span>
            <div className="flex overflow-x-auto no-scrollbar md:flex-wrap gap-2 pb-1 w-full md:w-auto px-2 md:px-0">
              {['Foundayo™', 'Wegovy', 'Tadalafil (Cialis)', 'Sildenafil (Viagra)', 'Atorvastatin'].map((term) => (
                <a 
                  key={term} 
                  href="#" 
                  className="bg-white px-4 py-1.5 rounded-full text-[12px] md:text-[13.5px] font-bold text-[#006D6D] border border-gray-100 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all whitespace-nowrap"
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
