import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import api from '../utils/api'
import medico from '../assets/medico.png'

function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/subscribers', { email });
      toast.success(res.data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cureBasketLinks = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Site Map', path: '/site-map' },
    { name: 'Terms And Conditions', path: '/terms-conditions' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Disclaimer', path: '/disclaimer' },
    { name: 'Blog', path: '/blogs' },
    { name: 'Articles', path: '/articles' },
    { name: 'Referral Program', path: '/referral' }
  ];

  const categoriesLinks = [
    { name: 'New Products', path: '/all-products' },
    { name: 'Featured Products', path: '/best-sellers' },
    { name: "Women's Health", path: "/category/women's-health" },
    { name: 'Pain Relief', path: '/category/pain-relief' }
  ];

  const faqsLinks = [
    { name: 'How to Place the Order', path: '/how-to-order' },
    { name: 'Refunds and Returns', path: '/refund-policy' },
    { name: 'Cancellation Policy', path: '/cancellation-policy' },
    { name: 'Frequently Asked Questions', path: '/faqs' },
    { name: 'Review Guidelines', path: '/review-guidelines' },
    { name: 'About Indian Pharmacies', path: '/about-indian-pharmacies' }
  ];

  return (
    <section className="relative bg-[#f5f5f5] pt-8 md:pt-16 pb-8 md:pb-16 px-4 md:px-8 overflow-hidden border-t border-gray-200">
      <div className="max-w-[1250px] mx-auto relative">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">

          {/* Left Side: Footer Nav Links */}
          <div className="flex-grow grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3.5 md:gap-y-12">
            {/* CureBasket */}
            <div className="flex flex-col gap-1 md:gap-6">
              <h4 className="text-[13.5px] md:text-[22px] font-bold text-gray-900 leading-tight">CureBasket</h4>
              <div className="flex flex-col gap-1 md:gap-4">
                {cureBasketLinks.map(link => (
                  <Link key={link.name} to={link.path} className="text-[11px] md:text-[15px] font-medium text-gray-700 hover:text-[#006D6D] transition-colors">{link.name}</Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-1 md:gap-6">
              <h4 className="text-[13.5px] md:text-[22px] font-bold text-gray-900 leading-tight">Categories</h4>
              <div className="flex flex-col gap-1 md:gap-4">
                {categoriesLinks.map(link => (
                  <Link key={link.name} to={link.path} className="text-[11px] md:text-[15px] font-medium text-gray-700 hover:text-[#006D6D] transition-colors">{link.name}</Link>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="flex flex-col gap-1 md:gap-6">
              <h4 className="text-[13.5px] md:text-[22px] font-bold text-gray-900 leading-tight">FAQs</h4>
              <div className="flex flex-col gap-1 md:gap-4">
                {faqsLinks.map(link => (
                  <Link key={link.name} to={link.path} className="text-[11px] md:text-[15px] font-medium text-gray-700 hover:text-[#006D6D] transition-colors">{link.name}</Link>
                ))}
              </div>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col gap-1 md:gap-6">
              <h4 className="text-[13.5px] md:text-[22px] font-bold text-gray-900 leading-tight">Contact Us</h4>
              <div className="flex flex-col gap-1 md:gap-4">
                <a href="tel:+18005550199" className="text-[11px] md:text-[15px] font-medium text-gray-700 hover:text-[#006D6D] transition-colors">Click to Call</a>
              </div>
            </div>
          </div>

          {/* Right Side: Newsletter + Social */}
          <div className="w-full lg:w-[400px] shrink-0 relative bg-white md:bg-transparent p-4 pb-12 md:p-0 md:pb-0 rounded-[16px] md:rounded-[24px] border border-gray-100 md:border-none shadow-sm md:shadow-none">
            <img
              src={medico}
              alt="Medico"
              className="absolute -right-2 md:-right-12 -bottom-4 md:-bottom-12 h-[75px] md:h-[200px] w-auto object-contain pointer-events-none z-10 opacity-100"
            />
            <div className="relative z-0">
              <h3 className="text-[15px] md:text-[28px] font-bold text-gray-900 leading-tight mb-1.5">
                Good news for your inbox
              </h3>
              <p className="text-[10.5px] md:text-[17px] text-gray-600 mb-2.5 font-medium">
                Sign up for our newsletter for tips and discounts.
              </p>
              <div className="flex flex-col gap-2 md:gap-5">
                <form onSubmit={handleSubscribe} className="space-y-2 md:space-y-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full h-[34px] md:h-[54px] px-3.5 md:px-5 rounded-lg md:rounded-xl border border-gray-200 focus:outline-none focus:border-[#006D6D] text-gray-700 text-[11px] md:text-[16px] bg-white transition-all shadow-sm disabled:opacity-60"
                    required
                  />
                  
                  <p className="text-[9.5px] md:text-[12px] leading-relaxed text-gray-500 font-medium">
                    By providing your email, you consent to receive marketing communications from <span className="font-bold text-gray-700">CureBasket</span>. You can unsubscribe at any time. Read our <Link to="/terms-conditions" className="underline hover:text-[#006D6D]">Terms</Link> and <Link to="/privacy-policy" className="underline hover:text-[#006D6D]">Privacy Policy</Link>.
                  </p>
 
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[34px] md:h-[54px] bg-[#006D6D] text-white rounded-lg md:rounded-xl font-bold text-[11.5px] md:text-[16px] hover:bg-[#005a5a] transition-all shadow-lg shadow-[#006D6D]/10 disabled:opacity-60"
                  >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
 
                {/* Social Media Icons */}
                <div className="mt-2 md:mt-4 pr-16 md:pr-0">
                  <h4 className="text-[11.5px] md:text-[18px] font-bold text-[#006D6D] mb-1.5 md:mb-4">Follow CureBasket</h4>
                  <div className="flex flex-wrap gap-3.5 md:gap-4">
                    {/* Instagram */}
                    <a href="#" className="text-gray-400 hover:text-[#006D6D] transition-colors">
                      <svg className="w-[15px] h-[15px] md:w-[22px] md:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </a>
                    {/* X (Twitter) */}
                    <a href="#" className="text-gray-400 hover:text-[#006D6D] transition-colors">
                      <svg className="w-[12px] h-[12px] md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </a>
                    {/* Facebook */}
                    <a href="#" className="text-gray-400 hover:text-[#006D6D] transition-colors">
                      <svg className="w-[15px] h-[15px] md:w-[22px] md:h-[22px]" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#" className="text-gray-400 hover:text-[#006D6D] transition-colors">
                      <svg className="w-[15px] h-[15px] md:w-[22px] md:h-[22px]" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
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
