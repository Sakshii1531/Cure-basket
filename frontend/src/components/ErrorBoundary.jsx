import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null, errorId: null }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36).toUpperCase(),
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleBack = () => {
    const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
    if (isAdmin) {
      window.location.href = '/admin'
    } else {
      window.location.href = '/'
    }
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state

      const stackLines = (error?.stack || '').split('\n').slice(0, 8).join('\n')
      const componentLines = (errorInfo?.componentStack || '')
        .split('\n')
        .filter(Boolean)
        .slice(0, 6)
        .join('\n')

      return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 font-sans">
          <div className="max-w-[520px] w-full bg-white rounded-[40px] p-10 md:p-12 shadow-[0_20px_50px_rgba(0,109,109,0.08)] border border-gray-100 text-center relative overflow-hidden group">
            {/* Background Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#006D6D]/5 rounded-full blur-3xl group-hover:bg-[#006D6D]/10 transition-colors duration-500"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FFD200]/5 rounded-full blur-3xl group-hover:bg-[#FFD200]/10 transition-colors duration-500"></div>

            {/* Icon */}
            <div className="relative mb-10">
              <div className="w-24 h-24 bg-red-50 rounded-[30px] flex items-center justify-center mx-auto transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="absolute top-0 right-[25%] w-4 h-8 bg-[#006D6D]/20 rounded-full rotate-45 animate-bounce"></div>
              <div className="absolute bottom-0 left-[25%] w-3 h-6 bg-[#FFD200]/40 rounded-full -rotate-12 animate-pulse"></div>
            </div>

            {/* Text */}
            <h1 className="text-[32px] md:text-[38px] font-black text-gray-900 leading-tight mb-4 tracking-tight">
              Oops! Something <span className="text-[#006D6D]">fainted</span>.
            </h1>
            <p className="text-gray-500 text-[16px] leading-relaxed mb-6 max-w-[320px] mx-auto font-medium">
              Even the best systems need a checkup sometimes. We're already looking into it!
            </p>

            {/* Error reference ID */}
            {errorId && (
              <p className="text-[11px] text-gray-400 font-mono mb-8">
                Error ref: <span className="text-gray-500 font-bold">{errorId}</span>
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10 mb-8">
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
                  {typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  )}
                </svg>
                {typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? 'Go to Dashboard' : 'Go to Homepage'}
              </button>
            </div>

            {/* Error Details — always visible, collapsed by default */}
            <details className="text-left border border-gray-100 rounded-2xl overflow-hidden">
              <summary className="px-4 py-3 text-[12px] font-bold text-gray-400 cursor-pointer hover:bg-gray-50 select-none list-none flex items-center justify-between">
                <span>Error Details</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 pt-2 space-y-3 bg-gray-50">
                {error && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {error.name}
                    </p>
                    <p className="text-[11px] font-mono text-red-600 break-all">{error.message}</p>
                  </div>
                )}
                {stackLines && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stack Trace</p>
                    <pre className="text-[10px] font-mono text-gray-500 whitespace-pre-wrap break-all leading-relaxed">
                      {stackLines}
                    </pre>
                  </div>
                )}
                {componentLines && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Component Stack</p>
                    <pre className="text-[10px] font-mono text-gray-500 whitespace-pre-wrap break-all leading-relaxed">
                      {componentLines}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
