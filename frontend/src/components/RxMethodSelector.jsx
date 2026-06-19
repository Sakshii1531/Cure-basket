import React, { useState } from 'react'

/**
 * Three-way prescription submission selector: Upload | Fax | Email.
 *
 * Owns the method tabs and the fax/email info panels. The file-upload UI for the
 * "upload" method is passed in as `children` so each host keeps its own dropzone
 * styling.
 *
 * Props:
 *  - method, onMethodChange
 *  - faxNumber, onFaxNumberChange
 *  - senderEmail, onSenderEmailChange
 *  - pharmacyFax, pharmacyEmail  (admin-configured destinations)
 *  - children                    (upload dropzone, shown when method === 'upload')
 */
const METHODS = [
  { key: 'upload', label: 'Upload' },
  { key: 'fax', label: 'Fax' },
  { key: 'email', label: 'Email' },
]

function CopyableValue({ value, placeholder }) {
  const [copied, setCopied] = useState(false)

  if (!value) {
    return (
      <div className="text-[12px] text-amber-600 font-medium bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
        {placeholder}
      </div>
    )
  }

  const handleCopy = () => {
    try {
      navigator.clipboard?.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (_) {}
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full flex items-center justify-between gap-2 bg-[#E6F7F7]/40 border border-[#006D6D]/15 rounded-xl px-3 py-2.5 text-left hover:bg-[#E6F7F7]/70 transition-colors"
    >
      <span className="text-[14px] font-bold text-[#006D6D] truncate">{value}</span>
      <span className="text-[10px] font-bold text-[#006D6D]/70 shrink-0 flex items-center gap-1">
        {copied ? (
          'Copied!'
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Copy
          </>
        )}
      </span>
    </button>
  )
}

function RxMethodSelector({
  method,
  onMethodChange,
  faxNumber,
  onFaxNumberChange,
  senderEmail,
  onSenderEmailChange,
  pharmacyFax,
  pharmacyEmail,
  children,
}) {
  return (
    <div className="space-y-4">
      {/* Method tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
        {METHODS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => onMethodChange(m.key)}
            className={`py-2.5 rounded-xl text-[13px] font-bold transition-all ${
              method === m.key
                ? 'bg-[#006D6D] text-white shadow-sm shadow-[#006D6D]/20'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {method === 'upload' && children}

      {method === 'fax' && (
        <div className="space-y-3">
          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-1.5">Fax your prescription to:</p>
            <CopyableValue value={pharmacyFax} placeholder="Fax number not available yet. Please try another method." />
          </div>
          <div>
            <label className="text-[12px] font-bold text-gray-700 block mb-1.5">
              Your fax number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={faxNumber}
              onChange={(e) => onFaxNumberChange(e.target.value)}
              placeholder="The fax number you sent it from"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#006D6D]/30 focus:border-[#006D6D]"
            />
            <p className="text-[11px] text-gray-400 mt-1.5">
              Send the fax first, then enter the number you sent it from so our pharmacist can match it.
            </p>
          </div>
        </div>
      )}

      {method === 'email' && (
        <div className="space-y-3">
          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-1.5">Email your prescription to:</p>
            <CopyableValue value={pharmacyEmail} placeholder="Email address not available yet. Please try another method." />
          </div>
          <div>
            <label className="text-[12px] font-bold text-gray-700 block mb-1.5">
              Your email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => onSenderEmailChange(e.target.value)}
              placeholder="The email address you sent it from"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#006D6D]/30 focus:border-[#006D6D]"
            />
            <p className="text-[11px] text-gray-400 mt-1.5">
              Send the email first, then enter the address you sent it from so our pharmacist can find it.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RxMethodSelector
