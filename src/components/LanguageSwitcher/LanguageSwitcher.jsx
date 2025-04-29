import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const UkraineFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="7.5" fill="#0057B7" />
    <rect y="7.5" width="20" height="7.5" fill="#FFD700" />
  </svg>
);

const UKFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="15" fill="#012169" />
    <path d="M0 0L20 15M20 0L0 15" stroke="white" strokeWidth="3" />
    <path d="M0 0L20 15M20 0L0 15" stroke="#C8102E" strokeWidth="1.5" />
    <path d="M10 0V15M0 7.5H20" stroke="white" strokeWidth="5" />
    <path d="M10 0V15M0 7.5H20" stroke="#C8102E" strokeWidth="3" />
  </svg>
);

const SlovakFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="5" y="0" fill="white" />
    <rect width="20" height="5" y="5" fill="#0B4EA2" />
    <rect width="20" height="5" y="10" fill="#EE1C25" />

    <g transform="translate(2.5, 3) scale(0.4)">
      <path d="M10 0C6.5 0 4 2.5 4 6.5C4 11 10 14 10 14C10 14 16 11 16 6.5C16 2.5 13.5 0 10 0Z" fill="#EE1C25" stroke="white" strokeWidth="1.2"/>
      
      <path d="M9.5 3H10.5V6H12V7H10.5V10H9.5V7H8V6H9.5V3Z" fill="white"/>
      
      <path d="M6 11C7.2 10 8.2 10.3 9 11.5C9.8 10.3 10.8 10 12 11C11 9.5 9 9.5 9 9.5C9 9.5 7 9.5 6 11Z" fill="#0B4EA2"/>
    </g>
  </svg>
);

const JapanFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="15" fill="white" />
    <circle cx="10" cy="7.5" r="4.5" fill="#BC002D" />
  </svg>
);

const GermanyFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="5" fill="#000000" />
    <rect y="5" width="20" height="5" fill="#DD0000" />
    <rect y="10" width="20" height="5" fill="#FFCE00" />
  </svg>
);

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const languages = [
    { code: 'ua', name: 'Українська', Flag: UkraineFlag },
    { code: 'en', name: 'English', Flag: UKFlag },
    { code: 'sk', name: 'Slovenčina', Flag: SlovakFlag },
    { code: 'de', name: 'Deutsch', Flag: GermanyFlag },
    { code: 'ja', name: '日本語', Flag: JapanFlag },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    window.location.reload();
  };

  const [iconColor, setIconColor] = useState("#120C38");
  
  useEffect(() => {
    setIconColor(isOpen ? "white" : "#120C38");
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const MAX_MENU_HEIGHT = 5 * 40;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`top-buttons p-2 rounded-full border border-gray-300 ${isOpen ? 'bg-purple-600 border-none' : 'hover:bg-purple-600 border-none'} transition-all duration-300 flex items-center justify-center`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => {
          setIconColor("white");
        }}
        onMouseLeave={() => {
          if (!isOpen) {
            setIconColor("#120C38");
          }
        }}
      >
        <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg
            className="transition-colors duration-300"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 5H11M9 3V5C9 9.418 6.761 13 4 13"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 9C5 11.144 7.952 12.908 11.7 13M12 20L16 11L20 20M19.1 18H12.9"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div 
            className="py-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100" 
            role="menu" 
            aria-orientation="vertical"
            style={{ 
              maxHeight: `${MAX_MENU_HEIGHT}px`, 
              overflowY: languages.length > 5 ? 'auto' : 'visible' 
            }}
          >
            {languages.map((language) => {
              const Flag = language.Flag;
              return (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`${
                    currentLanguage.code === language.code ? 'bg-purple-100 text-[#120C38] font-bold' : 'text-gray-700'
                  } font-[Nunito] flex items-center w-full px-4 py-2 text-sm hover:bg-purple-50 transition-colors`}
                  role="menuitem"
                >
                  <span className="mr-2 flex items-center justify-center"><Flag /></span>
                  <span>{language.name}</span>
                  {currentLanguage.code === language.code && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;