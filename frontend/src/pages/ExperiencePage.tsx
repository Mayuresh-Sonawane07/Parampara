import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowLeft, ChevronRight, HelpCircle, Camera } from 'lucide-react';
import { fetchTradition, fetchExperience } from '../services/api';
import { TraditionDetail, Experience } from '../types';
import { CraftJourney } from '../features/thathera/CraftJourney';
import { MotifExplorer } from '../features/toda/MotifExplorer';
import { PerformanceExplorer } from '../features/chhau/PerformanceExplorer';
import { WarliDigitalExperience } from '../features/warli/WarliDigitalExperience';

export const ExperiencePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tradition, setTradition] = useState<TraditionDetail | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([fetchTradition(slug), fetchExperience(slug)])
      .then(([tData, eData]) => {
        setTradition(tData);
        setExperience(eData);
      })
      .catch((err) => setError(err.message || 'Failed to load experience'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Preparing interactive cultural experience...
        </p>
      </div>
    );
  }

  if (error || !tradition) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-slate-900">Experience Unavailable</h2>
        <p className="text-slate-600">{error || 'Could not load the requested experience.'}</p>
        <Link to="/explore" className="inline-block px-6 py-3 rounded-xl bg-[#9A3412] text-white font-bold text-sm shadow-md">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Bar */}
      <div className="glass-card rounded-2xl px-5 py-3 border border-[#E6D5C3] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-600 font-sans">
        <Link
          to={`/tradition/${tradition.slug}`}
          className="flex items-center gap-1.5 hover:text-[#9A3412] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {tradition.name} Dossier</span>
        </Link>

        <div className="flex items-center gap-4 text-slate-500">
          <Link
            to={`/tradition/${tradition.slug}/quiz`}
            className="flex items-center gap-1 text-[#9A3412] hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Take Heritage Quiz</span>
          </Link>
          <span className="hidden sm:inline">•</span>
          <span className="text-slate-400">
            {tradition.region} India • {tradition.state}
          </span>
        </div>
      </div>

      {/* Render matching experience based on tradition slug */}
      {slug === 'thathera' && experience && <CraftJourney experience={experience} />}
      {slug === 'toda' && experience && <MotifExplorer experience={experience} />}
      {slug === 'chhau' && experience && <PerformanceExplorer experience={experience} />}
      {slug === 'warli' && tradition.ar_experience && (
        <div className="space-y-6">
          <div className="glass-card bg-amber-50/80 border border-amber-300 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-200 text-amber-950 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Camera className="w-5 h-5 text-[#9A3412]" />
              </div>
              <div>
                <h4 className="font-cinzel font-bold text-base text-slate-900">WebAR Camera View Available</h4>
                <p className="text-xs text-slate-600 font-sans">You can also experience Warli through real-time camera target recognition and 30 documented motifs.</p>
              </div>
            </div>
            <Link
              to="/tradition/warli/ar"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-[#9A3412] text-white hover:bg-[#7C2D12] shadow-md transition-all hover:scale-102"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Launch WebAR Camera</span>
            </Link>
          </div>
          <WarliDigitalExperience arExperience={tradition.ar_experience} />
        </div>
      )}
    </div>
  );
};

export default ExperiencePage;
