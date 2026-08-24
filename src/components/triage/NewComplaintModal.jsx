import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { PlusCircle, MapPin, Tag, FileText, User, X, Camera, Sparkles } from 'lucide-react';

export default function NewComplaintModal() {
  const { activeModal, closeModal, wards, departments, addNewComplaint } = useCivic();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [wardId, setWardId] = useState('WARD-101');
  const [category, setCategory] = useState('Roads & Infrastructure');
  const [department, setDepartment] = useState('pwd');
  const [priority, setPriority] = useState('HIGH');
  const [address, setAddress] = useState('');
  const [citizenName, setCitizenName] = useState('Rahul Verma (Resident)');

  if (activeModal !== 'new_complaint') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const wardObj = wards.find(w => w.id === wardId);
    addNewComplaint({
      title,
      description,
      wardId,
      category,
      department,
      priority,
      address: address || (wardObj ? wardObj.name : "Downtown Area"),
      citizenName,
      location: wardObj ? wardObj.center : [28.6139, 77.2090]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Simulate Citizen Incident Filing</h3>
              <p className="text-xs text-slate-400">
                Trigger real-time municipal ingestion, EXIF validation & AI auto-routing
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Incident Headline / Issue Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Collapsed Stormwater Drain on Main Road"
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact physical details, hazards, or obstruction symptoms..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Ward Jurisdiction
              </label>
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                {wards.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Incident Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                <option value="Water Supply & Sewage">Water Supply & Sewage</option>
                <option value="Solid Waste & Sanitation">Solid Waste & Sanitation</option>
                <option value="Electrical & Streetlighting">Electrical & Streetlighting</option>
                <option value="Environment & Horticulture">Environment & Horticulture</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Dept
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="CRITICAL">Critical Emergency (Immediate SLA)</option>
                <option value="HIGH">High Priority (4 Hours)</option>
                <option value="MEDIUM">Medium Priority (8 Hours)</option>
                <option value="LOW">Low Priority (24 Hours)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Simulated Device EXIF: Native Geotag Attached</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-bold">100% Hash Valid</span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit & Dispatch AI Engine</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
