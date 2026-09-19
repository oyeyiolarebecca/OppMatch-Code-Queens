import React from 'react';
import { Opportunity, UserProfile } from '../types';
import { calculateOpportunityMatch } from '../services/matchingEngine';
import {
  Calendar,
  MapPin,
  Globe,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogoIcon } from './BrandLogoIcon';

interface OpportunityCardProps {
  opportunity: Opportunity;
  profile: UserProfile;
  onSelect: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  profile,
  onSelect,
}) => {
  const { isOpportunitySaved, toggleSaveOpportunity } = useAuth();
  const saved = isOpportunitySaved(opportunity.id);
  const match = calculateOpportunityMatch(profile, opportunity);

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'hackathon':
      case 'fellowship':
        return 'bg-[#F5EAE5] text-[#C98268] border-[#E8D8C3]';
      case 'scholarship':
      case 'grant':
        return 'bg-[#F8F3EA] text-[#8C8060] border-[#E4DCD3]';
      case 'internship':
      case 'job':
      case 'mentorship':
      default:
        return 'bg-[#FFFDF8] text-[#756B64] border-[#E4DCD3]';
    }
  };

  return (
    <div className="bg-[#FFFDF8] rounded-xl border border-[#E4DCD3] hover:border-[#C98268] transition-all p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-sm group">
      <div>
        {/* Top bar: Type, Status, Match Score, and Save Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getTypeBadgeClass(
                opportunity.type
              )}`}
            >
              {opportunity.type}
            </span>
            {opportunity.status === 'featured' && (
              <span className="text-[10px] font-semibold bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3] px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                <Award className="w-3 h-3" /> Featured
              </span>
            )}
            {opportunity.status === 'verified' && (
              <span className="text-[10px] font-medium text-[#8C8060] bg-[#F8F3EA] border border-[#E4DCD3] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-[#C98268]" /> Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]">
                {match.matchPercentage}% Match
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveOpportunity(opportunity.id);
              }}
              title={saved ? 'Remove from pipeline' : 'Save to pipeline'}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                saved
                  ? 'bg-[#F5EAE5] text-[#C98268] border-[#E8D8C3]'
                  : 'text-[#756B64] border-[#E4DCD3] hover:text-[#C98268] hover:bg-[#F8F3EA]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Organization with real brand logo */}
        <div className="flex items-start gap-3 mt-1">
          <BrandLogoIcon name={opportunity.organization} size="sm" />
          <div className="flex-1 min-w-0">
            <h3
              onClick={() => onSelect(opportunity)}
              className="text-base font-bold text-[#332C28] group-hover:text-[#C98268] transition-colors cursor-pointer line-clamp-2"
            >
              {opportunity.title}
            </h3>
            <p className="text-xs font-medium text-[#756B64] mt-0.5">
              {opportunity.organization}
            </p>
          </div>
        </div>

        {/* Short "Why this matches you" line */}
        <div className="mt-3 p-2.5 bg-[#F8F3EA] rounded-lg border border-[#E4DCD3] text-xs text-[#332C28]">
          <span className="font-semibold text-[#C98268]">Why it matches: </span>
          <span className="text-[#756B64]">
            {match.whyYouMatch[0] || 'Meets your education and regional criteria.'}
          </span>
        </div>

        {/* Metadata row: Location / Remote, Deadline */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#756B64] mt-3.5">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#8C8060]" />
            <span className="truncate max-w-[140px]">{opportunity.location}</span>
          </div>

          {opportunity.remote && (
            <div className="flex items-center gap-1 text-[#C98268] font-medium">
              <Globe className="w-3.5 h-3.5" />
              <span>Remote</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#8C8060]" />
            <span>Deadline: {opportunity.deadline}</span>
          </div>
        </div>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {opportunity.skills.slice(0, 3).map((skill, idx) => {
            const hasSkill = profile.skills.some(
              (s) => s.toLowerCase() === skill.toLowerCase()
            );
            return (
              <span
                key={idx}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                  hasSkill
                    ? 'bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3]'
                    : 'bg-[#F8F3EA] text-[#756B64] border border-[#E4DCD3]'
                }`}
              >
                {skill}
              </span>
            );
          })}
          {opportunity.skills.length > 3 && (
            <span className="text-[11px] px-1.5 py-0.5 text-[#8C8060]">
              +{opportunity.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-4 pt-3 border-t border-[#E4DCD3] flex items-center justify-between">
        <span className="text-xs font-semibold text-[#756B64] truncate max-w-[170px]">
          {opportunity.funding_or_prize}
        </span>

        <button
          type="button"
          onClick={() => onSelect(opportunity)}
          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#C98268] hover:bg-[#B67158] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <span>View &amp; Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
