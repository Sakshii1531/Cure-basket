import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuthGate } from '../hooks/useAuthGate'
import { useCart } from '../context/CartContext'
import productImg from '../assets/product.png'
import med1 from '../assets/med1.png'
import api from '../utils/api'

function ProductDetail({ onBack }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { id: urlId } = useParams()
  const { guardedAction } = useAuthGate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(location.state?.product || null)
  const [productLoading, setProductLoading] = useState(!location.state?.product)

  // Fetch product from API when accessed directly by URL (no navigation state)
  useEffect(() => {
    if (!location.state?.product && urlId) {
      setProductLoading(true)
      api.get(`/medicines/${urlId}`)
        .then(res => setProduct(res.data.data))
        .catch(() => setProduct({ name: 'Product Not Found', category: 'General', image: productImg }))
        .finally(() => setProductLoading(false))
    }
  }, [urlId])

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#006D6D]"></div>
      </div>
    )
  }

  if (!product) return null

  // Dynamic Package Options
  // Dynamic Package Options
  const getPackageOptions = React.useCallback(() => {
    // 1. Check if product has explicit packages set in DB
    if (product?.packages && product.packages.length > 0) {
      return product.packages.map((pkg, idx) => ({
        id: pkg._id || idx,
        label: pkg.label,
        price: Number(pkg.price) || 0,
        mrp: Number(pkg.mrp) || Number(pkg.price) || 0,
        perUnit: pkg.perUnit || (Number(pkg.price) / (parseInt(pkg.label) || 1) || 0),
        popular: pkg.popular
      }))
    }

    // 2. Default: Show a single package based on the main product price
    const basePrice = Number(product?.price) || 0
    const baseMRP = Number(product?.mrp) || basePrice
    
    return [
      { 
        id: 'default', 
        label: product?.packaging || '1 Pack', 
        price: basePrice, 
        mrp: baseMRP, 
        perUnit: basePrice,
        popular: true 
      }
    ]
  }, [product?.packages, product?.price, product?.mrp, product?.packaging])

  const packageOptions = getPackageOptions()
  const [selectedPackage, setSelectedPackage] = useState(packageOptions.find(p => p.popular) || packageOptions[0] || { price: 0, mrp: 0, id: 0, label: 'N/A', perUnit: 0 })
  const [quantity, setQuantity] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const [activeTab, setActiveTab] = useState('Product Information')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [reviews, setReviews] = useState([])

  // Reset state when product changes
  const [recommended, setRecommended] = useState([])

  // Reset state when product changes
  useEffect(() => {
    const newOptions = getPackageOptions()
    setSelectedPackage(newOptions.find(p => p.popular) || newOptions[0])
    setQuantity(1)
    setActiveThumb(0)
    setActiveTab('Product Information')
    setUploadSuccess(false)
    window.scrollTo(0, 0)

    // Fetch Recommended Products
    api.get('/medicines?limit=10')
      .then(res => {
        const others = res.data.data.filter(m => String(m._id) !== String(product?._id))
        setRecommended(others.slice(0, 4))
      })
      .catch(() => {})

    // Fetch Reviews
    api.get(`/reviews/medicine/${product?._id}`)
      .then(res => setReviews(res.data.data))
      .catch(() => {})
  }, [product?._id, product?.name, getPackageOptions])

  const tabs = ['Product Information', 'Uses', 'Side Effects', 'How to Use', 'Safety Advice', 'FAQs', 'Reviews']

  // Dynamic content based on product
  const getProductData = () => {
    // Return data directly from product object (DB)
    return {
      genericName: product.genericName || 'N/A',
      manufacturer: product.manufacturer || 'N/A',
      salt: product.saltComposition || 'N/A',
      packaging: product.packaging || 'N/A',
      storage: product.storage || 'N/A',
      prescription: product.prescription || 'Required',
      deliveryTime: product.deliveryTime || 'Usually delivers in 1-2 days',
      uses: product.uses ? product.uses.split('\n').filter(l => l.trim()) : [],
      sideEffects: product.sideEffects ? product.sideEffects.split('\n').filter(l => l.trim()) : [],
      howToUse: {
        title: 'Usage Instructions',
        steps: product.howToUse ? product.howToUse.split('\n').filter(l => l.trim()) : []
      },
      safetyAdvice: product.safetyAdvice || [],
      faqs: product.faqs || []
    }
  }

  const pData = getProductData()
  
  // Calculate Dynamic Ratings
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : '5.0'
  const reviewCount = reviews.length

  const selectedPrice = (selectedPackage.price * quantity).toFixed(2)
  const selectedMRP = (selectedPackage.mrp * quantity).toFixed(2)
  const savingsAmount = (selectedPackage.mrp * quantity - selectedPackage.price * quantity).toFixed(2)
  const savingsPercent = Math.round(((selectedPackage.mrp - selectedPackage.price) / (selectedPackage.mrp || 1)) * 100) || 0

  const tabContent = {
    'Product Information': (
      <div className="space-y-5">
        {[
          { label: 'Manufacturer', value: pData.manufacturer },
          { label: 'Salt Composition', value: pData.salt },
          { label: 'Packaging', value: pData.packaging },
          { label: 'Storage', value: pData.storage },
          { label: 'Prescription', value: pData.prescription },
          { label: 'Delivery Time', value: pData.deliveryTime, highlight: true }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-12">
            <div className="w-32 text-[13px] font-bold text-gray-400 shrink-0">{item.label}</div>
            <div className="flex-1">
              {item.highlight ? (
                <span className="bg-[#E6F7F7] text-[#006D6D] text-[11px] font-bold px-3 py-1 rounded-full">{item.value}</span>
              ) : (
                <span className="text-[13px] font-bold text-gray-700">{item.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    ),
    'Uses': (
      <div className="space-y-4">
        <h3 className="text-[16px] font-bold text-gray-900">What is it used for?</h3>
        {pData.uses.length > 0 ? (
          <>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              This medication is primarily used for the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[13px] text-gray-600">
              {pData.uses.map((use, i) => <li key={i}>{use}</li>)}
            </ul>
          </>
        ) : (
          <p className="text-[13px] text-gray-400 italic">No usage information available for this product.</p>
        )}
      </div>
    ),
    'Side Effects': (
      <div className="space-y-4">
        <h3 className="text-[16px] font-bold text-gray-900">Common Side Effects</h3>
        {pData.sideEffects.length > 0 ? (
          <>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              While most people do not experience significant side effects, some may include:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {pData.sideEffects.map((effect, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                  <span className="text-[13px] text-gray-600 font-medium">{effect}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 italic mt-4">
              *Contact your doctor immediately if you experience any severe allergic reactions.
            </p>
          </>
        ) : (
          <p className="text-[13px] text-gray-400 italic">No side effects information available for this product.</p>
        )}
      </div>
    ),
    'How to Use': (
      <div className="space-y-4">
        <h3 className="text-[16px] font-bold text-gray-900">{pData.howToUse.title}</h3>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          Follow your doctor's instructions exactly. Typical usage includes:
        </p>
        <div className="space-y-3">
          {pData.howToUse.steps.map((step, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-[13px] font-bold text-gray-900 mb-1">Step {i + 1}</div>
              <p className="text-[12px] text-gray-500">{step}</p>
            </div>
          ))}
          {pData.howToUse.steps.length === 0 && <p className="text-gray-400 italic">No usage instructions provided.</p>}
        </div>
      </div>
    ),
    'Safety Advice': (
      <div className="space-y-6">
        {pData.safetyAdvice.length > 0 ? (
          pData.safetyAdvice.map((item, idx) => (
            <div key={idx} className="flex gap-8 pb-4 border-b border-gray-50 last:border-0">
              <div className="w-24 text-[13px] font-bold text-gray-400 shrink-0">{item.label}</div>
              <div className="flex-1">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${item.status === 'Safe' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                  {item.status}
                </span>
                <p className="text-[12px] text-gray-500 mt-1">{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[13px] text-gray-400 italic">No safety advice available for this product.</p>
        )}
      </div>
    ),
    'FAQs': (
      <div className="space-y-4">
        {pData.faqs.length > 0 ? (
          pData.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white">
              <div className="text-[13px] font-bold text-gray-900 mb-1">Q: {faq.question}</div>
              <div className="text-[12px] text-gray-500">A: {faq.answer}</div>
            </div>
          ))
        ) : (
          <p className="text-[13px] text-gray-400 italic">No FAQs available for this product.</p>
        )}
      </div>
    ),
    ['Reviews']: (
      <div className="space-y-6">
        {reviews.map((rev, idx) => (
          <div key={rev._id || idx} className="pb-6 border-b border-gray-50 last:border-0">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-[13px] text-gray-900">{rev.user?.name || 'Anonymous'}</div>
              <div className="text-[11px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex text-[#FFD200] text-xs mb-2">
              {"★".repeat(rev.rating)}
              <span className="text-gray-200">{"★".repeat(5 - rev.rating)}</span>
            </div>
            <p className="text-[12px] text-gray-600 italic">"{rev.comment}"</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="py-10 text-center text-gray-400 text-sm">No reviews yet for this product.</div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-10 md:pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 py-4 hidden md:block">
        <nav className="flex items-center gap-2 text-[12px] font-medium text-gray-500">
          <span className="cursor-pointer hover:text-[#006D6D]" onClick={() => navigate('/')}>Home</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="cursor-pointer hover:text-[#006D6D]">All Medicines</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="cursor-pointer hover:text-[#006D6D]">Anti Infectives</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1250px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 md:gap-12 pt-4 md:pt-0">
        
        {/* Left Column: Product Visuals & Info */}
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-start">
            {/* Gallery Section */}
            <div className="bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 pt-6 px-6 pb-8 md:pt-8 md:px-8 md:pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative">
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                <span className="bg-[#006D6D] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 md:px-3 py-1 rounded-full shadow-lg">BEST SELLER</span>
              </div>
              <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
                <button className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
              </div>

              {/* Main Image */}
              <div className="flex items-center justify-center pt-8 pb-4 h-auto overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full max-h-[300px] md:max-h-[700px] object-contain transform scale-110 md:scale-[1.45]" />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex justify-center items-center gap-2 md:gap-3 mt-4">
                  <button className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900">
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  {product.images.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveThumb(idx)}
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl border-2 p-1.5 md:p-2 cursor-pointer transition-all ${activeThumb === idx ? 'border-[#006D6D]' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-contain opacity-70" />
                    </div>
                  ))}
                  <button className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900">
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}

              {/* Prescription Required Label */}
              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <div className="text-[12px] md:text-[13px] font-bold text-gray-900">Prescription Required</div>
                  <div className="text-[10px] md:text-[11px] text-gray-500">This is a prescription medicine</div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-4 pt-0 md:pt-2">
              <div>
                <h1 className="text-[20px] md:text-[28px] font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
                <div className="space-y-1">
                  <div className="text-[12px] md:text-[13px]"><span className="text-gray-500 font-medium">Generic Name:</span> <span className="text-[#006D6D] font-bold cursor-pointer hover:underline">{pData.genericName}</span></div>
                  <div className="text-[12px] md:text-[13px]"><span className="text-gray-500 font-medium">Category:</span> <span className="text-[#006D6D] font-bold cursor-pointer hover:underline">{product.category?.name || product.category || 'Medicine'}</span></div>
                </div>
              </div>

              {pData.uses.length > 1 && (
                <button 
                  onClick={() => {
                    setActiveTab('Uses')
                    const el = document.getElementById('product-tabs')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-[#006D6D] text-[12px] font-bold flex items-center gap-1 hover:underline w-fit"
                >
                  View full description
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19 9l-7 7-7-7" /></svg>
                </button>
              )}

              <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#FFD200]">
                    {"★★★★★".split('').map((s, i) => (
                      <span key={i} className={`text-sm md:text-base ${i < Math.floor(avgRating) ? 'text-[#FFD200]' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-gray-900 font-bold text-[11px] md:text-[12px]">{avgRating} <span className="text-gray-400 font-medium ml-1">({reviewCount} reviews)</span></span>
                </div>
                <div className="hidden md:block h-3 w-[1px] bg-gray-300"></div>
                <button
                  onClick={() => {
                    setActiveTab('Reviews')
                    const el = document.getElementById('product-tabs')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-[#006D6D] font-bold text-[11px] md:text-[12px] hover:underline"
                >
                  Write a review
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-3 pt-2">
                {[
                  { label: 'FDA\nApproved', icon: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
                  { label: 'Genuine\nMedicine', icon: <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                  { label: 'Secure\nPayments', icon: <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /> },
                  { label: 'Discreet\nShipping', icon: <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> }
                ].map((badge, bidx) => (
                  <div key={bidx} className="flex flex-col items-center text-center gap-1">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#E6F7F7] flex items-center justify-center">
                      <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">{badge.icon}</svg>
                    </div>
                    <span className="text-[8px] md:text-[9px] font-bold text-gray-500 leading-tight whitespace-pre-line">{badge.label}</span>
                  </div>
                ))}
              </div>

              {/* Inline Upload Banner */}
              <div className="bg-[#FFF8E7] rounded-xl p-3 flex items-center justify-between gap-3 mt-8 md:mt-16 border border-[#FFD200]/20 max-w-full md:max-w-[420px]">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <div>
                    <div className="text-[11px] md:text-[12px] font-bold text-gray-900 leading-tight">Upload Prescription</div>
                    <div className="text-[9px] md:text-[10px] text-gray-500 leading-tight mt-0.5">Quick review by pharmacists.</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className={`border-2 px-3 py-1 rounded-lg font-bold text-[10px] md:text-[11px] transition-all shadow-sm shrink-0 flex items-center gap-1.5 ${uploadSuccess ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-100 text-gray-900 hover:bg-gray-50'}`}
                >
                  {uploadSuccess ? 'Added' : 'Upload Now'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Cart Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 pt-5 px-5 pb-5 md:pt-4 md:px-7 md:pb-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] lg:sticky lg:top-24">
            <div className="bg-[#FFF8E7] text-[#FBB03B] text-[9px] font-black px-2 py-0.5 rounded-md w-fit mb-2 md:mb-1.5 uppercase tracking-tighter">Save {savingsPercent}%</div>
            
            <div className="mb-4 md:mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] md:text-[26px] font-bold text-gray-900">₹{selectedPrice}</span>
                <span className="text-gray-400 line-through text-[12px]">₹{selectedMRP}</span>
              </div>
              <div className="text-[#006D6D] font-bold text-[10px] mt-0.5">You save ₹{savingsAmount} ({savingsPercent}%)</div>
            </div>

            {/* Package Selection */}
            <div className="space-y-2 mb-4 md:mb-1.5">
              <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">Select Quantity (Package)</h4>
              <div className="space-y-2">
                {packageOptions.map(pkg => (
                  <label 
                    key={pkg.id}
                    className={`flex items-center justify-between py-2 md:py-1.5 px-3 md:px-2.5 rounded-xl border-2 cursor-pointer transition-all relative ${selectedPackage.id === pkg.id ? 'border-[#006D6D] bg-[#E6F7F7]/20' : 'border-gray-100 hover:border-gray-200'}`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${selectedPackage.id === pkg.id ? 'border-[#006D6D]' : 'border-gray-300'}`}>
                        {selectedPackage.id === pkg.id && <div className="w-1.5 h-1.5 rounded-full bg-[#006D6D]"></div>}
                      </div>
                      <span className="text-[11px] font-bold text-gray-900">{pkg.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-900">₹{pkg.price.toFixed(2)}</span>
                        {pkg.mrp > pkg.price && (
                          <span className="text-[9px] text-gray-400 line-through font-medium">₹{pkg.mrp.toFixed(2)}</span>
                        )}
                      </div>
                      <div className={`text-[9px] font-medium ${selectedPackage.id === pkg.id ? 'text-[#006D6D]' : 'text-gray-400'}`}>₹{pkg.perUnit.toFixed(2)} / unit</div>
                    </div>
                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FFF8E7] border border-[#FFD200]/30 px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-bold text-[#FBB03B] shadow-sm z-10">
                        Best Value
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-4 md:mb-2">
              <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">Quantity</span>
              <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold">−</button>
                <input type="number" value={quantity} readOnly className="w-8 text-center bg-transparent font-bold text-gray-900 text-[11px]" />
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button 
                onClick={guardedAction(() => {
                  addToCart(product, quantity, selectedPackage);
                  navigate('/cart');
                }, 'add-to-cart')}
                className="w-full bg-[#FFD200] text-gray-900 font-bold py-3 md:py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#FFD200]/10 text-[13px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Add to Cart
              </button>
              <button 
                onClick={guardedAction(() => navigate('/checkout', { state: { product, selectedPackage, quantity } }), 'buy-now')}
                className="w-full bg-white border-2 border-gray-100 text-gray-900 font-bold py-3 md:py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all text-[13px]"
              >
                <svg className="w-4 h-4 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Features Bar */}
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 mt-10 md:mt-12 mb-8">
        <div className="bg-gray-50/50 rounded-[24px] border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { 
              title: 'Fast Delivery', 
              desc: 'Doorstep service',
              icon: <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2.5a1.5 1.5 0 01-3 0V16m-4 0h4m-4 0a1 1 0 00-1 1v2.5a1.5 1.5 0 01-3 0V16" />
            },
            { 
              title: '100% Genuine', 
              desc: 'Licensed stock',
              icon: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            },
            { 
              title: 'Secure Pay', 
              desc: 'Encrypted payments',
              icon: <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            },
            { 
              title: '24/7 Support', 
              desc: 'Always here',
              icon: <><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></>
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <svg className="w-5 h-5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">{item.icon}</svg>
              </div>
              <div>
                <div className="text-[11px] md:text-[12px] font-bold text-gray-900">{item.title}</div>
                <div className="text-[9px] md:text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div id="product-tabs" className="max-w-[1250px] mx-auto px-4 md:px-12 mt-8 mb-10 md:mb-16">
        <div className="bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex items-center gap-6 md:gap-8 px-6 md:px-8 border-b border-gray-100 overflow-x-auto no-scrollbar scroll-smooth">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 md:py-5 text-[12px] md:text-[13px] font-bold whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-[#006D6D]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab === 'Reviews' ? `Reviews (${reviews.length})` : tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-[#006D6D] rounded-t-full"></div>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-10 md:gap-12 items-start">
            <div className="min-h-[200px] md:min-h-[250px]">
              {tabContent[activeTab]}
            </div>

            {/* Why Choose Us */}
            <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 relative overflow-hidden hidden md:block">
              <div className="relative z-10">
                <h3 className="text-[16px] font-bold text-gray-900 mb-4">Why choose CureBasket?</h3>
                <div className="space-y-3">
                  {['Lowest prices guaranteed', 'Genuine medicines stock', 'Secure data protection', 'On-time delivery'].map((text, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#E6F7F7] flex items-center justify-center mt-0.5 shrink-0">
                        <svg className="w-2.5 h-2.5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-[12px] font-bold text-gray-600 leading-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 -right-4 w-32 h-32 opacity-80 pointer-events-none">
                <img src={productImg} alt="CureBasket" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <div className="max-w-[1250px] mx-auto px-4 md:px-12 mt-10 md:mt-12 mb-16 md:mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-gray-900">Recommended for you</h2>
          <button onClick={() => navigate('/all-products')} className="text-[#006D6D] text-[12px] font-bold flex items-center gap-1 hover:underline">View all</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {recommended.map((item, idx) => (
            <div 
              key={item._id || idx} 
              onClick={() => navigate(`/product/${item._id}`, { state: { product: item } })}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <h3 className="text-[13px] font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-[15px] font-bold text-gray-900">₹{item.price}</span>
                  <button className="bg-[#006D6D] text-white px-3 py-1 rounded-lg text-[11px] font-bold shrink-0">Add</button>
                </div>
              </div>
            </div>
          ))}
          {recommended.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-400 text-sm">No recommended products found.</div>
          )}
        </div>
      </div>
      {/* Upload Prescription Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[480px] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-[#E6F7F7]/50 px-8 py-6 flex justify-between items-center border-b border-[#006D6D]/10">
              <div>
                <h2 className="text-[18px] font-bold text-[#006D6D]">Upload Prescription</h2>
                <p className="text-[11px] text-[#006D6D]/60 font-medium mt-0.5">Medicines require a valid doctor's prescription</p>
              </div>
              <button 
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="p-8">
              {!uploadSuccess ? (
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div 
                    onClick={() => document.getElementById('fileInput').click()}
                    className={`relative border-2 border-dashed rounded-[24px] p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-[#006D6D] bg-[#E6F7F7]/10' : 'border-gray-200 hover:border-[#006D6D] hover:bg-[#E6F7F7]/5'}`}
                  >
                    <input 
                      type="file" 
                      id="fileInput" 
                      className="hidden" 
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      accept="image/*,.pdf"
                    />
                    
                    {selectedFile ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#006D6D] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#006D6D]/20">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
                        </div>
                        <p className="text-[14px] font-bold text-gray-900 truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB • Ready to upload</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#E6F7F7] transition-all">
                          <svg className="w-8 h-8 text-gray-300 group-hover:text-[#006D6D] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>
                        </div>
                        <p className="text-[14px] font-bold text-gray-900">Drag & drop or <span className="text-[#006D6D]">browse</span></p>
                        <p className="text-[11px] text-gray-400 mt-1.5">Supports JPG, PNG, PDF (Max 5MB)</p>
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="bg-gray-50 rounded-2xl p-4 flex gap-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                      <svg className="w-4 h-4 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Make sure the <span className="font-bold text-gray-700">Doctor's Name, Patient Name</span> and <span className="font-bold text-gray-700">Medicines</span> are clearly visible in the image.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                      className="flex-1 py-4 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-[14px] hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={!selectedFile || isUploading}
                      onClick={guardedAction(async () => {
                        setIsUploading(true);
                        try {
                          const formData = new FormData();
                          formData.append('prescription', selectedFile);
                          formData.append('medicine', product._id);
                          formData.append('packageLabel', selectedPackage.label);
                          formData.append('quantity', quantity);
                          formData.append('notes', 'Uploaded from product page');

                          await api.post('/prescriptions', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });

                          setIsUploading(false);
                          setUploadSuccess(true);
                          setTimeout(() => setShowUploadModal(false), 2000);
                        } catch (err) {
                          setIsUploading(false);
                          alert(err.response?.data?.error || 'Failed to upload prescription');
                        }
                      }, 'upload-prescription')}
                      className={`flex-1 py-4 rounded-xl font-bold text-[14px] transition-all shadow-lg flex items-center justify-center gap-2 ${!selectedFile ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#006D6D] text-white hover:bg-[#005a5a] shadow-[#006D6D]/20'}`}
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Uploading...
                        </>
                      ) : 'Attach Prescription'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 className="text-[20px] font-bold text-gray-900 mb-2">Prescription Attached!</h3>
                  <p className="text-[13px] text-gray-500">Your prescription has been successfully added to this order.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2"/></svg>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End-to-End Encrypted & Secure</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
