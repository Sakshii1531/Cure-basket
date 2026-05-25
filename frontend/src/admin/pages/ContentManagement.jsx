import React, { useState, useEffect } from 'react'
import api from '../../utils/api'

// Pre-defined fallback default contents for all 12 pages
const DEFAULTS = {
  aboutUs: {
    heroTitle: "About CureBasket",
    heroSub: "Your trusted global partner for high-quality, affordable healthcare and medicines delivered right to your doorstep.",
    stats: [
      { value: "15+", label: "Years of Service" },
      { value: "1M+", label: "Happy Customers" },
      { value: "99.9%", label: "Safe Deliveries" },
      { value: "24/7", label: "Customer Support" }
    ],
    values: [
      { title: "Quality Guaranteed", description: "We source medications exclusively from WHO-GMP certified suppliers and reputable manufacturers, ensuring absolute safety." },
      { title: "Absolute Privacy", description: "Your health records, order history, and personal details are encrypted and kept strictly confidential. Privacy is our top priority." },
      { title: "Affordable Care", description: "By sourcing quality generic alternatives directly, we offer deep discounts and up to 70% savings compared to standard offline drugstores." }
    ]
  },
  sitemap: {
    heroTitle: "CureBasket Site Map",
    heroSub: "Quickly navigate to any page on our platform. Find medicines, guidelines, policies, and account settings easily.",
    categories: [
      { title: "Shop & Categories" },
      { title: "CureBasket Info" },
      { title: "FAQs & Support" },
      { title: "Account & Transactions" }
    ]
  },
  terms: {
    heroTitle: "Terms & Conditions",
    heroSub: "Please read these terms carefully before accessing or using our services.",
    warning: "Important Notice: By utilizing this platform to purchase generic or brand medicines, you verify that you are under the care of a licensed physician who has authorized these medications for your health regime.",
    sections: [
      { title: "1. Introduction", content: "Welcome to CureBasket.com. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions. Please review them carefully. If you do not agree to these terms, you must not use this site." },
      { title: "2. Age and Eligibility", content: "You must be at least 21 years of age to use this website or make purchases. By placing an order, you represent and warrant that you are of legal age and that you possess the legal authority to enter into a binding agreement." },
      { title: "3. Prescription Requirement", content: "Certain products offered on CureBasket require a valid prescription from a licensed healthcare provider. We reserve the right to verify prescriptions and hold or cancel orders if a valid prescription is not uploaded or provided upon request." },
      { title: "4. No Medical Advice", content: "The content, articles, and product information available on CureBasket.com are for informational purposes only. They do not constitute medical advice, diagnosis, or treatment. Always consult with your doctor or healthcare professional before starting any new medication." },
      { title: "5. Pricing, Orders and Payments", content: "All prices are listed in USD unless stated otherwise. We reserve the right to refuse or cancel any order for any reason, including product availability, pricing errors, or suspicion of fraud. Payment must be processed securely before shipment." },
      { title: "6. Shipping & Customs", content: "CureBasket ships healthcare products globally. Customers are responsible for ensuring that the products ordered are legal for import into their respective country. CureBasket is not liable for customs delays, confiscations, or local importing taxes." }
    ]
  },
  disclaimer: {
    heroTitle: "Disclaimer Policy",
    heroSub: "Please read our medical and operational disclaimers carefully.",
    warning: "CureBasket.com does not authorize, endorse, or manufacture medical goods. We serve purely as an online sourcing platform. Never disregard medical advice or delay seeking it due to any details read on this platform.",
    sections: [
      { title: "Medical Information & Advice Disclaimer", content: "All health-related information and product descriptions on CureBasket.com are for informational purposes only. We do not provide clinical diagnosis, medical guidance, or treatment plans. You should never rely on our digital information as a replacement for advice from your certified general practitioner or qualified specialist." },
      { title: "Brand and Intellectual Property", content: "Any brand names, logos, or trademarks referenced on this website are the property of their respective owners. Their mention here is purely for identification and referencing generic equivalents. CureBasket is not affiliated with or endorsed by the brand patent holders." },
      { title: "Product Sourcing & FDA Status", content: "Generic and brand drugs shipped from international pharmacies (including India) are regulated and approved by local equivalent authorities. They might look slightly different in packaging or color compared to local retail formats in your home country, despite containing identical active pharmaceutical ingredients (APIs)." },
      { title: "Importing and Legal Compliance", content: "It is the customer's sole responsibility to ensure that buying and importing medications through our platform complies with local import laws, prescriptions regulations, and customs guidelines in their respective country of residence." }
    ]
  },
  articles: [
    { title: "Understanding Generic vs. Brand Name Medicines", desc: "Learn why generic drugs are equally safe, effective, and up to 80% cheaper than their brand-name counterparts.", category: "EDUCATION", readTime: "5 min read", author: "CureBasket Medical Team", date: "May 15, 2026" },
    { title: "Essential Tips for Safe Online Prescription Ordering", desc: "A complete safety guide on checking certifications, verifying medical dosages, and keeping health records secure.", category: "SAFETY", readTime: "4 min read", author: "Dr. Elena Rostova", date: "May 18, 2026" },
    { title: "Managing Seasonal Allergies: Natural vs. OTC Remedies", desc: "Our resident pharmacists break down standard antihistamines, correct usage patterns, and simple home care tips.", category: "WELLNESS", readTime: "7 min read", author: "CureBasket Pharmacists", date: "May 20, 2026" },
    { title: "Top 5 Healthcare Innovations in Indian Generic Pharma", desc: "An inside look at how India became the world's pharmacy, offering premium manufacturing and affordable treatments.", category: "PHARMACY", readTime: "6 min read", author: "Prof. Rajesh Kumar", date: "May 22, 2026" }
  ],
  referral: {
    heroTitle: "Refer a Friend & Earn $20",
    heroSub: "Help your friends get authentic, highly affordable medicines. They save 20% on their first order, and you get $20 credits!",
    tag: "Share the Health, Share the Rewards",
    code: "CUREBASKET20",
    steps: [
      { title: "Share Referral Code", desc: "Send your unique referral code or link to your friends, family, or colleagues who buy medications online." },
      { title: "They Place First Order", desc: "Your friends sign up and apply the code to receive a flat 20% discount on their very first purchase." },
      { title: "You Earn $20 Reward", desc: "Once their package is successfully dispatched, you instantly receive a $20 gift voucher directly in your account." }
    ]
  },
  howToOrder: {
    heroTitle: "How To Place An Order",
    heroSub: "A simple, transparent, and step-by-step guide to ordering your medicines online.",
    steps: [
      { num: "1", title: "Search & Select Medicines", desc: "Use our intelligent search bar or browse through medical categories to find brand or generic options. Adjust quantities and click 'Add to Cart'." },
      { num: "2", title: "Upload Prescription (Rx)", desc: "If any item in your cart requires a prescription, upload a photo or PDF of your doctor's slip during checkout or via the 'Upload Rx' dashboard." },
      { num: "3", title: "Secure Checkout & Payment", desc: "Enter your global shipping address. Choose from our fast and highly encrypted payment gateways to finalize your purchase securely." },
      { num: "4", title: "Pharmacist Review & Dispatch", desc: "Our qualified pharmacists review your order details. Once verified, the products are packed safely in tamper-proof boxes and dispatched." },
      { num: "5", title: "Global Doorstep Delivery", desc: "Your tracking number is shared immediately. Receive your healthcare supplies directly at your address via secure courier networks." }
    ]
  },
  refundPolicy: {
    heroTitle: "Refunds & Returns Policy",
    heroSub: "Read our clear policies regarding customer satisfaction, parcel returns, and refund channels.",
    warning: "We stand by our shipping guarantees. Standard medical prescription supplies fall under strict global safety guidelines. Therefore, we do not require physical product returns to process authentic shipping refund claims.",
    sections: [
      { title: "100% Money-Back Guarantee", desc: "If your parcel is lost in transit, damaged during shipment, or holds incorrect items, we provide a full refund or free reshipment without any additional charges." },
      { title: "Delivery Timeline Window", desc: "For express shipping, if your delivery exceeds 21 business days, please contact our support team. We will immediately initiate a complete check or issue a full refund." },
      { title: "Eligible Sourcing Issues", desc: "If a medication does not match your prescription dosage or shows manufacturing anomalies, we require digital photographic evidence to process your claim immediately." }
    ]
  },
  cancellationPolicy: {
    heroTitle: "Cancellation Policy",
    heroSub: "Learn about how and when you can cancel your medical orders.",
    warning: "Standard prescription approvals, doctor review approvals, and shipping dispatch processes happen fast. If you need to cancel an order, please do so within 2 hours of payment to guarantee a full, frictionless refund.",
    steps: [
      { title: "1. Prior to Shipment Dispatch", desc: "You can cancel any order free of charge before it is dispatched from our pharmacy warehouse. Standard order review processing takes between 2 to 6 hours after successful payment." },
      { title: "2. Post Shipment Dispatch", desc: "Once your package is handed over to our courier networks and your tracking ID is issued, the order can no longer be cancelled. Please contact our support desk if you have any immediate delivery change requests." },
      { title: "3. Refunds Processing Window", desc: "For all approved cancellations, the refund amount is reversed directly to your original payment card or wallet. Reversals typically reflect in your account within 5 to 7 business days, depending on bank regulations." }
    ]
  },
  faqs: [
    { q: "How to check the expiry date of medicine online?", a: "CureBasket has a team of pharmacists who ensure their customers do not get expired medicines and that the product is in good condition...", cat: "medicines" },
    { q: "Can I buy medicine online?", a: "Absolutely! You can buy medicine online at the lowest rates...", cat: "general" }
  ],
  reviewGuidelines: {
    heroTitle: "Review Guidelines",
    heroSub: "Learn about how to write useful, legal, and authentic reviews regarding your medical orders.",
    dos: [
      "Focus on your personal experience with the medicine's packaging, dispatch, and delivery speed.",
      "Describe customer support efficiency if you interacted with our pharmacitical review teams."
    ],
    donts: [
      "Do not post clinical diagnoses, medical prescription dosages, or healthcare suggestions.",
      "Do not list personal contact detail (phone, address, emails) in reviews."
    ]
  },
  indianPharmacies: {
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
      { condition: "Hypertension", active: "Telmisartan", brandPrice: "$180", genericPrice: "$28", savings: "84% Savings" }
    ]
  }
}

const TABS = [
  { id: 'aboutUs', label: 'About Us' },
  { id: 'sitemap', label: 'Site Map' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'disclaimer', label: 'Disclaimer' },
  { id: 'articles', label: 'Articles' },
  { id: 'referral', label: 'Referral Program' },
  { id: 'howToOrder', label: 'How to Order' },
  { id: 'refundPolicy', label: 'Refund Policy' },
  { id: 'cancellationPolicy', label: 'Cancellation Policy' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'reviewGuidelines', label: 'Review Guidelines' },
  { id: 'indianPharmacies', label: 'Indian Pharmacies' }
]

function ContentManagement() {
  const [activeTab, setActiveTab] = useState('aboutUs')
  const [data, setData] = useState(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    api.get('/settings/cms')
      .then(res => {
        if (res.data.data) {
          // Merge defaults with loaded data to make sure no keys are missing
          setData(prev => ({
            ...prev,
            ...res.data.data
          }))
        }
      })
      .catch(() => {})
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/settings/cms', data)
      showToast('Content updated successfully!')
    } catch {
      showToast('Failed to save content. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Update deep state helpers
  const updateField = (tabKey, field, value) => {
    setData(prev => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        [field]: value
      }
    }))
  }

  const updateArrayField = (tabKey, arrayField, index, field, value) => {
    setData(prev => {
      const arr = [...(prev[tabKey][arrayField] || [])]
      arr[index] = { ...arr[index], [field]: value }
      return {
        ...prev,
        [tabKey]: {
          ...prev[tabKey],
          [arrayField]: arr
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Footer Pages Content Management</h2>
        <p className="text-gray-500 text-sm">Dynamically edit the headers, text lists, policy terms, and custom grids of all 12 footer pages.</p>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className={`px-4 py-3 rounded-lg text-sm font-semibold border ${toast.includes('Failed') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-[#E6F7F7] text-[#006D6D] border-[#006D6D]/10'}`}>
          {toast}
        </div>
      )}

      {/* Main Layout Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-[260px] border-r border-gray-100 bg-gray-50/50 p-4 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar md:overflow-x-visible">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-[#006D6D] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Form Editor */}
        <main className="flex-grow p-6 md:p-8 max-w-4xl overflow-y-auto">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* SUB-SECTION 1: ABOUT US */}
            {activeTab === 'aboutUs' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">About Us Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={data.aboutUs?.heroTitle || ''}
                      onChange={e => updateField('aboutUs', 'heroTitle', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Hero Subtitle</label>
                    <textarea
                      value={data.aboutUs?.heroSub || ''}
                      onChange={e => updateField('aboutUs', 'heroSub', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      rows="3"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-bold text-[#006D6D]">Company Statistics Counters</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {(data.aboutUs?.stats || []).map((st, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 flex gap-2">
                        <div className="w-1/2">
                          <label className="text-[10px] font-bold text-gray-500 block uppercase">Value</label>
                          <input
                            type="text"
                            value={st.value}
                            onChange={e => updateArrayField('aboutUs', 'stats', i, 'value', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="w-1/2">
                          <label className="text-[10px] font-bold text-gray-500 block uppercase">Label</label>
                          <input
                            type="text"
                            value={st.label}
                            onChange={e => updateArrayField('aboutUs', 'stats', i, 'label', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 2: SITEMAP */}
            {activeTab === 'sitemap' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Site Map Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={data.sitemap?.heroTitle || ''}
                      onChange={e => updateField('sitemap', 'heroTitle', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Hero Subtitle</label>
                    <textarea
                      value={data.sitemap?.heroSub || ''}
                      onChange={e => updateField('sitemap', 'heroSub', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      rows="3"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-bold text-[#006D6D]">Directory Categories Titles</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {(data.sitemap?.categories || []).map((cat, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                        <label className="text-[10px] font-bold text-gray-500 block uppercase">Category {i + 1}</label>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={e => updateArrayField('sitemap', 'categories', i, 'title', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 3: TERMS & CONDITIONS */}
            {activeTab === 'terms' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Terms & Conditions Sections</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Warning / Caution Message</label>
                    <textarea
                      value={data.terms?.warning || ''}
                      onChange={e => updateField('terms', 'warning', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      rows="3"
                    />
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-6 pt-4">
                  {(data.terms?.sections || []).map((sec, i) => (
                    <div key={i} className="border border-gray-150 rounded-2xl p-5 bg-gray-50/20 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase">Section {i + 1}</span>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Title</label>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={e => updateArrayField('terms', 'sections', i, 'title', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Content Text</label>
                        <textarea
                          value={sec.content}
                          onChange={e => updateArrayField('terms', 'sections', i, 'content', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                          rows="4"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-SECTION 4: DISCLAIMER */}
            {activeTab === 'disclaimer' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Disclaimer Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Caution Message Block</label>
                    <textarea
                      value={data.disclaimer?.warning || ''}
                      onChange={e => updateField('disclaimer', 'warning', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      rows="3"
                    />
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-6 pt-4">
                  {(data.disclaimer?.sections || []).map((sec, i) => (
                    <div key={i} className="border border-gray-150 rounded-2xl p-5 bg-gray-50/20 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Title</label>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={e => updateArrayField('disclaimer', 'sections', i, 'title', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Content Text</label>
                        <textarea
                          value={sec.content}
                          onChange={e => updateArrayField('disclaimer', 'sections', i, 'content', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                          rows="4"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-SECTION 5: ARTICLES */}
            {activeTab === 'articles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">Healthcare Articles</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(data.articles || [])]
                      list.push({ title: "New Article Title", desc: "Short summary description...", category: "HEALTH", readTime: "5 min read", author: "CureBasket Team", date: "May 25, 2026" })
                      setData(prev => ({ ...prev, articles: list }))
                    }}
                    className="px-3 py-1.5 bg-[#006D6D] text-white text-xs font-bold rounded-lg hover:bg-[#004D4D] transition-colors"
                  >
                    + Add New Article
                  </button>
                </div>

                <div className="space-y-6">
                  {(data.articles || []).map((art, i) => (
                    <div key={i} className="border border-gray-150 rounded-2xl p-5 bg-gray-50/20 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const list = (data.articles || []).filter((_, idx) => idx !== i)
                          setData(prev => ({ ...prev, articles: list }))
                        }}
                        className="absolute right-4 top-4 text-xs font-bold text-red-600 hover:underline"
                      >
                        Remove
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Title</label>
                          <input
                            type="text"
                            value={art.title}
                            onChange={e => {
                              const list = [...(data.articles || [])]
                              list[i].title = e.target.value
                              setData(prev => ({ ...prev, articles: list }))
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Category Tag</label>
                          <input
                            type="text"
                            value={art.category}
                            onChange={e => {
                              const list = [...(data.articles || [])]
                              list[i].category = e.target.value
                              setData(prev => ({ ...prev, articles: list }))
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Author</label>
                          <input
                            type="text"
                            value={art.author}
                            onChange={e => {
                              const list = [...(data.articles || [])]
                              list[i].author = e.target.value
                              setData(prev => ({ ...prev, articles: list }))
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Read Time / Date</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={art.readTime}
                              onChange={e => {
                                const list = [...(data.articles || [])]
                                list[i].readTime = e.target.value
                                setData(prev => ({ ...prev, articles: list }))
                              }}
                              className="w-1/2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                            />
                            <input
                              type="text"
                              value={art.date}
                              onChange={e => {
                                const list = [...(data.articles || [])]
                                list[i].date = e.target.value
                                setData(prev => ({ ...prev, articles: list }))
                              }}
                              className="w-1/2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-gray-700 block mb-1">Summary Description</label>
                          <textarea
                            value={art.desc}
                            onChange={e => {
                              const list = [...(data.articles || [])]
                              list[i].desc = e.target.value
                              setData(prev => ({ ...prev, articles: list }))
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-SECTION 6: REFERRAL */}
            {activeTab === 'referral' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Referral Program Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Golden Header Tag</label>
                    <input
                      type="text"
                      value={data.referral?.tag || ''}
                      onChange={e => updateField('referral', 'tag', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Mock Referral Code</label>
                    <input
                      type="text"
                      value={data.referral?.code || ''}
                      onChange={e => updateField('referral', 'code', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 7: HOW TO ORDER */}
            {activeTab === 'howToOrder' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Ordering Steps Walkthrough</h3>
                <div className="space-y-6">
                  {(data.howToOrder?.steps || []).map((step, i) => (
                    <div key={i} className="border border-gray-150 rounded-2xl p-5 bg-gray-50/20 space-y-3">
                      <span className="text-xs font-bold text-[#006D6D] uppercase">Step {step.num || i + 1}</span>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Title</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={e => updateArrayField('howToOrder', 'steps', i, 'title', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
                        <textarea
                          value={step.desc}
                          onChange={e => updateArrayField('howToOrder', 'steps', i, 'desc', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                          rows="3"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-SECTION 8: REFUND POLICY */}
            {activeTab === 'refundPolicy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Refund Guarantee Details</h3>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Shield Box Guarantee Message</label>
                  <textarea
                    value={data.refundPolicy?.warning || ''}
                    onChange={e => updateField('refundPolicy', 'warning', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* SUB-SECTION 9: CANCELLATION POLICY */}
            {activeTab === 'cancellationPolicy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Cancellation Rules</h3>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Warning Box Message</label>
                  <textarea
                    value={data.cancellationPolicy?.warning || ''}
                    onChange={e => updateField('cancellationPolicy', 'warning', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* SUB-SECTION 10: FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(data.faqs || [])]
                      list.push({ q: "New Expiry or General Question?", a: "Answer text...", cat: "general" })
                      setData(prev => ({ ...prev, faqs: list }))
                    }}
                    className="px-3 py-1.5 bg-[#006D6D] text-white text-xs font-bold rounded-lg hover:bg-[#004D4D] transition-colors"
                  >
                    + Add New FAQ
                  </button>
                </div>

                <div className="space-y-6">
                  {(data.faqs || []).map((faq, i) => (
                    <div key={i} className="border border-gray-150 rounded-2xl p-5 bg-gray-50/20 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const list = (data.faqs || []).filter((_, idx) => idx !== i)
                          setData(prev => ({ ...prev, faqs: list }))
                        }}
                        className="absolute right-4 top-4 text-xs font-bold text-red-600 hover:underline"
                      >
                        Remove
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-gray-700 block mb-1">Question</label>
                          <input
                            type="text"
                            value={faq.q}
                            onChange={e => {
                              const list = [...(data.faqs || [])]
                              list[i].q = e.target.value
                              setData(prev => ({ ...prev, faqs: list }))
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-gray-700 block mb-1">Category Filter Tag</label>
                          <select
                            value={faq.cat}
                            onChange={e => {
                              const list = [...(data.faqs || [])]
                              list[i].cat = e.target.value
                              setData(prev => ({ ...prev, faqs: list }))
                            }}
                            className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                          >
                            <option value="general">General Info</option>
                            <option value="medicines">Medicines & Rx</option>
                            <option value="shipping">Shipping</option>
                            <option value="payments">Payments</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-gray-700 block mb-1">Answer Description</label>
                          <textarea
                            value={faq.a}
                            onChange={e => {
                              const list = [...(data.faqs || [])]
                              list[i].a = e.target.value
                              setData(prev => ({ ...prev, faqs: list }))
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                            rows="3"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-SECTION 11: REVIEW GUIDELINES */}
            {activeTab === 'reviewGuidelines' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Review Guidelines Lists</h3>
                
                {/* DOs */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-emerald-700">Encouraged Items (DOs)</h4>
                  {(data.reviewGuidelines?.dos || []).map((doItem, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={doItem}
                        onChange={e => {
                          const list = [...(data.reviewGuidelines?.dos || [])]
                          list[i] = e.target.value
                          setData(prev => ({
                            ...prev,
                            reviewGuidelines: { ...prev.reviewGuidelines, dos: list }
                          }))
                        }}
                        className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* DONTs */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-bold text-red-700">Avoided Items (DONTs)</h4>
                  {(data.reviewGuidelines?.donts || []).map((dontItem, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={dontItem}
                        onChange={e => {
                          const list = [...(data.reviewGuidelines?.donts || [])]
                          list[i] = e.target.value
                          setData(prev => ({
                            ...prev,
                            reviewGuidelines: { ...prev.reviewGuidelines, donts: list }
                          }))
                        }}
                        className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-SECTION 12: INDIAN PHARMACIES */}
            {activeTab === 'indianPharmacies' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Indian Pharmacies Informative Article</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Paragraph 1 Text</label>
                    <textarea
                      value={data.indianPharmacies?.desc1 || ''}
                      onChange={e => updateField('indianPharmacies', 'desc1', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      rows="4"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Paragraph 2 Text</label>
                    <textarea
                      value={data.indianPharmacies?.desc2 || ''}
                      onChange={e => updateField('indianPharmacies', 'desc2', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SAVE BUTTON */}
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[#006D6D] text-white rounded-xl font-bold text-sm hover:bg-[#004D4D] transition-colors disabled:opacity-60 shadow-lg shadow-[#006D6D]/15 active:scale-95"
              >
                {saving ? 'Saving Changes...' : 'Save Subsection Content'}
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  )
}

export default ContentManagement
