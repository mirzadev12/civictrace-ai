import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { LayoutGrid, Map, FileText, Plus, Sparkles } from 'lucide-react';

export default function CivilianBottomNav() {
  const { civilianTab, setCivilianTab, setIsReportOpen, userReportIds } = useCivic();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* Feed Tab */}
        <button
          onClick={() => setCivilianTab('feed')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            civilianTab === 'feed'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px]">Nearby</span>
        </button>

        {/* Map Tab */}
        <button
          onClick={() => setCivilianTab('map')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            civilianTab === 'map'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px]">Map</span>
        </button>

        {/* Giant Floating Report "+" Button */}
        <button
          onClick={() => setIsReportOpen(true)}
          className="relative -mt-6 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-slate-950 cursor-pointer group"
          title="Take photo & report issue"
        >
          <Plus className="w-7 h-7 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* My Reports Tab */}
        <button
          onClick={() => setCivilianTab('my_reports')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
            civilianTab === 'my_reports'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FileText className="w-5 h-5" />
            {userReportIds.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1 bg-emerald-500 text-slate-950 text-[9px] font-extrabold rounded-full">
                {userReportIds.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">My Reports</span>
        </button>

      </div>
    </nav>
  );
}
