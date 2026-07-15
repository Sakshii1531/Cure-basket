import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function Testimonials() {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [avgRating, setAvgRating] = useState(0)
  const [total, setTotal] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    api.get('/reviews/approved?limit=12')
      .then(res => {
        setReviews(res.data.data || [])
        setAvgRating(res.data.avgRating || 0)
        setTotal(res.data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const slideCount = reviews.length
  useEffect(() => {
    if (slideCount === 0) return
    const loopCount = slideCount > 4 ? slideCount + 1 : slideCount
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % loopCount)
    }, 5000)
    return () => clearInterval(timer)
  }, [slideCount])

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch {
      return ''
    }
  }

  return (
    <section id="service-reviews" className="bg-white pb-10 md:pb-16 pt-0 px-4 md:px-12 overflow-hidden">
      <div className="max-w-350 mx-auto">

        {/* Header Rating */}
        {!loading && total > 0 && (
          <div className="flex flex-col items-center mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4">
              <span className="text-[36px] md:text-[56px] font-bold text-gray-800 leading-none">
                {avgRating > 0 ? avgRating.toFixed(1) : '—'}
              </span>
              <div className="flex flex-col">
                <div className="flex text-accent">
                  {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-lg md:text-xl">★</span>)}
                </div>
                <span className="text-primary font-bold text-[12px] md:text-[14px]">
                  {total.toLocaleString()} Review{total !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex gap-4 overflow-hidden mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-1/2 lg:w-1/4 shrink-0 px-2 py-4 animate-pulse">
                <div className="bg-gray-50 p-4 md:p-6 rounded-[20px] h-48">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-16 bg-gray-100 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 w-2/3 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carousel */}
        {!loading && reviews.length > 0 && (
          <div className="relative max-w-275 mx-auto overflow-hidden px-4 md:px-0">
            <div
              className={`flex ${currentIndex === 0 ? '' : 'transition-transform duration-700 ease-in-out'}`}
              style={{ transform: `translateX(-${currentIndex * (typeof window !== 'undefined' && window.innerWidth < 768 ? 85 : 25)}%)` }}
              onTransitionEnd={() => { if (currentIndex >= reviews.length) setCurrentIndex(0) }}
            >
              {(reviews.length > 4 ? [...reviews, ...reviews.slice(0, 4)] : reviews).map((rev, i) => (
                <div key={`${rev._id}-${i}`} className="w-[85%] md:w-1/2 lg:w-1/4 shrink-0 px-2 py-4">
                  <div className="bg-gray-50 p-4 md:p-6 rounded-[20px] flex flex-col h-full shadow-sm hover:shadow-md transition-all border border-gray-200">
                    <span className="text-primary font-bold text-[16px] md:text-[18px] mb-1">
                      {rev.user?.name || 'Customer'}
                    </span>
                    <div className="flex text-accent text-xs md:text-sm mb-2 md:mb-3">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={s <= rev.rating ? 'text-accent' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                    {rev.medicine?.name && (
                      <h4 className="font-black text-gray-900 text-[12px] md:text-[14px] mb-2 md:mb-3 uppercase tracking-tight line-clamp-1">
                        {rev.medicine.name}
                      </h4>
                    )}
                    <p className="text-gray-600 text-[12px] md:text-[13px] leading-snug text-justify mb-4 md:mb-6 grow font-medium line-clamp-4">
                      "{rev.comment || 'Great product!'}"
                    </p>
                    <span className="text-gray-500 text-[11px] md:text-[12px] font-medium">
                      {formatDate(rev.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Be the first to review a product!
          </div>
        )}

        <div className="flex justify-center mt-4 md:mt-12">
          <button
            onClick={() => navigate('/all-reviews')}
            className="bg-[#004d4d] text-white px-12 py-3 rounded-xl font-bold text-[14px] transition-all shadow-lg hover:shadow-xl hover:bg-[#004d4d]/90 active:scale-95"
          >
            Read All Reviews
          </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
