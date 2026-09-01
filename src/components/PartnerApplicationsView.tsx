import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Truck, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  Mail, 
  DollarSign, 
  Award, 
  ChevronRight,
  Plus,
  Lock,
  Unlock,
  Building2,
  Trash2
} from 'lucide-react';
import { PartnerApplication, RegionTerritory, Cleaner } from '../types';

interface PartnerApplicationsViewProps {
  applications: PartnerApplication[];
  regions: RegionTerritory[];
  cleaners: Cleaner[];
  onSaveApplication: (app: PartnerApplication) => void;
  onDeleteApplication: (id: string) => void;
  onSaveRegion: (region: RegionTerritory) => void;
  onConvertToCleaner: (app: PartnerApplication) => void;
}

export const PartnerApplicationsView: React.FC<PartnerApplicationsViewProps> = ({
  applications,
  regions,
  cleaners,
  onSaveApplication,
  onDeleteApplication,
  onSaveRegion,
  onConvertToCleaner
}) => {
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(applications[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'territories'>('applications');

  // Filter applications
  const filteredApps = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.businessName && app.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.primaryRegion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (app: PartnerApplication, status: PartnerApplication['status']) => {
    const updated: PartnerApplication = {
      ...app,
      status,
      lockedRegionExpiry: status === 'region_locked' ? new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0] : app.lockedRegionExpiry
    };
    onSaveApplication(updated);
    if (selectedApp?.id === app.id) {
      setSelectedApp(updated);
    }
  };

  const handleToggleRegionStatus = (region: RegionTerritory) => {
    const nextStatus = region.status === 'locked' ? 'available' : 'locked';
    const updated: RegionTerritory = {
      ...region,
      status: nextStatus
    };
    onSaveRegion(updated);
  };

  const getStatusBadge = (status: PartnerApplication['status']) => {
    switch (status) {
      case 'region_locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Lock className="w-3 h-3 text-amber-700" />
            Region Locked
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Active Partner
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Clock className="w-3 h-3 text-sky-700" />
            Reviewed
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <XCircle className="w-3 h-3 text-slate-500" />
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
            <Sparkles className="w-3 h-3 text-teal-700" />
            New Application
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-teal-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/40 text-teal-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Franchise & Subcontractor Hub
              </span>
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded-full text-xs font-bold">
                GTA Region Locking
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Cleaner Partner Program & Territory Management
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Review sub-contractor applications, allocate exclusive territory locks, inspect equipment/insurance compliance, and dispatch jobs directly to vetted partner teams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 px-4 py-3 rounded-2xl text-center">
              <span className="block text-2xl font-black text-white">{applications.length}</span>
              <span className="text-[11px] font-bold text-teal-300 uppercase">Total Apps</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 px-4 py-3 rounded-2xl text-center">
              <span className="block text-2xl font-black text-amber-400">
                {applications.filter(a => a.status === 'region_locked').length}
              </span>
              <span className="text-[11px] font-bold text-amber-200 uppercase">Locked Zones</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 px-4 py-3 rounded-2xl text-center">
              <span className="block text-2xl font-black text-emerald-400">
                {regions.filter(r => r.status === 'available').length}
              </span>
              <span className="text-[11px] font-bold text-emerald-200 uppercase">Open Territories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Partner Inquiries ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('territories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'territories'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            GTA Territory Grid ({regions.length} Zones)
          </button>
        </div>

        {activeTab === 'applications' && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search partner or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 w-56"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="region_locked">Region Locked</option>
              <option value="approved">Approved / Active</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        )}
      </div>

      {/* Main View Body */}
      {activeTab === 'applications' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Applications List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredApps.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">No partner applications found</h3>
                <p className="text-xs text-slate-400 mt-1">Try resetting your search filters.</p>
              </div>
            ) : (
              filteredApps.map(app => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-500 shadow-md ring-1 ring-teal-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{app.fullName}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {app.partnerType.replace('_', ' ')}
                          </span>
                        </div>
                        {app.businessName && (
                          <p className="text-xs font-semibold text-teal-800 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-teal-600" />
                            {app.businessName}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        {app.primaryRegion}
                      </span>
                      <span>{app.experienceYears} yrs exp • {app.teamSize.replace('_', ' ')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Application Detail View */}
          <div className="lg:col-span-7">
            {selectedApp ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 space-y-6">
                {/* Top Title & Status Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                        Application #{selectedApp.id}
                      </span>
                      <span className="text-xs text-slate-400">• Submitted {selectedApp.submittedAt}</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mt-1">
                      {selectedApp.fullName}
                    </h2>
                    {selectedApp.businessName && (
                      <p className="text-sm font-bold text-slate-600">
                        {selectedApp.businessName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedApp.status)}
                  </div>
                </div>

                {/* Contact Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-teal-600" />
                    <span className="font-semibold">{selectedApp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-teal-600" />
                    <span className="font-semibold">{selectedApp.phone}</span>
                  </div>
                </div>

                {/* Primary Requested Region Card */}
                <div className="p-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                          Target Region to Lock
                        </span>
                        <h4 className="text-sm font-black text-slate-900">
                          {selectedApp.primaryRegion}
                        </h4>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-amber-200/80 text-amber-900 font-bold text-xs rounded-full">
                      Cap: {selectedApp.weeklyJobCapacity} jobs/week
                    </span>
                  </div>

                  {selectedApp.secondaryRegions && selectedApp.secondaryRegions.length > 0 && (
                    <div className="mt-2 text-xs text-amber-900/80 flex items-center gap-1.5">
                      <strong>Secondary Zones:</strong> {selectedApp.secondaryRegions.join(', ')}
                    </div>
                  )}

                  {selectedApp.lockedRegionExpiry && (
                    <p className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl inline-block">
                      ✓ Territory locked until: {selectedApp.lockedRegionExpiry}
                    </p>
                  )}
                </div>

                {/* Operational Qualifications Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Compliance & Operational Profile
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Experience</span>
                      <strong className="text-slate-900 font-bold text-sm">{selectedApp.experienceYears} Years</strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Crew Sizing</span>
                      <strong className="text-slate-900 font-bold text-sm capitalize">
                        {selectedApp.teamSize.replace('_', ' ')}
                      </strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Insurance ($2M)</span>
                      <strong className={selectedApp.hasInsurance ? 'text-emerald-700 font-bold' : 'text-rose-600'}>
                        {selectedApp.hasInsurance ? '✓ Verified' : '✗ Needed'}
                      </strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Service Vehicle</span>
                      <strong className={selectedApp.vehicleAccess ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                        {selectedApp.vehicleAccess ? '✓ Dedicated' : 'Public Transit'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Qualified Services */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Services Authorized to Clean
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApp.qualifiedServices.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold"
                      >
                        {srv.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes & Bio */}
                {selectedApp.notes && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Applicant Message / Fleet Details
                    </h4>
                    <p className="text-xs text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-100 italic">
                      "{selectedApp.notes}"
                    </p>
                  </div>
                )}

                {/* Admin Actions Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedApp, 'region_locked')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Grant Exclusive Region Lock
                    </button>

                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedApp, 'approved');
                        onConvertToCleaner(selectedApp);
                      }}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve & Add to Cleaners Roster
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedApp, 'reviewed')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                    >
                      Mark Reviewed
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove application from ${selectedApp.fullName}?`)) {
                        onDeleteApplication(selectedApp.id);
                        setSelectedApp(null);
                      }
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800">Select an application to inspect</h3>
                <p className="text-xs text-slate-400 mt-1">Review credentials, equipment, and lock in territory rights.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Territories Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map(region => (
            <div
              key={region.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {region.code}
                  </span>
                  {region.status === 'locked' ? (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
                      Locked
                    </span>
                  ) : region.status === 'high_demand' ? (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-[10px] font-bold">
                      🔥 High Demand
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold">
                      Available (2 slots)
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{region.name}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Postal: {region.postalPrefixes.join(', ')}
                </p>

                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Est. Monthly Earnings:</span>
                    <strong className="text-teal-700">{region.estimatedMonthlyEarnings}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Weekly Jobs Volume:</span>
                    <strong className="text-slate-900">~{region.averageWeeklyJobs} jobs</strong>
                  </div>
                  {region.assignedPartnerName && (
                    <div className="pt-1.5 border-t border-slate-200 text-slate-700">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Assigned Partner</span>
                      <span className="font-semibold text-slate-900 text-[11px]">{region.assignedPartnerName}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleToggleRegionStatus(region)}
                className={`w-full py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  region.status === 'locked'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-teal-600 hover:bg-teal-700 text-white border-teal-600 shadow-xs'
                }`}
              >
                {region.status === 'locked' ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    Unlock Territory
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Lock Territory
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
