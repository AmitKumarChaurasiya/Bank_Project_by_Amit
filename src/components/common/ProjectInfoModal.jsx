import React from 'react';
import { X, Award, CheckCircle, GraduationCap, Building2, User, ShieldCheck, Code2 } from 'lucide-react';

export default function ProjectInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider text-blue-300 uppercase">Capstone Project Portfolio</span>
              <h3 className="text-xl font-bold tracking-tight text-white">SmartBank Redressal System</h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="text-sm">
                <span className="text-slate-500 dark:text-slate-400">Student Developer:</span>{' '}
                <span className="font-semibold text-slate-900 dark:text-white">Amit Kumar</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="text-sm">
                <span className="text-slate-500 dark:text-slate-400">Program & Branch:</span>{' '}
                <span className="font-semibold text-slate-900 dark:text-white">B.Tech — Computer Science & Engineering</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="text-sm">
                <span className="text-slate-500 dark:text-slate-400">Institution:</span>{' '}
                <span className="font-semibold text-slate-900 dark:text-white">Lloyd Institute of Engineering and Technology</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="text-sm">
                <span className="text-slate-500 dark:text-slate-400">Architecture:</span>{' '}
                <span className="font-semibold text-slate-900 dark:text-white">MERN Frontend (React.js, Tailwind, LocalStorage)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Demonstration & Security Notice
            </h4>
            <p>
              • This system operates <strong>Frontend-Only</strong> with local browser storage. No real financial credentials, bank accounts, or external APIs are connected.
            </p>
            <p>
              • Three fully wired demo personas are provided: <strong>Customer</strong> (complaint lodging & tracking), <strong>Bank Staff</strong> (resolution workflow), and <strong>Administrator</strong> (system-wide governance & auditing).
            </p>
            <p>
              • Any Service Level Agreement (SLA) counters or overdue flags are strictly simulation metrics for academic demonstration.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              Continue to SmartBank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
