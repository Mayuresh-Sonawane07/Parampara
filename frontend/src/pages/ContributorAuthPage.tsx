import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Shield, Sparkles, UserCheck, ArrowRight, BookOpen, AlertCircle, Compass } from 'lucide-react';
import { loginContributor, registerContributor } from '../services/api';

export const ContributorAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const redirectPath = searchParams.get('redirect') || '/contributor/dashboard';

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let data;
      if (mode === 'register') {
        if (!email.trim() || !username.trim() || password.length < 6) {
          throw new Error('Please fill all fields. Password must be at least 6 characters.');
        }
        data = await registerContributor(username.trim(), email.trim(), password);
      } else {
        if (!username.trim() || !password) {
          throw new Error('Please enter your username/email and password.');
        }
        data = await loginContributor(username.trim(), password);
      }

      localStorage.setItem('parampara_contributor_token', data.access_token);
      localStorage.setItem('parampara_contributor_user', data.username);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-[#E6D5C3] shadow-xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#9A3412]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-[#9A3412] mb-2 shadow-inner">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412] block">
            Community Living Heritage Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {mode === 'login' ? 'Contributor Sign In' : 'Join as Cultural Custodian'}
          </h2>
          <p className="text-xs text-slate-600">
            {mode === 'login'
              ? 'Access your submission tracking dashboard and curate India’s living arts.'
              : 'Register to document endangered traditions and track institutional review.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 relative z-10 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-[#9A3412] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {mode === 'login' ? 'Username or Email' : 'Username'}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === 'login' ? 'e.g. rahul_artisan or rahul@heritage.org' : 'e.g. rahul_artisan'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9A3412] focus:border-transparent transition-all"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@heritage.org"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9A3412] focus:border-transparent transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9A3412] focus:border-transparent transition-all"
            />
            {mode === 'register' && (
              <span className="text-[11px] text-slate-400 mt-1 block">Minimum 6 characters.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#9A3412] to-amber-700 hover:from-[#7C2D12] hover:to-amber-800 transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Contributor Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Benefits & Guest link */}
        <div className="pt-4 border-t border-slate-100 space-y-3 text-center">
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Ethical Consent
            </span>
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              Direct Review Tracking
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Zero Mock Data
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Prefer not to make an account?{' '}
            <Link to="/contribute" className="font-bold text-[#9A3412] hover:underline">
              Submit as a Guest Contributor &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
