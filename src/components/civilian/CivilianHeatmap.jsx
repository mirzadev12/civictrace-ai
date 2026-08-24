import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useCivic } from '../../context/CivicContext';
import { Sparkles, MapPin, Clock, Flame, ThumbsUp } from 'lucide-react';

function createFriendlyPin(issue) {
  const iconEmoji = issue.categoryIcon || '⚠️';
  const html = `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="width: 28px; height: 28px; border-radius: 9999px; background: #0f172a; border: 2px solid ${issue.status === 'Fixed' ? '#10b981' : '#06b6d4'}; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
        ${iconEmoji}
      </div>
      ${issue.upvotes > 20 ? `
        <span style="position: absolute; top: -3px; right: -3px; background: #f43f5e; color: white; font-size: 9px; font-weight: 800; border-radius: 9999px; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;">
          ★
        </span>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'civilian-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}

export default function CivilianHeatmap() {
  const { heatmapHotspots, issues, setSelectedIssueId, setIsDetailOpen } = useCivic();

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-24">
      
      {/* Friendly Guide Header */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Neighborhood Activity Map</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Glowing zones show where community reports and neighbor upvotes are highest. Teams are active across all highlighted areas.
        </p>
      </div>

      {/* Map Container */}
      <div className="relative h-[65vh] w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />

          {/* Glowing Intensity Circles */}
          {heatmapHotspots.map((zone) => (
            <CircleMarker
              key={zone.id}
              center={zone.center}
              radius={38}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.25,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-1 text-slate-100 max-w-[200px]">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-white">{zone.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                      {zone.intensity}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1 my-2">
                    <div>Common Problem: <strong className="text-white">{zone.topIssue}</strong></div>
                    <div>Active Fixes: <strong className="text-emerald-400">{zone.issueCount} in progress</strong></div>
                    <div>Typical Response: <strong className="text-slate-300">{zone.avgWaitTime}</strong></div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Issue Pins */}
          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={issue.location}
              icon={createFriendlyPin(issue)}
            >
              <Popup>
                <div className="p-1 text-slate-100 max-w-[220px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span>{issue.categoryIcon}</span>
                    <span className="font-bold text-xs text-white line-clamp-1">{issue.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">{issue.address}</p>

                  <div className="flex items-center justify-between text-[11px] mb-2 bg-slate-900 p-1.5 rounded-lg">
                    <span className="text-emerald-400 font-semibold">{issue.fixEstimate}</span>
                    <span className="text-slate-300 font-medium">👍 {issue.upvotes}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setIsDetailOpen(true);
                    }}
                    className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}
