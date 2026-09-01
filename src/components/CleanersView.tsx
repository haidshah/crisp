import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Edit3
} from 'lucide-react';
import { Cleaner, Job } from '../types';

interface CleanersViewProps {
  cleaners: Cleaner[];
  jobs: Job[];
  onSaveCleaner: (cleaner: Cleaner) => void;
  onOpenJobDetails: (job: Job) => void;
}

export const CleanersView: React.FC<CleanersViewProps> = ({
  cleaners,
  jobs,
  onSaveCleaner,
  onOpenJobDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCleaner, setSelectedCleaner] = useState<Cleaner | null>(cleaners[0] || null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingCleaner, setEditingCleaner] = useState<Partial<Cleaner> | null>(null);

  const filteredCleaners = cleaners.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serviceZones.some(z => z.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingCleaner({
      id: 'cleaner-' + Date.now(),
      name: '',
      email: '',
      phone: '',
      role: 'cleaner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      status: 'available',
      skills: ['Residential Standard', 'Kitchen Sanitization'],
      hourlyRate: 30.00,
      serviceZones: ['Downtown Toronto'],
      performanceNotes: 'New team member on probation.',
      color: '#0d9488'
    });
    setIsEditingModalOpen(true);
  };

  const handleOpenEdit = (cleaner: Cleaner) => {
    setEditingCleaner({ ...cleaner });
    setIsEditingModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCleaner || !editingCleaner.name) return;
    onSaveCleaner(editingCleaner as Cleaner);
    setSelectedCleaner(editingCleaner as Cleaner);
    setIsEditingModalOpen(false);
  };

  const cleanerJobs = selectedCleaner
    ? jobs.filter(j => j.assignedCleanerIds.includes(selectedCleaner.id))
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-600" />
            Cleaners & Staff Directory
          </h1>
          <p className="text-xs text-slate-500">
            Manage field crews, service zones, hourly rates, and real-time on-duty status
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Add Team Member
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Cleaner List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cleaners by name, skills, zones..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'available', 'on_job', 'off_duty'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition-colors ${
                    statusFilter === status 
                      ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredCleaners.map(cleaner => {
              const isSelected = selectedCleaner?.id === cleaner.id;
              const assignedCount = jobs.filter(j => j.assignedCleanerIds.includes(cleaner.id)).length;

              return (
                <div
                  key={cleaner.id}
                  onClick={() => setSelectedCleaner(cleaner)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-teal-50/70 border-teal-400 shadow-xs ring-1 ring-teal-400/30' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={cleaner.avatar} 
                        alt={cleaner.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{cleaner.name}</h3>
                        <p className="text-[11px] text-slate-500 capitalize">{cleaner.role.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      cleaner.status === 'on_job' ? 'bg-teal-100 text-teal-800' :
                      cleaner.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cleaner.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {cleaner.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px]">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {cleaner.rating} ★
                    </span>
                    <span>${cleaner.hourlyRate}/hr</span>
                    <span className="font-semibold text-teal-700">{assignedCount} jobs assigned</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Cleaner Profile (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCleaner ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={selectedCleaner.avatar} 
                    alt={selectedCleaner.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-teal-500 shadow-xs" 
                  />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedCleaner.name}</h2>
                    <p className="text-xs text-slate-500 capitalize">{selectedCleaner.role.replace('_', ' ')} • Crisp Cleaners Crew</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        Rating: {selectedCleaner.rating} / 5.0 ★
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        ${selectedCleaner.hourlyRate}.00 CAD / hr
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(selectedCleaner)}
                  className="p-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl border border-slate-200 transition-colors self-start sm:self-auto"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Contact Info</span>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{selectedCleaner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>{selectedCleaner.email}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Service Zones</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCleaner.serviceZones.map(zone => (
                      <span key={zone} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-700">
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills & Performance Notes */}
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-1">
                  <span className="font-bold text-teal-900 text-[11px]">Specialized Skills</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCleaner.skills.map(s => (
                      <span key={s} className="px-2 py-1 bg-white text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-700 text-[11px]">Performance & Supervisor Notes</span>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedCleaner.performanceNotes || 'No performance remarks recorded.'}
                  </p>
                </div>
              </div>

              {/* Assigned Jobs Timeline */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Assigned Jobs Schedule ({cleanerJobs.length})
                </h3>

                {cleanerJobs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No jobs currently scheduled for {selectedCleaner.name}.</p>
                ) : (
                  <div className="space-y-2">
                    {cleanerJobs.map(job => (
                      <div 
                        key={job.id} 
                        onClick={() => onOpenJobDetails(job)}
                        className="p-3 bg-slate-50 hover:bg-teal-50/50 border border-slate-200 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 font-bold text-slate-800">
                            <span>{job.date} @ {job.time}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-teal-700">{job.customerName}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">{job.customerAddress}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          job.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          job.status === 'in_progress' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              Select a cleaner from the left list.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Cleaner Modal */}
      {isEditingModalOpen && editingCleaner && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {editingCleaner.name ? `Edit: ${editingCleaner.name}` : 'Add Cleaner'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingCleaner.name || ''}
                  onChange={(e) => setEditingCleaner({ ...editingCleaner, name: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={editingCleaner.email || ''}
                    onChange={(e) => setEditingCleaner({ ...editingCleaner, email: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingCleaner.phone || ''}
                    onChange={(e) => setEditingCleaner({ ...editingCleaner, phone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hourly Rate ($ CAD)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingCleaner.hourlyRate || 30}
                    onChange={(e) => setEditingCleaner({ ...editingCleaner, hourlyRate: parseFloat(e.target.value) || 30 })}
                    className="w-full p-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={editingCleaner.status || 'available'}
                    onChange={(e) => setEditingCleaner({ ...editingCleaner, status: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="available">Available</option>
                    <option value="on_job">On Job</option>
                    <option value="off_duty">Off Duty</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Service Zones (Comma separated)</label>
                <input
                  type="text"
                  value={editingCleaner.serviceZones?.join(', ') || ''}
                  onChange={(e) => setEditingCleaner({ ...editingCleaner, serviceZones: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="Downtown, Midtown, North York"
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Save Cleaner Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
