import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import ImageWithFallback from './ImageWithFallback'

function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={() => onClick(product)}
      className="min-w-[320px] md:min-w-[380px] min-h-60 snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full cursor-pointer hover:shadow-xl active:scale-[0.98] transition-all duration-300"
    >
      <div className="flex-1 p-5 flex items-center gap-8">
        <div className="w-1/2 flex items-center justify-center">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-32 bg-transparent drop-shadow-md"
          />
        </div>
        <div className="w-1/2 flex flex-col justify-center">
          <h3 className="text-[20px] md:text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">{product.name}</h3>
          <p className="text-[12px] text-gray-500 font-semibold mb-3">({product.genericName})</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-[14px] font-bold text-black">$</span>
            <span className="text-[26px] md:text-[28px] font-black text-black leading-none">{product.price}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="min-w-[320px] md:min-w-[380px] min-h-60 snap-start bg-gray-100 rounded-[20px] animate-pulse shrink-0" />
  )
}

const ProductSection = ({ title }) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/medicines?isNewAndBest=true&status=Active&limit=5')
      .then(res => setProducts(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && products.length === 0) return null

  const handleClick = (product) => {
    navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product } })
  }

  return (
    <section className="px-4 md:px-12 pt-16 pb-10 bg-white">
      <div className="max-w-300 mx-auto mb-10 flex flex-col items-center text-center">
        <h2 className="text-[36px] font-bold text-primary leading-none">{title}</h2>
      </div>
      <div className="max-w-300 mx-auto">
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard key={product._id} product={product} onClick={handleClick} />
              ))
          }
        </div>
      </div>
    </section>
  )
}

export default ProductSection
