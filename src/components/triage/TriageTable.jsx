import React from 'react';
import { useCivic } from '../../context/CivicContext';
import ComplaintCard from './ComplaintCard';
import FilterToolbar from './FilterToolbar';
import { 
  Clock, 
  MapPin, 
  GitMerge, 
  ShieldAlert, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { formatMinutes, formatTimeAgo, getPriorityBadge, getStatusBadge } from '../../utils/formatters';

export default function TriageTable() {
  const { 
    filteredComplaints, 
    openModal, 
    resolveComplaint, 
    setSelectedComplaintId 
  } = useCivic();

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <FilterToolbar />

      {/* Mobile Card List View (Visible on Small Screens) */}
      <div className="md:hidden space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
            No complaints match the current filter.
          </div>
        ) : (
          filteredComplaints.map(complaint => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))
        )}
      </div>

      {/* Desktop / Tablet Tabular Queue View */}
      <div className="hidden md:block bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Incident & Thumbnail</th>
                <th className="py-3.5 px-4 font-semibold">Ward & Location</th>
                <th className="py-3.5 px-4 font-semibold">Priority & SLA Window</th>
                <th className="py-3.5 px-4 font-semibold">Department & Crew</th>
                <th className="py-3.5 px-4 font-semibold">AI Verification</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    No active civic tickets found matching the selected parameters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map(complaint => {
                  const isCritical = complaint.priority === 'CRITICAL' || complaint.slaMinutesRemaining < 30;
                  const hasDuplicates = complaint.similarityCluster?.length > 0;
                  const isFraud = complaint.status === 'FLAGGED_FRAUD' || (complaint.exif && !complaint.exif.isAuthentic);

                  return (
                    <tr 
                      key={complaint.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isCritical ? 'bg-red-950/10' : ''
                      }`}
                    >
                      {/* Incident & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {complaint.imageUrl && (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                              <img
                                src={complaint.imageUrl}
                                alt={complaint.title}
                                className="w-full h-full object-cover"
                              />
                              {isFraud && (
                                <span className="absolute inset-0 bg-red-600/60 flex items-center justify-center text-[9px] font-bold text-white">
                                  TAMPER
                                </span>
                              )}
                            </div>
                          )}
                          <div className="max-w-[220px]">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono font-bold text-slate-300">{complaint.id}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${getStatusBadge(complaint.status)}`}>
                                {complaint.status}
                              </span>
                            </div>
                            <h5 className="font-bold text-white line-clamp-1">{complaint.title}</h5>
                            <span className="text-[10px] text-slate-400">{formatTimeAgo(complaint.createdAt)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Ward & Location */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-[180px]">
                          <div className="font-semibold text-slate-200 line-clamp-1">{complaint.wardName}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{complaint.address}</div>
                        </div>
                      </td>

                      {/* Priority & SLA */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadge(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                          <div 
                            onClick={() => openModal('sla', complaint.id)}
                            className={`flex items-center gap-1 font-mono font-bold cursor-pointer hover:underline ${
                              complaint.slaMinutesRemaining < 30 ? 'text-red-400' : 'text-emerald-400'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{formatMinutes(complaint.slaMinutesRemaining)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Department & Crew */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-[190px]">
                          <div className="font-semibold text-slate-200 line-clamp-1">{complaint.departmentName}</div>
                          <div className="text-[11px] text-cyan-400 line-clamp-1 flex items-center gap-1">
                            <Truck className="w-3 h-3 shrink-0" />
                            <span>{complaint.assignedCrew || 'Pending Dispatch'}</span>
                          </div>
                        </div>
                      </td>

                      {/* AI Verification */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          {hasDuplicates ? (
                            <button
                              onClick={() => openModal('dedup', complaint.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-[10px] font-bold transition-all w-fit cursor-pointer"
                            >
                              <GitMerge className="w-3 h-3" />
                              <span>{complaint.similarityCluster.length} Duplicates Clustered</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500">Unique Report</span>
                          )}

                          <button
                            onClick={() => openModal('exif', complaint.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-all w-fit cursor-pointer ${
                              isFraud 
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {isFraud ? <ShieldAlert className="w-3 h-3 text-purple-400" /> : <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                            <span>{isFraud ? 'GPS Spoof Alert' : 'EXIF Verified'}</span>
                          </button>
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openModal('routing', complaint.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="AI Routing & Dispatch"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                          {complaint.status !== 'RESOLVED' && (
                            <button
                              onClick={() => resolveComplaint(complaint.id)}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                              title="Mark Resolved"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
