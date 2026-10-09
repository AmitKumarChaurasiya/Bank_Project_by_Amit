import React, { useState } from 'react';
import { getStatusStyle, getPriorityStyle } from '../../utils/helpers.js';

export function StatusDonutChart({ complaints }) {
  const [hoveredStatus, setHoveredStatus] = useState(null);

  const statuses = [
    { label: 'Submitted', color: '#3B82F6' },
    { label: 'Under Review', color: '#F59E0B' },
    { label: 'In Progress', color: '#6366F1' },
    { label: 'Awaiting Customer Information', color: '#A855F7' },
    { label: 'Resolved', color: '#10B981' },
    { label: 'Closed', color: '#64748B' },
    { label: 'Reopened', color: '#F43F5E' }
  ];

  const total = complaints.length;
  const statusCounts = statuses.map(s => {
    const count = complaints.filter(c => c.status === s.label).length;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return { ...s, count, percentage };
  }).filter(s => s.count > 0);

  // SVG Donut calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Status Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current stage allocation
          </p>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
          {total} Total
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 justify-around py-2">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="18"
              fill="transparent"
            />
            {statusCounts.map((item) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedOffset;
              accumulatedOffset += (item.percentage / 100) * circumference;

              return (
                <circle
                  key={item.label}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={item.color}
                  strokeWidth="18"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredStatus(item)}
                  onMouseLeave={() => setHoveredStatus(null)}
                />
              );
            })}
          </svg>

          {/* Centered Information */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {hoveredStatus ? hoveredStatus.count : total}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
              {hoveredStatus ? hoveredStatus.label : 'Complaints'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-1.5 text-xs">
          {statusCounts.map((item) => (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredStatus(item)}
              onMouseLeave={() => setHoveredStatus(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                hoveredStatus?.label === item.label
                  ? 'bg-slate-100 dark:bg-slate-800 font-semibold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 dark:text-slate-300 truncate">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] tabular-nums">
                <span className="text-slate-900 dark:text-white font-bold">
                  {item.count}
                </span>
                <span className="text-slate-400">
                  ({item.percentage.toFixed(0)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryBarChart({ complaints }) {
  const categories = [
    'UPI & Digital Payments',
    'ATM & Cash Withdrawal',
    'Credit & Debit Cards',
    'Net Banking & Mobile App',
    'Fraud & Security',
    'Loans & EMI',
    'Account & Branch Services'
  ];

  const total = complaints.length;
  const categoryStats = categories.map(cat => {
    const count = complaints.filter(c => c.category === cat).length;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return { name: cat, count, percentage };
  }).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Complaints by Category
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dispute frequency breakdown
          </p>
        </div>
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          {categoryStats.length} Active Categories
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {categoryStats.length === 0 ? (
          <div className="text-xs text-slate-400 py-6 text-center">
            No complaints logged yet.
          </div>
        ) : (
          categoryStats.map(item => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate pr-2">
                  {item.name}
                </span>
                <span className="font-mono text-[11px] text-slate-900 dark:text-white tabular-nums shrink-0">
                  {item.count} <span className="text-slate-400">({item.percentage.toFixed(0)}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(item.percentage, 4)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
