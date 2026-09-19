import React, { useState } from 'react';
import { UserProfile } from '../types';
import { analyzeLinkedIn } from '../services/linkedInReviewEngine';
import { useAuth } from '../context/AuthContext';
import {
  Linkedin,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  FileText,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

interface LinkedInReviewViewProps {
  profile: UserProfile;
  onNavigateToCV?: () => void;
}

export const LinkedInReviewView: React.FC<LinkedInReviewViewProps> = ({
  profile,
  onNavigateToCV,
}) => {
  const { linkedInReports, saveLinkedInReport } = useAuth();

  const [urlInput, setUrlInput] = useState('https://linkedin.com/in/sarahjoe-dev');
  const [headlineInput, setHeadlineInput] = useState(
    `Frontend Engineer | React, TypeScript & Web Performance | Open to Opportunities`
  );
  const [aboutInput, setAboutInput] = useState(
    `Frontend software developer with 2+ years building user-centric web applications, responsive dashboards, and interactive interfaces. Passionate about accessible UI and social impact software.`
  );
  const [experienceInput, setExperienceInput] = useState(
    'Frontend Developer at tech cohort; built and shipped React and Tailwind customer dashboards, improving core web vitals by 35%.'
  );

  const [analyzing, setAnalyzing] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'linkedin' | 'cv'>('linkedin');

  const [currentReport, setCurrentReport] = useState(() => {
    if (linkedInReports && linkedInReports.length > 0) {
      return linkedInReports[0];
    }
    return analyzeLinkedIn(
      'https://linkedin.com/in/sarahjoe-dev',
      profile,
      `Frontend Engineer | React, TypeScript & Web Performance | Open to Opportunities`,
      `Frontend software developer with 2+ years building user-centric web applications.`,
      `Frontend Developer; built and shipped React customer dashboards.`
    );
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');

    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlError('Please enter a LinkedIn profile link (e.g. linkedin.com/in/your-handle).');
      return;
    }

    setAnalyzing(true);
    setTimeout(() => {
      const report = analyzeLinkedIn(
        trimmed,
        profile,
        headlineInput,
        aboutInput,
        experienceInput
      );
      report.isUnlocked = true;
      setCurrentReport(report);
      saveLinkedInReport(report);
      setAnalyzing(false);
    }, 450);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]">
              <Sparkles className="w-3.5 h-3.5 text-[#C98268]" />
              <span>PRO Feature</span>
            </span>

            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-[#F8F3EA] text-[#756B64] border-[#E4DCD3]">
              Real-Time Profile &amp; CV Optimization
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#332C28] tracking-tight">
            LinkedIn Profile &amp; CV Optimizer
          </h1>
          <p className="text-xs text-[#756B64] mt-1 max-w-2xl">
            Input your public LinkedIn profile to immediately receive optimized headlines, recruiter-tested About section copy, and a synchronized ATS-ready CV.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#F8F3EA] p-1 rounded-xl border border-[#E4DCD3] self-stretch md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('linkedin')}
            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'linkedin'
                ? 'bg-[#C98268] text-white shadow-xs'
                : 'text-[#756B64] hover:text-[#332C28]'
            }`}
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn Optimization</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cv')}
            className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'cv'
                ? 'bg-[#C98268] text-white shadow-xs'
                : 'text-[#756B64] hover:text-[#332C28]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Synchronized CV</span>
          </button>
        </div>
      </div>

      {/* Input Form & Transparency Notice */}
      <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="p-3.5 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl flex items-start gap-2.5 text-xs text-[#756B64]">
          <HelpCircle className="w-4 h-4 text-[#8C8060] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#332C28]">Privacy Notice: </strong>
            OppMatch analyzes profile positioning through your public LinkedIn link and provided text to generate recruiter-aligned keywords and CV bullet points.
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#332C28] mb-1">
              Public LinkedIn Profile URL or Username
            </label>
            <div className="relative">
              <Linkedin className="w-4 h-4 text-[#8C8060] absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://linkedin.com/in/your-name"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FFFDF8] text-[#332C28] border border-[#E4DCD3] rounded-xl focus:outline-hidden focus:border-[#C98268]"
              />
            </div>
            {urlError && (
              <p className="text-[11px] text-[#C98268] mt-1 font-medium">
                {urlError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#332C28] mb-1">
                Current Headline (Optional - or paste from profile)
              </label>
              <textarea
                rows={2}
                value={headlineInput}
                onChange={(e) => setHeadlineInput(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#FFFDF8] text-[#332C28] border border-[#E4DCD3] rounded-xl focus:outline-hidden focus:border-[#C98268]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C28] mb-1">
                Current About Section (First few sentences)
              </label>
              <textarea
                rows={2}
                value={aboutInput}
                onChange={(e) => setAboutInput(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#FFFDF8] text-[#332C28] border border-[#E4DCD3] rounded-xl focus:outline-hidden focus:border-[#C98268]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className="px-5 py-2.5 bg-[#C98268] hover:bg-[#B67158] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{analyzing ? 'Analyzing in Real Time...' : 'Optimize LinkedIn Profile & CV'}</span>
          </button>
        </form>
      </div>

      {/* Tab 1: LinkedIn Optimization Results */}
      {activeTab === 'linkedin' && currentReport && (
        <div className="space-y-6">
          {/* Top Score & Findings */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Strength Score */}
            <div className="md:col-span-4 bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C8060]">
                LinkedIn Profile Strength
              </span>
              <div className="text-4xl font-black text-[#332C28] py-2">
                {currentReport.strengthScore}
                <span className="text-sm font-normal text-[#756B64]">/100</span>
              </div>
              <p className="text-xs text-[#756B64]">
                Optimized keyword density and role clarity will increase recruiter search impressions.
              </p>
            </div>

            {/* Headline Findings */}
            <div className="md:col-span-8 bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E4DCD3] pb-3">
                <h3 className="text-sm font-bold text-[#332C28] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C98268]" />
                  <span>Key Optimization Signals</span>
                </h3>
                <span className="text-xs text-[#8C8060]">
                  {currentReport.analysisDate}
                </span>
              </div>

              <div className="space-y-2">
                {currentReport.headlineIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl text-xs text-[#332C28] flex items-start gap-2"
                  >
                    <span className="text-[#C98268] font-bold">•</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Headline Rewrites */}
          <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#332C28]">
              High-Impact Headline Rewrites (Copy to LinkedIn)
            </h3>
            <p className="text-xs text-[#756B64]">
              These headlines balance keyword discoverability with professional clarity.
            </p>

            <div className="space-y-3">
              {currentReport.headlineAnalysis.suggestedRewrites.map((rewrite, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8C8060]">
                      Option {idx + 1}
                    </span>
                    <p className="font-semibold text-[#332C28] leading-relaxed">
                      {rewrite}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(rewrite, `hl-${idx}`)}
                    className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#E8D8C3]/30 border border-[#E4DCD3] text-[#332C28] font-semibold text-xs rounded-lg flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedKey === `hl-${idx}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C98268]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#756B64]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* About Section Rewrite */}
          <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#332C28]">
                Recruiter-Ready About Section
              </h3>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    currentReport.aboutSectionAnalysis.suggestedRewrite,
                    'about-full'
                  )
                }
                className="px-3 py-1.5 bg-[#C98268] hover:bg-[#B67158] text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedKey === 'about-full' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied Section</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white" />
                    <span>Copy Full About Text</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl text-xs text-[#332C28] whitespace-pre-wrap font-sans leading-relaxed">
              {currentReport.aboutSectionAnalysis.suggestedRewrite}
            </pre>
          </div>

          {/* Experience Bullets & Metric Formulations */}
          <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#332C28]">
              Experience Bullets: Passive to Metric-Driven
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentReport.experienceFeedback.bulletImprovements.map((b, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl space-y-2 text-xs"
                >
                  <div className="text-[#756B64] line-through text-[11px]">
                    {b.original}
                  </div>
                  <div className="font-semibold text-[#332C28] leading-relaxed">
                    {b.improved}
                  </div>
                  <div className="pt-1 text-[10px] text-[#8C8060] font-mono">
                    Formula: {b.formula}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Synchronized CV Generator */}
      {activeTab === 'cv' && currentReport && (
        <div className="space-y-6">
          <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E4DCD3] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C8060]">
                    Synchronized ATS Score
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]">
                    88 / 100 ATS Match
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#332C28] mt-1">
                  ATS-Optimized Resume derived from {urlInput || 'LinkedIn'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `${profile.full_name || 'Sarah Joe'}\n${profile.email || 'candidate@oppmatch.app'}\n\nProfessional Summary:\n${currentReport.aboutSectionAnalysis.suggestedRewrite}\n\nKey Achievements:\n${currentReport.experienceFeedback.bulletImprovements.map((b) => '• ' + b.improved).join('\n')}`,
                      'cv-plain'
                    )
                  }
                  className="px-3.5 py-2 bg-[#FFFDF8] hover:bg-[#F8F3EA] border border-[#E4DCD3] text-[#332C28] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKey === 'cv-plain' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C98268]" />
                      <span>Copied Plain Text</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#756B64]" />
                      <span>Copy Formatted CV</span>
                    </>
                  )}
                </button>

                {onNavigateToCV && (
                  <button
                    type="button"
                    onClick={onNavigateToCV}
                    className="px-3.5 py-2 bg-[#C98268] hover:bg-[#B67158] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open Full CV Review Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Generated CV Preview Card */}
            <div className="p-6 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl space-y-5">
              {/* Header Info */}
              <div className="border-b border-[#E4DCD3] pb-4">
                <h2 className="text-xl font-black text-[#332C28]">
                  {profile.full_name || 'Sarah Joe'}
                </h2>
                <p className="text-xs text-[#756B64] mt-0.5">
                  {profile.location || 'Lagos, Nigeria'} • {profile.email || 'candidate@oppmatch.app'} • {urlInput}
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-[#8C8060] tracking-wider">
                  Professional Summary
                </h4>
                <p className="text-xs text-[#332C28] leading-relaxed">
                  Results-oriented frontend software developer with hands-on experience engineering responsive web components, state management workflows, and accessible interfaces using React, TypeScript, and modern web standards.
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-[#8C8060] tracking-wider">
                  Technical Core Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(profile.skills?.length ? profile.skills : ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST APIs', 'Git', 'Accessibility']).map(
                    (s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-[#FFFDF8] border border-[#E4DCD3] text-[#332C28] font-medium"
                      >
                        {s}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-[#8C8060] tracking-wider">
                  Target Experience &amp; Project Bullets
                </h4>
                <div className="space-y-2">
                  {currentReport.experienceFeedback.bulletImprovements.map((b, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg text-xs text-[#332C28] flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C98268] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{b.improved}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
