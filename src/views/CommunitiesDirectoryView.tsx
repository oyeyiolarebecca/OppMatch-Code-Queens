import React, { useMemo, useState } from 'react';
import { Community, Opportunity, UserProfile } from '../types';
import { CommunityCard } from '../components/CommunityCard';
import { BrandLogoIcon } from '../components/BrandLogoIcon';
import {
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  X,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface CommunitiesDirectoryViewProps {
  communities: Community[];
  opportunities: Opportunity[];
  profile: UserProfile;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const CommunitiesDirectoryView: React.FC<CommunitiesDirectoryViewProps> = ({
  communities,
  opportunities,
  profile,
  onSelectOpportunity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  const filtered = useMemo(() => {
    return communities.filter((comm) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = comm.name.toLowerCase().includes(term);
        const matchesDesc = comm.description.toLowerCase().includes(term);
        const matchesFocus = comm.focus_areas.some((f) => f.toLowerCase().includes(term));
        if (!matchesName && !matchesDesc && !matchesFocus) return false;
      }

      if (selectedType !== 'all' && comm.community_type !== selectedType) {
        return false;
      }

      if (
        selectedCountry !== 'all' &&
        !comm.countries.some((c) => c.toLowerCase() === selectedCountry.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [communities, searchTerm, selectedType, selectedCountry]);

  // Associated opportunities for selected modal
  const associatedOpportunities = useMemo(() => {
    if (!selectedCommunity) return [];
    return opportunities.filter(
      (opp) =>
        opp.community_id === selectedCommunity.id ||
        opp.organization.toLowerCase().includes(selectedCommunity.name.toLowerCase())
    );
  }, [selectedCommunity, opportunities]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#332C28] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#C98268]" />
            <span>African Tech Communities Directory</span>
          </h1>
          <p className="text-xs text-[#756B64] mt-1 max-w-xl">
            Real student associations, campus tech hubs, and continental women-in-tech networks that bridge the opportunity access gap.
          </p>
        </div>

        <span className="text-xs font-bold text-[#C98268] bg-[#F5EAE5] px-3 py-1.5 rounded-xl border border-[#E8D8C3]">
          {communities.length} Verified Networks
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFDF8] border border-[#E4DCD3] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8060] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search communities by name, focus area (e.g. 'She Code Africa', 'NITHUB', 'AI', 'Campus')..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#FFFDF8] border border-[#E4DCD3] rounded-xl focus:outline-hidden focus:border-[#C98268] text-[#332C28]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-2 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl text-xs text-[#332C28] cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Community Types</option>
              <option value="women_in_tech">Women in Tech</option>
              <option value="campus_chapter">Campus Chapters</option>
              <option value="national_association">National Associations</option>
              <option value="regional_hub">Regional Hubs</option>
              <option value="specialty_network">Specialty Networks</option>
              <option value="open_source">Open Source</option>
            </select>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="p-2 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl text-xs text-[#332C28] cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Countries</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="Pan-Africa">Pan-Africa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((comm) => (
          <CommunityCard
            key={comm.id}
            community={comm}
            profile={profile}
            onExplore={(c) => setSelectedCommunity(c)}
          />
        ))}
      </div>

      {/* Community Detail Modal */}
      {selectedCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#332C28]/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF8] w-full max-w-2xl rounded-2xl shadow-xl border border-[#E4DCD3] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E4DCD3] flex items-start justify-between">
              <div className="flex items-start gap-4">
                <BrandLogoIcon name={selectedCommunity.name} logoUrl={selectedCommunity.logo} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#332C28]">
                      {selectedCommunity.name}
                    </h2>
                    {selectedCommunity.verified && (
                      <span className="text-xs text-[#8C8060] font-semibold flex items-center gap-1 bg-[#F5EAE5] border border-[#E8D8C3] px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C98268]" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#756B64] capitalize mt-0.5">
                    {selectedCommunity.community_type.replace('_', ' ')} • {selectedCommunity.countries.join(', ')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCommunity(null)}
                className="text-[#756B64] hover:text-[#332C28] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#332C28]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] mb-1.5">
                  About the Community
                </h3>
                <p className="leading-relaxed bg-[#F8F3EA] p-3.5 rounded-xl border border-[#E4DCD3] text-[#332C28]">
                  {selectedCommunity.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] mb-1.5">
                    Focus Areas
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCommunity.focus_areas.map((f, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#F5EAE5] text-[#C98268] border border-[#E8D8C3] rounded-lg font-semibold"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] mb-1.5">
                    Target Members
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCommunity.members_type.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#F8F3EA] text-[#756B64] border border-[#E4DCD3] rounded-lg font-semibold"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Associated Opportunities */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C8060] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#C98268]" />
                    <span>Opportunities Hosted / Published ({associatedOpportunities.length})</span>
                  </h3>
                </div>

                {associatedOpportunities.length > 0 ? (
                  <div className="space-y-2">
                    {associatedOpportunities.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-3 bg-[#F8F3EA] hover:bg-[#E8D8C3]/30 border border-[#E4DCD3] rounded-xl flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-bold text-[#332C28]">{opp.title}</p>
                          <p className="text-[11px] text-[#756B64]">
                            {opp.type} • Deadline: {opp.deadline} • {opp.funding_or_prize}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCommunity(null);
                            onSelectOpportunity(opp);
                          }}
                          className="px-3 py-1.5 bg-[#C98268] hover:bg-[#B67158] text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>View Opp</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#756B64] italic p-3 bg-[#F8F3EA] rounded-xl border border-[#E4DCD3]">
                    No active deadline-based opportunities currently linked to this community.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E4DCD3] bg-[#F8F3EA] flex items-center justify-between">
              <a
                href={selectedCommunity.website}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#C98268] hover:bg-[#B67158] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Visit Community Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedCommunity(null)}
                className="px-4 py-2 bg-[#FFFDF8] border border-[#E4DCD3] text-[#332C28] font-bold text-xs rounded-xl hover:bg-[#E8D8C3]/30 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
