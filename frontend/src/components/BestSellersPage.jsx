import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthGate } from '../hooks/useAuthGate'
import { useCart } from '../context/CartContext'
import api from '../utils/api'
import productImg from '../assets/product.png'

function discountBadge(price, mrp) {
  if (!mrp || mrp <= price) return null
  const pct = Math.round(((mrp - price) / mrp) * 100)
  return pct > 0 ? `${pct}% OFF` : null
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-200 px-4 py-3 animate-pulse">
      <div className="w-full h-44 bg-gray-100 rounded-xl mb-4" />
      <div className="h-4 bg-gray-100 rounded mb-1.5" />
      <div className="h-3 w-1/2 bg-gray-100 rounded mb-3" />
      <div className="h-8 w-24 bg-gray-100 rounded mt-auto" />
    </div>
  )
}

function BestSellersPage({ onBack }) {
  const navigate = useNavigate()
  const { guardedAction } = useAuthGate()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    api.get('/medicines?isBestSeller=true&status=Active&limit=20')
      .then(res => setProducts(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleBack = () => onBack ? onBack() : navigate(-1)

  const handleProductClick = (product) => {
    navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product } })
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-312.5 mx-auto px-4 md:px-12 py-8 md:py-12">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 font-medium group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </button>

        <div className="mb-12">
          <h1 className="text-[36px] md:text-[48px] font-bold text-gray-900 tracking-tight mb-4">Best Sellers</h1>
          <p className="text-gray-500 text-[18px] max-w-2xl leading-relaxed">
            Discover our most trusted and high-demand medications. Handpicked for quality, effectiveness, and value.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-10 pb-6 border-b border-gray-100">
          <span className="px-6 py-2 rounded-full bg-secondary text-primary font-bold text-[14px]">
            All Products ({loading ? '…' : products.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : products.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-400">
              No best sellers configured yet. Check back soon!
            </div>
          ) : (
            products.map((product) => {
              const badge = discountBadge(product.price, product.mrp)
              return (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-[24px] border border-gray-200 px-4 py-3 relative flex flex-col h-full cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow group"
                >
                  {badge ? (
                    <div className="absolute top-1 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm z-10 bg-primary text-white">
                      {badge}
                    </div>
                  ) : (
                    <div className="absolute top-1 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm z-10 bg-accent text-gray-900">
                      Best Seller
                    </div>
                  )}

                  <div className="flex flex-col grow">
                    <div className="w-full h-44 flex items-center justify-center mb-4">
                      <img
                        src={product.image && product.image !== 'no-photo.jpg' ? product.image : productImg}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[17px] font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-primary font-semibold text-[13px] mb-3">({product.genericName})</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-50">
                    <div className="flex flex-col">
                      {product.mrp && product.mrp > product.price && (
                        <span className="text-[12px] text-gray-400 line-through font-medium leading-none mb-0.5">₹{product.mrp}</span>
                      )}
                      <span className="text-[28px] font-black text-gray-900 leading-none">₹{product.price}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        guardedAction(() => { addToCart(product); toast.success('Added to cart!') })()
                      }}
                      className="w-11 h-11 bg-accent rounded-full flex items-center justify-center shadow-md active:scale-95 hover:bg-accent/90 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default BestSellersPage
