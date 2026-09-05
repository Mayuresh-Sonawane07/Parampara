import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, ZoomOut, RotateCcw, Info, Sparkles, ChevronRight, Layers, BookOpen } from 'lucide-react';
import { Experience, ExperienceItem } from '../../types';
import { SourceBadge } from '../../components/SourceBadge';

interface MotifExplorerProps {
  experience: Experience;
}

export const MotifExplorer: React.FC<MotifExplorerProps> = ({ experience }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedMotif, setSelectedMotif] = useState<ExperienceItem | null>(null);
  const [activeTab, setActiveTab] = useState<'motifs' | 'technique'>('motifs');

  const items = experience.items || [];
  const motifs = items.filter((it) => it.category_or_style === 'Motif');
  const techniques = items.filter((it) => it.category_or_style === 'Technique');

  // Interactive hotspots on the Toda Poothkulli shawl canvas
  const motifCoordinates: { [key: string]: { x: number; y: number } } = {
    'Pukhoor': { x: 25, y: 35 },
    'Modi': { x: 75, y: 35 },
    'Karthal': { x: 50, y: 55 },
    'Enepukhoor': { x: 50, y: 80 }
  };

  const currentMotifItem = selectedMotif || motifs[0] || items[0];

  return (
    <div className="space-y-8">
      {/* Overview header */}
      <div className="bg-gradient-to-r from-red-950 via-[#7C2D12] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-200 border border-red-400/30 mb-3">
            South India • Nilgiris, Tamil Nadu • GI Registered #135
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
            {experience.title}
          </h2>
          <p className="text-sm sm:text-base text-red-100/90 mt-2 leading-relaxed">
            {experience.description}
          </p>
        </div>
      </div>

      {/* Mode Switcher: Motifs vs How It Is Made */}
      <div className="flex items-center gap-3 border-b border-[#E6D5C3] pb-2">
        <button
          onClick={() => setActiveTab('motifs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'motifs'
              ? 'bg-[#9A3412] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Interactive Motif Canvas
        </button>

        <button
          onClick={() => setActiveTab('technique')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'technique'
              ? 'bg-[#9A3412] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          How It Is Made (Sequential Steps)
        </button>
      </div>

      {/* TAB 1: INTERACTIVE MOTIF EXPLORER */}
      {activeTab === 'motifs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Interactive Shawl Canvas */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6D5C3] p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Poothkulli Fabric Viewer (Red & Black Counted Thread)
              </span>
              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                  className="p-1.5 rounded hover:bg-white text-slate-700 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-slate-600">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
                  className="p-1.5 rounded hover:bg-white text-slate-700 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded hover:bg-white text-slate-700 transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated Shawl with SVG motifs */}
            <div className="relative overflow-hidden my-4 rounded-xl bg-[#F5EFEB] border border-[#E2D4C3] min-h-[380px] flex items-center justify-center">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="w-[90%] h-[340px] bg-[#FAF6F0] rounded-lg shadow-inner relative p-4 border border-[#D9C7B2]"
              >
                {/* Authentic coarse weave texture lines */}
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  {/* Decorative Red and Black Border Bands */}
                  <rect x="10" y="10" width="380" height="15" fill="#991B1B" />
                  <rect x="10" y="28" width="380" height="8" fill="#18181B" />
                  <rect x="10" y="277" width="380" height="15" fill="#991B1B" />

                  {/* Motif 1: Pukhoor Flower (Top Left) */}
                  <g transform="translate(80, 80)">
                    <circle cx="0" cy="0" r="18" fill="none" stroke="#991B1B" strokeWidth="4" />
                    <circle cx="0" cy="0" r="8" fill="#18181B" />
                    <line x1="-25" y1="0" x2="25" y2="0" stroke="#991B1B" strokeWidth="3" />
                    <line x1="0" y1="-25" x2="0" y2="25" stroke="#991B1B" strokeWidth="3" />
                  </g>

                  {/* Motif 2: Modi Horn (Top Right) */}
                  <g transform="translate(300, 80)">
                    <path
                      d="M-30,20 Q0,-30 30,20"
                      fill="none"
                      stroke="#18181B"
                      strokeWidth="5"
                    />
                    <path
                      d="M-20,25 Q0,-15 20,25"
                      fill="none"
                      stroke="#991B1B"
                      strokeWidth="3"
                    />
                  </g>

                  {/* Motif 3: Karthal Kraal Grid (Center) */}
                  <g transform="translate(200, 160)">
                    <rect x="-35" y="-30" width="70" height="60" fill="none" stroke="#991B1B" strokeWidth="4" />
                    <line x1="-35" y1="0" x2="35" y2="0" stroke="#18181B" strokeWidth="3" />
                    <line x1="0" y1="-30" x2="0" y2="30" stroke="#18181B" strokeWidth="3" />
                    <rect x="-15" y="-12" width="30" height="24" fill="#991B1B" opacity="0.3" />
                  </g>

                  {/* Motif 4: Enepukhoor Star (Bottom Center) */}
                  <g transform="translate(200, 240)">
                    <polygon
                      points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5"
                      fill="#991B1B"
                    />
                    <circle cx="0" cy="0" r="3" fill="#18181B" />
                  </g>
                </svg>

                {/* Clickable Hotspot Pins */}
                {motifs.map((motif) => {
                  const keyName = Object.keys(motifCoordinates).find((k) =>
                    motif.title.includes(k)
                  );
                  const coords = keyName ? motifCoordinates[keyName] : { x: 50, y: 50 };
                  const isSelected = currentMotifItem?.id === motif.id;

                  return (
                    <button
                      key={motif.id}
                      onClick={() => setSelectedMotif(motif)}
                      style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 flex items-center gap-1 p-1 rounded-full transition-transform ${
                        isSelected ? 'scale-125' : 'hover:scale-110'
                      }`}
                      title={motif.title}
                    >
                      <span className="relative flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span
                          className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center text-[10px] font-bold text-white shadow-md border-2 border-white ${
                            isSelected ? 'bg-[#9A3412]' : 'bg-slate-900'
                          }`}
                        >
                          ●
                        </span>
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                        {motif.title.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Tap any pulsating pin on the Poothkulli fabric to inspect its cultural documentation.
            </p>
          </div>

          {/* Right Column: Selected Motif Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6D5C3] p-6 shadow-sm space-y-6 flex flex-col justify-between">
            {currentMotifItem ? (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-900 border border-red-200">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  Documented Geometric Motif
                </div>

                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  {currentMotifItem.title}
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  {currentMotifItem.description}
                </p>

                {currentMotifItem.cultural_context && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Cultural Context
                    </h4>
                    <p className="text-xs text-amber-950/90 leading-relaxed">
                      {currentMotifItem.cultural_context}
                    </p>
                  </div>
                )}

                {currentMotifItem.regional_perspective && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider mb-0.5">
                      Nilgiri Region & Practice
                    </span>
                    <p className="text-xs text-slate-600">
                      {currentMotifItem.regional_perspective}
                    </p>
                  </div>
                )}

                {currentMotifItem.source && (
                  <div className="pt-2">
                    <SourceBadge source={currentMotifItem.source} />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">Select a motif pin on the left.</div>
            )}

            {/* Motif selector list */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                All Verified Toda Motifs
              </span>
              <div className="grid grid-cols-2 gap-2">
                {motifs.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMotif(m)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      currentMotifItem?.id === m.id
                        ? 'bg-[#9A3412] text-white border-[#7C2D12]'
                        : 'bg-slate-50 text-slate-700 hover:bg-orange-50 border-slate-200'
                    }`}
                  >
                    {m.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOW IT IS MADE (SEQUENTIAL STEPS) */}
      {activeTab === 'technique' && (
        <div className="bg-white rounded-2xl border border-[#E6D5C3] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              The Counted-Thread Embroidery Process
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Executed entirely by counting warp and weft yarns from the reverse side without stencils or tracing drawings.
            </p>
          </div>

          <div className="space-y-4">
            {techniques.map((step, idx) => (
              <div
                key={step.id}
                className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl border border-slate-200 bg-[#FAF8F5] hover:border-amber-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#9A3412] text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <div className="space-y-2 flex-grow">
                  <h4 className="font-serif font-bold text-lg text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {step.description}
                  </p>
                  {step.cultural_context && (
                    <p className="text-xs text-amber-900 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                      <strong>Cultural Insight:</strong> {step.cultural_context}
                    </p>
                  )}
                  {step.tool_or_material && (
                    <span className="inline-block text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                      Material: {step.tool_or_material}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer: Take Toda Quiz */}
      <div className="bg-[#FAF8F5] border border-[#E6D5C3] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-lg text-slate-900">
            Learned about Toda Pukhoor Motifs?
          </h4>
          <p className="text-sm text-slate-600">
            Test your understanding with 3 verified multiple-choice questions grounded in GI Registry archives.
          </p>
        </div>
        <Link
          to="/tradition/toda/quiz"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md transition-colors"
        >
          Take Toda Quiz <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
