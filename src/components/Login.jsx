import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import backgroundVideo from "../assets/backgroundq9.mov";
import API from "../utils/api";
import { t, getCurrentLanguage, setLanguage, getAvailableLanguages } from "../utils/translations";

// Login API function
const loginUser = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data; // { access_token, refresh_token, role }
  } catch (error) {
    throw error.response?.data || { detail: "Server error" };
  }
};

const Login = ({ setIsAuthenticated, setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(getCurrentLanguage());
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial language
    setLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    setLanguage(langCode);
    // Force re-render by setting a small delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Call backend
      const data = await loginUser(email, password);

      // Save tokens if you want persistence
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("name", data.name);

      if (data.role != "government_personnel") {
        localStorage.setItem("hospital_id", data.hospital_id);
        localStorage.setItem("hospital_name", data.hospital_name);
      }

      // Update state
      setIsAuthenticated(true);
      setRole(data.role);

      // Navigate to dashboard based on role
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      setError(err.detail || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 z-10"></div>

      <div className="max-w-md w-full space-y-8 relative z-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">{t('login')}</h2>
          <p className="text-white/90 text-sm">
            {t('roadAccidentCareSystem')}
          </p>
          
          {/* Language Selection */}
          <div className="mt-4 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 flex gap-2">
              {getAvailableLanguages().map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    selectedLanguage === lang.code
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/10">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                {t('email')}
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('email')}
                  className="w-full px-4 pr-10 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-200 bg-white/10 text-white placeholder-white/70"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                {t('password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('password')}
                  className="w-full px-4 pr-10 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-200 bg-white/10 text-white placeholder-white/70"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-30 overflow-visible">
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                    className={`h-8 w-8 flex items-center justify-center rounded text-white/80 focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors ${showPassword ? 'text-white' : 'text-white/70'}`}
                  >
                    {showPassword ? (
                      // eye-off icon
                      <svg className="h-5 w-5 block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.5-9-7s4-7 9-7c1.07 0 2.094.164 3.055.467M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      // eye icon
                      <svg className="h-5 w-5 block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('loading')}...
                </>
              ) : (
                t('login')
              )}
            </button>

            <div className="text-center">
              <Link
                to="/register"
                className="text-sm text-gray-750 hover:text-gray-900 transition-colors duration-200"
              >
                 {t('dontHaveAnAccountRegisterHere')}
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-blue-100 text-xs">
            {t('secureHealthcareManagementSystem')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
