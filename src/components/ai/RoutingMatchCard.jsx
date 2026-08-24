import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Building2, 
  Truck, 
  Users, 
  MapPin, 
  ShieldCheck, 
  X,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const CREW_OPTIONS = {
  pwd: [
    { id: 'pwd_1', name: 'Rapid Asphalt Patch Crew #4', capacity: '3 Workers • Mini-Roller & Hot-Mix', eta: '18 mins' },
    { id: 'pwd_2', name: 'Heavy PWD Structural Repair Team #2', capacity: '6 Workers • Excavator', eta: '45 mins' }
  ],
  water: [
    { id: 'water_1', name: 'Emergency Pipe Valve Isolation Unit #1', capacity: '4 Hydraulic Techs • High-PSI Pump', eta: '12 mins' },
    { id: 'water_2', name: 'Sewage Suction & Desilting Tanker #7', capacity: '3 Workers • Vacuum Tanker', eta: '30 mins' }
  ],
  sanitation: [
    { id: 'san_1', name: 'Sanitation Heavy Tipper & Loader Unit #9', capacity: '5 Workers • 10-Ton Compactor', eta: '25 mins' },
    { id: 'san_2', name: 'Rapid Street Sweeping Patrol #3', capacity: '2 Workers • EV Tipper', eta: '15 mins' }
  ],
  electrical: [
    { id: 'elec_1', name: 'Lighting Repair Mobile Unit #2', capacity: '2 Electricians • Cherry Picker Truck', eta: '20 mins' },
    { id: 'elec_2', name: 'High-Tension Transformer Emergency Team', capacity: '4 Linemen • Mobile Generator', eta: '35 mins' }
  ],
  health: [
    { id: 'health_1', name: 'Vector Control & Fogging Unit #5', capacity: '3 Techs • Thermal Fogger', eta: '40 mins' },
    { id: 'health_2', name: 'Field Inspection Officer (Fraud Check)', capacity: '1 Officer • Legal Audit kit', eta: '25 mins' }
  ]
};

export default function RoutingMatchCard() {
  const { 
    selectedComplaint, 
    activeModal, 
    closeModal, 
    departments, 
    reassignDepartment 
  } = useCivic();

  const [selectedDeptId, setSelectedDeptId] = useState(
    selectedComplaint?.department || 'pwd'
  );
  const [selectedCrewName, setSelectedCrewName] = useState(
    selectedComplaint?.assignedCrew || 'Rapid Asphalt Patch Crew #4'
  );

  if (activeModal !== 'routing' || !selectedComplaint) return null;

  const currentPrediction = selectedComplaint.routingPrediction || {
    primaryDept: 'pwd',
    confidence: 0.94,
    rationale: "AI classifier assigned department based on visual analysis and text keywords."
  };

  const confidencePct = Math.round(currentPrediction.confidence * 100);
  const availableCrews = CREW_OPTIONS[selectedDeptId] || CREW_OPTIONS.pwd;

  const handleConfirmRouting = () => {
    const deptObj = departments.find(d => d.id === selectedDeptId);
    reassignDepartment(
      selectedComplaint.id,
      selectedDeptId,
      deptObj?.name || selectedComplaint.departmentName,
      selectedCrewName
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Automated Routing & Dispatch Engine</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full">
                  Classifier v3.2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ticket <span className="font-mono text-white font-bold">{selectedComplaint.id}</span> • Intelligent Department Triage
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
          
          {/* AI Decision Confidence Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400">Recommended Department:</span>
                <span className="text-xs font-bold text-cyan-400">{selectedComplaint.departmentName}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300">
                <span>{confidencePct}% Confidence</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-400 h-2 rounded-full"
                style={{ width: `${confidencePct}%` }}
              ></div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                AI Vision & Semantic Rationale:
              </div>
              <p className="italic text-slate-300 leading-relaxed">
                "{currentPrediction.rationale}"
              </p>
            </div>
          </div>

          {/* Department Selection Selector */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Select / Override Department</span>
              <span className="text-[11px] text-slate-500">Manual review available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {departments.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                return (
                  <div
                    key={dept.id}
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      setSelectedCrewName(CREW_OPTIONS[dept.id]?.[0]?.name || '');
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                        : 'bg-slate-950 border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{dept.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>Head: {dept.head}</span>
                      <span className="font-mono text-slate-300">Avg SLA: {dept.avgSlaHours}h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Field Crew Selector */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              Available Field Response Units ({availableCrews.length})
            </div>

            <div className="space-y-2">
              {availableCrews.map((crew) => {
                const isSelected = selectedCrewName === crew.name;
                return (
                  <div
                    key={crew.id}
                    onClick={() => setSelectedCrewName(crew.name)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{crew.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{crew.capacity}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-mono font-bold rounded">
                        ETA: {crew.eta}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmRouting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Confirm Dispatch & Radio Crew</span>
          </button>
        </div>

      </div>
    </div>
  );
}
