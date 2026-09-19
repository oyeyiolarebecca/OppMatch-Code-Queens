import React from 'react';
import { Community, Opportunity, UserProfile } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { CommunityCard } from '../components/CommunityCard';
import { PipelineStepper } from '../components/PipelineStepper';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Users,
  Sparkles,
  FileCheck2,
  Linkedin,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle,
} from 'lucide-react';
import { NavView } from '../components/Sidebar';

interface DashboardViewProps {
  profile: UserProfile;
  opportunities: Opportunity[];
  communities: Community[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onExploreCommunity: (comm: Community) => void;
  onNavigate: (view: NavView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  opportunities,
  communities,
  onSelectOpportunity,
  onExploreCommunity,
  onNavigate,
}) => {
  const { trackedApplications, isDemoMode } = useAuth();
  const trackedCount = Object.keys(trackedApplications).length;

  // Recommended opportunities: pick top 4 matching
  const topRecommended = opportunities.slice(0, 4);
  // Communities you may like: pick top 3
  const topCommunities = communities.slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Welcome card matching image.png styling */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Active Pathway Engine
              </span>
              {isDemoMode && (
                <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  Judge Demo Profile
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Welcome, {profile.full_name}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Evaluating opportunities for a <strong>{profile.country || 'Nigerian'} {profile.education || 'university'} student</strong> ({profile.school}) with skills in {profile.skills.slice(0, 3).join(', ')}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('opportunities')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Browse All Opportunities</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('cv-review')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-amber-300" />
              <span>AI CV Review</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Opportunities</p>
              <p className="text-sm font-extrabold text-slate-900">{opportunities.length} Available</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Avg Match Rate</p>
              <p className="text-sm font-extrabold text-slate-900">84% Compatible</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">African Communities</p>
              <p className="text-sm font-extrabold text-slate-900">{communities.length} Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">In My Pipeline</p>
              <p className="text-sm font-extrabold text-slate-900">{trackedCount} Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracked Application Pipeline Banner */}
      {trackedCount > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Your Opportunity Pipeline
              </h2>
              <p className="text-xs text-slate-500">
                Tracking your progress from initial discovery to submitted application.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tracked')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <PipelineStepper currentStage="preparing" readOnly={true} />
        </div>
      )}

      {/* Section 1: "Recommended for You" (Section 4) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Recommended for You
              </h2>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                AI Match Assessment
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reasoning over your skills ({profile.skills.slice(0, 3).join(', ')}), location ({profile.country}), and education ({profile.school || profile.education}).
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('opportunities')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({opportunities.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topRecommended.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              profile={profile}
              onSelect={onSelectOpportunity}
            />
          ))}
        </div>
      </section>

      {/* Section 2: "Communities You May Like" (Section 4) */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Communities You May Like
              </h2>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                Independent Networks
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Discover active African developer communities, campus chapters, and women-in-tech collectives even without an attached deadline.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('communities')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All ({communities.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCommunities.map((comm) => (
            <CommunityCard
              key={comm.id}
              community={comm}
              profile={profile}
              onExplore={onExploreCommunity}
            />
          ))}
        </div>
      </section>

      {/* Monetized Features Quick Jump */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        <div
          onClick={() => onNavigate('cv-review')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-xs space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Standalone Review Tool
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
            AI CV Review &amp; ATS Score
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Get an instant score out of 100, headline gaps, and unlock line-by-line rewrite suggestions cross-referenced with your target opportunities.
          </p>
          <div className="pt-2 text-xs font-bold text-amber-800 flex items-center gap-1">
            <span>Run CV Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('linkedin-review')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all cursor-pointer shadow-xs space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
              <Linkedin className="w-5 h-5 text-teal-700" />
            </div>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              Profile Optimizer
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
            LinkedIn Profile Review
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upgrade your headline and About section with keyword-rich formulas to boost recruiter search indexing for summer fellowships.
          </p>
          <div className="pt-2 text-xs font-bold text-teal-700 flex items-center gap-1">
            <span>Optimize Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>
    </div>
  );
};
