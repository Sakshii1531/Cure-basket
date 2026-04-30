import curebasketLogo from '../assets/logo1.png'
import joinImage from '../assets/join-image.png'

function HcpPage({ onClose }) {
  return (
    <div className="h-screen overflow-hidden bg-white font-sans">
      <div className="grid h-screen lg:grid-cols-[41%_59%]">
        {/* Left Panel */}
        <div className="bg-white px-7 py-8 md:px-12 lg:px-16 lg:py-12">
          <div className="flex items-center gap-3">
            <img src={curebasketLogo} alt="CureBasket Logo" className="w-10 h-10 object-contain" />
            <div className="flex items-baseline gap-2">
              <span className="text-[20px] font-bold tracking-tight text-primary">CureBasket</span>
              <span className="text-[13px] uppercase tracking-[0.18em] text-black/70">For HCPs</span>
            </div>
          </div>

          <div className="max-w-[500px] pt-8">
            <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-black">
              Join CureBasket for healthcare professionals
            </h1>

            <div className="pt-7 space-y-4">
              {[
                { label: 'Share coupons with patients', icon: <><path d="m15 5 4 4" /><path d="m10 14 9-9" /><path d="m6 8 10 10" /><path d="m3 21 3-3" /><path d="m6.5 17.5 4 4" /></> },
                { label: 'Find manufacturer savings', icon: <><rect x="3" y="6" width="14" height="12" rx="2" /><path d="M17 10h2a2 2 0 0 1 2 2v1" /><path d="M7 12h6" /><path d="M10 9v6" /><path d="m18 17 1.5 1.5L22 16" /></> },
                { label: 'Compare drugs by class', icon: <><path d="M4 6h16" /><path d="M4 18h16" /><path d="M8 6v12" /><path d="m15 9 3 3-3 3" /><path d="m9 15-3-3 3-3" /></> },
                { label: 'See savings insights', icon: <><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20V8" /></> },
              ].map(({ label, icon }) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd400]">
                    <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      {icon}
                    </svg>
                  </span>
                  <span className="text-[16px] font-semibold text-black">{label}</span>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full max-w-[500px] rounded-full bg-[#1f5ead] px-8 py-4 text-[17px] font-semibold text-white">
              Let&apos;s go
            </button>

            <p className="pt-6 text-[14px] leading-[1.55] text-black/80">
              Not a healthcare professional?{' '}
              <button
                type="button"
                className="font-semibold text-primary underline"
                onClick={onClose}
              >
                Go to CureBasket for patients
              </button>
            </p>

            <p className="max-w-[560px] pt-6 text-[14px] leading-[1.55] text-black/80">
              By continuing, you agree to the CureBasket for healthcare professionals Terms and Privacy Policy, and that we may share information about your use of our website with our partners and advertisers.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-[#fff2a6] px-8 py-10 md:px-10 lg:px-14 lg:py-14">
          <div className="mx-auto max-w-[680px]">
            <h2 className="text-center text-[31px] font-semibold leading-[1.08] tracking-[-0.03em] text-black">
              500,000+ HCPs use CureBasket to help their patients save on their prescriptions
            </h2>
            <div className="pt-8">
              <img src={joinImage} alt="Healthcare professional with patient" className="w-full max-h-[540px] rounded-[24px] object-cover shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HcpPage
