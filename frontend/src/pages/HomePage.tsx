import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, QrCode, ArrowRight, ShieldCheck, Award, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { fetchTraditions } from '../services/api';
import { TraditionSummary } from '../types';

export const HomePage: React.FC = () => {
  const [traditions, setTraditions] = useState<TraditionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTraditions()
      .then((data) => setTraditions(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const regionBadges: { [key: string]: { label: string; expLabel: string } } = {
    thathera: { label: 'North India • Punjab', expLabel: 'Craft Journey' },
    toda: { label: 'South India • Tamil Nadu', expLabel: 'Motif Explorer' },
    chhau: { label: 'East India • UNESCO ICH', expLabel: 'Performance Explorer' },
    warli: { label: 'West India • Maharashtra', expLabel: 'Flagship WebAR' },
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F5EFEB] to-[#FAF8F5] pt-12 sm:pt-20 pb-16 border-b border-[#E6D5C3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-100 text-amber-950 border border-amber-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#9A3412]" />
              National Digital Heritage Initiative • Scan • Discover • Preserve
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Discover India's Living Heritage
            </h1>

            <p className="text-base sm:text-xl text-slate-700 font-sans leading-relaxed">
              Connect physical traditions with interactive, research-backed digital storytelling. Explore North, South, East, and West India through authentic living crafts, performances, and WebAR.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/explore"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-lg shadow-orange-950/20 hover:scale-102 transition-all"
              >
                <Compass className="w-5 h-5" />
                Explore Heritage
              </Link>

              <Link
                to="/posters"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-slate-800 bg-white hover:bg-orange-50 border border-slate-300 shadow-sm transition-colors"
              >
                <QrCode className="w-5 h-5 text-[#9A3412]" />
                Scan Physical Posters
              </Link>
            </div>

            {/* Zero-Mock Guarantee Pill */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Real Cultural Data
              </span>
              <span className="flex items-center gap-1.5 text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <Award className="w-4 h-4 text-blue-600" />
                UNESCO & GI Tag Grounded
              </span>
              <span className="flex items-center gap-1.5 text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Zero Fake Information
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FOUR-REGION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6D5C3] pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412]">
              Four Regions • Four Distinct Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              India's Living Cultural Diversity
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#9A3412] hover:text-[#7C2D12]"
          >
            View All Traditions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">Loading verified traditions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditions.map((t) => {
              const badge = regionBadges[t.slug] || { label: t.region, expLabel: t.experience_type };
              const isWarli = t.slug === 'warli';

              return (
                <div
                  key={t.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden group hover:shadow-xl ${
                    isWarli
                      ? 'border-amber-400 ring-2 ring-amber-300/60 shadow-md'
                      : 'border-[#E6D5C3] shadow-sm hover:border-[#9A3412]'
                  }`}
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={t.thumbnail}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/75 text-white backdrop-blur-sm">
                        {badge.label}
                      </span>
                    </div>
                    {isWarli && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500 text-amber-950 shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> WebAR
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#9A3412]">
                          {t.category}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-orange-50 text-[#9A3412] border border-orange-200">
                          {badge.expLabel}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-[#9A3412] transition-colors leading-snug">
                        {t.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {t.short_description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/tradition/${t.slug}`}
                        className="text-xs font-bold text-slate-700 hover:text-[#9A3412] flex items-center gap-1"
                      >
                        About <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={`/tradition/${t.slug}/experience`}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                          isWarli
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-[#9A3412] hover:bg-[#7C2D12] text-white'
                        }`}
                      >
                        Experience
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. PRODUCT JOURNEY: Physical to Digital Bridge */}
      <section className="bg-[#FAF6F0] border-y border-[#E6D5C3] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412]">
              Seamless Heritage Connection
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              The Parampara Experience Journey
            </h2>
            <p className="text-sm text-slate-600">
              How physical museum artifacts, exhibitions, and artisans bridge to digital preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#9A3412] font-bold text-base flex items-center justify-center mx-auto">1</div>
              <h4 className="font-serif font-bold text-sm text-slate-900">Physical Heritage</h4>
              <p className="text-xs text-slate-500">Visit museum, gallery, or community artisan cluster.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#9A3412] font-bold text-base flex items-center justify-center mx-auto">2</div>
              <h4 className="font-serif font-bold text-sm text-slate-900">Single QR Entry</h4>
              <p className="text-xs text-slate-500">Scan verified poster QR code directly into experience.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold text-base flex items-center justify-center mx-auto">3</div>
              <h4 className="font-serif font-bold text-sm text-slate-900">Interactive AR</h4>
              <p className="text-xs text-slate-500">Target recognition reveals animated symbols & audio.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#9A3412] font-bold text-base flex items-center justify-center mx-auto">4</div>
              <h4 className="font-serif font-bold text-sm text-slate-900">Active Learning</h4>
              <p className="text-xs text-slate-500">Complete 3-5 question quiz with source verification.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-base flex items-center justify-center mx-auto">5</div>
              <h4 className="font-serif font-bold text-sm text-slate-900">Preservation</h4>
              <p className="text-xs text-slate-500">Submit regional knowledge for expert verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POSTERS & AR PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-950 via-[#7C2D12] to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Printable Physical Displays
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
              Print Official Heritage Posters with Single Clean QR Codes
            </h3>
            <p className="text-sm text-amber-100/90 leading-relaxed">
              Designed for cultural exhibitions, schools, and museum galleries. Each poster features high-resolution artwork, invitation copy, and a single QR code routing to its dedicated experience.
            </p>
          </div>
          <Link
            to="/posters"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-lg transition-all hover:scale-105"
          >
            <QrCode className="w-5 h-5" />
            View & Print Posters
          </Link>
        </div>
      </section>
    </div>
  );
};
