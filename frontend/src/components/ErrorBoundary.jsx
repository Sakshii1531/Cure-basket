import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleBack = () => {
    window.history.back()
    setTimeout(() => {
      this.setState({ hasError: false, error: null })
    }, 100)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 font-sans">
          <div className="max-w-[500px] w-full bg-white rounded-[40px] p-10 md:p-12 shadow-[0_20px_50px_rgba(0,109,109,0.08)] border border-gray-100 text-center relative overflow-hidden group">
            {/* Background Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#006D6D]/5 rounded-full blur-3xl group-hover:bg-[#006D6D]/10 transition-colors duration-500"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FFD200]/5 rounded-full blur-3xl group-hover:bg-[#FFD200]/10 transition-colors duration-500"></div>

            {/* Icon/Illustration Container */}
            <div className="relative mb-10">
              <div className="w-24 h-24 bg-red-50 rounded-[30px] flex items-center justify-center mx-auto transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              {/* Floating "Pills" for aesthetic */}
              <div className="absolute top-0 right-[25%] w-4 h-8 bg-[#006D6D]/20 rounded-full rotate-45 animate-bounce"></div>
              <div className="absolute bottom-0 left-[25%] w-3 h-6 bg-[#FFD200]/40 rounded-full -rotate-12 animate-pulse"></div>
            </div>

            {/* Text Content */}
            <h1 className="text-[32px] md:text-[38px] font-black text-gray-900 leading-tight mb-4 tracking-tight">
              Oops! Something <span className="text-[#006D6D]">fainted</span>.
            </h1>
            <p className="text-gray-500 text-[16px] leading-relaxed mb-10 max-w-[320px] mx-auto font-medium">
              Even the best systems need a checkup sometimes. We're already looking into it!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button
                onClick={this.handleReload}
                className="px-8 py-4 bg-[#006D6D] text-white rounded-2xl font-bold text-[15px] shadow-[0_10px_20px_rgba(0,109,109,0.2)] hover:bg-[#005a5a] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reload Page
              </button>
              <button
                onClick={this.handleBack}
                className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold text-[15px] hover:border-[#006D6D]/30 hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-[#006D6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back
              </button>
            </div>

            {/* Error Details (Subtle) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-12 pt-8 border-t border-gray-50">
                <p className="text-[11px] text-gray-300 font-mono break-all line-clamp-2">
                  {this.state.error?.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
