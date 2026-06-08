import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const DEFAULTS = {
  heroTitle: "Privacy Policy",
  heroSub: "At CureBasket, we are committed to protecting your privacy and ensuring the security of your personal information.",
  intro: "This Privacy Policy explains how we collect, use, disclose, and safeguard your details when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.",
  sections: [
    {
      id: "sec-1",
      title: "1. Information We Collect",
      content: "We collect personal information that you voluntarily provide to us when you register on our website, place an order, upload a prescription, subscribe to our newsletter, or contact us. This information may include your name, email address, phone number, shipping address, billing address, and prescription records."
    },
    {
      id: "sec-2",
      title: "2. How We Use Your Information",
      content: "We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. Specifically, we use the information to process orders, verify prescriptions, manage accounts, provide support, improve services, and send promotional communications."
    },
    {
      id: "sec-3",
      title: "3. Sharing & Disclosure",
      content: "We do not sell, trade, or rent your personal identification information to others. We may share information with third parties who perform services for us or on our behalf, such as payment processing, prescription verification, data analysis, email delivery, hosting services, customer service, and shipping courier networks."
    },
    {
      id: "sec-4",
      title: "4. Data Security",
      content: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of abuse."
    },
    {
      id: "sec-5",
      title: "5. Cookies & Tracking",
      content: "We may use cookies, web beacons, tracking pixels, and other tracking technologies on the website to help customize the site and improve your experience. When you access the website, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default."
    },
    {
      id: "sec-6",
      title: "6. Your Rights",
      content: "Depending on your location, you may have the right to access, update, correct, or request deletion of the personal information we hold about you. You can review or change the information in your account at any time by logging in, or you may contact us directly."
    }
  ]
};

function PrivacyPolicyPage() {
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    api.get('/settings/public/cms')
      .then(res => {
        const privacyText = res.data?.data?.privacy;
        if (privacyText && typeof privacyText === 'string') {
          const parsedSections = [];
          let intro = "";
          const blocks = privacyText.split('\n\n').map(b => b.trim()).filter(Boolean);
          
          blocks.forEach(block => {
            const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length > 0 && /^\d+\./.test(lines[0])) {
              const title = lines[0];
              const contentText = lines.slice(1).join('\n');
              parsedSections.push({ title, content: contentText });
            } else {
              if (parsedSections.length === 0) {
                intro += (intro ? "\n\n" : "") + block;
              } else {
                if (parsedSections.length > 0) {
                  parsedSections[parsedSections.length - 1].content += "\n\n" + block;
                } else {
                  intro += (intro ? "\n\n" : "") + block;
                }
              }
            }
          });

          setContent(prev => ({
            ...prev,
            intro: intro || prev.intro,
            sections: parsedSections.length > 0 ? parsedSections : prev.sections
          }));
        } else if (privacyText && typeof privacyText === 'object') {
          setContent(prev => ({
            ...prev,
            ...privacyText
          }));
        }
      })
      .catch(() => {})
  }, [])

  const activeSections = (content.sections || []).map((sec, idx) => ({
    id: sec.id || `sec-${idx}`,
    title: sec.title,
    content: sec.content
  }));

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006D6D] to-[#004D4D] text-white pt-12 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-3 relative z-10">
          <h1 className="text-[24px] md:text-[44px] font-bold tracking-tight">{content.heroTitle}</h1>
          <p className="text-[14px] md:text-[16px] text-[#CFF4F4] max-w-xl mx-auto font-medium">
            {content.heroSub}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Quick Sticky Index Sidebar (Render only if we have sections) */}
          {activeSections.length > 0 && (
            <aside className="w-full lg:w-[280px] shrink-0">
              <div className="sticky top-24 bg-[#E6F7F7] border border-[#006D6D]/10 rounded-[20px] p-6 space-y-4">
                <h3 className="text-[16px] font-bold text-[#004D4D] tracking-wide uppercase">Table of Contents</h3>
                <nav className="flex flex-col gap-2">
                  {activeSections.map(section => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="text-[13.5px] font-semibold text-gray-600 hover:text-[#006D6D] transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Legal Texts */}
          <div className="flex-grow space-y-10">
            {content.intro && (
              <div className="text-[14.5px] md:text-[16px] text-gray-600 font-medium leading-relaxed text-left md:text-justify border-b border-gray-100 pb-6">
                {content.intro}
              </div>
            )}

            {activeSections.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-3">
                <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 border-b border-gray-100 pb-2">
                  {section.title}
                </h2>
                <p className="text-[14.5px] md:text-[16px] text-gray-600 font-medium leading-relaxed text-left md:text-justify whitespace-pre-line">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
