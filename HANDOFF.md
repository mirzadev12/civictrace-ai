# CivicTrace AI - Engineering Handoff Document

Welcome to **CivicTrace AI** (Municipal Incident Triage, Integrity & Auto-Dispatch Engine). This document serves as a complete technical guide for developers and AI agents continuing to expand or maintain this codebase.

---

## 🏛️ System Architecture Overview

CivicTrace AI is a client-side municipal triage operations platform. It continuously processes civic complaints, flags image/geotag tampering using EXIF forensic comparisons, clusters duplicates using embedding cosine similarity, dynamically calculates SLA windows based on casualty/arterial risk multipliers, and automatically suggests optimal department and crew dispatch.

### Tech Stack
- **Framework**: Vite 6 + React 19
- **Styling**: Tailwind CSS v4 with custom dark mode glassmorphism UI
- **Icons**: Lucide React
- **Geospatial Mapping**: Leaflet 1.9 + React-Leaflet 5 with CartoDB Dark Matter tile layer
- **State Management**: React Context API (`CivicContext.jsx`)

---

## 📂 Project Directory Structure

```
civictrace-ai/
├── PROGRESS.md                          # Live progress and completed features checklist
├── HANDOFF.md                           # This architecture brief and technical guide
├── package.json                         # Dependencies & scripts
├── vite.config.js                       # Vite with @tailwindcss/vite and @vitejs/plugin-react
├── index.html                           # Root HTML with Google Fonts
└── src/
    ├── main.jsx                         # React entrypoint
    ├── App.jsx                          # Main Dashboard Controller & modal host
    ├── index.css                        # Tailwind v4 import & Leaflet popup styles
    ├── context/
    │   └── CivicContext.jsx             # Central state store, actions, and audit log
    ├── data/
    │   ├── mockComplaints.js            # Realistic municipal incident dataset
    │   ├── wardsData.js                 # Ward coordinates, zones, populations & depts
    │   └── demoScenarios.js             # 4 1-click incident demo presets
    ├── utils/
    │   ├── geoUtils.js                  # Haversine distance calculator
    │   └── formatters.js                # Timeago, SLA countdown, and badge classes
    └── components/
        ├── layout/
        │   ├── Header.jsx               # Top navigation with ward switcher & tabs
        │   ├── MunicipalTicker.jsx      # Telemetry ticker with live alerts
        │   └── BottomNav.jsx            # Mobile view navigation bar
        ├── map/
        │   └── InteractiveMap.jsx       # Leaflet map with pulse pins & ward boundaries
        ├── triage/
        │   ├── TriageTable.jsx          # Tabular triage queue with quick actions
        │   ├── ComplaintCard.jsx        # Mobile responsive card layout
        │   ├── FilterToolbar.jsx        # Search, ward, category & status filters
        │   └── NewComplaintModal.jsx    # Simulated citizen incident submission
        ├── ai/
        │   ├── DeduplicationModal.jsx   # Vector cosine similarity & 1-click merge
        │   ├── SlaCalculatorCard.jsx    # Dynamic SLA breakdown & escalation trigger
        │   ├── RoutingMatchCard.jsx     # AI department classifier & crew dispatch
        │   └── ExifVerifier.jsx         # Geotag forensics & fraud quarantine
        ├── analytics/
        │   └── AnalyticsView.jsx        # Ward leaderboard & real-time audit stream
        ├── scenarios/
        │   └── DemoScenariosBar.jsx     # 1-click scenario simulation launcher
        └── common/
            ├── StatBadge.jsx            # KPI metric cards with pulse states
            └── ToastContainer.jsx       # HUD notification alerts
```

---

## 🔄 State Management & APIs (`CivicContext.jsx`)

The application state is accessible via the `useCivic()` hook:

### Key State Properties
- `complaints`: Array of all active complaints.
- `filteredComplaints`: Subset of complaints matching current search query, ward, category, and status.
- `selectedComplaint`: The currently focused incident.
- `activeModal`: Open modal type (`'dedup' | 'sla' | 'routing' | 'exif' | 'new_complaint' | null`).
- `activeScenarioId`: Currently activated simulation scenario.
- `metrics`: Aggregate computed values (`total`, `critical`, `duplicatesClustered`, `fraudQuarantined`, `resolved`, `avgSlaCompliance`).
- `auditLogs`: Append-only chronological list of triage actions taken.

### Primary Actions
- `openModal(modalType, complaintId)`: Opens the target AI or inspector modal.
- `mergeDuplicates(parentComplaintId)`: Collapses clustered duplicate tickets into the parent ticket, prevents double dispatching, and broadcasts citizen tracking links.
- `escalateComplaint(complaintId)`: Escalates ticket to `CRITICAL` priority, shrinks SLA window, and logs supervisor alert.
- `resolveComplaint(complaintId)`: Marks complaint as `RESOLVED`, updates SLA status, and closes ticket.
- `reassignDepartment(complaintId, deptId, deptName, crewName)`: Updates ticket routing and crew dispatch.
- `flagFraud(complaintId, reason)`: Quarantines tampered/spoofed submissions to prevent wasted municipal patrol budget.
- `loadScenario(scenarioId)`: Sets up filters and automatically opens the relevant AI modal for live presentation.
- `addNewComplaint(complaintData)`: Ingests a new citizen report and adds it to the live queue.

---

## 🎮 Interactive Demo Scenarios

The cockpit includes 4 preset test scenarios on the top bar:
1. **Water Main Rupture Crisis**: Ward 103 • 200 PSI Main Line Breach (triggers 10m critical SLA countdown & rapid valve unit dispatch).
2. **Pothole Duplicate Storm**: Ward 101 • 3 citizen reports within 25m (triggers embedding similarity clustering and batch merge).
3. **Geotag Tampering Spoof**: Ward 104 • 1,140km coordinate mismatch (triggers EXIF tamper forensics and fraud quarantine).
4. **Multi-Dept AI Routing**: Ward 102 • Biomedical Dump Triage (triggers AI classifier and hazardous tipper crew assignment).

---

## ⚡ Local Setup & Execution

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production deployment
npm run build
```

Repository URL: **https://github.com/mirzadev12/civictrace-ai**
