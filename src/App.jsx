import React, { useState } from 'react';
import { useApp } from './context/AppContext.jsx';
import LoginScreen from './components/auth/LoginScreen.jsx';
import TopNavbar from './components/layout/TopNavbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import DashboardOverview from './components/dashboard/DashboardOverview.jsx';
import ComplaintList from './components/complaints/ComplaintList.jsx';
import ComplaintRegistration from './components/complaints/ComplaintRegistration.jsx';
import ComplaintTracking from './components/tracking/ComplaintTracking.jsx';
import NotificationCenter from './components/notifications/NotificationCenter.jsx';
import AdminAnalytics from './components/admin/AdminAnalytics.jsx';
import StaffDepartmentManagement from './components/admin/StaffDepartmentManagement.jsx';
import ToastContainer from './components/common/ToastContainer.jsx';

export default function App() {
  const { currentUser, currentPage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is not logged in, show polished Login & Demo Roles screen
  if (!currentUser) {
    return (
      <>
        <LoginScreen />
        <ToastContainer />
      </>
    );
  }

  // Active view router
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'complaints':
        return <ComplaintList />;
      case 'new-complaint':
        return <ComplaintRegistration />;
      case 'tracking':
        return <ComplaintTracking />;
      case 'notifications':
        return <NotificationCenter />;
      case 'admin-analytics':
        return <AdminAnalytics />;
      case 'staff-management':
        return <StaffDepartmentManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <TopNavbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Workspace with Sidebar and Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
}
