import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useCivic } from '../../context/CivicContext';
import { 
  AlertTriangle, 
  Droplet, 
  Trash2, 
  Zap, 
  ShieldAlert, 
  Clock, 
  Layers, 
  CheckCircle2,
  ExternalLink,
  Users
} from 'lucide-react';
import { formatMinutes, getPriorityBadge, getStatusBadge } from '../../utils/formatters';

// Center map on selected complaint
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 14, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom Leaflet DivIcon generator
function createCustomPin(complaint, isSelected) {
  let color = '#3b82f6'; // blue
  let glow = 'rgba(59, 130, 246, 0.5)';
  let iconHtml = '⚠️';

  if (complaint.priority === 'CRITICAL') {
    color = '#ef4444';
    glow = 'rgba(239, 68, 68, 0.7)';
    iconHtml = '🚨';
  } else if (complaint.status === 'FLAGGED_FRAUD') {
    color = '#a855f7';
    glow = 'rgba(168, 85, 247, 0.6)';
    iconHtml = '🛡️';
  } else if (complaint.status === 'RESOLVED') {
    color = '#10b981';
    glow = 'rgba(16, 185, 129, 0.5)';
    iconHtml = '✓';
  } else if (complaint.category.includes('Water')) {
    color = '#06b6d4';
    glow = 'rgba(6, 182, 212, 0.5)';
    iconHtml = '💧';
  } else if (complaint.category.includes('Waste') || complaint.category.includes('Sanitation')) {
    color = '#10b981';
    glow = 'rgba(16, 185, 129, 0.5)';
    iconHtml = '🗑️';
  }

  const pulseClass = (complaint.priority === 'CRITICAL' || complaint.status === 'ESCALATED')
    ? 'animate-ping'
    : '';

  const borderStyle = isSelected ? 'border: 3px solid #ffffff; transform: scale(1.25);' : 'border: 2px solid rgba(255,255,255,0.8);';

  const html = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      ${pulseClass ? `<div style="position: absolute; inset: 0; border-radius: 9999px; background-color: ${glow};" class="${pulseClass}"></div>` : ''}
      <div style="position: relative; width: 32px; height: 32px; border-radius: 9999px; background-color: ${color}; box-shadow: 0 0 15px ${glow}; display: flex; align-items: center; justify-content: center; font-size: 14px; color: white; ${borderStyle} transition: all 0.2s ease;">
        ${iconHtml}
      </div>
      ${(complaint.similarityCluster?.length > 0) ? `
        <span style="position: absolute; top: -4px; right: -4px; background-color: #f59e0b; color: #000; font-size: 10px; font-weight: 800; border-radius: 9999px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border: 1px solid #fff;">
          ${complaint.similarityCluster.length + 1}
        </span>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-pin',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
}

export default function InteractiveMap({ onSelectComplaint }) {
  const { 
    filteredComplaints, 
    wards, 
    selectedComplaint, 
    setSelectedComplaintId,
    openModal 
  } = useCivic();

  const mapCenter = selectedComplaint ? selectedComplaint.location : [28.6139, 77.2090];

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[600px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Map Control HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl max-w-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Active Geospatial Feed</span>
        </div>
        <div className="text-[11px] text-slate-300 space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Critical Emergencies:</span>
            <strong className="text-red-400 font-mono">{filteredComplaints.filter(c => c.priority === 'CRITICAL').length}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Duplicate Clusters:</span>
            <strong className="text-amber-400 font-mono">{filteredComplaints.filter(c => c.similarityCluster?.length > 0).length}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Tampered / Fraud:</span>
            <strong className="text-purple-400 font-mono">{filteredComplaints.filter(c => c.status === 'FLAGGED_FRAUD').length}</strong>
          </div>
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={mapCenter} zoom={14} />

        {/* High contrast Dark Carto Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Ward Boundaries */}
        {wards.map((ward) => (
          <Polygon
            key={ward.id}
            positions={ward.bounds}
            pathOptions={{
              color: ward.color,
              weight: 1.5,
              dashArray: '4, 6',
              fillColor: ward.color,
              fillOpacity: 0.06
            }}
          >
            <Tooltip direction="center" permanent={false} opacity={0.9}>
              <div className="p-1 text-xs">
                <p className="font-bold text-white">{ward.name}</p>
                <p className="text-slate-300">Zone: {ward.zone}</p>
                <p className="text-slate-300">Engineer: {ward.engineerInCharge}</p>
                <p className="text-emerald-400 font-semibold">SLA: {ward.slaPerformance}%</p>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {/* Complaint Markers */}
        {filteredComplaints.map((complaint) => {
          const isSelected = selectedComplaint?.id === complaint.id;
          const pinIcon = createCustomPin(complaint, isSelected);

          return (
            <Marker
              key={complaint.id}
              position={complaint.location}
              icon={pinIcon}
              eventHandlers={{
                click: () => {
                  setSelectedComplaintId(complaint.id);
                  if (onSelectComplaint) onSelectComplaint(complaint);
                },
              }}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {complaint.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadge(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </div>

                  {complaint.imageUrl && (
                    <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2 bg-slate-900 border border-slate-800">
                      <img
                        src={complaint.imageUrl}
                        alt={complaint.title}
                        className="w-full h-full object-cover"
                      />
                      {complaint.exif && !complaint.exif.isAuthentic && (
                        <div className="absolute top-1 left-1 bg-red-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          EXIF SPOOF
                        </div>
                      )}
                    </div>
                  )}

                  <h4 className="font-bold text-xs text-white line-clamp-2 mb-1">
                    {complaint.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                    {complaint.address}
                  </p>

                  <div className="flex items-center justify-between text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800 mb-2.5">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>SLA:</span>
                    </div>
                    <span className={`font-mono font-bold ${
                      complaint.slaMinutesRemaining < 30 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {formatMinutes(complaint.slaMinutesRemaining)}
                    </span>
                  </div>

                  {complaint.similarityCluster?.length > 0 && (
                    <div className="mb-2 p-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-[10px] text-amber-300 flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>{complaint.similarityCluster.length} duplicate citizen reports clustered</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => openModal('dedup', complaint.id)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-semibold rounded-lg border border-slate-700 transition-colors"
                    >
                      Deduplicate
                    </button>
                    <button
                      onClick={() => openModal('routing', complaint.id)}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      Dispatch AI
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
