import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { Activity, ShieldCheck, Zap, AlertOctagon, TrendingUp } from 'lucide-react';

export default function MunicipalTicker() {
  const { metrics, activeScenarioId } = useCivic();

  return (
    <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-2 text-xs flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none">
      <div className="flex items-center gap-6 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400">TELEMETRY LIVE</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Delhi Central Control (Zones 1-4)</span>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>System SLA: <strong className="text-white font-mono">{metrics.avgSlaCompliance}%</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Clustered Duplicates: <strong className="text-white font-mono">{metrics.duplicatesClustered} reports</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Tamper Shield: <strong className="text-white font-mono">{metrics.fraudQuarantined} blocked</strong></span>
        </div>

        {metrics.critical > 0 && (
          <div className="flex items-center gap-1.5 text-red-400 font-semibold animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{metrics.critical} CRITICAL EMERGENCY ACTION REQUIRED</span>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-3 text-slate-400">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px]">AI Dispatch Latency: <span className="font-mono text-emerald-400">140ms</span></span>
        </div>
      </div>
    </div>
  );
}
