import React from 'react';
import { BrandingLogo } from './BrandingLogo';
import { useAuth } from '../context/AuthContext';
import { NavView } from './Sidebar';
import {
  Search,
  Menu,
  Sparkles,
  ShieldCheck,
  BookmarkCheck,
} from 'lucide-react';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  onNavigate: (view: NavView) => void;
  savedCount: number;
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  onNavigate,
  savedCount,
  onSearchClick,
}) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="h-16 bg-[#FFFDF8] border-b border-[#E4DCD3] px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Menu Toggle & Brand (on mobile) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-[#756B64] hover:bg-[#F8F3EA] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="md:hidden">
          <BrandingLogo size="sm" showTagline={false} />
        </div>
      </div>

      {/* Right controls: Quick Search, Pipeline Pill, User profile status */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onSearchClick}
          className="flex items-center gap-2 text-xs text-[#756B64] bg-[#F8F3EA] hover:bg-[#E8D8C3]/30 border border-[#E4DCD3] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#8C8060]" />
          <span className="hidden sm:inline">Search opportunities &amp; filters...</span>
          <span className="sm:hidden">Search</span>
        </button>

        {isAuthenticated && (
          <button
            type="button"
            onClick={() => onNavigate('tracked')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C98268] bg-[#F5EAE5] hover:bg-[#E8D8C3]/40 border border-[#E8D8C3] rounded-xl transition-colors cursor-pointer"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-[#C98268]" />
            <span className="hidden sm:inline">Tracked</span>
            <span className="w-4 h-4 rounded-full bg-[#C98268] text-white text-[10px] flex items-center justify-center font-bold">
              {savedCount}
            </span>
          </button>
        )}

        {user && (
          <div
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 pl-2 border-l border-[#E4DCD3] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#C98268] text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user.full_name.charAt(0)}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <p className="font-bold text-[#332C28] leading-tight">
                {user.full_name}
              </p>
              <p className="text-[10px] text-[#756B64] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#8C8060]" />
                Verified Candidate
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
