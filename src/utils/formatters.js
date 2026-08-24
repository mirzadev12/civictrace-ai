export function formatMinutes(minutes) {
  if (minutes <= 0) return "SLA BREACHED";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

export function formatTimeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function getPriorityBadge(priority) {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    case "HIGH":
      return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
    case "MEDIUM":
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    case "LOW":
      return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
    default:
      return "bg-slate-700 text-slate-300";
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case "RESOLVED":
    case "RESOLVED_WITHIN_SLA":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "IN_PROGRESS":
    case "WORKING_ON_SITE":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    case "ESCALATED":
      return "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse";
    case "FLAGGED_FRAUD":
      return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
    case "TRIAGED":
      return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
  }
}
