import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const DEFAULTS = {
  heroTitle: "Refer a Friend & Earn $20",
  heroSub: "Help your friends get authentic, highly affordable medicines. They save 20% on their first order, and you get $20 credits!",
  tag: "Share the Health, Share the Rewards",
  code: "CUREBASKET20",
  steps: [
    {
      title: "Share Referral Code",
      desc: "Send your unique referral code or link to your friends, family, or colleagues who buy medications online."
    },
    {
      title: "They Place First Order",
      desc: "Your friends sign up and apply the code to receive a flat 20% discount on their very first purchase."
    },
    {
      title: "You Earn $20 Reward",
      desc: "Once their package is successfully dispatched, you instantly receive a $20 gift voucher directly in your account."
    }
  ]
};

function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    api.get('/settings/public/cms')
      .then(res => {
        if (res.data?.data?.referral) {
          setContent(prev => ({
            ...prev,
            ...res.data.data.referral
          }))
        }
      })
      .catch(() => {})
  }, [])

  const refCode = content.code || "CUREBASKET20"

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeSteps = (content.steps || []).map((st, idx) => ({
    step: `0${idx + 1}`,
    title: st.title,
    desc: st.desc
  }))

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner with Golden Accents */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-16 pb-20 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-4 relative z-10">
          {content.tag && (
            <span className="bg-[#f5b23e]/20 text-[#f5b23e] border border-[#f5b23e]/30 text-[12px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {content.tag}
            </span>
          )}
          <h1 className="text-[24px] md:text-[50px] font-extrabold tracking-tight">{content.heroTitle}</h1>
          <p className="text-[15px] md:text-[19px] text-[#CFF4F4] max-w-2xl mx-auto font-medium leading-relaxed">
            {content.heroSub}
          </p>
        </div>
        {/* Curved decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }}></div>
      </div>

      {/* Share/Widget Section */}
      <div className="max-w-[800px] mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[32px] p-6 md:p-10 text-center space-y-6">
          <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900">Your Shareable Referral Code</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-gray-50 border border-gray-200 rounded-[20px] p-4 max-w-md mx-auto">
            <span className="text-[20px] font-extrabold tracking-widest text-[#006D6D]">{refCode}</span>
            <button
              onClick={handleCopy}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all active:scale-95 flex items-center justify-center gap-2
                ${copied ? 'bg-emerald-600 text-white' : 'bg-[#006D6D] text-white hover:bg-[#004D4D] shadow-lg shadow-[#006D6D]/15'}
              `}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : "Copy Code"}
            </button>
          </div>
          <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider">No limits! Refer as many friends as you want.</p>
        </div>
      </div>

      {/* Steps Visual Layout */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24 space-y-12">
        <h2 className="text-[24px] md:text-[32px] font-bold text-center text-[#004D4D] uppercase tracking-wider">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeSteps.map((st, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm space-y-4 hover:shadow-md transition-shadow relative">
              <span className="text-[48px] font-black text-[#f5b23e]/20 absolute right-6 top-4 leading-none">{st.step}</span>
              <h3 className="text-[18px] font-extrabold text-gray-900">{st.title}</h3>
              <p className="text-[14px] text-gray-600 font-medium leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReferralPage
