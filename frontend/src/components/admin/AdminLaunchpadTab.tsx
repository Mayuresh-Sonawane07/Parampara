import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Layers,
  Sparkles,
  HelpCircle,
  Crosshair,
  BookOpen,
  Send,
  UserCheck,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { AdminStats } from '../../types';

interface Props {
  stats: AdminStats | null;
  onNavigateTab: (tab: string) => void;
}

export const AdminLaunchpadTab: React.FC<Props> = ({ stats, onNavigateTab }) => {
  const routes = [
    {
      title: 'Cultural Compass & Regional Voice',
      path: '/',
      category: 'Home & Audio Engine',
      description: '4-zone interactive compass with regional speech synthesis (Hindi, Marathi, English) and live preservation metrics.',
      icon: Compass,
      color: 'from-amber-600 to-orange-700',
      actionTab: 'audit'
    },
    {
      title: 'Living Traditions Catalog',
      path: '/explore',
      category: 'Traditions Exploration',
      description: 'Regional heritage explorer with North, South, East, West filters and institutional safeguard indicators.',
      icon: Layers,
      color: 'from-orange-600 to-amber-700',
      actionTab: 'traditions'
    },
    {
      title: 'Thathera Utensil Craft Journey',
      path: '/tradition/thathera-craft',
      category: 'Craft Journey Module',
      description: '8-step authentic metallurgic sequence from raw brass-copper ingots to sound-tuned utilitarian vessels.',
      icon: Sparkles,
      color: 'from-amber-700 to-yellow-800',
      actionTab: 'traditions'
    },
    {
      title: 'Toda Embroidery Motif Explorer',
      path: '/tradition/toda-embroidery',
      category: 'Motif Explorer Module',
      description: 'Sacred Poothkuly counted-thread geometric shawls, buffalo horns, and Nilgiri flora motifs.',
      icon: Sparkles,
      color: 'from-red-700 to-rose-800',
      actionTab: 'traditions'
    },
    {
      title: 'Chhau Martial Dance Explorer',
      path: '/tradition/chhau-dance',
      category: 'Performance Module',
      description: 'Interactive comparison of Seraikella, Purulia, and Mayurbhanj styles, sacred clay masks, and Ufli footwork.',
      icon: Sparkles,
      color: 'from-purple-700 to-indigo-800',
      actionTab: 'traditions'
    },
    {
      title: 'Warli Sacred Canvas (30 Hotspots)',
      path: '/tradition/warli-painting',
      category: 'Sacred Art Canvas',
      description: 'Lagna Chowk Mother Goddess Palghat central square, Tarpa cosmic spiral, and 30 interactive hotspots.',
      icon: Crosshair,
      color: 'from-emerald-700 to-teal-800',
      actionTab: 'hotspots'
    },
    {
      title: 'WebAR Spatial Experience',
      path: '/tradition/warli/ar',
      category: 'Augmented Reality Camera',
      description: 'Real-time camera target tracker with spatial audio cues and interactive motif projections.',
      icon: Crosshair,
      color: 'from-teal-700 to-cyan-800',
      actionTab: 'hotspots'
    },
    {
      title: 'Heritage Knowledge Quizzes',
      path: '/quizzes',
      category: 'Curatorial Assessment',
      description: 'Zero mock data quizzes with institutional source citations and instant score certification.',
      icon: HelpCircle,
      color: 'from-blue-700 to-sky-800',
      actionTab: 'quizzes'
    },
    {
      title: 'Community Heritage Archiving',
      path: '/contribute',
      category: 'Community Voice Pipeline',
      description: 'Public contribution intake with ethical consent protocol and curator review queue.',
      icon: Send,
      color: 'from-amber-700 to-orange-800',
      actionTab: 'submissions'
    },
    {
      title: 'Contributor Custodian Portal',
      path: '/contributor/dashboard',
      category: 'User Authentication',
      description: 'Registered contributor dashboard for tracking submission review remarks and publication status.',
      icon: UserCheck,
      color: 'from-emerald-700 to-green-800',
      actionTab: 'submissions'
    },
    {
      title: 'Archival Sources & Verification',
      path: '/sources',
      category: 'Primary Citations',
      description: 'Direct redirectable dossiers to UNESCO Inscriptions, Geographical Indications Registry, and INTACH.',
      icon: BookOpen,
      color: 'from-slate-700 to-zinc-800',
      actionTab: 'sources'
    },
    {
      title: 'Print-Ready Cultural Posters',
      path: '/posters',
      category: 'Print & Outreach',
      description: 'High-resolution posters with scannable dynamic QR codes and institutional provenance badges.',
      icon: FileText,
      color: 'from-stone-700 to-slate-800',
      actionTab: 'traditions'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Master Launchpad Banner */}
      <div className="bg-gradient-to-r from-[#7C2D12] via-[#9A3412] to-amber-900 rounded-3xl text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            Full Platform Control Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Parampara Heritage Launchpad & Live Route Master
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
            As Administrator, you have total access to every subsystem of the platform. Jump directly to any public page in a new window, inspect active routes, or open the corresponding curatorial management tab.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-xs font-bold text-amber-200">
          <span>Traditions: {stats?.total_traditions ?? 0}</span>
          <span>&bull;</span>
          <span>Research Sources: {stats?.total_sources ?? 0}</span>
          <span>&bull;</span>
          <span>Pending Submissions: {stats?.pending_contributions ?? 0}</span>
          <span>&bull;</span>
          <span>Approved Voice: {stats?.approved_contributions ?? 0}</span>
        </div>
      </div>

      {/* Grid of All Site Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {routes.map((route, idx) => {
          const Icon = route.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#9A3412]/50 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {route.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Live Route
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${route.color} text-white flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-sm group-hover:text-[#9A3412] transition-colors">
                      {route.title}
                    </h3>
                    <div className="font-mono text-[11px] text-slate-400">{route.path}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {route.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={route.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#9A3412] hover:bg-orange-50 transition-colors"
                >
                  <span>Test Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => onNavigateTab(route.actionTab)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
