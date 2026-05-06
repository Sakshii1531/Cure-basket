import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'

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
import FrequentlyBoughtPage from './components/FrequentlyBoughtPage'
import PopularBrands from './components/PopularBrands'
import AllBrandsPage from './components/AllBrandsPage'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Payment from './components/Payment'
import Review from './components/Review'
import OrderSuccess from './components/OrderSuccess'
import TrackOrder from './components/TrackOrder'
import AllReviewsPage from './components/AllReviewsPage'
import MobileBottomNav from './components/MobileBottomNav'
import CategoriesPage from './components/CategoriesPage'
import OrdersPage from './components/OrdersPage'
import AccountPage from './components/AccountPage'
import EditProfilePage from './components/EditProfilePage'
import CategoryProductList from './components/CategoryProductList'
import LoginModal from './components/LoginModal'
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'

import PrescriptionBanner from './components/PrescriptionBanner'
import MainBannerCarousel from './components/MainBannerCarousel'
import SupportModal from './components/SupportModal'
import UploadRxPage from './components/UploadRxPage'
import MedicinesPage from './components/MedicinesPage'

function HomePage({ onProductClick }) {
  return (
    <>
      <SearchBar />
      <NewAndNow title="New and best" onProductClick={onProductClick} />
      <FeatureIcons />
      <PrescriptionBanner />
      <MainBannerCarousel />
      <PopularBrands />
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
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [supportModalType, setSupportModalType] = useState('contact')
  const [isHcpPageOpen, setIsHcpPageOpen] = useState(() => window.location.hash === '#hcp')
  
  const navigate = useNavigate()
  const location = useLocation()
  
  const openSupportModal = (type) => {
    setSupportModalType(type)
    setIsSupportModalOpen(true)
  }

  const isSubPage = ['/categories', '/orders', '/account', '/edit-profile', '/upload-rx', '/medicines'].includes(location.pathname) || location.pathname.startsWith('/category/')

  const handleProductClick = (product) => {
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
    <div className="min-h-screen bg-background font-sans pb-[70px] md:pb-0">
      {/* Global Headers for Main Pages (Mobile & Desktop) */}
      {!isSubPage && (
        <>
          <TopBar openSupport={openSupportModal} />
          <Navbar
            openSupport={openSupportModal}
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
        </>
      )}
      
      {/* For Desktop Subpages, always show header */}
      <div className="hidden md:block">
        {isSubPage && (
          <>
            <TopBar openSupport={openSupportModal} />
            <Navbar
              openSupport={openSupportModal}
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
          </>
        )}
      </div>
      
      <Routes>
        <Route path="/" element={<HomePage onProductClick={handleProductClick} />} />
        <Route path="/product/:id" element={<ProductDetail onBack={() => navigate('/')} />} />
        <Route path="/all-products" element={<FrequentlyBoughtPage onBack={() => navigate(-1)} onProductClick={handleProductClick} />} />
        <Route path="/best-sellers" element={<BestSellersPage onProductClick={handleProductClick} onBack={() => navigate('/')} />} />
        <Route path="/all-brands" element={<AllBrandsPage onBack={() => navigate('/')} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/review" element={<Review />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/all-reviews" element={<AllReviewsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/category/:categoryName" element={<CategoryProductList />} />
        <Route path="/upload-rx" element={<UploadRxPage />} />
        <Route path="/medicines" element={<MedicinesPage onProductClick={handleProductClick} />} />
      </Routes>

      {!isSubPage && <FooterNewsletter />}
      {!isSubPage && <FooterAccessibility />}
      
      {/* For desktop subpages, show footer */}
      <div className="hidden md:block">
        {isSubPage && <FooterNewsletter />}
        {isSubPage && <FooterAccessibility />}
      </div>
      
      <MobileBottomNav />

      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
        type={supportModalType}
      />

      <LoginModal />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
