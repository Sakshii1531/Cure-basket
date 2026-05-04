import medico from '../assets/medico.png'

function FooterNewsletter() {
  return (
    <section className="relative bg-[#f5f5f5] pt-12 md:pt-16 pb-12 md:pb-16 px-4 md:px-8 overflow-hidden border-t border-gray-200">
      <div className="max-w-[1250px] mx-auto relative">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">

          {/* Left Side: Footer Nav Links */}
          <div className="flex-grow grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 md:gap-y-12">
            {/* CureBasket */}
            <div className="flex flex-col gap-2 md:gap-6">
              <h4 className="text-[16px] md:text-[22px] font-bold text-gray-900 leading-tight">CureBasket</h4>
              <div className="flex flex-col gap-1.5 md:gap-4">
                {['About Us', 'Site Map', 'Terms And Conditions', 'Disclaimer', 'Blog', 'Articles', 'Referral Program'].map(link => (
                  <a key={link} href="#" className="text-[12.5px] md:text-[15px] font-medium text-gray-700 hover:text-[#006D6D] transition-colors">{link}</a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-2 md:gap-6">
              <h4 className="text-[16px] md:text-[22px] font-bold text-gray-900 leading-tight">Categories</h4>
              <div className="flex flex-col gap-1.5 md:gap-4">
                {['New Products', 'Featured Products', "Women's Health", 'Pain Relief'].map(link => (
                  <a key={link} href="#" className="text-[12.5px] md:text-[15px] font-medium text-gray-700 hover:text-[#006D6D] transition-colors">{link}</a>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="flex flex-col gap-2 md:gap-6">
              <h4 className="text-[16px] md:text-[22px] font-bold text-gray-900 leading-tight">FAQs</h4>
              <div className="flex flex-col gap-1.5 md:gap-4">
                {['How to Place the Order', 'Refunds and Returns', 'Cancellation Policy', 'Frequently Asked Questions', 'Review Guidelines', 'About Indian Pharmacies'].map(link => (
                  <a key={link} href="#" className="text-[12.5px] md:text-[15px] font-medium text-gray-700 hover:text-[#006D6D] transition-colors">{link}</a>
                ))}
              </div>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col gap-2 md:gap-6">
              <h4 className="text-[16px] md:text-[22px] font-bold text-gray-900 leading-tight">Contact Us</h4>
              <div className="flex flex-col gap-1.5 md:gap-4">
                <a href="#" className="text-[12.5px] md:text-[15px] font-medium text-gray-700 hover:text-[#006D6D] transition-colors">Click to Call</a>
              </div>
            </div>
          </div>

          {/* Right Side: Newsletter + Social */}
          <div className="w-full lg:w-[400px] shrink-0 relative bg-white md:bg-transparent p-6 md:p-0 rounded-[24px] border border-gray-100 md:border-none shadow-sm md:shadow-none">
            <img
              src={medico}
              alt="Medico"
              className="absolute -right-2 md:-right-12 -bottom-4 md:-bottom-12 h-[120px] md:h-[200px] w-auto object-contain pointer-events-none z-10 opacity-100"
            />
            <div className="relative z-0">
              <h3 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight mb-2">
                Good news for your inbox
              </h3>
              <p className="text-[14px] md:text-[17px] text-gray-600 mb-6 font-medium">
                Sign up for our newsletter for tips and discounts.
              </p>
              <div className="flex flex-col gap-5">
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full h-[50px] md:h-[54px] px-5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#006D6D] text-gray-700 text-[15px] md:text-[16px] bg-white transition-all shadow-sm"
                  />
                  
                  <p className="text-[12px] leading-relaxed text-gray-500 font-medium">
                    By providing your email, you consent to receive marketing communications from <span className="font-bold text-gray-700">CureBasket</span>. You can unsubscribe at any time. Read our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
                  </p>

                  <button className="w-full h-[50px] md:h-[54px] bg-[#006D6D] text-white rounded-xl font-bold text-[15px] md:text-[16px] hover:bg-[#005a5a] transition-all shadow-lg shadow-[#006D6D]/10">
                    Subscribe
                  </button>
                </div>

                {/* Social Media Icons */}
                <div className="mt-4">
                  <h4 className="text-[16px] md:text-[18px] font-bold text-[#006D6D] mb-4">Follow CureBasket</h4>
                  <div className="flex flex-wrap gap-4">
                    {/* Instagram */}
                    <a href="#" className="text-gray-400 hover:text-[#006D6D] transition-colors">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </a>
                    {/* X (Twitter) */}
                    <a href="#" className="text-gray-400 hover:text-[#006D6D] transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </a>
                    {/* Facebook */}
                    <a href="#" className="text-gray-400 hover:text-[#006D6D] transition-colors">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#" className="text-gray-400 hover:text-[#006D6D] transition-colors">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
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
