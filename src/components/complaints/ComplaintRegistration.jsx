import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { CATEGORIES } from '../../data/initialData.js';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  FileText,
  CreditCard,
  Building2,
  Calendar,
  IndianRupee,
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import ConfirmationModal from '../common/ConfirmationModal.jsx';

export default function ComplaintRegistration() {
  const {
    currentUser,
    departments,
    addComplaint,
    navigateToTrack,
    checkDuplicateComplaint
  } = useApp();

  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [departmentId, setDepartmentId] = useState(departments[0].id);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [priority, setPriority] = useState('Normal');

  // Validation errors
  const [errors, setErrors] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Auto-select department when category changes
  useEffect(() => {
    const matchedCategory = CATEGORIES.find(c => c.name === category);
    if (matchedCategory) {
      const dept = departments.find(d => d.id === matchedCategory.departmentId);
      if (dept) {
        setDepartmentId(dept.id);
      }
    }
  }, [category, departments]);

  // Check duplicate when transactionRef changes
  useEffect(() => {
    if (transactionRef.trim()) {
      const duplicate = checkDuplicateComplaint(transactionRef.trim());
      setDuplicateWarning(duplicate);
    } else {
      setDuplicateWarning(null);
    }
  }, [transactionRef]);

  const validate = () => {
    const errs = {};
    if (!subject.trim()) {
      errs.subject = 'Subject is required.';
    } else if (subject.trim().length < 6) {
      errs.subject = 'Subject must be at least 6 characters long.';
    } else if (subject.trim().length > 120) {
      errs.subject = 'Subject cannot exceed 120 characters.';
    }

    if (!description.trim()) {
      errs.description = 'Detailed description is required.';
    } else if (description.trim().length < 20) {
      errs.description = 'Please provide at least 20 characters describing the incident.';
    } else if (description.trim().length > 1500) {
      errs.description = 'Description cannot exceed 1500 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmedSubmit = () => {
    setShowConfirmModal(false);
    const newRecord = addComplaint({
      category,
      departmentId,
      subject: subject.trim(),
      description: description.trim(),
      transactionRef: transactionRef.trim(),
      transactionDate,
      transactionAmount: transactionAmount.trim(),
      priority
    });

    if (newRecord) {
      // Navigate to tracking view
      navigateToTrack(newRecord.id);
    }
  };

  const selectedDept = departments.find(d => d.id === departmentId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Register Banking Grievance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Submit a dispute or service complaint for automated routing and regulatory SLA tracking.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
          <span>Auto-Generated ID Format:</span>
          <strong>SB-2026-XXXX</strong>
        </div>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong className="font-bold">Security Protection Notice:</strong> SmartBank strictly prohibits entering ATM PINs, CVV security codes, Net Banking passwords, or OTPs. Bank officers never ask for sensitive credentials during complaint redressal.
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handlePreSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Category & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Dispute Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Assigned Redressal Department
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} (SLA: {dept.slaHours}h)
                </option>
              ))}
            </select>
            {selectedDept && (
              <p className="text-[11px] text-slate-500 mt-1.5">
                Target Resolution SLA: <strong>{selectedDept.slaHours} Hours</strong> · Desk Head: {selectedDept.head}
              </p>
            )}
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
            Priority Level <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { level: 'Normal', label: 'Normal', desc: 'Standard query / statement request' },
              { level: 'High', label: 'High', desc: 'Debit discrepancy / POS failure' },
              { level: 'Urgent', label: 'Urgent', desc: 'Fraud alert / unauthorized debit' }
            ].map((p) => (
              <button
                key={p.level}
                type="button"
                onClick={() => setPriority(p.level)}
                className={`p-3 text-left rounded-xl border transition-all text-xs ${
                  priority === p.level
                    ? p.level === 'Urgent'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20'
                      : p.level === 'High'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{p.label}</span>
                  {priority === p.level && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
                <div className="text-[11px] opacity-75 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Grievance Subject <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              {subject.length}/120
            </span>
          </div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. UPI ₹8,500 debited from account but failed at merchant QR code"
            maxLength={120}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.subject
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:outline-none`}
          />
          {errors.subject && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.subject}</p>
          )}
        </div>

        {/* Optional Transaction Details */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Transaction Details (Optional)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transaction Reference / UTR / Auth No.
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. UPI-409823149811"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transaction Date
              </label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Disputed Amount (₹)
              </label>
              <input
                type="text"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="e.g. 8,500.00"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Duplicate complaint warning */}
          {duplicateWarning && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <strong className="font-semibold">Possible Duplicate Dispute Detected:</strong>
                <p className="mt-0.5">
                  An active grievance <strong>({duplicateWarning.id})</strong> is already open for reference "{transactionRef}". Current status: <em>{duplicateWarning.status}</em>. You may still proceed if this is an escalated dispute.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              {description.length}/1500 (min 20)
            </span>
          </div>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please detail the sequence of events, merchant name, terminal location, error messages displayed, and any action taken so far..."
            maxLength={1500}
            className={`w-full px-3.5 py-2.5 rounded-xl border ${
              errors.description
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:outline-none`}
          />
          {errors.description && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Customer Account Details Auto-filled Preview */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 pt-2">
          <span>Complainant: <strong>{currentUser?.name}</strong></span>
          <span>·</span>
          <span>Contact: <strong>{currentUser?.email}</strong></span>
          <span>·</span>
          <span>Account: <strong>{currentUser?.accountNumber || '•••• 4092'}</strong></span>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 hover:scale-[1.01]"
          >
            <span>Review & Lodge Grievance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Grievance Registration"
        message={`Are you sure you want to lodge this complaint under "${category}" with ${priority} priority? An immutable reference ticket will be created and dispatched to ${selectedDept?.name}.`}
        confirmText="Confirm & Submit"
        cancelText="Review Again"
        type="info"
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirmModal(false)}
      >
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
          <div><strong>Subject:</strong> {subject}</div>
          {transactionRef && <div><strong>Reference:</strong> {transactionRef}</div>}
          <div><strong>Target SLA:</strong> {selectedDept?.slaHours} hours</div>
        </div>
      </ConfirmationModal>
    </div>
  );
}
