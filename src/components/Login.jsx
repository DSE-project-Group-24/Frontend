// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import backgroundImage from '../../public/background.jpg'; // local file

// const Login = ({ role, setIsAuthenticated }) => {
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   // Hardcoded passwords
//   const passwords = {
//     nurse: 'nurse_pass',
//     doctor: 'doctor_pass',
//     admin: 'admin_pass',
//     government: 'gov_pass',
//   };

//   const handleLogin = () => {
//     if (password === passwords[role]) {
//       setIsAuthenticated(true);
//       navigate(`/${role}/dashboard`);
//     } else {
//       alert('Invalid password');
//     }
//   };

//   return (
//     <div
//       className="flex flex-col items-center justify-center min-h-screen"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//       }}
//     >
//       <div className="bg-black/50 w-full min-h-screen flex flex-col items-center justify-center">
//         <h1 className="text-2xl font-bold text-white mb-6">
//           Login as {role.charAt(0).toUpperCase() + role.slice(1)}
//         </h1>
//         <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
//           <input 
//             type="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             placeholder="Enter password" 
//             className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//           />
//           <button 
//             onClick={handleLogin} 
//             className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../public/background.jpg'; // local file

const Login = ({ role, setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded passwords
  const passwords = {
    nurse: 'nurse_pass',
    doctor: 'doctor_pass',
    admin: 'admin_pass',
    government: 'gov_pass',
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password === passwords[role]) {
      setIsAuthenticated(true);
      navigate(`/${role}/dashboard`);
    } else {
      setError('Invalid password. Please try again.');
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      nurse: 'Nurse',
      doctor: 'Doctor',
      admin: 'Hospital Administrator',
      government: 'Government Official'
    };
    return roleNames[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleIcon = (role) => {
    const icons = {
      nurse: '🩺',
      doctor: '👨‍⚕️',
      admin: '🏥',
      government: '🏛️'
    };
    return icons[role] || '👤';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-2xl">{getRoleIcon(role)}</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-blue-100 text-sm">
            Sign in as {getRoleDisplayName(role)}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading || !password.trim()}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Back to Role Selection */}
            <button
              onClick={() => navigate('/')}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              ← Back to role selection
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-blue-100 text-xs">
            Secure healthcare management system
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;