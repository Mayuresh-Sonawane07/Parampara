import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe, Loader2 } from 'lucide-react';
import {
  getTraditionLanguages,
  getNarrationContent,
  speakCulturalNarration,
  stopCulturalNarration,
  NarrationLanguage
} from '../services/narration';

interface NarrationPlayerProps {
  traditionSlug: string;
  motifTitle: string;
  motifContent: string;
  culturalContext?: string;
  compact?: boolean;
  className?: string;
  onLanguageChange?: (lang: NarrationLanguage) => void;
}

export const NarrationPlayer: React.FC<NarrationPlayerProps> = ({
  traditionSlug,
  motifTitle,
  motifContent,
  culturalContext,
  compact = false,
  className = '',
  onLanguageChange
}) => {
  const languages = getTraditionLanguages(traditionSlug);
  const [selectedLang, setSelectedLang] = useState<NarrationLanguage>(languages[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update selected language if tradition changes
  useEffect(() => {
    const langs = getTraditionLanguages(traditionSlug);
    if (!langs.some((l) => l.code === selectedLang.code)) {
      setSelectedLang(langs[0]);
    }
  }, [traditionSlug]);

  // Stop audio on unmount or motif change
  useEffect(() => {
    return () => {
      stopCulturalNarration();
      setIsPlaying(false);
      setIsLoading(false);
    };
  }, [motifTitle]);

  const handleSelectLanguage = (lang: NarrationLanguage) => {
    if (isPlaying || isLoading) {
      stopCulturalNarration();
      setIsPlaying(false);
      setIsLoading(false);
    }
    setSelectedLang(lang);
    onLanguageChange?.(lang);
  };

  const handleTogglePlay = () => {
    if (isPlaying || isLoading) {
      stopCulturalNarration();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    const fallbackEnglish = `${motifTitle}. ${motifContent}. ${culturalContext || ''}`;
    const narration = getNarrationContent({
      motifKey: motifTitle,
      traditionSlug,
      languageCode: selectedLang.code,
      fallbackTitle: motifTitle,
      fallbackText: fallbackEnglish
    });

    setIsLoading(true);

    speakCulturalNarration({
      text: narration.text,
      voiceLang: selectedLang.voiceLang,
      langCode: selectedLang.code,
      onStart: () => {
        setIsLoading(false);
        setIsPlaying(true);
      },
      onEnd: () => {
        setIsLoading(false);
        setIsPlaying(false);
      },
      onError: () => {
        setIsLoading(false);
        setIsPlaying(false);
      }
    });
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Language selector buttons */}
        <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-0.5 border border-white/20">
          {languages.map((l) => {
            const isSelected = selectedLang.code === l.code;
            return (
              <button
                key={l.code}
                onClick={() => handleSelectLanguage(l)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title={`${l.sublabel} narration`}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        {/* Play/Stop Button */}
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : isLoading
              ? 'bg-amber-400 text-slate-950 opacity-90'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
          title={`${isPlaying ? selectedLang.stopActionText : selectedLang.listenActionText} in ${selectedLang.sublabel}`}
          disabled={false}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
              <span>लोड...</span>
            </>
          ) : isPlaying ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>{selectedLang.stopActionText}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>{selectedLang.listenActionText}</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Expanded card view for modals or detailed panels
  const narration = getNarrationContent({
    motifKey: motifTitle,
    traditionSlug,
    languageCode: selectedLang.code,
    fallbackTitle: motifTitle,
    fallbackText: `${motifTitle}. ${motifContent}`
  });

  return (
    <div className={`bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#9A3412]" />
          <span className="text-xs font-bold text-slate-900">
            Regional Spoken Narration
          </span>
          {isPlaying && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Playing
            </span>
          )}
          {isLoading && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full animate-pulse">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              Loading audio...
            </span>
          )}
        </div>

        {/* Language selector tabs */}
        <div className="flex items-center bg-white/90 rounded-xl p-0.5 border border-amber-200 shadow-sm">
          {languages.map((l) => {
            const isSelected = selectedLang.code === l.code;
            return (
              <button
                key={l.code}
                onClick={() => handleSelectLanguage(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#9A3412] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spoken text preview if in regional or Hindi */}
      {selectedLang.code !== 'en' && (
        <div className="bg-white/80 border border-amber-200/60 rounded-xl p-3 text-xs text-slate-800 leading-relaxed font-serif italic">
          "{narration.text}"
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-600">
          Native Voice: <strong>{selectedLang.sublabel}</strong>
        </span>

        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : isLoading
              ? 'bg-amber-600 text-white opacity-90'
              : 'bg-[#9A3412] hover:bg-[#7C2D12] text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Loading Audio...</span>
            </>
          ) : isPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{selectedLang.stopActionText} ({selectedLang.label})</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{selectedLang.listenActionText} ({selectedLang.label})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

