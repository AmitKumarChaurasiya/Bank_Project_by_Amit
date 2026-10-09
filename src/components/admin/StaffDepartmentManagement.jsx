import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Users2,
  Building,
  PlusCircle,
  Edit2,
  CheckCircle,
  X,
  Mail,
  Phone,
  Briefcase,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function StaffDepartmentManagement() {
  const { staff, departments, complaints, addStaffMember, updateStaffMember } = useApp();

  const [activeTab, setActiveTab] = useState('staff'); // 'staff' | 'departments'
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // New staff form state
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Grievance Officer');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('+91 ');
  const [staffDeptId, setStaffDeptId] = useState(departments[0]?.id || '');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingStaff(null);
    setStaffName('');
    setStaffRole('Grievance Officer');
    setStaffEmail('');
    setStaffPhone('+91 ');
    setStaffDeptId(departments[0]?.id || '');
    setFormError('');
    setShowAddStaffModal(true);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setStaffName(member.name);
    setStaffRole(member.role);
    setStaffEmail(member.email);
    setStaffPhone(member.phone || '+91 ');
    setStaffDeptId(member.departmentId);
    setFormError('');
    setShowAddStaffModal(true);
  };

  const handleStaffFormSubmit = (e) => {
    e.preventDefault();
    if (!staffName.trim()) {
      setFormError('Staff name is required.');
      return;
    }
    if (!staffEmail.trim() || !staffEmail.includes('@')) {
      setFormError('A valid official email is required.');
      return;
    }

    const selectedDept = departments.find(d => d.id === staffDeptId) || departments[0];

    if (editingStaff) {
      updateStaffMember(editingStaff.id, {
        name: staffName.trim(),
        role: staffRole.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim(),
        departmentId: selectedDept.id,
        departmentName: selectedDept.name
      });
    } else {
      addStaffMember({
        name: staffName.trim(),
        role: staffRole.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim(),
        departmentId: selectedDept.id,
        departmentName: selectedDept.name
      });
    }

    setShowAddStaffModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Staff & Department Directory
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold">
              Admin Console
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage demo grievance officers, configure redressal departments, and review case allotments.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Demo Staff</span>
        </button>
      </div>

      {/* Local Simulation Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <span>
          <strong>Demo Administration Note:</strong> Changes made here operate directly on browser local storage. These records emulate bank personnel directory structures without creating live employee database accounts.
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'staff'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>Officers & Staff ({staff.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'departments'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Departments ({departments.length})</span>
        </button>
      </div>

      {/* Tab 1: Staff Directory */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => {
            const assignedTickets = complaints.filter(c => c.assignedStaffId === member.id);
            const activeCount = assignedTickets.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                        {member.role}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {member.status || 'Active'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {member.departmentName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Active Cases: <strong className="font-mono text-slate-900 dark:text-white">{activeCount}</strong>
                  </div>
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Departments Directory */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => {
            const deptComplaints = complaints.filter(c => c.departmentId === dept.id);
            const activeDisputes = deptComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;

            return (
              <div
                key={dept.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {dept.code}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {dept.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    SLA: {dept.slaHours}h
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {dept.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    Department Head: <strong className="text-slate-800 dark:text-slate-200">{dept.head}</strong>
                  </div>
                  <div>
                    Active Disputes: <strong className="font-mono text-blue-600 dark:text-blue-400">{activeDisputes}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setShowAddStaffModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {editingStaff ? 'Edit Staff Profile' : 'Add Demo Grievance Officer'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure personnel attributes for internal dispute routing.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleStaffFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  placeholder="e.g. Senior Dispute Specialist"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Assigned Department
                </label>
                <select
                  value={staffDeptId}
                  onChange={(e) => setStaffDeptId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Official Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="officer@smartbank.demo"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Desk Contact Phone
                </label>
                <input
                  type="text"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  {editingStaff ? 'Save Changes' : 'Create Officer Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
