import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  Layers, 
  Radio, 
  BellRing,
  Sparkles
} from 'lucide-react';

export default function Header({ currentTab, setCurrentTab }) {
  const { 
    wards, 
    selectedWard, 
    setSelectedWard, 
    openModal, 
    metrics 
  } = useCivic();

  return (
    <header className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white font-mono">
                  CivicTrace<span className="text-emerald-400">.AI</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  MUNICIPAL CORE v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Intelligent Incident Triage, Deduplication & Auto-Dispatch Engine
              </p>
            </div>
          </div>

          {/* Center: Ward Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">Jurisdiction:</span>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-2"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Wards (City Overview)</option>
              {wards.map(ward => (
                <option key={ward.id} value={ward.id} className="bg-slate-900 text-white">
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher for Desktop */}
            <div className="hidden sm:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCurrentTab('triage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'triage'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Triage Command
              </button>
              <button
                onClick={() => setCurrentTab('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'map'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Geospatial Map
              </button>
              <button
                onClick={() => setCurrentTab('analytics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'analytics'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Audit & SLA
              </button>
            </div>

            {/* Quick Report Simulation Button */}
            <button
              onClick={() => openModal('new_complaint')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Incident</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
