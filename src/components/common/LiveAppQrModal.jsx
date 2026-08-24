import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, X, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LiveAppQrModal({ liveUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const targetUrl = liveUrl || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.href : 'https://mirzadev12.github.io/civictrace-ai/');

  return (
    <>
      {/* Floating QR Quick Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-white rounded-full shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        title="Scan with phone to test live on mobile"
      >
        <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30">
          <QrCode className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold hidden sm:inline text-slate-200">
          Test on Phone
        </span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Scan to Open on Your Phone
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Open your phone camera and scan the QR code to test genuine mobile camera capture and GPS auto-detection!
            </p>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-xl mx-auto mb-4">
              <QRCodeSVG
                value={targetUrl}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 break-all mb-4">
              {targetUrl}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Native Mobile Camera &amp; Location Enabled</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
