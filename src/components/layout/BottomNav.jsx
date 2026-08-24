import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { LayoutGrid, Map, ShieldAlert, PlusCircle, Activity } from 'lucide-react';

export default function BottomNav({ currentTab, setCurrentTab }) {
  const { metrics, openModal } = useCivic();

  const navItems = [
    { id: 'triage', label: 'Triage', icon: LayoutGrid, count: metrics.total },
    { id: 'map', label: 'Geo Map', icon: Map },
    { id: 'new', label: 'Report', icon: PlusCircle, isAction: true },
    { id: 'analytics', label: 'SLA Audit', icon: Activity },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={() => openModal('new_complaint')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 -mt-5"
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.count !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
