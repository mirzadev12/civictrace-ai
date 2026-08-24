import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';

export default function FilterToolbar() {
  const {
    wards,
    selectedWard,
    setSelectedWard,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery
  } = useCivic();

  const categories = [
    "ALL",
    "Roads & Infrastructure",
    "Water Supply & Sewage",
    "Solid Waste & Sanitation",
    "Electrical & Streetlighting",
    "Environment & Horticulture"
  ];

  const statuses = [
    { value: "ALL", label: "All Statuses" },
    { value: "TRIAGED", label: "Triaged" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "ESCALATED", label: "Escalated" },
    { value: "FLAGGED_FRAUD", label: "Fraud Quarantined" },
    { value: "RESOLVED", label: "Resolved" }
  ];

  const handleReset = () => {
    setSelectedWard('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedWard !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || searchQuery !== '';

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ticket #, keyword, location, citizen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ward Select */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Wards</option>
            {wards.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[160px] truncate"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {statuses.map(st => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>

          {/* Reset Filter Button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
