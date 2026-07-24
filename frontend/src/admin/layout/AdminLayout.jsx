import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminChatSocketProvider, useAdminChatSocket } from '../../context/AdminChatSocketContext';
import { toast } from 'sonner';

// Notification bell — live unread chat count from the shared admin socket.
function ChatNotificationBell() {
  const { unreadCount } = useAdminChatSocket();
  return (
    <Link to="/admin/chat" className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" title="Live Chat">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

// Real-time order notification bell dropdown in admin header
function OrderNotificationBell() {
  const { orderNotifications = [], markOrderNotificationsAsRead, clearOrderNotifications } = useAdminChatSocket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const navigate = useNavigate();

  const unreadCount = orderNotifications.filter(n => !n.read).length;

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && unreadCount > 0) {
      markOrderNotificationsAsRead();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
        title="Order Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#006D6D] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl border border-gray-150 shadow-2xl py-3 z-50 animate-fade-in">
          <div className="px-4 pb-2.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wide">Order Notifications</span>
              {orderNotifications.length > 0 && (
                <span className="text-[10px] font-extrabold bg-[#006D6D]/10 text-[#006D6D] px-2 py-0.5 rounded-full">
                  {orderNotifications.length}
                </span>
              )}
            </div>
            {orderNotifications.length > 0 && (
              <button
                onClick={clearOrderNotifications}
                className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto p-2.5 space-y-2">
            {orderNotifications.length > 0 ? (
              orderNotifications.map((n) => (
                <div
                  key={n.id}
                  className="bg-white border border-[#006D6D]/20 border-l-4 border-l-[#006D6D] rounded-xl p-3 shadow-xs hover:shadow-md flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#006D6D]/10 text-[#006D6D] flex items-center justify-center shrink-0 relative">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      {!n.read && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black text-[#006D6D] uppercase tracking-wider">New Order</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[13px] font-extrabold text-gray-900 truncate leading-tight mt-0.5">
                        {n.customerName}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11.5px] text-gray-500 mt-0.5 font-medium">
                        <span className="font-extrabold text-[#006D6D]">${Number(n.totalAmount || 0).toFixed(2)}</span>
                        <span className="text-gray-300">•</span>
                        <span>{n.itemsCount || 1} {n.itemsCount === 1 ? 'item' : 'items'}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/admin/orders');
                    }}
                    className="bg-[#006D6D] hover:bg-[#005252] text-white text-[11px] font-extrabold px-3 py-2 rounded-lg shrink-0 transition-all shadow-2xs hover:shadow-xs active:scale-95 flex items-center gap-1"
                  >
                    View
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs font-semibold">
                No recent order notifications
              </div>
            )}
          </div>

          <div className="px-4 pt-2.5 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/admin/orders');
              }}
              className="text-[12px] font-extrabold text-[#006D6D] hover:underline"
            >
              View All Orders →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isLoggedIn, authLoading, logout, can } = useAuth();

  // Wait for the /me check to finish before deciding to redirect
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!isLoggedIn || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    window.location.href = '/admin/login';
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Medicines', path: '/admin/medicines', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1H9L8 4zm.5 5h7L15 10H9l-.5-1zm.5 5h7l-1 1H10l-.5-1z', module: 'medicines' },
    { name: 'Categories', path: '/admin/categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', module: 'categories' },
    { name: 'Banners', path: '/admin/banners', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z', module: 'banners' },
    { name: 'Orders', path: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', module: 'orders' },
    { name: 'Users', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', module: 'users' },
    { name: 'Coupons', path: '/admin/coupons', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 001 1.732V15a2 2 0 00-1 1.732V19a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-1-1.732V11a2 2 0 001-1.732V7a2 2 0 00-2-2H5z', module: 'coupons' },
    { name: 'Prescriptions', path: '/admin/prescriptions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', module: 'prescriptions' },
    { name: 'Dispense', path: '/admin/dispense', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', module: 'settings' },
    { name: 'Brands', path: '/admin/brands', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', module: 'brands' },
    { name: 'Reviews', path: '/admin/reviews', icon: 'M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', module: 'reviews' },
    { name: 'Live Chat', path: '/admin/chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', module: 'chat' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6M9 19H7a2 2 0 01-2-2v-3a2 2 0 012-2h2a2 2 0 012 2v3a2 2 0 01-2 2zm8 0h-2a2 2 0 01-2-2v-9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2z', module: 'analytics' },
    { name: 'Content', path: '/admin/content', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 2v4a1 1 0 001 1h4', module: 'settings' },
    { name: 'Blogs', path: '/admin/blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 2v4a1 1 0 001 1h4', module: 'blogs' },
    { name: 'Subscribers', path: '/admin/subscribers', icon: 'M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19a2 2 0 01-2 2H5a2 2 0 01-2-2z M3 11l9 6 9-6', module: 'users' },
    { name: 'Contact & Prescription', path: '/admin/contact-prescription', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H5a3 3 0 00-3 3v8a3 3 0 003 3z', module: 'settings' },
    { name: 'Bank Transfer Details', path: '/admin/bank-transfer', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', module: 'settings' },
    { name: 'Order & Shipping', path: '/admin/order-shipping', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', module: 'settings' },
    { name: 'Roles', path: '/admin/roles', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', module: 'roles' },
    { name: 'Settings', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z', module: 'settings' },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.module) return true;
    return can(item.module, 'read');
  });

  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const match = filteredMenuItems.find((item) =>
      item.name.toLowerCase().includes(q)
    );

    if (match) {
      navigate(match.path);
      setSearchQuery('');
    } else {
      if (q.includes('med') || q.includes('drug')) {
        navigate('/admin/medicines');
      } else if (q.includes('order')) {
        navigate('/admin/orders');
      } else if (q.includes('user') || q.includes('cust')) {
        navigate('/admin/users');
      } else if (q.includes('presc')) {
        navigate('/admin/prescriptions');
      } else {
        toast.error(`No section found matching "${searchQuery}"`);
      }
      setSearchQuery('');
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  const roleLabel = user?.role === 'superadmin'
    ? 'Super Admin'
    : user?.customRole?.name || 'Admin';

  return (
    <AdminChatSocketProvider>
    <div className="min-h-screen bg-section flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary flex flex-col fixed h-full z-30 text-white overscroll-y-contain">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="text-2xl font-bold text-white">Cure<span className="text-accent">Basket</span></Link>
          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-bold">Admin</span>
        </div>

        <nav className="grow p-4 space-y-1 overflow-y-auto no-scrollbar overscroll-y-contain">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-gray-900 shadow-md'
                    : 'text-teal-50 hover:bg-white/10 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-accent hover:bg-white/10 transition-colors"
            onClick={handleLogout}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grow ml-64 flex flex-col min-h-screen">
        {/* Sticky Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {menuItems.find((item) =>
                location.pathname === item.path ||
                (item.path !== '/admin' && location.pathname.startsWith(item.path))
              )?.name || 'Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-0 focus:border-gray-300 w-64"
              />
              <button
                onClick={handleSearch}
                className="w-4 h-4 text-gray-400 absolute left-3 top-3 hover:text-primary transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Order Notifications & Chat Notifications */}
            <OrderNotificationBell />
            {can('chat', 'read') && <ChatNotificationBell />}

            {/* User Profile */}
            <div className="relative">
              <div
                className="flex items-center gap-3 border-l pl-6 border-gray-200 cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {initials}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{roleLabel}</p>
                </div>
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-30">
                  <Link
                    to="/admin/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 grow">
          <Outlet />
        </main>
      </div>
    </div>
    </AdminChatSocketProvider>
  );
}

export default AdminLayout;
