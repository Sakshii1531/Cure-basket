import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function UploadRxPage() {
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      setUploadSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#f8fdfe] py-8 px-4">
      <div className="max-w-[600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-20 h-20 bg-[#E6F7F7] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-10 h-10 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h3m-3 3h2" />
              <text x="12" y="18.5" fontSize="9" fontWeight="900" fill="currentColor" stroke="none" style={{ fontFamily: 'Arial, sans-serif' }}>Rx</text>
            </svg>
          </div>
          <h1 className="text-[22px] font-bold text-[#006D6D] mb-1">Upload Prescription</h1>
          <p className="text-gray-500 max-w-[400px] mx-auto text-[13px]">
            Please upload a clear image of your doctor's prescription to order your medicines.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,109,109,0.05)] border border-[#006D6D]/5 overflow-hidden">
          <div className="p-6 md:p-7">
            {!uploadSuccess ? (
              <div className="space-y-4">
                {/* Upload Area */}
                <div 
                  onClick={() => document.getElementById('fileInput').click()}
                  className={`relative border-2 border-dashed rounded-[24px] p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-[#006D6D] bg-[#E6F7F7]/10' : 'border-gray-200 hover:border-[#006D6D] hover:bg-[#E6F7F7]/5'}`}
                >
                  <input 
                    type="file" 
                    id="fileInput" 
                    className="hidden" 
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept="image/*,.pdf"
                  />
                  
                  {selectedFile ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#006D6D] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#006D6D]/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
                      </div>
                      <p className="text-[14px] font-bold text-gray-900 truncate max-w-[250px]">{selectedFile.name}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB • Ready to upload</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                        className="mt-2 text-red-500 text-[12px] font-bold hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#E6F7F7] transition-all">
                        <svg className="w-10 h-10 text-gray-300 group-hover:text-[#006D6D] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>
                      </div>
                      <p className="text-[14px] font-bold text-gray-900">Drag & drop your prescription or <span className="text-[#006D6D]">browse</span></p>
                      <p className="text-[11px] text-gray-400 mt-1">Supports JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  )}
                </div>

                {/* Guidelines */}
                <div className="bg-[#E6F7F7]/30 rounded-2xl p-4">
                  <h3 className="text-[13px] font-bold text-[#006D6D] mb-1.5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
                    Prescription Guidelines:
                  </h3>
                  <ul className="space-y-1 text-[12px] text-gray-600">
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#006D6D] mt-1.5 shrink-0"></div>
                      Ensure doctor's name and signature are visible.
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#006D6D] mt-1.5 shrink-0"></div>
                      Patient name and date of prescription should be clear.
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#006D6D] mt-1.5 shrink-0"></div>
                      Avoid blurred images or shadows over text.
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto px-10 py-3 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold text-[14px] hover:bg-gray-50 transition-all"
                  >
                    Go Back
                  </button>
                  <button 
                    disabled={!selectedFile || isUploading}
                    onClick={handleUpload}
                    className={`w-full sm:w-auto px-10 py-3 rounded-2xl font-bold text-[14px] transition-all shadow-lg flex items-center justify-center gap-2 ${!selectedFile ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#006D6D] text-white hover:bg-[#005a5a] shadow-[#006D6D]/20'}`}
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Uploading...
                      </>
                    ) : 'Upload & Continue'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/20">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="text-[20px] font-bold text-gray-900 mb-1.5">Prescription Uploaded!</h2>
                <p className="text-[13px] text-gray-500 mb-4">
                  Your prescription has been successfully uploaded. Our pharmacist will review it shortly.
                </p>
                <p className="text-[11px] text-[#006D6D] font-bold animate-pulse">
                  Redirecting to home page...
                </p>
              </div>
            )}
          </div>

          {/* Secure Footer */}
          <div className="bg-gray-50 px-8 py-3 border-t border-gray-100 flex items-center justify-center gap-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2.5"/></svg>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Secure & HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadRxPage
