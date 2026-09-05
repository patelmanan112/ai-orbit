'use client';

import { useState } from 'react';

type CompanyLogoProps = {
  url: string | null;
  name: string;
  sizeClasses?: string;
  fallbackClasses?: string;
};

export function CompanyLogo({ url, name, sizeClasses = 'h-full w-full', fallbackClasses = 'text-xl font-bold text-white/50' }: CompanyLogoProps) {
  const [error, setError] = useState(false);

  if (!url || error) {
    return <span className={fallbackClasses}>{name.charAt(0).toUpperCase()}</span>;
  }

  return (
    <img 
      src={url} 
      alt={name} 
      className={`${sizeClasses} object-contain`}
      onError={() => setError(true)}
    />
  );
}
