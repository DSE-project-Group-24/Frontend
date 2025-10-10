import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, FileText, LogOut, Menu, X, ChevronDown, Bell, Settings, User, BookOpen, AlertTriangle } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { t } from '../utils/translations';

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
      label: t('hospitals'),
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/government_personnel/prediction',
      label: t('analytics'),
      icon: <TrendingUp size={20} />,
    },
    {
      path: '/government_personnel/reports',
      label: t('reports'),
      icon: <FileText size={20} />,
    },
    {
      path: '/government_personnel/recent-accidents',
      label: t('recentAccidents'),
      icon: <AlertTriangle size={20} />,
    },
    {
      path: '/government_personnel/guide',
      label: t('guide'),
      icon: <BookOpen size={20} />,
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
                <p className="text-xs text-gray-500 font-medium">{t('governmentPortal')}</p>
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
            {/* Language Switcher */}
            <LanguageSwitcher />
            
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
                  <p className="text-sm font-semibold text-gray-700">{t('governmentPortal')}</p>
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
                      <p className="text-sm font-semibold text-gray-900">{t('governmentPortal')}</p>
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
                  <p className="text-sm font-semibold text-gray-900">{t('governmentPortal')}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="px-4 py-2">
                  <LanguageSwitcher />
                </div>
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

// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { LayoutDashboard, TrendingUp, FileText, LogOut, Menu, X, ChevronDown, Bell, Settings, User } from 'lucide-react';

// const GovernmentNav = ({ setIsAuthenticated, setRole }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("role");
//     setIsAuthenticated(false);
//     setRole(null);
//     navigate('/');
//   };

//   const isActiveRoute = (path) => location.pathname === path;

//   const navItems = [
//     {
//       path: '/government_personnel/dashboard',
//       label: 'Hospitals',
//       icon: <LayoutDashboard size={20} />,
//     },
//     {
//       path: '/government_personnel/prediction',
//       label: 'Analytics',
//       icon: <TrendingUp size={20} />,
//     },
//     {
//       path: '/government_personnel/reports',
//       label: 'Reports',
//       icon: <FileText size={20} />,
//     },
//   ];

//   return (
//     <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo Section */}
//           <div className="flex items-center space-x-8">
//             <Link to="/government_personnel/dashboard" className="flex items-center space-x-3 group">
//               <div className="relative">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg">
//                   <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M12 2L2 7h20L12 2zM2 7v7c0 5 10 8 10 8s10-3 10-8V7H2z" />
//                   </svg>
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//               </div>
//               <div className="hidden sm:block">
//                 <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   MedRecord
//                 </h1>
//                 <p className="text-xs text-gray-500 font-medium">Government Portal</p>
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-1">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group ${
//                     isActiveRoute(item.path)
//                       ? 'text-blue-600 bg-blue-50'
//                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className={`transition-colors ${isActiveRoute(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
//                     {item.icon}
//                   </span>
//                   <span>{item.label}</span>
//                   {isActiveRoute(item.path) && (
//                     <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
//                   )}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Right Section - Desktop */}
//           <div className="hidden md:flex items-center space-x-3">
//             {/* Notifications */}
//             <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
//               <Bell size={20} />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>

//             {/* Settings */}
//             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
//               <Settings size={20} />
//             </button>

//             {/* Profile Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
//               >
//                 <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
//                   <User size={18} className="text-white" />
//                 </div>
//                 <div className="text-left hidden lg:block">
//                   <p className="text-sm font-semibold text-gray-700">Government</p>
//                   <p className="text-xs text-gray-500">Administrator</p>
//                 </div>
//                 <ChevronDown 
//                   size={16} 
//                   className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
//                 />
//               </button>

//               {/* Dropdown Menu */}
//               {isProfileOpen && (
//                 <>
//                   <div 
//                     className="fixed inset-0 z-10" 
//                     onClick={() => setIsProfileOpen(false)}
//                   ></div>
//                   <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <p className="text-sm font-semibold text-gray-900">Government Portal</p>
//                       <p className="text-xs text-gray-500 mt-1">gov.admin@medrecord.lk</p>
//                     </div>
                    
//                     <div className="py-2">
//                       <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
//                         <User size={16} className="text-gray-400" />
//                         <span>Profile Settings</span>
//                       </button>
//                       <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
//                         <Settings size={16} className="text-gray-400" />
//                         <span>Preferences</span>
//                       </button>
//                     </div>

//                     <div className="border-t border-gray-100 pt-2">
//                       <button
//                         onClick={handleLogout}
//                         className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 font-medium"
//                       >
//                         <LogOut size={16} />
//                         <span>Sign Out</span>
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
//             >
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden border-t border-gray-200 bg-white">
//           <div className="px-4 pt-2 pb-4 space-y-1">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
//                   isActiveRoute(item.path)
//                     ? 'bg-blue-50 text-blue-600'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 {item.icon}
//                 <span>{item.label}</span>
//               </Link>
//             ))}

//             {/* Mobile Profile Section */}
//             <div className="pt-4 mt-4 border-t border-gray-200">
//               <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
//                   <User size={20} className="text-white" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-gray-900">Government Portal</p>
//                   <p className="text-xs text-gray-500">Administrator</p>
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
//                   <Bell size={18} />
//                   <span>Notifications</span>
//                   <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                     3
//                   </span>
//                 </button>
//                 <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
//                   <Settings size={18} />
//                   <span>Settings</span>
//                 </button>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg font-medium shadow-sm"
//                 >
//                   <LogOut size={18} />
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default GovernmentNav;