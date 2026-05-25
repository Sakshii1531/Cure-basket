import React from 'react'

function CancellationPolicyPage() {
  const steps = [
    {
      title: "1. Prior to Shipment Dispatch",
      desc: "You can cancel any order free of charge before it is dispatched from our pharmacy warehouse. Standard order review processing takes between 2 to 6 hours after successful payment."
    },
    {
      title: "2. Post Shipment Dispatch",
      desc: "Once your package is handed over to our courier networks and your tracking ID is issued, the order can no longer be cancelled. Please contact our support desk if you have any immediate delivery change requests."
    },
    {
      title: "3. Refunds Processing Window",
      desc: "For all approved cancellations, the refund amount is reversed directly to your original payment card or wallet. Reversals typically reflect in your account within 5 to 7 business days, depending on bank regulations."
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight">Cancellation Policy</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            Learn about how and when you can cancel your medical orders.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[850px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-8">
        
        {/* Info Card */}
        <div className="bg-[#f5b23e]/10 border-l-4 border-[#f5b23e] rounded-r-xl p-5 shadow-sm">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-[#d48806] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[13.5px] md:text-[14.5px] font-semibold text-[#d48806] leading-relaxed">
              <strong>Quick Tip:</strong> Standard prescription approvals, doctor review approvals, and shipping dispatch processes happen fast. If you need to cancel an order, please do so within 2 hours of payment to guarantee a full, frictionless refund.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-6">
          {steps.map((st, idx) => (
            <div key={idx} className="bg-white border border-gray-100 border-l-4 border-l-[#f5b23e] rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <h3 className="text-[17px] md:text-[19px] font-bold text-[#004D4D]">{st.title}</h3>
              <p className="text-[14px] md:text-[15px] text-gray-600 font-medium leading-relaxed text-justify">{st.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default CancellationPolicyPage
