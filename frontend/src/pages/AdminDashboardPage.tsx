import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  RefreshCw,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { fetchAdminStats, fetchAdminContributions, reviewContribution } from '../services/api';
import { AdminStats, Contribution } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('parampara_admin_token');
  const adminUser = localStorage.getItem('parampara_admin_user') || 'Admin';

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [token, statusFilter]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [sData, cData] = await Promise.all([
        fetchAdminStats(token),
        fetchAdminContributions(token, statusFilter === 'ALL' ? undefined : statusFilter),
      ]);
      setStats(sData);
      setContributions(cData);
    } catch (err: any) {
      console.error(err);
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
    navigate('/admin/login');
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6D5C3] gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Editorial Review & Verification
          </span>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Admin Verification Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Logged in as <strong className="text-slate-800">{adminUser}</strong>. Ensuring zero fabrication in public community contributions.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {/* Real Statistics Grid (ZERO MOCK STATS) */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Traditions</span>
            <div className="text-2xl font-black font-serif text-slate-900">{stats.total_traditions}</div>
            <span className="text-[10px] text-slate-500">Verified core elements</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Research Sources</span>
            <div className="text-2xl font-black font-serif text-blue-700">{stats.total_sources}</div>
            <span className="text-[10px] text-slate-500">UNESCO / GI Archives</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Review</span>
            <div className="text-2xl font-black font-serif text-amber-600">{stats.pending_contributions}</div>
            <span className="text-[10px] text-amber-800">Awaiting expert check</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Approved Voice</span>
            <div className="text-2xl font-black font-serif text-emerald-600">{stats.approved_contributions}</div>
            <span className="text-[10px] text-emerald-800">Verified Community Voice</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rejected Entries</span>
            <div className="text-2xl font-black font-serif text-slate-600">{stats.rejected_contributions}</div>
            <span className="text-[10px] text-slate-500">Unverifiable or non-consent</span>
          </div>
        </div>
      )}

      {/* Contributions Management Table */}
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
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
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

        {/* Table / List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading submissions...</p>
          </div>
        ) : contributions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No contributions found in this status queue.
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
                  <th className="p-3 text-right">Action</th>
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
                        <button
                          onClick={() => {
                            setSelectedContribution(c);
                            setReviewerNotes(c.reviewer_notes || '');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-[#9A3412] text-white transition-colors"
                        >
                          Review & Verify
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal Dialog */}
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

              {/* Reviewer Notes Input */}
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

            {/* Modal Actions */}
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
    </div>
  );
};
