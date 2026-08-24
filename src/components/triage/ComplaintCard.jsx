import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  Clock, 
  MapPin, 
  GitMerge, 
  ShieldAlert, 
  Truck, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { formatMinutes, formatTimeAgo, getPriorityBadge, getStatusBadge } from '../../utils/formatters';

export default function ComplaintCard({ complaint }) {
  const { openModal, setSelectedComplaintId, resolveComplaint } = useCivic();

  const isCritical = complaint.priority === 'CRITICAL' || complaint.slaMinutesRemaining < 30;
  const hasDuplicates = complaint.similarityCluster?.length > 0;
  const isFraud = complaint.status === 'FLAGGED_FRAUD' || (complaint.exif && !complaint.exif.isAuthentic);

  return (
    <div className={`p-4 rounded-2xl border bg-slate-900/90 backdrop-blur-md shadow-xl transition-all hover:border-slate-700 ${
      isCritical ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
    }`}>
      
      {/* Header Info */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-300">{complaint.id}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityBadge(complaint.priority)}`}>
            {complaint.priority}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(complaint.status)}`}>
            {complaint.status}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {formatTimeAgo(complaint.createdAt)}
        </span>
      </div>

      {/* Image and Content */}
      <div className="flex gap-3 items-start my-2">
        {complaint.imageUrl && (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="w-full h-full object-cover"
            />
            {isFraud && (
              <span className="absolute bottom-0 inset-x-0 bg-red-600/90 text-white text-[8px] font-bold text-center py-0.5">
                EXIF ALERT
              </span>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-white line-clamp-1 mb-1">{complaint.title}</h4>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">
            {complaint.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span className="truncate max-w-[140px]">{complaint.wardName}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Truck className="w-3 h-3 text-cyan-400" />
              <span className="truncate max-w-[140px]">{complaint.assignedCrew || complaint.departmentName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* SLA & AI Warning Badges */}
      <div className="my-3 flex flex-wrap items-center gap-2">
        {/* SLA Pill */}
        <div 
          onClick={() => openModal('sla', complaint.id)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all border ${
            complaint.slaMinutesRemaining < 30
              ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>SLA: {formatMinutes(complaint.slaMinutesRemaining)}</span>
        </div>

        {/* Duplicate pill */}
        {hasDuplicates && (
          <button
            onClick={() => openModal('dedup', complaint.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <GitMerge className="w-3.5 h-3.5 text-amber-400" />
            <span>{complaint.similarityCluster.length} Duplicates Clustered</span>
          </button>
        )}

        {/* EXIF Pill */}
        <button
          onClick={() => openModal('exif', complaint.id)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            isFraud
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isFraud ? 'EXIF Tamper Quarantine' : 'EXIF Verified'}</span>
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openModal('routing', complaint.id)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Routing</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {complaint.status !== 'RESOLVED' && (
            <button
              onClick={() => resolveComplaint(complaint.id)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
