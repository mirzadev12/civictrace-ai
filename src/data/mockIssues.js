export const INITIAL_ISSUES = [
  {
    id: "ISSUE-101",
    title: "Deep pothole in the center lane near Metro Station",
    category: "Pothole",
    categoryIcon: "🕳️",
    photo: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1584463699039-446714078832?auto=format&fit=crop&w=800&q=80",
    address: "Outer Ring Road, near Gate 4",
    area: "Connaught Ward",
    distance: "120m away",
    location: [28.6145, 77.2085],
    status: "Assigned", // 'Reported' | 'Assigned' | 'In Progress' | 'Fixed'
    upvotes: 42,
    hasUpvoted: false,
    reportedTimeAgo: "2 hours ago",
    assignedTeam: "Roads Team (Division II)",
    fixEstimate: "Expected fix: within 18 hours",
    deadlineMinutesRemaining: 1080,
    routedSpeed: "Routed to Roads Division II in 0.2s",
    reportedBy: "Priya Sharma (Neighbor)",
    verificationChecklist: {
      locationVerified: true,
      timeVerified: true,
      qualityApproved: false
    }
  },
  {
    id: "ISSUE-102",
    title: "Clean water pipe rupture spraying onto sidewalk",
    category: "Water Leak",
    categoryIcon: "💧",
    photo: "https://images.unsplash.com/photo-1541888946425-d0fbb18f1563?auto=format&fit=crop&w=800&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    address: "Main Market Avenue, Block B",
    area: "Green Park Ward",
    distance: "340m away",
    location: [28.5992, 77.1995],
    status: "In Progress",
    upvotes: 67,
    hasUpvoted: false,
    reportedTimeAgo: "45 mins ago",
    assignedTeam: "Water & Pipeline Team",
    fixEstimate: "Expected fix: within 4 hours",
    deadlineMinutesRemaining: 210,
    routedSpeed: "Routed to Water Response Unit in 0.1s",
    reportedBy: "Kavita Rao (Resident)",
    verificationChecklist: {
      locationVerified: true,
      timeVerified: true,
      qualityApproved: false
    }
  },
  {
    id: "ISSUE-103",
    title: "Overflowing community garbage bin near school gate",
    category: "Garbage",
    categoryIcon: "🗑️",
    photo: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    address: "Sector 4, adjacent to Primary School",
    area: "Industrial Corridor Ward",
    distance: "480m away",
    location: [28.6340, 77.2195],
    status: "Fixed",
    upvotes: 29,
    hasUpvoted: true,
    reportedTimeAgo: "1 day ago",
    assignedTeam: "Cleanliness & Sanitation Crew",
    fixEstimate: "Completed on schedule 🎉",
    deadlineMinutesRemaining: 0,
    routedSpeed: "Routed to Sanitation Tipper #9 in 0.3s",
    reportedBy: "Harish Nambiar",
    fixedTimeAgo: "3 hours ago",
    verificationChecklist: {
      locationVerified: true,
      timeVerified: true,
      qualityApproved: true
    }
  },
  {
    id: "ISSUE-104",
    title: "Dark pedestrian walkway due to broken high-mast lights",
    category: "Streetlight",
    categoryIcon: "💡",
    photo: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
    address: "Heritage Promenade, South Stretch",
    area: "Old Heritage Ward",
    distance: "750m away",
    location: [28.6240, 77.2370],
    status: "Fixed",
    upvotes: 18,
    hasUpvoted: false,
    reportedTimeAgo: "2 days ago",
    assignedTeam: "City Electrical Team",
    fixEstimate: "Completed on schedule 🎉",
    deadlineMinutesRemaining: 0,
    routedSpeed: "Routed to Electrical Unit #2 in 0.2s",
    reportedBy: "Meera Sen",
    fixedTimeAgo: "Yesterday",
    verificationChecklist: {
      locationVerified: true,
      timeVerified: true,
      qualityApproved: true
    }
  },
  {
    id: "ISSUE-105",
    title: "Clogged storm drain backing up on sidewalk",
    category: "Drainage",
    categoryIcon: "🌊",
    photo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1584463699039-446714078832?auto=format&fit=crop&w=800&q=80",
    address: "Bypass Road, near Bus Stand",
    area: "Connaught Ward",
    distance: "900m away",
    location: [28.6180, 77.2140],
    status: "Reported",
    upvotes: 14,
    hasUpvoted: false,
    reportedTimeAgo: "15 mins ago",
    assignedTeam: "Water & Pipeline Team",
    fixEstimate: "Expected fix: within 24 hours",
    deadlineMinutesRemaining: 1420,
    routedSpeed: "Routed to Drainage Crew in 0.15s",
    reportedBy: "Vikram Mehta",
    verificationChecklist: {
      locationVerified: true,
      timeVerified: true,
      qualityApproved: false
    }
  }
];

export const WORKLOAD_STATS = [
  {
    teamName: "Roads Team",
    activeTickets: 14,
    capacityPct: 82,
    status: "Active Dispatches",
    color: "amber"
  },
  {
    teamName: "Water & Pipeline Team",
    activeTickets: 6,
    capacityPct: 45,
    status: "Normal Load",
    color: "cyan"
  },
  {
    teamName: "Cleanliness Crew",
    activeTickets: 19,
    capacityPct: 92,
    status: "High Load",
    color: "red"
  },
  {
    teamName: "City Electrical Team",
    activeTickets: 4,
    capacityPct: 30,
    status: "Normal Load",
    color: "emerald"
  }
];

export const HEATMAP_HOTSPOTS = [
  {
    id: "H1",
    name: "Connaught Metro Ring",
    center: [28.6145, 77.2085],
    intensity: "High Activity",
    issueCount: 8,
    topIssue: "Road Repairs & Potholes",
    avgWaitTime: "18 hours",
    color: "#f43f5e" // rose/red
  },
  {
    id: "H2",
    name: "Green Park Market Zone",
    center: [28.5992, 77.1995],
    intensity: "Medium Activity",
    issueCount: 4,
    topIssue: "Water & Plumbing",
    avgWaitTime: "6 hours",
    color: "#f59e0b" // amber
  },
  {
    id: "H3",
    name: "North Industrial Belt",
    center: [28.6340, 77.2195],
    intensity: "Steady Cleanups",
    issueCount: 5,
    topIssue: "Waste Clearance",
    avgWaitTime: "12 hours",
    color: "#06b6d4" // cyan
  }
];
