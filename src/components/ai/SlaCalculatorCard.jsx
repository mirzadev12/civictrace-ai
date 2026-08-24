import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  Clock, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  ShieldAlert, 
  UserCheck, 
  CheckCircle, 
  X,
  Radio,
  Zap
} from 'lucide-react';
import { formatMinutes } from '../../utils/formatters';

export default function SlaCalculatorCard() {
  const { 
    selectedComplaint, 
    activeModal, 
    closeModal, 
    escalateComplaint 
  } = useCivic();

  if (activeModal !== 'sla' || !selectedComplaint) return null;

  const totalMin = selectedComplaint.slaTotalMinutes || 240;
  const remMin = selectedComplaint.slaMinutesRemaining || 120;
  const pctRemaining = Math.max(0, Math.min(100, Math.round((remMin / totalMin) * 100)));
  const isCritical = remMin < 30 || selectedComplaint.priority === 'CRITICAL';

  const handleEscalate = () => {
    escalateComplaint(selectedComplaint.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isCritical ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Dynamic SLA & Priority Risk Matrix</h3>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full border ${
                  isCritical ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                }`}>
                  {selectedComplaint.slaStatus || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ticket <span className="font-mono text-white font-bold">{selectedComplaint.id}</span> • Dynamic Resolution Horizon
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

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main SLA Gauge Card */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isCritical ? 'bg-red-950/20 border-red-500/40' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolution Window</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl font-extrabold font-mono ${
                    isCritical ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {formatMinutes(remMin)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">remaining of {formatMinutes(totalMin)} base SLA</span>
                </div>
              </div>

              {/* Circular / Progress Indicator */}
              <div className="w-full sm:w-48 bg-slate-900 rounded-full h-3.5 border border-slate-800 overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCritical ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}
                  style={{ width: `${pctRemaining}%` }}
                ></div>
              </div>
            </div>

            {isCritical && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>
                  <strong>CRITICAL SLA WARNING:</strong> Time threshold approaching breach status (&lt;15% window). Immediate supervisor intervention required.
                </span>
              </div>
            )}
          </div>

          {/* Dynamic Risk Factors Breakdown */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              Dynamic Urgency Multipliers
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Citizen Safety & Casualty Hazard</div>
                  <div className="text-[11px] text-slate-400">High-speed arterial roadway</div>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg">
                  1.6x Multiplier
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Cluster Velocity & Virality</div>
                  <div className="text-[11px] text-slate-400">
                    {selectedComplaint.similarityCluster?.length || 0} duplicate reports in 30 mins
                  </div>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg">
                  1.3x Multiplier
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Reporter Trust Rating</div>
                  <div className="text-[11px] text-slate-400">
                    Citizen score: {selectedComplaint.citizenCredibilityScore || 90}/100
                  </div>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">
                  High Confidence
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Ward Historical Compliance</div>
                  <div className="text-[11px] text-slate-400">{selectedComplaint.wardName}</div>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg">
                  94.2% On-Time
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Crew Status */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Field Response Telemetry</div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400">Assigned Crew: </span>
                <strong className="text-white">{selectedComplaint.assignedCrew || 'Rapid Crew Unit #1'}</strong>
              </div>
              <div>
                <span className="text-slate-400">Crew Status: </span>
                <span className="font-mono font-bold text-cyan-400">{selectedComplaint.crewStatus || 'DISPATCHED'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleEscalate}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Broadcast Executive SLA Escalation</span>
          </button>
        </div>

      </div>
    </div>
  );
}
