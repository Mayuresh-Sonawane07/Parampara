import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, BookOpen, Send, ShieldCheck, Menu, X, QrCode } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6D5C3] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-[#C2410C] flex items-center justify-center text-[#FAF8F5] shadow-md shadow-orange-950/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-2xl tracking-wider text-[#1E293B]">
                  PARAMPARA
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-amber-100 text-amber-900 border border-amber-300/80 rounded-md">
                  AR LITE
                </span>
              </div>
              <p className="text-[11px] font-medium tracking-widest text-[#7C2D12] uppercase">
                Scan • Discover • Preserve
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/explore"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/explore')
                  ? 'bg-[#9A3412] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Heritage
            </Link>

            <Link
              to="/tradition/warli/ar"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/tradition/warli/ar')
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              Warli AR
            </Link>

            <Link
              to="/posters"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/posters')
                  ? 'bg-[#9A3412] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Posters & QR
            </Link>

            <Link
              to="/sources"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/sources')
                  ? 'bg-[#9A3412] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Sources
            </Link>

            <Link
              to="/contribute"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/contribute')
                  ? 'bg-[#9A3412] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-50'
              }`}
            >
              <Send className="w-4 h-4" />
              Contribute
            </Link>

            <div className="h-6 w-px bg-slate-300 mx-1" />

            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-400 bg-white"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-orange-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6D5C3] bg-[#FAF8F5] px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            <Compass className="w-5 h-5 text-[#9A3412]" />
            Explore Heritage
          </Link>
          <Link
            to="/tradition/warli/ar"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-amber-900 bg-amber-50"
          >
            <Sparkles className="w-5 h-5 text-amber-600" />
            Warli WebAR Experience
          </Link>
          <Link
            to="/posters"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            <QrCode className="w-5 h-5 text-[#9A3412]" />
            Physical Posters & QR
          </Link>
          <Link
            to="/sources"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            <BookOpen className="w-5 h-5 text-[#9A3412]" />
            Research Sources
          </Link>
          <Link
            to="/contribute"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            <Send className="w-5 h-5 text-[#9A3412]" />
            Community Contribution
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50"
          >
            About Parampara Platform
          </Link>
          <div className="pt-2 border-t border-slate-200">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              Admin Verification Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
