import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  Activity, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Building2, 
  AlertOctagon,
  FileSpreadsheet
} from 'lucide-react';
import StatBadge from '../common/StatBadge';

export default function AnalyticsView() {
  const { metrics, auditLogs, wards, departments } = useCivic();

  return (
    <div className="space-y-6">
      
      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBadge
          label="Total Incidents"
          value={metrics.total}
          icon={Activity}
          color="cyan"
          subtext="Active cycle"
        />
        <StatBadge
          label="Critical Risk"
          value={metrics.critical}
          icon={AlertOctagon}
          color="red"
          pulse={metrics.critical > 0}
          subtext="Emergency"
        />
        <StatBadge
          label="Duplicates Merged"
          value={metrics.duplicatesClustered}
          icon={Award}
          color="amber"
          subtext="No double crew"
        />
        <StatBadge
          label="Tamper Blocked"
          value={metrics.fraudQuarantined}
          icon={ShieldCheck}
          color="purple"
          subtext="Budget saved"
        />
        <StatBadge
          label="Resolved"
          value={metrics.resolved}
          icon={CheckCircle2}
          color="emerald"
          subtext="Closed tickets"
        />
        <StatBadge
          label="SLA Compliance"
          value={`${metrics.avgSlaCompliance}%`}
          icon={Clock}
          color="emerald"
          subtext="City target: 90%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ward Performance Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Ward Jurisdiction Health & SLA Leaderboard
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time performance scoring per municipal quadrant</p>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase font-semibold">
                  <th className="py-2.5 px-3">Ward Jurisdiction</th>
                  <th className="py-2.5 px-3">Engineer in Charge</th>
                  <th className="py-2.5 px-3">Population</th>
                  <th className="py-2.5 px-3 text-right">SLA Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {wards.map((ward) => (
                  <tr key={ward.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{ward.name}</div>
                      <div className="text-[11px] text-slate-400">{ward.zone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <div>{ward.engineerInCharge}</div>
                      <div className="text-[10px] text-slate-500">{ward.contact}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      {ward.population.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono font-bold text-white">{ward.slaPerformance}%</div>
                      <div className="w-20 bg-slate-800 rounded-full h-1.5 ml-auto mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            ward.slaPerformance > 90 ? 'bg-emerald-400' :
                            ward.slaPerformance > 80 ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${ward.slaPerformance}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                Real-Time Triage Audit Stream
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">APPEND-ONLY</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {auditLogs.map((log) => {
                let badgeClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                if (log.badge === 'MERGED') badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                if (log.badge === 'ESCALATION') badgeClass = 'bg-red-500/10 text-red-400 border-red-500/30';
                if (log.badge === 'FRAUD') badgeClass = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                if (log.badge === 'RESOLVED') badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

                return (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{log.action}</span>
                      <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                      {log.details}
                    </p>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase ${badgeClass}`}>
                      {log.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
