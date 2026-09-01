import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Send, 
  Home, 
  Building2, 
  CheckCircle2, 
  Tag,
  DollarSign
} from 'lucide-react';
import { Customer, Job, PropertyType } from '../types';

interface CustomerManagementProps {
  customers: Customer[];
  jobs: Job[];
  onSaveCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onOpenNewJobForCustomer: (customer: Customer) => void;
  onOpenCustomerComm: (customer: Customer, type: 'confirmation' | 'reminder' | 'review_request') => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  jobs,
  onSaveCustomer,
  onDeleteCustomer,
  onOpenNewJobForCustomer,
  onOpenCustomerComm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = propertyFilter === 'all' || c.propertyType === propertyFilter;
    return matchesSearch && matchesType;
  });

  const handleOpenAdd = () => {
    setEditingCustomer({
      id: 'cust-' + Date.now(),
      name: '',
      email: '',
      phone: '',
      address: '',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M5H 1J9',
      propertyType: 'residential',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      accessInstructions: '',
      notes: '',
      tags: ['Residential'],
      totalSpent: 0,
      serviceCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    });
    setIsEditingModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer({ ...customer });
    setIsEditingModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.name || !editingCustomer.address) return;
    onSaveCustomer(editingCustomer as Customer);
    setSelectedCustomer(editingCustomer as Customer);
    setIsEditingModalOpen(false);
  };

  // Get jobs for the selected customer
  const customerJobs = selectedCustomer 
    ? jobs.filter(j => j.customerId === selectedCustomer.id || j.customerName === selectedCustomer.name)
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Customer Management
          </h1>
          <p className="text-xs text-slate-500">
            Profiles, property access instructions, service history, and communication dispatch
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Add Customer
        </button>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers, tags, addresses..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'residential', 'commercial'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setPropertyFilter(type)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    propertyFilter === type 
                      ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Cards List */}
          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredCustomers.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No customers found matching your search.
              </div>
            ) : (
              filteredCustomers.map(cust => {
                const isSelected = selectedCustomer?.id === cust.id;

                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-teal-50/70 border-teal-400 shadow-xs ring-1 ring-teal-400/30' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{cust.name}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        cust.propertyType === 'commercial' ? 'bg-sky-100 text-sky-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {cust.propertyType}
                      </span>
                    </div>

                    <p className="text-slate-500 flex items-center gap-1 line-clamp-1 mb-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {cust.address}{cust.unit ? `, ${cust.unit}` : ''}, {cust.city}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {cust.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{cust.serviceCount} service visits</span>
                      <span className="font-bold text-teal-700">${cust.totalSpent} CAD total</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Customer Detailed Profile (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCustomer ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h2>
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-teal-100 text-teal-800 uppercase">
                      {selectedCustomer.propertyType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Client since {selectedCustomer.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedCustomer)}
                    className="p-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl border border-slate-200 transition-colors"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenNewJobForCustomer(selectedCustomer)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    + Book Service
                  </button>
                </div>
              </div>

              {/* Contact & Property Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Contact Information</span>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{selectedCustomer.address}{selectedCustomer.unit ? `, ${selectedCustomer.unit}` : ''}, {selectedCustomer.city}, {selectedCustomer.province} {selectedCustomer.postalCode}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Property Specifications</span>
                  <div className="flex items-center justify-between text-slate-800">
                    <span>Layout:</span>
                    <strong className="font-semibold">{selectedCustomer.bedrooms || 0} Beds / {selectedCustomer.bathrooms || 0} Baths</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-800">
                    <span>Square Footage:</span>
                    <strong className="font-semibold">{selectedCustomer.sqft || 'N/A'} sqft</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-800">
                    <span>Total Spend:</span>
                    <strong className="text-teal-700 font-bold">${selectedCustomer.totalSpent} CAD</strong>
                  </div>
                </div>
              </div>

              {/* Access Instructions & Preferences */}
              <div className="space-y-3">
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-amber-700" />
                    Entry & Key Access Instructions
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedCustomer.accessInstructions || 'No special key code instructions recorded.'}
                  </p>
                </div>

                <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-teal-900 text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    Customer Preferences & Notes
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedCustomer.notes || 'No specific preferences logged yet.'}
                  </p>
                </div>
              </div>

              {/* Quick Communication Dispatch Bar */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-teal-600" />
                    AI Automated Customer Dispatch
                  </span>
                  <span className="text-[10px] text-slate-400">Editable before sending</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onOpenCustomerComm(selectedCustomer, 'confirmation')}
                    className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Booking Confirmation
                  </button>
                  <button
                    onClick={() => onOpenCustomerComm(selectedCustomer, 'reminder')}
                    className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Appointment Reminder
                  </button>
                  <button
                    onClick={() => onOpenCustomerComm(selectedCustomer, 'review_request')}
                    className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Google Review Request
                  </button>
                </div>
              </div>

              {/* Service History */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                  <span>Service History ({customerJobs.length})</span>
                </h3>

                {customerJobs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 italic">No past jobs on record for this customer.</p>
                ) : (
                  <div className="space-y-2">
                    {customerJobs.map(job => (
                      <div key={job.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 font-bold text-slate-800">
                            <span>{job.date}</span>
                            <span className="text-slate-400">•</span>
                            <span className="capitalize text-teal-700">{job.serviceType.replace('_', ' ')}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Cleaners: {job.assignedCleanerNames.join(', ') || 'Staff'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">${job.price} CAD</span>
                          <span className={`block text-[10px] font-bold uppercase ${
                            job.status === 'completed' ? 'text-emerald-600' : 'text-teal-600'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              Select a customer from the left list to view their full profile.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isEditingModalOpen && editingCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {editingCustomer.name ? `Edit Customer: ${editingCustomer.name}` : 'Add New Customer'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name / Company Name</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  placeholder="Amara Vance or Apex Design Studio"
                  className="w-full p-2 border border-slate-200 rounded-xl focus:border-teal-500 outline-hidden text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    placeholder="client@domain.ca"
                    className="w-full p-2 border border-slate-200 rounded-xl focus:border-teal-500 outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    placeholder="(416) 555-0123"
                    className="w-full p-2 border border-slate-200 rounded-xl focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Street Address</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.address || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  placeholder="180 University Ave, Penthouse 4201"
                  className="w-full p-2 border border-slate-200 rounded-xl focus:border-teal-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={editingCustomer.city || 'Toronto'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Province</label>
                  <input
                    type="text"
                    value={editingCustomer.province || 'ON'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, province: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Postal Code</label>
                  <input
                    type="text"
                    value={editingCustomer.postalCode || 'M5H 1J9'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, postalCode: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Type</label>
                  <select
                    value={editingCustomer.propertyType || 'residential'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, propertyType: e.target.value as PropertyType })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bedrooms</label>
                  <input
                    type="number"
                    value={editingCustomer.bedrooms || 2}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, bedrooms: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bathrooms</label>
                  <input
                    type="number"
                    value={editingCustomer.bathrooms || 2}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, bathrooms: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Key Access / Gate Code Instructions</label>
                <textarea
                  rows={2}
                  value={editingCustomer.accessInstructions || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, accessInstructions: e.target.value })}
                  placeholder="Lockbox code 8842, concierge buzzer #4201..."
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Customer Preferences & Notes</label>
                <textarea
                  rows={2}
                  value={editingCustomer.notes || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                  placeholder="Eco-friendly products only, golden retriever on premises..."
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
                  Save Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
