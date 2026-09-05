import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowLeft, ChevronRight } from 'lucide-react';
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
        <p className="text-slate-600 font-medium">Preparing interactive experience...</p>
      </div>
    );
  }

  if (error || !tradition) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900">Experience Unavailable</h2>
        <p className="text-slate-600">{error || 'Could not load the requested experience.'}</p>
        <Link to="/explore" className="inline-block px-5 py-2.5 rounded-xl bg-[#9A3412] text-white font-bold text-sm">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <Link
          to={`/tradition/${tradition.slug}`}
          className="flex items-center gap-1.5 hover:text-[#9A3412] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {tradition.name} Overview
        </Link>

        <span className="text-slate-400">
          Tradition {tradition.id} of 4 • {tradition.region} India
        </span>
      </div>

      {/* Render matching experience based on tradition slug */}
      {slug === 'thathera' && experience && <CraftJourney experience={experience} />}
      {slug === 'toda' && experience && <MotifExplorer experience={experience} />}
      {slug === 'chhau' && experience && <PerformanceExplorer experience={experience} />}
      {slug === 'warli' && tradition.ar_experience && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#9A3412]" />
              <div>
                <h4 className="font-serif font-bold text-sm text-slate-900">WebAR Camera Mode Available</h4>
                <p className="text-xs text-slate-600">You can also experience Warli through real-time camera target recognition.</p>
              </div>
            </div>
            <Link
              to="/tradition/warli/ar"
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-[#9A3412] text-white hover:bg-[#7C2D12] transition-colors"
            >
              Launch WebAR Camera
            </Link>
          </div>
          <WarliDigitalExperience arExperience={tradition.ar_experience} />
        </div>
      )}
    </div>
  );
};
