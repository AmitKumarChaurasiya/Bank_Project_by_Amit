import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  ShieldCheck,
  User,
  Briefcase,
  Sliders,
  Lock,
  Mail,
  Sun,
  Moon,
  Info,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import ProjectInfoModal from '../common/ProjectInfoModal.jsx';

export default function LoginScreen() {
  const { loginWithRole, loginWithCustom, theme, toggleTheme } = useApp();
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'custom'
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customRole, setCustomRole] = useState('Customer');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [inputError, setInputError] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setInputError('Please enter a valid email address.');
      return;
    }
    if (!customPassword || customPassword.length < 4) {
      setInputError('Please enter any password with at least 4 characters.');
      return;
    }
    setInputError('');
    loginWithCustom(customEmail, customPassword, customRole);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            SB
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            SmartBank
          </span>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
            Complaint & Dispute Redressal Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Project Details</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 my-6">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand & Academic Overview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Banking Grievance Infrastructure</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Fast, transparent redressal for all banking disputes.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              SmartBank enables real-time transaction dispute logging, automated departmental routing, SLA monitoring, and chronological audit tracking for retail banking customers and grievance cells.
            </p>

            {/* Academic Credit Box */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Academic Project Showcase
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Amit Kumar · B.Tech Computer Science & Engineering
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Lloyd Institute of Engineering and Technology</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Client-Side Demo
              </span>
              <span>·</span>
              <span>Local Storage Persistence</span>
              <span>·</span>
              <span>Zero Backend Dependencies</span>
            </div>
          </div>

          {/* Right Column: Interactive Login Box */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Select Your Access Role
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Experience role-specific workflows for customers, officers, and administrators.
              </p>
            </div>

            {/* Role Cards for 1-Click Entry */}
            <div className="space-y-3">
              {/* Customer Role */}
              <button
                type="button"
                onClick={() => loginWithRole('customer')}
                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      Customer
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        (Rahul Sharma)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Register complaints, track timeline & reopen resolved tickets
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Staff Role */}
              <button
                type="button"
                onClick={() => loginWithRole('staff')}
                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      Bank Staff
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        (Priya Verma)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Investigate assigned disputes, update statuses & add remarks
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Admin Role */}
              <button
                type="button"
                onClick={() => loginWithRole('admin')}
                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      Administrator
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        (Rajesh Nair)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      System-wide analytics, department SLAs & officer assignments
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Custom Credentials Accordion */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'custom' ? 'demo' : 'custom')}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-between w-full"
              >
                <span>Or sign in with custom demo credentials</span>
                <span>{activeTab === 'custom' ? '▲ Hide' : '▼ Show'}</span>
              </button>

              {activeTab === 'custom' && (
                <form onSubmit={handleCustomSubmit} className="mt-4 space-y-3">
                  {inputError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                      {inputError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Role to Assume
                    </label>
                    <select
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Bank Staff">Bank Staff</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Demo Email
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="you@smartbank.demo"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Demo Password
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="password"
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
                  >
                    Enter Demo Session
                  </button>
                </form>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <Info className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
              <span>
                <strong>Educational Simulation:</strong> No actual monetary transactions or real customer bank accounts are accessed. Role restrictions are enforced via client-side demonstration logic.
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          SmartBank Banking Grievance System · Built by <strong className="text-slate-800 dark:text-slate-200">Amit Kumar</strong> (B.Tech CSE, LIET)
        </div>
        <div className="flex items-center gap-4">
          <span>React.js MERN Frontend Architecture</span>
          <span>·</span>
          <span>Local Demo Storage</span>
        </div>
      </footer>

      <ProjectInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
}
