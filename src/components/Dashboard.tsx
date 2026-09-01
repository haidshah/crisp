import React from 'react';
import { 
  Briefcase, 
  DollarSign, 
  UserCheck, 
  AlertCircle, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Send, 
  Phone, 
  Star,
  Zap,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { Customer, Job, Cleaner, Invoice, Lead } from '../types';

interface DashboardProps {
  jobs: Job[];
  customers: Customer[];
  cleaners: Cleaner[];
  invoices: Invoice[];
  leads: Lead[];
  onNavigateTab: (tab: any) => void;
  onOpenNewJob: () => void;
  onOpenSmartScheduling: () => void;
  onOpenAIModal: () => void;
  onOpenSmartNotes: (job: Job) => void;
  onOpenCustomerComm: (job: Job, type: 'confirmation' | 'reminder' | 'review_request') => void;
  onSelectLead: (lead: Lead) => void;
  onUpdateJobStatus: (jobId: string, status: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  jobs,
  customers,
  cleaners,
  invoices,
  leads,
  onNavigateTab,
  onOpenNewJob,
  onOpenSmartScheduling,
  onOpenAIModal,
  onOpenSmartNotes,
  onOpenCustomerComm,
  onSelectLead,
  onUpdateJobStatus
}) => {
  // Calculations
  const today = '2026-08-25'; // Fixed anchor or current day
  const todayJobs = jobs.filter(j => j.date === today || j.status === 'in_progress');
  const completedTodayCount = todayJobs.filter(j => j.status === 'completed').length;
  const inProgressTodayCount = todayJobs.filter(j => j.status === 'in_progress').length;

  const totalPaidRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const pendingRevenue = invoices
    .filter(i => i.status === 'unpaid' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0);

  const overdueInvoices = invoices.filter(i => i.status === 'overdue');
  const newLeads = leads.filter(l => l.status === 'new' || l.status === 'qualified');
  const activeCleaners = cleaners.filter(c => c.status === 'available' || c.status === 'on_job');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome & AI Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-teal-900 via-teal-800 to-cyan-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-teal-500/30 text-teal-200 border border-teal-400/30 rounded-full text-xs font-semibold">
              Live Operations
            </span>
            <span className="text-teal-200 text-xs font-medium">
              Tuesday, August 25, 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Crisp Cleaners Command Hub
          </h1>
          <p className="text-teal-100/80 text-sm max-w-xl">
            {todayJobs.length} active jobs scheduled today across Downtown Toronto & North York. AI Dispatch and lead scoring active.
          </p>
        </div>

        {/* Action Buttons in Banner */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            id="dash-smart-scheduling-btn"
            onClick={onOpenSmartScheduling}
            className="flex items-center gap-2 px-3.5 py-2 bg-teal-500/30 hover:bg-teal-500/40 text-teal-100 border border-teal-300/30 rounded-xl text-xs font-semibold backdrop-blur-xs transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            AI Route Optimizer
          </button>
          <button
            id="dash-ai-copilot-btn"
            onClick={onOpenAIModal}
            className="flex items-center gap-2 px-4 py-2 bg-white text-teal-900 hover:bg-teal-50 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            Ask Crisp AI
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-400/20 to-transparent pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Today's Jobs */}
        <div 
          onClick={() => onNavigateTab('calendar')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Jobs</span>
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{todayJobs.length}</span>
            <span className="text-xs text-slate-500">
              ({completedTodayCount} done, {inProgressTodayCount} in progress)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-teal-700 font-medium">
            <span>View timeline</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div 
          onClick={() => onNavigateTab('invoicing')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Collected Revenue</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">${totalPaidRevenue.toFixed(2)}</span>
            <span className="text-xs text-emerald-600 font-semibold">+13% HST incl.</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>${pendingRevenue.toFixed(2)} pending</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Active Cleaners */}
        <div 
          onClick={() => onNavigateTab('cleaners')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Field Cleaners</span>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeCleaners.length} / {cleaners.length}</span>
            <span className="text-xs text-teal-600 font-semibold">On Duty</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-sky-700 font-medium">
            <span>Avg Rating 4.9 ★</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Leads & Overdue Invoices */}
        <div 
          onClick={() => onNavigateTab('leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pipeline & Alerts</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{newLeads.length} Leads</span>
            {overdueInvoices.length > 0 && (
              <span className="text-xs text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-sm">
                {overdueInvoices.length} Overdue
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-amber-800 font-medium">
            <span>AI Scored & prioritized</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Today's Schedule & Job Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Jobs Section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Today's Service Schedule
                </h2>
                <p className="text-xs text-slate-500">Real-time status updates & cleaner dispatch</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenNewJob}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  + Book Job
                </button>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-3">
              {todayJobs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No jobs currently active today. Click "+ Book Job" to schedule one.
                </div>
              ) : (
                todayJobs.map(job => {
                  const isDone = job.status === 'completed';
                  const isInProgress = job.status === 'in_progress';

                  return (
                    <div 
                      key={job.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isInProgress 
                          ? 'border-teal-300 bg-teal-50/40 shadow-xs' 
                          : isDone 
                          ? 'border-emerald-200 bg-emerald-50/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Time + Customer + Address */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-md font-mono">
                              {job.time}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{job.customerName}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                              job.serviceType === 'deep_clean' 
                                ? 'bg-amber-100 text-amber-800' 
                                : job.serviceType === 'commercial' 
                                ? 'bg-sky-100 text-sky-800' 
                                : 'bg-teal-100 text-teal-800'
                            }`}>
                              {job.serviceType.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{job.customerAddress}</span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                            <span className="font-semibold text-teal-800">
                              Cleaners: {job.assignedCleanerNames.join(', ') || 'Unassigned'}
                            </span>
                            <span>•</span>
                            <span>${job.price.toFixed(2)} CAD</span>
                            <span>•</span>
                            <span>{job.durationHours} hrs</span>
                          </div>
                        </div>

                        {/* Status Controls & Quick Actions */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:self-center">
                          {job.status === 'scheduled' && (
                            <button
                              onClick={() => onUpdateJobStatus(job.id, 'in_progress')}
                              className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                            >
                              Start Job
                            </button>
                          )}

                          {job.status === 'in_progress' && (
                            <button
                              onClick={() => onUpdateJobStatus(job.id, 'completed')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Mark Done
                            </button>
                          )}

                          {/* Smart Notes button */}
                          <button
                            onClick={() => onOpenSmartNotes(job)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-xs font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                            title="AI Smart Notes cleaner"
                          >
                            <Sparkles className="w-3 h-3 text-teal-600" />
                            Smart Notes
                          </button>

                          {/* Customer Comm button */}
                          <button
                            onClick={() => onOpenCustomerComm(job, 'reminder')}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-xs font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                            title="Send Automated Reminder/SMS"
                          >
                            <Send className="w-3 h-3 text-cyan-600" />
                            Notify
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Overdue Invoices Alert Section */}
          {overdueInvoices.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-amber-950">
                    Overdue Invoices Requiring Follow-up ({overdueInvoices.length})
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateTab('invoicing')}
                  className="text-xs font-bold text-amber-900 hover:underline"
                >
                  Manage All Invoices →
                </button>
              </div>

              <div className="space-y-2">
                {overdueInvoices.map(inv => (
                  <div key={inv.id} className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{inv.customerName}</span>
                      <span className="text-slate-500 ml-2 font-mono">{inv.invoiceNumber}</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">Due: {inv.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-700 text-sm">${inv.total.toFixed(2)}</p>
                      <button 
                        onClick={() => onNavigateTab('invoicing')}
                        className="text-[11px] font-semibold text-teal-700 hover:underline"
                      >
                        Send AI Reminder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: AI Lead Pipeline & Quick Actions */}
        <div className="space-y-6">
          {/* Incoming Leads with AI Scores */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  High-Priority Leads
                </h3>
                <p className="text-xs text-slate-500">Auto-qualified by Gemini AI</p>
              </div>
              <button
                onClick={() => onNavigateTab('leads')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                View Pipeline →
              </button>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 3).map(lead => (
                <div 
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="p-3 bg-slate-50 hover:bg-teal-50/40 border border-slate-200 hover:border-teal-200 rounded-xl transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{lead.name}</span>
                    {lead.aiScore && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        lead.aiScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        AI Score: {lead.aiScore}/100
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-1 mt-1 font-medium">
                    {lead.serviceRequested.replace('_', ' ')} • {lead.city}
                  </p>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 italic">
                    "{lead.message}"
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                    <span className="font-semibold text-teal-800">
                      Est. ${lead.estimatedValue} CAD
                    </span>
                    <span className="text-teal-600 font-bold hover:underline">
                      Review AI Reply →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cleaners on Duty Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-teal-600" />
                Cleaners on Duty
              </h3>
              <button
                onClick={() => onNavigateTab('cleaners')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                Team Details →
              </button>
            </div>

            <div className="space-y-2.5">
              {cleaners.map(cleaner => (
                <div key={cleaner.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={cleaner.avatar} 
                      alt={cleaner.name} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{cleaner.name}</p>
                      <p className="text-[10px] text-slate-500">{cleaner.serviceZones[0]}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    cleaner.status === 'on_job' 
                      ? 'bg-teal-100 text-teal-800' 
                      : cleaner.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cleaner.status === 'on_job' ? 'On Job' : cleaner.status === 'available' ? 'Available' : 'Off Duty'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
