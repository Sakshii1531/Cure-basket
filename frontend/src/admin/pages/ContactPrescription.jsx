import { SkeletonForm } from '../components/Skeleton';
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DEFAULT_DATA = {
  phone: '',
  email: '',
  address: '',
  prescriptionFax: '',
  prescriptionEmail: '',
};

function ContactPrescription() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/settings/bank_contact')
      .then((res) => {
        if (res.data.data) {
          const raw = res.data.data;
          setData({
            ...DEFAULT_DATA,
            ...raw,
            phone: raw.phone ? raw.phone.replace('+91', '').trim() : '',
            prescriptionFax: raw.prescriptionFax ? raw.prescriptionFax.replace('+91', '').trim() : '',
          });
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
    const errs = {};
    if (data.phone && data.phone.length !== 10) {
      errs.phone = 'Phone number must be exactly 10 digits';
    }
    if (data.prescriptionFax && data.prescriptionFax.length !== 10) {
      errs.prescriptionFax = 'Fax number must be exactly 10 digits';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please fix the validation errors.', 'error');
      return;
    }

    try {
      const payload = {
        ...data,
        phone: data.phone ? `+91${data.phone}` : '',
        prescriptionFax: data.prescriptionFax ? `+91${data.prescriptionFax}` : '',
      };
      await api.put('/settings/bank_contact', payload);
      setErrors({});
      showToast('Contact & prescription details updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save changes.', 'error');
    }
  };

  const field = (label, key, type = 'text', colSpan = '') => (
    <div className={colSpan}>
      <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
      <input
        type={type}
        value={data[key]}
        onChange={(e) => setData({ ...data, [key]: e.target.value })}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );

  if (loading) {
    return <SkeletonForm />;
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
        <h2 className="text-2xl font-bold text-gray-900">Contact & Prescription Details</h2>
        <p className="text-gray-500 text-sm">Manage your contact information and prescription submission details.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h3 className="text-md font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">+91</span>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => {
                      setData({ ...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
                      setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full bg-gray-50 border rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                    }`}
                    placeholder="Enter 10-digit phone number"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {field('Email Address', 'email', 'email')}

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block mb-1">Office Address</label>
                <textarea
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-md font-bold text-gray-900 mb-1">Prescription Submission</h3>
            <p className="text-gray-500 text-xs mb-4">
              Shown to customers who choose to send their prescription by fax or email.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Prescription Fax Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">+91</span>
                  <input
                    type="text"
                    value={data.prescriptionFax}
                    onChange={(e) => {
                      setData({ ...data, prescriptionFax: e.target.value.replace(/\D/g, '').slice(0, 10) });
                      setErrors({ ...errors, prescriptionFax: '' });
                    }}
                    className={`w-full bg-gray-50 border rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.prescriptionFax ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                    }`}
                    placeholder="Enter 10-digit fax number"
                  />
                </div>
                {errors.prescriptionFax && <p className="text-xs text-red-500 mt-1">{errors.prescriptionFax}</p>}
              </div>

              {field('Prescription Email', 'prescriptionEmail', 'email')}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactPrescription;
