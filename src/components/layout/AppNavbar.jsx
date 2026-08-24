import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { Building2, User, ShieldCheck, Sparkles, Activity } from 'lucide-react';

export default function AppNavbar() {
  const { currentView, setCurrentView } = useCivic();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <Building2 className="w-4.5 h-4.5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-mono">
                  CivicTrace<span className="text-emerald-400">.</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                  currentView === 'civilian'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  {currentView === 'civilian' ? 'Community' : 'Officer Ops'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {currentView === 'civilian' 
                  ? 'Your neighborhood issues fixed faster together' 
                  : 'Real-time routing, crew verification & workload cockpit'}
              </p>
            </div>
          </div>

          {/* Top-Right Dual View Switcher (Civilian / Officer) */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setCurrentView('civilian')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'civilian'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Civilian View</span>
            </button>

            <button
              onClick={() => setCurrentView('officer')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'officer'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Officer View</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
