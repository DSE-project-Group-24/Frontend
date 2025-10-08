
// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';

// const GovernmentNav = ({ setIsAuthenticated , setRole  }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleLogout = () => {
//     // Clear all authentication data from localStorage
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("role");
    
//     // Update authentication state
//     setIsAuthenticated(false);
//     setRole(null);
    
//     // Navigate to home/login page
//     navigate('/');
//   };

//   const isActiveRoute = (path) => location.pathname === path;

//   const navItems = [
//     {
//       path: '/government_personnel/dashboard',
//       label: 'Dashboard',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18" />
//         </svg>
//       ),
//     },
//     {
//       path: '/government_personnel/prediction',
//       label: 'Prediction',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V3a1 1 0 011-1h0a1 1 0 011 1v8m-1 4h0a4 4 0 104-4h-4v4z" />
//         </svg>
//       ),
//     },
//     {
//       path: '/government_personnel/reports',
//       label: 'Reports',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6h13v6M9 17V9a2 2 0 012-2h6a2 2 0 012 2v8m-7-4h.01" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <nav className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo/Brand */}
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 2L2 7h20L12 2zM2 7v7c0 5 10 8 10 8s10-3 10-8V7H2z" />
//               </svg>
//             </div>
//             <div className="hidden sm:block">
//               <h1 className="text-lg font-bold">MedRecord</h1>
//               <p className="text-xs text-green-100">Government Portal</p>
//             </div>
//           </div>

//           {/* Desktop Nav */}
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-2">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
//                     isActiveRoute(item.path)
//                       ? 'bg-white text-green-700 shadow-sm'
//                       : 'text-green-100 hover:bg-green-600 hover:text-white'
//                   }`}
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Desktop User Info + Logout */}
//           <div className="hidden md:block">
//             <div className="ml-4 flex items-center space-x-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                   </svg>
//                 </div>
//                 <div className="text-sm">
//                   <p className="font-medium">Government</p>
//                   <p className="text-green-100 text-xs">Online</p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-green-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="bg-green-600 inline-flex items-center justify-center p-2 rounded-md text-green-100 hover:text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
//             >
//               {!isMobileMenuOpen ? (
//                 <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               ) : (
//                 <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Nav */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden border-t border-green-600">
//           <div className="px-2 pt-2 pb-3 space-y-1 bg-green-800">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-3 ${
//                   isActiveRoute(item.path)
//                     ? 'bg-white text-green-700 shadow-sm'
//                     : 'text-green-100 hover:bg-green-600 hover:text-white'
//                 }`}
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 {item.icon}
//                 <span>{item.label}</span>
//               </Link>
//             ))}

//             {/* Mobile User Info & Logout */}
//             <div className="border-t border-green-600 mt-4 pt-4">
//               <div className="flex items-center px-4 py-2 space-x-3">
//                 <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
//                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                   </svg>
//                 </div>
//                 <div className="text-sm text-green-100">
//                   <p className="font-medium text-white">Government Portal</p>
//                   <p className="text-xs">Currently Online</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   setIsMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center space-x-3 mt-2 mx-2"
//                 style={{ width: 'calc(100% - 1rem)' }}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default GovernmentNav;


import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, FileText, LogOut, Menu, X, ChevronDown, Bell, Settings, User } from 'lucide-react';

const GovernmentNav = ({ setIsAuthenticated, setRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    navigate('/');
  };

  const isActiveRoute = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/government_personnel/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/government_personnel/prediction',
      label: 'Analytics',
      icon: <TrendingUp size={20} />,
    },
    {
      path: '/government_personnel/reports',
      label: 'Reports',
      icon: <FileText size={20} />,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <Link to="/government_personnel/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7h20L12 2zM2 7v7c0 5 10 8 10 8s10-3 10-8V7H2z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MedRecord
                </h1>
                <p className="text-xs text-gray-500 font-medium">Government Portal</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group ${
                    isActiveRoute(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className={`transition-colors ${isActiveRoute(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActiveRoute(item.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <Settings size={20} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <User size={18} className="text-white" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-gray-700">Government</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Government Portal</p>
                      <p className="text-xs text-gray-500 mt-1">gov.admin@medrecord.lk</p>
                    </div>
                    
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <User size={16} className="text-gray-400" />
                        <span>Profile Settings</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <Settings size={16} className="text-gray-400" />
                        <span>Preferences</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 font-medium"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActiveRoute(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Mobile Profile Section */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Government Portal</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>

              <div className="space-y-1">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Bell size={18} />
                  <span>Notifications</span>
                  <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg font-medium shadow-sm"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default GovernmentNav;