import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import blog1 from '../assets/blog-1.png'
import blog2 from '../assets/blog-2.png'
import blog3 from '../assets/blog-3.png'
import blog4 from '../assets/blog-4.png'
import blog5 from '../assets/blog-5.png'

const staticBlogs = [
  { id: 1, image: blog1, title: 'Travel Vaccines: How to Get Vaccinated for Yellow Fever, Malaria, and More', date: 'Updated on Apr 29, 2026', author: 'By Jennifer Gershman, PharmD', category: 'VACCINES', slug: 'travel-vaccines' },
  { id: 2, image: blog2, title: 'Female-Pattern Baldness: Causes and Treatments for Genetic Hair Loss in Women', date: 'Updated on Apr 30, 2026', author: 'By Maria Robinson, MD', category: "WOMEN'S HEALTH", slug: 'female-pattern-baldness' },
  { id: 3, image: blog3, title: '5 Supplements That May Decrease Your Risk of Dementia', date: 'Updated on May 6, 2026', author: 'By Jennifer Arnouville, DO', category: 'DEMENTIA', slug: '5-supplements-dementia' },
  { id: 4, image: blog4, title: 'Understanding Prescription Labels and Dosages', date: 'May 02, 2026', excerpt: 'Crack the code on your medication labels to ensure you are taking your prescriptions safely.', category: 'Medication Safety', slug: 'prescription-labels' },
  { id: 5, image: blog5, title: 'Advancements in Healthcare Technology for 2026', date: 'April 28, 2026', excerpt: 'Explore the latest innovations in medical technology transforming patient care.', category: 'Technology', slug: 'healthcare-technology' },
]

function mapBlog(b) {
  return {
    id: b._id || b.id,
    image: b.image || null,
    title: b.title,
    date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : b.date,
    author: b.author || 'CureBasket Team',
    category: (b.tags && b.tags[0]) ? b.tags[0].toUpperCase() : (b.category || 'Health'),
    slug: b.slug,
    excerpt: b.sections?.[0]?.content?.slice(0, 120) || b.excerpt || '',
  }
}

function BlogSection() {
  const [blogs, setBlogs] = useState(staticBlogs)

  useEffect(() => {
    api.get('/blogs?limit=5')
      .then(res => {
        const data = res.data.data
        if (Array.isArray(data) && data.length >= 5) {
          setBlogs(data.filter(b => b.isPublished !== false).slice(0, 5).map(mapBlog))
        } else if (Array.isArray(data) && data.length > 0) {
          const apiBlogs = data.filter(b => b.isPublished !== false).map(mapBlog)
          const merged = [...apiBlogs]
          staticBlogs.forEach(s => {
            if (!merged.some(b => b.slug === s.slug)) merged.push(s)
          })
          setBlogs(merged.slice(0, 5))
        }
      })
      .catch(() => {})
  }, [])

  const imgSrc = (b, fallback) => b.image && !b.image.startsWith('data:') && b.image.startsWith('http') ? b.image : (b.image && b.image.startsWith('data:') ? b.image : fallback)

  if (blogs.length < 5) return null

  return (
    <section className="bg-white pb-12 md:pb-20 pt-10 px-4 md:px-12 overflow-hidden">
      <div className="max-w-[1250px] mx-auto">
        <div className="text-left mb-10">
          <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.15em] mb-2 text-black">
            Latest Blogs & Health Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8">
            <Link to={`/blog/${blogs[0].slug}`} className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-[350px] md:h-auto md:min-h-[650px] cursor-pointer">
              <img src={imgSrc(blogs[0], blog1)} alt={blogs[0].title} className="w-full h-full object-cover transition-transform duration-500 absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="relative mt-auto p-6 flex flex-col items-start text-left z-10">
                <span className="bg-[#FFD200] text-black text-[11px] font-bold uppercase py-1 px-2 rounded-sm mb-3">{blogs[0].category}</span>
                <h3 className="text-[14px] md:text-[22px] font-bold text-white mb-2 leading-snug">{blogs[0].title}</h3>
                <div className="text-white/90 text-[13px] font-semibold mb-1">{blogs[0].author}</div>
                <div className="text-white/70 text-[12px]">{blogs[0].date}</div>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
            <Link to={`/blog/${blogs[1].slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row border border-gray-100 cursor-pointer h-[350px] md:h-[170px]">
              <div className="relative w-full md:w-[45%] h-[200px] md:h-auto overflow-hidden">
                <img src={imgSrc(blogs[1], blog2)} alt={blogs[1].title} className="w-full h-full object-cover transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col justify-center flex-grow md:w-[55%]">
                <span className="bg-[#FFD200] text-black text-[11px] font-bold uppercase py-1 px-2 rounded-sm mb-3 self-start">{blogs[1].category}</span>
                <h3 className="text-[14px] md:text-[22px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#004D4D] transition-colors">{blogs[1].title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>{blogs[1].author}</span>
                  <span>•</span>
                  <span>{blogs[1].date}</span>
                </div>
              </div>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Link to={`/blog/${blogs[3].slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col border border-gray-100 cursor-pointer h-[350px] md:h-auto">
                <div className="relative h-[200px] md:h-[220px] overflow-hidden">
                  <img src={imgSrc(blogs[3], blog4)} alt={blogs[3].title} className="w-full h-full object-cover transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-[#004D4D] text-white text-[11px] font-bold uppercase py-1 px-3 rounded-full">{blogs[3].category}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[#004D4D] text-[11px] md:text-[12px] font-semibold mb-2">{blogs[3].date}</div>
                  <h3 className="text-[14px] md:text-[18px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#004D4D] transition-colors">{blogs[3].title}</h3>
                  <p className="text-gray-600 text-[11px] md:text-[14px] leading-relaxed mb-4 flex-grow">{blogs[3].excerpt}</p>
                  <span className="text-[#004D4D] text-[13px] font-bold hover:underline cursor-pointer flex items-center gap-1 mt-auto">
                    Read More <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>

              <Link to={`/blog/${blogs[4].slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col border border-gray-100 cursor-pointer h-[350px] md:h-auto">
                <div className="relative h-[200px] md:h-[220px] overflow-hidden">
                  <img src={imgSrc(blogs[4], blog5)} alt={blogs[4].title} className="w-full h-full object-cover transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-[#004D4D] text-white text-[11px] font-bold uppercase py-1 px-3 rounded-full">{blogs[4].category}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[#004D4D] text-[11px] md:text-[12px] font-semibold mb-2">{blogs[4].date}</div>
                  <h3 className="text-[14px] md:text-[18px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#004D4D] transition-colors">{blogs[4].title}</h3>
                  <p className="text-gray-600 text-[11px] md:text-[14px] leading-relaxed mb-4 flex-grow">{blogs[4].excerpt}</p>
                  <span className="text-[#004D4D] text-[13px] font-bold hover:underline cursor-pointer flex items-center gap-1 mt-auto">
                    Read More <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Link to={`/blog/${blogs[2].slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row border border-gray-100 cursor-pointer h-[350px] md:h-[170px]">
              <div className="relative w-full md:w-[45%] h-[200px] md:h-auto overflow-hidden">
                <img src={imgSrc(blogs[2], blog3)} alt={blogs[2].title} className="w-full h-full object-cover transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col justify-center flex-grow md:w-[55%]">
                <span className="bg-[#FFD200] text-black text-[11px] font-bold uppercase py-1 px-2 rounded-sm mb-3 self-start">{blogs[2].category}</span>
                <h3 className="text-[14px] md:text-[22px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#004D4D] transition-colors">{blogs[2].title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>{blogs[2].author}</span>
                  <span>•</span>
                  <span>{blogs[2].date}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
