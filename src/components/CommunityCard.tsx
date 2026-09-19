import React from 'react';
import { Community, UserProfile } from '../types';
import { calculateCommunityRecommendation } from '../services/matchingEngine';
import { Users, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { BrandLogoIcon } from './BrandLogoIcon';

interface CommunityCardProps {
  community: Community;
  profile: UserProfile;
  onExplore: (community: Community) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  profile,
  onExplore,
}) => {
  const rec = calculateCommunityRecommendation(profile, community);

  return (
    <div className="bg-[#FFFDF8] rounded-xl border border-[#E4DCD3] hover:border-[#C98268] transition-all p-4 md:p-5 flex flex-col justify-between shadow-xs hover:shadow-sm">
      <div>
        {/* Header with logo, name, match %, verified badge */}
        <div className="flex items-start gap-3">
          <BrandLogoIcon name={community.name} logoUrl={community.logo} size="md" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-sm font-bold text-[#332C28] truncate">
                {community.name}
              </h3>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3] shrink-0">
                {rec.matchPercentage}% Match
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold text-[#8C8060] uppercase tracking-wider">
                {community.community_type}
              </span>
              {community.verified && (
                <span className="text-[10px] text-[#8C8060] font-medium flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-[#C98268]" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#756B64] mt-3 line-clamp-2 leading-relaxed">
          {community.description}
        </p>

        {/* Short "Why we recommend it" line */}
        <div className="mt-3 p-2.5 bg-[#F8F3EA] rounded-lg border border-[#E4DCD3] text-xs text-[#332C28]">
          <span className="font-semibold text-[#C98268]">Why recommended: </span>
          <span className="text-[#756B64]">{rec.whyRecommend}</span>
        </div>

        {/* Focus area tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {community.focus_areas.slice(0, 3).map((area, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8F3EA] text-[#756B64] border border-[#E4DCD3] font-medium"
            >
              {area}
            </span>
          ))}
        </div>

        {/* Region & Members meta */}
        <div className="flex items-center gap-3 mt-3 text-xs text-[#756B64]">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#8C8060]" />
            <span className="truncate max-w-[130px]">
              {community.countries.slice(0, 2).join(', ')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-[#8C8060]" />
            <span>{community.members_type.slice(0, 2).join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-4 pt-3 border-t border-[#E4DCD3] flex items-center justify-between">
        <a
          href={community.website}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#756B64] hover:text-[#C98268] flex items-center gap-1"
        >
          <span>Website</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <button
          type="button"
          onClick={() => onExplore(community)}
          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#C98268] hover:bg-[#B67158] rounded-lg transition-colors cursor-pointer"
        >
          Explore Community
        </button>
      </div>
    </div>
  );
};
