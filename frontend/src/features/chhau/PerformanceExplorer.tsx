import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Music, Sparkles, ChevronRight, Award, Theater, Flame, Compass } from 'lucide-react';
import { Experience, ExperienceItem } from '../../types';
import { SourceBadge } from '../../components/SourceBadge';

interface PerformanceExplorerProps {
  experience: Experience;
}

export const PerformanceExplorer: React.FC<PerformanceExplorerProps> = ({ experience }) => {
  const [selectedStyle, setSelectedStyle] = useState<'Seraikella' | 'Purulia' | 'Mayurbhanj'>('Seraikella');

  const items = experience.items || [];
  const activeItems = items.filter((it) => it.category_or_style === selectedStyle);
  const musicItems = items.filter((it) => it.category_or_style === 'Music');

  const styleMeta = {
    Seraikella: {
      state: 'Jharkhand',
      maskType: 'Stylized Pastel Papier-Mâché',
      movementNature: 'Lyrical, poetic Upalayas & Topkas',
      patronage: 'Bhanja Royal Dynasty of Seraikella',
      accentColor: 'from-blue-950 to-indigo-900',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
    },
    Purulia: {
      state: 'West Bengal',
      maskType: 'Elaborate Feathered Charida Masks',
      movementNature: 'Acrobatic 360° somersaults & high leaps',
      patronage: 'Village Akhadas & Community Gajan',
      accentColor: 'from-amber-950 to-orange-900',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-200',
    },
    Mayurbhanj: {
      state: 'Odisha',
      maskType: 'Maskless (Bare-Faced Expression)',
      movementNature: 'Rigorous martial Chalis & Dharans',
      patronage: 'Baripada Royal Court & Sahi Akhadas',
      accentColor: 'from-emerald-950 to-teal-900',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    },
  };

  const currentMeta = styleMeta[selectedStyle];

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#7C2D12] to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-amber-950 mb-3">
            East India • UNESCO Inscribed (File 00337)
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
            {experience.title}
          </h2>
          <p className="text-sm sm:text-base text-amber-100/90 mt-2 leading-relaxed">
            Chhau comprises three recognized regional styles that developed distinct aesthetic philosophies, mask traditions, and martial footwork.
          </p>
        </div>
      </div>

      {/* 3-Style Primary Selector */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E6D5C3] shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Select Regional Style:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['Seraikella', 'Purulia', 'Mayurbhanj'] as const).map((style) => {
            const isSelected = selectedStyle === style;
            const meta = styleMeta[style];
            return (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#9A3412] text-white border-[#7C2D12] shadow-md ring-2 ring-orange-300'
                    : 'bg-slate-50 hover:bg-orange-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-lg">{style} Chhau</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {meta.state}
                  </span>
                </div>
                <p className={`text-xs ${isSelected ? 'text-amber-100' : 'text-slate-600'}`}>
                  <strong>Mask:</strong> {meta.maskType}
                </p>
                <p className={`text-xs mt-1 ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                  {meta.movementNature}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Style Detailed Features Display */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              {selectedStyle} Chhau Tradition ({currentMeta.state})
            </h3>
            <p className="text-xs text-slate-600">
              Key characteristics documented under UNESCO Representative List File 00337.
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentMeta.badgeColor}`}>
            {currentMeta.maskType}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E6D5C3] p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9A3412] bg-orange-50 px-2.5 py-1 rounded-md">
                  {idx === 0 && <Theater className="w-3.5 h-3.5" />}
                  {idx === 1 && <Flame className="w-3.5 h-3.5" />}
                  {idx === 2 && <Compass className="w-3.5 h-3.5" />}
                  <span>{item.title.split(':')[1] ? item.title.split(':')[0] : 'Feature'}</span>
                </div>

                <h4 className="font-serif font-bold text-lg text-slate-900 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {item.description}
                </p>

                {item.cultural_context && (
                  <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed">
                    <strong>Cultural Context:</strong> {item.cultural_context}
                  </div>
                )}

                {item.tool_or_material && (
                  <div className="text-[11px] text-slate-500 font-medium">
                    <strong>Materials / Props:</strong> {item.tool_or_material}
                  </div>
                )}
              </div>

              {item.source && (
                <div className="pt-3 border-t border-slate-100">
                  <SourceBadge source={item.source} compact />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rhythmic Ensemble & Music Section */}
      <div className="bg-white rounded-2xl border border-[#E6D5C3] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Chhau Musical Accompaniment & Instruments
            </h3>
            <p className="text-xs text-slate-500">
              The high-energy acoustic orchestra shared across all three Chhau traditions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {musicItems.map((m) => (
            <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-[#FAF8F5] space-y-2">
              <h4 className="font-serif font-bold text-base text-slate-900">{m.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{m.description}</p>
              <div className="text-[11px] text-[#9A3412] font-semibold">
                Instruments: {m.tool_or_material}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distinct Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-[#E6D5C3] p-6 shadow-sm overflow-x-auto">
        <h4 className="font-serif font-bold text-lg text-slate-900 mb-3">
          Style Comparison Matrix
        </h4>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-2.5 font-bold text-slate-700">Style</th>
              <th className="p-2.5 font-bold text-slate-700">Region & State</th>
              <th className="p-2.5 font-bold text-slate-700">Mask Tradition</th>
              <th className="p-2.5 font-bold text-slate-700">Movement Aesthetic</th>
              <th className="p-2.5 font-bold text-slate-700">Historic Patronage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className={selectedStyle === 'Seraikella' ? 'bg-orange-50/50' : ''}>
              <td className="p-2.5 font-bold text-slate-900">Seraikella</td>
              <td className="p-2.5 text-slate-600">Jharkhand</td>
              <td className="p-2.5 text-slate-600">Stylized pastel papier-mâché masks</td>
              <td className="p-2.5 text-slate-600">Poetic, lyrical Topkas & Upalayas</td>
              <td className="p-2.5 text-slate-600">Bhanja Kings of Seraikella</td>
            </tr>
            <tr className={selectedStyle === 'Purulia' ? 'bg-orange-50/50' : ''}>
              <td className="p-2.5 font-bold text-slate-900">Purulia</td>
              <td className="p-2.5 text-slate-600">West Bengal</td>
              <td className="p-2.5 text-slate-600">Oversized Charida feathered masks</td>
              <td className="p-2.5 text-slate-600">High acrobatic leaps & somersaults</td>
              <td className="p-2.5 text-slate-600">Village Akhadas & Community Gajan</td>
            </tr>
            <tr className={selectedStyle === 'Mayurbhanj' ? 'bg-orange-50/50' : ''}>
              <td className="p-2.5 font-bold text-slate-900">Mayurbhanj</td>
              <td className="p-2.5 text-slate-600">Odisha</td>
              <td className="p-2.5 text-emerald-800 font-bold">Maskless (Dancers bare-faced)</td>
              <td className="p-2.5 text-slate-600">Martial warrior Chalis & Dharans</td>
              <td className="p-2.5 text-slate-600">Mayurbhanj Rulers (Baripada)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Footer: Take Chhau Quiz */}
      <div className="bg-[#FAF8F5] border border-[#E6D5C3] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-lg text-slate-900">
            Explored all Three Chhau Traditions?
          </h4>
          <p className="text-sm text-slate-600">
            Test your understanding with 3 verified questions sourced from UNESCO documentation.
          </p>
        </div>
        <Link
          to="/tradition/chhau/quiz"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md transition-colors"
        >
          Take Chhau Quiz <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
