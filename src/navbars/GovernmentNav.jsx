import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, FileText, LogOut, Menu, X, ChevronDown, Bell, Settings, User, BookOpen, AlertTriangle } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { t } from '../utils/translations';

const GovernmentNav = ({ setIsAuthenticated, setRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      // Use a slight delay to avoid immediate closing when menu button is clicked
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);
      }, 100);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  // Get government personnel email from localStorage or token
  const getGovernmentEmail = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.email || payload.username || "government@northprov.lk";
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    // Fallback - check if email is stored separately
    return localStorage.getItem("user_email") || "government@northprov.lk";
  };

  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");

    // Update authentication state
    setIsAuthenticated(false);
    setRole(null);

    // Navigate to home/login page
    navigate('/');
  };

  const isActiveRoute = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/government_personnel/dashboard',
      label: t('hospitals'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      path: '/government_personnel/prediction',
      label: t('analytics'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      path: '/government_personnel/reports',
      label: t('reports'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      path: '/government_personnel/recent-accidents',
      label: t('recentAccidents'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      path: '/government_personnel/guide',
      label: t('guide'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <nav ref={mobileMenuRef} className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden sticky top-0 z-50 shadow-2xl">
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-35 min-h-[80px]">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7h20L12 2zM2 7v7c0 5 10 8 10 8s10-3 10-8V7H2z" />
              </svg>
            </div>
            <div className="hidden xs:block sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-white">{t('roadAccidentCareSystem')}</h1>
              <p className="text-xs sm:text-sm text-blue-200">{t('governmentPortal')}</p>
            </div>
          </div>
  

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActiveRoute(item.path)
                      ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Info + Language + Logout */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-200 rounded-full animate-pulse"></div>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">{getGovernmentEmail()}</p>
                  <p className="text-blue-200 text-xs">{t('online')}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center space-x-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="bg-white/20 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 shadow-sm cursor-pointer"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              style={{ touchAction: 'manipulation', minHeight: '44px', minWidth: '44px' }}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} relative z-50`}>
        <div className="border-t border-blue-800 bg-gradient-to-b from-slate-800 to-slate-900 shadow-inner">
          <div className="px-4 pt-4 pb-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-white/20 text-white shadow-sm border border-white/10'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white hover:border-white/5 border border-transparent'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}

            {/* Mobile User Info & Logout */}
            <div className="border-t border-blue-700/50 mt-4 pt-4">
              <div className="flex items-center px-4 py-3 bg-white/5 rounded-lg mb-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                  <div className="w-4 h-4 bg-emerald-200 rounded-full animate-pulse"></div>
                </div>
                <div className="ml-3 text-sm">
                  <p className="font-medium text-white">{getGovernmentEmail()}</p>
                  <p className="text-xs text-emerald-300">{t('currentlyOnline')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                style={{ touchAction: 'manipulation' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GovernmentNav;