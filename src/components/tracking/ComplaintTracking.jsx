import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  User,
  ArrowRight,
  FileText,
  CornerDownRight,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { formatDate, getStatusStyle, getPriorityStyle, calculateSlaStatus } from '../../utils/helpers.js';
import StatusUpdateModal from '../complaints/StatusUpdateModal.jsx';
import ConfirmationModal from '../common/ConfirmationModal.jsx';

export default function ComplaintTracking() {
  const {
    currentUser,
    complaints,
    trackingSelectedId,
    setTrackingSelectedId,
    requestReopenComplaint,
    setCurrentPage
  } = useApp();

  const [searchIdInput, setSearchIdInput] = useState(trackingSelectedId || '');
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopenError, setReopenError] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const role = currentUser?.role || 'Customer';

  // Load trackingSelectedId on mount or change
  useEffect(() => {
    if (trackingSelectedId) {
      setSearchIdInput(trackingSelectedId);
      performLookup(trackingSelectedId);
    } else {
      // Pick the first available complaint for convenience
      const defaultOne = complaints[0];
      if (defaultOne) {
        setSearchIdInput(defaultOne.id);
        performLookup(defaultOne.id);
      }
    }
  }, [trackingSelectedId, complaints]);

  const performLookup = (targetId) => {
    setErrorMessage('');
    if (!targetId || !targetId.trim()) {
      setActiveComplaint(null);
      setErrorMessage('Please enter a valid Complaint ID (e.g. SB-2026-1042).');
      return;
    }

    const cleanId = targetId.trim().toUpperCase();
    const found = complaints.find(c => c.id.toUpperCase() === cleanId);

    if (!found) {
      setActiveComplaint(null);
      setErrorMessage(`No grievance record found with ID "${cleanId}". Please verify the complaint reference.`);
      return;
    }

    // Role access authorization check
    if (role === 'Customer' && found.customerId !== currentUser?.id) {
      setActiveComplaint(null);
      setErrorMessage(`Unauthorized Access: Complaint ${cleanId} belongs to another account holder. In customer demo mode, you can only track disputes filed under your own account.`);
      return;
    }

    setActiveComplaint(found);
    setTrackingSelectedId(found.id);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performLookup(searchIdInput);
  };

  const handleReopenSubmit = () => {
    if (!reopenReason.trim() || reopenReason.trim().length < 10) {
      setReopenError('Please provide a specific justification of at least 10 characters.');
      return;
    }
    requestReopenComplaint(activeComplaint.id, reopenReason.trim());
    setShowReopenModal(false);
    setReopenReason('');
    setReopenError('');
  };

  // Pipeline stages for high-level progress bar
  const pipelineStages = [
    { key: 'Submitted', label: 'Submitted' },
    { key: 'Under Review', label: 'Under Review' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'Resolved', label: 'Resolved' },
    { key: 'Closed', label: 'Closed' }
  ];

  const getStageIndex = (status) => {
    if (status === 'Submitted') return 0;
    if (status === 'Under Review') return 1;
    if (status === 'In Progress' || status === 'Awaiting Customer Information') return 2;
    if (status === 'Resolved') return 3;
    if (status === 'Closed') return 4;
    if (status === 'Reopened') return 2; // reopened goes back to investigation
    return 0;
  };

  const currentStageIndex = activeComplaint ? getStageIndex(activeComplaint.status) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Complaint Tracking & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time stage transparency, officer investigation notes, and dispute chronology.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchIdInput}
              onChange={(e) => setSearchIdInput(e.target.value)}
              placeholder="Enter Complaint ID (e.g. SB-2026-1042)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm whitespace-nowrap"
          >
            Track Grievance
          </button>
        </form>

        {/* Quick sample pills for easy testing */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Quick Demo Sample:</span>
          {complaints.slice(0, 4).map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSearchIdInput(c.id);
                performLookup(c.id);
              }}
              className="font-mono text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Complaint Not Reachable</h4>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Loaded Complaint Content */}
      {activeComplaint && (
        <div className="space-y-6">
          {/* Status Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-lg text-blue-600 dark:text-blue-400">
                    {activeComplaint.id}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span className={getPriorityStyle(activeComplaint.priority).badge}>
                    {activeComplaint.priority} Priority
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {activeComplaint.subject}
                </h2>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    getStatusStyle(activeComplaint.status).bg
                  } ${getStatusStyle(activeComplaint.status).text} ${
                    getStatusStyle(activeComplaint.status).border
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${getStatusStyle(activeComplaint.status).dot}`} />
                  {activeComplaint.status}
                </span>

                {(role === 'Bank Staff' || role === 'Administrator') && (
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Update Status
                  </button>
                )}

                {role === 'Customer' && (activeComplaint.status === 'Resolved' || activeComplaint.status === 'Closed') && (
                  <button
                    onClick={() => setShowReopenModal(true)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Request Reopening</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual Multi-Stage Progress Stepper */}
            <div className="py-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                {pipelineStages.map((stage, idx) => {
                  const isCompleted = idx < currentStageIndex || (activeComplaint.status === 'Closed');
                  const isCurrent = idx === currentStageIndex && activeComplaint.status !== 'Closed';

                  let stepColor = 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500';
                  if (isCompleted) {
                    stepColor = 'bg-emerald-500 text-white shadow-sm';
                  } else if (isCurrent) {
                    stepColor = 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950';
                  }

                  return (
                    <div key={stage.key} className="flex flex-col items-center text-center p-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${stepColor}`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-xs font-medium ${isCurrent ? 'text-blue-600 dark:text-blue-400 font-bold' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Department
                </span>
                <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                  {activeComplaint.departmentName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Assigned Officer
                </span>
                <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                  {activeComplaint.assignedStaffName || 'Under Automatic Routing'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Filing Timestamp
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300 mt-0.5 block">
                  {formatDate(activeComplaint.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Regulatory SLA Status
                </span>
                <span className={`mt-0.5 block font-semibold ${calculateSlaStatus(activeComplaint).color}`}>
                  {calculateSlaStatus(activeComplaint).label}
                </span>
              </div>
            </div>
          </div>

          {/* Details & Chronological Timeline Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Complaint Full Description & Transaction Data */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                  Incident Description
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {activeComplaint.description}
                </p>

                {/* Transaction Data */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Transaction Reference:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {activeComplaint.transactionRef || 'N/A'}
                    </span>
                  </div>
                  {activeComplaint.transactionDate && (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Transaction Date:</span>
                      <span className="font-mono text-slate-900 dark:text-white">
                        {activeComplaint.transactionDate}
                      </span>
                    </div>
                  )}
                  {activeComplaint.transactionAmount && (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Disputed Amount:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        ₹{activeComplaint.transactionAmount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Account Number:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {activeComplaint.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Customer Name:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {activeComplaint.customerName}
                    </span>
                  </div>
                </div>

                {/* Resolution Remarks Highlight if present */}
                {activeComplaint.resolutionRemarks && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-xs space-y-1">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Official Resolution Order
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                      {activeComplaint.resolutionRemarks}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Chronological Timeline */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                    Audit Chronology & Case Log
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                  {activeComplaint.timeline.length} Events Logged
                </span>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {activeComplaint.timeline.map((entry, index) => {
                  const isLatest = index === activeComplaint.timeline.length - 1;
                  const statusStyle = getStatusStyle(entry.status);

                  return (
                    <div key={entry.id || index} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                          isLatest ? 'bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950' : 'bg-slate-400 dark:bg-slate-600'
                        }`}
                      />

                      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md font-semibold text-[10px] border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >
                              {entry.status}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {entry.actor}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>

                        {entry.note && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Request Modal */}
      {showReopenModal && (
        <ConfirmationModal
          isOpen={showReopenModal}
          title="Request Complaint Reopening"
          message="If the resolution provided was unsatisfactory or the transaction discrepancy has not cleared in your bank statement, provide details below to reopen this grievance."
          confirmText="Submit Reopen Request"
          cancelText="Cancel"
          type="warning"
          onConfirm={handleReopenSubmit}
          onCancel={() => setShowReopenModal(false)}
        >
          <div className="space-y-2 mt-2">
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Reason for dissatisfaction / unresolved details <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. The refund UTR provided is not showing in my passbook after 7 days..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {reopenError && (
              <p className="text-xs text-rose-600 dark:text-rose-400">{reopenError}</p>
            )}
          </div>
        </ConfirmationModal>
      )}

      {/* Status Modal for Staff/Admin */}
      {showStatusModal && activeComplaint && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            // Refresh view
            performLookup(activeComplaint.id);
          }}
          complaint={activeComplaint}
        />
      )}
    </div>
  );
}
