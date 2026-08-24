import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_ISSUES, WORKLOAD_STATS, HEATMAP_HOTSPOTS } from '../data/mockIssues';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

const CivicContext = createContext();

const LOCAL_STORAGE_KEY = 'civictrace_issues_v2';

export function CivicProvider({ children }) {
  // Global Dual-View Toggle: 'civilian' | 'officer'
  const [currentView, setCurrentView] = useState('civilian');
  
  // Navigation Tabs for each view
  const [civilianTab, setCivilianTab] = useState('feed'); // 'feed' | 'map' | 'my_reports'
  const [officerTab, setOfficerTab] = useState('queue'); // 'queue' | 'map' | 'workload'

  // Issues Store (with localStorage fallback for mobile persistence)
  const [issues, setIssues] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Storage load error", e);
      }
    }
    return INITIAL_ISSUES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(issues));
      } catch (e) {
        console.warn("Storage save error", e);
      }
    }
  }, [issues]);

  const [selectedIssueId, setSelectedIssueId] = useState(issues[0]?.id || 'ISSUE-101');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [userReportIds, setUserReportIds] = useState(['ISSUE-101']);
  const [fixedCountThisMonth, setFixedCountThisMonth] = useState(142);
  const [activeFilterCategory, setActiveFilterCategory] = useState('ALL');
  const [selectedLocality, setSelectedLocality] = useState('ALL');

  // List of available localities
  const localities = useMemo(() => {
    return [
      "ALL",
      "Connaught Ward",
      "Green Park Ward",
      "Industrial Corridor Ward",
      "Old Heritage Ward",
      "South Extension",
      "Sector 12"
    ];
  }, []);

  // Selected Issue
  const selectedIssue = useMemo(() => {
    return issues.find(i => i.id === selectedIssueId) || issues[0];
  }, [issues, selectedIssueId]);

  // Filtered issues by category and locality
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchCat = activeFilterCategory === 'ALL' || issue.category === activeFilterCategory;
      const matchLoc = selectedLocality === 'ALL' || issue.area === selectedLocality || issue.address.toLowerCase().includes(selectedLocality.toLowerCase());
      return matchCat && matchLoc;
    });
  }, [issues, activeFilterCategory, selectedLocality]);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  const addToast = (title, message, type = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // Toggle Dual View
  const toggleView = () => {
    setCurrentView(prev => prev === 'civilian' ? 'officer' : 'civilian');
  };

  // Upvote Action (with micro-interaction chime)
  const upvoteIssue = (issueId) => {
    soundFX.playUpvote();

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const nextHasUpvoted = !issue.hasUpvoted;
        return {
          ...issue,
          hasUpvoted: nextHasUpvoted,
          upvotes: nextHasUpvoted ? issue.upvotes + 1 : Math.max(0, issue.upvotes - 1)
        };
      }
      return issue;
    }));

    addToast("Voice Added!", "Your neighborhood support was counted to accelerate team response.", "success");
  };

  // Submit New Citizen Report
  const createReport = (reportData) => {
    soundFX.playSuccess();
    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    const newId = `ISSUE-${Math.floor(200 + Math.random() * 800)}`;
    const newEntry = {
      id: newId,
      title: reportData.title || `${reportData.category || 'Incident'} reported in ${reportData.area || 'your area'}`,
      category: reportData.category || 'Pothole',
      categoryIcon: reportData.categoryIcon || '🕳️',
      photo: reportData.photo || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      afterPhoto: "https://images.unsplash.com/photo-1584463699039-446714078832?auto=format&fit=crop&w=800&q=80",
      address: reportData.address || "Main Street, Ward 12",
      area: reportData.area || "Connaught Ward",
      distance: "Just reported (Near you)",
      location: reportData.location || [28.6145, 77.2085],
      status: "Assigned",
      upvotes: 1,
      hasUpvoted: true,
      reportedTimeAgo: "Just now",
      assignedTeam: reportData.assignedTeam || "Roads Team (Division II)",
      fixEstimate: "Expected fix: within 24 hours",
      deadlineMinutesRemaining: 1440,
      routedSpeed: "Routed to Field Team in 0.2s",
      reportedBy: "You (Verified Resident)",
      verificationChecklist: {
        locationVerified: true,
        timeVerified: true,
        qualityApproved: false
      }
    };

    setIssues(prev => [newEntry, ...prev]);
    setUserReportIds(prev => [newId, ...prev]);
    setSelectedIssueId(newId);
    setIsReportOpen(false);

    // Switch to feed view so user sees it right away
    setCivilianTab('feed');

    addToast("Photo Added to Feed! 🎉", `Your report for ${newEntry.area} is now live and assigned to ${newEntry.assignedTeam}.`, "success");
  };

  // Support Existing Nearby Issue
  const supportExistingIssue = (existingIssueId) => {
    upvoteIssue(existingIssueId);
    setUserReportIds(prev => prev.includes(existingIssueId) ? prev : [existingIssueId, ...prev]);
    setIsReportOpen(false);
    setSelectedIssueId(existingIssueId);
    setIsDetailOpen(true);
    addToast("Added to Existing Report!", "You're now tracking this community fix with your neighbors.", "success");
  };

  // Officer Approves Fix & Closes Ticket
  const verifyAndCloseTicket = (issueId, uploadedAfterPhoto) => {
    soundFX.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: "Fixed",
          fixEstimate: "Completed & Verified 🎉",
          fixedTimeAgo: "Just now",
          afterPhoto: uploadedAfterPhoto || issue.afterPhoto || "https://images.unsplash.com/photo-1584463699039-446714078832?auto=format&fit=crop&w=800&q=80",
          verificationChecklist: {
            locationVerified: true,
            timeVerified: true,
            qualityApproved: true
          }
        };
      }
      return issue;
    }));

    setFixedCountThisMonth(prev => prev + 1);
    setIsVerifyOpen(false);
    addToast("Fix Approved & Ticket Closed!", "Before/After comparison slider is now active for neighbors.", "success");
  };

  return (
    <CivicContext.Provider
      value={{
        currentView,
        setCurrentView,
        toggleView,
        civilianTab,
        setCivilianTab,
        officerTab,
        setOfficerTab,
        issues,
        filteredIssues,
        selectedIssue,
        selectedIssueId,
        setSelectedIssueId,
        isDetailOpen,
        setIsDetailOpen,
        isReportOpen,
        setIsReportOpen,
        isVerifyOpen,
        setIsVerifyOpen,
        userReportIds,
        fixedCountThisMonth,
        workloadStats: WORKLOAD_STATS,
        heatmapHotspots: HEATMAP_HOTSPOTS,
        activeFilterCategory,
        setActiveFilterCategory,
        selectedLocality,
        setSelectedLocality,
        localities,
        upvoteIssue,
        createReport,
        supportExistingIssue,
        verifyAndCloseTicket,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </CivicContext.Provider>
  );
}

export function useCivic() {
  const ctx = useContext(CivicContext);
  if (!ctx) throw new Error("useCivic must be used within CivicProvider");
  return ctx;
}
