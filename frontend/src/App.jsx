import { useState } from 'react'

import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import BannerCarousel from './components/BannerCarousel'
import FeatureIcons from './components/FeatureIcons'
import ProductSection from './components/ProductSection'
import ShopByCategory from './components/ShopByCategory'
import WhyChoose from './components/WhyChoose'
import AboutUs from './components/AboutUs'
import FAQs from './components/FAQs'
import Manufacturers from './components/Manufacturers'
import Testimonials from './components/Testimonials'
import FooterNewsletter from './components/FooterNewsletter'
import FooterAccessibility from './components/FooterAccessibility'
import HcpPage from './components/HcpPage'

function App() {
  const [isPrescriptionMenuOpen, setIsPrescriptionMenuOpen] = useState(false)
  const [isOnlineCareMenuOpen, setIsOnlineCareMenuOpen] = useState(false)
  const [isHealthInfoMenuOpen, setIsHealthInfoMenuOpen] = useState(false)
  const [isGoldMembershipMenuOpen, setIsGoldMembershipMenuOpen] = useState(false)
  const [isAllCategoriesMenuOpen, setIsAllCategoriesMenuOpen] = useState(false)
  const [isMensHealthOpen, setIsMensHealthOpen] = useState(false)
  const [isHcpPageOpen, setIsHcpPageOpen] = useState(() => window.location.hash === '#hcp')

  if (isHcpPageOpen) {
    return (
      <HcpPage
        onClose={() => {
          window.location.hash = ''
          setIsHcpPageOpen(false)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopBar />

      <Navbar
        isPrescriptionMenuOpen={isPrescriptionMenuOpen}
        setIsPrescriptionMenuOpen={setIsPrescriptionMenuOpen}
        isOnlineCareMenuOpen={isOnlineCareMenuOpen}
        setIsOnlineCareMenuOpen={setIsOnlineCareMenuOpen}
        isHealthInfoMenuOpen={isHealthInfoMenuOpen}
        setIsHealthInfoMenuOpen={setIsHealthInfoMenuOpen}
        isGoldMembershipMenuOpen={isGoldMembershipMenuOpen}
        setIsGoldMembershipMenuOpen={setIsGoldMembershipMenuOpen}
        isAllCategoriesMenuOpen={isAllCategoriesMenuOpen}
        setIsAllCategoriesMenuOpen={setIsAllCategoriesMenuOpen}
        isMensHealthOpen={isMensHealthOpen}
        setIsMensHealthOpen={setIsMensHealthOpen}
      />

      <BannerCarousel />
      <FeatureIcons />
      <ProductSection title="Best Seller" />
      <ProductSection title="New Arrival" />
      <ShopByCategory />
      <WhyChoose />
      <AboutUs />
      <FAQs />
      <Manufacturers />
      <Testimonials />
      <FooterNewsletter />
      <FooterAccessibility />
    </div>
  )
}

export default App
