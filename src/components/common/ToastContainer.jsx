import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        let Icon = Info;
        let colorClasses = 'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100';
        let iconColor = 'text-blue-600 dark:text-blue-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'text-emerald-600 dark:text-emerald-400';
          colorClasses = 'border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-amber-600 dark:text-amber-400';
          colorClasses = 'border-amber-200 dark:border-amber-900 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          iconColor = 'text-rose-600 dark:text-rose-400';
          colorClasses = 'border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-200 ${colorClasses}`}
            role="status"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
              )}
              {toast.message && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
