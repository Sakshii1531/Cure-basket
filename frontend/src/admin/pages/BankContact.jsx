import React, { useState, useEffect } from 'react';

function BankContact() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('cb_bank_contact');
    const defaultData = {
      bankName: 'State Bank of India',
      accountName: 'CureBasket Healthcare Pvt Ltd',
      accountNumber: '123456789012',
      ifsc: 'SBIN0001234',
      branch: 'Main Branch, Mumbai',
      phone: '+91 9876543210',
      email: 'support@curebasket.com',
      address: '123, Health Street, Medical Hub, Mumbai - 400001'
    };
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem('cb_bank_contact', JSON.stringify(data));
  }, [data]);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Bank & Contact details updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bank & Contact Details</h2>
        <p className="text-gray-500 text-sm">Manage your bank account details and contact information.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Bank Name</label>
              <input 
                type="text"
                value={data.bankName}
                onChange={(e) => setData({...data, bankName: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Account Name</label>
              <input 
                type="text"
                value={data.accountName}
                onChange={(e) => setData({...data, accountName: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Account Number</label>
              <input 
                type="text"
                value={data.accountNumber}
                onChange={(e) => setData({...data, accountNumber: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">IFSC Code</label>
              <input 
                type="text"
                value={data.ifsc}
                onChange={(e) => setData({...data, ifsc: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Branch</label>
              <input 
                type="text"
                value={data.branch}
                onChange={(e) => setData({...data, branch: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-md font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Phone Number</label>
                <input 
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData({...data, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Email Address</label>
                <input 
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({...data, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block mb-1">Office Address</label>
                <textarea 
                  value={data.address}
                  onChange={(e) => setData({...data, address: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006D6D]"
                  rows="3"
                ></textarea>
              </div>
            </div>
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

export default BankContact;
