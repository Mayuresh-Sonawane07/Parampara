import React, { useEffect, useState } from 'react';
import { BookOpen, Award, ExternalLink, ShieldCheck, CheckCircle2, Search } from 'lucide-react';
import { fetchSources } from '../services/api';
import { Source } from '../types';

export const SourcesPage: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSources()
      .then((data) => setSources(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const types = ['All', 'UNESCO', 'GOVERNMENT', 'INTACH'];

  const filtered = sources.filter((s) => {
    const matchType = selectedType === 'All' || s.source_type.toUpperCase() === selectedType.toUpperCase();
    const matchSearch =
      !searchQuery.trim() ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="border-b border-[#E6D5C3] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A3412]">
          <Award className="w-4 h-4" />
          Primary Institutional Citations
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Research Sources & Institutional Ground Truth
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          In strict compliance with our Zero-Mock Data mandate, every cultural claim, historical date, making technique, and symbol interpretation in Parampara AR Lite is traceable to authoritative institutional repositories.
        </p>
      </div>

      {/* Source Hierarchy Explainer */}
      <div className="bg-white rounded-2xl border border-[#E6D5C3] p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          Authoritative Source Hierarchy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
            <strong className="text-blue-900 text-sm block">1. UNESCO Representative List</strong>
            <p className="text-slate-600">Nomination dossiers & evaluation committee decisions for Intangible Cultural Heritage of Humanity (Files #00845 and #00337).</p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <strong className="text-emerald-900 text-sm block">2. Government of India Registries</strong>
            <p className="text-slate-600">Geographical Indications Registry (GI #135, GI #342) and Ministry of Culture / Sangeet Natak Akademi repositories.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
            <strong className="text-amber-900 text-sm block">3. INTACH Field Research</strong>
            <p className="text-slate-600">Indian National Trust for Art and Cultural Heritage tribal ethnographic documentation and cultural mapping records.</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedType === t
                  ? 'bg-[#9A3412] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search verified citations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      </div>

      {/* Source Cards List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 font-medium">Loading research citations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm">No sources found matching your query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-[#E6D5C3] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-4xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-orange-50 text-[#9A3412] border border-orange-200">
                    {s.source_type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Archival Verified Status
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                  {s.title}
                </h3>

                <p className="text-xs text-slate-600">
                  <strong>Organization:</strong> {s.organization}
                  {s.author && <> • <strong>Author / Committee:</strong> {s.author}</>}
                </p>

                {s.description && (
                  <p className="text-xs text-slate-600 italic leading-relaxed pt-1">
                    "{s.description}"
                  </p>
                )}
              </div>

              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white transition-colors"
              >
                Access Source Archive <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
