import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { X, CheckCircle, AlertTriangle, Shield, UserCheck } from 'lucide-react';

export default function StatusUpdateModal({ isOpen, onClose, complaint }) {
  const { updateComplaintStatus, staff, currentUser } = useApp();

  const [selectedStatus, setSelectedStatus] = useState(complaint?.status || 'In Progress');
  const [remarks, setRemarks] = useState('');
  const [assignedStaffId, setAssignedStaffId] = useState(complaint?.assignedStaffId || '');
  const [error, setError] = useState('');

  if (!isOpen || !complaint) return null;

  const validStatuses = [
    'Submitted',
    'Under Review',
    'In Progress',
    'Awaiting Customer Information',
    'Resolved',
    'Closed',
    'Reopened'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Rule: Resolution remarks required when resolving or closing
    if ((selectedStatus === 'Resolved' || selectedStatus === 'Closed') && !remarks.trim()) {
      setError('Detailed resolution remarks are mandatory when marking as Resolved or Closed.');
      return;
    }

    if (remarks.trim().length > 0 && remarks.trim().length < 5) {
      setError('Please provide at least 5 characters for the audit note.');
      return;
    }

    updateComplaintStatus(complaint.id, selectedStatus, remarks.trim(), assignedStaffId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workflow Management
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Update Status · {complaint.id}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-1 font-medium bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          {complaint.subject}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
              Target Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {validStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
              Assigned Grievance Officer
            </label>
            <select
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.departmentName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Status Notes / Resolution Remarks
                {(selectedStatus === 'Resolved' || selectedStatus === 'Closed') && (
                  <span className="text-rose-500"> *</span>
                )}
              </label>
              <span className="text-[11px] text-slate-400">
                Audited & visible on timeline
              </span>
            </div>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                selectedStatus === 'Resolved'
                  ? 'Specify resolution details (e.g. refund UTR, reversal amount, clearing date)...'
                  : 'Add internal progress notes or reason for status transition...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-sm"
            >
              Save Transition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
