import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Update the state when language changes externally
  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
    setDropdownOpen(false);
    
    // Set direction for RTL languages (Arabic)
    if (newLanguage === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a343d] transition-colors"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <span className="w-5 flex justify-center">
          {language === "en" ? "🇺🇸" : "🇸🇦"}
        </span>
        <span className="hidden sm:inline">{language === "en" ? "English" : "العربية"}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg bg-white dark:bg-[#253341] ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-[#38444d] z-50 overflow-hidden animate-fade-in">
          <div className="py-1">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-2 ${
                language === "en"
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a343d]"
              }`}
              role="menuitem"
            >
              <span>🇺🇸</span>
              <span>English</span>
              {language === "en" && (
                <svg
                  className="ml-auto h-4 w-4 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => handleLanguageChange("ar")}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-2 ${
                language === "ar"
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a343d]"
              }`}
              role="menuitem"
            >
              <span>🇸🇦</span>
              <span>العربية</span>
              {language === "ar" && (
                <svg
                  className="ml-auto h-4 w-4 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}