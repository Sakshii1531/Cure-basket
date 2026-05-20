import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DEFAULTS = {
  siteName: 'CureBasket',
  email: 'support@curebasket.com',
  phone: '+91 98765 43210',
  address: '123, Main Street, Mumbai, Maharashtra 400001',
};

function SkeletonField() {
  return <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />;
}

function Settings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings/general')
      .then(res => {
        if (res.data.data) setSettings({ ...DEFAULTS, ...res.data.data });
      })
      .catch(() => {
        // Settings may not exist yet — keep defaults
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings/general', settings);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm">Manage site-wide settings and configurations.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-2xl">
        {loading ? (
          <div className="space-y-4">
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
            <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Address</label>
              <textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Settings;
