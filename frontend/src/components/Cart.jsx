import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthGate } from '../hooks/useAuthGate'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ImageWithFallback from './ImageWithFallback'
import { toast } from 'sonner'

const Cart = () => {
  const navigate = useNavigate()
  const { guardedAction } = useAuthGate()
  const { items, removeFromCart, updateQty, cartTotal } = useCart()
  const { isLoggedIn } = useAuth()

  const [stockErrors, setStockErrors] = useState({})
  const [globalStockError, setGlobalStockError] = useState('')
  const [validationLoading, setValidationLoading] = useState(false)
  const [rxErrors, setRxErrors] = useState({})
  const [rxStatuses, setRxStatuses] = useState({})
  const [globalRxError, setGlobalRxError] = useState('')
  const [shippingCharges, setShippingCharges] = useState(0)
  const [freeThreshold, setFreeThreshold] = useState(0)

  useEffect(() => {
    api.get('/settings/public/order_shipping')
      .then(res => {
        if (res.data && res.data.data) {
          const charges = parseFloat(res.data.data.shippingCharges);
          const threshold = parseFloat(res.data.data.freeShippingThreshold);
          if (!isNaN(charges)) setShippingCharges(charges);
          if (!isNaN(threshold)) setFreeThreshold(threshold);
        }
      })
      .catch(() => {});
  }, []);

  const requiresPrescription = items.some(item => item.prescription === 'Required')

  useEffect(() => {
    if (items.length === 0) {
      setStockErrors({})
      setGlobalStockError('')
      return
    }

    const validate = async () => {
      setValidationLoading(true)
      try {
        const payload = {
          items: items.map(item => ({
            medicine: item._id,
            quantity: item.qty
          }))
        }
        const res = await api.post('/medicines/validate-stock', payload)
        if (res.data.success) {
          setStockErrors({})
          setGlobalStockError('')
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.errors) {
          setStockErrors(err.response.data.errors)
          setGlobalStockError(err.response.data.message || 'Some items in your cart have stock issues.')
        } else {
          setGlobalStockError(err.response?.data?.message || err.response?.data?.error || 'Failed to validate stock')
        }
      } finally {
        setValidationLoading(false)
      }
    }

    validate()
  }, [items])

  useEffect(() => {
    if (items.length === 0 || !isLoggedIn) {
      setRxErrors({})
      setRxStatuses({})
      setGlobalRxError('')
      return
    }

    const checkPrescriptions = async () => {
      try {
        const res = await api.get('/prescriptions/my-prescriptions')
        const rxList = res.data.data || []
        
        const errors = {}
        const statuses = {}
        let hasError = false

        items.forEach(item => {
          if (item.prescription === 'Required') {
            const matching = rxList.filter(rx => String(rx.medicine) === String(item._id))
            const approved = matching.some(rx => rx.status === 'Reviewed' || rx.status === 'Dispensed')
            const pending = matching.some(rx => rx.status === 'Pending')

            if (approved) {
              statuses[item._id] = 'approved'
            } else if (pending) {
              statuses[item._id] = 'pending'
              hasError = true
              errors[item._id] = 'Your prescription for this medicine is currently under review.'
            } else {
              statuses[item._id] = 'missing'
              hasError = true
              errors[item._id] = 'An approved prescription is required for this medicine.'
            }
          }
        })

        setRxErrors(errors)
        setRxStatuses(statuses)
        if (hasError) {
          setGlobalRxError('Some items in your cart require an approved prescription before you can checkout.')
        } else {
          setGlobalRxError('')
        }
      } catch (err) {
        console.error('Failed to verify prescriptions:', err)
      }
    }

    checkPrescriptions()
  }, [items, isLoggedIn])

  const shipping = items.length > 0 ? (freeThreshold > 0 && cartTotal >= freeThreshold ? 0 : shippingCharges) : 0
  const hasErrors = Object.keys(stockErrors).length > 0

  return (
    <div className="bg-[#f8f9fa]">
      <div className="bg-white border-b border-gray-100 px-4 md:px-12 py-3 sticky top-0 z-50 grid grid-cols-3 items-center min-h-[56px] md:min-h-[64px]">
        <div className="flex justify-start">
          <button onClick={() => navigate(-1)} className="p-1 group flex items-center gap-1.5">
            <svg className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="hidden sm:inline font-medium text-gray-500 text-[13px]">Back</span>
          </button>
        </div>
        <div className="flex justify-center">
          <h1 className="text-[16px] md:text-[20px] font-bold text-gray-800 whitespace-nowrap">
            {items.length > 0 ? `My Cart (${items.length})` : 'My Cart'}
          </h1>
        </div>
        <div className="flex justify-end"></div>
      </div>

      {items.length === 0 ? (
        <div className="max-w-[1150px] mx-auto px-4 md:px-12 py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Add medicines to get started</p>
          <button onClick={() => navigate('/medicines')} className="bg-[#006D6D] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#005a5a] transition-colors">
            Browse Medicines
          </button>
        </div>
      ) : (
        <div className="max-w-[1150px] mx-auto px-4 md:px-12 pt-6 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

            <div className="space-y-4">
              {hasErrors && items.length > 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-2 animate-fade-in">
                  <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-[14px] font-bold text-amber-800">Checkout Unavailable</h4>
                    <p className="text-[12px] text-amber-700 mt-1">
                      Some items in your cart are out of stock or have insufficient quantity. Please update your cart before proceeding.
                    </p>
                  </div>
                </div>
              )}

              {globalRxError && items.length > 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-2 animate-fade-in">
                  <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-[14px] font-bold text-amber-800">Checkout Blocked</h4>
                    <p className="text-[12px] text-amber-700 mt-1">
                      {globalRxError}
                    </p>
                  </div>
                </div>
              )}

              {requiresPrescription && !isLoggedIn && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-2 animate-fade-in">
                  <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="text-[14px] font-bold text-amber-800">Prescription Required</h4>
                    <p className="text-[12px] text-amber-600 mt-1">
                      One or more medicines in your cart require a doctor's prescription. You must log in and have an approved prescription before you can checkout.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {items.map((item) => {
                  const hasStockError = !!stockErrors[item._id]
                  return (
                    <div
                      key={item.itemKey || item._id}
                      className={`p-5 flex gap-5 transition-all duration-200 ${
                        hasStockError ? 'bg-amber-50/10 opacity-80 border-l-4 border-amber-500' : ''
                      }`}
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 overflow-hidden">
                        {item.image ? (
                          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full bg-transparent" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold">IMG</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-[14px] md:text-[15px] font-semibold text-gray-900 leading-tight">{item.name}</h3>
                            {item.pkg?.label ? (
                              <p className="text-[12px] font-bold text-[#006D6D] mt-1">Package: {item.pkg.label}</p>
                            ) : item.packSize ? (
                              <p className="text-[12px] text-gray-500 mt-1">Pack Size: {item.packSize}</p>
                            ) : null}
                            {item.generic && <p className="text-[12px] text-gray-500 mt-1">{item.generic}</p>}
                            {item.prescription === 'Required' && (
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                {rxStatuses[item._id] === 'approved' ? (
                                  <div className="flex items-center gap-1.5 text-green-700 text-[11px] font-bold bg-green-50 px-2.5 py-1 rounded-md w-fit border border-green-200">
                                    <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <span>Prescription Approved</span>
                                  </div>
                                ) : rxStatuses[item._id] === 'pending' ? (
                                  <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold bg-[#FFF8E7] px-2.5 py-1 rounded-md w-fit border border-[#FFD200]/30">
                                    <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Under Review</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold bg-[#FFF8E7] px-2.5 py-1 rounded-md w-fit border border-[#FFD200]/30">
                                    <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>Prescription Required</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {hasStockError && (
                              <div className="flex items-center gap-1.5 text-amber-600 mt-2 text-[12px] font-semibold bg-amber-50 px-2.5 py-1 rounded-md w-fit border border-amber-100">
                                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>{stockErrors[item._id].message}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-[16px] md:text-[17px] font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</div>
                            {item.originalPrice && (
                              <div className="text-[12px] text-gray-400 line-through mt-0.5">${(item.originalPrice * item.qty).toFixed(2)}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border border-gray-200 rounded-lg bg-gray-50 px-2 py-1">
                            <button
                              onClick={() => updateQty(item.itemKey, item.qty - 1)}
                              className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold"
                            >−</button>
                            <span className="text-[13px] font-semibold text-gray-800 min-w-[20px] text-center">{item.qty}</span>
                            <button
                              onClick={() => {
                                const maxStock = item.stock ?? 9999;
                                if (item.qty >= maxStock) {
                                  toast.warning(`Only ${maxStock} units available in stock.`);
                                } else {
                                  updateQty(item.itemKey, item.qty + 1);
                                }
                              }}
                              className={`w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold transition-all ${
                                item.qty >= (item.stock ?? 0) ? 'opacity-40 cursor-not-allowed' : ''
                              }`}
                            >+</button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.itemKey)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-[16px] font-semibold text-gray-900 mb-5">Order Summary</h2>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-gray-500">Subtotal</span>
                    <span className="text-[13px] font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-gray-500">Shipping Fee</span>
                    <span className="text-[13px] font-semibold text-gray-900">${shipping.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div>
                      <div className="text-[15px] font-bold text-gray-900">Total Amount</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Inclusive of all taxes</div>
                    </div>
                    <div className="text-[22px] font-bold text-[#006D6D]">${(cartTotal + shipping).toFixed(2)}</div>
                  </div>
                </div>

                <button
                  onClick={guardedAction(() => navigate('/checkout'), 'checkout')}
                  disabled={hasErrors || validationLoading || Object.keys(rxErrors).length > 0}
                  className={`w-full font-semibold py-3.5 rounded-xl text-[14px] shadow-md transition-all mt-6 flex items-center justify-center gap-2 ${
                    hasErrors || validationLoading || Object.keys(rxErrors).length > 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-80 pointer-events-none'
                      : 'bg-[#006D6D] text-white hover:bg-[#005a5a] active:scale-[0.98]'
                  }`}
                >
                  Proceed to Checkout
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                <div className="mt-5 flex justify-center">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/></svg>
                    <span className="text-[9px] font-semibold uppercase tracking-widest">Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
