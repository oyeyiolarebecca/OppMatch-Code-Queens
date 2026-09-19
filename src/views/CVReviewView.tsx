import React, { useState } from 'react';
import { Opportunity, UserProfile } from '../types';
import { analyzeCV } from '../services/cvReviewEngine';
import { useAuth } from '../context/AuthContext';
import { UpgradeModal } from '../components/UpgradeModal';
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';

interface CVReviewViewProps {
  profile: UserProfile;
  matchedOpportunities: Opportunity[];
  onSelectOpportunity?: (opp: Opportunity) => void;
}

export const CVReviewView: React.FC<CVReviewViewProps> = ({
  profile,
  matchedOpportunities,
}) => {
  const { cvReports, saveCVReport, unlockCVReport } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string>(
    cvReports[0]?.id || ''
  );
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const activeReport = cvReports.find((r) => r.id === activeReportId) || cvReports[0];

  const handleSimulatedUpload = (sampleName?: string) => {
    setAnalyzing(true);
    setTimeout(() => {
      const fileName = sampleName || selectedFile?.name || `${profile.full_name.replace(' ', '_')}_Resume_2026.pdf`;
      const sampleText = `
        ${profile.full_name || 'Sarah Joe'} : Frontend Developer & Tech Builder
        Skills: ${profile.skills?.join(', ') || 'React, TypeScript, Tailwind CSS, Next.js, Node.js, Git, REST APIs'}.
        Experience: Junior Frontend Engineer. Built accessible responsive interfaces, modular design system components, and real-time state synchronization.
        Projects: Developed interactive community directory, job match portal, and responsive web applications.
        Education: Software Development & Computer Science.
      `;
      const newReport = analyzeCV(fileName, sampleText, profile, matchedOpportunities);
      newReport.isUnlocked = true; // Unlocked so user gets full real-time review immediately
      saveCVReport(newReport);
      setActiveReportId(newReport.id);
      setAnalyzing(false);
    }, 450);
  };

  const handleUnlock = () => {
    if (activeReport) {
      unlockCVReport(activeReport.id);
      setIsUpgradeModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C98268]" />
            <span>PRO Feature</span>
          </div>
          <h1 className="text-2xl font-bold text-[#332C28] tracking-tight">
            CV &amp; Resume Optimization
          </h1>
          <p className="text-xs text-[#756B64] mt-1 max-w-2xl">
            Tied directly to your matched opportunities. Instant score and headline gaps, full ATS parsing, section rewrites, and missing keyword analysis.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSimulatedUpload('Sarah_Joe_Resume_2026.pdf')}
            disabled={analyzing}
            className="px-4 py-2 bg-[#C98268] hover:bg-[#B67158] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{analyzing ? 'Analyzing CV...' : 'Load Demo CV & Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Upload Box if no reports or user wants to upload a new one */}
      <div className="bg-[#FFFDF8] border-2 border-dashed border-[#E4DCD3] hover:border-[#C98268] rounded-2xl p-6 text-center transition-colors">
        <UploadCloud className="w-8 h-8 text-[#C98268] mx-auto mb-2" />
        <h3 className="text-sm font-bold text-[#332C28]">
          Upload your CV (PDF or DOCX)
        </h3>
        <p className="text-xs text-[#756B64] mt-1">
          Drag and drop or click to test. Zero data retained on servers.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <label className="px-4 py-2 bg-[#332C28] hover:bg-[#251f1c] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs">
            <span>Select Local Document</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                  handleSimulatedUpload(e.target.files[0].name);
                }
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => handleSimulatedUpload('Sarah_Joe_Resume_2026.pdf')}
            className="px-4 py-2 bg-[#F8F3EA] hover:bg-[#E8D8C3]/40 border border-[#E4DCD3] text-[#332C28] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Use Demo CV
          </button>
        </div>
      </div>

      {/* Report Display */}
      {activeReport ? (
        <div className="space-y-6">
          {/* Progress Stepper pattern */}
          <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-xl p-3 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C98268]" />
              <span className="text-xs font-bold text-[#332C28]">
                Active Report: {activeReport.fileName}
              </span>
              <span className="text-[10px] text-[#8C8060]">
                ({activeReport.uploadDate})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activeReport.isUnlocked ? (
                <span className="text-xs font-bold text-[#C98268] bg-[#F5EAE5] px-2.5 py-1 rounded-lg border border-[#E8D8C3] flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5" /> Full Report Unlocked
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="text-xs font-bold text-[#332C28] bg-[#F8F3EA] hover:bg-[#E8D8C3]/30 px-3 py-1 rounded-lg border border-[#E4DCD3] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C98268]" />
                  <span>Free Preview : Unlock Full Report</span>
                </button>
              )}
            </div>
          </div>

          {/* Top Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Overall Score */}
            <div className="md:col-span-4 bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C8060]">
                Overall Resume Impact Score
              </span>
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="text-4xl font-black text-[#332C28]">
                  {activeReport.score}
                  <span className="text-sm font-normal text-[#756B64]">/100</span>
                </div>
              </div>
              <p className="text-xs text-[#756B64]">
                {activeReport.score >= 80
                  ? 'Strong baseline. A few metric additions will make it competitive for top fellowships.'
                  : 'Early-stage formatting. Needs quantified bullet points and target keywords.'}
              </p>
            </div>

            {/* Headline Issues */}
            <div className="md:col-span-8 bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DCD3] pb-3">
                <h3 className="text-sm font-bold text-[#332C28] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C98268]" />
                  <span>Headline Issues Identified</span>
                </h3>
                <span className="text-[11px] font-bold text-[#8C8060]">
                  {activeReport.headlineIssues.length} Findings
                </span>
              </div>

              <div className="space-y-2.5">
                {activeReport.headlineIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl text-xs text-[#332C28] flex items-start gap-2.5"
                  >
                    <span className="text-[#C98268] font-bold text-sm leading-none">•</span>
                    <span className="leading-relaxed">{issue}</span>
                  </div>
                ))}
              </div>

              {!activeReport.isUnlocked && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="w-full py-2.5 bg-[#C98268] hover:bg-[#B67158] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Unlock Full Report (ATS Score, Section Rewrites &amp; Gaps)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Structured Report Contents */}
          <div className="space-y-6">
            {/* 1. ATS Readability Score */}
            <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DCD3] pb-3">
                <h3 className="text-sm font-bold text-[#332C28] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C98268]" />
                  <span>ATS Readability &amp; Keyword Alignment</span>
                </h3>
                <span className="text-xs font-bold text-[#C98268] bg-[#F5EAE5] px-2.5 py-0.5 rounded-full border border-[#E8D8C3]">
                  {activeReport.atsReadability.score}/100 ATS Score
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#F8F3EA] rounded-xl border border-[#E4DCD3] space-y-1">
                  <span className="text-[#8C8060] font-bold block uppercase text-[10px]">
                    Parsing Risk Assessment
                  </span>
                  <p className="text-[#332C28] leading-relaxed">
                    {activeReport.atsReadability.parsingRisk}
                  </p>
                </div>

                <div className="p-3 bg-[#F8F3EA] rounded-xl border border-[#E4DCD3] space-y-1">
                  <span className="text-[#8C8060] font-bold block uppercase text-[10px]">
                    Missing Role Keywords Detected
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeReport.atsReadability.missingKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[#FFFDF8] text-[#332C28] border border-[#E4DCD3] rounded-md font-semibold text-[11px]"
                      >
                        +{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Section-by-Section Feedback */}
            <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#332C28] border-b border-[#E4DCD3] pb-3">
                Section-by-Section Deep Audit
              </h3>

              <div className="space-y-3">
                {activeReport.sectionFeedback.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#332C28]">
                        {sec.section}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sec.status === 'good'
                            ? 'bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]'
                            : 'bg-[#FFFDF8] text-[#756B64] border border-[#E4DCD3]'
                        }`}
                      >
                        Score: {sec.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-[#756B64] leading-relaxed">
                      {sec.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Line-level Rewrites (Before vs After) */}
            <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DCD3] pb-3">
                <h3 className="text-sm font-bold text-[#332C28] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C98268]" />
                  <span>Line-Level Rewrite Suggestions (Before / After)</span>
                </h3>
                <span className="text-xs text-[#8C8060]">
                  Quantified Outcome Formula
                </span>
              </div>

              <div className="space-y-4">
                {activeReport.lineRewrites.map((rewrite, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl space-y-2 text-xs"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8060]">
                      {rewrite.section}
                    </span>

                    <div className="space-y-1.5">
                      <div className="p-2.5 bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg text-[#756B64]">
                        <span className="font-bold text-[11px] block text-[#8C8060]">
                          Original (Passive):
                        </span>
                        <p className="line-through text-[#756B64]">
                          &ldquo;{rewrite.original}&rdquo;
                        </p>
                      </div>

                      <div className="p-2.5 bg-[#F5EAE5] border border-[#E8D8C3] rounded-lg text-[#332C28]">
                        <span className="font-bold text-[11px] block text-[#C98268]">
                          OppMatch Recommended Rewrite:
                        </span>
                        <p className="font-semibold text-[#332C28]">
                          &ldquo;{rewrite.improved}&rdquo;
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#756B64] italic pt-1">
                      <strong>Why this works: </strong>
                      {rewrite.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Missing Skills Gap Analysis */}
            <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DCD3] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#332C28]">
                    Opportunity Cross-Referenced Skill Gaps
                  </h3>
                  <p className="text-xs text-[#756B64]">
                    Directly tied to the {matchedOpportunities.length} opportunities currently matched to your profile.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeReport.missingSkillsGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#332C28] text-sm">
                        {gap.skill}
                      </span>
                      <span className="text-[10px] font-semibold bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3] px-2 py-0.5 rounded-full">
                        Required by {gap.matchedOppsCount} matched opps
                      </span>
                    </div>
                    <p className="text-[#756B64] leading-relaxed">
                      {gap.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Action Checklist */}
            <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#332C28] border-b border-[#E4DCD3] pb-3">
                CV Polish Action Checklist
              </h3>

              <div className="space-y-2">
                {activeReport.actionChecklist.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C98268] shrink-0 mt-0.5" />
                      <span className="text-[#332C28] font-medium leading-relaxed">
                        {task.task}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 bg-[#FFFDF8] border border-[#E4DCD3] rounded-md font-semibold text-[#756B64]">
                        {task.estimatedTime}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#F5EAE5] text-[#C98268] font-bold rounded-md">
                        {task.impact} Impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-12 text-center shadow-xs">
          <FileCheck2 className="w-12 h-12 text-[#8C8060] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#332C28]">
            No CV Analyzed Yet
          </h3>
          <p className="text-xs text-[#756B64] mt-1 max-w-sm mx-auto">
            Upload your resume or hit &quot;Load Sample CV&quot; to test the review and full ATS breakdown.
          </p>
          <button
            type="button"
            onClick={() => handleSimulatedUpload()}
            className="mt-4 px-4 py-2 bg-[#C98268] hover:bg-[#B67158] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Load Sample Student CV
          </button>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUnlockDemo={handleUnlock}
        title="Unlock Full CV ATS Report"
        subtitle="Access the line-by-line rewrite suggestions, ATS keyword parsing, and opportunity cross-referencing."
      />
    </div>
  );
};
