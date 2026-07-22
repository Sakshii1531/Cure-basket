import { SkeletonForm } from '../components/Skeleton';
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import CountryFlag from '../components/CountryFlag';

const DEFAULT_DATA = {
  phone: '',
  email: '',
  address: '',
  prescriptionFax: '',
  prescriptionEmail: '',
};

const COUNTRY_CODES = [
  { code: 'US', flag: '🇺🇸', dial: '+1' },
  { code: 'CA', flag: '🇨🇦', dial: '+1' },
  { code: 'IN', flag: '🇮🇳', dial: '+91' },
  { code: 'GB', flag: '🇬🇧', dial: '+44' },
  { code: 'AE', flag: '🇦🇪', dial: '+971' },
  { code: 'AU', flag: '🇦🇺', dial: '+61' },
  { code: 'SG', flag: '🇸🇬', dial: '+65' },
  { code: 'SA', flag: '🇸🇦', dial: '+966' },
  { code: 'BD', flag: '🇧🇩', dial: '+880' },
  { code: 'PK', flag: '🇵🇰', dial: '+92' },
  { code: 'LK', flag: '🇱🇰', dial: '+94' },
  { code: 'NP', flag: '🇳🇵', dial: '+977' },
  { code: 'MY', flag: '🇲🇾', dial: '+60' },
  { code: 'ID', flag: '🇮🇩', dial: '+62' },
  { code: 'ZA', flag: '🇿🇦', dial: '+27' },
  { code: 'NG', flag: '🇳🇬', dial: '+234' },
  { code: 'DE', flag: '🇩🇪', dial: '+49' },
  { code: 'FR', flag: '🇫🇷', dial: '+33' },
  { code: 'IT', flag: '🇮🇹', dial: '+39' },
  { code: 'ES', flag: '🇪🇸', dial: '+34' },
  { code: 'NL', flag: '🇳🇱', dial: '+31' },
  { code: 'BR', flag: '🇧🇷', dial: '+55' },
];

const parsePhone = (fullPhone) => {
  if (!fullPhone) return { countryCode: '+1', number: '' };
  const clean = fullPhone.trim().replace(/\s+/g, '');
  if (clean.length > 10) {
    const number = clean.slice(-10);
    const countryCode = clean.slice(0, -10);
    return { countryCode, number };
  }
  return { countryCode: '+1', number: clean };
};

function ContactPrescription() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [phoneCountry, setPhoneCountry] = useState('US');
  const [faxCountry, setFaxCountry] = useState('US');

  useEffect(() => {
    api.get('/settings/bank_contact')
      .then((res) => {
        if (res.data.data) {
          const raw = res.data.data;
          const parsedPhone = parsePhone(raw.phone);
          const parsedFax = parsePhone(raw.prescriptionFax);
          const phoneObj = COUNTRY_CODES.find(c => c.dial === parsedPhone.countryCode) || COUNTRY_CODES[0];
          const faxObj = COUNTRY_CODES.find(c => c.dial === parsedFax.countryCode) || COUNTRY_CODES[0];
          setPhoneCountry(phoneObj.code);
          setFaxCountry(faxObj.code);
          setData({
            ...DEFAULT_DATA,
            ...raw,
            phone: parsedPhone.number,
            prescriptionFax: parsedFax.number,
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
      const phoneDial = (COUNTRY_CODES.find(c => c.code === phoneCountry) || COUNTRY_CODES[0]).dial;
      const faxDial = (COUNTRY_CODES.find(c => c.code === faxCountry) || COUNTRY_CODES[0]).dial;
      const payload = {
        ...data,
        phone: data.phone ? `${phoneDial}${data.phone}` : '',
        prescriptionFax: data.prescriptionFax ? `${faxDial}${data.prescriptionFax}` : '',
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
                <div className="relative flex items-center">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-gray-200 pr-2 h-5 select-none pointer-events-none">
                    <CountryFlag countryCode={phoneCountry} size="16px" />
                    <span className="text-xs text-gray-500 font-bold">
                      {(COUNTRY_CODES.find(c => c.code === phoneCountry) || COUNTRY_CODES[0]).dial}
                    </span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <select
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-transparent font-semibold bg-transparent focus:outline-none pr-1.5 h-5 cursor-pointer w-[72px] opacity-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="text-gray-900 bg-white">
                        {c.flag} {c.dial}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => {
                      setData({ ...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
                      setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full bg-gray-50 border rounded-lg pl-[88px] pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
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
                <div className="relative flex items-center">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-gray-200 pr-2 h-5 select-none pointer-events-none">
                    <CountryFlag countryCode={faxCountry} size="16px" />
                    <span className="text-xs text-gray-500 font-bold">
                      {(COUNTRY_CODES.find(c => c.code === faxCountry) || COUNTRY_CODES[0]).dial}
                    </span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <select
                    value={faxCountry}
                    onChange={(e) => setFaxCountry(e.target.value)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-transparent font-semibold bg-transparent focus:outline-none pr-1.5 h-5 cursor-pointer w-[72px] opacity-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="text-gray-900 bg-white">
                        {c.flag} {c.dial}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={data.prescriptionFax}
                    onChange={(e) => {
                      setData({ ...data, prescriptionFax: e.target.value.replace(/\D/g, '').slice(0, 10) });
                      setErrors({ ...errors, prescriptionFax: '' });
                    }}
                    className={`w-full bg-gray-50 border rounded-lg pl-[88px] pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
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
