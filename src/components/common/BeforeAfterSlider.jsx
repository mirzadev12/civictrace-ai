import React, { useState, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = "Before (Reported)", afterLabel = "After (Fixed ✨)" }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="relative w-full select-none">
      <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-300">
        <span className="flex items-center gap-1 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          {beforeLabel}
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          {afterLabel}
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Fixed / After Image (Full background) */}
        <img
          src={afterImage}
          alt="After Fix"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Before Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before Fix"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
        </div>

        {/* Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Grab Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-xl flex items-center justify-center text-white text-xs font-bold pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
            ◂▸
          </div>
        </div>

        {/* Bottom instruction tooltip */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-800 text-[10px] font-medium text-slate-300 pointer-events-none">
          Drag slider left or right to compare
        </div>
      </div>
    </div>
  );
}
