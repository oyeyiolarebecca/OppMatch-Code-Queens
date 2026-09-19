import React, { useState } from 'react';
import { Opportunity, PipelineStage, UserProfile } from '../types';
import { calculateOpportunityMatch } from '../services/matchingEngine';
import { generateApplicationAssistantData } from '../services/applicationAssistant';
import { PipelineStepper } from '../components/PipelineStepper';
import { MatchExplanationView } from '../components/MatchExplanationView';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  FileText,
  ListTodo,
  Clock,
  Bookmark,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Save,
} from 'lucide-react';

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  profile: UserProfile;
  onBack: () => void;
  onOpenCVReview?: () => void;
}

type DetailTab = 'overview' | 'match' | 'checklist' | 'timeline';

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  opportunity,
  profile,
  onBack,
  onOpenCVReview,
}) => {
  const {
    trackedApplications,
    updateOpportunityStage,
    toggleSaveOpportunity,
    isOpportunitySaved,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const match = calculateOpportunityMatch(profile, opportunity);
  const assistant = generateApplicationAssistantData(opportunity, profile);

  const tracked = trackedApplications[opportunity.id];
  const isSaved = isOpportunitySaved(opportunity.id);
  const currentStage: PipelineStage = tracked ? tracked.stage : 'saved';

  const [notes, setNotes] = useState(tracked?.notes || '');
  const [checklist, setChecklist] = useState(assistant.checklist);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleStageSelect = (newStage: PipelineStage) => {
    updateOpportunityStage(opportunity.id, newStage, notes);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleSaveNotes = () => {
    updateOpportunityStage(opportunity.id, currentStage, notes);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top back button and actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#756B64] hover:text-[#332C28] bg-[#FFFDF8] border border-[#E4DCD3] px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSaveOpportunity(opportunity.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSaved
                ? 'bg-[#F5EAE5] text-[#C98268] border-[#E8D8C3]'
                : 'bg-[#FFFDF8] text-[#332C28] border-[#E4DCD3] hover:bg-[#F8F3EA]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-[#C98268]' : ''}`} />
            <span>{isSaved ? 'Saved in My Pipeline' : 'Save to Pipeline'}</span>
          </button>

          <a
            href={opportunity.application_url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1.5 bg-[#C98268] hover:bg-[#B67158] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Reference Pattern: Horizontal Colored-Pill Status/Progress Stepper at top */}
      <div>
        <PipelineStepper
          currentStage={currentStage}
          onStageSelect={handleStageSelect}
        />
      </div>

      {/* Main Two-Column Detail Layout inspired by image.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Wider Left Panel (7 cols in lg) with Tabbed Content */}
        <div className="lg:col-span-8 bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-5 md:p-6 shadow-xs space-y-6">
          {/* Header info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]">
                {opportunity.type}
              </span>
              {opportunity.status === 'featured' && (
                <span className="text-xs font-semibold bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3] px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Award className="w-3 h-3" /> Featured Opportunity
                </span>
              )}
              {opportunity.status === 'verified' && (
                <span className="text-xs font-medium text-[#8C8060] bg-[#F8F3EA] border border-[#E4DCD3] px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#C98268]" /> Verified Publisher
                </span>
              )}
              <span className="text-xs text-[#756B64]">
                Field: <strong className="text-[#332C28]">{opportunity.field}</strong>
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-[#332C28] leading-tight">
              {opportunity.title}
            </h1>
            <p className="text-sm font-semibold text-[#756B64] mt-1">
              Hosted by {opportunity.organization}
            </p>
          </div>

          {/* Tab Navigation Navigation Row */}
          <div className="border-b border-[#E4DCD3] flex items-center gap-2 overflow-x-auto pb-px">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#C98268] text-[#C98268]'
                  : 'border-transparent text-[#756B64] hover:text-[#332C28]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Overview &amp; Scope</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('match')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'match'
                  ? 'border-[#C98268] text-[#C98268]'
                  : 'border-transparent text-[#756B64] hover:text-[#332C28]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match Analysis &amp; Gaps ({match.matchPercentage}%)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'checklist'
                  ? 'border-[#C98268] text-[#C98268]'
                  : 'border-transparent text-[#756B64] hover:text-[#332C28]'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Application Checklist</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'border-[#C98268] text-[#C98268]'
                  : 'border-transparent text-[#756B64] hover:text-[#332C28]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline &amp; Notes</span>
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5 text-[#332C28] text-sm leading-relaxed">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] mb-2">
                  Description
                </h3>
                <p className="bg-[#F8F3EA] p-4 rounded-xl border border-[#E4DCD3] text-[#332C28]">
                  {opportunity.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] mb-2">
                  Official Eligibility Criteria
                </h3>
                <div className="p-4 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl text-xs space-y-2">
                  <p className="font-medium text-[#332C28]">
                    {opportunity.eligibility}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2 text-[11px] text-[#756B64] border-t border-[#E4DCD3]">
                    <span>
                      Eligible Countries: <strong className="text-[#332C28]">{opportunity.country_requirement.join(', ')}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Career Target: <strong className="text-[#332C28]">{opportunity.career_level.join(', ')}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Education: <strong className="text-[#332C28]">{opportunity.education_level.join(', ')}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] mb-2">
                  Key Skills Evaluated
                </h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((skill, idx) => {
                    const userHas = profile.skills.some(
                      (s) => s.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                          userHas
                            ? 'bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]'
                            : 'bg-[#F8F3EA] text-[#756B64] border border-[#E4DCD3]'
                        }`}
                      >
                        {skill} {userHas && '✓'}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Banner suggestion to run CV review */}
              {onOpenCVReview && (
                <div className="p-4 bg-[#F5EAE5] border border-[#E8D8C3] rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#332C28]">
                      Tailor your CV for this application
                    </h4>
                    <p className="text-[11px] text-[#756B64]">
                      Run our CV review to optimize keywords and catch missing bullet metrics.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCVReview}
                    className="px-3 py-1.5 text-xs font-bold bg-[#C98268] hover:bg-[#B67158] text-white rounded-lg cursor-pointer transition-colors"
                  >
                    Open CV Review
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Match Analysis & Gaps (Exact required format) */}
          {activeTab === 'match' && (
            <div className="space-y-4">
              <MatchExplanationView explanation={match} compact={false} />

              <div className="p-4 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8060]">
                  Multivariate Reasoning Scores
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center">
                  <div className="bg-[#FFFDF8] p-2.5 rounded-lg border border-[#E4DCD3]">
                    <span className="text-[10px] text-[#8C8060] font-bold block uppercase">Skills</span>
                    <span className="text-sm font-extrabold text-[#C98268]">{match.scoreBreakdown.skills}%</span>
                  </div>
                  <div className="bg-[#FFFDF8] p-2.5 rounded-lg border border-[#E4DCD3]">
                    <span className="text-[10px] text-[#8C8060] font-bold block uppercase">Education</span>
                    <span className="text-sm font-extrabold text-[#C98268]">{match.scoreBreakdown.education}%</span>
                  </div>
                  <div className="bg-[#FFFDF8] p-2.5 rounded-lg border border-[#E4DCD3]">
                    <span className="text-[10px] text-[#8C8060] font-bold block uppercase">Location</span>
                    <span className="text-sm font-extrabold text-[#C98268]">{match.scoreBreakdown.location}%</span>
                  </div>
                  <div className="bg-[#FFFDF8] p-2.5 rounded-lg border border-[#E4DCD3]">
                    <span className="text-[10px] text-[#8C8060] font-bold block uppercase">Career Level</span>
                    <span className="text-sm font-extrabold text-[#C98268]">{match.scoreBreakdown.careerLevel}%</span>
                  </div>
                  <div className="bg-[#FFFDF8] p-2.5 rounded-lg border border-[#E4DCD3]">
                    <span className="text-[10px] text-[#8C8060] font-bold block uppercase">Goals</span>
                    <span className="text-sm font-extrabold text-[#C98268]">{match.scoreBreakdown.interest}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Application Assistant & Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] mb-2">
                  Required Application Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {assistant.requiredDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl flex items-center gap-2.5 text-xs text-[#332C28] font-medium"
                    >
                      <FileText className="w-4 h-4 text-[#C98268] shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060]">
                    Preparation Checklist
                  </h3>
                  <span className="text-xs font-semibold text-[#756B64]">
                    {checklist.filter((c) => c.done).length} of {checklist.length} completed
                  </span>
                </div>

                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        item.done
                          ? 'bg-[#F8F3EA] border-[#E4DCD3] text-[#756B64] line-through'
                          : 'bg-[#FFFDF8] border-[#E4DCD3] hover:border-[#C98268] text-[#332C28]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => {}}
                        className="mt-0.5 rounded-sm accent-[#C98268]"
                      />
                      <span className="text-xs font-medium leading-relaxed">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] mb-2">
                  Preparation Tasks &amp; Strategic Actions
                </h3>
                <ul className="space-y-2 text-xs text-[#332C28]">
                  {assistant.preparationTasks.map((task, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 p-2.5 bg-[#F8F3EA] rounded-lg border border-[#E4DCD3]"
                    >
                      <CheckCircle className="w-4 h-4 text-[#C98268] shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Timeline & Notes */}
          {activeTab === 'timeline' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] mb-2">
                  Suggested Application Timeline
                </h3>
                <div className="space-y-3">
                  {assistant.suggestedTimeline.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#332C28]">
                            {item.phase}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 bg-[#FFFDF8] border border-[#E4DCD3] rounded-full font-semibold text-[#756B64]">
                            {item.timing}
                          </span>
                        </div>
                        <p className="text-xs text-[#756B64] mt-1 leading-relaxed">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Notes Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060]">
                    My Application Notes &amp; Draft Pitch
                  </h3>
                  {saveSuccessNotice && (
                    <span className="text-xs font-semibold text-[#C98268] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Notes Saved!
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your pitch ideas, teammates, application answers, or interview dates..."
                  className="w-full p-3 text-xs bg-[#FFFDF8] border border-[#E4DCD3] rounded-xl focus:outline-hidden focus:border-[#C98268] text-[#332C28]"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="mt-2 px-3.5 py-1.5 bg-[#C98268] hover:bg-[#B67158] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Narrower Right Panel (4 cols in lg) with Compact "Basic Info" Card from image.png */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DCD3] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C8060]">
                Opportunity Metadata
              </span>
              <span className="text-[11px] font-bold text-[#C98268] bg-[#F5EAE5] px-2 py-0.5 rounded-full border border-[#E8D8C3]">
                {match.matchPercentage}% Fit
              </span>
            </div>

            {/* Labeled rows with small muted icons */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <span className="text-[#756B64] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#8C8060]" /> Organization
                </span>
                <span className="font-bold text-[#332C28] text-right">
                  {opportunity.organization}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-[#756B64] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8C8060]" /> Deadline
                </span>
                <span className="font-bold text-[#332C28] text-right">
                  {opportunity.deadline}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-[#756B64] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#8C8060]" /> Value / Prize
                </span>
                <span className="font-bold text-[#332C28] text-right max-w-[180px]">
                  {opportunity.funding_or_prize}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-[#756B64] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8C8060]" /> Location
                </span>
                <span className="font-bold text-[#332C28] text-right max-w-[180px]">
                  {opportunity.location}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-[#756B64] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#8C8060]" /> Remote Work
                </span>
                <span className="font-bold text-[#332C28]">
                  {opportunity.remote ? 'Remote Allowed' : 'On-Site Only'}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-[#756B64] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#8C8060]" /> Education Level
                </span>
                <span className="font-bold text-[#332C28] text-right">
                  {opportunity.education_level.join(', ')}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-[#756B64] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C8060]" /> Verification
                </span>
                <span className="font-bold text-[#C98268] capitalize">
                  {opportunity.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Direct Official Link */}
            <div className="pt-3 border-t border-[#E4DCD3]">
              <a
                href={opportunity.application_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-[#C98268] hover:bg-[#B67158] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={opportunity.source_url}
                target="_blank"
                rel="noreferrer"
                className="w-full mt-2 py-1.5 text-center text-[11px] text-[#756B64] hover:text-[#332C28] block"
              >
                View original announcement source →
              </a>
            </div>
          </div>

          {/* Profile Match Quick Summary */}
          <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-[#332C28] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C98268]" />
              Applicant Profile Fit
            </h4>
            <p className="text-[#756B64] text-[11px] leading-relaxed">
              Evaluating for <strong>{profile.full_name}</strong> ({profile.country}, {profile.school || profile.education}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
