import { SkeletonForm } from '../components/Skeleton';
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

// Drives both the form layout and the generated share text — one source of truth per deposit type.
const FIELD_DEFS = {
  ach: {
    label: 'ACH',
    fullLabel: 'Deposit for ACH',
    sections: [
      {
        title: null,
        fields: [
          { key: 'currency', label: 'Currency' },
          { key: 'accountHolder', label: 'Account holder' },
          { key: 'accountNumber', label: 'Account number' },
          { key: 'routingNumber', label: 'Routing number' },
        ],
      },
      { title: 'Payment reference', fields: [{ key: 'memo', label: 'Memo (ACH)' }] },
      { title: 'Institution information', fields: [{ key: 'institutionName', label: 'Institution name' }] },
    ],
  },
  swift: {
    label: 'SWIFT',
    fullLabel: 'Deposit for SWIFT',
    sections: [
      {
        title: null,
        fields: [
          { key: 'currency', label: 'Currency' },
          { key: 'accountHolder', label: 'Account holder' },
          { key: 'accountNumber', label: 'Account number' },
          { key: 'swiftBic', label: 'SWIFT / BIC' },
        ],
      },
      {
        title: 'Account holder address',
        fields: [
          { key: 'addrStreet', label: 'Street' },
          { key: 'addrStreet2', label: 'Street 2' },
          { key: 'addrCity', label: 'City' },
          { key: 'addrState', label: 'State' },
          { key: 'addrPostcode', label: 'Postcode' },
          { key: 'addrCountry', label: 'Country' },
        ],
      },
      { title: 'Payment reference', fields: [{ key: 'memo', label: 'Memo (SWIFT)' }] },
      {
        title: 'Institution information',
        fields: [
          { key: 'institutionName', label: 'Institution name' },
          { key: 'instStreet', label: 'Street' },
          { key: 'instStreet2', label: 'Street 2' },
          { key: 'instCity', label: 'City' },
          { key: 'instState', label: 'State' },
          { key: 'instPostcode', label: 'Postcode' },
          { key: 'instCountry', label: 'Country' },
        ],
      },
    ],
  },
  fedwire: {
    label: 'FEDWIRE',
    fullLabel: 'Deposit for FEDWIRE',
    sections: [
      {
        title: null,
        fields: [
          { key: 'currency', label: 'Currency' },
          { key: 'accountHolder', label: 'Account holder' },
          { key: 'accountNumber', label: 'Account number' },
          { key: 'routingNumber', label: 'Routing number' },
        ],
      },
      {
        title: 'Account holder address',
        fields: [
          { key: 'addrStreet', label: 'Street' },
          { key: 'addrStreet2', label: 'Street 2' },
          { key: 'addrCity', label: 'City' },
          { key: 'addrState', label: 'State' },
          { key: 'addrPostcode', label: 'Postcode' },
          { key: 'addrCountry', label: 'Country' },
        ],
      },
      { title: 'Payment reference', fields: [{ key: 'memo', label: 'Memo (Fedwire)' }] },
      {
        title: 'Institution information',
        fields: [
          { key: 'institutionName', label: 'Institution name' },
          { key: 'instStreet', label: 'Street' },
          { key: 'instStreet2', label: 'Street 2' },
          { key: 'instCity', label: 'City' },
          { key: 'instState', label: 'State' },
          { key: 'instPostcode', label: 'Postcode' },
          { key: 'instCountry', label: 'Country' },
        ],
      },
    ],
  },
};

const TYPES = Object.keys(FIELD_DEFS);

const buildTypeDefaults = (type) =>
  Object.fromEntries(FIELD_DEFS[type].sections.flatMap((s) => s.fields).map((f) => [f.key, '']));

const DEFAULT_DATA = Object.fromEntries(TYPES.map((type) => [type, buildTypeDefaults(type)]));

const buildShareText = (data) => {
  const blocks = TYPES.map((type) => {
    const def = FIELD_DEFS[type];
    const lines = [def.fullLabel, ''];
    def.sections.forEach((section) => {
      if (section.title) lines.push(section.title);
      section.fields.forEach((f) => {
        lines.push(`${f.label}: ${data[type]?.[f.key] || '-'}`);
      });
      lines.push('');
    });
    return lines.join('\n').trim();
  });
  return blocks.join('\n\n---\n\n');
};

function BankTransferDetails() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState('ach');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/settings/bank_transfer')
      .then((res) => {
        if (res.data.data) {
          setData((prev) => ({
            ach: { ...prev.ach, ...res.data.data.ach },
            swift: { ...prev.swift, ...res.data.data.swift },
            fedwire: { ...prev.fedwire, ...res.data.data.fedwire },
          }));
          setHasSaved(true);
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
    for (const tab of TYPES) {
      const accNum = data[tab].accountNumber;
      if (accNum && (accNum.length < 9 || accNum.length > 18)) {
        if (!errs[tab]) errs[tab] = {};
        errs[tab].accountNumber = 'Account number must be between 9 and 18 digits';
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstTab = Object.keys(errs)[0];
      setActiveTab(firstTab);
      showToast('Please fix the validation errors.', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.put('/settings/bank_transfer', data);
      setHasSaved(true);
      setErrors({});
      showToast('Bank transfer details updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const text = buildShareText(data);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Bank Transfer Details', text });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast('Bank transfer details copied to clipboard!');
    } catch {
      showToast('Failed to copy details.', 'error');
    }
  };

  const updateField = (type, key, value) =>
    setData((prev) => ({ ...prev, [type]: { ...prev[type], [key]: value } }));

  const handleFieldChange = (type, key, value) => {
    let cleanVal = value;
    if (key === 'accountHolder' || key === 'addrCity' || key === 'addrState' || key === 'addrCountry' || key === 'instCity' || key === 'instState' || key === 'instCountry') {
      cleanVal = value.replace(/[0-9]/g, '');
    } else if (key === 'accountNumber') {
      cleanVal = value.replace(/\D/g, '').slice(0, 18);
    } else if (key === 'routingNumber') {
      cleanVal = value.replace(/\D/g, '');
    }
    updateField(type, key, cleanVal);
    if (errors[type]?.[key]) {
      setErrors((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [key]: '',
        },
      }));
    }
  };

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

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bank Transfer Details</h2>
          <p className="text-gray-500 text-sm">Manage ACH, SWIFT and Fedwire deposit instructions and share them with customers or partners.</p>
        </div>
        <button
          type="button"
          onClick={handleShare}
          disabled={!hasSaved}
          title={hasSaved ? 'Share all bank transfer details' : 'Save details before sharing'}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342a3 3 0 100 3.316m0-3.316a3 3 0 110-3.316m0 3.316l6.632 3.316m-6.632-6.632l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.632a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Details
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === type ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {FIELD_DEFS[type].fullLabel}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          {FIELD_DEFS[activeTab].sections.map((section, idx) => (
            <div key={section.title || `main-${idx}`} className={idx > 0 ? 'border-t border-gray-100 pt-4' : ''}>
              {section.title && <h3 className="text-md font-bold text-gray-900 mb-4">{section.title}</h3>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((f) => {
                  const hasError = errors[activeTab]?.[f.key];
                  return (
                    <div key={f.key}>
                      <label className="text-sm font-semibold text-gray-700 block mb-1">{f.label}</label>
                      <input
                        type="text"
                        value={data[activeTab][f.key] || ''}
                        onChange={(e) => handleFieldChange(activeTab, f.key, e.target.value)}
                        className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                          hasError ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                        }`}
                      />
                      {hasError && <p className="text-xs text-red-500 mt-1">{hasError}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BankTransferDetails;
