import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { t } from '../utils/translations';
import LanguageSwitcher from '../components/LanguageSwitcher';

const DoctorNav = ({ setIsAuthenticated, setRole }) => {
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

  // Get doctor email from localStorage or token
  const getDoctorEmail = () => {
    // First try to get from localStorage directly
    const userEmail = localStorage.getItem("user_email");
    if (userEmail && userEmail !== "null" && userEmail !== "undefined") {
      return userEmail;
    }

    // Try to get from JWT token
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email || payload.username || payload.sub;
        if (email && email.includes('@')) {
          return email;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Try other possible localStorage keys
    const doctorData = localStorage.getItem("doctor_data");
    if (doctorData) {
      try {
        const parsed = JSON.parse(doctorData);
        if (parsed.email) {
          return parsed.email;
        }
      } catch (error) {
        console.error("Error parsing doctor data:", error);
      }
    }

    // Fallback
    return localStorage.getItem("username");
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
      path: '/doctor/dashboard',
      label: t('dashboard'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
      ),
    },
    {
      path: '/doctor/view-patient',
      label: t('viewPatientData'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 1118.364 4.56M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      path: '/doctor/predictions',
      label: t('getPrediction')  ,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav ref={mobileMenuRef} className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white sticky top-0 z-50 shadow-lg">
      
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Compact */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4M8 12h8" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold text-white">{t('roadAccidentCareSystem')}</h1>
              <p className="text-xs text-blue-200">{t('doctorPortal')}</p>
            </div>
          </div>

          {/* Desktop Nav - Compact */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                    isActiveRoute(item.path)
                      ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span className="hidden xl:inline text-xs">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Info + Language + Logout - Compact */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                </div>
                <div className="text-xs hidden xl:block">
                  <p className="font-medium text-white truncate max-w-32">{getDoctorEmail()}</p>
                  <p className="text-blue-200">{t('online')}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none transition-all duration-200 flex items-center space-x-1 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden xl:inline text-sm">{t('logout')}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="bg-white/20 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/30 focus:outline-none transition-all duration-200 shadow-sm cursor-pointer"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
                style={{ touchAction: 'manipulation', minHeight: '40px', minWidth: '40px' }}
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav - Compact */}
      <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} relative z-50`}>
        <div className="border-t border-blue-800 bg-gradient-to-b from-slate-800 to-slate-900 shadow-inner">
          <div className="px-3 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block w-full px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-white/20 text-white shadow-sm border border-white/10'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white hover:border-white/5 border border-transparent'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            ))}

            {/* Mobile User Info & Logout - Compact */}
            <div className="border-t border-blue-700/50 mt-3 pt-3">
              <div className="flex items-center px-3 py-2 bg-white/5 rounded-md mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-3 h-3 bg-green-200 rounded-full animate-pulse"></div>
                </div>
                <div className="ml-2 text-xs">
                  <p className="font-medium text-white truncate">{getDoctorEmail()}</p>
                  <p className="text-green-300">{t('currentlyOnline')}</p>
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
                className="w-full px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm cursor-pointer text-sm"
                style={{ touchAction: 'manipulation' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default DoctorNav;
