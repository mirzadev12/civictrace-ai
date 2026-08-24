import React from 'react';

export default function StatBadge({ label, value, subtext, icon: Icon, color = 'emerald', pulse = false, onClick }) {
  const colorMap = {
    emerald: 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400',
    red: 'border-red-500/30 bg-red-950/30 text-red-400',
    amber: 'border-amber-500/30 bg-amber-950/30 text-amber-400',
    blue: 'border-blue-500/30 bg-blue-950/30 text-blue-400',
    purple: 'border-purple-500/30 bg-purple-950/30 text-purple-400',
    cyan: 'border-cyan-500/30 bg-cyan-950/30 text-cyan-400'
  };

  const badgeClass = colorMap[color] || colorMap.emerald;

  return (
    <div 
      onClick={onClick}
      className={`relative p-3.5 rounded-xl border ${badgeClass} backdrop-blur-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-opacity-60 hover:scale-[1.02]' : ''
      }`}
    >
      {pulse && (
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="w-4 h-4 opacity-75" />}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">{value}</span>
        {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
      </div>
    </div>
  );
}
