# CivicTrace AI - Engineering Handoff Document

Welcome to **CivicTrace AI** (Ultra-Clean Dual-Interface Web App). This document provides complete architectural specifications, state interfaces, component breakdowns, and reproduction steps for any developer or AI assistant continuing development.

---

## 🏛️ System Architecture Overview

CivicTrace AI is a client-side municipal platform designed with a dual interface:
1. **Civilian View**: Instagram-simple neighborhood issue feed, before/after repair sliders, glowing activity heatmap, and 1-tap native mobile camera reporting with intelligent duplicate assistance.
2. **Officer View**: Logistics operations dashboard with community-upvoted priority queues, automated routing speed tags ("Routed in 0.2s"), repair photo verification with automated checklists, and dynamic crew workload capacity visualizers.

### Key Technical Rule
**ZERO JARGON IN UI**: All technical terminology (`Spatial Deduplication`, `GeoJSON`, `EXIF`, `DPI Engine`, `Cryptographic`, `Vector Boundary`, `JSON payload`, `Ward Geo-Mesh`) is completely forbidden from user-facing screens and replaced with friendly human language ("Photo integrity verified", "Neighbors already reported this", "Roads Team", "Community Upvotes").

---

## 📂 Project Directory Structure

```
civictrace-ai/
├── PROGRESS.md                          # Live progress and completed features checklist
├── HANDOFF.md                           # This architecture and technical guide
├── package.json                         # Dependencies
├── vite.config.js                       # Vite with Tailwind v4 & React
├── index.html                           # Root HTML with Google Fonts
└── src/
    ├── main.jsx                         # React entrypoint
    ├── App.jsx                          # Dual-view host & layout controller
    ├── index.css                        # Tailwind v4 directives & Leaflet styles
    ├── context/
    │   └── CivicContext.jsx             # Dual-view state store, upvotes & actions
    ├── data/
    │   └── mockIssues.js                # Human-language issues, workload & heatmap data
    ├── utils/
    │   └── soundEffects.js              # Pure Web Audio synthetic chimes for upvotes & submissions
    └── components/
        ├── layout/
        │   └── AppNavbar.jsx            # Top bar with instant Civilian / Officer view switcher
        ├── civilian/
        │   ├── CivilianFeed.jsx         # Nearby issue cards & monthly fix counter
        │   ├── IssueDetailModal.jsx     # Detail modal with Before/After slider & progress steps
        │   ├── CivilianHeatmap.jsx      # Glowing community activity zones
        │   ├── MyReportsView.jsx        # Personal report tracking dashboard
        │   ├── ReportFlowModal.jsx      # 5-step camera report modal (native camera + dedup check)
        │   └── CivilianBottomNav.jsx    # Bottom navigation with giant floating "+" button
        ├── officer/
        │   ├── OfficerDashboard.jsx     # Ops cockpit container & tab switcher
        │   ├── OfficerPriorityQueue.jsx # Community upvote-ranked queue with fix countdowns
        │   ├── OfficerLiveMap.jsx       # Geospatial pin radar with auto-assigned team tags
        │   ├── OfficerFixVerifyModal.jsx# Side-by-side photo check & ticket close action
        │   └── OfficerWorkloadView.jsx  # Field crew capacity meters
        └── common/
            ├── BeforeAfterSlider.jsx    # Interactive draggable image comparison slider
            ├── LiveAppQrModal.jsx       # Floating QR code modal for live phone testing
            ├── StatBadge.jsx            # Metric badges
            └── ToastContainer.jsx       # HUD notification popups
```

---

## 🔄 State Store & APIs (`CivicContext.jsx`)

Access state and actions via `useCivic()`:

### Key State Properties
- `currentView`: `'civilian' | 'officer'` (toggled via `toggleView()`)
- `civilianTab`: `'feed' | 'map' | 'my_reports'`
- `officerTab`: `'queue' | 'map' | 'workload'`
- `issues`: Array of issue objects (photos, status, upvotes, assigned team, fix estimate, before/after photos).
- `selectedIssue`: Focused issue for detail modals.
- `fixedCountThisMonth`: Live counter of resolved fixes in the neighborhood.
- `workloadStats`: Field crew capacity and active task breakdown.
- `heatmapHotspots`: Glowing community activity zones.

### Key Actions
- `upvoteIssue(issueId)`: Increments upvote count, plays synthetic chime sound, updates community priority rank.
- `createReport(reportData)`: Adds a new issue, triggers confetti, auto-routes to responsible team in 0.2s.
- `supportExistingIssue(issueId)`: Links user to existing nearby report, avoids duplicate physical dispatches.
- `verifyAndCloseTicket(issueId, afterPhoto)`: Marks issue as `Fixed`, activates the Before/After comparison slider for citizens.

---

## ⚡ Quick Start & Deployment

```bash
# Install dependencies
npm install

# Local development server
npm run dev

# Production build
npm run build
```

Repository: **https://github.com/mirzadev12/civictrace-ai**
