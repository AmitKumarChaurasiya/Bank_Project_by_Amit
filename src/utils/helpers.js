/**
 * Utility helper functions for SmartBank
 */

export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatShortDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return isoString;
  }
}

export function getRelativeTime(isoString) {
  if (!isoString) return '';
  try {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
  } catch {
    return '';
  }
}

export function getStatusStyle(status) {
  switch (status) {
    case 'Submitted':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/60',
        dot: 'bg-blue-500'
      };
    case 'Under Review':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
        dot: 'bg-amber-500'
      };
    case 'In Progress':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800/60',
        dot: 'bg-indigo-500'
      };
    case 'Awaiting Customer Information':
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800/60',
        dot: 'bg-purple-500'
      };
    case 'Resolved':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/60',
        dot: 'bg-emerald-500'
      };
    case 'Closed':
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
        dot: 'bg-slate-500'
      };
    case 'Reopened':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800/60',
        dot: 'bg-rose-500'
      };
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
        dot: 'bg-slate-400'
      };
  }
}

export function getPriorityStyle(priority) {
  switch (priority) {
    case 'Urgent':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800/60',
        badge: 'text-rose-700 dark:text-rose-400 font-medium'
      };
    case 'High':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
        badge: 'text-amber-700 dark:text-amber-400 font-medium'
      };
    case 'Normal':
    default:
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
        badge: 'text-slate-600 dark:text-slate-400'
      };
  }
}

export function calculateSlaStatus(complaint) {
  if (complaint.status === 'Resolved' || complaint.status === 'Closed') {
    return {
      label: 'Completed',
      status: 'completed',
      color: 'text-emerald-600 dark:text-emerald-400'
    };
  }

  if (!complaint.slaDeadline) {
    return {
      label: 'Standard SLA',
      status: 'normal',
      color: 'text-slate-500'
    };
  }

  const now = new Date().getTime();
  const deadline = new Date(complaint.slaDeadline).getTime();
  const diffHours = (deadline - now) / (1000 * 60 * 60);

  if (diffHours < 0) {
    return {
      label: `Overdue by ${Math.abs(Math.round(diffHours))}h (Demo Calc)`,
      status: 'breached',
      color: 'text-rose-600 dark:text-rose-400 font-semibold'
    };
  } else if (diffHours < 12) {
    return {
      label: `Due soon (${Math.round(diffHours)}h left)`,
      status: 'warning',
      color: 'text-amber-600 dark:text-amber-400 font-medium'
    };
  } else {
    return {
      label: `On track (${Math.round(diffHours)}h left)`,
      status: 'ontrack',
      color: 'text-blue-600 dark:text-blue-400'
    };
  }
}

/**
 * Exports data to CSV file and triggers download
 */
export function exportComplaintsToCSV(complaints, filename = 'smartbank_complaints_export.csv') {
  if (!complaints || complaints.length === 0) return false;

  const headers = [
    'Complaint ID',
    'Customer Name',
    'Customer Email',
    'Account Number',
    'Category',
    'Subject',
    'Priority',
    'Department',
    'Assigned Staff',
    'Current Status',
    'Transaction Ref',
    'Created At',
    'Updated At',
    'Resolution Remarks'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const stringVal = String(val).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = complaints.map(c => [
    escapeCSV(c.id),
    escapeCSV(c.customerName),
    escapeCSV(c.customerEmail),
    escapeCSV(c.accountNumber),
    escapeCSV(c.category),
    escapeCSV(c.subject),
    escapeCSV(c.priority),
    escapeCSV(c.departmentName),
    escapeCSV(c.assignedStaffName),
    escapeCSV(c.status),
    escapeCSV(c.transactionRef),
    escapeCSV(c.createdAt),
    escapeCSV(c.updatedAt),
    escapeCSV(c.resolutionRemarks)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
