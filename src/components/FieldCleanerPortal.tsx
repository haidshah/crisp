import React, { useState } from 'react';
import { 
  Smartphone, 
  MapPin, 
  Phone, 
  Clock, 
  Key, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Navigation, 
  Calendar,
  Check
} from 'lucide-react';
import { Job, Cleaner } from '../types';

interface FieldCleanerPortalProps {
  jobs: Job[];
  currentCleaner: Cleaner;
  onUpdateJobStatus: (jobId: string, status: any) => void;
  onToggleChecklist: (job: Job, itemId: string) => void;
  onOpenSmartNotes: (job: Job) => void;
}

export const FieldCleanerPortal: React.FC<FieldCleanerPortalProps> = ({
  jobs,
  currentCleaner,
  onUpdateJobStatus,
  onToggleChecklist,
  onOpenSmartNotes
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Filter jobs for this cleaner
  const cleanerJobs = jobs.filter(j => j.assignedCleanerIds.includes(currentCleaner.id));
  const activeJob = cleanerJobs.find(j => j.id === selectedJobId) || cleanerJobs[0];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Field Mode Banner */}
      <div className="bg-linear-to-r from-teal-800 to-teal-900 rounded-3xl p-5 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={currentCleaner.avatar} 
            alt={currentCleaner.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-teal-400"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base">{currentCleaner.name}</h2>
              <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-full text-[10px] font-bold uppercase">
                Field Active
              </span>
            </div>
            <p className="text-xs text-teal-200">
              {cleanerJobs.length} bookings on your schedule today
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-teal-200">Rating</span>
          <p className="font-bold text-amber-300 text-lg">{currentCleaner.rating} ★</p>
        </div>
      </div>

      {/* Quick Job Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {cleanerJobs.map((job, idx) => {
          const isSelected = (activeJob && activeJob.id === job.id);
          const isDone = job.status === 'completed';
          const isInProg = job.status === 'in_progress';

          return (
            <button
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className={`p-3 rounded-2xl border text-left shrink-0 min-w-[160px] transition-all ${
                isSelected
                  ? 'bg-teal-50 border-teal-500 text-teal-950 ring-2 ring-teal-400/40 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                <span>Job #{idx + 1}</span>
                <span className="text-teal-700">{job.time}</span>
              </div>
              <p className="font-bold text-xs line-clamp-1">{job.customerName}</p>
              <span className={`inline-block px-1.5 py-0.2 rounded-sm text-[9px] font-bold uppercase mt-1 ${
                isDone ? 'bg-emerald-100 text-emerald-800' :
                isInProg ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {job.status.replace('_', ' ')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Job Card Detail */}
      {activeJob ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Header */}
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full font-bold text-xs uppercase">
                {activeJob.serviceType.replace('_', ' ')}
              </span>
              <span className="font-mono text-sm font-bold text-slate-800">
                Scheduled: {activeJob.time} ({activeJob.durationHours} hrs)
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">{activeJob.customerName}</h3>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{activeJob.customerAddress}</span>
            </div>
          </div>

          {/* Quick Actions (Call, Maps, Notes) */}
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`tel:${activeJob.customerPhone || '4165550100'}`}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center gap-1 text-slate-800 font-bold text-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-teal-600" />
              <span>Call Client</span>
            </a>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(activeJob.customerAddress)}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center gap-1 text-slate-800 font-bold text-xs transition-colors"
            >
              <Navigation className="w-4 h-4 text-teal-600" />
              <span>Directions</span>
            </a>

            <button
              onClick={() => onOpenSmartNotes(activeJob)}
              className="p-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-2xl text-center flex flex-col items-center justify-center gap-1 text-teal-900 font-bold text-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>AI Notes</span>
            </button>
          </div>

          {/* Lockbox & Access Code Highlight */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-bold">
              <Key className="w-4 h-4 text-amber-700" />
              <span>Key & Entry Access Instructions</span>
            </div>
            <p className="text-slate-800 font-medium">
              {activeJob.specialInstructions || 'Use lockbox code 8842 on porch railing. Pet friendly.'}
            </p>
          </div>

          {/* Cleaning Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Service Checklist ({activeJob.checklist.filter(c => c.completed).length}/{activeJob.checklist.length})
              </span>
            </div>

            <div className="space-y-2">
              {activeJob.checklist.map(item => (
                <button
                  key={item.id}
                  onClick={() => onToggleChecklist(activeJob, item.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 text-xs transition-all ${
                    item.completed 
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className={item.completed ? 'line-through text-slate-400' : ''}>
                    {item.task}
                  </span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    item.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                  }`}>
                    {item.completed && <Check className="w-4 h-4" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Big Primary Status Action Button */}
          <div className="pt-2">
            {activeJob.status === 'scheduled' && (
              <button
                onClick={() => onUpdateJobStatus(activeJob.id, 'in_progress')}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-base shadow-md transition-all active:scale-98"
              >
                ▶ Start This Job Now
              </button>
            )}

            {activeJob.status === 'in_progress' && (
              <button
                onClick={() => onUpdateJobStatus(activeJob.id, 'completed')}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark Job Complete & Log
              </button>
            )}

            {activeJob.status === 'completed' && (
              <div className="p-3.5 bg-emerald-100 text-emerald-900 rounded-2xl text-center font-bold text-xs flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Job Completed & Submitted to Office
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          No bookings assigned to you today.
        </div>
      )}
    </div>
  );
};
