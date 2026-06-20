import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import { useAuthGate } from '../hooks/useAuthGate'
import { isOutOfStock } from '../utils/stockUtils'
import productImg from '../assets/product.png'
import pharm1 from '../assets/pharm-1.png'
import pharm2 from '../assets/pharm-2.png'
import pharm3 from '../assets/pharm-3.png'
import pharm4 from '../assets/pharm-4.png'
import pharm5 from '../assets/pharm-5.png'

const fallbackImages = [pharm1, pharm2, pharm3, pharm4, pharm5]

function discountBadge(price, mrp) {
  if (!mrp || mrp <= price) return null
  const pct = Math.round(((mrp - price) / mrp) * 100)
  return pct > 0 ? `${pct}% OFF` : null
}

function SkeletonCard() {
  return (
    <div className="w-42.5 md:w-100 bg-white rounded-[20px] md:rounded-3xl border border-gray-100 px-3 py-1.5 md:px-4 md:py-2.5 animate-pulse shrink-0">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-1">
        <div className="w-full md:w-40 h-20 md:h-32 bg-gray-100 rounded-lg shrink-0" />
        <div className="w-full space-y-2 md:pt-2">
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-3 w-2/3 bg-gray-100 rounded" />
          <div className="h-6 w-1/3 bg-gray-100 rounded mt-2" />
        </div>
      </div>
    </div>
  )
}

function BestSellers({ onProductClick }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { guardedAction } = useAuthGate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/medicines?isBestSeller=true&status=Active&limit=8')
      .then(res => setProducts(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleClick = (product) => {
    if (onProductClick) {
      onProductClick(product)
    } else {
      navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product } })
    }
  }

  if (!loading && products.length === 0) return null

  return (
    <section className="bg-white pt-1 pb-1 md:pt-8 md:pb-12 px-4 md:px-12">
      <div className="max-w-312.5 mx-auto">
        <div className="flex justify-between items-center mb-3 md:mb-8 px-1">
          <h2 className="text-[18px] md:text-[34px] font-semibold text-gray-900 tracking-tight">
            Customer Favourite
          </h2>
          <button
            onClick={() => navigate('/best-sellers')}
            className="flex items-center gap-0.5 md:gap-2 text-white bg-primary font-bold text-[11px] md:text-[16px] border border-primary px-2 py-0.5 md:px-4 md:py-1.5 rounded-full hover:bg-primary-dark transition-all"
          >
            View all
            <svg className="w-3.5 h-3.5 md:w-5 md:h-5 stroke-[2.5] md:stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-4 md:pb-6 px-1 scroll-smooth">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            products.map((product, i) => {
              const badge = discountBadge(product.price, product.mrp)
              const imgSrc = product.image && product.image !== 'no-photo.jpg'
                ? product.image
                : fallbackImages[i % fallbackImages.length]
              const outOfStock = isOutOfStock(product)
              return (
                <div
                  key={product._id}
                  onClick={() => handleClick(product)}
                  className={`w-42.5 md:w-100 bg-white rounded-[20px] md:rounded-3xl border border-gray-100 md:border-gray-200 px-3 py-1.5 md:px-4 md:py-2.5 relative flex flex-col h-full cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all shrink-0 ${
                    outOfStock ? 'bg-gray-50 opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {outOfStock ? (
                    <div className="absolute top-2 right-2 md:top-1 md:right-4 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-sm z-10 bg-red-600 text-white">
                      Out of Stock
                    </div>
                  ) : (
                    <div className={`absolute top-2 right-2 md:top-1 md:right-4 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-sm z-10 ${badge ? 'bg-primary text-white' : 'bg-accent text-gray-900'}`}>
                      {badge || 'Customer Favourite'}
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 mt-1 grow">
                    <div className="w-full md:w-40 h-20 md:h-32 shrink-0 flex items-center justify-center">
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                        onError={e => { e.target.src = productImg }}
                      />
                    </div>
                    <div className="flex flex-col w-full min-w-0 text-left md:pt-8">
                      <h3 className="text-[13px] md:text-[18px] font-bold text-gray-900 leading-tight mb-0.5 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-primary font-semibold text-[11px] md:text-[13px] mb-0.5 md:mb-1">
                        ({product.genericName})
                      </p>
                    </div>
                  </div>

                  <div className="mt-1 flex justify-between items-end">
                    <div className="flex flex-col justify-end">
                      {product.mrp && product.mrp > product.price ? (
                        <span className="text-[10px] md:text-[12px] text-gray-400 line-through font-medium leading-none mb-0.5">
                          ${product.mrp}
                        </span>
                      ) : (
                        <span className="text-[10px] md:text-[12px] text-transparent leading-none mb-0.5 select-none">$0</span>
                      )}
                      <span className="text-[16px] md:text-[22px] font-black text-gray-900 leading-none">
                        ${product.price}
                      </span>
                    </div>

                    <button
                      disabled={outOfStock}
                      onClick={e => {
                        e.stopPropagation()
                        if (!outOfStock) {
                          guardedAction(() => { addToCart(product); toast.success('Added to cart!') })()
                        }
                      }}
                      className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform ${
                        outOfStock
                          ? 'bg-gray-300 opacity-60 cursor-not-allowed text-gray-500'
                          : 'bg-accent text-gray-900 hover:bg-accent/90'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

export default BestSellers
