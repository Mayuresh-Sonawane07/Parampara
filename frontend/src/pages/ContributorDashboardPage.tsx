import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  LogOut,
  Sparkles,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { fetchContributorProfile, fetchMySubmissions } from '../services/api';
import { ContributorUser, Contribution } from '../types';

export const ContributorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('parampara_contributor_token');

  const [profile, setProfile] = useState<ContributorUser | null>(null);
  const [submissions, setSubmissions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<Contribution | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/contributor/login?redirect=/contributor/dashboard');
      return;
    }
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [profData, subsData] = await Promise.all([
        fetchContributorProfile(token),
        fetchMySubmissions(token)
      ]);
      setProfile(profData);
      setSubmissions(subsData);
    } catch (err: any) {
      if (err.message && err.message.includes('Could not validate credentials')) {
        localStorage.removeItem('parampara_contributor_token');
        localStorage.removeItem('parampara_contributor_user');
        navigate('/contributor/login');
        return;
      }
      setError(err.message || 'Failed to load submissions data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('parampara_contributor_token');
    localStorage.removeItem('parampara_contributor_user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#9A3412] animate-spin mx-auto" />
        <p className="text-slate-600 font-serif">Loading your cultural custodian records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Contributor Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#F5EBE1] border border-[#E6D5C3] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9A3412]/10 text-[#9A3412] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Cultural Contributor
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Welcome back, {profile?.username || 'Custodian'}
          </h1>
          <p className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
            <span>Email: <strong>{profile?.email}</strong></span>
            <span>&bull;</span>
            <span>Member since: <strong>{profile ? new Date(profile.created_at).toLocaleDateString() : 'Active'}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/contribute"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9A3412] to-amber-700 hover:from-[#7C2D12] hover:to-amber-800 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Submit New Tradition
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Submissions Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E6D5C3] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Submissions</span>
          <div className="text-2xl font-black font-serif text-slate-900 mt-1">{submissions.length}</div>
          <span className="text-[10px] text-slate-500">Documented living heritage entries</span>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under Curatorial Review
          </span>
          <div className="text-2xl font-black font-serif text-amber-700 mt-1">
            {submissions.filter(s => s.status === 'PENDING').length}
          </div>
          <span className="text-[10px] text-amber-900">Awaiting archival verification</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved & Live in Community Voice
          </span>
          <div className="text-2xl font-black font-serif text-emerald-700 mt-1">
            {submissions.filter(s => s.status === 'APPROVED').length}
          </div>
          <span className="text-[10px] text-emerald-900">Published for public education</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Submissions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900">Your Heritage Contributions</h2>
            <p className="text-xs text-slate-500">Track curatorial remarks and verification progress in real time.</p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#E6D5C3] shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-[#9A3412] flex items-center justify-center mx-auto">
              <Compass className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-slate-800">No Contributions Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Help safeguard India's endangered folk traditions, oral crafts, and regional expressions.
                Your contributions undergo verification against institutional archives.
              </p>
            </div>
            <Link
              to="/contribute"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Submit Your First Cultural Entry
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#9A3412]/40 transition-all shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A3412] block">
                      {sub.region} India &bull; {sub.location}
                    </span>
                    <h3 className="text-base font-serif font-bold text-slate-900">
                      {sub.tradition_name}
                    </h3>
                  </div>

                  <div>
                    {sub.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Under Curatorial Review
                      </span>
                    )}
                    {sub.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Approved & Live
                      </span>
                    )}
                    {sub.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        Feedback Provided
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                  {sub.description}
                </p>

                {sub.cultural_significance && (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900">
                    <strong className="block text-[10px] uppercase font-bold text-amber-800 mb-0.5">Cultural Significance:</strong>
                    {sub.cultural_significance}
                  </div>
                )}

                {/* Reviewer notes if any */}
                {sub.reviewer_notes && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#9A3412]" />
                      Curator Reviewer Notes:
                    </span>
                    <p className="text-slate-600 italic">"{sub.reviewer_notes}"</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Submitted: {new Date(sub.created_at).toLocaleDateString()}
                  </span>

                  {sub.source_reference && (
                    <span className="text-slate-500 truncate max-w-xs">
                      Ref: {sub.source_reference}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
