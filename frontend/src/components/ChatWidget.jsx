import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAgentOnline, setIsAgentOnline] = useState(true)
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! Welcome to CureBasket. How can we help you today?",
      sender: 'agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Leave a message form state
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Listen to open-chat-widget custom event
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true)
    }
    window.addEventListener('open-chat-widget', handleOpenChat)
    return () => window.removeEventListener('open-chat-widget', handleOpenChat)
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && isAgentOnline && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, isAgentOnline])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Prevent background page from scrolling when scrolling inside the chat widget
  useEffect(() => {
    const container = containerRef.current
    if (!container || !isOpen) return

    const handleScrollPropagation = (e) => {
      let target = e.target
      let isScrollableElement = false

      while (target && target !== container) {
        const style = window.getComputedStyle(target)
        const overflowY = style.overflowY
        const isScrollableY = overflowY === 'auto' || overflowY === 'scroll'
        const canScroll = target.scrollHeight > target.clientHeight

        if (isScrollableY && canScroll) {
          isScrollableElement = true
          const scrollTop = target.scrollTop
          const scrollHeight = target.scrollHeight
          const clientHeight = target.clientHeight

          // If scrolling up at the top, or scrolling down at the bottom, prevent default body scroll
          if ((scrollTop === 0 && e.deltaY < 0) || (scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0)) {
            e.preventDefault()
          }
          break
        }
        target = target.parentNode
      }

      // If scrolling on a non-scrollable part of the widget, block the wheel event completely
      if (!isScrollableElement && e.type === 'wheel') {
        e.preventDefault()
      }
    }

    container.addEventListener('wheel', handleScrollPropagation, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleScrollPropagation)
    }
  }, [isOpen])

  // Chat message submission
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMsg = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    const currentInput = inputMessage.trim().toLowerCase()
    setInputMessage('')
    setIsTyping(true)

    // Simulate agent reply
    setTimeout(() => {
      setIsTyping(false)
      
      let replyText = "Thanks for reaching out! A support representative will review your query and get back to you shortly."
      
      if (currentInput.includes('order') || currentInput.includes('track')) {
        replyText = "You can track your active orders by visiting the 'Track Order' page from the main menu, or by checking the 'My Orders' section in your Account profile."
      } else if (currentInput.includes('prescription') || currentInput.includes('rx') || currentInput.includes('upload')) {
        replyText = "To upload a prescription, please click 'Upload Rx' in the header. Once uploaded, our pharmacists will review it and prepare your order within minutes!"
      } else if (currentInput.includes('refund') || currentInput.includes('cancel') || currentInput.includes('return')) {
        replyText = "Cancellations are supported before shipping. Refunds are automatically processed to your original payment method and take about 5-7 business days to reflect."
      } else if (currentInput.includes('hello') || currentInput.includes('hi ') || currentInput.includes('hey')) {
        replyText = "Hello! I am CureBasket's virtual pharmacist assistant. How can we help you with your medications or order today?"
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: replyText,
        sender: 'agent',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1200)
  }

  // Form handling
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full Name is required'
    if (!form.email.trim()) {
      errs.email = 'Email Address is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Please enter a valid email address'
    }
    if (!form.subject.trim()) errs.subject = 'Subject is required'
    if (!form.message.trim()) errs.message = 'Message text is required'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast.success('Your message has been sent successfully!')
    }, 1000)
  }

  const handleResetForm = () => {
    setForm({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    setIsSubmitted(false)
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[80px] md:bottom-6 right-4 md:right-6 z-[999] bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 active:scale-95 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        aria-label="Open customer support chat"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[13px] tracking-wide">Live Chat</span>
      </button>

      {/* Chat Window */}
      <div
        ref={containerRef}
        className={`fixed bottom-[80px] md:bottom-6 right-4 md:right-6 z-[1000] w-[calc(100vw-32px)] sm:w-[380px] h-[520px] bg-white rounded-[24px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden origin-bottom-right transition-all duration-300 overscroll-contain ${
          isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="bg-primary p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/10 text-white rounded-full flex items-center justify-center font-bold text-[14px]">
              CB
            </div>
            <div>
              <h2 className="text-[14px] font-bold leading-tight">CureBasket Support</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isAgentOnline ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400'}`}></span>
                <span className="text-[11px] text-white/80 font-medium">
                  {isAgentOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Simulation Switch for Testing */}
            <button
              onClick={() => {
                setIsAgentOnline(!isAgentOnline)
                handleResetForm()
              }}
              className="text-[9px] text-white/80 hover:text-white bg-white/15 hover:bg-white/20 px-2 py-1 rounded-full transition-colors font-bold uppercase tracking-wider"
              title="Click to toggle online/offline state for testing"
            >
              {isAgentOnline ? 'Test Offline' : 'Test Online'}
            </button>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              aria-label="Close support chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isAgentOnline ? (
          // ONLINE: Live Chat Interface
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 no-scrollbar overscroll-contain">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div
                      className={`p-3 text-[13px] font-medium leading-relaxed shadow-sm break-words ${
                        isUser
                          ? 'bg-primary text-white rounded-[18px] rounded-tr-none'
                          : 'bg-white text-gray-900 border border-gray-100 rounded-[18px] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 font-medium px-1">{msg.time}</span>
                  </div>
                )
              })}

              {isTyping && (
                <div className="flex flex-col mr-auto items-start max-w-[80%]">
                  <div className="bg-white border border-gray-100 rounded-[18px] rounded-tl-none p-3 shadow-sm flex items-center justify-center">
                    <div className="flex gap-1.5 px-1 py-0.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Message Form */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-100 bg-white p-3 flex gap-2 items-center shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-2 border-gray-100 focus:border-primary bg-gray-50 focus:bg-white rounded-xl px-4 py-2.5 text-[13px] font-medium outline-none transition-all normal-case text-gray-900"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="h-10 w-10 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <svg className="w-4 h-4 rotate-45 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          // OFFLINE: Leave a Message Form
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {!isSubmitted ? (
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar flex flex-col justify-between overscroll-contain">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-800 leading-tight">Leave a Message</h3>
                    <p className="text-[12px] text-gray-500 font-medium mt-1">
                      Our support team is currently offline. Send us your inquiry and we will get back to you via email within 24 hours.
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Enter your full name"
                      className={`w-full border-2 rounded-xl px-4 py-2.5 text-[13px] font-medium outline-none transition-all text-gray-900 ${
                        errors.name ? 'border-red-200 bg-red-50/50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-[10px] mt-0.5 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="Enter your email address"
                      className={`w-full border-2 rounded-xl px-4 py-2.5 text-[13px] font-medium outline-none transition-all text-gray-900 normal-case ${
                        errors.email ? 'border-red-200 bg-red-50/50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[10px] mt-0.5 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Subject</label>
                    <input
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleFormChange}
                      placeholder="How can we help you?"
                      className={`w-full border-2 rounded-xl px-4 py-2.5 text-[13px] font-medium outline-none transition-all text-gray-900 ${
                        errors.subject ? 'border-red-200 bg-red-50/50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-[10px] mt-0.5 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleFormChange}
                      placeholder="Write your details here..."
                      rows="3"
                      className={`w-full border-2 rounded-xl px-4 py-2.5 text-[13px] font-medium outline-none transition-all text-gray-900 normal-case min-h-[90px] resize-none ${
                        errors.message ? 'border-red-200 bg-red-50/50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-[10px] mt-0.5 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-[14px] mt-4 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 shadow-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Submit Message'
                  )}
                </button>
              </form>
            ) : (
              // Success Screen
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-bounce-slow">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-black text-gray-900">Message Sent!</h3>
                <p className="text-gray-500 text-[13px] font-medium mt-2 max-w-[280px]">
                  Thank you for reaching out. We have received your query and will respond back via email within 24 hours.
                </p>
                <div className="w-full max-w-[260px] space-y-2.5 mt-8">
                  <button
                    onClick={handleResetForm}
                    className="w-full bg-secondary hover:bg-secondary-soft text-primary font-bold py-3 rounded-xl text-[13px] transition-colors border border-[#006D6D]/10 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-gray-400 hover:text-gray-600 font-bold py-2 text-[13px] transition-colors cursor-pointer"
                  >
                    Close Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ChatWidget
