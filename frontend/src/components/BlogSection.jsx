import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import blog1 from '../assets/blog-1.png'
import blog2 from '../assets/blog-2.png'
import blog3 from '../assets/blog-3.png'
import blog4 from '../assets/blog-4.png'
import blog5 from '../assets/blog-5.png'

const defaultBlogs = [
  {
    id: 1,
    image: blog1,
    title: 'Travel Vaccines: How to Get Vaccinated for Yellow Fever, Malaria, and More',
    date: 'Updated on Apr 29, 2026',
    author: 'By Jennifer Gershman, PharmD, CPh, PACS',
    category: 'VACCINES',
    slug: 'travel-vaccines'
  },
  {
    id: 2,
    image: blog2,
    title: 'Female-Pattern Baldness: Causes and Treatments for Genetic Hair Loss in Women',
    date: 'Updated on Apr 30, 2026',
    author: 'By Maria Robinson, MD, MBA',
    category: 'WOMEN\'S HEALTH',
    slug: 'female-pattern-baldness'
  },
  {
    id: 3,
    image: blog3,
    title: '5 Supplements That May Decrease Your Risk of Dementia',
    date: 'Updated on May 6, 2026',
    author: 'By Jennifer Arnouville, DO, FAAFP',
    category: 'DEMENTIA',
    slug: '5-supplements-dementia'
  },
  {
    id: 4,
    image: blog4,
    title: 'Understanding Prescription Labels and Dosages',
    date: 'May 02, 2026',
    excerpt: 'Crack the code on your medication labels to ensure you are taking your prescriptions safely and effectively.',
    category: 'Medication Safety',
    slug: 'prescription-labels'
  },
  {
    id: 5,
    image: blog5,
    title: 'Advancements in Healthcare Technology for 2026',
    date: 'April 28, 2026',
    excerpt: 'Explore the latest innovations in medical technology that are transforming patient care and treatment outcomes.',
    category: 'Technology',
    slug: 'healthcare-technology'
  }
]

function BlogSection() {
  const [blogs, setBlogs] = useState(defaultBlogs);

  useEffect(() => {
    const savedBlogs = localStorage.getItem('cb_blogs');
    if (savedBlogs) {
      const parsedBlogs = JSON.parse(savedBlogs);
      // Filter blogs that should be shown on home page (default to true if undefined)
      const dynamicBlogs = parsedBlogs.filter(b => b.showOnHome !== false);
      
      // Combine dynamic blogs with default blogs, removing duplicates by slug
      const combined = [...dynamicBlogs];
      
      defaultBlogs.forEach(defBlog => {
        if (!combined.some(b => b.slug === defBlog.slug)) {
          combined.push(defBlog);
        }
      });
      
      // Take top 5 for the layout
      setBlogs(combined.slice(0, 5));
    }
  }, []);
  return (
    <section className="bg-white pb-12 md:pb-20 pt-10 px-4 md:px-12 overflow-hidden">
      <div className="max-w-[1250px] mx-auto">
        <div className="text-left mb-10">
          <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.15em] mb-2 text-black">
            Latest Blogs & Health Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Column 1: Card 1 */}
          <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8">
            {/* Card 1 */}
            <Link to={`/blog/${blogs[0].slug}`} className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col min-h-[650px] cursor-pointer">
              <img src={blogs[0].image} alt={blogs[0].title} className="w-full h-full object-cover transition-transform duration-500 absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="relative mt-auto p-6 flex flex-col items-start text-left z-10">
                <span className="bg-[#FFD200] text-black text-[11px] font-bold uppercase py-1 px-2 rounded-sm mb-3">
                  {blogs[0].category}
                </span>
                <h3 className="text-[20px] md:text-[22px] font-bold text-white mb-2 leading-snug">
                  {blogs[0].title}
                </h3>
                <div className="text-white/90 text-[13px] font-semibold mb-1">
                  {blogs[0].author}
                </div>
                <div className="text-white/70 text-[12px]">
                  {blogs[0].date}
                </div>
              </div>
            </Link>
          </div>

          {/* Column 2-3: Card 2, Card 4, Card 5 */}
          <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
            {/* Card 2 */}
            <Link to={`/blog/${blogs[1].slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row border border-gray-100 cursor-pointer md:h-[170px]">
              <div className="relative w-full md:w-[45%] h-[200px] md:h-auto overflow-hidden">
                <img src={blogs[1].image} alt={blogs[1].title} className="w-full h-full object-cover transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col justify-center flex-grow md:w-[55%]">
                <span className="bg-[#FFD200] text-black text-[11px] font-bold uppercase py-1 px-2 rounded-sm mb-3 self-start">
                  {blogs[1].category}
                </span>
                <h3 className="text-[18px] md:text-[22px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#004D4D] transition-colors">
                  {blogs[1].title}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                  <span>{blogs[1].author}</span>
                  <span>•</span>
                  <span>{blogs[1].date}</span>
                </div>
              </div>
            </Link>

            {/* Grid for Card 4 and Card 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Card 4 */}
              <Link to={`/blog/${blogs[3].slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col border border-gray-100 cursor-pointer">
                <div className="relative h-[200px] md:h-[220px] overflow-hidden">
                  <img src={blogs[3].image} alt={blogs[3].title} className="w-full h-full object-cover transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-[#004D4D] text-white text-[11px] font-bold uppercase py-1 px-3 rounded-full">
                    {blogs[3].category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[#004D4D] text-[12px] font-semibold mb-2">{blogs[3].date}</div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#004D4D] transition-colors">
                    {blogs[3].title}
                  </h3>
                  <p className="text-gray-600 text-[13px] md:text-[14px] leading-relaxed mb-4 flex-grow">
                    {blogs[3].excerpt}
                  </p>
                  <div className="mt-auto">
                    <span className="text-[#004D4D] text-[13px] font-bold hover:underline cursor-pointer flex items-center gap-1">
                      Read More <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </Link>

              {/* Card 5 */}
              <Link to={`/blog/${blogs[4].slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col border border-gray-100 cursor-pointer">
                <div className="relative h-[200px] md:h-[220px] overflow-hidden">
                  <img src={blogs[4].image} alt={blogs[4].title} className="w-full h-full object-cover transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-[#004D4D] text-white text-[11px] font-bold uppercase py-1 px-3 rounded-full">
                    {blogs[4].category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[#004D4D] text-[12px] font-semibold mb-2">{blogs[4].date}</div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#004D4D] transition-colors">
                    {blogs[4].title}
                  </h3>
                  <p className="text-gray-600 text-[13px] md:text-[14px] leading-relaxed mb-4 flex-grow">
                    {blogs[4].excerpt}
                  </p>
                  <div className="mt-auto">
                    <span className="text-[#004D4D] text-[13px] font-bold hover:underline cursor-pointer flex items-center gap-1">
                      Read More <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Card 3 (Spans all columns) */}
          <div className="lg:col-span-3">
            <Link to={`/blog/${blogs[2].slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row border border-gray-100 cursor-pointer md:h-[170px]">
              <div className="relative w-full md:w-[45%] h-[200px] md:h-auto overflow-hidden">
                <img src={blogs[2].image} alt={blogs[2].title} className="w-full h-full object-cover transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col justify-center flex-grow md:w-[55%]">
                <span className="bg-[#FFD200] text-black text-[11px] font-bold uppercase py-1 px-2 rounded-sm mb-3 self-start">
                  {blogs[2].category}
                </span>
                <h3 className="text-[18px] md:text-[22px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#004D4D] transition-colors">
                  {blogs[2].title}
                </h3>
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
