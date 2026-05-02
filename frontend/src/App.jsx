import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

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
import SearchBar from './components/SearchBar'
import NewAndNow from './components/NewAndNow'
import BestSellers from './components/BestSellers'
import BestSellersPage from './components/BestSellersPage'
import PromoBanners from './components/PromoBanners'
import ZepboundPromo from './components/ZepboundPromo'
import HelpSection from './components/HelpSection'
import ProductDetail from './components/ProductDetail'

import PrescriptionBanner from './components/PrescriptionBanner'
import MainBannerCarousel from './components/MainBannerCarousel'

function HomePage({ onProductClick }) {
  return (
    <>
      <SearchBar />
      <NewAndNow title="New and best" onProductClick={onProductClick} />
      <FeatureIcons />
      <PrescriptionBanner />
      <MainBannerCarousel />
      <BestSellers onProductClick={onProductClick} />
      <HelpSection />
      <ShopByCategory />
      <WhyChoose />
      <AboutUs />
      <FAQs />
      <Manufacturers />
      <Testimonials />
    </>
  )
}

function AppContent() {
  const [isPrescriptionMenuOpen, setIsPrescriptionMenuOpen] = useState(false)
  const [isOnlineCareMenuOpen, setIsOnlineCareMenuOpen] = useState(false)
  const [isHealthInfoMenuOpen, setIsHealthInfoMenuOpen] = useState(false)
  const [isGoldMembershipMenuOpen, setIsGoldMembershipMenuOpen] = useState(false)
  const [isAllCategoriesMenuOpen, setIsAllCategoriesMenuOpen] = useState(false)
  const [isMensHealthOpen, setIsMensHealthOpen] = useState(false)
  const [isHcpPageOpen, setIsHcpPageOpen] = useState(() => window.location.hash === '#hcp')
  
  const navigate = useNavigate()

  const handleProductClick = (product) => {
    // For now, we'll just navigate to a generic product route. 
    // In a real app, we'd use the product ID.
    navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { product } })
  }

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
      
      <Routes>
        <Route path="/" element={<HomePage onProductClick={handleProductClick} />} />
        <Route path="/product/:id" element={<ProductDetail onBack={() => navigate('/')} />} />
        <Route path="/best-sellers" element={<BestSellersPage onProductClick={handleProductClick} onBack={() => navigate('/')} />} />
      </Routes>

      <FooterNewsletter />
      <FooterAccessibility />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
