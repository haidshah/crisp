import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Sparkles, 
  Users, 
  UserCheck, 
  Receipt, 
  Layers, 
  Globe, 
  Star, 
  Smartphone, 
  Settings, 
  Briefcase,
  ChevronRight,
  ShieldAlert,
  Headphones,
  Mail
} from 'lucide-react';
import { UserRole } from '../types';

export type TabType = 
  | 'dashboard'
  | 'calendar'
  | 'jobs'
  | 'customers'
  | 'cleaners'
  | 'invoicing'
  | 'leads'
  | 'partners'
  | 'website-form'
  | 'feedback'
  | 'field-app'
  | 'smtp-settings'
  | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentRole: UserRole;
  leadCount: number;
  partnerAppCount?: number;
  overdueInvoiceCount: number;
  todayJobCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  currentRole,
  leadCount,
  partnerAppCount = 0,
  overdueInvoiceCount,
  todayJobCount,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, roles: ['admin', 'staff'] },
    { id: 'calendar', label: 'Calendar & Dispatch', icon: CalendarDays, badge: todayJobCount > 0 ? `${todayJobCount} today` : null, badgeColor: 'bg-teal-100 text-teal-800', roles: ['admin', 'staff'] },
    { id: 'jobs', label: 'Jobs & Bookings', icon: Briefcase, badge: null, roles: ['admin', 'staff'] },
    { id: 'customers', label: 'Customers', icon: Users, badge: null, roles: ['admin', 'staff'] },
    { id: 'cleaners', label: 'Cleaners & Team', icon: UserCheck, badge: null, roles: ['admin', 'staff'] },
    { id: 'invoicing', label: 'Invoices & Payments', icon: Receipt, badge: overdueInvoiceCount > 0 ? `${overdueInvoiceCount} due` : null, badgeColor: 'bg-amber-100 text-amber-800', roles: ['admin', 'staff'] },
    { id: 'leads', label: 'Leads Pipeline', icon: Layers, badge: leadCount > 0 ? `${leadCount} new` : null, badgeColor: 'bg-teal-600 text-white', roles: ['admin', 'staff'] },
    { id: 'partners', label: 'Partner Program & Regions', icon: Sparkles, badge: partnerAppCount > 0 ? `${partnerAppCount} apps` : 'Regions', badgeColor: 'bg-amber-500 text-white', roles: ['admin', 'staff'] },
    { id: 'website-form', label: 'Customer Booking Widget', icon: Globe, badge: 'Live View', badgeColor: 'bg-emerald-100 text-emerald-800', roles: ['admin', 'staff'] },
    { id: 'feedback', label: 'Reviews & Quality AI', icon: Star, badge: 'AI Report', badgeColor: 'bg-cyan-100 text-cyan-800', roles: ['admin', 'staff'] },
    { id: 'field-app', label: 'Cleaner Field Portal', icon: Smartphone, badge: 'Field View', badgeColor: 'bg-teal-500 text-white', roles: ['admin', 'cleaner', 'staff'] },
    { id: 'smtp-settings', label: 'Email & SMTP Config', icon: Mail, badge: 'Live Server', badgeColor: 'bg-teal-100 text-teal-800', roles: ['admin'] },
    { id: 'settings', label: 'Firebase & Settings', icon: Settings, badge: null, roles: ['admin'] },
  ];

  // Filter items visible to current role
  const visibleItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 md:top-[57px] left-0 h-screen md:h-[calc(100vh-57px)] w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Active Role Indicator */}
          <div className="mb-4 p-3 bg-linear-to-r from-teal-50 to-cyan-50 border border-teal-100/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {currentRole === 'admin' ? 'AD' : currentRole === 'staff' ? 'OF' : 'CL'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 capitalize">
                  {currentRole === 'admin' ? 'Admin Operator' : currentRole === 'staff' ? 'Office Dispatch' : 'Field Cleaner'}
                </p>
                <p className="text-[11px] text-teal-700">
                  {currentRole === 'cleaner' ? 'Sarah Tremblay' : 'Toronto Main Office'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operations & CRM
            </p>
            {visibleItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => {
                    onTabChange(item.id as TabType);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive 
                      ? 'bg-teal-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info & Subdomain target */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Domain target</span>
            <span className="font-semibold text-teal-700">app.crispcleaners.ca</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
            <span>Gemini 2.5 Flash</span>
            <span>•</span>
            <span className="text-teal-600 font-medium">Ready</span>
          </div>
        </div>
      </aside>
    </>
  );
};
