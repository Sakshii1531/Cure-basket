import { toast } from 'sonner'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthGate } from '../hooks/useAuthGate'
import { useCart } from '../context/CartContext'
import { isOutOfStock } from '../utils/stockUtils'
import api from '../utils/api'
import ImageWithFallback from './ImageWithFallback'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[20px] border border-gray-100 p-3 animate-pulse">
      <div className="h-20 bg-gray-100 rounded-lg mb-3" />
      <div className="h-4 bg-gray-100 rounded mb-1" />
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
      <div className="h-5 bg-gray-100 rounded w-1/2" />
    </div>
  )
}

function discountBadge(price, mrp) {
  if (!mrp || mrp <= price) return null
  const pct = Math.round(((mrp - price) / mrp) * 100)
  return pct > 0 ? `${pct}% OFF` : null
}

const CategoryProductList = () => {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const decodedName = decodeURIComponent(categoryName)
  const { guardedAction } = useAuthGate()
  const { addToCart, cartCount } = useCart()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryId, setCategoryId] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError('')

    // Step 1: resolve the category by name → get its _id
    api.get('/categories?limit=500')
      .then(res => {
        const cats = res.data.data || []
        const match = cats.find(c => c.name.toLowerCase() === decodedName.toLowerCase())
        if (!match) {
          setProducts([])
          setLoading(false)
          return
        }
        setCategoryId(match._id)

        // Step 2: fetch medicines for that category
        return api.get(`/medicines?category=${match._id}&status=Active&limit=40&sort=-isBestSeller`)
      })
      .then(res => {
        if (res) setProducts(res.data.data || [])
      })
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false))
  }, [decodedName])

  const handleProductClick = (product) => {
    navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product } })
  }

  return (
    <div className="bg-section min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-50 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[17px] font-bold text-gray-900">{decodedName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="relative" onClick={() => navigate('/cart')}>
            <svg className="w-6 h-6 text-gray-800 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product Count */}
      <div className="px-4 py-3">
        {loading ? (
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        ) : (
          <span className="text-[12px] font-bold text-gray-500">{products.length} Product{products.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 px-4 pb-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-75 text-center px-4">
          <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1H9L8 4z" />
          </svg>
          <p className="text-gray-400 text-sm font-medium">No products found in this category yet.</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-primary font-semibold text-sm hover:underline">Go back</button>
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 px-4 pb-6">
          {products.map((product) => {
            const badge = product.isBestSeller ? 'Customer Favourite' : discountBadge(product.price, product.mrp)
            const isAccentBadge = product.isBestSeller
            const outOfStock = isOutOfStock(product)
            return (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className={`bg-white rounded-[20px] md:rounded-3xl border border-gray-100 md:border-gray-200 px-3 py-1.5 md:px-4 md:py-2.5 relative flex flex-col cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all active:scale-[0.98] ${
                  outOfStock ? 'bg-gray-50 opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {/* Badge */}
                {outOfStock ? (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm z-10 bg-red-600 text-white">
                    Out of Stock
                  </div>
                ) : badge ? (
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm z-10 ${isAccentBadge ? 'bg-accent text-gray-900' : 'bg-primary text-white'}`}>
                    {badge}
                  </div>
                ) : null}

                {/* Image */}
                <div className="w-full h-20 md:h-32.5 flex items-center justify-center mt-1">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full bg-transparent"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col w-full text-left mt-2">
                  <h3 className="text-[13px] md:text-[16px] font-bold text-gray-900 leading-tight mb-0.5 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.genericName && (
                    <p className="text-primary font-semibold text-[11px] md:text-[12px] mb-0.5 truncate">
                      ({product.genericName})
                    </p>
                  )}
                </div>

                {/* Price + Add button */}
                <div className="mt-1 flex justify-between items-end">
                  <div className="flex flex-col justify-end">
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-[10px] md:text-[12px] text-gray-400 line-through font-medium leading-none mb-0.5">
                        ${product.mrp}
                      </span>
                    )}
                    <span className="text-[16px] md:text-[20px] font-black text-gray-900 leading-none">
                      ${product.price}
                    </span>
                  </div>
                  <button
                    disabled={outOfStock}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!outOfStock) {
                        guardedAction(() => { addToCart(product) })()
                      }
                    }}
                    className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform ${
                      outOfStock
                        ? 'bg-gray-300 opacity-60 cursor-not-allowed text-gray-500'
                        : 'bg-accent text-gray-900 hover:bg-accent/90'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CategoryProductList
