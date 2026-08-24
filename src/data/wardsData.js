export const WARDS_DATA = [
  {
    id: "WARD-101",
    name: "Ward 101 - Downtown Civic Center",
    zone: "Central Metro",
    center: [28.6139, 77.2090],
    bounds: [
      [28.608, 77.200],
      [28.620, 77.220]
    ],
    population: 84000,
    engineerInCharge: "Er. Rajesh Sharma (PWD)",
    contact: "+91 98110 23411",
    slaPerformance: 94.2,
    activeComplaintsCount: 14,
    color: "#3b82f6"
  },
  {
    id: "WARD-102",
    name: "Ward 102 - Industrial Corridor North",
    zone: "North District",
    center: [28.6320, 77.2180],
    bounds: [
      [28.625, 77.210],
      [28.640, 77.230]
    ],
    population: 112000,
    engineerInCharge: "Er. Sunita Verma (Sanitation & PWD)",
    contact: "+91 98711 44520",
    slaPerformance: 81.5,
    activeComplaintsCount: 22,
    color: "#f59e0b"
  },
  {
    id: "WARD-103",
    name: "Ward 103 - Green Park & Residential South",
    zone: "South District",
    center: [28.5980, 77.1980],
    bounds: [
      [28.590, 77.190],
      [28.605, 77.210]
    ],
    population: 68000,
    engineerInCharge: "Er. Amit Chawla (Water & Sewage)",
    contact: "+91 98101 99283",
    slaPerformance: 96.8,
    activeComplaintsCount: 8,
    color: "#10b981"
  },
  {
    id: "WARD-104",
    name: "Ward 104 - Old City Heritage Quarter",
    zone: "East Metro",
    center: [28.6250, 77.2380],
    bounds: [
      [28.618, 77.228],
      [28.635, 77.248]
    ],
    population: 145000,
    engineerInCharge: "Er. Farhan Akhtar (Heritage & Health)",
    contact: "+91 98990 77112",
    slaPerformance: 76.4,
    activeComplaintsCount: 31,
    color: "#ef4444"
  }
];

export const DEPARTMENTS = [
  { id: "pwd", name: "Public Works Dept (Roads & Infra)", head: "Er. Rajesh Sharma", avgSlaHours: 24, badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { id: "water", name: "Water Board & Sewage Authority", head: "Er. Amit Chawla", avgSlaHours: 12, badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  { id: "sanitation", name: "Solid Waste & Sanitation", head: "Er. Sunita Verma", avgSlaHours: 8, badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  { id: "electrical", name: "Municipal Streetlighting & Power", head: "Er. D.K. Rao", avgSlaHours: 16, badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { id: "health", name: "Public Health & Vector Control", head: "Dr. K. Swaminathan", avgSlaHours: 18, badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
];
