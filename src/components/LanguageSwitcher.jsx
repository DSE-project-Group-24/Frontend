import React, { useState } from 'react';
import { getCurrentLanguage, setLanguage, getAvailableLanguages } from '../utils/translations';

const LanguageSwitcher = ({ className = '' }) => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setLanguage(langCode);
    // Small delay to allow any transient UI/state updates to settle, then
    // refresh the exact current page (no redirect to root).
    const delayMs = 350; // milliseconds
    setTimeout(() => {
      // Reload the current URL so translations (from localStorage) are picked up
      // and the page re-renders in the selected language.
      window.location.reload();
    }, delayMs);
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