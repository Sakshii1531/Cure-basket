import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RxPromptModal = () => {
  const { isRxPromptOpen, setIsRxPromptOpen } = useAuth()
  const navigate = useNavigate()

  if (!isRxPromptOpen) return null

  const handleAction = (path) => {
    setIsRxPromptOpen(false)
    navigate(path, { state: { from: '/upload-rx' } })
  }

  return (
    <div className="fixed inset-0 z-[1100] flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsRxPromptOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full md:max-w-[420px] bg-white rounded-t-[32px] md:rounded-[32px] px-6 pt-6 pb-8 md:p-8 shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95 duration-300 border border-gray-100">
        <div className="md:hidden w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Close Button */}
        <button
          onClick={() => setIsRxPromptOpen(false)}
          className="absolute top-4 right-4 md:top-5 md:right-5 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Header / Info */}
        <div className="text-center mt-4 mb-6">
          <div className="w-16 h-16 bg-[#E6F7F7] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm shadow-[#006D6D]/10">
            <svg className="w-8 h-8 text-[#006D6D]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h3m-3 3h2" />
              <text x="12" y="18.5" fontSize="9" fontWeight="900" fill="currentColor" stroke="none" style={{ fontFamily: 'Arial, sans-serif' }}>Rx</text>
            </svg>
          </div>
          <h2 className="text-[20px] md:text-[22px] font-black text-gray-900 leading-tight">
            You are not signed up
          </h2>
          <p className="text-gray-500 text-[13px] font-medium mt-2 leading-relaxed">
            Please sign up or log in to upload your prescription and get your medicines delivered.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleAction('/signup')}
            className="w-full bg-[#006D6D] text-white font-bold py-3.5 rounded-xl text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#006D6D]/15 hover:bg-[#005a5a] transition-all active:scale-[0.98]"
          >
            Sign Up
          </button>
          
          <button
            onClick={() => handleAction('/login')}
            className="w-full bg-white text-[#006D6D] border-2 border-[#006D6D]/20 font-bold py-3 rounded-xl text-[14px] flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-[#006D6D]/30 transition-all active:scale-[0.98]"
          >
            Log In
          </button>

          <button
            onClick={() => setIsRxPromptOpen(false)}
            className="w-full text-gray-400 font-bold py-2 text-[13px] text-center hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default RxPromptModal
