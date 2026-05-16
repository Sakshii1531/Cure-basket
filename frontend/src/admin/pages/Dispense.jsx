import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DEFAULT_FORM = {
  serviceType: 'PRESCRIPTION',
  status: 'DISPENSED',
  fromEmail: '',
  emailSubject: 'Prescription Dispense',
  emailContent: 'Hi\n<prescription_number>, <patient_name>, <status>',
};

const PLACEHOLDER = '<prescription_number>, <patient_name>, <status>';

function Dispense() {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [secretKey, setSecretKey] = useState('');
  const [secretKeySet, setSecretKeySet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/settings/dispense')
      .then((res) => {
        if (res.data.data) {
          const { secretKey: _sk, secretKeySet: isSet, ...rest } = res.data.data;
          setFormData({ ...DEFAULT_FORM, ...rest });
          setSecretKeySet(!!isSet);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (secretKey) payload.secretKey = secretKey;

    try {
      await api.put('/settings/dispense', payload);
      if (secretKey) {
        setSecretKeySet(true);
        setSecretKey('');
      }
      showToast('Template saved successfully!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save template.', 'error');
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all ${
          toast.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {toast.message}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dispense Settings</h2>
        <p className="text-gray-500 text-sm">Manage email templates for dispensed services.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Service Type</label>
            <div className="relative">
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="PRESCRIPTION">PRESCRIPTION</option>
                <option value="ORDER">ORDER</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Status</label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="DISPENSED">DISPENSED</option>
                <option value="PENDING">PENDING</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">From Email</label>
            <input
              type="email"
              value={formData.fromEmail}
              onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Secret Key
              {secretKeySet && !secretKey && (
                <span className="ml-2 text-xs font-normal text-green-600">Key is set — enter a new value to replace it</span>
              )}
            </label>
            <input
              type="password"
              value={secretKey}
              placeholder={secretKeySet ? '••••••••••••••' : 'Enter secret key'}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email Subject</label>
            <input
              type="text"
              value={formData.emailSubject}
              onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email Content</label>
            <textarea
              value={formData.emailContent}
              onChange={(e) => setFormData({ ...formData, emailContent: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows="5"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">PlaceHolder</label>
            <input
              type="text"
              value={PLACEHOLDER}
              readOnly
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dispense;
