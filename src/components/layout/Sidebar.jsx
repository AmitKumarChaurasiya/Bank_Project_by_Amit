import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Search,
  Bell,
  BarChart3,
  Users2,
  Building,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  X
} from 'lucide-react';

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const {
    currentUser,
    currentPage,
    setCurrentPage,
    notifications,
    complaints
  } = useApp();

  const role = currentUser?.role || 'Customer';

  // Compute badge counts
  let userComplaintsCount = complaints.length;
  if (role === 'Customer') {
    userComplaintsCount = complaints.filter(c => c.customerId === currentUser?.id).length;
  } else if (role === 'Bank Staff') {
    userComplaintsCount = complaints.filter(
      c => c.departmentName === currentUser?.department || c.assignedStaffId === currentUser?.id
    ).length;
  }

  const roleNotifications = notifications.filter(
    n => !n.targetRole || n.targetRole === role || role === 'Administrator'
  );
  const unreadNotifCount = roleNotifications.filter(n => !n.read).length;

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    if (onCloseMobile) onCloseMobile();
  };

  // Nav Items definition
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['Customer', 'Bank Staff', 'Administrator']
    },
    {
      id: 'complaints',
      label: role === 'Customer' ? 'My Complaints' : 'Complaint Records',
      icon: FileText,
      badge: userComplaintsCount,
      roles: ['Customer', 'Bank Staff', 'Administrator']
    },
    {
      id: 'new-complaint',
      label: 'Register Complaint',
      icon: PlusCircle,
      highlight: true,
      roles: ['Customer', 'Bank Staff', 'Administrator']
    },
    {
      id: 'tracking',
      label: 'Track Status',
      icon: Search,
      roles: ['Customer', 'Bank Staff', 'Administrator']
    },
    {
      id: 'notifications',
      label: 'Notification Center',
      icon: Bell,
      badge: unreadNotifCount > 0 ? unreadNotifCount : null,
      roles: ['Customer', 'Bank Staff', 'Administrator']
    },
    // Admin only pages
    {
      id: 'admin-analytics',
      label: 'Admin Intelligence',
      icon: BarChart3,
      roles: ['Administrator']
    },
    {
      id: 'staff-management',
      label: 'Staff & Departments',
      icon: Users2,
      roles: ['Administrator']
    }
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role));

  const content = (
    <aside className="w-64 h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 select-none">
      <div className="space-y-6">
        {/* Brand / Logo section */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black text-sm tracking-tight shadow-md">
              SB
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                SmartBank
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Grievance Engine
              </div>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current Active Role Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Session
            </span>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {role}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1 truncate">
            {currentUser?.name}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {currentUser?.department || currentUser?.branch || currentUser?.accountNumber}
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Main Navigation
          </div>
          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Academic Footer Tag */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Amit Kumar</span>
          </div>
          <div className="text-slate-600 dark:text-slate-400 leading-snug">
            B.Tech CSE · Lloyd Institute of Engineering & Technology
          </div>
        </div>

        <div className="px-1 text-[10px] text-slate-400 text-center">
          Simulation Portal · Local Demo Data
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <div className="hidden md:block shrink-0 h-screen sticky top-0 z-20">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 max-w-xs h-full bg-white dark:bg-slate-900 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
