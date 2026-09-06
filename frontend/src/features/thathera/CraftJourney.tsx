import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Hammer, Wrench, Shield, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';
import { Experience, ExperienceItem } from '../../types';
import { SourceBadge } from '../../components/SourceBadge';
import { NarrationPlayer } from '../../components/NarrationPlayer';

interface CraftJourneyProps {
  experience: Experience;
}

export const CraftJourney: React.FC<CraftJourneyProps> = ({ experience }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const items = experience.items || [];
  const activeItem: ExperienceItem | undefined = items[currentStepIndex];

  if (!items.length) {
    return <div className="text-center py-10">Craft journey stages are loading...</div>;
  }

  const stageIcons = [
    <Wrench className="w-5 h-5" />,
    <Flame className="w-5 h-5 text-orange-600" />,
    <Hammer className="w-5 h-5" />,
    <Wrench className="w-5 h-5" />,
    <Flame className="w-5 h-5 text-amber-600" />,
    <Sparkles className="w-5 h-5 text-yellow-600" />,
    <Hammer className="w-5 h-5 text-amber-700" />,
    <Shield className="w-5 h-5 text-emerald-600" />
  ];

  return (
    <div className="space-y-8">
      {/* Overview header */}
      <div className="bg-gradient-to-r from-amber-950/90 via-[#7C2D12] to-orange-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-amber-950 mb-3">
            North India • Punjab • UNESCO Inscribed
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
            {experience.title}
          </h2>
          <p className="text-sm sm:text-base text-amber-100/90 mt-2 leading-relaxed">
            {experience.description}
          </p>
        </div>
      </div>

      {/* 8-Stage Interactive Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E6D5C3] shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
          <span>Interactive Craft Timeline (Select a stage)</span>
          <span className="text-[#9A3412] font-semibold">Stage {currentStepIndex + 1} of {items.length}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {items.map((item, idx) => {
            const isSelected = idx === currentStepIndex;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'bg-[#9A3412] text-white border-[#7C2D12] shadow-md scale-102 ring-2 ring-orange-300'
                    : 'bg-slate-50 hover:bg-orange-50 text-slate-700 border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-lg mb-1.5 ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700'}`}>
                  {stageIcons[idx] || <Hammer className="w-4 h-4" />}
                </div>
                <span className="font-bold text-[11px] opacity-80">{item.category_or_style}</span>
                <span className="font-semibold line-clamp-1 mt-0.5 text-[11px]">{item.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Showcase */}
      {activeItem && (
        <div className="bg-white rounded-2xl border border-[#E6D5C3] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Visual Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-orange-950 to-amber-900 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeItem.category_or_style}
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-white">
                {activeItem.title}
              </h3>

              {activeItem.tool_or_material && (
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
                    Traditional Tools & Materials
                  </span>
                  <p className="text-xs font-medium text-slate-200">
                    {activeItem.tool_or_material}
                  </p>
                </div>
              )}
            </div>

            {/* Stepper Controls */}
            <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 mt-6">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-amber-200 font-mono">
                {currentStepIndex + 1} / {items.length}
              </span>
              <button
                disabled={currentStepIndex === items.length - 1}
                onClick={() => setCurrentStepIndex((prev) => Math.min(items.length - 1, prev + 1))}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Content Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Process Explanation
              </h4>
              <p className="text-base text-slate-800 leading-relaxed font-sans">
                {activeItem.description}
              </p>
            </div>

            {activeItem.cultural_context && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Cultural Context
                </h4>
                <p className="text-sm text-amber-950/90 leading-relaxed">
                  {activeItem.cultural_context}
                </p>
              </div>
            )}

            {activeItem.regional_perspective && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Regional Perspective (Jandiala Guru, Punjab)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeItem.regional_perspective}
                </p>
              </div>
            )}

            {/* Regional Spoken Audio Narration (English, Hindi, Punjabi) */}
            <NarrationPlayer
              traditionSlug="thathera"
              motifTitle={activeItem.title}
              motifContent={activeItem.description}
              culturalContext={activeItem.cultural_context}
            />

            {/* Source Verification Badge */}
            {activeItem.source && (
              <div className="pt-2">
                <SourceBadge source={activeItem.source} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Footer: Take Thathera Quiz */}
      <div className="bg-[#FAF8F5] border border-[#E6D5C3] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-lg text-slate-900">
            Understood the 8 Stages of Thathera Craft?
          </h4>
          <p className="text-sm text-slate-600">
            Test your knowledge with 3 verified multiple-choice questions grounded in UNESCO archives.
          </p>
        </div>
        <Link
          to="/tradition/thathera/quiz"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md transition-colors"
        >
          Take Thathera Quiz <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
