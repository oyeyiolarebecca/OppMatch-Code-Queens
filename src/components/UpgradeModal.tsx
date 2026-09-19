import React from 'react';
import { X, Check, Shield, Sparkles, HeartHandshake } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockDemo: () => void;
  title?: string;
  subtitle?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUnlockDemo,
  title = 'Unlock Full Career Report',
  subtitle = 'Deep personalized feedback that transforms early-career applications.',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#332C28]/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF8] w-full max-w-lg rounded-2xl shadow-xl border border-[#E4DCD3] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#332C28] p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#E8D8C3] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5EAE5]/20 text-[#E8D8C3] border border-[#E8D8C3]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OppMatch PRO</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
          <p className="text-xs text-[#E8D8C3] mt-1 max-w-md">{subtitle}</p>
        </div>

        {/* Philosophy Note */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-[#F8F3EA] border border-[#E4DCD3] rounded-xl text-xs text-[#332C28] flex items-start gap-2.5">
            <HeartHandshake className="w-4 h-4 text-[#C98268] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Our Access Promise: </span>
              Core opportunity discovery, matching percentages, eligibility analysis, and gap explanations are <strong>100% free forever</strong>. Pro reports support human reviewers and deep career analysis.
            </div>
          </div>

          {/* Value inclusions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8060]">
              Included in Full Report:
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs text-[#332C28]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C98268] shrink-0" />
                <span>Full ATS-readability and formatting parsing breakdown</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C98268] shrink-0" />
                <span>Section-by-section scoring and critique (Summary, Exp, Skills, Projects)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C98268] shrink-0" />
                <span>Line-level bullet point rewrites with quantified formulas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C98268] shrink-0" />
                <span>Missing-skills gap analysis cross-referenced with your matched opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C98268] shrink-0" />
                <span>Step-by-step action checklist with estimated completion times</span>
              </div>
            </div>
          </div>

          {/* Pricing Box with Hackathon Free Unlock */}
          <div className="pt-2 border-t border-[#E4DCD3]">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-2xl font-black text-[#332C28]">₦2,500</span>
                <span className="text-xs text-[#756B64] ml-1">/ one-time deep report</span>
              </div>
              <span className="text-[11px] font-bold text-[#C98268] bg-[#F5EAE5] px-2 py-0.5 rounded-full border border-[#E8D8C3]">
                Subsidized Student Rate
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onUnlockDemo}
                className="w-full py-2.5 px-4 bg-[#C98268] hover:bg-[#B67158] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Unlock Instantly (Free Demo Access)</span>
              </button>

              <button
                type="button"
                disabled
                className="w-full py-2 px-4 bg-[#F8F3EA] text-[#756B64] text-xs font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-[#E4DCD3]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Pay via Paystack / Card (Live Checkout Disabled in Demo)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
