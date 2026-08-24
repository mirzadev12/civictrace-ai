import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { Truck, Activity, CheckCircle2, AlertTriangle, Users, Layers } from 'lucide-react';

export default function OfficerWorkloadView() {
  const { workloadStats, issues } = useCivic();

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Field Crew Workload &amp; Dynamic Capacity
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Fix deadlines and routing automatically adjust based on each team's live task queue
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
            4 Field Divisions Active
          </span>
        </div>
      </div>

      {/* Workload Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workloadStats.map((team) => {
          const isHigh = team.capacityPct > 85;
          const isNormal = team.capacityPct <= 85 && team.capacityPct >= 40;

          return (
            <div
              key={team.teamName}
              className={`p-5 rounded-3xl border bg-slate-900/90 backdrop-blur-md shadow-xl transition-all ${
                isHigh ? 'border-amber-500/40' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl border ${
                    isHigh 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                      : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{team.teamName}</h4>
                    <span className="text-[11px] text-slate-400">{team.status}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-extrabold font-mono text-white">
                    {team.activeTickets}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Active Tasks</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Team Capacity</span>
                  <span className={`font-mono font-bold ${
                    isHigh ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {team.capacityPct}% Filled
                  </span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                    }`}
                    style={{ width: `${team.capacityPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Real-time status note */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Auto-Routing Status:</span>
                <span className="font-semibold text-slate-200">
                  {isHigh ? '⚠️ Queued with priority weighting' : '✓ Normal auto-dispatch ready'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
