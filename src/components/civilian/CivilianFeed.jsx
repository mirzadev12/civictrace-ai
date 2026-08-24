import React, { useState, useEffect } from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  ThumbsUp, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Truck,
  Plus,
  Flame
} from 'lucide-react';

function AnimatedCounter({ targetNumber }) {
  const [count, setCount] = useState(targetNumber - 12);

  useEffect(() => {
    let start = count;
    const duration = 1200;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = (targetNumber - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetNumber]);

  return <span className="font-bold font-mono text-emerald-400">{count}</span>;
}

export default function CivilianFeed() {
  const { 
    issues, 
    upvoteIssue, 
    setSelectedIssueId, 
    setIsDetailOpen, 
    setIsReportOpen,
    fixedCountThisMonth,
    activeFilterCategory,
    setActiveFilterCategory 
  } = useCivic();

  const categories = [
    { label: 'All Issues', value: 'ALL', icon: '✨' },
    { label: 'Potholes', value: 'Pothole', icon: '🕳️' },
    { label: 'Water Leaks', value: 'Water Leak', icon: '💧' },
    { label: 'Garbage', value: 'Garbage', icon: '🗑️' },
    { label: 'Streetlights', value: 'Streetlight', icon: '💡' },
    { label: 'Drainage', value: 'Drainage', icon: '🌊' },
  ];

  const filteredIssues = issues.filter(issue => {
    if (activeFilterCategory === 'ALL') return true;
    return issue.category === activeFilterCategory;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Fixed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'In Progress':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Assigned':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto pb-24">
      
      {/* Top Banner: Community Progress Counter */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0 shadow-inner">
            🎉
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              <AnimatedCounter targetNumber={fixedCountThisMonth} /> neighborhood fixes this month!
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Verified by community photo checks and neighborhood upvotes.
            </p>
          </div>
        </div>
      </div>

      {/* Category Horizontal Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeFilterCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveFilterCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Vertical Feed of Issue Cards */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
            <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-white">No active issues in this category</p>
            <p className="text-xs text-slate-400 mt-1">Your neighborhood is looking great!</p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isFixed = issue.status === 'Fixed';

            return (
              <div
                key={issue.id}
                className="group relative bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl transition-all duration-200"
              >
                {/* Card Image Area (Clickable to view detail) */}
                <div 
                  onClick={() => {
                    setSelectedIssueId(issue.id);
                    setIsDetailOpen(true);
                  }}
                  className="relative h-56 sm:h-64 w-full bg-slate-950 cursor-pointer overflow-hidden"
                >
                  <img
                    src={issue.photo}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                      <span>{issue.categoryIcon}</span>
                      <span>{issue.category}</span>
                    </span>

                    <span className={`px-3 py-1 backdrop-blur-md border text-xs font-bold rounded-full shadow-lg flex items-center gap-1 ${getStatusBadge(issue.status)}`}>
                      {isFixed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : null}
                      <span>{issue.status}</span>
                    </span>
                  </div>

                  {/* Bottom Image Info: Distance & Fix Estimate */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-slate-200 pointer-events-none">
                    <span className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{issue.distance}</span>
                    </span>

                    <span className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 font-medium text-emerald-300">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{issue.fixEstimate}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content & Action Area */}
                <div className="p-4 sm:p-5">
                  <div 
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setIsDetailOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-1">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                      <span>{issue.address}</span>
                      <span>•</span>
                      <span>{issue.reportedTimeAgo}</span>
                    </p>
                  </div>

                  {/* Responsible Team & Upvote Button */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300 min-w-0">
                      <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate font-medium text-slate-300">
                        {issue.assignedTeam}
                      </span>
                    </div>

                    {/* Neighborhood Upvote Button */}
                    <button
                      onClick={() => upvoteIssue(issue.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                        issue.hasUpvoted
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 scale-105'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${issue.hasUpvoted ? 'fill-slate-950' : ''}`} />
                      <span>{issue.upvotes}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
