import React, { useState, useEffect, useRef, useMemo } from 'react';
import CountryFlag from './CountryFlag';

export const COUNTRY_CODES = [
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'CA', flag: '🇨🇦', dial: '+1' },
  { code: 'IN', flag: '🇮🇳', dial: '+91' },
  { code: 'GB', flag: '🇬🇧', dial: '+44' },
  { code: 'AE', flag: '🇦🇪', dial: '+971' },
  { code: 'AU', flag: '🇦🇺', dial: '+61' },
  { code: 'SG', flag: '🇸🇬', dial: '+65' },
  { code: 'SA', flag: '🇸🇦', dial: '+966' },
  { code: 'BD', flag: '🇧🇩', dial: '+880' },
  { code: 'PK', flag: '🇵🇰', dial: '+92' },
  { code: 'LK', flag: '🇱🇰', dial: '+94' },
  { code: 'NP', flag: '🇳🇵', dial: '+977' },
  { code: 'MY', flag: '🇲🇾', dial: '+60' },
  { code: 'ID', flag: '🇮🇩', dial: '+62' },
  { code: 'ZA', flag: '🇿🇦', dial: '+27' },
  { code: 'NG', flag: '🇳🇬', dial: '+234' },
  { code: 'DE', flag: '🇩🇪', dial: '+49' },
  { code: 'FR', flag: '🇫🇷', dial: '+33' },
  { code: 'IT', flag: '🇮🇹', dial: '+39' },
  { code: 'ES', flag: '🇪🇸', dial: '+34' },
  { code: 'NL', flag: '🇳🇱', dial: '+31' },
  { code: 'BR', flag: '🇧🇷', dial: '+55' },
];

const CountrySelect = ({ value, onChange, placeholder = 'Select Country of Origin' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Map value to resolved country object
  const selectedCountry = useMemo(() => {
    if (!value) return null;
    if (typeof value === 'object') {
      return COUNTRY_CODES.find(c => c.code === value.countryCode) || {
        code: value.countryCode || '',
        name: value.countryName || '',
        dial: value.dialCode || '',
      };
    }
    // Handle legacy string value
    const upperVal = String(value).toUpperCase().trim();
    return COUNTRY_CODES.find(c => c.name.toUpperCase() === upperVal || c.code === upperVal) || {
      code: '',
      name: value,
      dial: '',
    };
  }, [value]);

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dial.toLowerCase().includes(q)
    );
  }, [search]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setActiveIndex((prev) => (prev + 1) % filteredCountries.length);
        e.preventDefault();
        break;
      case 'ArrowUp':
        setActiveIndex((prev) => (prev - 1 + filteredCountries.length) % filteredCountries.length);
        e.preventDefault();
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < filteredCountries.length) {
          handleSelect(filteredCountries[activeIndex]);
        } else if (filteredCountries.length > 0) {
          handleSelect(filteredCountries[0]);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const handleSelect = (c) => {
    onChange({
      countryCode: c.code,
      countryName: c.name,
      dialCode: c.dial,
    });
    setIsOpen(false);
    setSearch('');
    setActiveIndex(-1);
  };

  return (
    <div className="relative w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-left"
      >
        {selectedCountry ? (
          <div className="flex items-center gap-2 text-gray-900">
            <CountryFlag countryCode={selectedCountry.code} />
            <span className="font-semibold">{selectedCountry.name}</span>
            {selectedCountry.dial && <span className="text-gray-400">({selectedCountry.dial})</span>}
          </div>
        ) : (
          <span className="text-gray-400 font-medium">{placeholder}</span>
        )}
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100 shrink-0 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveIndex(-1);
              }}
              placeholder="Search by name, code or dial..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
            <svg className="w-3.5 h-3.5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50 max-h-[200px]" ref={listRef}>
            {filteredCountries.map((c, index) => {
              const isActive = index === activeIndex;
              const isSelected = selectedCountry?.code === c.code;
              return (
                <button
                  key={`${c.code}-${c.dial}`}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left text-xs transition-colors ${
                    isActive ? 'bg-gray-100' : isSelected ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50'
                  }`}
                >
                  <CountryFlag countryCode={c.code} />
                  <span className="font-semibold text-gray-700">{c.name}</span>
                  <span className="text-gray-400">({c.dial})</span>
                  {isSelected && (
                    <svg className="w-4 h-4 text-primary ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
            {filteredCountries.length === 0 && (
              <div className="px-4 py-4 text-center text-xs text-gray-400">No countries match.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
