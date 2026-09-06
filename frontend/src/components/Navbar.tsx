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
  Database
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
      <header className="sticky top-0 z-50 bg-[#1E293B] text-slate-100 border-b border-slate-700/80 shadow-lg transition-all backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Admin Brand Identity */}
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-950/30 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-2xl tracking-wider text-white">
                    PARAMPARA
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-black tracking-widest uppercase bg-amber-400 text-slate-950 rounded-md shadow-sm">
                    ADMIN CONSOLE
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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isTabActive('submissions')
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Submissions Queue
              </Link>

              <Link
                to="/admin?tab=traditions"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isTabActive('traditions')
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                Traditions Manager
              </Link>

              <Link
                to="/admin?tab=sources"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isTabActive('sources')
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                Archival Sources
              </Link>

              <Link
                to="/admin?tab=audit"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isTabActive('audit')
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                System Audit
              </Link>

              <div className="h-6 w-px bg-slate-700 mx-1" />

              {/* Preview Public Site */}
              <Link
                to="/explore"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 hover:border-slate-600"
                title="Open Public Visitor View in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                Public Site
              </Link>

              {/* Logged in Admin Pill & Sign Out */}
              <div className="flex items-center gap-2 pl-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{adminUser}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-600/90 hover:bg-red-600 text-white shadow-sm transition-colors cursor-pointer"
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
                className="p-2 rounded-lg text-red-400 hover:bg-slate-800"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-200 hover:bg-slate-800 focus:outline-none"
                aria-label="Toggle admin menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Admin Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/90 bg-[#1E293B] px-4 pt-3 pb-6 space-y-2">
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
              className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md cursor-pointer"
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
              to="/admin/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-400 bg-white shadow-sm"
              title="Editorial & Admin Verification Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              Admin Portal
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
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              Sign In as Administrator
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
