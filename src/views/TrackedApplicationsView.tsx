import React, { useState } from 'react';
import { Opportunity, PipelineStage, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { PipelineStepper } from '../components/PipelineStepper';
import {
  BookmarkCheck,
  Calendar,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Compass,
  FileEdit,
} from 'lucide-react';

interface TrackedApplicationsViewProps {
  opportunities: Opportunity[];
  profile: UserProfile;
  onSelectOpportunity: (opp: Opportunity) => void;
  onBrowseMore: () => void;
}

export const TrackedApplicationsView: React.FC<TrackedApplicationsViewProps> = ({
  opportunities,
  profile,
  onSelectOpportunity,
  onBrowseMore,
}) => {
  const { trackedApplications, updateOpportunityStage, removeOpportunityTracking } = useAuth();
  const [selectedStageFilter, setSelectedStageFilter] = useState<PipelineStage | 'all'>('all');

  // Pair tracked apps with their full Opportunity record
  const trackedItems = Object.values(trackedApplications).map((tracked) => {
    const opp = opportunities.find((o) => o.id === tracked.opportunityId);
    return { tracked, opp };
  }).filter((item): item is { tracked: typeof item.tracked; opp: Opportunity } => item.opp !== undefined);

  const filteredItems = selectedStageFilter === 'all'
    ? trackedItems
    : trackedItems.filter((item) => item.tracked.stage === selectedStageFilter);

  const STAGES: { stage: PipelineStage; label: string; count: number }[] = [
    { stage: 'saved', label: 'Saved', count: trackedItems.filter((i) => i.tracked.stage === 'saved').length },
    { stage: 'preparing', label: 'Preparing', count: trackedItems.filter((i) => i.tracked.stage === 'preparing').length },
    { stage: 'applied', label: 'Applied', count: trackedItems.filter((i) => i.tracked.stage === 'applied').length },
    { stage: 'submitted', label: 'Submitted', count: trackedItems.filter((i) => i.tracked.stage === 'submitted').length },
    { stage: 'outcome', label: 'Outcome', count: trackedItems.filter((i) => i.tracked.stage === 'outcome').length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookmarkCheck className="w-6 h-6 text-teal-600" />
            <span>My Application Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Track your stage progression from discovery to preparation and submission.
          </p>
        </div>

        <button
          type="button"
          onClick={onBrowseMore}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Discover More Opportunities</span>
        </button>
      </div>

      {/* Stage Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setSelectedStageFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
            selectedStageFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          All Stages ({trackedItems.length})
        </button>

        {STAGES.map((s) => (
          <button
            key={s.stage}
            type="button"
            onClick={() => setSelectedStageFilter(s.stage)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border flex items-center gap-1.5 ${
              selectedStageFilter === s.stage
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>{s.label}</span>
            <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* List of Tracked Opportunities */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map(({ tracked, opp }) => (
            <div
              key={opp.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-teal-300 transition-all"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {opp.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      Saved: {tracked.dateAdded}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {opp.organization} • Deadline: <strong className="text-slate-800">{opp.deadline}</strong> • {opp.funding_or_prize}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectOpportunity(opp)}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Detail &amp; Checklist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeOpportunityTracking(opp.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Stepper for this specific item */}
              <div className="pt-2 border-t border-slate-100">
                <PipelineStepper
                  currentStage={tracked.stage}
                  onStageSelect={(newStage) => updateOpportunityStage(opp.id, newStage, tracked.notes)}
                />
              </div>

              {/* Notes Preview */}
              {tracked.notes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                  <FileEdit className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Application Notes: </strong>
                    <span>{tracked.notes}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs space-y-3">
          <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            No opportunities in this pipeline stage
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse the discovery feed and click &quot;Save to Pipeline&quot; to organize your upcoming deadlines.
          </p>
          <button
            type="button"
            onClick={onBrowseMore}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Browse Opportunities
          </button>
        </div>
      )}
    </div>
  );
};
