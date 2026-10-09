import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { formatDate, getRelativeTime } from '../../utils/helpers.js';
import { Activity, Clock, ArrowUpRight, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function ActivityFeed() {
  const { activities, navigateToTrack } = useApp();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Audit & Activity Feed
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Real-time ledger
          </span>
        </div>

        <div className="space-y-3.5">
          {activities.slice(0, 6).map((item) => {
            let badgeBg = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            if (item.action.includes('Resolved')) {
              badgeBg = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
            } else if (item.action.includes('Progress') || item.action.includes('Review')) {
              badgeBg = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300';
            } else if (item.action.includes('Reopened')) {
              badgeBg = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
            }

            return (
              <div
                key={item.id}
                onClick={() => item.complaintId && navigateToTrack(item.complaintId)}
                className="group p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                    <span>{item.actorName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({item.role})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono tabular-nums">
                    <Clock className="w-3 h-3" />
                    {getRelativeTime(item.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${badgeBg}`}>
                    {item.action}
                  </span>
                  {item.complaintId && (
                    <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center">
                      {item.complaintId}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                    </span>
                  )}
                </div>

                {item.detail && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 leading-snug">
                    {item.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
        Every status transition & remark is logged for grievance audit
      </div>
    </div>
  );
}
