import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Search,
  RotateCcw,
  Volume2,
  VolumeX,
  Camera,
  Award,
  BookOpen
} from 'lucide-react';
import { fetchTraditions } from '../services/api';
import { TraditionSummary } from '../types';
import { speakCulturalNarration, stopCulturalNarration } from '../services/narration';

export const ExplorePage: React.FC = () => {
  const [traditions, setTraditions] = useState<TraditionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);

  const selectedRegion = searchParams.get('region') || 'All';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedExperience = searchParams.get('experience') || 'All';
  const [searchTerm, setSearchTerm] = useState('');

  const regions = ['All', 'North', 'South', 'East', 'West'];
  const categories = ['All', 'Craft', 'Textile / Embroidery', 'Dance', 'Visual Art'];
  const experiences = ['All', 'AR', 'Interactive', 'Story', 'Audio'];

  const experienceBadgeMap: { [key: string]: string } = {
    thathera: '8-Stage Craft Journey',
    toda: 'Counted-Thread Motif Explorer',
    chhau: '3-Style Performance Explorer',
    warli: 'Flagship WebAR Experience',
  };

  useEffect(() => {
    fetchTraditions()
      .then((data) => setTraditions(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    return () => {
      stopCulturalNarration();
    };
  }, []);

  const handleRegionChange = (region: string) => {
    const next = new URLSearchParams(searchParams);
    if (region === 'All') next.delete('region');
    else next.set('region', region);
    setSearchParams(next);
  };

  const handleCategoryChange = (category: string) => {
    const next = new URLSearchParams(searchParams);
    if (category === 'All') next.delete('category');
    else next.set('category', category);
    setSearchParams(next);
  };

  const handleExperienceChange = (exp: string) => {
    const next = new URLSearchParams(searchParams);
    if (exp === 'All') next.delete('experience');
    else next.set('experience', exp);
    setSearchParams(next);
  };

  const handleToggleAudio = (t: TraditionSummary) => {
    if (playingSlug === t.slug) {
      stopCulturalNarration();
      setPlayingSlug(null);
      return;
    }

    stopCulturalNarration();
    setPlayingSlug(t.slug);

    const speechText = `${t.name}. Region: ${t.region} India, State of ${t.state}. Category: ${t.category}. ${t.short_description}`;

    speakCulturalNarration({
      text: speechText,
      voiceLang: 'en-IN',
      langCode: 'en',
      onStart: () => setPlayingSlug(t.slug),
      onEnd: () => setPlayingSlug(null),
      onError: () => setPlayingSlug(null)
    });
  };

  const filtered = traditions.filter((t) => {
    const matchRegion =
      selectedRegion === 'All' || t.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchCategory =
      selectedCategory === 'All' ||
      t.category.toLowerCase().includes(selectedCategory.toLowerCase());

    let matchExperience = true;
    if (selectedExperience !== 'All') {
      const exp = selectedExperience.toLowerCase();
      if (exp === 'ar') {
        matchExperience = t.slug === 'warli' || t.experience_type === 'AR_STORY';
      } else if (exp === 'story') {
        matchExperience = t.experience_type === 'CRAFT_JOURNEY' || t.experience_type === 'AR_STORY';
      } else if (exp === 'audio') {
        matchExperience = t.experience_type === 'PERFORMANCE_EXPLORER' || t.slug === 'warli';
      } else if (exp === 'interactive') {
        matchExperience = true;
      }
    }

    const matchSearch =
      !searchTerm.trim() ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.short_description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchRegion && matchCategory && matchExperience && matchSearch;
  });

  const hasActiveFilters =
    selectedRegion !== 'All' ||
    selectedCategory !== 'All' ||
    selectedExperience !== 'All' ||
    searchTerm.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title & Introduction */}
      <div className="border-b border-[#E6D5C3] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A3412] font-cinzel">
          <Compass className="w-4 h-4" />
          Living Heritage Directory
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Explore India's Living Heritage
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-sans">
          Filtered by geography, traditional medium, and experience modality. Every tradition is
          grounded in verified primary archival dossiers (UNESCO, GI Registry, and INTACH).
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-3xl border border-[#E6D5C3] p-6 shadow-md space-y-5">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tradition name, state, community, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] bg-white/90 shadow-xs"
          />
        </div>

        {/* 1. Region Filter Pills */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Region:
          </span>
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => handleRegionChange(r)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === r
                    ? 'bg-[#9A3412] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-orange-100/60'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Category:
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-orange-100/60'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Experience Modality Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Experience Modality:
            </span>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                  setSearchTerm('');
                }}
                className="text-xs font-bold text-[#9A3412] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {experiences.map((e) => (
              <button
                key={e}
                onClick={() => handleExperienceChange(e)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedExperience === e
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-orange-100/60'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
        <span>
          Showing <strong className="text-slate-900">{filtered.length}</strong> of {traditions.length} Verified Traditions
        </span>
        {hasActiveFilters && (
          <span className="text-[#9A3412] bg-orange-100/70 px-2.5 py-1 rounded-md">
            Filtered Results
          </span>
        )}
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Loading verified traditions...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl border border-dashed border-slate-300 space-y-3 p-8">
          <p className="text-slate-700 font-bold text-base font-cinzel">
            No traditions match the selected filter combination.
          </p>
          <p className="text-xs text-slate-500">Try clearing the search keyword or resetting region filters.</p>
          <button
            onClick={() => {
              setSearchParams(new URLSearchParams());
              setSearchTerm('');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#9A3412] text-white text-xs font-bold shadow-md hover:bg-[#7C2D12] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((t) => {
            const isWarli = t.slug === 'warli';
            const expBadge = experienceBadgeMap[t.slug] || t.experience_type.replace('_', ' ');

            return (
              <div
                key={t.id}
                className="bg-white rounded-3xl border border-[#E6D5C3] shadow-sm hover:shadow-2xl hover:border-[#9A3412] transition-all duration-500 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                {/* Authentic Image */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={t.thumbnail || `/heritage-images/${t.slug}.jpg`}
                    alt={t.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/heritage-images/${t.slug}.jpg`;
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-75 transition-opacity"></div>

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/75 text-white backdrop-blur-sm">
                      {t.region} India • {t.state}
                    </span>
                  </div>

                  {isWarli && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
                        <Camera className="w-3 h-3" /> WebAR
                      </span>
                    </div>
                  )}

                  {/* Audio button overlay */}
                  <button
                    onClick={() => handleToggleAudio(t)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-md"
                    title="Listen to summary"
                  >
                    {playingSlug === t.slug ? (
                      <VolumeX className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold text-[#9A3412] truncate">
                        {t.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-[#9A3412] border border-orange-200 uppercase tracking-wide truncate">
                        {expBadge}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-xl font-bold text-slate-900 group-hover:text-[#9A3412] transition-colors leading-snug">
                      {t.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                      {t.short_description}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/tradition/${t.slug}`}
                      className="text-xs font-bold text-slate-700 hover:text-[#9A3412] flex items-center gap-1 transition-colors"
                    >
                      <span>Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={isWarli ? '/tradition/warli/ar' : `/tradition/${t.slug}/experience`}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl text-white shadow-xs transition-all hover:scale-102 flex items-center gap-1 ${
                        isWarli
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-[#9A3412] hover:bg-[#7C2D12]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Experience</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
