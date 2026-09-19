import React, { useState } from 'react';

interface BrandLogoIconProps {
  name: string;
  logoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogoIcon: React.FC<BrandLogoIconProps> = ({
  name,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const normalized = name.toLowerCase();

  // Known official SVG / distinct brand marks
  if (normalized.includes('wetech')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-800 text-white font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="Wetech"
      >
        <span className="tracking-tighter">WT</span>
      </div>
    );
  }

  if (normalized.includes('she code africa')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 text-white font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="She Code Africa"
      >
        <span className="tracking-tighter">SCA</span>
      </div>
    );
  }

  if (normalized.includes('nacos')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="NACOS National"
      >
        <span className="tracking-tighter">NC</span>
      </div>
    );
  }

  if (normalized.includes('nithub')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-amber-700 text-amber-300 font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="NITHUB (University of Lagos)"
      >
        <span className="tracking-tighter">NIT</span>
      </div>
    );
  }

  if (normalized.includes('techcabal')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-black text-rose-500 border border-slate-800 font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="TechCabal"
      >
        <span className="tracking-tight text-white font-extrabold">TC</span>
      </div>
    );
  }

  if (normalized.includes('google') || normalized.includes('gdg')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-white border border-slate-200 text-slate-800 font-bold flex items-center justify-center shadow-xs shrink-0 select-none p-1.5 ${className}`}
        title="Google / GDG"
      >
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.13 0-5.78-2.11-6.73-4.96H1.23v3.13C3.26 21.36 7.36 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.63H1.23C.44 8.24 0 10.06 0 12s.44 3.76 1.23 5.37l4.04-3.13z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.23 6.63l4.04 3.13c.95-2.85 3.6-4.96 6.73-4.96z"
          />
        </svg>
      </div>
    );
  }

  if (normalized.includes('cowrywise')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="Cowrywise"
      >
        <span className="tracking-tighter">CW</span>
      </div>
    );
  }

  if (normalized.includes('flutterwave')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="Flutterwave"
      >
        <span className="tracking-tighter">FLW</span>
      </div>
    );
  }

  if (normalized.includes('nexascale')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700 text-white font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="Nexascale"
      >
        <span className="tracking-tighter font-extrabold">NS</span>
      </div>
    );
  }

  if (normalized.includes('datafest')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-600 text-amber-300 font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="DataFest Africa"
      >
        <span className="tracking-tighter font-extrabold">DFA</span>
      </div>
    );
  }

  if (normalized.includes('women techmakers') || normalized.includes('wtm')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-teal-700 text-amber-300 font-black flex items-center justify-center shadow-xs shrink-0 select-none border border-teal-600 ${className}`}
        title="Women Techmakers"
      >
        <span className="tracking-tighter font-extrabold">WTM</span>
      </div>
    );
  }

  if (normalized.includes('mtn')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-amber-400 text-slate-900 border border-amber-500/50 font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="MTN"
      >
        <span className="tracking-tighter font-extrabold">MTN</span>
      </div>
    );
  }

  if (normalized.includes('alx')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-slate-950 text-red-500 border border-slate-800 font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="ALX Africa"
      >
        <span className="tracking-tighter">ALX</span>
      </div>
    );
  }

  if (normalized.includes('mastercard')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-red-600 text-amber-300 font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="Mastercard Foundation"
      >
        <span className="tracking-tighter">MCF</span>
      </div>
    );
  }

  if (normalized.includes('ingressive')) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center shadow-xs shrink-0 select-none ${className}`}
        title="Ingressive For Good"
      >
        <span className="tracking-tighter">I4G</span>
      </div>
    );
  }

  // Attempt real logo image if provided and not errored
  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} rounded-xl object-contain bg-white border border-slate-100 p-1 shrink-0 ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Monogram fallback
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 select-none ${className}`}
      title={name}
    >
      <span>{initials || 'OP'}</span>
    </div>
  );
};
