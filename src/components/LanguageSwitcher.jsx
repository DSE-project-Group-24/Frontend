import React, { useState } from 'react';
import { getCurrentLanguage, setLanguage, getAvailableLanguages } from '../utils/translations';

const LanguageSwitcher = ({ className = '' }) => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setLanguage(langCode);
    // Try a lightweight HEAD request to the current pathname. If the server
    // would return a 404 for this path (common on some static hosts without
    // SPA fallback rules), redirect to the app root instead to avoid a
    // deployment 404. If the HEAD check succeeds, do a normal reload so the
    // user stays on the same page.
    try {
      fetch(window.location.pathname, { method: 'HEAD' })
        .then((res) => {
          if (res && res.ok) {
            // server can serve this path - reload in-place
            window.location.reload();
          } else {
            // server would return 404 - navigate to root so index.html is served
            window.location.assign('/');
          }
        })
        .catch(() => {
          // any error (CORS, network) - fallback to root to be safe
          window.location.assign('/');
        });
    } catch (e) {
      // defensive fallback
      window.location.assign('/');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
      >
        {getAvailableLanguages().map((lang) => (
          <option 
            key={lang.code} 
            value={lang.code}
            className="bg-slate-800 text-white"
          >
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;