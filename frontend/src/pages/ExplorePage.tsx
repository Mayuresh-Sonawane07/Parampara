import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, ChevronRight, Search, RotateCcw } from 'lucide-react';
import { fetchTraditions } from '../services/api';
import { TraditionSummary } from '../types';

export const ExplorePage: React.FC = () => {
  const [traditions, setTraditions] = useState<TraditionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

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
        matchExperience = true; // All traditions in Parampara have dedicated interactive explorers
      }
    }

    const matchSearch =
      !searchTerm.trim() ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.short_description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchRegion && matchCategory && matchExperience && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title & Introduction */}
      <div className="border-b border-[#E6D5C3] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A3412]">
          <Compass className="w-4 h-4" />
          Living Heritage Directory
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Explore India's Living Heritage
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          Filtered by geography, traditional medium, and experience modality. Every tradition is
          grounded in verified primary archival dossiers (UNESCO, GI Registry, and INTACH).
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E6D5C3] p-5 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tradition name, state, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412]"
          />
        </div>

        {/* 1. Region Filter Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Region:
          </span>
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => handleRegionChange(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedRegion === r
                    ? 'bg-[#9A3412] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-orange-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Category:
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedCategory === c
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-orange-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Experience Modality Filter Pills */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Experience:
          </span>
          <div className="flex flex-wrap gap-2">
            {experiences.map((e) => (
              <button
                key={e}
                onClick={() => handleExperienceChange(e)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedExperience === e
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-orange-50'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 font-medium">Loading verified traditions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
          <p className="text-slate-600 font-medium text-sm">
            No traditions match the selected filter combination.
          </p>
          <button
            onClick={() => {
              setSearchParams(new URLSearchParams());
              setSearchTerm('');
            }}
            className="text-xs font-bold text-[#9A3412] hover:underline inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset All Filters
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
                className="bg-white rounded-2xl border border-[#E6D5C3] shadow-sm hover:shadow-xl hover:border-[#9A3412] transition-all flex flex-col overflow-hidden group"
              >
                {/* Authentic Image */}
                <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={t.thumbnail}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-sm">
                      {t.region} India • {t.state}
                    </span>
                  </div>
                  {isWarli && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-amber-950 flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" /> WebAR
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#9A3412]">
                        {t.category}
                      </span>
                      {/* Experience Badge */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-[#9A3412] border border-orange-200">
                        {expBadge}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-[#9A3412] transition-colors leading-snug">
                      {t.name}
                    </h3>

                    {/* Short Verified Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {t.short_description}
                    </p>
                  </div>

                  {/* Explore Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/tradition/${t.slug}`}
                      className="text-xs font-bold text-slate-700 hover:text-[#9A3412] flex items-center gap-1"
                    >
                      Read Detail <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={`/tradition/${t.slug}/experience`}
                      className="text-xs font-bold px-4 py-2 rounded-xl bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-sm transition-all hover:scale-102 flex items-center gap-1"
                    >
                      Explore <ChevronRight className="w-3.5 h-3.5" />
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
