import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, ExternalLink, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E293B] text-slate-300 pt-14 pb-10 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-700/80">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9A3412] to-[#C2410C] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-serif font-black text-2xl tracking-wider text-white">
                PARAMPARA
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              SCAN • DISCOVER • PRESERVE
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              A community-oriented digital heritage platform connecting physical traditions to interactive, verified digital experiences.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-800">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Zero Fake Data Guarantee
              </span>
            </div>
          </div>

          {/* Heritage Experiences */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-100">
              Four Regional Traditions
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/tradition/thathera" className="hover:text-amber-400 transition-colors">
                  North: Thathera Metal Craft (Punjab)
                </Link>
              </li>
              <li>
                <Link to="/tradition/toda" className="hover:text-amber-400 transition-colors">
                  South: Toda Embroidery (Tamil Nadu)
                </Link>
              </li>
              <li>
                <Link to="/tradition/chhau" className="hover:text-amber-400 transition-colors">
                  East: Chhau Dance (Eastern India)
                </Link>
              </li>
              <li>
                <Link to="/tradition/warli" className="hover:text-amber-400 transition-colors">
                  West: Warli Painting (Maharashtra)
                </Link>
              </li>
              <li className="pt-1">
                <Link to="/tradition/warli/ar" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                  Launch Warli WebAR <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-100">
              Platform & Verification
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Explore Living Heritage
                </Link>
              </li>
              <li>
                <Link to="/posters" className="hover:text-white transition-colors">
                  Printable Physical Posters & QR
                </Link>
              </li>
              <li>
                <Link to="/sources" className="hover:text-white transition-colors">
                  Verified Institutional Sources
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="hover:text-white transition-colors">
                  Submit Community Knowledge
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About National Heritage Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Initiative Standards & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-100">
              Platform Standards
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-700">
              <p><strong className="text-slate-200">Data Standard:</strong> Zero-Fabrication Archival Grounding</p>
              <p><strong className="text-slate-200">Scope:</strong> Four Strategic Cultural Regions</p>
              <p><strong className="text-slate-200">Architecture:</strong> Open-Source WebAR & Digital Storytelling</p>
            </div>
            <div className="pt-1">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Review Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© 2026 PARAMPARA AR LITE. Authentic cultural documentation under open Indian heritage archives.</p>
          <p className="flex items-center gap-2 text-slate-400">
            Ground Truth: UNESCO ICH • GI Registry India • INTACH
          </p>
        </div>
      </div>
    </footer>
  );
};
