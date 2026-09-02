import React from 'react';

/**
 * Universal BrandLogo component for Dhafi Komputer Inventory System.
 * SINGLE SOURCE OF TRUTH:
 * 1. If logoUrl / brand_logo_url is present (from Master Merek database), render <img src={logoUrl} />
 * 2. Fallback to stylized SVG / Wordmark / Badge if logoUrl is empty or not yet uploaded.
 */
export const BrandLogo = ({ name, code, logoUrl, className = '', size = 'md' }) => {
  const brandLower = (name || '').toLowerCase().trim();
  const url = logoUrl;

  // Size mapping
  const sizeClasses = {
    sm: 'w-6 h-6 text-[8px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    badge: 'w-10 h-7 text-xs'
  };

  // 1. Primary: Use saved Logo URL from Master Merek
  if (url && (url.startsWith('data:image') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'))) {
    return (
      <div className={`rounded-lg bg-slate-50 border border-slate-200/90 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs ${sizeClasses[size] || sizeClasses.md} ${className}`}>
        <img
          src={url}
          alt={name || 'Brand Logo'}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            // Fallback gracefully on broken image
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 2. Fallbacks based on official brand identities if logo_url is null
  if (brandLower.includes('asus')) {
    return (
      <div className={`rounded-lg bg-[#00539B] text-white flex items-center justify-center font-black tracking-tighter shadow-2xs select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
        ASUS
      </div>
    );
  }

  if (brandLower.includes('acer')) {
    return (
      <div className={`rounded-lg bg-[#83B81A] text-white flex items-center justify-center font-black tracking-tighter italic select-none shadow-2xs ${sizeClasses[size] || sizeClasses.md} ${className}`}>
        acer
      </div>
    );
  }

  if (brandLower.includes('apple')) {
    return (
      <div className={`rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-2xs select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
        
      </div>
    );
  }

  if (brandLower.includes('dell')) {
    return (
      <div className={`rounded-lg bg-[#0076CE] text-white flex items-center justify-center font-black tracking-tighter shadow-2xs select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
        DELL
      </div>
    );
  }

  if (brandLower.includes('hp')) {
    return (
      <div className={`rounded-lg bg-[#0096D6] text-white flex items-center justify-center font-black italic shadow-2xs select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
        hp
      </div>
    );
  }

  if (brandLower.includes('lenovo')) {
    return (
      <div className={`rounded-lg bg-[#E2231A] text-white flex items-center justify-center font-bold tracking-tight shadow-2xs select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
        Lenovo
      </div>
    );
  }

  if (brandLower.includes('msi')) {
    return (
      <div className={`rounded-lg bg-[#ED1C24] text-white flex items-center justify-center font-black shadow-2xs select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
        MSI
      </div>
    );
  }

  // 3. Generic Fallback
  return (
    <div className={`rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold uppercase select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {(code ? code.slice(-3) : (name ? name.slice(0, 2).toUpperCase() : 'B'))}
    </div>
  );
};

export default BrandLogo;
