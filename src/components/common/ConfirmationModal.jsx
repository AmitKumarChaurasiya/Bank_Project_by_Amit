import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  onConfirm,
  onCancel,
  children
}) {
  if (!isOpen) return null;

  let Icon = AlertTriangle;
  let confirmBtnClass = 'bg-blue-600 hover:bg-blue-700 text-white';
  let iconBg = 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';

  if (type === 'danger') {
    Icon = AlertCircle;
    confirmBtnClass = 'bg-rose-600 hover:bg-rose-700 text-white';
    iconBg = 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400';
  } else if (type === 'success') {
    Icon = CheckCircle;
    confirmBtnClass = 'bg-emerald-600 hover:bg-emerald-700 text-white';
    iconBg = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
  } else if (type === 'info') {
    Icon = Info;
    confirmBtnClass = 'bg-blue-600 hover:bg-blue-700 text-white';
    iconBg = 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
        role="alertdialog"
        aria-modal="true"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            {message && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {message}
              </p>
            )}
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors shadow-sm ${confirmBtnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
