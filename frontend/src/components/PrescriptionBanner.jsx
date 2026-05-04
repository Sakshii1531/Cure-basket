import React, { useState } from 'react'
import uploadImg from '../assets/upload.png'

function PrescriptionBanner() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  return (
    <section className="bg-white py-2 md:py-3 px-4 md:px-12">
      <div className="max-w-[1250px] mx-auto bg-[#f0fafa] rounded-[24px] p-4 md:p-5 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        {/* Left Side: Icon and Text */}
        <div className="flex items-center gap-6 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-[16px] flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h3m-3 3h2" />
              <text x="12" y="18.5" fontSize="9" fontWeight="900" fill="currentColor" stroke="none" style={{ fontFamily: 'Arial, sans-serif' }}>Rx</text>
            </svg>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[15px] md:text-[17px] font-bold text-[#006D6D] leading-tight">
              Upload Prescription & Get Medicines Delivered
            </h2>
            <p className="text-[11px] md:text-[12px] text-gray-600 mt-1">
              Save time and order prescribed medicines with ease.
            </p>
          </div>
        </div>

        {/* Right Side: Button */}
        <div className="mt-6 md:mt-0 z-10 md:mr-80">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-8 py-3 rounded-[12px] border-2 border-[#006D6D] border-dotted text-[#006D6D] font-bold text-[15px] hover:bg-[#006D6D] hover:text-white transition-all bg-transparent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Rx
          </button>
        </div>

        {/* Background Image Asset with Circle Highlight */}
        <div className="absolute right-0 top-0 h-full w-[300px] pointer-events-none hidden md:block">
          <div className="absolute right-[-20px] bottom-[-40px] w-56 h-56 bg-[#006D6D] opacity-[0.08] rounded-full" />
          <img 
            src={uploadImg} 
            alt="Prescription Banner Decoration" 
            className="absolute right-0 bottom-[-15px] h-full object-contain z-10" 
          />
        </div>
      </div>

      {/* Upload Prescription Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[480px] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-[#E6F7F7]/50 px-8 py-6 flex justify-between items-center border-b border-[#006D6D]/10">
              <div>
                <h2 className="text-[18px] font-bold text-[#006D6D]">Upload Prescription</h2>
                <p className="text-[11px] text-[#006D6D]/60 font-medium mt-0.5">Medicines require a valid doctor's prescription</p>
              </div>
              <button 
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="p-8">
              {!uploadSuccess ? (
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div 
                    onClick={() => document.getElementById('fileInput').click()}
                    className={`relative border-2 border-dashed rounded-[24px] p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-[#006D6D] bg-[#E6F7F7]/10' : 'border-gray-200 hover:border-[#006D6D] hover:bg-[#E6F7F7]/5'}`}
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
                        <div className="w-16 h-16 bg-[#006D6D] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#006D6D]/20">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
                        </div>
                        <p className="text-[14px] font-bold text-gray-900 truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB • Ready to upload</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#E6F7F7] transition-all">
                          <svg className="w-8 h-8 text-gray-300 group-hover:text-[#006D6D] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>
                        </div>
                        <p className="text-[14px] font-bold text-gray-900">Drag & drop or <span className="text-[#006D6D]">browse</span></p>
                        <p className="text-[11px] text-gray-400 mt-1.5">Supports JPG, PNG, PDF (Max 5MB)</p>
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="bg-gray-50 rounded-2xl p-4 flex gap-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                      <svg className="w-4 h-4 text-[#FBB03B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Make sure the <span className="font-bold text-gray-700">Doctor's Name, Patient Name</span> and <span className="font-bold text-gray-700">Medicines</span> are clearly visible in the image.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                      className="flex-1 py-4 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-[14px] hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={!selectedFile || isUploading}
                      onClick={() => {
                        setIsUploading(true);
                        setTimeout(() => {
                          setIsUploading(false);
                          setUploadSuccess(true);
                          setTimeout(() => { setShowUploadModal(false); setUploadSuccess(false); setSelectedFile(null); }, 2000);
                        }, 1500);
                      }}
                      className={`flex-1 py-4 rounded-xl font-bold text-[14px] transition-all shadow-lg flex items-center justify-center gap-2 ${!selectedFile ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#006D6D] text-white hover:bg-[#005a5a] shadow-[#006D6D]/20'}`}
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Uploading...
                        </>
                      ) : 'Attach Prescription'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 className="text-[20px] font-bold text-gray-900 mb-2">Prescription Attached!</h3>
                  <p className="text-[13px] text-gray-500">Your prescription has been successfully added.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2"/></svg>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End-to-End Encrypted & Secure</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default PrescriptionBanner
