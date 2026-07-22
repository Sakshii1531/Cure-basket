import React, { useState, useEffect } from 'react';
import productImg from '../assets/product.png';

const ImageWithFallback = ({
  src,
  alt,
  className = '',
  fallbackSrc = productImg,
  loading = 'lazy',
  ...props
}) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  // Reset status if src changes
  useEffect(() => {
    if (!src || src === 'no-photo.jpg') {
      setStatus('error');
    } else {
      setStatus('loading');
    }
  }, [src]);

  const handleLoad = () => {
    setStatus('loaded');
  };

  const handleError = () => {
    setStatus('error');
  };

  const currentSrc = status === 'error' || !src || src === 'no-photo.jpg' ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-gray-50 ${className}`}>
      {/* Shimmer loading skeleton */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center animate-pulse z-10">
          <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={currentSrc}
        alt={alt || ''}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ease-in-out ${
          status === 'loaded' ? 'opacity-100' : status === 'loading' ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
