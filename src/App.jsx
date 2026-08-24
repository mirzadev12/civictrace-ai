import React from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import AppNavbar from './components/layout/AppNavbar';
import CivilianFeed from './components/civilian/CivilianFeed';
import CivilianHeatmap from './components/civilian/CivilianHeatmap';
import MyReportsView from './components/civilian/MyReportsView';
import CivilianBottomNav from './components/civilian/CivilianBottomNav';
import OfficerDashboard from './components/officer/OfficerDashboard';
import IssueDetailModal from './components/civilian/IssueDetailModal';
import ReportFlowModal from './components/civilian/ReportFlowModal';
import OfficerFixVerifyModal from './components/officer/OfficerFixVerifyModal';
import LiveAppQrModal from './components/common/LiveAppQrModal';
import ToastContainer from './components/common/ToastContainer';

function DualViewApp() {
  const { currentView, civilianTab } = useCivic();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Universal Top Bar with Instant Dual-View Switcher */}
      <AppNavbar />

      {/* Main Screen Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-8">
        
        {/* VIEW 1: CIVILIAN PORTAL (Instagram-Simple) */}
        {currentView === 'civilian' && (
          <div className="animate-in fade-in duration-150">
            {civilianTab === 'feed' && <CivilianFeed />}
            {civilianTab === 'map' && <CivilianHeatmap />}
            {civilianTab === 'my_reports' && <MyReportsView />}
            
            {/* Civilian Bottom Navigation with Floating Camera Report Button */}
            <CivilianBottomNav />
          </div>
        )}

        {/* VIEW 2: OFFICER PORTAL (Full Logistics Operations Cockpit) */}
        {currentView === 'officer' && (
          <div className="animate-in fade-in duration-150">
            <OfficerDashboard />
          </div>
        )}

      </main>

      {/* Global Modals */}
      <IssueDetailModal />
      <ReportFlowModal />
      <OfficerFixVerifyModal />

      {/* Floating QR Code for Judges to Test on Mobile */}
      <LiveAppQrModal />

      {/* Toast Notification Container */}
      <ToastContainer />

    </div>
  );
}

export default function App() {
  return (
    <CivicProvider>
      <DualViewApp />
    </CivicProvider>
  );
}
