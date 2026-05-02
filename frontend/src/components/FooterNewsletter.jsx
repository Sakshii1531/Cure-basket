import medico from '../assets/medico.png'

function FooterNewsletter() {
  return (
    <section className="relative bg-[#f5f5f5] pt-12 pb-12 px-4 overflow-visible border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto relative">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">

          {/* Left Side: Footer Nav Links */}
          <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {/* CureBasket */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[22px] font-semibold text-gray-900 leading-tight">CureBasket</h4>
              <div className="flex flex-col gap-4">
                {['About Us', 'Site Map', 'Terms And Conditions', 'Disclaimer', 'Blog', 'Articles', 'Referral Program'].map(link => (
                  <a key={link} href="#" className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors">{link}</a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[22px] font-semibold text-gray-900 leading-tight">Categories</h4>
              <div className="flex flex-col gap-4">
                {['New Products', 'Featured Products', "Women's Health", 'Pain Relief'].map(link => (
                  <a key={link} href="#" className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors">{link}</a>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[22px] font-semibold text-gray-900 leading-tight">FAQs</h4>
              <div className="flex flex-col gap-4">
                {['How to Place the Order', 'Refunds and Returns', 'Cancellation Policy', 'Frequently Asked Questions', 'Review Guidelines', 'About Indian Pharmacies'].map(link => (
                  <a key={link} href="#" className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors">{link}</a>
                ))}
              </div>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[22px] font-semibold text-gray-900 leading-tight">Contact Us</h4>
              <div className="flex flex-col gap-4">
                <a href="#" className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors">Click to Call</a>
              </div>
            </div>
          </div>

          {/* Right Side: Newsletter + Social */}
          <div className="w-full lg:w-[380px] shrink-0 relative">
            <img
              src={medico}
              alt="Medico"
              className="absolute -right-12 -bottom-12 h-[150px] md:h-[200px] w-auto object-contain pointer-events-none z-10"
            />
            <div className="relative z-0">
              <h3 className="text-[24px] md:text-[28px] font-bold text-gray-900 leading-tight mb-1">
                Good news for your inbox
              </h3>
              <p className="text-[15px] md:text-[17px] text-gray-800 mb-6 font-medium">
                Sign up for our newsletter for tips and discounts.
              </p>
              <div className="flex flex-col gap-5">
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full h-[54px] px-5 rounded-lg border border-gray-400 focus:outline-none focus:border-gray-600 text-gray-700 text-[16px] bg-white transition-all"
                  />
                  
                  <p className="text-[13px] leading-relaxed text-black font-medium">
                    By providing your email, you consent to receive marketing communications from <span className="font-bold">CureBasket</span>, which may include content and/or data related to men's health, women's health, reproductive care, or sexual health. You agree to the CureBasket <a href="#" className="underline">Terms of Use</a> and acknowledge the <a href="#" className="underline">Privacy Policy</a>. You can unsubscribe at any time.
                  </p>

                  <button className="w-full h-[54px] bg-[#004D4D] text-white rounded-full font-bold text-[16px] hover:bg-[#003333] transition-all shadow-md">
                    Subscribe
                  </button>
                </div>

                {/* Social Media Icons */}
                <div className="mt-4">
                  <h4 className="text-[18px] font-bold text-[#004D4D] mb-2">Follow CureBasket</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* Instagram */}
                    <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </a>
                    {/* X (Twitter) */}
                    <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </a>
                    {/* Facebook */}
                    <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    {/* YouTube */}
                    <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#004D4D] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default FooterNewsletter
