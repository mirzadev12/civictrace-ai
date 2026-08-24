import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  ThumbsUp, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export default function OfficerPriorityQueue() {
  const { 
    issues, 
    setSelectedIssueId, 
    setIsVerifyOpen, 
    setIsDetailOpen 
  } = useCivic();

  // Sort by upvotes (highest priority on top)
  const sortedIssues = [...issues].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="space-y-4">
      
      {/* Top Banner Guide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-amber-400" />
            Community-Ranked Priority Queue
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tickets sorted in real-time by neighborhood upvotes and countdown to fix deadline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            {issues.filter(i => i.status !== 'Fixed').length} Active Dispatches
          </span>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold">
                <th className="py-4 px-4">Ticket &amp; Community Voice</th>
                <th className="py-4 px-4">Area &amp; Location</th>
                <th className="py-4 px-4">Auto-Assigned Team</th>
                <th className="py-4 px-4">Fix Deadline</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedIssues.map((issue) => {
                const isFixed = issue.status === 'Fixed';
                const isUrgent = issue.upvotes >= 30 && !isFixed;

                return (
                  <tr 
                    key={issue.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isUrgent ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    {/* Ticket & Upvotes */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={issue.photo}
                          alt={issue.title}
                          className="w-12 h-12 rounded-2xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div className="max-w-[240px]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-slate-300">{issue.id}</span>
                            <span className="flex items-center gap-1 font-bold text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                              <ThumbsUp className="w-3 h-3 fill-amber-400" />
                              {issue.upvotes} Upvotes
                            </span>
                          </div>
                          <h4 className="font-bold text-white line-clamp-1">{issue.title}</h4>
                        </div>
                      </div>
                    </td>

                    {/* Area & Location */}
                    <td className="py-4 px-4">
                      <div className="max-w-[160px]">
                        <div className="font-semibold text-slate-200">{issue.area}</div>
                        <div className="text-[11px] text-slate-400 truncate">{issue.address}</div>
                      </div>
                    </td>

                    {/* Assigned Team & Speed */}
                    <td className="py-4 px-4">
                      <div className="max-w-[200px] space-y-1">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{issue.assignedTeam}</span>
                        </div>
                        <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          {issue.routedSpeed}
                        </span>
                      </div>
                    </td>

                    {/* Fix Deadline */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 font-mono">
                        <div className={`font-bold flex items-center gap-1 ${
                          isFixed ? 'text-emerald-400' : isUrgent ? 'text-amber-400' : 'text-slate-300'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{issue.fixEstimate}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Reported {issue.reportedTimeAgo}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        isFixed
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : issue.status === 'In Progress'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {issue.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 text-right">
                      {isFixed ? (
                        <button
                          onClick={() => {
                            setSelectedIssueId(issue.id);
                            setIsDetailOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View Fix ✨
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedIssueId(issue.id);
                            setIsVerifyOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          Verify Fix
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
