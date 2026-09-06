import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Volume2, VolumeX, X, BookOpen, ChevronRight, ExternalLink, Camera } from 'lucide-react';
import { ARExperience, ARHotspot } from '../../types';
import { SourceBadge } from '../../components/SourceBadge';
import { NarrationPlayer } from '../../components/NarrationPlayer';

interface WarliDigitalExperienceProps {
  arExperience: ARExperience;
  isFallbackMode?: boolean;
}

export const WarliDigitalExperience: React.FC<WarliDigitalExperienceProps> = ({
  arExperience,
  isFallbackMode = false,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<ARHotspot | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const hotspots = arExperience.hotspots || [];

  const handleToggleNarration = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const closeHotspotModal = () => {
    if (isPlayingAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setSelectedHotspot(null);
  };

  return (
    <div className="space-y-8">
      {/* Fallback Notice Banner if running in fallback mode */}
      {isFallbackMode && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-[#9A3412]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-slate-900">
                Interactive Digital Fallback Active
              </h4>
              <p className="text-xs text-slate-600">
                You are viewing the high-resolution interactive Warli artwork. All cultural hotspots, narration, and verified sources are fully available.
              </p>
            </div>
          </div>
          <Link
            to="/tradition/warli/ar"
            className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl bg-[#9A3412] text-white hover:bg-[#7C2D12] transition-colors"
          >
            Switch to Camera WebAR
          </Link>
        </div>
      )}

      {/* Main Interactive Artwork Showcase */}
      <div className="bg-white rounded-2xl border border-[#E6D5C3] p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A3412] block">
              Flagship Experience • 4 Documented Iconographic Hotspots
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Warli Ceremonial Canvas (Tarpa, Chauk & Nature)
            </h3>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            Tap any pulsating ring to reveal verified cultural context
          </div>
        </div>

        {/* Interactive Canvas Container */}
        <div className="relative overflow-hidden my-6 rounded-2xl bg-[#732318] border-4 border-[#8B3A2B] shadow-2xl flex items-center justify-center aspect-square max-w-3xl mx-auto">
          {/* Authentic Warli Target Artwork Image */}
          <img
            src="/ar-assets/warli-target.jpg"
            alt="Authentic Warli Ceremonial Painting with Tarpa Dance, Palaghata Chauk, and Tree of Life"
            className="w-full h-full object-cover select-none"
          />

          {/* Interactive Hotspot Pins */}
          {hotspots.map((h) => {
            const isSelected = selectedHotspot?.id === h.id;
            return (
              <button
                key={h.id}
                onClick={() => setSelectedHotspot(h)}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                  isSelected ? 'scale-125' : 'hover:scale-115'
                }`}
                title={h.name}
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-amber-400 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-8 w-8 bg-white/95 border-2 border-amber-600 shadow-xl items-center justify-center text-xs font-black text-amber-950">
                    <Sparkles className="w-4 h-4 text-[#9A3412]" />
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-30">
                  <div className="bg-slate-900/95 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap border border-white/20">
                    {h.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Hotspot legend buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
          {hotspots.map((h, i) => (
            <button
              key={h.id}
              onClick={() => setSelectedHotspot(h)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                selectedHotspot?.id === h.id
                  ? 'bg-[#9A3412] text-white border-[#7C2D12] shadow-sm'
                  : 'bg-slate-50 hover:bg-orange-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  {i + 1}
                </span>
                <span className="line-clamp-1">{h.name}</span>
              </div>
              <p className={`text-[11px] line-clamp-2 ${selectedHotspot?.id === h.id ? 'text-amber-100' : 'text-slate-500'}`}>
                {h.content}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Hotspot Modal Dialog */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E6D5C3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="font-serif font-bold text-lg leading-snug">
                  {selectedHotspot.name}
                </h4>
              </div>
              <button
                onClick={closeHotspotModal}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Documented Iconography
                </h5>
                <p className="text-base text-slate-800 leading-relaxed font-sans">
                  {selectedHotspot.content}
                </p>
              </div>

              {selectedHotspot.cultural_context && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Cultural Context
                  </h5>
                  <p className="text-xs text-amber-950/90 leading-relaxed">
                    {selectedHotspot.cultural_context}
                  </p>
                </div>
              )}

              {selectedHotspot.regional_perspective && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Regional Perspective (Palghar, Maharashtra)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedHotspot.regional_perspective}
                  </p>
                </div>
              )}

              {/* Multi-language Spoken Narration (English, Hindi, Marathi) */}
              <NarrationPlayer
                traditionSlug="warli"
                motifTitle={selectedHotspot.name}
                motifContent={selectedHotspot.content}
                culturalContext={selectedHotspot.cultural_context}
              />

              {/* Source verification */}
              {selectedHotspot.source && (
                <div className="pt-2">
                  <SourceBadge source={selectedHotspot.source} />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={closeHotspotModal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
              >
                Close Hotspot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer: Take Warli Quiz */}
      <div className="bg-[#FAF8F5] border border-[#E6D5C3] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-lg text-slate-900">
            Completed Exploring Warli Iconography?
          </h4>
          <p className="text-sm text-slate-600">
            Test your knowledge with 3 verified multiple-choice questions grounded in INTACH field research.
          </p>
        </div>
        <Link
          to="/tradition/warli/quiz"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md transition-colors"
        >
          Take Warli Quiz <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
