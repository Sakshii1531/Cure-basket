import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const StarRating = ({ rating }) => (
  <div className="flex text-sm">
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} className={i <= rating ? 'text-accent' : 'text-gray-200'}>★</span>
    ))}
  </div>
)

function SkeletonReview() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="h-3 w-32 bg-gray-100 rounded mb-2" />
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
      </div>
      <div className="h-3 w-16 bg-gray-100 rounded mt-4" />
    </div>
  )
}

const AllReviewsPage = () => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [avgRating, setAvgRating] = useState(0)

  useEffect(() => {
    api.get('/reviews/approved?limit=50')
      .then(res => {
        setReviews(res.data.data || [])
        setTotal(res.data.total || 0)
        setAvgRating(res.data.avgRating || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-12 py-3 sticky top-0 z-50 grid grid-cols-3 items-center">
        <div className="flex justify-start">
          <button onClick={() => navigate(-1)} className="p-1 group flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden md:inline font-medium text-gray-500 text-[13px]">Back</span>
          </button>
        </div>
        <div className="flex justify-center">
          <h1 className="text-[16px] md:text-[20px] font-semibold text-gray-800 whitespace-nowrap">All Reviews</h1>
        </div>
        <div className="flex justify-end" />
      </div>

      <div className="max-w-300 mx-auto px-4 md:px-12 py-8">
        {/* Rating Summary */}
        {!loading && total > 0 && (
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-4">
              <span className="text-[52px] font-bold text-gray-900 leading-none">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
              <div className="flex flex-col">
                <div className="flex text-accent text-xl">
                  {[1, 2, 3, 4, 5].map(i => <span key={i}>★</span>)}
                </div>
                <span className="text-primary font-bold text-[14px]">{total.toLocaleString()} Review{total !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonReview key={i} />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No reviews yet. Be the first to review a product!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[16px] font-bold text-primary">{rev.user?.name || 'Customer'}</span>
                  <StarRating rating={rev.rating} />
                </div>
                {rev.medicine?.name && (
                  <h4 className="font-black text-gray-900 text-[13px] uppercase tracking-tight mb-2 line-clamp-1">{rev.medicine.name}</h4>
                )}
                {rev.comment && (
                  <p className="text-gray-600 text-[13px] leading-relaxed grow">"{rev.comment}"</p>
                )}
                <span className="text-gray-400 text-[11px] font-medium mt-4">
                  {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllReviewsPage
