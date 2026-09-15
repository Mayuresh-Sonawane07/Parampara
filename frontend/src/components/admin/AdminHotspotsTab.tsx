import React, { useState } from 'react';
import { Crosshair, Edit3, ExternalLink, RefreshCw, Volume2, Search, MapPin, Sparkles } from 'lucide-react';
import { AdminHotspotItem } from '../../types';
import { updateAdminHotspot } from '../../services/api';

interface Props {
  token: string;
  hotspots: AdminHotspotItem[];
  onRefresh: () => void;
}

export const AdminHotspotsTab: React.FC<Props> = ({ token, hotspots, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [editingHotspot, setEditingHotspot] = useState<AdminHotspotItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filtered = hotspots.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.content.toLowerCase().includes(search.toLowerCase()) ||
      (h.cultural_context && h.cultural_context.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotspot) return;
    setSubmitting(true);
    try {
      await updateAdminHotspot(token, editingHotspot.id, {
        name: editingHotspot.name,
        x: editingHotspot.x,
        y: editingHotspot.y,
        content: editingHotspot.content,
        cultural_context: editingHotspot.cultural_context,
        regional_perspective: editingHotspot.regional_perspective,
        audio_url: editingHotspot.audio_url
      });
      setEditingHotspot(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update hotspot');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E6D5C3] shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412] flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5" />
            Interactive Canvas & WebAR Spatial Mapping
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            WebAR Hotspots & Motifs Manager
          </h2>
          <p className="text-xs text-slate-500">
            Inspect coordinates, cultural meanings, and regional audio cues for all {hotspots.length} interactive hotspots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/tradition/warli/ar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Launch WebAR Viewer
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refresh hotspots"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hotspots by name (e.g. Tarpa, Palghat, Peacock, Gauri)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#9A3412]"
          />
        </div>
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
          Showing {filtered.length} of {hotspots.length}
        </span>
      </div>

      {/* Hotspots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((h) => (
          <div
            key={h.id}
            className="p-4 rounded-2xl border border-slate-200 hover:border-[#9A3412]/40 transition-all bg-white shadow-2xs space-y-2.5 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#9A3412] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200">
                  X: {h.x.toFixed(1)}% &bull; Y: {h.y.toFixed(1)}%
                </span>
                <button
                  onClick={() => setEditingHotspot(h)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                  title="Edit Hotspot"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm text-slate-900">{h.name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{h.content}</p>
              </div>

              {h.cultural_context && (
                <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-950 line-clamp-2">
                  <strong className="text-amber-800 font-bold block text-[10px] uppercase">Significance:</strong>
                  {h.cultural_context}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[140px] font-mono text-[10px]">
                {h.tradition_name}
              </span>
              {h.audio_url && (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                  <Volume2 className="w-3 h-3" />
                  Audio Cue
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Hotspot Modal */}
      {editingHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E6D5C3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] text-white p-5 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Edit Hotspot #{editingHotspot.id}</h3>
              <button
                onClick={() => setEditingHotspot(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hotspot Name</label>
                <input
                  type="text"
                  required
                  value={editingHotspot.name}
                  onChange={(e) => setEditingHotspot({ ...editingHotspot, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">X Coordinate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={editingHotspot.x}
                    onChange={(e) => setEditingHotspot({ ...editingHotspot, x: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Y Coordinate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={editingHotspot.y}
                    onChange={(e) => setEditingHotspot({ ...editingHotspot, y: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Content / Meaning</label>
                <textarea
                  rows={2}
                  required
                  value={editingHotspot.content}
                  onChange={(e) => setEditingHotspot({ ...editingHotspot, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cultural Context</label>
                <textarea
                  rows={2}
                  value={editingHotspot.cultural_context || ''}
                  onChange={(e) => setEditingHotspot({ ...editingHotspot, cultural_context: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Regional Audio Cue URL (Optional)</label>
                <input
                  type="text"
                  placeholder="/audio/warli-tarpa.mp3"
                  value={editingHotspot.audio_url || ''}
                  onChange={(e) => setEditingHotspot({ ...editingHotspot, audio_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingHotspot(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-white bg-[#9A3412] hover:bg-[#7C2D12] font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Hotspot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
