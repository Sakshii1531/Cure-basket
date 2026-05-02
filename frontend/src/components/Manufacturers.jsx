import { useState } from 'react'

const manufacturersList = "Ranbaxy Laboratories Ltd. | Cipla Ltd. | Dr. Reddy'S Laboratories Ltd. | Nicholas Piramal India Ltd. | Aurobindo Pharma Ltd. | Glaxosmithkline Pharmaceuticals Ltd. | Lupin Ltd. | Cadila Healthcare Ltd. | Sun Pharmaceutical Inds. Ltd. | Wockhardt Ltd. | Aventis Pharma Ltd. | Orchid Chemicals & Pharmaceuticals Ltd. | Ipca Laboratories Ltd. | Alembic Ltd. | Pfizer Ltd. | Morepen Laboratories Ltd. | U S V Ltd. | Matrix Laboratories Ltd. | Biocon Ltd. | Novartis India Ltd. | Torrent Pharmaceuticals Ltd. | Abbott India Ltd."

function Manufacturers() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="bg-white pt-8 pb-8 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto bg-[#f8f8f8] rounded-[32px] border border-gray-100 p-8 md:p-12 text-center">
        <h2 className="text-[20px] md:text-[24px] font-bold text-[#004D4D] uppercase tracking-wider mb-6">
          MANUFACTURES
        </h2>
        <p className={`text-[14px] md:text-[15px] text-gray-600 leading-tight tracking-tight text-justify mb-8 font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>
          We order our drugs from reputed international manufacturers and are made available for sale after careful scrutiny of the quality. This way we can spend more time and efforts to help you when you buy medicine online. These drugs sold in other countries are known by other brand names, but generically they are the same drugs.
          {isExpanded && <> {manufacturersList} | {manufacturersList} | {manufacturersList}</>}
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white px-10 py-3 rounded-xl font-bold text-[14px] transition-all duration-300 shadow-lg active:scale-95 bg-[#004D4D] hover:bg-[#003333]"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Manufacturers
