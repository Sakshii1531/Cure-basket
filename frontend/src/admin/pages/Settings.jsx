import React, { useState, useEffect } from 'react';

function Settings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cb_settings');
    const defaultSettings = {
      siteName: 'CureBasket',
      email: 'support@curebasket.com',
      phone: '+1 234 567 890',
      address: '123, Main Street, New York, NY 10001'
    };
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('cb_settings', JSON.stringify(settings));
  }, [settings]);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm">Manage site-wide settings and configurations.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Site Name</label>
            <input 
              type="text" 
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Contact Email</label>
            <input 
              type="email" 
              value={settings.email}
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Contact Phone</label>
            <input 
              type="text" 
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Address</label>
            <textarea 
              value={settings.address}
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              rows="3"
            ></textarea>
          </div>
          <div className="mt-6">
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
