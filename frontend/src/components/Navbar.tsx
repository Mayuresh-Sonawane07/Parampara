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
  Info,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<string>('Admin');
  const [isContributorLoggedIn, setIsContributorLoggedIn] = useState(false);
  const [contributorUser, setContributorUser] = useState<string>('Contributor');
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

      const contribToken = localStorage.getItem('parampara_contributor_token');
      const contribName = localStorage.getItem('parampara_contributor_user') || 'Contributor';
      setIsContributorLoggedIn(!!contribToken);
      setContributorUser(contribName);
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
          <div className="flex justify-between items-center h-16">
            {/* Admin Brand Identity */}
            <Link to="/admin" className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-all shrink-0">
                <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-cinzel font-black text-lg tracking-wider text-white whitespace-nowrap">
                    PARAMPARA
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black tracking-widest uppercase bg-amber-400 text-slate-950 rounded shadow-xs shrink-0">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] font-medium tracking-wider text-amber-300 uppercase whitespace-nowrap">
                  Curatorial Verification Desk
                </p>
              </div>
            </Link>

            {/* Desktop Admin Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <Link
                to="/admin?tab=submissions"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isTabActive('submissions')
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Submissions</span>
              </Link>

              <Link
                to="/admin?tab=traditions"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isTabActive('traditions')
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Traditions</span>
              </Link>

              <Link
                to="/admin?tab=sources"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isTabActive('sources')
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Sources</span>
              </Link>

              <Link
                to="/admin?tab=audit"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isTabActive('audit')
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Audit</span>
              </Link>

              <div className="h-5 w-px bg-slate-700 shrink-0 mx-1.5" />

              {/* Preview Public Site */}
              <Link
                to="/explore"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 shrink-0 whitespace-nowrap"
                title="Open Public Visitor View in new tab"
              >
                <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Public Site</span>
              </Link>

              {/* Logged in Admin Pill & Sign Out */}
              <div className="flex items-center gap-2 pl-1 shrink-0">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200 shadow-inner whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span>{adminUser}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-600/90 hover:bg-rose-600 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                  title="Sign out of Admin Console"
                >
                  <LogOut className="w-3 h-3 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>

            {/* Mobile menu toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-slate-800"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-slate-200 hover:bg-slate-800 focus:outline-none"
                aria-label="Toggle admin menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-[#D97706] flex items-center justify-center text-white shadow-md shadow-orange-950/20 group-hover:scale-105 transition-all duration-200 ring-2 ring-amber-400/30">
                <span className="text-xl select-none" role="img" aria-label="lotus">🪷</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#FAF8F5] shadow-xs animate-pulse"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel font-black text-xl tracking-wider text-slate-900 group-hover:text-[#9A3412] transition-colors whitespace-nowrap">
                  PARAMPARA
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase bg-amber-500/15 text-amber-900 border border-amber-400/50 rounded shrink-0">
                  AR LITE
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-[#9A3412] uppercase font-sans whitespace-nowrap">
                Scan • Discover • Preserve
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/explore"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive('/explore')
                  ? 'bg-[#9A3412] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-100/50'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Explore</span>
            </Link>

            {/* Warli AR Feature Highlight Button */}
            <Link
              to="/tradition/warli/ar"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                isActive('/tradition/warli/ar')
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'text-amber-950 bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/50 hover:border-amber-400/80 shadow-xs'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>WebAR Camera</span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-500 text-white rounded shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                LIVE
              </span>
            </Link>

            <Link
              to="/posters"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive('/posters')
                  ? 'bg-[#9A3412] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-100/50'
              }`}
            >
              <QrCode className="w-4 h-4 shrink-0" />
              <span>Posters & QR</span>
            </Link>

            <Link
              to="/sources"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive('/sources')
                  ? 'bg-[#9A3412] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-100/50'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Sources</span>
            </Link>

            <Link
              to="/contribute"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive('/contribute')
                  ? 'bg-[#9A3412] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-[#9A3412] hover:bg-orange-100/50'
              }`}
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>Contribute</span>
            </Link>

            {/* Contributor Portal / My Submissions */}
            {isContributorLoggedIn ? (
              <Link
                to="/contributor/dashboard"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isActive('/contributor/dashboard')
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'text-emerald-900 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-400/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span>My Submissions</span>
              </Link>
            ) : (
              <Link
                to="/contributor/login"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all whitespace-nowrap shrink-0"
                title="Contributor Sign In / Register"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Contributor Portal</span>
              </Link>
            )}

            <div className="h-5 w-px bg-[#E6D5C3] shrink-0 mx-1" />

            {/* Admin Desk Link */}
            <Link
              to={isAdminLoggedIn ? '/admin' : '/admin/login'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-300/80 hover:border-slate-400 shadow-xs transition-all whitespace-nowrap shrink-0"
              title="Curatorial & Admin Verification Desk"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#9A3412] shrink-0" />
              <span>Admin Desk</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/tradition/warli/ar"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-950 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-amber-700" />
              <span>WebAR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-800 hover:bg-orange-100/60 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6D5C3] bg-[#FAF8F5]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 text-xs font-bold text-[#9A3412]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> National Digital Heritage Initiative
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-semibold">Active</span>
          </div>

          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <Compass className="w-4 h-4 text-[#9A3412]" />
            <span>Explore Living Heritage</span>
          </Link>

          <Link
            to="/tradition/warli/ar"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-amber-950 bg-amber-500/15 border border-amber-400/60 shadow-xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <Camera className="w-4 h-4 text-amber-800" />
              <span>Warli WebAR Scanner</span>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-600 text-white">Live</span>
          </Link>

          <Link
            to="/posters"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <QrCode className="w-4 h-4 text-[#9A3412]" />
            <span>Physical Posters & QR</span>
          </Link>

          <Link
            to="/sources"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#9A3412]" />
            <span>Archival Research Sources</span>
          </Link>

          <Link
            to="/contribute"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <Send className="w-4 h-4 text-[#9A3412]" />
            <span>Submit Community Heritage</span>
          </Link>

          {isContributorLoggedIn ? (
            <Link
              to="/contributor/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-emerald-950 bg-emerald-50 border border-emerald-200 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Contributor Dashboard ({contributorUser})</span>
            </Link>
          ) : (
            <Link
              to="/contributor/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-orange-100/60 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-[#9A3412]" />
              <span>Contributor Portal / Sign In</span>
            </Link>
          )}

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-orange-100/60 transition-colors"
          >
            <Info className="w-4 h-4 text-[#9A3412]" />
            <span>About Parampara Platform</span>
          </Link>

          <div className="pt-2 border-t border-slate-200">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#9A3412]" />
              <span>Curatorial Admin Desk</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

