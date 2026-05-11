import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogsImg from '../assets/blogs.png';
import allergyImg from '../assets/allergy.png';
import diabetesImg from '../assets/diabetes.png';
import skinCareImg from '../assets/skin-care.png';

const BlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const savedBlogs = localStorage.getItem('cb_blogs');
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    } else {
      const defaultBlogs = [
        { id: 1, image: allergyImg, category: 'ALLERGY', title: 'How to Get a Splinter Out: 9 Tips to Try at Home', author: 'Shiv Sudhakar, MD', date: 'May 1, 2026', slug: 'splinter' },
        { id: 2, image: diabetesImg, category: 'DIABETES', title: 'Managing Diabetes: Tips for daily life', author: 'Jane Doe, MD', date: 'May 5, 2026', slug: 'diabetes' },
        { id: 3, image: skinCareImg, category: 'SKIN CARE', title: 'Skincare routine for glowing skin', author: 'John Smith, MD', date: 'May 10, 2026', slug: 'skincare' }
      ];
      setBlogs(defaultBlogs);
    }
  }, []);
  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="relative bg-[#f5b23e] pt-10 pb-16 md:pt-16 md:pb-24 px-4 md:px-8 overflow-hidden">
        {/* Abstract Background Shapes (Pills) */}
        <div className="absolute top-10 right-1/4 w-20 h-40 bg-white rounded-full opacity-20 transform rotate-12"></div>
        <div className="absolute -top-10 right-1/3 w-16 h-32 bg-white rounded-full opacity-10 transform -rotate-12"></div>
        <div className="absolute bottom-10 right-1/2 w-24 h-48 bg-white rounded-full opacity-15 transform rotate-45"></div>

        {/* Content Container */}
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          {/* Left Side */}
          <div className="md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
            <div className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
              <span className="font-bold">GoodRx</span> 
              <span className="font-normal">Health</span>
            </div>
            <h1 className="text-[32px] md:text-[48px] font-extrabold text-gray-900 leading-tight font-serif">
              The Answers You Need
            </h1>
            <p className="text-[15px] md:text-[18px] text-gray-800">
              Trusted healthcare information from our experts
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button className="bg-black text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-base hover:bg-gray-800 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Meet the team
              </button>
              <button className="bg-white text-black border-2 border-black px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-base hover:bg-gray-100 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Our editorial standards
              </button>
            </div>
          </div>
          
          {/* Right Side (Illustration) */}
          <div className="md:w-1/2 mt-4 md:mt-0 flex justify-center relative">
            {/* We try to use the generated image or a fallback */}
            <div className="relative flex items-center justify-center translate-y-10">
              {/* Image from assets */}
              <img 
                src={blogsImg} 
                alt="Healthcare Professionals" 
                className="max-w-full h-auto"
                style={{ 
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              
              {/* Fallback UI if image fails */}
              <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-800 p-6 text-center">
                <div className="text-6xl mb-4">🩺👩‍⚕️👨‍⚕️</div>
                <div className="font-bold text-lg">Healthcare Information</div>
                <div className="text-sm">Image failed to load from local artifacts.</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave bottom effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 100C360 100 720 0 1440 100V100H0V100Z" fill="white"/>
            <path d="M0 50C480 100 960 0 1440 50V100H0V50Z" fill="white" opacity="0.5"/>
          </svg>
        </div>
      </div>
      
      {/* Page Content Placeholder */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <h2 className="text-[22px] md:text-[28px] font-bold text-gray-900 mb-4 md:mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map(post => (
            <div key={post.id} onClick={() => navigate(`/blog/${post.slug}`)} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative">
                <img src={post.image || post.img} alt={post.title} className="w-full h-56 object-cover" />
                <div className="absolute -bottom-3 left-4 bg-[#f5b23e] text-black text-xs font-bold px-3 py-1.5 uppercase rounded-sm shadow-sm">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 pt-6">
                <h3 className="text-[20px] font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h3>
                
                <div className="space-y-1">
                  <div className="text-sm font-bold text-gray-800">{post.author}</div>
                  <div className="text-xs text-gray-500">Updated on {post.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
