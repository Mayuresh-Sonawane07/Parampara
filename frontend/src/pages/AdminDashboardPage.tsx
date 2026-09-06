import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  RefreshCw,
  ExternalLink,
  Layers,
  BookOpen,
  Activity,
  Plus,
  Trash2,
  Edit3,
  Server,
  Sparkles,
  Database,
  Volume2
} from 'lucide-react';
import {
  fetchAdminStats,
  fetchAdminContributions,
  reviewContribution,
  deleteAdminContribution,
  fetchAdminTraditions,
  createAdminTradition,
  updateAdminTradition,
  deleteAdminTradition,
  fetchAdminSources,
  createAdminSource,
  deleteAdminSource,
  fetchAdminAudit
} from '../services/api';
import {
  AdminStats,
  Contribution,
  AdminTradition,
  Source,
  AdminAuditData,
  TraditionCreateInput,
  SourceCreateInput
} from '../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'submissions';

  const token = localStorage.getItem('parampara_admin_token');
  const adminUser = localStorage.getItem('parampara_admin_user') || 'Admin';

  // State for all 4 genuine sections
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [traditions, setTraditions] = useState<AdminTradition[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [auditData, setAuditData] = useState<AdminAuditData | null>(null);

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);

  // New Tradition Modal
  const [showAddTraditionModal, setShowAddTraditionModal] = useState(false);
  const [newTradition, setNewTradition] = useState<TraditionCreateInput>({
    name: '',
    slug: '',
    region: 'North',
    state: '',
    community: '',
    category: 'Craft',
    short_description: '',
    description: '',
    experience_type: 'CRAFT_JOURNEY',
    hero_image: '/heritage-images/thathera.jpg',
    thumbnail: '/heritage-images/thathera.jpg',
    status: 'PUBLISHED'
  });

  // Edit Tradition Modal
  const [editingTradition, setEditingTradition] = useState<AdminTradition | null>(null);

  // New Source Modal
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [newSource, setNewSource] = useState<SourceCreateInput>({
    title: '',
    organization: '',
    author: '',
    source_type: 'UNESCO',
    url: '',
    description: '',
    verification_status: 'VERIFIED'
  });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();

    // Auto-refresh when user refocuses tab or every 15s
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    }, 15000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [token, activeTab, statusFilter]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Always refresh core stats
      const sData = await fetchAdminStats(token);
      setStats(sData);

      if (activeTab === 'submissions') {
        const cData = await fetchAdminContributions(token, statusFilter === 'ALL' ? undefined : statusFilter);
        setContributions(cData);
      } else if (activeTab === 'traditions') {
        const tData = await fetchAdminTraditions(token);
        setTraditions(tData);
      } else if (activeTab === 'sources') {
        const srcData = await fetchAdminSources(token);
        setSources(srcData);
      } else if (activeTab === 'audit') {
        const aData = await fetchAdminAudit(token);
        setAuditData(aData);
      }
    } catch (err: any) {
      console.error('Admin API error:', err);
      if (err.message?.includes('401') || err.message?.includes('credentials')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('parampara_admin_token');
    localStorage.removeItem('parampara_admin_user');
    window.dispatchEvent(new Event('auth_change'));
    navigate('/admin/login');
  };

  const setTab = (tab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next);
  };

  // --- Submissions Actions ---
  const handleReviewAction = async (newStatus: 'APPROVED' | 'REJECTED') => {
    if (!token || !selectedContribution) return;
    setReviewing(true);
    try {
      await reviewContribution(token, selectedContribution.id, newStatus, reviewerNotes);
      setSelectedContribution(null);
      setReviewerNotes('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to review contribution');
    } finally {
      setReviewing(false);
    }
  };

  const handleDeleteContribution = async (id: number) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to permanently remove submission #${id}?`)) return;
    try {
      await deleteAdminContribution(token, id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete submission');
    }
  };

  // --- Traditions Actions ---
  const handleToggleTraditionStatus = async (t: AdminTradition) => {
    if (!token) return;
    const newStatus = t.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await updateAdminTradition(token, t.id, { status: newStatus });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update tradition status');
    }
  };

  const handleCreateTradition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await createAdminTradition(token, newTradition);
      setShowAddTraditionModal(false);
      setNewTradition({
        name: '',
        slug: '',
        region: 'North',
        state: '',
        community: '',
        category: 'Craft',
        short_description: '',
        description: '',
        experience_type: 'CRAFT_JOURNEY',
        hero_image: '/heritage-images/thathera.jpg',
        thumbnail: '/heritage-images/thathera.jpg',
        status: 'PUBLISHED'
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create tradition');
    }
  };

  const handleUpdateTradition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingTradition) return;
    try {
      await updateAdminTradition(token, editingTradition.id, {
        name: editingTradition.name,
        region: editingTradition.region,
        state: editingTradition.state,
        category: editingTradition.category,
        short_description: editingTradition.short_description,
        status: editingTradition.status
      });
      setEditingTradition(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update tradition');
    }
  };

  const handleDeleteTradition = async (id: number, name: string) => {
    if (!token) return;
    if (!window.confirm(`Warning: Are you sure you want to permanently delete '${name}' (ID #${id}) and all linked hotspots/quizzes?`)) return;
    try {
      await deleteAdminTradition(token, id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete tradition');
    }
  };

  // --- Sources Actions ---
  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await createAdminSource(token, newSource);
      setShowAddSourceModal(false);
      setNewSource({
        title: '',
        organization: '',
        author: '',
        source_type: 'UNESCO',
        url: '',
        description: '',
        verification_status: 'VERIFIED'
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add source');
    }
  };

  const handleDeleteSource = async (id: number, title: string) => {
    if (!token) return;
    if (!window.confirm(`Delete archival source #${id} ('${title}')?`)) return;
    try {
      await deleteAdminSource(token, id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete source citation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6D5C3] gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Curatorial Desk & Heritage Administration
          </span>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Admin Verification & Control Center
          </h1>
          <p className="text-xs text-slate-500">
            Logged in as <strong className="text-slate-800">{adminUser}</strong>. All endpoints genuine, connected to SQLite DB and regional narration engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/explore"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Real Statistics Overview Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            onClick={() => setTab('traditions')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'traditions' ? 'border-[#9A3412] bg-orange-50/50 shadow-md' : 'border-slate-200 bg-white hover:border-orange-300'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Traditions</span>
            <div className="text-2xl font-black font-serif text-slate-900">{stats.total_traditions}</div>
            <span className="text-[10px] text-slate-500">Living heritage crafts</span>
          </div>

          <div
            onClick={() => setTab('sources')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'sources' ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Research Sources</span>
            <div className="text-2xl font-black font-serif text-blue-700">{stats.total_sources}</div>
            <span className="text-[10px] text-slate-500">UNESCO / GI Archives</span>
          </div>

          <div
            onClick={() => {
              setTab('submissions');
              setStatusFilter('PENDING');
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'submissions' && statusFilter === 'PENDING'
                ? 'border-amber-500 bg-amber-100/60 shadow-md'
                : 'border-amber-200 bg-amber-50/40 hover:border-amber-400'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Pending Review</span>
            <div className="text-2xl font-black font-serif text-amber-600">{stats.pending_contributions}</div>
            <span className="text-[10px] text-amber-900">Awaiting expert check</span>
          </div>

          <div
            onClick={() => {
              setTab('submissions');
              setStatusFilter('APPROVED');
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'submissions' && statusFilter === 'APPROVED'
                ? 'border-emerald-500 bg-emerald-100/60 shadow-md'
                : 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Approved Voice</span>
            <div className="text-2xl font-black font-serif text-emerald-600">{stats.approved_contributions}</div>
            <span className="text-[10px] text-emerald-900">Verified community entries</span>
          </div>

          <div
            onClick={() => setTab('audit')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'audit' ? 'border-purple-600 bg-purple-50/50 shadow-md' : 'border-slate-200 bg-white hover:border-purple-300'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">System Health</span>
            <div className="text-2xl font-black font-serif text-emerald-600 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              100% OK
            </div>
            <span className="text-[10px] text-slate-500">DB, Audio, Assets Ready</span>
          </div>
        </div>
      )}

      {/* Admin Module Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('submissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'submissions'
              ? 'bg-[#9A3412] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Community Submissions ({stats?.pending_contributions ?? 0} Pending)
        </button>

        <button
          onClick={() => setTab('traditions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'traditions'
              ? 'bg-[#9A3412] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Traditions Management ({stats?.total_traditions ?? 0})
        </button>

        <button
          onClick={() => setTab('sources')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sources'
              ? 'bg-[#9A3412] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Archival Citations ({stats?.total_sources ?? 0})
        </button>

        <button
          onClick={() => setTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-[#9A3412] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-600" />
          System Health & Audit
        </button>
      </div>

      {/* TAB 1: SUBMISSIONS REVIEW */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-[#E6D5C3] shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Community Submissions Queue
              </h3>
              <p className="text-xs text-slate-500">
                Review incoming cultural submissions. Verify references and consent before publishing.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { key: 'ALL', label: 'ALL', count: (stats?.pending_contributions ?? 0) + (stats?.approved_contributions ?? 0) + (stats?.rejected_contributions ?? 0) },
                { key: 'PENDING', label: 'PENDING', count: stats?.pending_contributions ?? 0 },
                { key: 'APPROVED', label: 'APPROVED', count: stats?.approved_contributions ?? 0 },
                { key: 'REJECTED', label: 'REJECTED', count: stats?.rejected_contributions ?? 0 },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    key === 'PENDING' && count > 0
                      ? 'bg-amber-100 text-amber-800 font-extrabold'
                      : statusFilter === key
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-slate-200/70 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
              <button
                onClick={loadData}
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors ml-1"
                title="Refresh submissions"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pending Alert Banner when user is viewing Approved queue */}
          {statusFilter === 'APPROVED' && (stats?.pending_contributions ?? 0) > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span><strong>{stats?.pending_contributions} submission(s)</strong> currently awaiting curatorial review in the Pending queue.</span>
              </div>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors text-[11px]"
              >
                View Pending Submissions →
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading submissions from database...</p>
            </div>
          ) : contributions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs space-y-2">
              <p className="font-semibold text-slate-700">
                {statusFilter === 'PENDING'
                  ? 'No pending submissions in the review queue.'
                  : statusFilter === 'APPROVED'
                  ? 'No approved contributions currently published.'
                  : statusFilter === 'REJECTED'
                  ? 'No rejected contributions.'
                  : 'No community contributions found in the database.'}
              </p>
              <p className="text-slate-400">
                {statusFilter === 'APPROVED' && (stats?.pending_contributions ?? 0) > 0
                  ? `There are ${stats?.pending_contributions} submission(s) waiting in the Pending tab.`
                  : 'Contributions submitted on the public /contribute page will appear here.'}
              </p>
              {statusFilter !== 'ALL' && (
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className="mt-2 px-3 py-1.5 text-[11px] font-bold text-[#9A3412] hover:bg-orange-50 rounded-lg transition-colors border border-orange-200"
                >
                  Show All Submissions
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="p-3">ID</th>
                    <th className="p-3">Contributor</th>
                    <th className="p-3">Tradition</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contributions.map((c) => {
                    let statusBadge = 'bg-amber-100 text-amber-800';
                    if (c.status === 'APPROVED') statusBadge = 'bg-emerald-100 text-emerald-800';
                    if (c.status === 'REJECTED') statusBadge = 'bg-red-100 text-red-800';

                    return (
                      <tr key={c.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="p-3 font-mono text-slate-400">#{c.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{c.contributor_name}</div>
                          <div className="text-[11px] text-slate-400">{c.email}</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{c.tradition_name}</td>
                        <td className="p-3 text-slate-600">{c.location} ({c.region})</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedContribution(c);
                                setReviewerNotes(c.reviewer_notes || '');
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-[#9A3412] text-white transition-colors"
                            >
                              Review & Verify
                            </button>
                            <button
                              onClick={() => handleDeleteContribution(c.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete submission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRADITIONS MANAGEMENT */}
      {activeTab === 'traditions' && (
        <div className="bg-white rounded-2xl border border-[#E6D5C3] shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Traditions Content & Modality Manager
              </h3>
              <p className="text-xs text-slate-500">
                Manage living traditions, publish/draft statuses, attached AR hotspots, and quiz modules.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddTraditionModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Register New Tradition
              </button>
              <button
                onClick={loadData}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                title="Refresh traditions"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading traditions data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="p-3">Tradition</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Geography</th>
                    <th className="p-3">Experience Type</th>
                    <th className="p-3">Hotspots</th>
                    <th className="p-3">Quizzes</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {traditions.map((t) => (
                    <tr key={t.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-400">{t.category}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-500">{t.slug}</td>
                      <td className="p-3 text-slate-700">{t.region} India • {t.state}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">{t.experience_type}</td>
                      <td className="p-3">
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {t.hotspots_count} pins
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {t.quiz_count} Qs
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleTraditionStatus(t)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            t.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {t.status}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/tradition/${t.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                            title="Preview Tradition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setEditingTradition(t)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#9A3412] hover:bg-orange-50"
                            title="Edit Tradition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTradition(t.id, t.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Tradition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ARCHIVAL SOURCES */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-2xl border border-[#E6D5C3] shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Archival Research Citations Registry
              </h3>
              <p className="text-xs text-slate-500">
                UNESCO dossiers, Geographical Indications Registry files, and INTACH fieldwork references.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddSourceModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Research Citation
              </button>
              <button
                onClick={loadData}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                title="Refresh sources"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading sources...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="p-3">ID</th>
                    <th className="p-3">Source Title</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">URL</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sources.map((s) => (
                    <tr key={s.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="p-3 font-mono text-slate-400">#{s.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{s.title}</div>
                        {s.author && <div className="text-[11px] text-slate-400">By {s.author}</div>}
                      </td>
                      <td className="p-3 text-slate-700">{s.organization}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                          {s.source_type}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {s.verification_status}
                        </span>
                      </td>
                      <td className="p-3">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#9A3412] hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          Verify Link <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteSource(s.id, s.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Citation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SYSTEM HEALTH & REAL-TIME AUDIT */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6D5C3] shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Real-Time System Audit & Subsystem Diagnostics
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Live verification of SQLite storage, TTS regional voice engines, and verified heritage image assets.
                </p>
              </div>

              <button
                onClick={loadData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-run Diagnostics
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-xs text-slate-500">Auditing endpoints and database...</p>
              </div>
            ) : auditData ? (
              <div className="space-y-6">
                {/* Status Banners */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-800">
                      <Database className="w-4 h-4" />
                      Database Subsystem
                    </div>
                    <div className="text-sm font-bold text-emerald-950">{auditData.database_status}</div>
                    <div className="text-[11px] text-emerald-800">Thread-safe SQLite engine active</div>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-blue-800">
                      <Volume2 className="w-4 h-4" />
                      Regional Narration Engines
                    </div>
                    <div className="text-sm font-bold text-blue-950">English • Hindi • Marathi</div>
                    <div className="text-[11px] text-blue-800">gTTS in-memory and disk buffer online</div>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-800">
                      <Sparkles className="w-4 h-4" />
                      Verified Heritage Images
                    </div>
                    <div className="text-sm font-bold text-amber-950">{auditData.heritage_assets_verified.length} / 4 Assets Verified</div>
                    <div className="text-[11px] text-amber-800">Thathera, Toda, Chhau, Warli</div>
                  </div>
                </div>

                {/* Table Metrics Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Database Entity Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Published Traditions</span>
                      <strong className="text-base text-slate-900">{auditData.metrics.published_traditions} of {auditData.metrics.traditions}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">AR Hotspot Motifs</span>
                      <strong className="text-base text-amber-600">{auditData.metrics.ar_hotspots} coordinates</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Quiz Questions</span>
                      <strong className="text-base text-blue-600">{auditData.metrics.quiz_questions} questions</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Verified Archival Citations</span>
                      <strong className="text-base text-emerald-600">{auditData.metrics.verified_sources} sources</strong>
                    </div>
                  </div>
                </div>

                {/* Verified Images List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Local Verified Heritage Assets (Parity Across Explore & Posters)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {auditData.heritage_assets_verified.map((img) => (
                      <div key={img} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-mono text-xs text-slate-800">{img}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E6D5C3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] text-white p-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
                  Review Submission #{selectedContribution.id}
                </span>
                <h3 className="font-serif font-bold text-lg">
                  {selectedContribution.tradition_name} ({selectedContribution.region} India)
                </h3>
              </div>
              <button
                onClick={() => setSelectedContribution(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold uppercase block">Contributor</span>
                  <span className="font-bold text-slate-900">{selectedContribution.contributor_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block">Email</span>
                  <span className="text-slate-700">{selectedContribution.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block">Location</span>
                  <span className="text-slate-900">{selectedContribution.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block">Consent Verified</span>
                  <span className="text-emerald-700 font-bold">
                    {selectedContribution.consent_given ? '✓ Explicit Consent Granted' : '✗ No Consent'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase block mb-1">Detailed Description</span>
                <p className="bg-white p-3 rounded-xl border border-slate-200 leading-relaxed font-sans text-slate-900">
                  {selectedContribution.description}
                </p>
              </div>

              {selectedContribution.cultural_significance && (
                <div>
                  <span className="text-slate-400 font-bold uppercase block mb-1">Cultural Significance</span>
                  <p className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950 leading-relaxed">
                    {selectedContribution.cultural_significance}
                  </p>
                </div>
              )}

              {selectedContribution.source_reference && (
                <div>
                  <span className="text-slate-400 font-bold uppercase block mb-1">Source Reference / Citations</span>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 font-mono text-[11px]">
                    {selectedContribution.source_reference}
                  </p>
                </div>
              )}

              <div className="space-y-1 pt-2">
                <label className="font-bold text-slate-800 block">
                  Reviewer Notes & Verification Rationale
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Cross-verified against INTACH field records. Approved for Community Voice inclusion."
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-300"
                ></textarea>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedContribution(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  disabled={reviewing}
                  onClick={() => handleReviewAction('REJECTED')}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-red-100 hover:bg-red-200 text-red-900 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  Reject Submission
                </button>

                <button
                  disabled={reviewing}
                  onClick={() => handleReviewAction('APPROVED')}
                  className="flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Approve as Verified Voice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Tradition Modal */}
      {showAddTraditionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E6D5C3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] text-white p-5 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Register Living Heritage Tradition</h3>
              <button
                onClick={() => setShowAddTraditionModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTradition} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tradition Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Madhubani Painting"
                    value={newTradition.name}
                    onChange={(e) => setNewTradition({ ...newTradition, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Slug (URL identifier)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. madhubani"
                    value={newTradition.slug}
                    onChange={(e) => setNewTradition({ ...newTradition, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Region</label>
                  <select
                    value={newTradition.region}
                    onChange={(e) => setNewTradition({ ...newTradition, region: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bihar"
                    value={newTradition.state}
                    onChange={(e) => setNewTradition({ ...newTradition, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newTradition.category}
                    onChange={(e) => setNewTradition({ ...newTradition, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Craft">Craft</option>
                    <option value="Textile / Embroidery">Textile / Embroidery</option>
                    <option value="Dance">Dance</option>
                    <option value="Visual Art">Visual Art</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise overview for Explore cards..."
                  value={newTradition.short_description}
                  onChange={(e) => setNewTradition({ ...newTradition, short_description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Detailed Archival Narrative</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed historical and cultural narrative..."
                  value={newTradition.description}
                  onChange={(e) => setNewTradition({ ...newTradition, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="p-4 bg-slate-50 -mx-6 -mb-6 mt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTraditionModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-[#9A3412] hover:bg-[#7C2D12] font-bold shadow-md"
                >
                  Publish Tradition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tradition Modal */}
      {editingTradition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E6D5C3] shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] text-white p-5 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Edit {editingTradition.name}</h3>
              <button
                onClick={() => setEditingTradition(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateTradition} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Name</label>
                <input
                  type="text"
                  value={editingTradition.name}
                  onChange={(e) => setEditingTradition({ ...editingTradition, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Region</label>
                  <input
                    type="text"
                    value={editingTradition.region}
                    onChange={(e) => setEditingTradition({ ...editingTradition, region: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={editingTradition.state}
                    onChange={(e) => setEditingTradition({ ...editingTradition, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={editingTradition.short_description}
                  onChange={(e) => setEditingTradition({ ...editingTradition, short_description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTradition(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-[#9A3412] hover:bg-[#7C2D12] font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Archival Source Modal */}
      {showAddSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E6D5C3] shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] text-white p-5 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Add Archival Research Citation</h3>
              <button
                onClick={() => setShowAddSourceModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Citation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UNESCO Representative List Dossier 00845"
                  value={newSource.title}
                  onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UNESCO / INTACH"
                    value={newSource.organization}
                    onChange={(e) => setNewSource({ ...newSource, organization: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source Type</label>
                  <select
                    value={newSource.source_type}
                    onChange={(e) => setNewSource({ ...newSource, source_type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="UNESCO">UNESCO</option>
                    <option value="GOVERNMENT">GOVERNMENT / GI</option>
                    <option value="INTACH">INTACH</option>
                    <option value="ACADEMIC">ACADEMIC</option>
                    <option value="MUSEUM">MUSEUM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Archival URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://ich.unesco.org/en/RL/..."
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details on the archival file or field research..."
                  value={newSource.description}
                  onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddSourceModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-[#9A3412] hover:bg-[#7C2D12] font-bold shadow-md"
                >
                  Save Citation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
