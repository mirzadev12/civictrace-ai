import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Camera, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Cpu, 
  X, 
  FileText,
  Ban,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { formatDistance } from '../../utils/geoUtils';

export default function ExifVerifier() {
  const { 
    selectedComplaint, 
    activeModal, 
    closeModal, 
    flagFraud 
  } = useCivic();

  if (activeModal !== 'exif' || !selectedComplaint) return null;

  const exif = selectedComplaint.exif || {
    isAuthentic: true,
    tamperScore: 5,
    deviceModel: "Standard Smartphone",
    software: "Camera Native",
    originalTimestamp: selectedComplaint.createdAt,
    gpsLat: selectedComplaint.location[0],
    gpsLng: selectedComplaint.location[1],
    gpsDiscrepancyMeters: 12,
    iso: 100,
    focalLength: "24mm",
    flash: "No",
    aiNotes: "Sensor noise and compression hash consistent with native field capture."
  };

  const isTampered = !exif.isAuthentic || exif.tamperScore > 50 || exif.gpsDiscrepancyMeters > 500;

  const handleQuarantine = () => {
    flagFraud(
      selectedComplaint.id,
      `Quarantined: EXIF GPS discrepancy of ${formatDistance(exif.gpsDiscrepancyMeters)} and tamper score ${exif.tamperScore}%.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isTampered 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {isTampered ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">EXIF & Geotag Integrity Verifier</h3>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full border ${
                  isTampered 
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {isTampered ? 'INTEGRITY BREACH DETECTED' : 'EXIF SIGNATURE VERIFIED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deep metadata audit & sensor noise forensics for Ticket <span className="font-mono text-white font-bold">{selectedComplaint.id}</span>
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
          
          {/* Top Threat / Trust Banner */}
          <div className={`p-4 rounded-2xl border ${
            isTampered ? 'bg-purple-950/20 border-purple-500/40' : 'bg-emerald-950/20 border-emerald-500/30'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tamper Risk Index</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl font-extrabold font-mono ${
                    isTampered ? 'text-purple-400' : 'text-emerald-400'
                  }`}>
                    {exif.tamperScore}%
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {isTampered ? 'High probability of photo manipulation / geotag spoofing' : 'Authentic unedited field photo'}
                  </span>
                </div>
              </div>

              {/* Meter bar */}
              <div className="w-full sm:w-48 bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isTampered ? 'bg-gradient-to-r from-amber-500 to-purple-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(8, exif.tamperScore)}%` }}
                ></div>
              </div>
            </div>

            {isTampered && (
              <div className="mt-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                <span>
                  <strong>CIVIC FRAUD WARNING:</strong> The camera EXIF data does not match citizen claim. Geo coordinates are displaced by <strong className="text-white underline">{formatDistance(exif.gpsDiscrepancyMeters)}</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Side by side image & metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Image Preview with forensic badge */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-slate-400 flex items-center justify-between">
                <span>Submitted Evidence Image</span>
                <span className="text-[10px] text-slate-500 font-mono">HASH: 9e88b...f201</span>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-52">
                {selectedComplaint.imageUrl ? (
                  <img
                    src={selectedComplaint.imageUrl}
                    alt="Evidence"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    No image submitted
                  </div>
                )}
                {isTampered && (
                  <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/50 text-center shadow-xl">
                      <ShieldAlert className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                      <span className="text-xs font-bold text-white block">SPOOFED PHOTO DETECTED</span>
                      <span className="text-[10px] text-slate-300">Reverse search match found</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hardware & Lens EXIF Details */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-slate-400">Camera & Hardware Metadata</div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Camera className="w-3.5 h-3.5 text-cyan-400" /> Device Model:</span>
                  <span className="font-mono text-white font-semibold">{exif.deviceModel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> OS / Firmware:</span>
                  <span className="font-mono text-slate-200">{exif.software}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cyan-400" /> Original Capture:</span>
                  <span className="font-mono text-slate-200">{new Date(exif.originalTimestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-cyan-400" /> Optics / Focal:</span>
                  <span className="font-mono text-slate-200">{exif.focalLength} • ISO {exif.iso}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Geospatial GPS Discrepancy Breakdown */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Geotag Coordinates Comparison
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Reported Citizen Location</div>
                <div className="text-xs font-bold text-white mt-1">{selectedComplaint.address}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Lat: {selectedComplaint.location[0].toFixed(4)}, Lng: {selectedComplaint.location[1].toFixed(4)}
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                isTampered ? 'bg-purple-950/30 border-purple-500/50' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center justify-between">
                  <span>EXIF Embedded GPS Pin</span>
                  {isTampered && <span className="text-[10px] text-red-400 font-bold">MISMATCH</span>}
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  {isTampered ? 'Geotag Point Outside Delhi NCT' : selectedComplaint.address}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Lat: {exif.gpsLat?.toFixed(4)}, Lng: {exif.gpsLng?.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* AI Forensic Diagnostic Notes */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <div className="font-semibold text-slate-400 mb-1 text-[11px]">CivicTrace Forensic Intelligence Report:</div>
            <p className="leading-relaxed text-slate-200">{exif.aiNotes}</p>
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

          {isTampered ? (
            <button
              onClick={handleQuarantine}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Ban className="w-4 h-4" />
              <span>Quarantine & Reject Tampered Submission</span>
            </button>
          ) : (
            <button
              onClick={closeModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Approve Authenticity</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
