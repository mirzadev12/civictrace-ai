import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  CheckCircle2, 
  X, 
  Upload, 
  Camera, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  MapPin, 
  ThumbsUp, 
  Check 
} from 'lucide-react';

export default function OfficerFixVerifyModal() {
  const { 
    selectedIssue, 
    isVerifyOpen, 
    setIsVerifyOpen, 
    verifyAndCloseTicket 
  } = useCivic();

  const [fixPhotoPreview, setFixPhotoPreview] = useState(
    selectedIssue?.afterPhoto || "https://images.unsplash.com/photo-1584463699039-446714078832?auto=format&fit=crop&w=800&q=80"
  );
  const [checklist, setChecklist] = useState({
    locationCorrect: true,
    timeMatches: true,
    qualityStandard: true
  });

  if (!isVerifyOpen || !selectedIssue) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFixPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleApprove = () => {
    verifyAndCloseTicket(selectedIssue.id, fixPhotoPreview);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Field Repair Verification</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                  {selectedIssue.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Confirm field crew repair photo before notifying neighborhood
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVerifyOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Citizen Original Photo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Citizen Original Report</span>
                <span className="text-amber-400">Before</span>
              </div>
              <div className="h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={selectedIssue.photo}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Reported by: {selectedIssue.reportedBy} ({selectedIssue.reportedTimeAgo})
              </p>
            </div>

            {/* Crew Fix Upload Photo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Completed Field Fix</span>
                <span className="text-emerald-400">After ✨</span>
              </div>
              
              <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-950 border-2 border-dashed border-emerald-500/40 group">
                <img
                  src={fixPhotoPreview}
                  alt="Field Fix"
                  className="w-full h-full object-cover"
                />
                
                <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold gap-1">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  <span>Upload Fresh Field Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Assigned Team: {selectedIssue.assignedTeam}
              </p>
            </div>

          </div>

          {/* Plain-Language Verification Checklist */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated Integrity Checks
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span>Photo taken at correct physical location</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-[11px]">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span>Capture timestamp matches field dispatch window</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-[11px]">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span>Repair quality standard compliant</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-[11px]">APPROVED</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={() => setIsVerifyOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleApprove}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold rounded-2xl shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Approve Fix &amp; Close Ticket</span>
          </button>
        </div>

      </div>
    </div>
  );
}
