import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const DEFAULTS = {
  heroTitle: "CureBasket Site Map",
  heroSub: "Quickly navigate to any page on our platform. Find medicines, guidelines, policies, and account settings easily.",
  categories: [
    { title: "Shop & Categories" },
    { title: "CureBasket Info" },
    { title: "FAQs & Support" },
    { title: "Account & Transactions" }
  ]
};

function SitemapPage() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    api.get('/settings/public/cms')
      .then(res => {
        if (res.data?.data?.sitemap) {
          setContent(prev => ({
            ...prev,
            ...res.data.data.sitemap
          }))
        }
      })
      .catch(() => {})
  }, [])

  const sections = [
    {
      title: content.categories?.[0]?.title || "Shop & Categories",
      color: "bg-[#E6F7F7] border-[#006D6D]/20 text-[#006D6D]",
      links: [
        { name: "Home Page", path: "/" },
        { name: "All Medicines", path: "/medicines" },
        { name: "All Products Catalog", path: "/all-products" },
        { name: "Customer Favourite", path: "/best-sellers" },
        { name: "All Brands", path: "/all-brands" },
        { name: "Shop by Category", path: "/categories" }
      ]
    },
    {
      title: content.categories?.[1]?.title || "CureBasket Info",
      color: "bg-[#f5b23e]/10 border-[#f5b23e]/25 text-[#d48806]",
      links: [
        { name: "About Us", path: "/about-us" },
        { name: "Site Map", path: "/site-map" },
        { name: "Terms And Conditions", path: "/terms-conditions" },
        { name: "Disclaimer Policy", path: "/disclaimer" },
        { name: "Health Blog", path: "/blogs" },
        { name: "Latest Articles", path: "/articles" },
        { name: "Referral & Earn Program", path: "/referral" }
      ]
    },
    {
      title: content.categories?.[2]?.title || "FAQs & Support",
      color: "bg-[#E6F7F7] border-[#006D6D]/20 text-[#006D6D]",
      links: [
        { name: "How to Place an Order", path: "/how-to-order" },
        { name: "Refunds and Returns Policy", path: "/refund-policy" },
        { name: "Cancellation Policy", path: "/cancellation-policy" },
        { name: "Frequently Asked Questions", path: "/faqs" },
        { name: "Review Guidelines", path: "/review-guidelines" },
        { name: "About Indian Pharmacies", path: "/about-indian-pharmacies" }
      ]
    },
    {
      title: content.categories?.[3]?.title || "Account & Transactions",
      color: "bg-[#f5b23e]/10 border-[#f5b23e]/25 text-[#d48806]",
      links: [
        { name: "My Account Profile", path: "/account" },
        { name: "My Orders & History", path: "/orders" },
        { name: "Shopping Cart", path: "/cart" },
        { name: "Checkout Securely", path: "/checkout" },
        { name: "Upload Prescription (Rx)", path: "/upload-rx" },
        { name: "Track Active Order", path: "/track-order" }
      ]
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[24px] md:text-[44px] font-bold tracking-tight">{content.heroTitle}</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            {content.heroSub}
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Grid Links Directory */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-6 bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className={`text-[16px] md:text-[18px] font-bold px-4 py-2 rounded-xl border ${section.color} tracking-wide`}>
                {section.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {section.links.map((link, i) => (
                  <li key={i} className="group flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006D6D] transition-all group-hover:scale-150"></span>
                    <Link
                      to={link.path}
                      className="text-[13.5px] md:text-[14.5px] font-medium text-gray-600 hover:text-[#006D6D] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SitemapPage
