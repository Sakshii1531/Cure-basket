import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import med1 from '../assets/med1.png'

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

const badges = [
  { badge: 'Best Seller', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900' },
  { badge: 'Popular', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white' },
  { badge: 'Top Rated', badgeBg: 'bg-[#FFD200]', badgeText: 'text-gray-900' },
  { badge: 'New', badgeBg: 'bg-[#006D6D]', badgeText: 'text-white' },
]

function MedicinesPage({ onProductClick }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const brandFilter = queryParams.get('brand')
  const brandName = queryParams.get('brandName')

  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popularity')
  const [total, setTotal] = useState(0)

  const fetchMedicines = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: 100 })
    if (search.trim()) params.set('name[regex]', search.trim())
    if (brandFilter) params.set('brand', brandFilter)
    api.get(`/medicines?${params}`)
      .then(res => {
        let data = res.data.data || []
        setTotal(res.data.total || data.length)
        if (sort === 'price_asc') data = [...data].sort((a, b) => a.price - b.price)
        else if (sort === 'price_desc') data = [...data].sort((a, b) => b.price - a.price)
        setMedicines(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, sort, brandFilter])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const delay = setTimeout(fetchMedicines, 300)
    return () => clearTimeout(delay)
  }, [fetchMedicines])

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 py-8 md:py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#006D6D] transition-colors mb-6 font-medium group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-[32px] md:text-[42px] font-bold text-gray-900 tracking-tight mb-3">All Medicines</h1>
          <p className="text-gray-500 text-[16px] max-w-2xl leading-relaxed">
            Browse our wide range of genuine medications. Trusted quality, delivered to you.
          </p>
        </div>

        {brandName && (
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-[#006D6D]/10 text-[#006D6D] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
              Brand: {brandName}
              <button 
                onClick={() => navigate('/medicines')}
                className="hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 pb-4 border-b border-gray-200">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-gray-400 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#006D6D] focus:outline-none focus:ring-2 focus:ring-[#006D6D] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <span className="text-[14px] font-bold text-gray-400 sm:ml-auto whitespace-nowrap">
            {loading ? '...' : `${medicines.length} Found`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[24px] h-72 animate-pulse" />
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">No medicines found</p>
            {search && <p className="text-sm mt-1">Try a different search term</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {medicines.map((product, i) => {
              const { badge, badgeBg, badgeText } = badges[i % badges.length]
              return (
                <div
                  key={product._id}
                  onClick={() => onProductClick?.(product)}
                  className="bg-white rounded-[24px] border border-gray-100 p-4 md:p-6 relative flex flex-col h-full cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`absolute top-3 right-3 px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-sm z-10 ${badgeBg} ${badgeText}`}>
                    {badge}
                  </div>

                  <div className="flex flex-col flex-grow">
                    <div className="w-full h-[120px] md:h-[160px] flex items-center justify-center mb-4 md:mb-6">
                      <img
                        src={product.image || med1}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        onError={e => { e.target.src = med1 }}
                      />
                    </div>

                    <div className="flex flex-col text-left">
                      <h3 className="text-[14px] md:text-[17px] font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#006D6D] transition-colors min-h-[40px] md:min-h-[44px]">
                        {product.name}
                      </h3>
                      {product.genericName && (
                        <p className="text-[#006D6D] font-semibold text-[11px] md:text-[13px] mb-2 md:mb-3">
                          ({product.genericName})
                        </p>
                      )}
                      <div className="flex items-center gap-1 mb-4">
                        <svg className="w-3 md:w-4 h-3 md:h-4 text-[#FFD200]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className="text-[12px] md:text-[14px] font-bold text-gray-900">{product.rating || '4.5'}</span>
                        <span className="text-[12px] md:text-[14px] text-gray-400">({product.reviewCount || 0})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-50">
                    <div className="flex flex-col text-left">
                      {product.originalPrice && (
                        <span className="text-[10px] md:text-[12px] text-gray-400 line-through font-medium leading-none mb-0.5">
                          ₹{product.originalPrice}
                        </span>
                      )}
                      <span className="text-[20px] md:text-[24px] font-black text-gray-900 leading-none">
                        ₹{product.price}
                      </span>
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); addToCart({ ...product, _id: product._id }) }}
                      className="w-9 h-9 md:w-11 md:h-11 bg-[#FFD200] rounded-full flex items-center justify-center text-white shadow-md active:scale-95 hover:bg-[#f39c12] transition-colors"
                    >
                      <svg className="w-5 md:w-6 h-5 md:h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicinesPage
