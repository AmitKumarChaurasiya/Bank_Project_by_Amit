import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  PlusCircle,
  Search,
  Download,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Building,
  ArrowUpRight
} from 'lucide-react';
import { StatusDonutChart, CategoryBarChart } from './InteractiveCharts.jsx';
import ActivityFeed from './ActivityFeed.jsx';
import { formatDate, formatShortDate, getStatusStyle, getPriorityStyle, exportComplaintsToCSV } from '../../utils/helpers.js';

export default function DashboardOverview() {
  const {
    currentUser,
    complaints,
    setCurrentPage,
    navigateToTrack,
    showToast
  } = useApp();

  const role = currentUser?.role || 'Customer';

  // Role filtered complaints
  let visibleComplaints = complaints;
  if (role === 'Customer') {
    visibleComplaints = complaints.filter(c => c.customerId === currentUser?.id);
  } else if (role === 'Bank Staff') {
    visibleComplaints = complaints.filter(
      c => c.departmentName === currentUser?.department || c.assignedStaffId === currentUser?.id
    );
  }

  // Statistics
  const total = visibleComplaints.length;
  const pending = visibleComplaints.filter(c => c.status === 'Submitted').length;
  const underReview = visibleComplaints.filter(c => c.status === 'Under Review').length;
  const inProgress = visibleComplaints.filter(c => c.status === 'In Progress' || c.status === 'Awaiting Customer Information').length;
  const resolved = visibleComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const highPriority = visibleComplaints.filter(c => c.priority === 'High' || c.priority === 'Urgent').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const handleExport = () => {
    const success = exportComplaintsToCSV(visibleComplaints, `smartbank_${role.toLowerCase()}_complaints.csv`);
    if (success) {
      showToast({
        type: 'success',
        title: 'Export Generated',
        message: `Successfully downloaded CSV report with ${visibleComplaints.length} records.`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>SmartBank Enterprise Portal</span>
              <span>·</span>
              <span>{role} Edition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/80">
              {todayFormatted} · Manage disputes, track SLA timelines, and review resolutions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {role === 'Customer' ? (
              <button
                onClick={() => setCurrentPage('new-complaint')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>File New Complaint</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('complaints')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs transition-all shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Inspect All Tickets</span>
              </button>
            )}

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/15"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total */}
        <div
          onClick={() => setCurrentPage('complaints')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Logged</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
            {total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {role === 'Customer' ? 'Your complaints' : 'In your queue'}
          </div>
        </div>

        {/* Pending */}
        <div
          onClick={() => setCurrentPage('complaints')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Submitted</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 font-mono tabular-nums">
            {pending}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Awaiting routing
          </div>
        </div>

        {/* Under Review */}
        <div
          onClick={() => setCurrentPage('complaints')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Under Review</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono tabular-nums">
            {underReview}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Verification ongoing
          </div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setCurrentPage('complaints')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>In Progress</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2 font-mono tabular-nums">
            {inProgress}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Officer assigned
          </div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => setCurrentPage('complaints')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono tabular-nums">
            {resolved}
          </div>
          <div className="text-[11px] text-emerald-600/80 font-medium mt-1">
            {resolutionRate}% Redressed
          </div>
        </div>

        {/* High / Urgent Priority */}
        <div
          onClick={() => setCurrentPage('complaints')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-rose-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Urgent / High</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2 font-mono tabular-nums">
            {highPriority}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Priority SLA
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => setCurrentPage('new-complaint')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-sm group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Register Grievance
              </div>
              <div className="text-[11px] text-slate-500">
                Lodge UPI, Card, ATM dispute
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => setCurrentPage('tracking')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-sm group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Live Status Tracker
              </div>
              <div className="text-[11px] text-slate-500">
                Search by Complaint ID
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => setCurrentPage('complaints')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-sm group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Grievance Records
              </div>
              <div className="text-[11px] text-slate-500">
                Filter, sort & manage
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={handleExport}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-sm group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Download CSV Ledger
              </div>
              <div className="text-[11px] text-slate-500">
                Audited export of records
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Charts & Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <StatusDonutChart complaints={visibleComplaints} />
        </div>
        <div className="lg:col-span-6">
          <CategoryBarChart complaints={visibleComplaints} />
        </div>
      </div>

      {/* Lower Section: Recent Complaints Table + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Complaints Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Recent Grievance Submissions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest active dispute cases in this session
                </p>
              </div>
              <button
                onClick={() => setCurrentPage('complaints')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View Full Table</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {visibleComplaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No Complaints Found
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  You have not filed any grievances yet.
                </p>
                <button
                  onClick={() => setCurrentPage('new-complaint')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium"
                >
                  File First Complaint
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Complaint ID</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {visibleComplaints.slice(0, 5).map((c) => {
                      const statusStyle = getStatusStyle(c.status);
                      const priorityStyle = getPriorityStyle(c.priority);

                      return (
                        <tr
                          key={c.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {c.id}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                            {c.subject}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {c.category}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={priorityStyle.badge}>
                              {c.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => navigateToTrack(c.id)}
                              className="px-2.5 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                            >
                              Track →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing top 5 recent disputes</span>
            <span className="font-mono tabular-nums">{visibleComplaints.length} Total</span>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="lg:col-span-4">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
