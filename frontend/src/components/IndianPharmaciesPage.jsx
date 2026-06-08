import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const DEFAULTS = {
  heroTitle: "About Indian Pharmacies",
  heroSub: "Learn why Indian pharmacies are the worldwide leader in safe, high-quality, and affordable generic medications.",
  desc1: "India produces over 20% of the world’s generic drug supply by volume. With robust manufacturing facilities certified by top international drug regulatory bodies including the US FDA, UK MHRA, and WHO, generic formulations originating from India meet identical global therapeutic efficacy metrics.",
  desc2: "Indian pharmacies offer lower costs not by compromising on active chemical compounds, but due to highly competitive localized production costs, low scientific research overheads for generic compounds, and strong patent rules designed to encourage accessible general public healthcare.",
  metrics: [
    { label: "WHO-GMP Standards", value: "100%", desc: "All suppliers operate fully under WHO Good Manufacturing Practices certifications." },
    { label: "Price Reductions", value: "Up to 80%", desc: "Bypassing heavy patent charges and middlemen to supply medicines directly." },
    { label: "Global Exports", value: "200+ Countries", desc: "India serves as the primary manufacturer and exporter of generic formulations globally." }
  ],
  comparisons: [
    { condition: "Acid Reflux", active: "Esomeprazole", brandPrice: "$240", genericPrice: "$38", savings: "84% Savings" },
    { condition: "Hypertension", active: "Telmisartan", brandPrice: "$180", genericPrice: "$28", savings: "84% Savings" },
    { condition: "Cholesterol", active: "Atorvastatin", brandPrice: "$150", genericPrice: "$24", savings: "84% Savings" }
  ]
};

function IndianPharmaciesPage() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    api.get('/settings/public/cms')
      .then(res => {
        if (res.data?.data?.indianPharmacies) {
          setContent(prev => ({
            ...prev,
            ...res.data.data.indianPharmacies
          }))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[24px] md:text-[44px] font-bold tracking-tight">{content.heroTitle}</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            {content.heroSub}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-16">
        
        {/* Core Paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <h2 className="text-[20px] md:text-[26px] font-bold text-gray-900 leading-tight">The Generic Pharmacy of the World</h2>
            <p className="text-[14px] md:text-[15.5px] text-gray-600 font-medium leading-relaxed text-left md:text-justify">
              {content.desc1}
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-[20px] md:text-[26px] font-bold text-gray-900 leading-tight">Why is Sourcing So Economical?</h2>
            <p className="text-[14px] md:text-[15.5px] text-gray-600 font-medium leading-relaxed text-left md:text-justify">
              {content.desc2}
            </p>
          </div>
        </div>

        {/* Safety Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {(content.metrics || []).map((met, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <span className="text-[32px] font-extrabold text-[#f5b23e]">{met.value}</span>
              <h3 className="text-[16px] font-bold text-gray-900">{met.label}</h3>
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed">{met.desc}</p>
            </div>
          ))}
        </div>

        {/* Dynamic Comparison Table */}
        <div className="space-y-6 pt-6">
          <h2 className="text-[20px] md:text-[26px] font-bold text-gray-900 text-center">Typical Price Savings Comparison</h2>
          <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] md:text-[15px] font-medium text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                    <th className="p-4 md:p-6">Medical Condition</th>
                    <th className="p-4 md:p-6">Active Ingredient</th>
                    <th className="p-4 md:p-6">Typical Brand Cost</th>
                    <th className="p-4 md:p-6">Indian Generic Cost</th>
                    <th className="p-4 md:p-6 text-right">Potential Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-600">
                  {(content.comparisons || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 md:p-6 font-bold text-gray-900">{item.condition}</td>
                      <td className="p-4 md:p-6">{item.active}</td>
                      <td className="p-4 md:p-6 line-through text-red-500">{item.brandPrice}</td>
                      <td className="p-4 md:p-6 text-[#d48806] font-bold">{item.genericPrice}</td>
                      <td className="p-4 md:p-6 text-right font-bold text-[#006D6D]">{item.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default IndianPharmaciesPage
