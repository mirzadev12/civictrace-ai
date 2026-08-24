import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  Play, 
  AlertTriangle, 
  Copy, 
  ShieldAlert, 
  Sparkles, 
  Zap,
  HelpCircle
} from 'lucide-react';

export default function DemoScenariosBar() {
  const { scenarios, activeScenarioId, loadScenario } = useCivic();

  const iconMap = {
    AlertTriangle: AlertTriangle,
    Copy: Copy,
    ShieldAlert: ShieldAlert,
    Sparkles: Sparkles
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Interactive Demo Scenarios & Stress Tests
            </h3>
            <p className="text-[11px] text-slate-400">
              Trigger pre-configured high-impact municipal incidents in 1-click
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 hidden lg:inline">
          Simulating Delhi Central Metropolitan Core
        </span>
      </div>

      {/* Grid of Scenario Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {scenarios.map((scenario) => {
          const Icon = iconMap[scenario.icon] || Sparkles;
          const isActive = activeScenarioId === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => loadScenario(scenario.id)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-800 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${
                    scenario.id === 'water_rupture' ? 'text-red-400' :
                    scenario.id === 'pothole_blitz' ? 'text-amber-400' :
                    scenario.id === 'exif_tamper' ? 'text-purple-400' : 'text-cyan-400'
                  }`} />
                  <span className="font-bold text-xs text-white truncate max-w-[120px]">
                    {scenario.title}
                  </span>
                </div>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border uppercase shrink-0 ${scenario.badgeColor}`}>
                  {scenario.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-1 mb-2 font-medium">
                {scenario.tagline}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-900">
                <span>Click to Simulate</span>
                <Play className="w-3 h-3 text-emerald-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
