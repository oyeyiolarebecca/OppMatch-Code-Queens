import React from 'react';
import { PipelineStage } from '../types';
import { Check } from 'lucide-react';

interface PipelineStepperProps {
  currentStage: PipelineStage;
  onStageSelect?: (stage: PipelineStage) => void;
  readOnly?: boolean;
}

const STAGES: { id: PipelineStage; label: string; sub: string }[] = [
  {
    id: 'saved',
    label: 'SAVED',
    sub: 'Opportunity Bookmarked',
  },
  {
    id: 'preparing',
    label: 'PREPARING',
    sub: 'Docs & Pitch Deck',
  },
  {
    id: 'applied',
    label: 'APPLIED',
    sub: 'Draft Submitted',
  },
  {
    id: 'submitted',
    label: 'SUBMITTED',
    sub: 'Verification Pending',
  },
  {
    id: 'outcome',
    label: 'OUTCOME',
    sub: 'Accepted / Decision',
  },
];

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStage,
  onStageSelect,
  readOnly = false,
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="w-full bg-[#FFFDF8] border border-[#E4DCD3] rounded-xl p-3 md:p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#8C8060] uppercase tracking-wider">
          Application Progress Pathway
        </span>
        <span className="text-xs text-[#756B64]">
          Stage {currentIndex + 1} of {STAGES.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = stage.id === currentStage;

          return (
            <button
              key={stage.id}
              type="button"
              disabled={readOnly}
              onClick={() => onStageSelect && onStageSelect(stage.id)}
              className={`text-left p-2.5 rounded-lg border transition-all ${
                isCurrent
                  ? 'bg-[#C98268] text-white border-[#C98268] shadow-xs'
                  : isPassed
                  ? 'bg-[#F5EAE5] text-[#332C28] border-[#E8D8C3] hover:bg-[#E8D8C3]/40'
                  : 'bg-[#F8F3EA] text-[#756B64] border-[#E4DCD3] hover:bg-[#FFFDF8]'
              } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider">
                  {stage.label}
                </span>
                {isPassed && (
                  <Check className="w-3.5 h-3.5 text-[#C98268]" />
                )}
                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </div>
              <p
                className={`text-[10px] mt-0.5 truncate ${
                  isCurrent
                    ? 'text-white/90'
                    : isPassed
                    ? 'text-[#756B64]'
                    : 'text-[#8C8060]'
                }`}
              >
                {stage.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
