import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_COMPLAINTS,
  INITIAL_DEPARTMENTS,
  INITIAL_STAFF,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  DEMO_USERS
} from '../data/initialData.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('smartbank_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Current User session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('smartbank_user');
      if (saved) return JSON.parse(saved);
      return DEMO_USERS.customer;
    } catch {
      return DEMO_USERS.customer;
    }
  });

  // Complaints state
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem('smartbank_complaints');
      if (saved) return JSON.parse(saved);
      return INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  // Departments state
  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem('smartbank_departments');
      if (saved) return JSON.parse(saved);
      return INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  });

  // Staff state
  const [staff, setStaff] = useState(() => {
    try {
      const saved = localStorage.getItem('smartbank_staff');
      if (saved) return JSON.parse(saved);
      return INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // Activity feed state
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('smartbank_activities');
      if (saved) return JSON.parse(saved);
      return INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('smartbank_notifications');
      if (saved) return JSON.parse(saved);
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Global Toast state
  const [toasts, setToasts] = useState([]);

  // Active view page routing: 'dashboard' | 'complaints' | 'new-complaint' | 'tracking' | 'notifications' | 'admin-analytics' | 'staff-management'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [trackingSelectedId, setTrackingSelectedId] = useState(null);

  // Sync theme with DOM
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('smartbank_theme', theme);
    } catch (e) {
      console.error('Failed to sync theme', e);
    }
  }, [theme]);

  // Persist storage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('smartbank_complaints', JSON.stringify(complaints));
    } catch (e) {
      console.error('Storage quota or error', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem('smartbank_departments', JSON.stringify(departments));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [departments]);

  useEffect(() => {
    try {
      localStorage.setItem('smartbank_staff', JSON.stringify(staff));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [staff]);

  useEffect(() => {
    try {
      localStorage.setItem('smartbank_activities', JSON.stringify(activities));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem('smartbank_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('smartbank_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('smartbank_user');
      }
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [currentUser]);

  // Toast notification helper
  const showToast = (toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const newToast = { id, type: 'info', duration: 4000, ...toast };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, newToast.duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Authentication & Demo role switching
  const loginWithRole = (roleKey) => {
    const user = DEMO_USERS[roleKey];
    if (user) {
      setCurrentUser(user);
      showToast({
        type: 'success',
        title: `Switched to ${user.role} Portal`,
        message: `Logged in as ${user.name} (${user.role})`
      });
    }
  };

  const loginWithCustom = (email, password, role) => {
    let base = DEMO_USERS.customer;
    if (role === 'Bank Staff') base = DEMO_USERS.staff;
    if (role === 'Administrator') base = DEMO_USERS.admin;

    const user = {
      ...base,
      email: email || base.email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase() || base.name,
      role: role || base.role
    };

    setCurrentUser(user);
    showToast({
      type: 'success',
      title: 'Demo Authentication Successful',
      message: `Signed in as ${user.name} (${user.role})`
    });
  };

  const logout = () => {
    setCurrentUser(null);
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely signed out from SmartBank.'
    });
  };

  // Duplicate complaint checker
  const checkDuplicateComplaint = (transactionRef) => {
    if (!transactionRef || !transactionRef.trim()) return null;
    const cleanRef = transactionRef.trim().toUpperCase();
    return complaints.find(
      c =>
        c.transactionRef &&
        c.transactionRef.toUpperCase() === cleanRef &&
        c.status !== 'Closed' &&
        c.status !== 'Resolved'
    );
  };

  // Add new complaint
  const addComplaint = (formData) => {
    const timestamp = new Date().toISOString();
    // Unique ID generation SB-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `SB-2026-${randomSuffix}`;

    const dept = departments.find(d => d.id === formData.departmentId) || departments[0];

    // Pick an available staff member in that department or default
    const assignedStaff = staff.find(s => s.departmentId === dept.id) || staff[0];

    // Compute SLA deadline
    const slaDeadlineDate = new Date();
    slaDeadlineDate.setHours(slaDeadlineDate.getHours() + (dept.slaHours || 48));

    const newRecord = {
      id: newId,
      customerId: currentUser?.id || 'usr-cust-1',
      customerName: currentUser?.name || 'Rahul Sharma',
      customerEmail: currentUser?.email || 'customer@smartbank.demo',
      customerPhone: currentUser?.phone || '+91 98765 43210',
      accountNumber: currentUser?.accountNumber || '•••• •••• •••• 4092',
      category: formData.category,
      subject: formData.subject,
      description: formData.description,
      transactionRef: formData.transactionRef?.trim() || '',
      transactionDate: formData.transactionDate || '',
      transactionAmount: formData.transactionAmount || '',
      priority: formData.priority || 'Normal',
      departmentId: dept.id,
      departmentName: dept.name,
      assignedStaffId: assignedStaff.id,
      assignedStaffName: assignedStaff.name,
      status: 'Submitted',
      createdAt: timestamp,
      updatedAt: timestamp,
      slaDeadline: slaDeadlineDate.toISOString(),
      resolutionRemarks: '',
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          status: 'Submitted',
          actor: `${currentUser?.name || 'Customer'} (Customer)`,
          timestamp: timestamp,
          note: `Grievance registered. Automated tracking reference ${newId} allocated.`
        }
      ]
    };

    setComplaints(prev => [newRecord, ...prev]);

    // Activity entry
    const newActivity = {
      id: `act-${Date.now()}`,
      complaintId: newId,
      actorName: currentUser?.name || 'Customer',
      role: currentUser?.role || 'Customer',
      action: 'Registered complaint',
      detail: `${formData.category}: ${formData.subject.substring(0, 45)}...`,
      timestamp: timestamp
    };
    setActivities(prev => [newActivity, ...prev]);

    // Notification for customer and staff
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: 'Complaint Registered Successfully',
      message: `Reference ${newId} has been acknowledged. Assigned to ${dept.name} with SLA of ${dept.slaHours} hours.`,
      complaintId: newId,
      targetRole: 'Customer',
      read: false,
      timestamp: timestamp,
      type: 'submission'
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast({
      type: 'success',
      title: 'Complaint Registered!',
      message: `Complaint ${newId} created. You can track its live progress anytime.`
    });

    return newRecord;
  };

  // Update complaint status
  const updateComplaintStatus = (complaintId, newStatus, remarks, reassignedStaffId) => {
    const timestamp = new Date().toISOString();
    let updatedRecord = null;

    setComplaints(prev =>
      prev.map(item => {
        if (item.id !== complaintId) return item;

        let staffName = item.assignedStaffName;
        let staffId = item.assignedStaffId;

        if (reassignedStaffId) {
          const found = staff.find(s => s.id === reassignedStaffId);
          if (found) {
            staffName = found.name;
            staffId = found.id;
          }
        }

        const newTimelineEntry = {
          id: `t-${Date.now()}`,
          status: newStatus,
          actor: `${currentUser?.name || 'Bank Staff'} (${currentUser?.role || 'Staff'})`,
          timestamp: timestamp,
          note: remarks || `Status transitioned to ${newStatus}.`
        };

        updatedRecord = {
          ...item,
          status: newStatus,
          updatedAt: timestamp,
          assignedStaffId: staffId,
          assignedStaffName: staffName,
          resolutionRemarks:
            newStatus === 'Resolved' || newStatus === 'Closed'
              ? remarks || item.resolutionRemarks
              : item.resolutionRemarks,
          timeline: [...item.timeline, newTimelineEntry]
        };

        return updatedRecord;
      })
    );

    // Activity entry
    const newActivity = {
      id: `act-${Date.now()}`,
      complaintId: complaintId,
      actorName: currentUser?.name || 'Staff',
      role: currentUser?.role || 'Staff',
      action: `Updated status to ${newStatus}`,
      detail: remarks ? (remarks.length > 50 ? remarks.substring(0, 50) + '...' : remarks) : `Marked as ${newStatus}`,
      timestamp: timestamp
    };
    setActivities(prev => [newActivity, ...prev]);

    // Push notification to Customer
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: newStatus === 'Resolved' ? 'Complaint Resolved' : `Status Updated: ${newStatus}`,
      message: `Complaint ${complaintId} status changed to ${newStatus}. Note: ${remarks || 'No remarks provided.'}`,
      complaintId: complaintId,
      targetRole: 'Customer',
      read: false,
      timestamp: timestamp,
      type: newStatus === 'Resolved' ? 'resolved' : 'status_update'
    };
    setNotifications(prev => [newNotification, ...prev]);

    if (newStatus === 'Resolved') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }

    showToast({
      type: 'success',
      title: 'Status Updated',
      message: `Complaint ${complaintId} is now "${newStatus}".`
    });

    return updatedRecord;
  };

  // Customer requests ticket reopening
  const requestReopenComplaint = (complaintId, reason) => {
    const timestamp = new Date().toISOString();

    setComplaints(prev =>
      prev.map(item => {
        if (item.id !== complaintId) return item;

        const reopenEntry = {
          id: `t-${Date.now()}`,
          status: 'Reopened',
          actor: `${currentUser?.name || 'Customer'} (Customer)`,
          timestamp: timestamp,
          note: `Customer reopened ticket: ${reason}`
        };

        return {
          ...item,
          status: 'Reopened',
          updatedAt: timestamp,
          timeline: [...item.timeline, reopenEntry]
        };
      })
    );

    const newActivity = {
      id: `act-${Date.now()}`,
      complaintId: complaintId,
      actorName: currentUser?.name || 'Customer',
      role: 'Customer',
      action: 'Reopened complaint',
      detail: reason,
      timestamp: timestamp
    };
    setActivities(prev => [newActivity, ...prev]);

    const newNotification = {
      id: `notif-${Date.now()}`,
      title: 'Customer Requested Ticket Reopening',
      message: `Complaint ${complaintId} was reopened by customer with note: "${reason}"`,
      complaintId: complaintId,
      targetRole: 'Bank Staff',
      read: false,
      timestamp: timestamp,
      type: 'status_update'
    };
    setNotifications(prev => [newNotification, ...prev]);

    showToast({
      type: 'warning',
      title: 'Complaint Reopened',
      message: `Grievance officer has been alerted for further investigation.`
    });
  };

  // Staff management
  const addStaffMember = (newStaff) => {
    const id = `staff-${Date.now()}`;
    const record = {
      ...newStaff,
      id,
      activeComplaints: 0,
      resolvedCount: 0,
      status: 'Active'
    };
    setStaff(prev => [...prev, record]);
    showToast({
      type: 'success',
      title: 'Staff Member Added',
      message: `${record.name} was successfully registered under ${record.departmentName}.`
    });
  };

  const updateStaffMember = (id, updatedFields) => {
    setStaff(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast({
      type: 'success',
      title: 'Staff Updated',
      message: `Staff record has been saved.`
    });
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.'
    });
  };

  // Reset demo data
  const resetDemoData = () => {
    try {
      localStorage.removeItem('smartbank_complaints');
      localStorage.removeItem('smartbank_departments');
      localStorage.removeItem('smartbank_staff');
      localStorage.removeItem('smartbank_activities');
      localStorage.removeItem('smartbank_notifications');
      localStorage.removeItem('smartbank_user');

      setComplaints(INITIAL_COMPLAINTS);
      setDepartments(INITIAL_DEPARTMENTS);
      setStaff(INITIAL_STAFF);
      setActivities(INITIAL_ACTIVITIES);
      setNotifications(INITIAL_NOTIFICATIONS);
      setCurrentUser(DEMO_USERS.customer);
      setCurrentPage('dashboard');

      showToast({
        type: 'info',
        title: 'Demo Environment Reset',
        message: 'All demo data restored to initial factory seed records.'
      });
    } catch (e) {
      console.error('Reset error', e);
    }
  };

  // Quick navigation helper to track a specific complaint
  const navigateToTrack = (complaintId) => {
    setTrackingSelectedId(complaintId);
    setCurrentPage('tracking');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        loginWithRole,
        loginWithCustom,
        logout,
        complaints,
        departments,
        staff,
        activities,
        notifications,
        toasts,
        showToast,
        removeToast,
        currentPage,
        setCurrentPage,
        trackingSelectedId,
        setTrackingSelectedId,
        navigateToTrack,
        addComplaint,
        updateComplaintStatus,
        requestReopenComplaint,
        addStaffMember,
        updateStaffMember,
        markNotificationRead,
        markAllNotificationsRead,
        checkDuplicateComplaint,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
