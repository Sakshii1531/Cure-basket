import { useState, useEffect } from 'react'

const reviews = [
  { name: "Kate", title: "MRS.", date: "April 14, 2026", text: "Easy to order and order came in good time. Glad to have access to this pharmacy. Will be reorderin..." },
  { name: "Debra", title: "JUST WHAT I NEEDED", date: "April 14, 2026", text: "Went online, placed my order, and received it in no time. Super simple and Just what I needed!" },
  { name: "Janet", title: "GREAT SERVICE", date: "April 14, 2026", text: "Every time I place an order, they are fast and efficient. Orders come before their stated time lin..." },
  { name: "Kathleen", title: "MS.", date: "April 14, 2026", text: "I am a repeat buyer from CureBasket Pharmacy. For my recent purchase the ordering and purchase ..." },
  { name: "Sarah", title: "EXCELLENT", date: "April 15, 2026", text: "Very happy with the service. The packaging was discrete and secure. Definitely recommending to friends!" },
  { name: "Michael", title: "RELIABLE", date: "April 16, 2026", text: "Prompt delivery and authentic products. The customer support is also very helpful with queries." }
]

function Testimonials() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReviewIndex(prev => (prev + 1) % (reviews.length + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
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

        {/* Carousel */}
        <div className="relative max-w-[1100px] mx-auto overflow-hidden">
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

          <div
            className={`flex ${currentReviewIndex === 0 ? '' : 'transition-transform duration-700 ease-in-out'}`}
            style={{ transform: `translateX(-${currentReviewIndex * (100 / 4)}%)` }}
            onTransitionEnd={() => { if (currentReviewIndex >= reviews.length) setCurrentReviewIndex(0) }}
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

        <div className="flex justify-center mt-12">
          <button className="bg-[#004D4D] text-white px-12 py-3 rounded-xl font-bold text-[14px] transition-all shadow-lg hover:shadow-xl hover:bg-[#003333] active:scale-95">
            Read All Reviews
          </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
