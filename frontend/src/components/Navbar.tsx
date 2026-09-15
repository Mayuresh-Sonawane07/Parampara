import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  BookOpen,
  Send,
  ShieldCheck,
  Menu,
  X,
  QrCode,
  LogOut,
  Layers,
  Activity,
  ExternalLink,
  CheckCircle2,
  Camera,
  Info
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<string>('Admin');
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const isTabActive = (tab: string) => {
    const searchParams = new URLSearchParams(location.search);
    const currentTab = searchParams.get('tab') || 'submissions';
    return location.pathname === '/admin' && currentTab === tab;
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('parampara_admin_token');
      const user = localStorage.getItem('parampara_admin_user') || 'Admin';
      setIsAdminLoggedIn(!!token);
      setAdminUser(user);
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth_change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth_change', checkAuth);
    };
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    localStorage.removeItem('parampara_admin_token');
    localStorage.removeItem('parampara_admin_user');
    setIsAdminLoggedIn(false);
    window.dispatchEvent(new Event('auth_change'));
    setMobileMenuOpen(false);
    navigate('/admin/login');
  };

  // ----------------------------------------------------
  // ADMIN NAVBAR (Displayed exclusively when logged in as admin)
  // ----------------------------------------------------
  if (isAdminLoggedIn) {
    return (
      <header className="sticky top-0 z-50 bg-[#0F172A]/95 text-slate-100 border-b border-amber-500/30 shadow-xl transition-all backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Admin Brand Identity */}
            <Link to="/admin" className="flex items-center gap-3.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
                <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel font-black text-2xl tracking-wider text-white">
                    PARAMPARA
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-black tracking-widest uppercase bg-amber-400 text-slate-950 rounded-md shadow-sm">
                    ADMIN DESK
                  </span>
                </div>
                <p className="text-[11px] font-medium tracking-widest text-amber-300 uppercase">
                  Heritage Curatorial & Verification Desk
                </p>
              </div>
            </Link>

            {/* Desktop Admin Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <Link
                to="/admin?tab=submissions"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isTabActive('submissions')
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Submissions Queue
              </Link>

              <Link
                to="/admin?tab=traditions"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isTabActive('traditions')
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                Traditions Manager
              </Link>

              <Link
                to="/admin?tab=sources"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isTabActive('sources')
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                Archival Sources
              </Link>

              <Link
                to="/admin?tab=audit"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isTabActive('audit')
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                System Audit
              </Link>

              <div className="h-6 w-px bg-slate-700 mx-2" />

              {/* Preview Public Site */}
              <Link
                to="/explore"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 hover:border-slate-500"
                title="Open Public Visitor View in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                Public Site
              </Link>

              {/* Logged in Admin Pill & Sign Out */}
              <div className="flex items-center gap-2 pl-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{adminUser}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-600/90 hover:bg-rose-600 text-white shadow-sm transition-all cursor-pointer"
                  title="Sign out of Admin Console"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>

            {/* Mobile menu toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-rose-400 hover:bg-slate-800"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-200 hover:bg-slate-800 focus:outline-none"
                aria-label="Toggle admin menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Admin Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/90 bg-[#0F172A] px-4 pt-3 pb-6 space-y-2">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl mb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Logged in as {adminUser}
              </span>
              <span className="text-[10px] uppercase font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                Super Admin
              </span>
            </div>

            <Link
              to="/admin?tab=submissions"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                isTabActive('submissions')
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              Submissions Queue
            </Link>

            <Link
              to="/admin?tab=traditions"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                isTabActive('traditions')
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-5 h-5 text-amber-400" />
              Traditions Manager
            </Link>

            <Link
              to="/admin?tab=sources"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                isTabActive('sources')
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-5 h-5 text-amber-400" />
              Archival Sources
            </Link>

            <Link
              to="/admin?tab=audit"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                isTabActive('audit')
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-5 h-5 text-emerald-400" />
              System Audit
            </Link>

            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800"
            >
              <ExternalLink className="w-5 h-5 text-amber-400" />
              Preview Public Site
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out Administrator
            </button>
          </div>
        )}
      </header>
    );
  }

  // ----------------------------------------------------
  // PUBLIC VISITOR NAVBAR (Displayed for regular visitors)
  // ----------------------------------------------------
  return (
    <header className="sticky top-0 z-50 glass-navbar transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-[#D97706] flex items-center justify-center text-white shadow-lg shadow-orange-950/25 group-hover:scale-105 transition-all duration-300 ring-2 ring-amber-300/40">
                <span className="text-xl select-none" role="img" aria-label="lotus">🪷</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#FAF8F5] shadow-xs animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-black text-2xl tracking-widest text-slate-900 group-hover:text-[#9A3412] transition-colors">
                  PARAMPARA
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-amber-100 to-orange-100 text-amber-950 border border-amber-300/90 rounded-md shadow-xs">
                  AR LITE
                </span>
              </div>
              <p className="text-[10.5px] font-bold tracking-widest text-[#9A3412] uppercase font-sans">
                Scan • Discover • Preserve
              </p>
            </div>
          </Link>

          {/* Live Heritage Badge (Desktop Center) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-300/60 text-xs font-semibold text-amber-950">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium tracking-wide">4 Cultural Zones • Verified Primary Archives</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <Link
              to="/explore"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/explore')
                  ? 'bg-[#9A3412] text-white shadow-md shadow-orange-950/20'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-100/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            {/* Warli AR Feature Highlight Button */}
            <Link
              to="/tradition/warli/ar"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/tradition/warli/ar')
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20'
                  : 'text-amber-950 bg-gradient-to-r from-amber-100 to-amber-200/80 hover:from-amber-200 hover:to-amber-300 border border-amber-300/80 shadow-xs'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-700" />
              <span>WebAR Camera</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-500 text-white rounded">Live</span>
            </Link>

            <Link
              to="/posters"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/posters')
                  ? 'bg-[#9A3412] text-white shadow-md shadow-orange-950/20'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-100/60'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Posters & QR</span>
            </Link>

            <Link
              to="/sources"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/sources')
                  ? 'bg-[#9A3412] text-white shadow-md shadow-orange-950/20'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-100/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Sources</span>
            </Link>

            <Link
              to="/contribute"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/contribute')
                  ? 'bg-[#9A3412] text-white shadow-md shadow-orange-950/20'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-100/60'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Contribute</span>
            </Link>

            <div className="h-6 w-px bg-[#E6D5C3] mx-1" />

            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-300/80 hover:border-slate-400 bg-white shadow-xs transition-all"
              title="Curatorial & Admin Verification Desk"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#9A3412]" />
              <span>Admin Desk</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/tradition/warli/ar"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>WebAR</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-orange-100/70 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6D5C3] bg-[#FAF8F5]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2.5 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 text-xs font-bold text-[#9A3412]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> National Digital Heritage Initiative
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">Active</span>
          </div>

          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <Compass className="w-5 h-5 text-[#9A3412]" />
            Explore Living Heritage
          </Link>

          <Link
            to="/tradition/warli/ar"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold text-amber-950 bg-amber-100 border border-amber-300/80 shadow-xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-amber-800" />
              Warli WebAR Scanner
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-600 text-white">Live</span>
          </Link>

          <Link
            to="/posters"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <QrCode className="w-5 h-5 text-[#9A3412]" />
            Physical Posters & QR
          </Link>

          <Link
            to="/sources"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-[#9A3412]" />
            Archival Research Sources
          </Link>

          <Link
            to="/contribute"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <Send className="w-5 h-5 text-[#9A3412]" />
            Submit Community Heritage
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <Info className="w-5 h-5 text-[#9A3412]" />
            About Parampara Platform
          </Link>

          <div className="pt-3 border-t border-slate-200">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#9A3412]" />
              Curatorial Admin Desk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
