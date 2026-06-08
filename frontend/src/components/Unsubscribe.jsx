import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';

function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email) {
      setStatus('error');
      setMessage('No email address provided in the unsubscribe link.');
      return;
    }

    const performUnsubscribe = async () => {
      try {
        const res = await api.post('/subscribers/unsubscribe', { email });
        setStatus('success');
        setMessage(res.data.message || 'You have been successfully unsubscribed.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Failed to unsubscribe. Please try again later.');
      }
    };

    performUnsubscribe();
  }, [email]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
        
        {status === 'loading' && (
          <div className="space-y-4">
            <svg className="animate-spin h-12 w-12 text-[#006D6D] mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Processing Request</h2>
            <p className="text-gray-500 text-sm">We are unsubscribing your email address from our mailing list...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">Unsubscribed Successfully</h2>
            <p className="text-gray-600 text-[15px] font-medium leading-relaxed">
              {message}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              We're sorry to see you go! You will no longer receive our tips, discounts, and blog updates. If this was a mistake, you can always subscribe again in our footer.
            </p>
            <div className="pt-4">
              <Link
                to="/"
                className="inline-block bg-[#006D6D] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#005a5a] transition-all shadow-md shadow-[#006D6D]/10"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">Something Went Wrong</h2>
            <p className="text-red-600 text-[15px] font-semibold leading-relaxed">
              {message}
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              If the problem persists, please contact our support team to manually remove your email address.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                to="/"
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold text-[14px] hover:bg-gray-200 transition-all"
              >
                Go Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Unsubscribe;
