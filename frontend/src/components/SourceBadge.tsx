import React from 'react';
import { ExternalLink, CheckCircle2, Award } from 'lucide-react';
import { Source } from '../types';

interface SourceBadgeProps {
  source?: Source;
  compact?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, compact = false }) => {
  if (!source) return null;

  const getSourceColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'UNESCO':
        return 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100';
      case 'GOVERNMENT':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
      case 'INTACH':
        return 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100';
    }
  };

  if (compact) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${source.title} (${source.organization})`}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${getSourceColor(
          source.source_type
        )}`}
      >
        <Award className="w-3 h-3 text-amber-600" />
        <span className="font-semibold">{source.organization}:</span>
        <span className="truncate max-w-[140px]">{source.title}</span>
        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
      </a>
    );
  }

  return (
    <div className="bg-white border border-[#E6D5C3] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getSourceColor(
                source.source_type
              )}`}
            >
              {source.source_type}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" />
              Verified Archival Source
            </span>
          </div>
          <h5 className="font-serif font-semibold text-base text-slate-900 pt-1">
            {source.title}
          </h5>
          <p className="text-xs text-slate-600">
            <strong>Organization:</strong> {source.organization}
            {source.author && <> • <strong>Author/Body:</strong> {source.author}</>}
          </p>
          {source.description && (
            <p className="text-xs text-slate-500 italic pt-1 leading-relaxed">
              "{source.description}"
            </p>
          )}
        </div>

        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-[#9A3412] hover:text-[#7C2D12] bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          View Source <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
