import React from 'react';
import { BrandingLogo } from '../components/BrandingLogo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileCheck2,
  Users,
  Award,
  BookOpen,
} from 'lucide-react';

interface LandingViewProps {
  onTryDemo: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onTryDemo,
  onOpenAuth,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F3EA] flex flex-col justify-between">
      {/* Top Navigation */}
      <nav className="border-b border-[#E4DCD3] bg-[#FFFDF8]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <BrandingLogo size="md" showTagline={false} />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTryDemo}
            className="px-4 py-2 text-xs font-bold text-[#C98268] bg-[#F5EAE5] hover:bg-[#E8D8C3]/50 border border-[#E8D8C3] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C98268]" />
            <span>Try Demo (Instant Access)</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 text-xs font-semibold text-[#756B64] hover:text-[#332C28] transition-colors cursor-pointer"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => onOpenAuth('signup')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#C98268] hover:bg-[#B67158] rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 max-w-5xl mx-auto">
        {/* Feature Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#C98268]" />
          <span>Universal Opportunity Pathways &amp; Intelligent Matching</span>
        </div>

        {/* Primary Headline & Required Tagline */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#332C28] tracking-tight max-w-3xl leading-tight">
          Turning Opportunity Access Into A Guided Pathway
        </h1>

        {/* Prominent Required Tagline */}
        <p className="text-lg md:text-2xl font-bold text-[#C98268] mt-4 tracking-tight">
          &ldquo;The problem isn&apos;t ambition. It&apos;s access.&rdquo;
        </p>

        {/* Context Problem & Solution Statement (em dash removed) */}
        <p className="mt-4 text-sm md:text-base text-[#756B64] max-w-2xl leading-relaxed">
          Opportunities exist for people, but opportunity access is uneven. Many early-career and career-transitioning people, including graduates, career switchers, self-taught builders, and professionals without strong insider networks, don&apos;t know what exists, whether they qualify, or what they need to do to become ready.
        </p>

        {/* Guided Flow: Discovery -> Matching -> Eligibility -> Preparation -> Action */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs font-bold text-[#332C28] bg-[#FFFDF8] border border-[#E4DCD3] p-2.5 rounded-2xl shadow-xs">
          <span className="px-3 py-1 rounded-lg bg-[#F8F3EA] text-[#332C28] border border-[#E4DCD3]">
            1. Discovery
          </span>
          <span className="text-[#8C8060]">→</span>
          <span className="px-3 py-1 rounded-lg bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]">
            2. Smart Matching
          </span>
          <span className="text-[#8C8060]">→</span>
          <span className="px-3 py-1 rounded-lg bg-[#F8F3EA] text-[#332C28] border border-[#E4DCD3]">
            3. Eligibility &amp; Gaps
          </span>
          <span className="text-[#8C8060]">→</span>
          <span className="px-3 py-1 rounded-lg bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]">
            4. Preparation
          </span>
          <span className="text-[#8C8060]">→</span>
          <span className="px-3 py-1 rounded-lg bg-[#F8F3EA] text-[#332C28] border border-[#E4DCD3]">
            5. Application
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onTryDemo}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#C98268] hover:bg-[#B67158] text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onOpenAuth('signup')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#FFFDF8] hover:bg-[#F8F3EA] text-[#332C28] font-bold text-sm rounded-xl border border-[#E4DCD3] transition-all cursor-pointer"
          >
            Create Free Profile
          </button>
        </div>

        {/* Feature Cards Grid (Single layout without nested cards) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl w-full">
          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E4DCD3] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F5EAE5] text-[#C98268] flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#332C28]">
              Centralized Discovery
            </h3>
            <p className="text-xs text-[#756B64] leading-relaxed">
              Hackathons, internships, fellowships, grants, and scholarships curated specifically for African and emerging tech talents.
            </p>
          </div>

          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E4DCD3] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F8F3EA] text-[#8C8060] flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#332C28]">
              Transparent Match &amp; Gaps
            </h3>
            <p className="text-xs text-[#756B64] leading-relaxed">
              No black-box rejection. OppMatch reasons across education, country, skills, and goals: showing why you qualify and exactly what gaps to fix.
            </p>
          </div>

          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E4DCD3] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F5EAE5] text-[#C98268] flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#332C28]">
              Application Assistant &amp; Reviews
            </h3>
            <p className="text-xs text-[#756B64] leading-relaxed">
              Generate actionable timelines, document checklists, and standalone CV &amp; LinkedIn profile optimization before hitting submit.
            </p>
          </div>
        </div>

        {/* Recognized African Communities Banner */}
        <div className="mt-16 w-full pt-8 border-t border-[#E4DCD3]">
          <div className="text-xs font-bold text-[#8C8060] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span>Connected With Real Recognizable African Tech Communities</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#756B64]">
            <span className="px-3 py-1 bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg">Wetech</span>
            <span className="px-3 py-1 bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg">She Code Africa</span>
            <span className="px-3 py-1 bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg">NACOS National</span>
            <span className="px-3 py-1 bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg">NITHUB (UNILAG)</span>
            <span className="px-3 py-1 bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg">Nexascale</span>
            <span className="px-3 py-1 bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg">DataFest Africa</span>
            <span className="px-3 py-1 bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg">Women Techmakers</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4DCD3] bg-[#FFFDF8] py-6 px-6 text-center text-xs text-[#756B64]">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto gap-2">
          <span>
            OppMatch © 2026: Turning opportunity access into a guided pathway for everyone.
          </span>
          <span className="text-[#C98268] font-semibold">
            &ldquo;The problem isn&apos;t ambition. It&apos;s access.&rdquo;
          </span>
        </div>
      </footer>
    </div>
  );
};
