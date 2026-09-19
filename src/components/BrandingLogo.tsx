import React from 'react';

interface BrandingLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  lightMode?: boolean;
}

export const BrandingLogo: React.FC<BrandingLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  lightMode = false,
}) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2.5">
        {/* OppMatch Access & Pathway Vector Mark */}
        <div
          className={`${iconSizes[size]} rounded-lg bg-[#C98268] text-white flex items-center justify-center shadow-xs shrink-0 relative overflow-hidden`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4/5 h-4/5"
          >
            {/* Pathway / Bridge of nodes representing access */}
            <circle cx="5" cy="18" r="2" />
            <circle cx="12" cy="10" r="2" />
            <circle cx="19" cy="6" r="2" />
            <path d="M5 16l7-6 7-4" />
            <path d="M12 12v6" strokeDasharray="1.5 1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </div>

        <div className="flex flex-col">
          <span
            className={`${textSizes[size]} tracking-tight leading-none ${
              lightMode ? 'text-white' : 'text-[#332C28]'
            }`}
          >
            Opp<span className="text-[#C98268]">Match</span>
          </span>
        </div>
      </div>

      {showTagline && (
        <p
          className={`mt-1.5 text-xs font-medium tracking-wide ${
            lightMode ? 'text-[#E8D8C3]' : 'text-[#756B64]'
          }`}
        >
          The problem isn&apos;t ambition. It&apos;s access.
        </p>
      )}
    </div>
  );
};
