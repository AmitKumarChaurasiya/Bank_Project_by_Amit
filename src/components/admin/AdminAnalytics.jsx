import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldAlert,
  Users2,
  Building,
  CheckCircle2,
  AlertTriangle,
  Download,
  Info,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { StatusDonutChart, CategoryBarChart } from '../dashboard/InteractiveCharts.jsx';
import { exportComplaintsToCSV, calculateSlaStatus } from '../../utils/helpers.js';

export default function AdminAnalytics() {
  const { complaints, departments, staff, navigateToTrack, showToast } = useApp();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const pending = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Awaiting Customer Information').length;
  const reopened = complaints.filter(c => c.status === 'Reopened').length;

  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;

  // Department workload aggregation
  const departmentWorkload = departments.map(dept => {
    const deptComplaints = complaints.filter(c => c.departmentId === dept.id);
    const activeCount = deptComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
    const resolvedCount = deptComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
    return {
      ...dept,
      totalCount: deptComplaints.length,
      activeCount,
      resolvedCount
    };
  });

  // Staff workload aggregation
  const staffWorkload = staff.map(s => {
    const assignedComplaints = complaints.filter(c => c.assignedStaffId === s.id);
    const active = assignedComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
    const done = assignedComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
    return {
      ...s,
      activeTickets: active,
      resolvedTickets: done + (s.resolvedCount || 0)
    };
  });

  const handleAuditExport = () => {
    const success = exportComplaintsToCSV(complaints, 'smartbank_master_compliance_audit.csv');
    if (success) {
      showToast({
        type: 'success',
        title: 'Master Audit Exported',
        message: `Generated compliance ledger with all ${complaints.length} records.`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Executive Compliance & SLA Intelligence
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bank-wide dispute velocity, department turn-around benchmarks, and officer resolution efficiency.
          </p>
        </div>

        <button
          onClick={handleAuditExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Master Audit CSV</span>
        </button>
      </div>

      {/* SLA Simulation Disclaimer */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong>Regulatory Evaluation Notice:</strong> All Turnaround Time (TAT), resolution percentages, and SLA breach indicators presented in this dashboard are client-side demonstration algorithms designed for academic evaluation.
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 block">Bank-Wide Disputes</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono tabular-nums">
            {total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across 6 Operational Departments
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 block">Overall Resolution Rate</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono tabular-nums">
            {resolutionRate}%
          </div>
          <div className="text-[11px] text-emerald-600/80 font-medium mt-1">
            Target benchmark: &gt;90%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 block">Active Pipeline</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono tabular-nums">
            {pending + inProgress}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {pending} awaiting review · {inProgress} assigned
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 block">Customer Reopen Rate</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono tabular-nums">
            {reopened} <span className="text-xs font-normal text-slate-400">cases</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Escalated for secondary audit
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <StatusDonutChart complaints={complaints} />
        </div>
        <div className="lg:col-span-6">
          <CategoryBarChart complaints={complaints} />
        </div>
      </div>

      {/* Department-wise Workload Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">
              Departmental Workload & SLA Compliance
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {departments.length} Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Department Unit</th>
                <th className="py-3 px-4">Redressal Head</th>
                <th className="py-3 px-4">Standard SLA</th>
                <th className="py-3 px-4">Active Disputes</th>
                <th className="py-3 px-4">Resolved</th>
                <th className="py-3 px-4 text-right">Workload Load</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departmentWorkload.map(dept => {
                const percentage = total > 0 ? ((dept.totalCount / total) * 100).toFixed(0) : 0;
                return (
                  <tr key={dept.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {dept.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {dept.head}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-blue-600 dark:text-blue-400">
                      {dept.slaHours} Hours
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {dept.activeCount}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {dept.resolvedCount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                      {percentage}% of Bank disputes
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Productivity Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">
              Grievance Officers & Assigned Workload
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {staff.length} Officers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Officer Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Active Queue</th>
                <th className="py-3 px-4">Completed Redressals</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffWorkload.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {s.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {s.departmentName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {s.role}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {s.activeTickets}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {s.resolvedTickets}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
