import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  Repeat,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Job, Cleaner, Customer, ServiceType } from '../types';

interface CalendarViewProps {
  jobs: Job[];
  cleaners: Cleaner[];
  customers: Customer[];
  onOpenNewJob: () => void;
  onOpenJobDetails: (job: Job) => void;
  onOpenSmartScheduling: () => void;
  onUpdateJobDate: (jobId: string, newDate: string, newTime: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  jobs,
  cleaners,
  customers,
  onOpenNewJob,
  onOpenJobDetails,
  onOpenSmartScheduling,
  onUpdateJobDate
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'cleaner'>('week');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [selectedCleanerFilter, setSelectedCleanerFilter] = useState<string>('all');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('all');

  // Days in current week (Centered around Aug 23 - Aug 29, 2026)
  const weekDays = [
    { date: '2026-08-23', label: 'Sun', dayNum: '23' },
    { date: '2026-08-24', label: 'Mon', dayNum: '24' },
    { date: '2026-08-25', label: 'Tue', dayNum: '25' },
    { date: '2026-08-26', label: 'Wed', dayNum: '26' },
    { date: '2026-08-27', label: 'Thu', dayNum: '27' },
    { date: '2026-08-28', label: 'Fri', dayNum: '28' },
    { date: '2026-08-29', label: 'Sat', dayNum: '29' }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    if (selectedCleanerFilter !== 'all' && !job.assignedCleanerIds.includes(selectedCleanerFilter)) {
      return false;
    }
    if (selectedServiceFilter !== 'all' && job.serviceType !== selectedServiceFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-600" />
            Scheduling & Dispatch Board
          </h1>
          <p className="text-xs text-slate-500">
            Drag, assign cleaners, and optimize travel routes across Toronto & GTA
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Route Optimizer button */}
          <button
            onClick={onOpenSmartScheduling}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI Route Optimizer
          </button>

          {/* Book Job button */}
          <button
            onClick={onOpenNewJob}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            + New Booking
          </button>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedDate('2026-08-24')}
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-xs text-slate-800 px-2 font-mono">
            August 23 – 29, 2026
          </span>
          <button 
            onClick={() => setSelectedDate('2026-08-26')}
            className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-xs font-semibold text-slate-600">
          {(['day', 'week', 'cleaner', 'month'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                viewMode === mode 
                  ? 'bg-white text-teal-800 shadow-xs font-bold' 
                  : 'hover:text-slate-900'
              }`}
            >
              {mode === 'cleaner' ? 'By Cleaner' : mode}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCleanerFilter}
            onChange={(e) => setSelectedCleanerFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium outline-hidden"
          >
            <option value="all">All Cleaners</option>
            {cleaners.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedServiceFilter}
            onChange={(e) => setSelectedServiceFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium outline-hidden"
          >
            <option value="all">All Services</option>
            <option value="standard">Standard</option>
            <option value="deep_clean">Deep Clean</option>
            <option value="commercial">Commercial</option>
            <option value="move_in_out">Move-In/Out</option>
          </select>
        </div>
      </div>

      {/* Week Grid View */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
          <div className="min-w-[800px]">
            {/* Header Day Columns */}
            <div className="grid grid-cols-7 border-b border-slate-200 text-center bg-slate-50/70">
              {weekDays.map(d => {
                const isSelected = d.date === selectedDate;
                const isToday = d.date === '2026-08-25';
                const dayJobsCount = filteredJobs.filter(j => j.date === d.date).length;

                return (
                  <div 
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={`py-3 px-2 border-r last:border-r-0 border-slate-200 cursor-pointer transition-colors ${
                      isToday ? 'bg-teal-50/60' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">{d.label}</p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className={`text-base font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-teal-600 text-white' : 'text-slate-800'
                      }`}>
                        {d.dayNum}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                      {dayJobsCount} {dayJobsCount === 1 ? 'job' : 'jobs'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Day Columns Body */}
            <div className="grid grid-cols-7 min-h-[500px] divide-x divide-slate-200">
              {weekDays.map(d => {
                const dayJobs = filteredJobs.filter(j => j.date === d.date);

                return (
                  <div key={d.date} className="p-2 space-y-2 bg-slate-50/20">
                    {dayJobs.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[11px] text-slate-300 py-12">
                        No bookings
                      </div>
                    ) : (
                      dayJobs.map(job => {
                        const assignedCleaner = cleaners.find(c => job.assignedCleanerIds.includes(c.id));
                        const isDone = job.status === 'completed';
                        const isInProgress = job.status === 'in_progress';

                        return (
                          <div
                            key={job.id}
                            onClick={() => onOpenJobDetails(job)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer shadow-2xs hover:shadow-md transition-all ${
                              isInProgress 
                                ? 'bg-teal-50 border-teal-300 text-teal-950' 
                                : isDone 
                                ? 'bg-slate-50 border-slate-200 opacity-80' 
                                : 'bg-white border-slate-200 hover:border-teal-400'
                            }`}
                          >
                            <div className="flex items-center justify-between font-mono font-bold text-[10px] text-slate-600 mb-1">
                              <span className="flex items-center gap-1 text-teal-800">
                                <Clock className="w-3 h-3 text-teal-600" />
                                {job.time}
                              </span>
                              <span>${job.price}</span>
                            </div>

                            <p className="font-bold text-slate-900 line-clamp-1">{job.customerName}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{job.customerCity}</p>

                            <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px]">
                              <span className="font-medium text-slate-600 truncate max-w-[80px]">
                                {job.assignedCleanerNames[0]?.split(' ')[0] || 'Unassigned'}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded-sm font-semibold uppercase text-[9px] ${
                                job.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                job.status === 'in_progress' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {job.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cleaner Dispatch View */}
      {viewMode === 'cleaner' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cleaners.map(cleaner => {
            const cleanerJobs = filteredJobs.filter(j => j.assignedCleanerIds.includes(cleaner.id));

            return (
              <div key={cleaner.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <img 
                      src={cleaner.avatar} 
                      alt={cleaner.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{cleaner.name}</h3>
                      <p className="text-[11px] text-slate-500">{cleaner.serviceZones.join(', ')}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Assigned Route ({cleanerJobs.length})
                    </p>
                    {cleanerJobs.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No assigned jobs</p>
                    ) : (
                      cleanerJobs.map(job => (
                        <div 
                          key={job.id} 
                          onClick={() => onOpenJobDetails(job)}
                          className="p-2.5 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 rounded-xl text-xs cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between font-mono font-bold text-[10px]">
                            <span>{job.date} @ {job.time}</span>
                            <span className="text-teal-700">${job.price}</span>
                          </div>
                          <p className="font-bold text-slate-800 mt-0.5">{job.customerName}</p>
                          <p className="text-[10px] text-slate-500">{job.customerAddress}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Rating: <strong className="text-slate-800">{cleaner.rating} ★</strong></span>
                  <span className="capitalize font-semibold text-teal-700">{cleaner.status.replace('_', ' ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day / Month fallback cards */}
      {(viewMode === 'day' || viewMode === 'month') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900">
              Schedule Overview for {selectedDate}
            </h2>
            <span className="text-xs font-semibold text-teal-700">
              {filteredJobs.filter(j => j.date === selectedDate).length} Bookings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.filter(j => j.date === selectedDate).map(job => (
              <div 
                key={job.id}
                onClick={() => onOpenJobDetails(job)}
                className="p-4 bg-slate-50 hover:bg-teal-50/40 border border-slate-200 rounded-2xl cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md font-mono text-xs font-bold">
                    {job.time}
                  </span>
                  <span className="font-bold text-xs text-slate-900">${job.price} CAD</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{job.customerName}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {job.customerAddress}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-600 font-medium">
                    Cleaners: {job.assignedCleanerNames.join(', ') || 'Unassigned'}
                  </span>
                  <span className="text-teal-600 font-bold uppercase text-[10px]">
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
