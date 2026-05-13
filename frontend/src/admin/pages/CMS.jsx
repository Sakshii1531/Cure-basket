import React, { useState, useEffect } from 'react';

function CMS() {
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('cb_cms');
    const defaultPages = {
      about: 'Welcome to CureBasket. We provide the best medicines...',
      privacy: 'Your privacy is important to us...',
      terms: 'By using our site, you agree to these terms...',
      whyChoose: 'We offer genuine medicines, fast delivery, and best prices.'
    };
    return saved ? JSON.parse(saved) : defaultPages;
  });

  useEffect(() => {
    localStorage.setItem('cb_cms', JSON.stringify(pages));
  }, [pages]);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Pages updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Static Pages Content (CMS)</h2>
        <p className="text-gray-500 text-sm">Edit the content of static pages like About Us, Privacy Policy, etc.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">About Us</label>
            <textarea 
              value={pages.about}
              onChange={(e) => setPages({...pages, about: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              rows="5"
            ></textarea>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Why Choose Curebasket</label>
            <textarea 
              value={pages.whyChoose || ''}
              onChange={(e) => setPages({...pages, whyChoose: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              rows="5"
            ></textarea>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Privacy Policy</label>
            <textarea 
              value={pages.privacy}
              onChange={(e) => setPages({...pages, privacy: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              rows="5"
            ></textarea>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Terms & Conditions</label>
            <textarea 
              value={pages.terms}
              onChange={(e) => setPages({...pages, terms: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              rows="5"
            ></textarea>
          </div>
          <div>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CMS;
