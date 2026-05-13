import React, { useState, useEffect } from 'react';

function Dispense() {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('cb_dispense_template');
    const defaultData = {
      serviceType: 'PRESCRIPTION',
      status: 'DISPENSED',
      fromEmail: 'inceptionfirm@gmail.com',
      secretKey: '••••••••••••••',
      emailSubject: 'Prescription Dispense',
      emailContent: 'Hi\n<prescription_number>, <patient_name>, <status>',
      placeholder: '<prescription_number>, <patient_name>, <status>'
    };
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem('cb_dispense_template', JSON.stringify(formData));
  }, [formData]);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Template saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dispense Settings</h2>
        <p className="text-gray-500 text-sm">Manage email templates for dispensed services.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Service Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Service Type</label>
            <div className="relative">
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] appearance-none"
              >
                <option value="PRESCRIPTION">PRESCRIPTION</option>
                <option value="ORDER">ORDER</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Status</label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D] appearance-none"
              >
                <option value="DISPENSED">DISPENSED</option>
                <option value="PENDING">PENDING</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* From Email */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">From Email</label>
            <input 
              type="email"
              value={formData.fromEmail}
              onChange={(e) => setFormData({...formData, fromEmail: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
            />
          </div>

          {/* Secret Key */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Secret Key</label>
            <input 
              type="password"
              value={formData.secretKey}
              onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
            />
          </div>

          {/* Email Subject */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email Subject</label>
            <input 
              type="text"
              value={formData.emailSubject}
              onChange={(e) => setFormData({...formData, emailSubject: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
            />
          </div>

          {/* Email Content */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email Content</label>
            <textarea 
              value={formData.emailContent}
              onChange={(e) => setFormData({...formData, emailContent: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              rows="5"
            ></textarea>
          </div>

          {/* PlaceHolder */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">PlaceHolder</label>
            <input 
              type="text"
              value={formData.placeholder}
              readOnly
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-[#006D6D] text-white rounded-lg font-semibold text-sm hover:bg-[#005c5c] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dispense;
