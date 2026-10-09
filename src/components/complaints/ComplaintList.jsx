import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Search,
  Filter,
  Download,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  PlusCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { formatDate, formatShortDate, getStatusStyle, getPriorityStyle, exportComplaintsToCSV, calculateSlaStatus } from '../../utils/helpers.js';
import StatusUpdateModal from './StatusUpdateModal.jsx';

export default function ComplaintList() {
  const {
    currentUser,
    complaints,
    departments,
    navigateToTrack,
    setCurrentPage,
    showToast
  } = useApp();

  const role = currentUser?.role || 'Customer';

  // State for search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc' | 'date_asc' | 'priority_desc'
  const [pageSize, setPageSize] = useState(10);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Status modal trigger
  const [editingComplaint, setEditingComplaint] = useState(null);

  // Base role-filtered complaints
  const baseComplaints = useMemo(() => {
    if (role === 'Customer') {
      return complaints.filter(c => c.customerId === currentUser?.id);
    }
    if (role === 'Bank Staff') {
      return complaints.filter(
        c => c.departmentName === currentUser?.department || c.assignedStaffId === currentUser?.id
      );
    }
    return complaints; // Admin sees all
  }, [complaints, role, currentUser]);

  // Apply filters and search
  const filteredComplaints = useMemo(() => {
    return baseComplaints.filter(c => {
      // Search query across ID, customer name, subject, category, reference
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          c.id.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q) ||
          (c.transactionRef && c.transactionRef.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Status
      if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;

      // Category
      if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;

      // Priority
      if (filterPriority !== 'ALL' && c.priority !== filterPriority) return false;

      // Department
      if (filterDepartment !== 'ALL' && c.departmentId !== filterDepartment) return false;

      return true;
    });
  }, [baseComplaints, searchQuery, filterStatus, filterCategory, filterPriority, filterDepartment]);

  // Apply sorting
  const sortedComplaints = useMemo(() => {
    return [...filteredComplaints].sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority_desc') {
        const priorityWeight = { Urgent: 3, High: 2, Normal: 1 };
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }
      return 0;
    });
  }, [filteredComplaints, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedComplaints.length / pageSize) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPageNum - 1) * pageSize;
    return sortedComplaints.slice(start, start + pageSize);
  }, [sortedComplaints, currentPageNum, pageSize]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStatus('ALL');
    setFilterCategory('ALL');
    setFilterPriority('ALL');
    setFilterDepartment('ALL');
    setSortBy('date_desc');
    setCurrentPageNum(1);
  };

  const handleExportCSV = () => {
    const success = exportComplaintsToCSV(sortedComplaints, `smartbank_${role.toLowerCase()}_complaints.csv`);
    if (success) {
      showToast({
        type: 'success',
        title: 'CSV Ledger Generated',
        message: `Successfully exported ${sortedComplaints.length} records.`
      });
    }
  };

  const uniqueCategories = Array.from(new Set(complaints.map(c => c.category)));

  return (
    <div className="space-y-5">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {role === 'Customer' ? 'My Grievance Ledger' : 'Dispute Case Management'}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono tabular-nums">
              {sortedComplaints.length} {sortedComplaints.length === 1 ? 'case' : 'cases'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {role === 'Customer'
              ? 'Track progress and response history for disputes filed under your account.'
              : role === 'Bank Staff'
              ? `Displaying disputes assigned to ${currentUser?.department} and your officer queue.`
              : 'Master repository of all retail banking dispute records with complete audit trails.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {role === 'Customer' && (
            <button
              onClick={() => setCurrentPage('new-complaint')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Complaint</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Role Restriction Acknowledgment Banner */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>
            <strong>Role Visibility:</strong> Logged in as <span className="font-semibold text-slate-900 dark:text-white">{currentUser?.name}</span> ({role}). Client-side role restrictions apply.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden md:inline">
          Educational Portfolio Demo
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, customer, subject, or UTR..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Customer Information">Awaiting Info</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-2">
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="lg:col-span-2">
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="priority_desc">Highest Priority</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Button */}
        {(searchQuery || filterStatus !== 'ALL' || filterCategory !== 'ALL' || filterPriority !== 'ALL' || sortBy !== 'date_desc') && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset active filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {paginatedComplaints.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No matching records found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Complaint ID</th>
                  <th className="py-3.5 px-4 font-semibold">Subject & Complainant</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Department</th>
                  <th className="py-3.5 px-4 font-semibold">Logged On</th>
                  <th className="py-3.5 px-4 font-semibold">Priority</th>
                  <th className="py-3.5 px-4 font-semibold">Current Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedComplaints.map((c) => {
                  const statusStyle = getStatusStyle(c.status);
                  const priorityStyle = getPriorityStyle(c.priority);
                  const sla = calculateSlaStatus(c);

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        <span
                          onClick={() => navigateToTrack(c.id)}
                          className="cursor-pointer hover:underline"
                        >
                          {c.id}
                        </span>
                      </td>

                      {/* Subject + Complainant */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div
                          onClick={() => navigateToTrack(c.id)}
                          className="font-semibold text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 transition-colors"
                        >
                          {c.subject}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate flex items-center gap-1.5">
                          <span>{c.customerName}</span>
                          <span>·</span>
                          <span className="font-mono">{c.transactionRef || 'No Ref'}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {c.category}
                      </td>

                      {/* Department & Officer */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">
                          {c.departmentName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {c.assignedStaffName || 'Unassigned'}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {formatShortDate(c.createdAt)}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={priorityStyle.badge}>
                          {c.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {c.status}
                        </span>
                        {/* SLA flag */}
                        <div className={`text-[10px] mt-1 ${sla.color}`}>
                          {sla.label}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigateToTrack(c.id)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors font-medium text-xs flex items-center gap-1"
                            title="View Timeline & Audit Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Track</span>
                          </button>

                          {(role === 'Bank Staff' || role === 'Administrator') && (
                            <button
                              onClick={() => setEditingComplaint(c)}
                              className="px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Update Status / Officer Assignment"
                            >
                              Update
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination & Page Size Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Showing{' '}
              <strong className="text-slate-900 dark:text-white font-mono">
                {sortedComplaints.length === 0 ? 0 : (currentPageNum - 1) * pageSize + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-900 dark:text-white font-mono">
                {Math.min(currentPageNum * pageSize, sortedComplaints.length)}
              </strong>{' '}
              of{' '}
              <strong className="text-slate-900 dark:text-white font-mono">
                {sortedComplaints.length}
              </strong>{' '}
              records
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPageNum(1);
                }}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPageNum(p => Math.max(p - 1, 1))}
              disabled={currentPageNum === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs tabular-nums">
              Page {currentPageNum} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPageNum(p => Math.min(p + 1, totalPages))}
              disabled={currentPageNum === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Transition Modal */}
      {editingComplaint && (
        <StatusUpdateModal
          isOpen={Boolean(editingComplaint)}
          onClose={() => setEditingComplaint(null)}
          complaint={editingComplaint}
        />
      )}
    </div>
  );
}
