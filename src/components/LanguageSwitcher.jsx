import React, { useState } from 'react';
import { getCurrentLanguage, setLanguage, getAvailableLanguages } from '../utils/translations';

const LanguageSwitcher = ({ className = '' }) => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setLanguage(langCode);
    // Reload the page to apply the new language
    window.location.reload();
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