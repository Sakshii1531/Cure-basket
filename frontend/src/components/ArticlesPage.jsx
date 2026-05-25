import React from 'react'

function ArticlesPage() {
  const articles = [
    {
      title: "Understanding Generic vs. Brand Name Medicines",
      desc: "Learn why generic drugs are equally safe, effective, and up to 80% cheaper than their brand-name counterparts.",
      category: "EDUCATION",
      readTime: "5 min read",
      author: "CureBasket Medical Team",
      date: "May 15, 2026"
    },
    {
      title: "Essential Tips for Safe Online Prescription Ordering",
      desc: "A complete safety guide on checking certifications, verifying medical dosages, and keeping health records secure.",
      category: "SAFETY",
      readTime: "4 min read",
      author: "Dr. Elena Rostova",
      date: "May 18, 2026"
    },
    {
      title: "Managing Seasonal Allergies: Natural vs. OTC Remedies",
      desc: "Our resident pharmacists break down standard antihistamines, correct usage patterns, and simple home care tips.",
      category: "WELLNESS",
      readTime: "7 min read",
      author: "CureBasket Pharmacists",
      date: "May 20, 2026"
    },
    {
      title: "Top 5 Healthcare Innovations in Indian Generic Pharma",
      desc: "An inside look at how India became the world's pharmacy, offering premium manufacturing and affordable treatments.",
      category: "PHARMACY",
      readTime: "6 min read",
      author: "Prof. Rajesh Kumar",
      date: "May 22, 2026"
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight">Healthcare Articles</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            Expert insights, wellness advice, and informative resources curated by our pharmacists.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6 border-l-4 border-l-[#f5b23e]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#E6F7F7] text-[#006D6D] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {art.category}
                  </span>
                  <span className="text-[12px] text-gray-400 font-semibold">{art.readTime}</span>
                </div>
                <h3 className="text-[20px] font-bold text-gray-900 leading-snug">
                  {art.title}
                </h3>
                <p className="text-[14px] md:text-[15px] text-gray-600 font-medium leading-relaxed">
                  {art.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[12px] md:text-[13px] text-gray-500 font-semibold">
                <span>By {art.author}</span>
                <span>{art.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ArticlesPage
