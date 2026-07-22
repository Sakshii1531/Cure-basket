import React from 'react';
import ReactCountryFlag from 'react-country-flag';

const CountryFlag = ({ countryCode, size = '20px', className = '' }) => {
  if (!countryCode || typeof countryCode !== 'string' || countryCode.trim() === '') {
    return (
      <span 
        className={`inline-flex items-center justify-center select-none ${className}`} 
        style={{ fontSize: size, width: size, height: size }}
        title="Unknown Country"
      >
        🌐
      </span>
    );
  }

  const cleanCode = countryCode.trim().toUpperCase();

  return (
    <ReactCountryFlag
      countryCode={cleanCode}
      svg
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
      className={className}
      aria-label={cleanCode}
    />
  );
};

export default CountryFlag;
