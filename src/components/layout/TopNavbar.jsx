import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  GraduationCap,
  Shield,
  RotateCcw,
  Menu,
  ChevronDown,
  Check,
  Search,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import ProjectInfoModal from '../common/ProjectInfoModal.jsx';
import ConfirmationModal from '../common/ConfirmationModal.jsx';

export default function TopNavbar({ onToggleMobileMenu }) {
  const {
    currentUser,
    loginWithRole,
    logout,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    currentPage,
    setCurrentPage,
    navigateToTrack,
    resetDemoData,
    complaints
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [quickSearchResults, setQuickSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter unread notifications for current role
  const roleNotifications = notifications.filter(
    n => !n.targetRole || n.targetRole === currentUser?.role || currentUser?.role === 'Administrator'
  );
  const unreadCount = roleNotifications.filter(n => !n.read).length;

  // Live quick search handler
  const handleQuickSearch = (val) => {
    setQuickSearchQuery(val);
    if (!val.trim()) {
      setQuickSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = val.toLowerCase().trim();
    // Role filtered complaints
    let searchBase = complaints;
    if (currentUser?.role === 'Customer') {
      searchBase = complaints.filter(c => c.customerId === currentUser.id);
    } else if (currentUser?.role === 'Bank Staff') {
      searchBase = complaints.filter(
        c => c.departmentName === currentUser.department || c.assignedStaffId === currentUser.id
      );
    }

    const matched = searchBase.filter(
      c =>
        c.id.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        (c.transactionRef && c.transactionRef.toLowerCase().includes(query))
    ).slice(0, 5);

    setQuickSearchResults(matched);
    setShowSearchResults(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
        {/* Left: Mobile hamburger + Brand Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-sm group-hover:bg-blue-600 transition-colors">
              SB
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                SmartBank
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider">
                COMPLAINT PORTAL
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Complaint ID (e.g. SB-2026-1042) or subject..."
              value={quickSearchQuery}
              onChange={(e) => handleQuickSearch(e.target.value)}
              onFocus={() => {
                if (quickSearchQuery.trim()) setShowSearchResults(true);
              }}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-all"
            />
          </div>

          {/* Quick Search Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                Matching Complaints ({quickSearchResults.length})
              </div>
              {quickSearchResults.length === 0 ? (
                <div className="p-3 text-xs text-slate-500 text-center">
                  No records match "{quickSearchQuery}"
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {quickSearchResults.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigateToTrack(item.id);
                        setShowSearchResults(false);
                        setQuickSearchQuery('');
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-blue-600 dark:text-blue-400 font-mono">
                          {item.id}
                        </div>
                        <div className="text-slate-700 dark:text-slate-300 truncate max-w-xs font-normal">
                          {item.subject}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {item.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* File Complaint Primary Button (Quick Action) */}
          {currentUser?.role === 'Customer' && (
            <button
              onClick={() => setCurrentPage('new-complaint')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>File Complaint</span>
            </button>
          )}

          {/* Student Info Button */}
          <button
            onClick={() => setShowProjectModal(true)}
            title="Student & Project Details"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden lg:inline">Amit Kumar</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {roleNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    roleNotifications.slice(0, 6).map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          markNotificationRead(item.id);
                          if (item.complaintId) {
                            navigateToTrack(item.complaintId);
                            setShowNotifMenu(false);
                          }
                        }}
                        className={`p-3.5 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                          !item.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-semibold ${!item.read ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                            {item.title}
                          </span>
                          {!item.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-900">
                  <button
                    onClick={() => {
                      setCurrentPage('notifications');
                      setShowNotifMenu(false);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Open Notification Center →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                {currentUser?.avatarInitials || 'U'}
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                  {currentUser?.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                {/* User Summary */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {currentUser?.name}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentUser?.email}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    <Shield className="w-3 h-3 text-blue-500" />
                    Role: {currentUser?.role}
                  </div>
                </div>

                {/* Fast Switch Role Picker */}
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Switch Demo Persona
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        loginWithRole('customer');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        currentUser?.role === 'Customer'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>1. Customer (Rahul)</span>
                      {currentUser?.role === 'Customer' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        loginWithRole('staff');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        currentUser?.role === 'Bank Staff'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>2. Staff (Priya)</span>
                      {currentUser?.role === 'Bank Staff' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        loginWithRole('admin');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        currentUser?.role === 'Administrator'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>3. Admin (Rajesh)</span>
                      {currentUser?.role === 'Administrator' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Action Items */}
                <div className="pt-1 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowResetConfirm(true);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reset Demo Data</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <ProjectInfoModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />

      <ConfirmationModal
        isOpen={showResetConfirm}
        title="Reset Demo Environment?"
        message="This will restore all sample complaints, staff profiles, activities, and notifications to their default demo state. Any custom complaints created during this session will be reverted."
        confirmText="Reset to Initial Data"
        cancelText="Cancel"
        type="warning"
        onConfirm={() => {
          resetDemoData();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}
