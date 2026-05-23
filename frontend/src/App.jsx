import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'

import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import BannerCarousel from './components/BannerCarousel'
import FeatureIcons from './components/FeatureIcons'
import ProductSection from './components/ProductSection'
import ShopByCategory from './components/ShopByCategory'
import WhyChoose from './components/WhyChoose'
import AboutUs from './components/AboutUs'
import BlogSection from './components/BlogSection'
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
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'sonner'

import PrescriptionBanner from './components/PrescriptionBanner'
import MainBannerCarousel from './components/MainBannerCarousel'
import SupportModal from './components/SupportModal'
import UploadRxPage from './components/UploadRxPage'
import MedicinesPage from './components/MedicinesPage'
import BlogsPage from './components/BlogsPage'
import BlogDetailPage from './components/BlogDetailPage'
import RxPromptModal from './components/RxPromptModal'

const AdminLayout = lazy(() => import('./admin/layout/AdminLayout'))
const Dashboard = lazy(() => import('./admin/pages/Dashboard'))
const Medicines = lazy(() => import('./admin/pages/Medicines'))
const Categories = lazy(() => import('./admin/pages/Categories'))
const Orders = lazy(() => import('./admin/pages/Orders'))
const Users = lazy(() => import('./admin/pages/Users'))
const Banners = lazy(() => import('./admin/pages/Banners'))
const Coupons = lazy(() => import('./admin/pages/Coupons'))
const Settings = lazy(() => import('./admin/pages/Settings'))
const Prescriptions = lazy(() => import('./admin/pages/Prescriptions'))
const Brands = lazy(() => import('./admin/pages/Brands'))
const Reviews = lazy(() => import('./admin/pages/Reviews'))
const Analytics = lazy(() => import('./admin/pages/Analytics'))
const CMS = lazy(() => import('./admin/pages/CMS'))
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'))
const Blogs = lazy(() => import('./admin/pages/Blogs'))
const MedicineDetails = lazy(() => import('./admin/pages/MedicineDetails'))
const BankContact = lazy(() => import('./admin/pages/BankContact'))
const OrderShipping = lazy(() => import('./admin/pages/OrderShipping'))
const Dispense = lazy(() => import('./admin/pages/Dispense'))

function AdminSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <span className="text-6xl font-bold text-primary">404</span>
      <p className="text-xl text-gray-600">Page not found</p>
      <a href="/" className="mt-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
        Go home
      </a>
    </div>
  )
}

// Synchronous guard — runs before any lazy admin bundle is fetched,
// preventing the brief unauthenticated flash that a lazy-only guard would allow.
function AdminRoute({ children }) {
  const { isLoggedIn, authLoading, user } = useAuth()
  if (authLoading) return <AdminSpinner />
  if (!isLoggedIn || !['admin', 'superadmin'].includes(user?.role)) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

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
      <BlogSection />
      <FAQs />
      <Manufacturers />
      <Testimonials />
    </>
  )
}

function AppContent() {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [supportModalType, setSupportModalType] = useState('contact')
  const [isHcpPageOpen, setIsHcpPageOpen] = useState(() => window.location.hash === '#hcp')
  const { redirectTo, setRedirectTo } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  // Consume requireAuth redirects — AuthContext can't call useNavigate directly
  // because it lives outside <Router>, so it sets redirectTo and we navigate here.
  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
      setRedirectTo(null);
    }
  }, [redirectTo]);

  const openSupportModal = (type) => {
    setSupportModalType(type)
    setIsSupportModalOpen(true)
  }

  const isSubPage = [
    '/categories', '/orders', '/account', '/edit-profile', '/upload-rx', '/medicines',
    '/cart', '/checkout', '/payment', '/order-success', '/track-order',
    '/all-reviews', '/best-sellers', '/all-brands', '/all-products', '/blogs',
  ].includes(location.pathname)
    || location.pathname.startsWith('/category/')
    || location.pathname.startsWith('/product/')
    || location.pathname.startsWith('/blog')
  const isAdminPage = location.pathname.startsWith('/admin')
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname)
    || location.pathname.startsWith('/reset-password/')

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
      {!isSubPage && !isAdminPage && !isAuthPage && (
        <>
          <TopBar openSupport={openSupportModal} />
          <Navbar openSupport={openSupportModal} />
        </>
      )}
      
      {/* For Desktop Subpages, always show header */}
      <div className="hidden md:block">
        {isSubPage && !isAdminPage && !isAuthPage && (
          <>
            <TopBar openSupport={openSupportModal} />
            <Navbar openSupport={openSupportModal} />
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
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/all-reviews" element={<AllReviewsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/category/:categoryName" element={<CategoryProductList />} />
        <Route path="/upload-rx" element={<ProtectedRoute><UploadRxPage /></ProtectedRoute>} />
        <Route path="/medicines" element={<MedicinesPage onProductClick={handleProductClick} />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blog/:slug?" element={<BlogDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Suspense fallback={<AdminSpinner />}><AdminLogin /></Suspense>} />
        <Route path="/admin" element={<AdminRoute><Suspense fallback={<AdminSpinner />}><AdminLayout /></Suspense></AdminRoute>}>
          <Route index element={<Suspense fallback={<AdminSpinner />}><Dashboard /></Suspense>} />
          <Route path="medicines" element={<Suspense fallback={<AdminSpinner />}><Medicines /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<AdminSpinner />}><Categories /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<AdminSpinner />}><Orders /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<AdminSpinner />}><Users /></Suspense>} />
          <Route path="banners" element={<Suspense fallback={<AdminSpinner />}><Banners /></Suspense>} />
          <Route path="coupons" element={<Suspense fallback={<AdminSpinner />}><Coupons /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<AdminSpinner />}><Settings /></Suspense>} />
          <Route path="prescriptions" element={<Suspense fallback={<AdminSpinner />}><Prescriptions /></Suspense>} />
          <Route path="dispense" element={<Suspense fallback={<AdminSpinner />}><Dispense /></Suspense>} />
          <Route path="brands" element={<Suspense fallback={<AdminSpinner />}><Brands /></Suspense>} />
          <Route path="reviews" element={<Suspense fallback={<AdminSpinner />}><Reviews /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<AdminSpinner />}><Analytics /></Suspense>} />
          <Route path="cms" element={<Suspense fallback={<AdminSpinner />}><CMS /></Suspense>} />
          <Route path="blogs" element={<Suspense fallback={<AdminSpinner />}><Blogs /></Suspense>} />
          <Route path="bank-contact" element={<Suspense fallback={<AdminSpinner />}><BankContact /></Suspense>} />
          <Route path="order-shipping" element={<Suspense fallback={<AdminSpinner />}><OrderShipping /></Suspense>} />
          <Route path="medicine-details" element={<Suspense fallback={<AdminSpinner />}><MedicineDetails /></Suspense>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isSubPage && !isAdminPage && !isAuthPage && <FooterNewsletter />}
      {!isSubPage && !isAdminPage && !isAuthPage && <FooterAccessibility />}
      
      {/* For desktop subpages, show footer */}
      <div className="hidden md:block">
        {isSubPage && !isAdminPage && !isAuthPage && <FooterNewsletter />}
        {isSubPage && !isAdminPage && !isAuthPage && <FooterAccessibility />}
      </div>
      
      {!isAdminPage && !isAuthPage && <MobileBottomNav />}

      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
        type={supportModalType}
      />

      <LoginModal />
      <RxPromptModal />
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
