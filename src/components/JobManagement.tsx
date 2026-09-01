import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Send, 
  Repeat, 
  Filter,
  DollarSign,
  AlertCircle,
  Eye,
  Trash2
} from 'lucide-react';
import { Job, Customer, Cleaner, ServiceType, JobStatus, RecurringFrequency } from '../types';

interface JobManagementProps {
  jobs: Job[];
  customers: Customer[];
  cleaners: Cleaner[];
  onSaveJob: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
  onGenerateInvoice: (job: Job) => void;
  onOpenSmartNotes: (job: Job) => void;
  onOpenCustomerComm: (job: Job, type: 'confirmation' | 'reminder' | 'review_request') => void;
}

export const JobManagement: React.FC<JobManagementProps> = ({
  jobs,
  customers,
  cleaners,
  onSaveJob,
  onDeleteJob,
  onGenerateInvoice,
  onOpenSmartNotes,
  onOpenCustomerComm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);

  // Filter jobs
  const filteredJobs = jobs.filter(j => {
    const matchesSearch = 
      j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.customerAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.assignedCleanerNames.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    const matchesService = serviceFilter === 'all' || j.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const handleOpenAdd = () => {
    const defaultCust = customers[0] || {
      id: 'cust-temp',
      name: 'Amara Vance',
      phone: '(416) 555-9831',
      address: '180 University Ave',
      city: 'Toronto',
      propertyType: 'residential'
    };

    setEditingJob({
      id: 'job-' + Date.now(),
      customerId: defaultCust.id,
      customerName: defaultCust.name,
      customerPhone: defaultCust.phone,
      customerAddress: defaultCust.address,
      customerCity: defaultCust.city,
      propertyType: defaultCust.propertyType,
      serviceType: 'standard',
      date: '2026-08-26',
      time: '10:00',
      durationHours: 2.5,
      recurringFrequency: 'one_time',
      assignedCleanerIds: [cleaners[0]?.id || 'cleaner-1'],
      assignedCleanerNames: [cleaners[0]?.name || 'Sarah Tremblay'],
      status: 'scheduled',
      price: 185.00,
      specialInstructions: 'Standard detail clean. Focus on kitchen counters and bathrooms.',
      checklist: [
        { id: 'c1', task: 'Dust and wipe all surfaces & ledges', completed: false, room: 'Throughout' },
        { id: 'c2', task: 'Scrub and disinfect bathroom sinks, tubs & toilets', completed: false, room: 'Bathrooms' },
        { id: 'c3', task: 'Clean kitchen countertops, stovetop & microwave', completed: false, room: 'Kitchen' },
        { id: 'c4', task: 'Vacuum rugs and damp mop hard surface floors', completed: false, room: 'Floors' }
      ],
      cleanerNotes: '',
      createdAt: new Date().toISOString().split('T')[0]
    });
    setIsNewJobModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editingJob.customerName || !editingJob.date) return;

    onSaveJob(editingJob as Job);
    setIsNewJobModalOpen(false);
  };

  const handleCustomerSelectChange = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (cust && editingJob) {
      setEditingJob({
        ...editingJob,
        customerId: cust.id,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerAddress: `${cust.address}${cust.unit ? `, ${cust.unit}` : ''}`,
        customerCity: cust.city,
        propertyType: cust.propertyType
      });
    }
  };

  const handleToggleChecklist = (job: Job, itemId: string) => {
    const updatedChecklist = job.checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updatedJob = { ...job, checklist: updatedChecklist };
    onSaveJob(updatedJob);
    if (selectedJob?.id === job.id) {
      setSelectedJob(updatedJob);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-teal-600" />
            Jobs & Booking Management
          </h1>
          <p className="text-xs text-slate-500">
            Create bookings, manage recurring frequency, assign crews, and track service progress
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Create Job Booking
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, address, or cleaner..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-hidden"
          >
            <option value="all">All Services</option>
            <option value="standard">Standard</option>
            <option value="deep_clean">Deep Clean</option>
            <option value="commercial">Commercial</option>
            <option value="move_in_out">Move-In/Out</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Customer & Location</th>
                <th className="py-3.5 px-4">Service Type</th>
                <th className="py-3.5 px-4">Assigned Crew</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No jobs found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-slate-900">{job.date}</span>
                      <span className="block text-slate-400 text-[11px]">{job.time} ({job.durationHours}h)</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="font-bold text-slate-900 block">{job.customerName}</strong>
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {job.customerAddress}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        job.serviceType === 'deep_clean' ? 'bg-amber-100 text-amber-800' :
                        job.serviceType === 'commercial' ? 'bg-sky-100 text-sky-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {job.serviceType.replace('_', ' ')}
                      </span>
                      {job.recurringFrequency !== 'one_time' && (
                        <span className="block text-[10px] text-teal-700 font-semibold mt-0.5 flex items-center gap-1">
                          <Repeat className="w-2.5 h-2.5" />
                          {job.recurringFrequency}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">
                        {job.assignedCleanerNames.join(', ') || 'Unassigned'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${job.price.toFixed(2)} CAD
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                        job.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        job.status === 'in_progress' ? 'bg-teal-600 text-white' :
                        job.status === 'scheduled' ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                        >
                          Details
                        </button>
                        {job.status === 'completed' && !job.invoiceId && (
                          <button
                            onClick={() => onGenerateInvoice(job)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Auto-create Invoice"
                          >
                            <FileText className="w-3 h-3" />
                            Invoice
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase">Booking Overview</span>
                <h2 className="text-xl font-bold text-slate-900">{selectedJob.customerName}</h2>
                <p className="text-xs text-slate-500">{selectedJob.customerAddress}</p>
              </div>

              <div className="text-right">
                <span className="text-lg font-bold text-slate-900">${selectedJob.price} CAD</span>
                <span className={`block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase mt-1 ${
                  selectedJob.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  selectedJob.status === 'in_progress' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {selectedJob.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Quick Actions Bar inside Modal */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <button
                onClick={() => onOpenSmartNotes(selectedJob)}
                className="px-3 py-1.5 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                AI Smart Notes
              </button>

              <button
                onClick={() => onOpenCustomerComm(selectedJob, 'reminder')}
                className="px-3 py-1.5 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-cyan-600" />
                Send Reminder
              </button>

              {selectedJob.status === 'completed' && (
                <button
                  onClick={() => onGenerateInvoice(selectedJob)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Generate Invoice
                </button>
              )}
            </div>

            {/* Interactive Cleaning Checklist */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Service Checklist ({selectedJob.checklist.filter(c => c.completed).length}/{selectedJob.checklist.length} Complete)
              </h3>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {selectedJob.checklist.map(item => (
                  <label 
                    key={item.id}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200 text-xs cursor-pointer hover:border-teal-300 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklist(selectedJob, item.id)}
                      className="w-4 h-4 text-teal-600 rounded-md border-slate-300 focus:ring-teal-500"
                    />
                    <span className={`font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {item.task}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cleaner Notes & Customer Feedback */}
            {selectedJob.cleanerNotes && (
              <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-teal-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Cleaner Field Notes
                </span>
                <p className="text-slate-700">{selectedJob.cleanerNotes}</p>
              </div>
            )}

            {selectedJob.feedback && (
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-amber-900">
                  Customer Review: {selectedJob.feedback.rating} ★★★★★
                </span>
                <p className="text-slate-700 italic">"{selectedJob.feedback.review}"</p>
              </div>
            )}

            <div className="flex items-center justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New / Edit Job Modal */}
      {isNewJobModalOpen && editingJob && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Create New Job Booking</h3>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              {/* Customer Selector */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Customer</label>
                <select
                  value={editingJob.customerId}
                  onChange={(e) => handleCustomerSelectChange(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.address}, {c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Service Type</label>
                  <select
                    value={editingJob.serviceType}
                    onChange={(e) => setEditingJob({ ...editingJob, serviceType: e.target.value as ServiceType })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="standard">Standard Residential</option>
                    <option value="deep_clean">Deep Clean Special</option>
                    <option value="commercial">Commercial Office / Medical</option>
                    <option value="move_in_out">Move-In / Move-Out</option>
                    <option value="post_construction">Post-Construction Sanitization</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Recurring Frequency</label>
                  <select
                    value={editingJob.recurringFrequency}
                    onChange={(e) => setEditingJob({ ...editingJob, recurringFrequency: e.target.value as RecurringFrequency })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="one_time">One-time Job</option>
                    <option value="weekly">Weekly Recurring</option>
                    <option value="biweekly">Bi-weekly Recurring</option>
                    <option value="monthly">Monthly Recurring</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Date</label>
                  <input
                    type="date"
                    required
                    value={editingJob.date}
                    onChange={(e) => setEditingJob({ ...editingJob, date: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Start Time</label>
                  <input
                    type="time"
                    required
                    value={editingJob.time}
                    onChange={(e) => setEditingJob({ ...editingJob, time: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingJob.durationHours}
                    onChange={(e) => setEditingJob({ ...editingJob, durationHours: parseFloat(e.target.value) || 2 })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Assign Cleaners */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Assigned Cleaners</label>
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {cleaners.map(c => {
                    const isChecked = editingJob.assignedCleanerIds?.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const newIds = e.target.checked
                              ? [...(editingJob.assignedCleanerIds || []), c.id]
                              : (editingJob.assignedCleanerIds || []).filter(id => id !== c.id);
                            const newNames = cleaners.filter(cl => newIds.includes(cl.id)).map(cl => cl.name);
                            setEditingJob({
                              ...editingJob,
                              assignedCleanerIds: newIds,
                              assignedCleanerNames: newNames
                            });
                          }}
                          className="w-4 h-4 text-teal-600 rounded-sm"
                        />
                        <span className="font-medium text-slate-800">{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price & Instructions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Price ($ CAD)</label>
                  <input
                    type="number"
                    step="5"
                    required
                    value={editingJob.price}
                    onChange={(e) => setEditingJob({ ...editingJob, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Initial Status</label>
                  <select
                    value={editingJob.status}
                    onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as JobStatus })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Special Instructions / Property Notes</label>
                <textarea
                  rows={2}
                  value={editingJob.specialInstructions || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, specialInstructions: e.target.value })}
                  placeholder="Eco products only, wipe chandeliers, alarm pin 1994..."
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Confirm & Schedule Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
