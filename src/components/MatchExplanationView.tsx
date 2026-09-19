import React from 'react';
import { MatchExplanation } from '../types';
import { CheckCircle2, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';

interface MatchExplanationViewProps {
  explanation: MatchExplanation;
  compact?: boolean;
}

export const MatchExplanationView: React.FC<MatchExplanationViewProps> = ({
  explanation,
  compact = false,
}) => {
  const { matchPercentage, summarySentence, whyYouMatch, potentialGaps } = explanation;

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]">
            {matchPercentage}% Match
          </span>
          <span className="text-xs text-[#756B64] line-clamp-1">
            {whyYouMatch[0] || 'Eligible applicant profile'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-xl p-4 md:p-5 shadow-xs space-y-4">
      {/* Header with Match Percentage */}
      <div className="flex items-center justify-between border-b border-[#E4DCD3] pb-3">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg text-lg font-extrabold bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{matchPercentage}% Match</span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C8060]">
            Personalized Opportunity Assessment
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#756B64]">
          <TrendingUp className="w-3.5 h-3.5 text-[#C98268]" />
          <span>Multivariate Profile Reasoning</span>
        </div>
      </div>

      {/* Required plain-language summary paragraph */}
      <div className="text-sm leading-relaxed text-[#332C28] bg-[#F8F3EA] p-3.5 rounded-lg border border-[#E4DCD3]">
        {summarySentence}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Why you match */}
        <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-[#C98268] font-bold text-xs uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-[#C98268] shrink-0" />
            <span>Why you match:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#332C28]">
            {whyYouMatch.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#C98268] font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Potential gaps */}
        <div className="bg-[#F8F3EA] border border-[#E4DCD3] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-[#8C8060] font-bold text-xs uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-[#8C8060] shrink-0" />
            <span>Potential gap:</span>
          </div>
          {potentialGaps.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-[#332C28]">
              {potentialGaps.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#8C8060] font-bold">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#756B64] italic">
              No significant structural gaps identified. Your current qualifications meet all core eligibility requirements.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
