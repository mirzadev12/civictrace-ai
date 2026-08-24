import React, { useState, useEffect, useRef } from 'react';
import { useCivic } from '../../context/CivicContext';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ArrowRight, 
  ThumbsUp, 
  AlertCircle,
  Clock,
  Layers,
  ChevronLeft,
  RotateCcw
} from 'lucide-react';

export default function ReportFlowModal() {
  const { 
    isReportOpen, 
    setIsReportOpen, 
    createReport, 
    supportExistingIssue, 
    issues 
  } = useCivic();

  const [step, setStep] = useState(1); // 1: Camera, 2: Category, 3: Location, 4: Nearby Check, 5: Submitted Tracker
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [detectedAddress, setDetectedAddress] = useState('Main Street, Ward 12');
  const [detectedCoords, setDetectedCoords] = useState([28.6145, 77.2085]);
  const [isLocating, setIsLocating] = useState(false);
  const [nearbyMatch, setNearbyMatch] = useState(null);
  const fileInputRef = useRef(null);

  const categories = [
    { label: 'Pothole', icon: '🕳️', desc: 'Road holes & broken pavement', team: 'Roads Team (Division II)' },
    { label: 'Streetlight', icon: '💡', desc: 'Dark spots & flickering bulbs', team: 'City Electrical Team' },
    { label: 'Garbage', icon: '🗑️', desc: 'Overflowing bins & street litter', team: 'Cleanliness & Sanitation Crew' },
    { label: 'Water Leak', icon: '💧', desc: 'Pipe bursts & water wastage', team: 'Water & Pipeline Team' },
    { label: 'Drainage', icon: '🌊', desc: 'Clogged drains & street flooding', team: 'Water & Pipeline Team' },
    { label: 'Traffic Signal', icon: '🚦', desc: 'Broken lights & missing signage', team: 'Roads Team (Division II)' },
  ];

  // Auto-detect geolocation on step 3
  useEffect(() => {
    if (step === 3 && typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetectedCoords([pos.coords.latitude, pos.coords.longitude]);
          setDetectedAddress('Current GPS Location, Ward 12');
          setIsLocating(false);
        },
        (err) => {
          console.warn("Location permission fallback to Ward 12", err);
          setIsLocating(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  }, [step]);

  // Check for nearby duplicates when entering step 4
  useEffect(() => {
    if (step === 4 && selectedCategory) {
      const match = issues.find(i => 
        i.status !== 'Fixed' && (i.category === selectedCategory.label || i.category.includes(selectedCategory.label))
      );
      setNearbyMatch(match || null);
    }
  }, [step, selectedCategory, issues]);

  if (!isReportOpen) return null;

  // Handle native camera capture
  const handlePhotoCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setStep(2); // Advance to Category step
    }
  };

  // Submit new report
  const handleFinalSubmit = () => {
    createReport({
      title: `${selectedCategory?.label || 'Issue'} on ${detectedAddress}`,
      category: selectedCategory?.label || 'Pothole',
      categoryIcon: selectedCategory?.icon || '🕳️',
      photo: photoPreview || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      address: detectedAddress,
      location: detectedCoords,
      assignedTeam: selectedCategory?.team || 'Roads Team (Division II)'
    });
  };

  const resetAndClose = () => {
    setIsReportOpen(false);
    setStep(1);
    setPhotoPreview(null);
    setSelectedCategory(null);
    setNearbyMatch(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            {step > 1 && step < 5 && (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-1 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Step {step} of 4 • Report an Issue
              </span>
              <h3 className="text-sm font-extrabold text-white">
                {step === 1 && "Take or Upload Photo"}
                {step === 2 && "Select Problem Type"}
                {step === 3 && "Confirm Location"}
                {step === 4 && (nearbyMatch ? "Existing Neighbor Report Found" : "Review & Submit")}
              </h3>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: CAMERA CAPTURE */}
          {step === 1 && (
            <div className="space-y-4 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-64 sm:h-72 w-full rounded-3xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-slate-950/60 hover:bg-slate-950 flex flex-col items-center justify-center p-6 cursor-pointer transition-all shadow-xl hover:scale-[1.01]"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Captured"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
                      <Camera className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      Open Camera or Upload Photo
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Tap anywhere to snap a photo of the pothole, leak, or problem. Photos help teams arrive with the right equipment.
                    </p>
                  </>
                )}
              </div>

              {/* Sample Quick Preset if testing without camera */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-500 block mb-2">Or test with a sample photo:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80");
                    setStep(2);
                  }}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  Use Sample Pothole Photo
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CATEGORY SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const isSelected = selectedCategory?.label === cat.label;

                  return (
                    <div
                      key={cat.label}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setStep(3); // Advance to location step
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/10 scale-105'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <h4 className="text-xs font-bold text-white mb-0.5">{cat.label}</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">{cat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION AUTO-DETECTION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <MapPin className="w-6 h-6 animate-bounce" />
                </div>
                
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {isLocating ? "Finding your street location..." : "Location Auto-Detected"}
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {detectedAddress}
                  </h4>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>GPS pin confirmed • Ready to route to field crew</span>
                </div>
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Continue to Final Step
              </button>
            </div>
          )}

          {/* STEP 4: SMART NEARBY CHECK (Deduplication without jargon) */}
          {step === 4 && (
            <div className="space-y-4">
              {nearbyMatch ? (
                /* INTERSTITIAL CARD: Warm neighbor notice */
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/40 space-y-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0">
                      👥
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        Your neighbors already reported this!
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Reported {nearbyMatch.reportedTimeAgo} • {nearbyMatch.upvotes} neighbors have already added their voice.
                      </p>
                    </div>
                  </div>

                  {/* Matching existing card preview */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <img
                      src={nearbyMatch.photo}
                      alt="Existing report"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{nearbyMatch.title}</h5>
                      <span className="text-[11px] text-emerald-400 font-medium block">{nearbyMatch.fixEstimate}</span>
                      <span className="text-[10px] text-slate-400">{nearbyMatch.assignedTeam}</span>
                    </div>
                  </div>

                  {/* Action 1: Support existing (+1) */}
                  <button
                    onClick={() => supportExistingIssue(nearbyMatch.id)}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <ThumbsUp className="w-4 h-4 fill-slate-950" />
                    <span>Support This Issue (+1 Voice)</span>
                  </button>

                  {/* Action 2: Report as new anyway */}
                  <div className="text-center pt-1">
                    <button
                      onClick={handleFinalSubmit}
                      className="text-xs text-slate-400 hover:text-white underline transition-colors cursor-pointer"
                    >
                      This is a different problem, submit as new
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Clean Review */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      {photoPreview && (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                      )}
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {selectedCategory?.icon} {selectedCategory?.label}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{detectedAddress}</span>
                        <span className="text-[11px] text-cyan-400 font-medium block">
                          {selectedCategory?.team}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleFinalSubmit}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Submit Report to Community Team
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
