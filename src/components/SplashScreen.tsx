import React, { useEffect, useState } from 'react';
import { BrandingLogo } from './BrandingLogo';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 1700,
}) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out slightly before full duration
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, Math.max(1000, durationMs - 350));

    const finishTimer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  return (
    <div
      id="splash-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white transition-opacity duration-300 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center px-6">
        <BrandingLogo size="xl" lightMode={true} />
        <p className="mt-4 text-sm md:text-base font-normal text-slate-300 tracking-wide max-w-sm">
          &ldquo;The problem isn&apos;t ambition. It&apos;s access.&rdquo;
        </p>
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          <span>Preparing your opportunity pathways</span>
        </div>
      </div>
    </div>
  );
};
