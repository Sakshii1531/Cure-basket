import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import blogsImg from '../assets/blogs.png';
import allergyImg from '../assets/allergy.png';
import diabetesImg from '../assets/diabetes.png';
import skinCareImg from '../assets/skin-care.png';

const defaultBlogs = [
  { id: 1, image: allergyImg, category: 'ALLERGY', title: 'How to Get a Splinter Out: 9 Tips to Try at Home', author: 'Shiv Sudhakar, MD', date: 'May 1, 2026', slug: 'splinter' },
  { id: 2, image: diabetesImg, category: 'DIABETES', title: 'Managing Diabetes: Tips for daily life', author: 'Jane Doe, MD', date: 'May 5, 2026', slug: 'diabetes' },
  { id: 3, image: skinCareImg, category: 'SKIN CARE', title: 'Skincare routine for glowing skin', author: 'John Smith, MD', date: 'May 10, 2026', slug: 'skincare' },
];

const BlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(defaultBlogs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs?limit=50')
      .then(res => {
        const data = res.data.data;
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data.filter(b => b.isPublished !== false).map(b => ({
            id: b._id,
            image: b.image || null,
            category: (b.tags && b.tags[0]) ? b.tags[0].toUpperCase() : 'HEALTH',
            title: b.title,
            author: b.author || 'CureBasket Team',
            date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
            slug: b.slug,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="relative bg-[#f5b23e] pt-10 pb-16 md:pt-16 md:pb-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute top-10 right-1/4 w-20 h-40 bg-white rounded-full opacity-20 transform rotate-12"></div>
        <div className="absolute -top-10 right-1/3 w-16 h-32 bg-white rounded-full opacity-10 transform -rotate-12"></div>
        <div className="absolute bottom-10 right-1/2 w-24 h-48 bg-white rounded-full opacity-15 transform rotate-45"></div>

        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
            <div className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
              <span className="font-bold">CureBasket</span>
              <span className="font-normal">Health</span>
            </div>
            <h1 className="text-[32px] md:text-[48px] font-extrabold text-gray-900 leading-tight font-serif">
              The Answers You Need
            </h1>
            <p className="text-[15px] md:text-[18px] text-gray-800">
              Trusted healthcare information from our experts
            </p>
          </div>

          <div className="md:w-1/2 mt-4 md:mt-0 flex justify-center relative">
            <div className="relative flex items-center justify-center translate-y-10">
              <img
                src={blogsImg}
                alt="Healthcare Professionals"
                className="max-w-full h-auto"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)'
                }}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 100C360 100 720 0 1440 100V100H0V100Z" fill="white"/>
            <path d="M0 50C480 100 960 0 1440 50V100H0V50Z" fill="white" opacity="0.5"/>
          </svg>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <h2 className="text-[22px] md:text-[28px] font-bold text-gray-900 mb-4 md:mb-6">Latest Articles</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-50 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map(post => (
              <div
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={post.image || allergyImg}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                    onError={e => { e.target.src = allergyImg }}
                  />
                  <div className="absolute -bottom-3 left-4 bg-[#f5b23e] text-black text-xs font-bold px-3 py-1.5 uppercase rounded-sm shadow-sm">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 pt-6">
                  <h3 className="text-[20px] font-bold text-gray-900 mb-4 leading-tight">{post.title}</h3>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-gray-800">{post.author}</div>
                    <div className="text-xs text-gray-500">Updated on {post.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
