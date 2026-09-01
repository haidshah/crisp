import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Send, 
  Copy, 
  Check, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Lead, Customer, Job } from '../types';
import { qualifyLeadAI } from '../services/geminiService';

interface LeadsViewProps {
  leads: Lead[];
  onSaveLead: (lead: Lead) => void;
  onConvertLeadToCustomer: (lead: Lead) => void;
  onOpenCustomerComm: (lead: Lead) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onSaveLead,
  onConvertLeadToCustomer,
  onOpenCustomerComm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const [copiedReply, setCopiedReply] = useState(false);
  const [isQualifying, setIsQualifying] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Toronto',
    serviceRequested: 'deep_clean',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    preferredDate: '2026-08-28',
    message: '',
    status: 'new'
  });

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunAIQualification = async (lead: Lead) => {
    setIsQualifying(true);
    try {
      const result = await qualifyLeadAI({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        serviceRequested: lead.serviceRequested,
        bedrooms: lead.bedrooms,
        bathrooms: lead.bathrooms,
        sqft: lead.sqft,
        preferredDate: lead.preferredDate,
        message: lead.message,
        address: `${lead.address}, ${lead.city}`
      });

      const updatedLead: Lead = {
        ...lead,
        aiScore: result.score,
        aiAnalysis: result.reasoning,
        suggestedReply: result.suggestedReply,
        estimatedValue: result.estimatedQuote,
        status: 'qualified'
      };

      onSaveLead(updatedLead);
      setSelectedLead(updatedLead);
    } catch (err) {
      console.error(err);
    } finally {
      setIsQualifying(false);
    }
  };

  const handleCopyReply = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  const handleCreateLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email) return;

    const created: Lead = {
      id: 'lead-' + Date.now(),
      name: newLead.name || '',
      email: newLead.email || '',
      phone: newLead.phone || '',
      address: newLead.address || '',
      city: newLead.city || 'Toronto',
      propertyType: newLead.propertyType || 'residential',
      serviceRequested: newLead.serviceRequested || 'standard',
      bedrooms: newLead.bedrooms || 2,
      bathrooms: newLead.bathrooms || 1,
      sqft: newLead.sqft || 1000,
      frequency: newLead.frequency || 'one_time',
      preferredDate: newLead.preferredDate || '2026-08-28',
      message: newLead.message || '',
      source: 'website_form',
      status: 'new',
      estimatedValue: newLead.estimatedValue || 200,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSaveLead(created);
    setSelectedLead(created);
    setIsAddModalOpen(false);

    // Auto-run AI qualification
    handleRunAIQualification(created);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600" />
            Inbound Leads & AI Qualification
          </h1>
          <p className="text-xs text-slate-500">
            Real-time inquiries from crispcleaners.ca scored and analyzed by Gemini 2.5 Flash
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Record New Lead
        </button>
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leads List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads by name, email, city..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredLeads.map(lead => {
              const isSelected = selectedLead?.id === lead.id;

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-teal-50/70 border-teal-400 shadow-xs ring-1 ring-teal-400/30' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-slate-900">{lead.name}</h3>
                    {lead.aiScore ? (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        lead.aiScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        AI Score: {lead.aiScore}/100
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
                        Unscored
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 font-medium text-xs capitalize">
                    {lead.serviceRequested.replace('_', ' ')} • {lead.city}
                  </p>

                  <p className="text-slate-500 text-[11px] line-clamp-2 mt-1 italic">
                    "{lead.message}"
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-teal-700">
                      Est. ${lead.estimatedValue || 180} CAD
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      lead.status === 'qualified' ? 'bg-emerald-50 text-emerald-700' :
                      lead.status === 'converted' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lead Strategic Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedLead ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedLead.name}</h2>
                    {selectedLead.aiScore && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        AI Score: {selectedLead.aiScore}/100
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inquiry received {selectedLead.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunAIQualification(selectedLead)}
                    disabled={isQualifying}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    {isQualifying ? 'Analyzing...' : 'Re-Score AI'}
                  </button>

                  <button
                    onClick={() => onConvertLeadToCustomer(selectedLead)}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>Convert to Customer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Specs & Inquiry Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Contact Info</span>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{selectedLead.address}, {selectedLead.city}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Service Request</span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <strong className="capitalize font-semibold text-slate-800">{selectedLead.serviceRequested.replace('_', ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Layout / Specs:</span>
                    <strong className="font-semibold text-slate-800">{selectedLead.bedrooms} Beds, {selectedLead.bathrooms} Baths ({selectedLead.sqft} sqft)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Date:</span>
                    <strong className="font-semibold text-teal-800">{selectedLead.preferredDate}</strong>
                  </div>
                </div>
              </div>

              {/* Message from Prospect */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Customer's Original Message</span>
                <p className="text-slate-800 italic leading-relaxed">
                  "{selectedLead.message}"
                </p>
              </div>

              {/* AI Strategic Assessment */}
              {selectedLead.aiQualification && (
                <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      Gemini AI Strategic Qualification & Pricing Insight
                    </span>
                    <span className="font-bold text-teal-800">Est. Quote: ${selectedLead.estimatedValue} CAD</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedLead.aiQualification}
                  </p>
                </div>
              )}

              {/* AI Suggested Reply */}
              {selectedLead.suggestedReply && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-teal-600" />
                      AI Suggested Personalized Outreach
                    </span>
                    <button
                      onClick={() => handleCopyReply(selectedLead.suggestedReply!)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-semibold text-slate-700 flex items-center gap-1 text-[11px] transition-colors"
                    >
                      {copiedReply ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedReply ? 'Copied!' : 'Copy Reply'}
                    </button>
                  </div>
                  <p className="text-slate-700 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-sans">
                    {selectedLead.suggestedReply}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              Select a lead from the list to view the AI analysis.
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Record New Inbound Lead</h3>

            <form onSubmit={handleCreateLeadSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Prospect Name</label>
                <input
                  type="text"
                  required
                  value={newLead.name || ''}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="Claire Montgomery"
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={newLead.email || ''}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="claire@domain.ca"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    required
                    value={newLead.phone || ''}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="(416) 555-0199"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Address / Neighborhood</label>
                  <input
                    type="text"
                    value={newLead.address || ''}
                    onChange={(e) => setNewLead({ ...newLead, address: e.target.value })}
                    placeholder="45 Forest Hill Rd"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={newLead.city || 'Toronto'}
                    onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Service</label>
                  <select
                    value={newLead.serviceRequested || 'standard'}
                    onChange={(e) => setNewLead({ ...newLead, serviceRequested: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="standard">Standard Clean</option>
                    <option value="deep_clean">Deep Clean</option>
                    <option value="commercial">Commercial</option>
                    <option value="move_in_out">Move-In/Out</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bedrooms</label>
                  <input
                    type="number"
                    value={newLead.bedrooms || 2}
                    onChange={(e) => setNewLead({ ...newLead, bedrooms: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bathrooms</label>
                  <input
                    type="number"
                    value={newLead.bathrooms || 1}
                    onChange={(e) => setNewLead({ ...newLead, bathrooms: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Inquiry Notes / Request Details</label>
                <textarea
                  rows={3}
                  value={newLead.message || ''}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  placeholder="Need bi-weekly cleaning starting next week, 2 dogs in house..."
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Save & Trigger AI Qualification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
