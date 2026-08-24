# CivicTrace AI - Engineering Handoff Document

Welcome to **CivicTrace AI**. This document provides an architectural brief, state model overview, directory breakdown, and development guide for developers or AI assistants continuing development on this codebase.

---

## 🏛️ System Architecture

CivicTrace AI is a client-side municipal triage and dispatch operations cockpit. It processes incoming civic complaints, identifies duplicates via embedding similarity, detects image/geotag tampering, calculates dynamic SLAs based on risk weights, and assigns optimal municipal departments and field crews.

### Tech Stack
- **Framework**: Vite 6 + React 19
- **Styling**: Tailwind CSS v3 with Lucide React icons
- **Geospatial Visualization**: Leaflet 1.9 + React-Leaflet 5
- **State Store**: React Context API (`CivicContext.jsx`)

---

## 📂 Project Structure

```
civictrace-ai/
├── PROGRESS.md                    # Live build checklist, status, and notes
├── HANDOFF.md                     # This system overview
├── package.json
├── tailwind.config.js
├── src/
│   ├── main.jsx                   # React root mount
│   ├── App.jsx                    # Root view controller & modal host
│   ├── index.css                  # Tailwind styles + Leaflet override CSS
│   ├── context/
│   │   └── CivicContext.jsx       # State management for complaints, filters, scenarios
│   ├── data/
│   │   ├── mockComplaints.js      # Rich real-world municipal dataset
│   │   ├── wardsData.js           # Ward boundaries & population metrics
│   │   └── demoScenarios.js       # Pre-configured incident presets for demoing
│   ├── components/
│   │   ├── layout/                # Header, ticker, bottom nav
│   │   ├── map/                   # Leaflet interactive map & pins
│   │   ├── triage/                # Queue table, cards, batch actions
│   │   ├── ai/                    # Deduplication, SLA, Routing, EXIF verifiers
│   │   └── scenarios/             # Quick scenario launcher bar
│   └── utils/
│       ├── geoUtils.js            # Distance / bounding box / EXIF comparisons
│       └── formatters.js          # SLA countdown, timeago, currency/severity formatters
```

---

## 🔄 State Management (`CivicContext.jsx`)

The global context manages:
1. `complaints`: Array of full complaint objects (ID, title, description, category, ward, location `[lat, lng]`, exifData, status, priority, similarityMatches, routedDepartment, timestamps).
2. `activeFilter`: Current filtering parameters (ward, category, status, search term).
3. `selectedComplaint`: The currently opened/inspected complaint for detail or modal views.
4. `activeModal`: Modal state (`'dedup' | 'exif' | 'routing' | 'sla' | null`).
5. `activeScenario`: Current simulated incident scenario.
6. Actions: `resolveComplaint`, `escalateComplaint`, `mergeDuplicates`, `reRouteComplaint`, `loadScenario`, `verifyExif`.

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```
