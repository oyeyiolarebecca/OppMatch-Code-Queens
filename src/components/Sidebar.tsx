import React from 'react';
import { BrandingLogo } from './BrandingLogo';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Users,
  FileCheck2,
  Linkedin,
  User,
  LogOut,
  Sparkles,
  BookmarkCheck,
} from 'lucide-react';

export type NavView =
  | 'dashboard'
  | 'opportunities'
  | 'communities'
  | 'cv-review'
  | 'linkedin-review'
  | 'profile'
  | 'tracked';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  savedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  savedCount = 0,
}) => {
  const { user, isDemoMode, logout } = useAuth();

  const NAV_ITEMS = [
    {
      id: 'dashboard' as NavView,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'opportunities' as NavView,
      label: 'Opportunities',
      icon: Compass,
      badge: '16 Available',
    },
    {
      id: 'tracked' as NavView,
      label: 'My Pipeline',
      icon: BookmarkCheck,
      badge: savedCount > 0 ? `${savedCount}` : undefined,
    },
    {
      id: 'communities' as NavView,
      label: 'Communities',
      icon: Users,
      badge: '12 Networks',
    },
    {
      id: 'cv-review' as NavView,
      label: 'CV Review',
      icon: FileCheck2,
      badge: 'PRO',
      accentBadge: true,
    },
    {
      id: 'linkedin-review' as NavView,
      label: 'LinkedIn Review',
      icon: Linkedin,
      badge: 'PRO',
      accentBadge: true,
    },
    {
      id: 'profile' as NavView,
      label: 'My Profile',
      icon: User,
      badge: undefined,
    },
  ];

  return (
    <aside className="w-64 bg-[#FFFDF8] border-r border-[#E4DCD3] h-screen sticky top-0 flex flex-col justify-between shrink-0 select-none z-30">
      {/* Top Brand Header */}
      <div>
        <div className="p-5 border-b border-[#E4DCD3] flex flex-col gap-1">
          <BrandingLogo size="md" showTagline={false} />
        </div>

        {/* Navigation Rows */}
        <div className="p-3 space-y-1 mt-2">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#8C8060] uppercase tracking-wider">
            Main Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#C98268] text-white shadow-xs'
                    : 'text-[#756B64] hover:text-[#332C28] hover:bg-[#F8F3EA]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-[#8C8060]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.accentBadge
                        ? 'bg-[#E8D8C3] text-[#332C28]'
                        : 'bg-[#F8F3EA] text-[#756B64] border border-[#E4DCD3]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Logout Box */}
      <div className="p-4 border-t border-[#E4DCD3] bg-[#F8F3EA]/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#C98268] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {user?.full_name
              ? user.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
              : 'OP'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#332C28] truncate">
              {user?.full_name || 'Guest User'}
            </p>
            <p className="text-[11px] text-[#756B64] truncate">
              {user?.career_level ? user.career_level.replace('_', ' ') : 'Candidate'} • {user?.location || 'Lagos, Nigeria'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full py-2 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-[#756B64] hover:text-[#C98268] hover:bg-[#FFFDF8] border border-[#E4DCD3] rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
