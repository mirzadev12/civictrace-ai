export const DEMO_SCENARIOS = [
  {
    id: "water_rupture",
    title: "1. Water Main Rupture Crisis",
    tagline: "Ward 103 • 200 PSI Main Line Breach",
    badge: "CRITICAL SLA",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/40",
    complaintId: "CIVIC-2026-742",
    description: "Real-time emergency flood risk with 10 mins remaining before SLA breach. Demonstrates auto-escalation and Rapid Valve Isolation dispatch.",
    targetModal: "sla",
    icon: "AlertTriangle"
  },
  {
    id: "pothole_blitz",
    title: "2. Pothole Duplicate Storm",
    tagline: "Ward 101 • 3 Reports in 25m Radius",
    badge: "94% SIMILARITY",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    complaintId: "CIVIC-2026-881",
    description: "Multiple citizens report the same crater under different titles. Demonstrates embedding clustering and 1-click batch merge into a single crew ticket.",
    targetModal: "dedup",
    icon: "Copy"
  },
  {
    id: "exif_tamper",
    title: "3. Geotag Tampering Spoof",
    tagline: "Ward 104 • 1,140km Coordinate Mismatch",
    badge: "FRAUD DETECTED",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    complaintId: "CIVIC-2026-904",
    description: "Old viral photograph submitted with forged metadata. Demonstrates GPS triangulation, EXIF timeline audit, and budget protection.",
    targetModal: "exif",
    icon: "ShieldAlert"
  },
  {
    id: "routing_ai",
    title: "4. Multi-Dept AI Routing",
    tagline: "Ward 102 • Biomedical Dump Triage",
    badge: "94% AI MATCH",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    complaintId: "CIVIC-2026-619",
    description: "Complex mixed hazard near a school. Demonstrates multi-department priority score and automatic hazardous tipper crew assignment.",
    targetModal: "routing",
    icon: "Sparkles"
  }
];
