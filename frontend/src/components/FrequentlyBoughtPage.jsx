import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthGate } from '../hooks/useAuthGate'
import { useCart } from '../context/CartContext'
import { isOutOfStock } from '../utils/stockUtils'
import api from '../utils/api'
import productImg from '../assets/product.png'
import ImageWithFallback from './ImageWithFallback'

// Keep category banner assets for visual branding
import allergyBanner from '../assets/allergy_banner_1777890268903.png'
import diabetesBanner from '../assets/diabetes_banner_1777890391063.png'
import skinCareBanner from '../assets/skin_care_banner_1777890407540.png'
import antibioticsBanner from '../assets/antibiotics_banner_1777890422969.png'
import painBanner from '../assets/pain_relief_banner_1777890437621.png'
import hairLossBanner from '../assets/hair_loss_banner_1777890597175.png'

const CATEGORY_META = {
  allergy: { color: 'bg-[#E6F7F7]', textColor: 'text-primary', image: allergyBanner },
  diabetes: { color: 'bg-[#FFF8E7]', textColor: 'text-accent', image: diabetesBanner },
  pain: { color: 'bg-[#f0f9ff]', textColor: 'text-blue-600', image: painBanner },
  'pain-relief': { color: 'bg-[#f0f9ff]', textColor: 'text-blue-600', image: painBanner },
  'skin-care': { color: 'bg-pink-50', textColor: 'text-pink-600', image: skinCareBanner },
  antibiotics: { color: 'bg-purple-50', textColor: 'text-purple-600', image: antibioticsBanner },
  'hair-loss': { color: 'bg-indigo-50', textColor: 'text-indigo-600', image: hairLossBanner },
  acne: { color: 'bg-teal-50', textColor: 'text-teal-600', image: allergyBanner },
  'anti-cancer': { color: 'bg-red-50', textColor: 'text-red-600', image: painBanner },
  'eye-care': { color: 'bg-sky-50', textColor: 'text-sky-600', image: allergyBanner },
  'sexual-wellness': { color: 'bg-rose-50', textColor: 'text-rose-600', image: skinCareBanner },
  default: { color: 'bg-gray-50', textColor: 'text-gray-900', image: allergyBanner },
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-3 md:p-6 animate-pulse">
      <div className="w-full h-24 md:h-40 bg-gray-100 rounded-xl mb-3 md:mb-6" />
      <div className="h-4 bg-gray-100 rounded mb-1.5" />
      <div className="h-3 w-1/2 bg-gray-100 rounded mb-3 md:mb-4" />
      <div className="flex items-center justify-between mt-auto">
        <div className="h-6 w-12 md:h-8 md:w-16 bg-gray-100 rounded" />
        <div className="h-8 w-16 md:h-10 md:w-24 bg-gray-100 rounded-lg md:rounded-xl" />
      </div>
    </div>
  )
}

function FrequentlyBoughtPage({ onBack, onProductClick }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const { guardedAction } = useAuthGate()
  const { addToCart } = useCart()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')

    const fetchProducts = async () => {
      try {
        let url = '/medicines?status=Active&limit=40'

        if (categoryFilter) {
          const catRes = await api.get('/categories?limit=500')
          const cats = catRes.data.data || []
          const slugAsName = categoryFilter.toLowerCase().replace(/-/g, ' ')
          const match = cats.find(c => c.name.toLowerCase() === slugAsName)
          if (match) {
            url = `/medicines?category=${match._id}&status=Active&limit=40`
          } else {
            setProducts([])
            setLoading(false)
            return
          }
        }

        const res = await api.get(url)
        setProducts(res.data.data || [])
      } catch {
        setError('Failed to load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryFilter])

  const catDetails = CATEGORY_META[categoryFilter?.toLowerCase()] || CATEGORY_META.default

  const handleBack = () => onBack ? onBack() : navigate(-1)
  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product)
    } else {
      navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product } })
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-312.5 mx-auto px-4 md:px-12 py-8 md:py-12">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-bold text-[14px] group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        {/* Category Banner */}
        {categoryFilter && (
          <div className="mb-8 md:mb-12 rounded-3xl md:rounded-4xl p-6 md:p-12 relative overflow-hidden flex items-center border border-gray-100 shadow-sm min-h-50 md:min-h-75">
            <div className="absolute inset-0 z-0">
              <img src={catDetails.image} alt="banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
            </div>
            <div className="z-10 relative">
              <span className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-widest mb-4 md:mb-6 inline-block text-gray-800 shadow-sm">Category Spotlight</span>
              <h1 className="text-[28px] md:text-[60px] font-black leading-[1.1] capitalize text-gray-900 drop-shadow-sm">
                {categoryFilter.replace(/-/g, ' ')} <br />
                <span className={catDetails.textColor}>Solutions</span>
              </h1>
              <p className="text-gray-700 text-[13px] md:text-[18px] mt-4 md:mt-6 max-w-lg font-bold leading-relaxed hidden sm:block">
                Genuine medicines and premium healthcare products for your {categoryFilter.replace(/-/g, ' ')} needs, delivered fast to your doorstep.
              </p>
              <div className="mt-6 md:mt-8 flex gap-3 md:gap-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-[10px] md:text-[12px] font-bold text-gray-800">100% Genuine</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z" /></svg>
                  <span className="text-[10px] md:text-[12px] font-bold text-gray-800">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!categoryFilter && (
          <div className="mb-8 md:mb-12">
            <h1 className="text-[22px] md:text-[42px] font-bold text-gray-900 tracking-tight mb-3 md:mb-4 capitalize">
              Frequently Bought Together
            </h1>
            <p className="text-gray-500 text-[14px] md:text-[16px] max-w-2xl leading-relaxed font-medium">
              Explore products that our customers frequently purchase together for comprehensive health management.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : products.length > 0 ? (
            products.map((product) => {
              const outOfStock = isOutOfStock(product)
              return (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className={`bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-3 md:p-6 flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 group relative ${
                    outOfStock ? 'bg-gray-50 opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {outOfStock && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm z-10 bg-red-600 text-white">
                      Out of Stock
                    </div>
                  )}

                  <div className="w-full h-24 md:h-40 flex items-center justify-center mb-3 md:mb-6">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full bg-transparent group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="grow flex flex-col">
                    <h3 className="text-[14px] md:text-[15px] font-bold text-gray-900 mb-0.5 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[11px] md:text-[13px] font-bold text-gray-400 mb-2 md:mb-4">({product.genericName})</p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[16px] md:text-[20px] font-black text-gray-900">${product.price}</span>
                      <button
                        disabled={outOfStock}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!outOfStock) {
                            guardedAction(() => { addToCart(product) })()
                          }
                        }}
                        className={`flex items-center gap-1 md:gap-2 px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[11px] md:text-[13px] font-black transition-all ${
                          outOfStock
                            ? 'bg-gray-300 opacity-60 cursor-not-allowed text-gray-500 shadow-none'
                            : 'bg-secondary text-primary hover:bg-primary hover:text-white active:scale-95'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {outOfStock ? 'OOS' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5" strokeLinecap="round" /></svg>
              </div>
              <h3 className="text-[18px] font-bold text-gray-900">No products found</h3>
              <p className="text-gray-500 text-[14px] mt-1">We are adding more products to this category soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FrequentlyBoughtPage
