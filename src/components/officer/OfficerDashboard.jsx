import React from 'react';
import { useCivic } from '../../context/CivicContext';
import OfficerPriorityQueue from './OfficerPriorityQueue';
import OfficerLiveMap from './OfficerLiveMap';
import OfficerWorkloadView from './OfficerWorkloadView';
import { ListOrdered, Map, Users, ShieldCheck, Activity } from 'lucide-react';

export default function OfficerDashboard() {
  const { officerTab, setOfficerTab, issues } = useCivic();

  const activeCount = issues.filter(i => i.status !== 'Fixed').length;
  const fixedCount = issues.filter(i => i.status === 'Fixed').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Officer Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
          <button
            onClick={() => setOfficerTab('queue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              officerTab === 'queue'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Priority Queue ({activeCount})</span>
          </button>

          <button
            onClick={() => setOfficerTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              officerTab === 'map'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Live Dispatch Map</span>
          </button>

          <button
            onClick={() => setOfficerTab('workload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              officerTab === 'workload'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Crew Workload</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Auto-Dispatcher Active
          </span>
        </div>
      </div>

      {/* Subviews */}
      {officerTab === 'queue' && <OfficerPriorityQueue />}
      {officerTab === 'map' && <OfficerLiveMap />}
      {officerTab === 'workload' && <OfficerWorkloadView />}

    </div>
  );
}
