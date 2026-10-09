import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Filter,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { formatDate, getRelativeTime } from '../../utils/helpers.js';

export default function NotificationCenter() {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    navigateToTrack
  } = useApp();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread'

  const role = currentUser?.role || 'Customer';

  // Role filtered notifications
  const roleNotifications = notifications.filter(
    n => !n.targetRole || n.targetRole === role || role === 'Administrator'
  );

  const displayedNotifications = filterType === 'unread'
    ? roleNotifications.filter(n => !n.read)
    : roleNotifications;

  const unreadCount = roleNotifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Grievance Notification Hub
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-mono">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time status change alerts, officer reassignments, and regulatory resolution orders.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-blue-600" />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filterType === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All Alerts ({roleNotifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filterType === 'unread'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {displayedNotifications.length === 0 ? (
          <div className="p-16 text-center">
            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No notifications in this view
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You are completely caught up with all grievance updates.
            </p>
          </div>
        ) : (
          displayedNotifications.map((n) => {
            let Icon = Bell;
            let iconBg = 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300';

            if (n.type === 'resolved') {
              Icon = CheckCircle2;
              iconBg = 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
            } else if (n.type === 'status_update') {
              Icon = Clock;
              iconBg = 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300';
            }

            return (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.complaintId) navigateToTrack(n.complaintId);
                }}
                className={`p-4 sm:p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                  !n.read ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold ${!n.read ? 'text-blue-900 dark:text-blue-200' : 'text-slate-900 dark:text-white'}`}>
                      {n.title}
                    </h4>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {getRelativeTime(n.timestamp)}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="mt-2.5 flex items-center gap-3 text-[11px]">
                    {n.complaintId && (
                      <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        <span>Case #{n.complaintId}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                    <span className="text-slate-400">
                      Logged: {formatDate(n.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
