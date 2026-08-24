import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { Clock, CheckCircle2, MapPin, Truck, ChevronRight, PlusCircle } from 'lucide-react';

export default function MyReportsView() {
  const { 
    issues, 
    userReportIds, 
    setSelectedIssueId, 
    setIsDetailOpen, 
    setIsReportOpen 
  } = useCivic();

  const myIssues = issues.filter(i => userReportIds.includes(i.id));

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-24">
      
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white">Your Community Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track status updates and verified fix photos for issues you reported or supported
          </p>
        </div>

        <button
          onClick={() => setIsReportOpen(true)}
          className="p-2 rounded-2xl bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          title="Report another issue"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {myIssues.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400">
            <p className="text-sm font-semibold text-white">You haven't submitted any reports yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Spot something that needs fixing? Take a quick photo!</p>
            <button
              onClick={() => setIsReportOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Report an Issue
            </button>
          </div>
        ) : (
          myIssues.map((issue) => {
            const isFixed = issue.status === 'Fixed';

            return (
              <div
                key={issue.id}
                onClick={() => {
                  setSelectedIssueId(issue.id);
                  setIsDetailOpen(true);
                }}
                className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl transition-all cursor-pointer flex items-center gap-4"
              >
                <img
                  src={isFixed && issue.afterPhoto ? issue.afterPhoto : issue.photo}
                  alt={issue.title}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                      <span>{issue.categoryIcon}</span>
                      <span>{issue.title}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isFixed
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    }`}>
                      {issue.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate mb-1">
                    {issue.address}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Truck className="w-3 h-3 text-cyan-400" />
                      <span>{issue.assignedTeam}</span>
                    </span>
                    <span className="font-medium text-emerald-400">
                      {issue.fixEstimate}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
