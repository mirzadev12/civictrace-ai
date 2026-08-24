import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useCivic } from '../../context/CivicContext';
import { Truck, Clock, ThumbsUp, CheckCircle2, ShieldAlert } from 'lucide-react';

function createOfficerPin(issue) {
  let color = '#3b82f6';
  let emoji = '⚠️';

  if (issue.status === 'Fixed') {
    color = '#10b981'; // green
    emoji = '✓';
  } else if (issue.upvotes >= 30) {
    color = '#ef4444'; // red (critical)
    emoji = '🚨';
  } else if (issue.status === 'In Progress') {
    color = '#06b6d4'; // cyan
    emoji = '⚡';
  } else {
    color = '#f59e0b'; // amber
    emoji = '📍';
  }

  const isUrgent = issue.upvotes >= 30 && issue.status !== 'Fixed';

  const html = `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      ${isUrgent ? `<div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(239,68,68,0.5);" class="animate-ping"></div>` : ''}
      <div style="width: 30px; height: 30px; border-radius: 9999px; background: ${color}; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 13px; color: white; box-shadow: 0 4px 14px rgba(0,0,0,0.6);">
        ${emoji}
      </div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'officer-pin',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
}

export default function OfficerLiveMap() {
  const { issues, setSelectedIssueId, setIsVerifyOpen, setIsDetailOpen } = useCivic();

  return (
    <div className="space-y-4">
      
      {/* Ops Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Operational Dispatch &amp; Live Pin Radar
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial dispatch with automated team routing
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500"></span> High Priority</span>
          <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> In Progress</span>
          <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Fixed</span>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[65vh] w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />

          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={issue.location}
              icon={createOfficerPin(issue)}
            >
              <Popup>
                <div className="p-1 text-slate-100 max-w-[240px]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{issue.id}</span>
                    <span className="text-[10px] font-bold text-amber-400">👍 {issue.upvotes} Upvotes</span>
                  </div>

                  <h4 className="font-bold text-xs text-white line-clamp-1 mb-1">{issue.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mb-2">{issue.address}</p>

                  {/* Auto-Assigned Team Badge with speed */}
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1 mb-2.5">
                    <div className="text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{issue.assignedTeam}</span>
                    </div>
                    <span className="block text-[9px] font-mono text-emerald-400">
                      {issue.routedSpeed}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedIssueId(issue.id);
                        setIsDetailOpen(true);
                      }}
                      className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIssueId(issue.id);
                        setIsVerifyOpen(true);
                      }}
                      className="py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Verify Fix
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}
