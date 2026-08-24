import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  Copy, 
  CheckCircle2, 
  GitMerge, 
  MapPin, 
  Clock, 
  User, 
  ShieldCheck, 
  X, 
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { formatTimeAgo } from '../../utils/formatters';

export default function DeduplicationModal() {
  const { 
    selectedComplaint, 
    activeModal, 
    closeModal, 
    mergeDuplicates 
  } = useCivic();

  const [notifyCitizens, setNotifyCitizens] = useState(true);
  const [selectedClusterIds, setSelectedClusterIds] = useState(
    selectedComplaint?.similarityCluster?.map(c => c.id) || []
  );

  if (activeModal !== 'dedup' || !selectedComplaint) return null;

  const cluster = selectedComplaint.similarityCluster || [];

  const handleMerge = () => {
    mergeDuplicates(selectedComplaint.id);
  };

  const toggleClusterSelect = (id) => {
    setSelectedClusterIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Deduplication & Similarity Cluster</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  Embedding Model v4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Vector similarity & geospatial proximity analysis detected duplicate citizen submissions
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Anchor Ticket */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Primary Anchor Complaint (Parent Ticket)
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {selectedComplaint.imageUrl && (
                  <img
                    src={selectedComplaint.imageUrl}
                    alt={selectedComplaint.title}
                    className="w-full sm:w-28 h-20 rounded-lg object-cover border border-slate-800 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-emerald-400">{selectedComplaint.id}</span>
                    <span className="text-[11px] text-slate-400">{formatTimeAgo(selectedComplaint.createdAt)}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">{selectedComplaint.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{selectedComplaint.description}</p>
                  
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> {selectedComplaint.citizenName}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {selectedComplaint.wardName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clustered Matches */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Discovered Similar Submissions ({cluster.length})
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Select duplicates to merge into parent ticket
              </span>
            </div>

            {cluster.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-950/50 border border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-white">No active duplicates detected</p>
                <p className="text-xs text-slate-400 mt-1">
                  This complaint is unique within its 100-meter radius & temporal window.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cluster.map((item) => {
                  const isChecked = selectedClusterIds.includes(item.id);
                  const simPct = Math.round(item.similarity * 100);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleClusterSelect(item.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5'
                          : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-700 bg-slate-800 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs font-bold text-amber-400">{item.id}</span>
                              <span className="text-[11px] text-slate-400">{item.timeAgo}</span>
                            </div>
                            <h5 className="font-semibold text-xs text-white mb-1">{item.title}</h5>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                              <span>Reported by: <strong className="text-slate-200">{item.citizenName}</strong></span>
                              <span>Proximity: <strong className="text-slate-200">{item.distanceMeters}m away</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Similarity Meter */}
                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-amber-400">{simPct}% Match</div>
                          <div className="w-20 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="bg-amber-400 h-1.5 rounded-full"
                              style={{ width: `${simPct}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">Cosine Sim</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Citizen Broadcast Notification Option */}
          {cluster.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300">
                  Notify merged citizen submitters with real-time tracking links
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyCitizens}
                  onChange={(e) => setNotifyCitizens(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          {cluster.length > 0 ? (
            <button
              onClick={handleMerge}
              disabled={selectedClusterIds.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <GitMerge className="w-4 h-4" />
              <span>Consolidate {selectedClusterIds.length} Duplicates & Update Crew Ticket</span>
            </button>
          ) : (
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-700"
            >
              Close
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
