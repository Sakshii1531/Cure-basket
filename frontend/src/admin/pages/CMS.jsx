import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DEFAULT_PAGES = {
  about: 'Welcome to CureBasket. We provide the best medicines...',
  privacy: 'Your privacy is important to us...',
  terms: 'By using our site, you agree to these terms...',
  whyChoose: 'We offer genuine medicines, fast delivery, and best prices.'
};

const DEFAULT_BANNERS = {
  curePlus: {
    title1: 'Join',
    title2: 'CureBasket Plus',
    description: 'Save up to 25% on every order. Free delivery. Priority support. Premium health perks.',
    buttonText: 'Start Free Trial',
    badge: 'Only ₹199/month after!',
  },
  expressDelivery: {
    title1: 'Express',
    title2: 'Delivery in 15 Mins',
    description: 'Running out of essentials? Get them delivered to your doorstep in the blink of an eye.',
    buttonText: 'Order Now',
    badge: 'No minimum order value!',
  },
  healthCheckup: {
    title1: 'Full Body',
    title2: 'Health Checkups',
    description: 'Home sample collection. NABL certified labs. Accurate results in 24 hours.',
    buttonText: 'Book a Test',
    badge: 'Starting from just ₹499!',
  },
  qualityCare: {
    title1: 'Quality care,',
    title2: 'better savings',
    description: 'Trusted medicines. Expert care. Savings you can count on.',
    buttonText: 'Upload Prescription',
    badge: 'It only takes 30 seconds!',
  },
};

const BANNER_LABELS = {
  curePlus: 'CurePlus Membership Banner',
  expressDelivery: 'Express Delivery Banner',
  healthCheckup: 'Health Checkup Banner',
  qualityCare: 'Quality Care Banner',
};

function CMS() {
  const [pages, setPages] = useState(DEFAULT_PAGES);
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [activeTab, setActiveTab] = useState('pages');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get('/settings/cms').then(res => { if (res.data.data) setPages(res.data.data); }).catch(() => {});
    api.get('/settings/promo_banners').then(res => { if (res.data.data) setBanners(res.data.data); }).catch(() => {});
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSavePages = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.put('/settings/cms', pages); showToast('Pages updated successfully!'); }
    catch { showToast('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleSaveBanners = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.put('/settings/promo_banners', banners); showToast('Banners updated successfully!'); }
    catch { showToast('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const updateBanner = (key, field, value) =>
    setBanners(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content Management (CMS)</h2>
        <p className="text-gray-500 text-sm">Edit static page content and promotional banner text.</p>
      </div>

      {toast && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${toast.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {toast}
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200">
        {['pages', 'banners'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-[#006D6D] text-[#006D6D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'pages' ? 'Static Pages' : 'Promo Banners'}
          </button>
        ))}
      </div>

      {activeTab === 'pages' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
          <form onSubmit={handleSavePages} className="space-y-6">
            {[
              { key: 'about', label: 'About Us' },
              { key: 'whyChoose', label: 'Why Choose Curebasket' },
              { key: 'privacy', label: 'Privacy Policy' },
              { key: 'terms', label: 'Terms & Conditions' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
                <textarea
                  value={pages[key] || ''}
                  onChange={(e) => setPages(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  rows="5"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Pages'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
          <p className="text-xs text-gray-400 mb-6">Edit the text shown on homepage promotional banners. Layout and images are fixed by design.</p>
          <form onSubmit={handleSaveBanners} className="space-y-8">
            {Object.keys(DEFAULT_BANNERS).map(bannerKey => (
              <div key={bannerKey} className="border border-gray-100 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4">{BANNER_LABELS[bannerKey]}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { field: 'title1', label: 'Title Line 1' },
                    { field: 'title2', label: 'Title Line 2' },
                    { field: 'buttonText', label: 'Button Text' },
                    { field: 'badge', label: 'Badge / Offer Text' },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                      <input
                        type="text"
                        value={banners[bannerKey]?.[field] || ''}
                        onChange={(e) => updateBanner(bannerKey, field, e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
                    <textarea
                      value={banners[bannerKey]?.description || ''}
                      onChange={(e) => updateBanner(bannerKey, 'description', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Banners'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CMS;
