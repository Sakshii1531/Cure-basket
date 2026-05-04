import React from 'react'
import { useNavigate } from 'react-router-dom'

const allReviews = [
  { name: "Kate", title: "MRS.", date: "April 14, 2026", rating: 5, text: "Easy to order and order came in good time. Glad to have access to this pharmacy. Will be reordering again soon. Great prices and fast shipping!" },
  { name: "Debra", title: "JUST WHAT I NEEDED", date: "April 14, 2026", rating: 5, text: "Went online, placed my order, and received it in no time. Super simple and Just what I needed! The website is very easy to navigate and checkout was smooth." },
  { name: "Janet", title: "GREAT SERVICE", date: "April 14, 2026", rating: 5, text: "Every time I place an order, they are fast and efficient. Orders come before their stated time line. I have been using CureBasket for over a year now and I'm very satisfied." },
  { name: "Kathleen", title: "MS.", date: "April 14, 2026", rating: 5, text: "I am a repeat buyer from CureBasket Pharmacy. For my recent purchase the ordering and purchase process was seamless. Would highly recommend to anyone looking for affordable medicines." },
  { name: "Sarah", title: "EXCELLENT", date: "April 15, 2026", rating: 5, text: "Very happy with the service. The packaging was discrete and secure. Definitely recommending to friends and family. Will be purchasing again soon!" },
  { name: "Michael", title: "RELIABLE", date: "April 16, 2026", rating: 5, text: "Prompt delivery and authentic products. The customer support is also very helpful with queries. I had a question about my order and it was resolved within minutes." },
  { name: "Linda", title: "HIGHLY RECOMMEND", date: "April 17, 2026", rating: 5, text: "I was skeptical at first but CureBasket proved me wrong. Fast delivery, genuine products, and excellent customer service. I'll definitely be a regular customer." },
  { name: "James", title: "FAST DELIVERY", date: "April 17, 2026", rating: 4, text: "Very fast delivery, arrived two days early! Product quality is excellent and packaging was intact. The app is very user-friendly too." },
  { name: "Patricia", title: "GREAT PRICES", date: "April 18, 2026", rating: 5, text: "The prices here are much better than my local pharmacy. Same brands, much better rates. I've been saving a lot since I switched to CureBasket." },
  { name: "Robert", title: "TRUSTWORTHY", date: "April 18, 2026", rating: 5, text: "As someone who orders medications regularly, finding a trustworthy online pharmacy is key. CureBasket has been consistent with quality and delivery every single time." },
  { name: "Susan", title: "WONDERFUL EXPERIENCE", date: "April 19, 2026", rating: 5, text: "From browsing to checkout to delivery — everything was smooth and professional. The tracking feature is great. Will definitely come back for future orders." },
  { name: "David", title: "IMPRESSED", date: "April 20, 2026", rating: 4, text: "Really impressed with the range of products available. Found everything I needed in one place. Delivery was on time and packaging was good." },
]

const StarRating = ({ rating }) => (
  <div className="flex text-[#FFD200] text-sm">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={i <= rating ? 'text-[#FFD200]' : 'text-gray-200'}>★</span>
    ))}
  </div>
)

const AllReviewsPage = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-12 py-3 sticky top-0 z-50 grid grid-cols-3 items-center">
        <div className="flex justify-start">
          <button onClick={() => navigate(-1)} className="p-1 group flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="hidden md:inline font-medium text-gray-500 text-[13px]">Back</span>
          </button>
        </div>
        <div className="flex justify-center">
          <h1 className="text-[16px] md:text-[20px] font-semibold text-gray-800 whitespace-nowrap">All Reviews</h1>
        </div>
        <div className="flex justify-end"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-8">
        {/* Rating Summary */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4">
            <span className="text-[52px] font-bold text-gray-900 leading-none">4.9</span>
            <div className="flex flex-col">
              <div className="flex text-[#FFD200] text-xl">
                {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
              </div>
              <span className="text-[#006D6D] font-bold text-[14px]">38324 Reviews</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allReviews.map((rev, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[16px] font-bold text-[#006D6D]">{rev.name}</span>
                <StarRating rating={rev.rating} />
              </div>
              <h4 className="font-black text-gray-900 text-[13px] uppercase tracking-tight mb-2">{rev.title}</h4>
              <p className="text-gray-600 text-[13px] leading-relaxed flex-grow">"{rev.text}"</p>
              <span className="text-gray-400 text-[11px] font-medium mt-4">{rev.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllReviewsPage
