import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DEFAULT_PAGES = {
  about: 'Welcome to CureBasket. We provide the best medicines...',
  privacy: 'Your privacy is important to us...',
  terms: 'By using our site, you agree to these terms...',
  whyChoose: 'We offer genuine medicines, fast delivery, and best prices.'
};

function CMS() {
  const [pages, setPages] = useState(DEFAULT_PAGES);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get('/settings/cms')
      .then(res => { if (res.data.data) setPages(res.data.data); })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings/cms', pages);
      setToast('Pages updated successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch {
      setToast('Failed to save. Please try again.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Static Pages Content (CMS)</h2>
        <p className="text-gray-500 text-sm">Edit the content of static pages like About Us, Privacy Policy, etc.</p>
      </div>

      {toast && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${toast.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {toast}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CMS;
