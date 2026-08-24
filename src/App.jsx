import React, { useState } from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import Header from './components/layout/Header';
import MunicipalTicker from './components/layout/MunicipalTicker';
import BottomNav from './components/layout/BottomNav';
import ToastContainer from './components/common/ToastContainer';
import DemoScenariosBar from './components/scenarios/DemoScenariosBar';
import InteractiveMap from './components/map/InteractiveMap';
import TriageTable from './components/triage/TriageTable';
import AnalyticsView from './components/analytics/AnalyticsView';
import DeduplicationModal from './components/ai/DeduplicationModal';
import SlaCalculatorCard from './components/ai/SlaCalculatorCard';
import RoutingMatchCard from './components/ai/RoutingMatchCard';
import ExifVerifier from './components/ai/ExifVerifier';
import NewComplaintModal from './components/triage/NewComplaintModal';
import StatBadge from './components/common/StatBadge';
import { 
  Activity, 
  AlertOctagon, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Map, 
  LayoutGrid, 
  Layers,
  Sparkles,
  Truck
} from 'lucide-react';

function DashboardContent() {
  const [currentTab, setCurrentTab] = useState('triage');
  const { metrics, selectedComplaint, openModal } = useCivic();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20 sm:pb-8">
      {/* Header */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Live Telemetry Ticker */}
      <MunicipalTicker />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8 space-y-6">
        
        {/* Top 1-Click Interactive Scenarios Bar */}
        <DemoScenariosBar />

        {/* Dynamic Main View Area */}
        {currentTab === 'triage' && (
          <div className="space-y-6">
            
            {/* KPI Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatBadge
                label="Active Tickets"
                value={metrics.total}
                icon={Activity}
                color="cyan"
              />
              <StatBadge
                label="Critical Priority"
                value={metrics.critical}
                icon={AlertOctagon}
                color="red"
                pulse={metrics.critical > 0}
              />
              <StatBadge
                label="Duplicates Clustered"
                value={metrics.duplicatesClustered}
                icon={Award}
                color="amber"
              />
              <StatBadge
                label="Fraud Quarantined"
                value={metrics.fraudQuarantined}
                icon={ShieldCheck}
                color="purple"
              />
              <StatBadge
                label="Resolved Clean"
                value={metrics.resolved}
                icon={CheckCircle2}
                color="emerald"
              />
              <StatBadge
                label="SLA Compliance"
                value={`${metrics.avgSlaCompliance}%`}
                icon={Clock}
                color="emerald"
              />
            </div>

            {/* Split Screen: Triage Table & Live Map Mini Cockpit */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Triage Queue (7 cols on large screens) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Municipal Triage Queue
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    Real-time AI Verification & Ingestion Feed
                  </span>
                </div>
                <TriageTable />
              </div>

              {/* Map & Live Inspector (5 cols on large screens) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Live Geospatial Radar
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    Ward Geofences & Pulse Pins
                  </span>
                </div>

                <div className="h-[380px] lg:h-[480px]">
                  <InteractiveMap />
                </div>

                {/* Quick Inspection Card if a complaint is active */}
                {selectedComplaint && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Active Selected Inspection
                      </span>
                      <span className="font-mono text-xs font-bold text-cyan-400">{selectedComplaint.id}</span>
                    </div>
                    <h4 className="font-bold text-xs text-white line-clamp-1 mb-1">{selectedComplaint.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">{selectedComplaint.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => openModal('dedup', selectedComplaint.id)}
                        className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold rounded-lg border border-slate-700 text-center transition-colors cursor-pointer"
                      >
                        Deduplicate
                      </button>
                      <button
                        onClick={() => openModal('sla', selectedComplaint.id)}
                        className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-red-300 text-[11px] font-bold rounded-lg border border-slate-700 text-center transition-colors cursor-pointer"
                      >
                        SLA Radar
                      </button>
                      <button
                        onClick={() => openModal('exif', selectedComplaint.id)}
                        className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-purple-300 text-[11px] font-bold rounded-lg border border-slate-700 text-center transition-colors cursor-pointer"
                      >
                        EXIF Check
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {currentTab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-emerald-400" />
                  Full-Screen Geospatial Municipal Command Center
                </h2>
                <p className="text-xs text-slate-400">
                  Interactive multi-layer map with ward boundaries, live GPS pins, and emergency heat indicators
                </p>
              </div>
            </div>
            <div className="h-[75vh]">
              <InteractiveMap />
            </div>
          </div>
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView />
        )}

      </main>

      {/* Global AI Modals */}
      <DeduplicationModal />
      <SlaCalculatorCard />
      <RoutingMatchCard />
      <ExifVerifier />
      <NewComplaintModal />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Mobile Navigation Bar */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <CivicProvider>
      <DashboardContent />
    </CivicProvider>
  );
}
