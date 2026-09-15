import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0F17] text-slate-300 pt-16 pb-12 border-t border-amber-900/40 mt-auto relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-[#D97706] flex items-center justify-center text-white shadow-lg ring-1 ring-amber-400/40">
                <span className="text-lg select-none">🪷</span>
              </div>
              <span className="font-cinzel font-black text-2xl tracking-widest text-white">
                PARAMPARA
              </span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400 font-sans">
              SCAN • DISCOVER • PRESERVE
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's living digital heritage archive connecting physical traditions with research-grounded digital storytelling and WebAR experiences.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                100% Verified Primary Archival Sourcing
              </span>
            </div>
          </div>

          {/* Heritage Experiences */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-300 font-cinzel">
              Four Strategic Cultural Zones
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/tradition/thathera" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform"></span>
                  North: Thathera Metal Craft (Punjab)
                </Link>
              </li>
              <li>
                <Link to="/tradition/toda" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform"></span>
                  South: Toda Embroidery (Tamil Nadu)
                </Link>
              </li>
              <li>
                <Link to="/tradition/chhau" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform"></span>
                  East: Chhau Dance (Eastern India)
                </Link>
              </li>
              <li>
                <Link to="/tradition/warli" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform"></span>
                  West: Warli Painting (Maharashtra)
                </Link>
              </li>
              <li className="pt-1.5">
                <Link to="/tradition/warli/ar" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Launch Warli WebAR Experience <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-300 font-cinzel">
              Platform & Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Explore Living Directory
                </Link>
              </li>
              <li>
                <Link to="/posters" className="hover:text-white transition-colors">
                  Printable Exhibition Posters & QR
                </Link>
              </li>
              <li>
                <Link to="/sources" className="hover:text-white transition-colors">
                  Archival Research Citations
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="hover:text-white transition-colors">
                  Community Heritage Submissions
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Platform Architecture & Zero-Fabrication
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Curatorial Desk */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-300 font-cinzel">
              Authenticity Standards
            </h4>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
              <p><strong className="text-slate-200">Data Ground Truth:</strong> UNESCO ICH, GI Registry India & INTACH Archives.</p>
              <p><strong className="text-slate-200">AR Interaction:</strong> Client-Side WebAR Computer Vision with 30-Motif Taxonomy.</p>
              <p><strong className="text-slate-200">Preservation:</strong> Moderated Community Knowledge Ingestion.</p>
            </div>
            <div className="pt-1">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 px-3.5 py-2 rounded-xl transition-all border border-slate-700 hover:border-slate-500 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Curatorial Admin Desk
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 PARAMPARA AR LITE. Living Cultural Heritage Preservation Platform.</p>
          <p className="flex items-center gap-2 text-slate-400">
            <span>Archival Citations: UNESCO ICH</span>
            <span>•</span>
            <span>GI Registry</span>
            <span>•</span>
            <span>INTACH</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
