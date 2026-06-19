import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatSocket } from '../context/ChatSocketContext'

const fmtTime = (ts) =>
  new Date(ts || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const ChatWidget = () => {
  const navigate = useNavigate()
  const {
    isOpen, openWidget, closeWidget,
    messages, supportOnline, unreadCount,
    needsGuestForm, sendMessage, submitGuestDetails,
  } = useChatSocket()

  const renderMessageText = (text) => {
    if (!text) return '';
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mdLinkRegex.exec(text)) !== null) {
      const [, linkText, url] = match;
      const matchIndex = match.index;

      if (matchIndex > lastIndex) parts.push(text.substring(lastIndex, matchIndex));

      parts.push(
        <a
          key={matchIndex}
          href={url}
          onClick={(e) => {
            if (url.startsWith('/')) {
              e.preventDefault();
              navigate(url);
            }
          }}
          className="text-[#006D6D] underline font-bold hover:text-[#005a5a]"
        >
          {linkText}
        </a>
      );

      lastIndex = mdLinkRegex.lastIndex;
    }

    if (lastIndex < text.length) parts.push(text.substring(lastIndex));

    return parts.length > 0 ? parts : text;
  };

  const [inputMessage, setInputMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Guest one-time details form
  const [form, setForm] = useState({ name: '', email: '', subject: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Clear the typing indicator once a reply (bot/admin/system) arrives.
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last && last.sender !== 'user') setIsTyping(false)
  }, [messages])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when chat opens with the composer visible
  useEffect(() => {
    if (isOpen && !needsGuestForm && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, needsGuestForm])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape' && isOpen) closeWidget() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeWidget])

  // Prevent background scroll when scrolling inside the widget
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
          const { scrollTop, scrollHeight, clientHeight } = target
          if ((scrollTop === 0 && e.deltaY < 0) || (scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0)) {
            e.preventDefault()
          }
          break
        }
        target = target.parentNode
      }
      if (!isScrollableElement && e.type === 'wheel') e.preventDefault()
    }

    container.addEventListener('wheel', handleScrollPropagation, { passive: false })
    return () => container.removeEventListener('wheel', handleScrollPropagation)
  }, [isOpen])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const text = inputMessage.trim()
    if (!text || sending) return
    setInputMessage('')
    setSending(true)
    setIsTyping(true)
    try {
      await sendMessage(text)
    } catch {
      setIsTyping(false)
    } finally {
      setSending(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full Name is required'
    if (!form.email.trim()) errs.email = 'Email Address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email address'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      await submitGuestDetails({ name: form.name, email: form.email, subject: form.subject })
    } catch {
      setErrors({ email: 'Could not start the chat. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldClass = (hasErr) =>
    `w-full border-2 rounded-xl px-4 py-2.5 text-[13px] font-medium outline-none transition-all text-gray-900 ${
      hasErr ? 'border-red-200 bg-red-50/50' : 'border-gray-100 focus:border-primary bg-gray-50 focus:bg-white'
    }`

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={openWidget}
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
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
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
                <span className={`w-2 h-2 rounded-full ${supportOnline ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400'}`}></span>
                <span className="text-[11px] text-white/80 font-medium">
                  {supportOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={closeWidget}
            className="p-1 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Close support chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        {needsGuestForm ? (
          // Guest pre-chat form — collect identity ONCE before chatting.
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar flex flex-col justify-between overscroll-contain">
            <div className="space-y-4">
              <div>
                <h3 className="text-[15px] font-bold text-gray-800 leading-tight">Before we start</h3>
                <p className="text-[12px] text-gray-500 font-medium mt-1">
                  Tell us who you are so we can pick up where we left off next time you visit.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleFormChange} placeholder="Enter your full name" className={fieldClass(errors.name)} />
                {errors.name && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="Enter your email address" className={`${fieldClass(errors.email)} normal-case`} />
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-0.5 block">Subject <span className="text-gray-400 normal-case">(optional)</span></label>
                <input name="subject" type="text" value={form.subject} onChange={handleFormChange} placeholder="How can we help you?" className={fieldClass(false)} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-[14px] mt-4 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 shadow-sm cursor-pointer"
            >
              {isSubmitting ? 'Starting…' : 'Start Chat'}
            </button>
          </form>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 no-scrollbar overscroll-contain">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user'
                if (msg.sender === 'system') {
                  return (
                    <div key={msg._id} className="text-center">
                      <span className="text-[12px] text-gray-500 bg-gray-100 px-3 py-1.5 rounded-2xl inline-block max-w-[90%]">{renderMessageText(msg.text)}</span>
                    </div>
                  )
                }
                return (
                  <div key={msg._id} className={`flex flex-col max-w-[80%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div
                      className={`p-3 text-[13px] font-medium leading-relaxed shadow-sm break-words ${
                        isUser
                          ? 'bg-primary text-white rounded-[18px] rounded-tr-none'
                          : 'bg-white text-gray-900 border border-gray-100 rounded-[18px] rounded-tl-none'
                      }`}
                    >
                      {renderMessageText(msg.text)}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 font-medium px-1">{fmtTime(msg.createdAt)}</span>
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

            {/* Offline note */}
            {!supportOnline && (
              <div className="bg-orange-50 text-orange-700 text-[11px] font-medium px-4 py-2 text-center border-t border-orange-100 shrink-0">
                Our team is offline right now — leave your message and we’ll reply by email.
              </div>
            )}

            {/* Composer */}
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
                disabled={!inputMessage.trim() || sending}
                className="h-10 w-10 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <svg className="w-4 h-4 rotate-45 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}

export default ChatWidget
