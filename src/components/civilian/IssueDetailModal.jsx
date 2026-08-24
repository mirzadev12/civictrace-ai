import React from 'react';
import { useCivic } from '../../context/CivicContext';
import BeforeAfterSlider from '../common/BeforeAfterSlider';
import { 
  X, 
  ThumbsUp, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Sparkles,
  Share2,
  ShieldCheck
} from 'lucide-react';

export default function IssueDetailModal() {
  const { 
    selectedIssue, 
    isDetailOpen, 
    setIsDetailOpen, 
    upvoteIssue 
  } = useCivic();

  if (!isDetailOpen || !selectedIssue) return null;

  const isFixed = selectedIssue.status === 'Fixed';

  // Status Step Index
  const steps = [
    { label: 'Reported', completed: true },
    { label: 'Assigned', completed: selectedIssue.status !== 'Reported' },
    { label: 'In Progress', completed: selectedIssue.status === 'In Progress' || isFixed },
    { label: 'Fixed & Verified', completed: isFixed }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedIssue.categoryIcon}</span>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {selectedIssue.category} Detail
              </span>
              <p className="text-[11px] text-slate-400">
                {selectedIssue.area} • {selectedIssue.distance}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDetailOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main Visual: If Fixed -> Show Before/After Slider, Else Show Photo */}
          {isFixed && selectedIssue.afterPhoto ? (
            <div>
              <BeforeAfterSlider
                beforeImage={selectedIssue.photo}
                afterImage={selectedIssue.afterPhoto}
              />
            </div>
          ) : (
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
              <img
                src={selectedIssue.photo}
                alt={selectedIssue.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white text-xs font-bold rounded-full">
                {selectedIssue.status}
              </div>
            </div>
          )}

          {/* Title & Description */}
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug mb-2">
              {selectedIssue.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {selectedIssue.address}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Reported {selectedIssue.reportedTimeAgo}
              </span>
            </div>
          </div>

          {/* Clean Progress Tracker */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Fix Progress</span>
              <span className="text-emerald-400 font-mono normal-case">
                {selectedIssue.fixEstimate}
              </span>
            </div>

            {/* Step indicators */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {steps.map((step, idx) => (
                <div key={step.label} className="text-center">
                  <div
                    className={`h-2 rounded-full mb-2 transition-all ${
                      step.completed
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50'
                        : 'bg-slate-800'
                    }`}
                  ></div>
                  <span
                    className={`text-[10px] font-medium block leading-tight ${
                      step.completed ? 'text-white font-bold' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Responsible Team & Speed Info */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Assigned Authority</span>
                <strong className="text-white font-semibold">{selectedIssue.assignedTeam}</strong>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {selectedIssue.routedSpeed}
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsDetailOpen(false)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>

          {/* Upvote Button */}
          <button
            onClick={() => upvoteIssue(selectedIssue.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-lg ${
              selectedIssue.hasUpvoted
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/25 scale-105'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 shadow-emerald-500/10 active:scale-95'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${selectedIssue.hasUpvoted ? 'fill-slate-950' : ''}`} />
            <span>{selectedIssue.hasUpvoted ? 'Supported' : 'Support Issue'} ({selectedIssue.upvotes})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
