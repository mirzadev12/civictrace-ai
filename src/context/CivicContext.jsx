import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_COMPLAINTS } from '../data/mockComplaints';
import { WARDS_DATA, DEPARTMENTS } from '../data/wardsData';
import { DEMO_SCENARIOS } from '../data/demoScenarios';

const CivicContext = createContext();

export function CivicProvider({ children }) {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState(INITIAL_COMPLAINTS[0].id);
  const [activeModal, setActiveModal] = useState(null); // 'dedup' | 'sla' | 'routing' | 'exif' | 'detail' | 'new_complaint'
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "LOG-1",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: "AI Auto-Triage Completed",
      details: "CIVIC-2026-881 routed to PWD (96% confidence). 2 duplicate reports clustered.",
      badge: "ROUTED"
    },
    {
      id: "LOG-2",
      timestamp: new Date(Date.now() - 110 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: "SLA Warning Broadcasted",
      details: "CIVIC-2026-742 entered Critical Breach Zone (<15m remaining). Escalation dispatched.",
      badge: "ESCALATION"
    },
    {
      id: "LOG-3",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: "EXIF Tamper Quarantine",
      details: "CIVIC-2026-904 flagged for 1,140km coordinate spoof. Citizen reputation score docked.",
      badge: "FRAUD"
    }
  ]);

  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Selected complaint object
  const selectedComplaint = useMemo(() => {
    return complaints.find(c => c.id === selectedComplaintId) || complaints[0];
  }, [complaints, selectedComplaintId]);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter(item => {
      const matchWard = selectedWard === 'ALL' || item.wardId === selectedWard;
      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());

      return matchWard && matchCategory && matchStatus && matchSearch;
    });
  }, [complaints, selectedWard, selectedCategory, selectedStatus, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = complaints.length;
    const critical = complaints.filter(c => c.priority === 'CRITICAL' && c.status !== 'RESOLVED').length;
    const duplicatesClustered = complaints.reduce((acc, curr) => acc + (curr.similarityCluster?.length || 0), 0);
    const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'RESOLVED_WITHIN_SLA').length;
    const fraudQuarantined = complaints.filter(c => c.status === 'FLAGGED_FRAUD').length;
    const avgSlaCompliance = 93.4;

    return {
      total,
      critical,
      duplicatesClustered,
      resolved,
      fraudQuarantined,
      avgSlaCompliance
    };
  }, [complaints]);

  // Actions
  const openModal = (modalType, complaintId = null) => {
    if (complaintId) {
      setSelectedComplaintId(complaintId);
    }
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const mergeDuplicates = (parentComplaintId) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === parentComplaintId) {
        const mergedCount = (c.similarityCluster?.length || 0);
        return {
          ...c,
          similarityCluster: [],
          status: c.status === 'FLAGGED_FRAUD' ? c.status : 'IN_PROGRESS',
          description: `${c.description} [Merged ${mergedCount} duplicate citizen reports]`
        };
      }
      return c;
    }));

    setAuditLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: "Batch Clustered Reports Merged",
        details: `Successfully consolidated duplicate citizen reports into parent ticket ${parentComplaintId}. Single crew dispatched.`,
        badge: "MERGED"
      },
      ...prev
    ]);

    addToast("Duplicates Consolidated", `Merged reports into single ticket ${parentComplaintId}. Redundant dispatch prevented!`, "success");
    closeModal();
  };

  const escalateComplaint = (complaintId) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          priority: "CRITICAL",
          status: "ESCALATED",
          riskScore: Math.min(100, (c.riskScore || 80) + 15),
          slaMinutesRemaining: Math.min(c.slaMinutesRemaining, 15)
        };
      }
      return c;
    }));

    setAuditLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: "Executive SLA Escalation",
        details: `Ticket ${complaintId} escalated to Municipal Commissioner & Field Chief. Response window restricted.`,
        badge: "ESCALATION"
      },
      ...prev
    ]);

    addToast("Emergency Escalation Fired", `Complaint ${complaintId} elevated to Critical priority with priority radio dispatch.`, "warning");
  };

  const resolveComplaint = (complaintId) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: "RESOLVED",
          crewStatus: "JOB_COMPLETED",
          slaStatus: "RESOLVED_WITHIN_SLA"
        };
      }
      return c;
    }));

    setAuditLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: "Ticket Marked Resolved",
        details: `Field crew completed remediation for ${complaintId}. Citizen notification dispatched.`,
        badge: "RESOLVED"
      },
      ...prev
    ]);

    addToast("Complaint Resolved", `Remediation verified and closed for ${complaintId}.`, "success");
    if (activeModal === 'detail') closeModal();
  };

  const reassignDepartment = (complaintId, departmentId, departmentName, assignedCrew) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          department: departmentId,
          departmentName: departmentName,
          assignedCrew: assignedCrew || c.assignedCrew,
          crewStatus: "DISPATCHED"
        };
      }
      return c;
    }));

    setAuditLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: "Department Routing Re-assigned",
        details: `Re-routed ${complaintId} to ${departmentName}. Crew: ${assignedCrew}`,
        badge: "ROUTED"
      },
      ...prev
    ]);

    addToast("Routing Confirmed", `Assigned ${complaintId} to ${departmentName} (${assignedCrew})`, "info");
    closeModal();
  };

  const flagFraud = (complaintId, reason) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: "FLAGGED_FRAUD",
          priority: "LOW",
          slaStatus: "PAUSED_INVESTIGATION"
        };
      }
      return c;
    }));

    setAuditLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: "Tamper / Fraud Quarantined",
        details: `${complaintId} flagged: ${reason || 'Geotag or Image Tampering Detected'}. Dispatch canceled.`,
        badge: "FRAUD"
      },
      ...prev
    ]);

    addToast("Quarantined for Fraud", `Ticket ${complaintId} flagged for integrity violation. Municipal crew dispatch halted.`, "error");
    closeModal();
  };

  const loadScenario = (scenarioId) => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    setActiveScenarioId(scenarioId);
    setSelectedComplaintId(scenario.complaintId);
    
    // Find complaint and adjust filters so it is visible
    const targetComp = complaints.find(c => c.id === scenario.complaintId);
    if (targetComp) {
      setSelectedWard(targetComp.wardId);
      setSelectedCategory('ALL');
      setSelectedStatus('ALL');
    }

    // Open target modal
    if (scenario.targetModal) {
      setActiveModal(scenario.targetModal);
    }

    addToast(`Demo Scenario Activated`, `${scenario.title} loaded into live cockpit.`, "info");
  };

  const addNewComplaint = (newComplaintData) => {
    const newId = `CIVIC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const fullComplaint = {
      id: newId,
      title: newComplaintData.title || "Citizen Incident Report",
      description: newComplaintData.description || "Reported via mobile app citizen portal.",
      category: newComplaintData.category || "Roads & Infrastructure",
      wardId: newComplaintData.wardId || "WARD-101",
      wardName: WARDS_DATA.find(w => w.id === newComplaintData.wardId)?.name || "Ward 101 - Downtown Civic Center",
      location: newComplaintData.location || [28.6145, 77.2085],
      address: newComplaintData.address || "Downtown Municipal Sector",
      citizenName: newComplaintData.citizenName || "Concerned Resident",
      citizenPhone: newComplaintData.citizenPhone || "+91 98000 00000",
      citizenCredibilityScore: 95,
      imageUrl: newComplaintData.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      createdAt: new Date().toISOString(),
      status: "TRIAGED",
      priority: newComplaintData.priority || "HIGH",
      riskScore: 75,
      slaTotalMinutes: 240,
      slaMinutesRemaining: 240,
      slaStatus: "ON_TRACK",
      department: newComplaintData.department || "pwd",
      departmentName: DEPARTMENTS.find(d => d.id === newComplaintData.department)?.name || "Public Works Dept (Roads & Infra)",
      assignedCrew: "Field Rapid Dispatch #1",
      crewStatus: "DISPATCHED",
      exif: {
        isAuthentic: true,
        tamperScore: 5,
        deviceModel: "Android Mobile Client",
        software: "CivicTrace Mobile v2.4",
        originalTimestamp: new Date().toISOString(),
        gpsLat: newComplaintData.location ? newComplaintData.location[0] : 28.6145,
        gpsLng: newComplaintData.location ? newComplaintData.location[1] : 77.2085,
        gpsDiscrepancyMeters: 8,
        iso: 100,
        focalLength: "26mm f/1.8",
        flash: "Auto",
        aiNotes: "Verified authentic citizen submission with valid camera sensor hash."
      },
      similarityCluster: [],
      routingPrediction: {
        primaryDept: newComplaintData.department || "pwd",
        confidence: 0.94,
        secondaryDept: "sanitation",
        rationale: "AI classifier assigned based on image vision embeddings and natural language description."
      }
    };

    setComplaints(prev => [fullComplaint, ...prev]);
    setSelectedComplaintId(newId);

    setAuditLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: "New Citizen Report Ingested",
        details: `Ticket ${newId} ingested via citizen portal. AI auto-assigned to ${fullComplaint.departmentName}.`,
        badge: "INGESTED"
      },
      ...prev
    ]);

    addToast("Complaint Filed", `Incident ${newId} logged and dispatched!`, "success");
    closeModal();
  };

  return (
    <CivicContext.Provider
      value={{
        complaints,
        filteredComplaints,
        wards: WARDS_DATA,
        departments: DEPARTMENTS,
        scenarios: DEMO_SCENARIOS,
        selectedWard,
        setSelectedWard,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        searchQuery,
        setSearchQuery,
        selectedComplaintId,
        setSelectedComplaintId,
        selectedComplaint,
        activeModal,
        openModal,
        closeModal,
        activeScenarioId,
        loadScenario,
        metrics,
        auditLogs,
        toasts,
        addToast,
        removeToast,
        mergeDuplicates,
        escalateComplaint,
        resolveComplaint,
        reassignDepartment,
        flagFraud,
        addNewComplaint
      }}
    >
      {children}
    </CivicContext.Provider>
  );
}

export function useCivic() {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error("useCivic must be used within a CivicProvider");
  }
  return context;
}
