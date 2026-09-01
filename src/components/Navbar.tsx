import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Bell, 
  Database, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  Menu,
  Phone,
  Calendar,
  Layers,
  FileText,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { UserRole } from '../types';
import { isFirebaseActive } from '../lib/firebase';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAIModal: () => void;
  onOpenNewJob?: () => void;
  onOpenNewCustomer?: () => void;
  onOpenNewLead?: () => void;
  onOpenSettings?: () => void;
  onOpenFirebaseModal?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleMobileSidebar: () => void;
  pendingLeadsCount?: number;
  onSwitchToWebsite?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenAIModal,
  onOpenNewJob,
  onOpenNewCustomer,
  onOpenNewLead,
  onOpenSettings,
  onOpenFirebaseModal,
  searchQuery,
  onSearchChange,
  onToggleMobileSidebar,
  pendingLeadsCount = 0,
  onSwitchToWebsite
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const firebaseConnected = isFirebaseActive();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Left Section: Mobile Menu + Brand + Return to Website */}
        <div className="flex items-center gap-3">
          <button 
            id="mobile-sidebar-toggle"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo & Brand Wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-teal-700 text-white shadow-xs font-bold text-base tracking-tight">
              <span className="relative z-10 text-amber-200 font-serif">CC</span>
              <div className="absolute inset-0 rounded-xl bg-teal-400 opacity-20 animate-pulse"></div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                  Crisp<span className="text-teal-600">Cleaners</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-md">
                  CRM Operator
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block font-medium">
                crispcleaners.ca • Toronto Dispatch
              </span>
            </div>
          </div>

          {/* Return to Customer Website Button */}
          {onSwitchToWebsite && (
            <button
              onClick={onSwitchToWebsite}
              className="ml-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer"
              title="Return to Customer Facing Website"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>Customer Website</span>
            </button>
          )}
        </div>

        {/* Middle Section: Global Search */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="global-crm-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search customers, addresses, jobs, cleaner routes..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-xl transition-all outline-hidden text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Actions + Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI CRM Assistant Button */}
          <button
            id="open-ai-assistant-btn"
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
            title="Ask AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Crisp AI</span>
            <span className="px-1 py-0.2 bg-white/20 rounded-sm text-[10px]">Copilot</span>
          </button>

          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              id="quick-create-dropdown"
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs sm:text-sm font-semibold border border-teal-200 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Create</span>
            </button>

            {showQuickMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowQuickMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-sm">
                  {onOpenNewJob && (
                    <button
                      onClick={() => { setShowQuickMenu(false); onOpenNewJob(); }}
                      className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-2.5 font-medium cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-teal-600" />
                      New Job / Booking
                    </button>
                  )}
                  {onOpenNewCustomer && (
                    <button
                      onClick={() => { setShowQuickMenu(false); onOpenNewCustomer(); }}
                      className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-2.5 font-medium cursor-pointer"
                    >
                      <User className="w-4 h-4 text-teal-600" />
                      New Customer
                    </button>
                  )}
                  {onOpenNewLead && (
                    <button
                      onClick={() => { setShowQuickMenu(false); onOpenNewLead(); }}
                      className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-2.5 font-medium cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-teal-600" />
                      New Sales Lead
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Firebase Status Badge */}
          <button
            id="firebase-status-btn"
            onClick={onOpenSettings || onOpenFirebaseModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 cursor-pointer"
            title="Firebase & Storage Configuration"
          >
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden xl:inline text-[11px] font-medium">
              {firebaseConnected ? 'Firestore Live' : 'Local Sync'}
            </span>
            <div className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-500' : 'bg-teal-500'}`} />
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => onRoleChange('admin')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentRole === 'admin' 
                  ? 'bg-white text-teal-800 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Admin (Full Access)"
            >
              Admin
            </button>
            <button
              onClick={() => onRoleChange('staff')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentRole === 'staff' 
                  ? 'bg-white text-teal-800 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Office Staff"
            >
              Staff
            </button>
            <button
              onClick={() => onRoleChange('cleaner')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentRole === 'cleaner' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Field Cleaner View"
            >
              Cleaner
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
