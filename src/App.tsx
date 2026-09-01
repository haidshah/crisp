import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { JobManagement } from './components/JobManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { CleanersView } from './components/CleanersView';
import { InvoicingView } from './components/InvoicingView';
import { LeadsView } from './components/LeadsView';
import { WebsiteLeadForm } from './components/WebsiteLeadForm';
import { FeedbackAnalyticsModal } from './components/FeedbackAnalyticsModal';
import { FieldCleanerPortal } from './components/FieldCleanerPortal';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { SmartSchedulingModal } from './components/SmartSchedulingModal';
import { SmartNotesModal } from './components/SmartNotesModal';
import { CustomerCommModal } from './components/CustomerCommModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PartnerApplicationsView } from './components/PartnerApplicationsView';
import { SMTPConfigView } from './components/SMTPConfigView';

// Customer-Facing Website Components
import { WebsiteHeader, WebsitePageView } from './components/website/WebsiteHeader';
import { WebsiteFooter } from './components/website/WebsiteFooter';
import { MainLandingPage } from './components/website/MainLandingPage';
import { ServiceBookingModal } from './components/website/ServiceBookingModal';
import { ResidentialPage } from './components/website/pages/ResidentialPage';
import { WindowCleaningPage } from './components/website/pages/WindowCleaningPage';
import { CommercialCleaningPage } from './components/website/pages/CommercialCleaningPage';
import { AirbnbPage } from './components/website/pages/AirbnbPage';
import { GarageCleanoutPage } from './components/website/pages/GarageCleanoutPage';
import { MoveInOutPage } from './components/website/pages/MoveInOutPage';
import { PartnerProgramPage } from './components/website/pages/PartnerProgramPage';
import { EmailService } from './services/emailService';

import { CRMStore } from './lib/firebase';
import { 
  Customer, 
  Job, 
  Cleaner, 
  Invoice, 
  Lead, 
  UserRole, 
  JobStatus, 
  PaymentStatus, 
  PaymentMethod,
  PartnerApplication,
  RegionTerritory,
  AdminAuthUser,
  ServiceType
} from './types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Search, 
  MapPin, 
  ArrowRight,
  Briefcase,
  Users,
  Receipt,
  Globe,
  Lock,
  LogOut
} from 'lucide-react';

export default function App() {
  // App View Modes: 'website' (customer-facing) vs 'crm' (management & dispatch operations)
  const [appMode, setAppMode] = useState<'website' | 'crm'>('website');
  const [websiteView, setWebsiteView] = useState<WebsitePageView>('home');

  // CRM Entity States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [partnerApps, setPartnerApps] = useState<PartnerApplication[]>([]);
  const [regions, setRegions] = useState<RegionTerritory[]>([]);

  // Admin Auth Session
  const [adminUser, setAdminUser] = useState<AdminAuthUser | null>(() => CRMStore.getAdminAuth());
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Customer Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalInitialService, setBookingModalInitialService] = useState<ServiceType>('residential');

  // Navigation & Role in CRM
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(adminUser ? adminUser.role : 'admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // CRM Operational Modals
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Contextual Modals
  const [smartNotesJob, setSmartNotesJob] = useState<Job | null>(null);
  const [commModalData, setCommModalData] = useState<{ data: any; type: 'confirmation' | 'reminder' | 'review_request' } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Initialize data on mount
  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = () => {
    setCustomers(CRMStore.getCustomers());
    setJobs(CRMStore.getJobs());
    setCleaners(CRMStore.getCleaners());
    setInvoices(CRMStore.getInvoices());
    setLeads(CRMStore.getLeads());
    setPartnerApps(CRMStore.getPartnerApplications());
    setRegions(CRMStore.getRegions());
  };

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Admin Login / Logout
  const handleAdminLoginSuccess = (user: AdminAuthUser) => {
    setAdminUser(user);
    CRMStore.setAdminAuth(user);
    setCurrentRole(user.role);
    setIsAdminLoginModalOpen(false);
    setAppMode('crm');
    showToast(`Welcome back, ${user.name}! Logged in as ${user.role.toUpperCase()}`);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    CRMStore.setAdminAuth(null);
    setAppMode('website');
    showToast('Logged out of Admin Portal.', 'info');
  };

  // Open booking modal helper
  const handleOpenBookingModal = (service: ServiceType = 'residential') => {
    setBookingModalInitialService(service);
    setIsBookingModalOpen(true);
  };

  // Customer Booking Lead Submission
  const handleCustomerBookingSubmit = (lead: Lead) => {
    handleSaveLead(lead);
    EmailService.sendBookingNotification(lead).catch(err => {
      console.warn('Booking notification email sent:', err);
    });
    showToast(`Cleaning request confirmed for ${lead.name}! Reference #${lead.id}`);
  };

  // Role switch handler inside CRM
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'cleaner') {
      setCurrentTab('field-app');
      showToast('Switched to Cleaner Field Portal View', 'info');
    } else if (currentTab === 'field-app') {
      setCurrentTab('dashboard');
      showToast(`Switched to ${role === 'admin' ? 'Admin' : 'Staff'} Mode`, 'info');
    }
  };

  // Customer Actions
  const handleSaveCustomer = (customer: Customer) => {
    CRMStore.saveCustomer(customer);
    setCustomers(CRMStore.getCustomers());
    showToast(`Customer ${customer.name} saved successfully`);
  };

  const handleDeleteCustomer = (id: string) => {
    CRMStore.deleteCustomer(id);
    setCustomers(CRMStore.getCustomers());
    showToast('Customer deleted', 'info');
  };

  // Job Actions
  const handleSaveJob = (job: Job) => {
    CRMStore.saveJob(job);
    setJobs(CRMStore.getJobs());
    showToast(`Job #${job.id} saved`);
  };

  const handleDeleteJob = (id: string) => {
    CRMStore.deleteJob(id);
    setJobs(CRMStore.getJobs());
    showToast('Job removed', 'info');
  };

  const handleUpdateJobStatus = (jobId: string, status: JobStatus) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const updatedJob = { ...job, status };
      CRMStore.saveJob(updatedJob);
      setJobs(CRMStore.getJobs());
      showToast(`Job #${jobId} marked as ${status.replace('_', ' ').toUpperCase()}`);
    }
  };

  const handleToggleChecklistItem = (jobIdOrJob: string | Job, itemIndexOrId: number | string) => {
    const jobId = typeof jobIdOrJob === 'string' ? jobIdOrJob : jobIdOrJob.id;
    const job = jobs.find(j => j.id === jobId);
    if (job && job.checklist) {
      const updatedChecklist = job.checklist.map((item, idx) => {
        if (typeof itemIndexOrId === 'number' && idx === itemIndexOrId) {
          return { ...item, completed: !item.completed };
        } else if (typeof itemIndexOrId === 'string' && item.id === itemIndexOrId) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });
      const updatedJob = { ...job, checklist: updatedChecklist };
      CRMStore.saveJob(updatedJob);
      setJobs(CRMStore.getJobs());
    }
  };

  // Cleaner Actions
  const handleSaveCleaner = (cleaner: Cleaner) => {
    CRMStore.saveCleaner(cleaner);
    setCleaners(CRMStore.getCleaners());
    showToast(`Cleaner ${cleaner.name} profile updated`);
  };

  // Invoice Actions
  const handleSaveInvoice = (invoice: Invoice) => {
    CRMStore.saveInvoice(invoice);
    setInvoices(CRMStore.getInvoices());
    showToast(`Invoice #${invoice.invoiceNumber} saved`);
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, status: PaymentStatus, method?: PaymentMethod) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
      const updated: Invoice = {
        ...invoice,
        status,
        paymentMethod: method || invoice.paymentMethod,
        paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : invoice.paidDate
      };
      CRMStore.saveInvoice(updated);
      setInvoices(CRMStore.getInvoices());
      showToast(`Invoice #${invoice.invoiceNumber} marked as ${status.toUpperCase()}`);
    }
  };

  // Convert Job to Invoice
  const handleAutoGenerateInvoice = (job: Job) => {
    const newInvoice: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      jobId: job.id,
      customerId: job.customerId,
      customerName: job.customerName,
      customerEmail: 'customer@example.com',
      customerAddress: job.customerAddress,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'unpaid',
      lineItems: [
        {
          description: `${job.serviceType.replace('_', ' ').toUpperCase()} Cleaning Service (${job.date})`,
          quantity: 1,
          unitPrice: job.price,
          total: job.price
        }
      ],
      subtotal: job.price,
      taxRate: 0.13,
      taxAmount: +(job.price * 0.13).toFixed(2),
      total: +(job.price * 1.13).toFixed(2),
      notes: 'Thank you for choosing Crisp Cleaners!'
    };
    CRMStore.saveInvoice(newInvoice);
    setInvoices(CRMStore.getInvoices());
    showToast(`Invoice generated for Job #${job.id}`);
  };

  // Lead Actions
  const handleSaveLead = (lead: Lead) => {
    CRMStore.saveLead(lead);
    setLeads(CRMStore.getLeads());
  };

  const handleConvertLeadToCustomer = (lead: Lead) => {
    // 1. Create Customer
    const newCustomer: Customer = {
      id: 'cust-' + Date.now(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      city: lead.city || 'Toronto',
      province: 'ON',
      postalCode: 'M5V 2T6',
      propertyType: lead.propertyType,
      bedrooms: lead.bedrooms,
      bathrooms: lead.bathrooms,
      sqft: lead.sqft,
      notes: `Converted from lead (${lead.source}). ${lead.message || ''}`,
      tags: ['Converted Lead', lead.serviceRequested],
      totalSpent: 0,
      serviceCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    CRMStore.saveCustomer(newCustomer);
    setCustomers(CRMStore.getCustomers());

    // 2. Create Initial Job
    const assignedCleaners = cleaners.slice(0, 1);
    const newJob: Job = {
      id: 'job-' + Date.now(),
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      customerPhone: newCustomer.phone,
      customerAddress: newCustomer.address,
      customerCity: newCustomer.city,
      propertyType: newCustomer.propertyType,
      serviceType: lead.serviceRequested,
      date: lead.preferredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: lead.timingDetails?.arrivalWindow === 'morning_8_11' ? '08:30' : lead.timingDetails?.arrivalWindow === 'afternoon_2_5' ? '14:00' : '11:00',
      durationHours: 3.0,
      recurringFrequency: lead.frequency,
      assignedCleanerIds: assignedCleaners.map(c => c.id),
      assignedCleanerNames: assignedCleaners.map(c => c.name),
      status: 'scheduled',
      price: lead.estimatedValue,
      checklist: [
        { id: 'chk-1', task: 'Kitchen sanitization & countertop wipe', completed: false, room: 'Kitchen' },
        { id: 'chk-2', task: 'Bathroom descaling & toilet scrub', completed: false, room: 'Bathrooms' },
        { id: 'chk-3', task: 'Hardwood mopping & HEPA vacuuming', completed: false, room: 'Floors' },
        { id: 'chk-4', task: 'Trash disposal & high-touch disinfection', completed: false, room: 'General' }
      ],
      specialInstructions: `Access: ${lead.timingDetails?.accessType || 'Standard'}. ${lead.message || ''}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    CRMStore.saveJob(newJob);
    setJobs(CRMStore.getJobs());

    // 3. Mark Lead as Converted
    const updatedLead: Lead = { ...lead, status: 'converted' };
    CRMStore.saveLead(updatedLead);
    setLeads(CRMStore.getLeads());

    showToast(`Lead converted to Customer & Job scheduled!`);
    setCurrentTab('jobs');
  };

  // Partner Application Actions
  const handleSavePartnerApplication = (app: PartnerApplication) => {
    CRMStore.savePartnerApplication(app);
    setPartnerApps(CRMStore.getPartnerApplications());
    showToast(`Partner application for ${app.fullName} saved!`);
  };

  const handleDeletePartnerApplication = (id: string) => {
    CRMStore.deletePartnerApplication(id);
    setPartnerApps(CRMStore.getPartnerApplications());
    showToast('Partner application removed', 'info');
  };

  const handleSaveRegion = (region: RegionTerritory) => {
    CRMStore.saveRegion(region);
    setRegions(CRMStore.getRegions());
    showToast(`Territory ${region.name} updated`);
  };

  const handleConvertPartnerToCleaner = (partner: PartnerApplication) => {
    const newCleaner: Cleaner = {
      id: 'cleaner-' + Date.now(),
      name: partner.fullName,
      email: partner.email,
      phone: partner.phone,
      role: 'team_lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      status: 'available',
      skills: partner.qualifiedServices.map(s => s.replace('_', ' ')),
      hourlyRate: 45,
      serviceZones: [partner.primaryRegion, ...partner.secondaryRegions],
      performanceNotes: `Vetted Partner (${partner.partnerType}). ${partner.experienceYears} yrs experience.`,
      color: '#0d9488'
    };
    CRMStore.saveCleaner(newCleaner);
    setCleaners(CRMStore.getCleaners());
    showToast(`Approved & added ${partner.fullName} to Active Cleaners roster!`);
  };

  const handleSaveSmartNotes = (jobId: string, notes: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const updatedJob = { ...job, notes };
      CRMStore.saveJob(updatedJob);
      setJobs(CRMStore.getJobs());
      showToast('Smart Notes saved to Job');
    }
  };

  const handleResetData = () => {
    CRMStore.resetAllData();
    loadCRMData();
    showToast('All CRM demo data reset to default seed!');
  };

  // Current cleaner for field app
  const currentCleanerUser = cleaners[0] || {
    id: 'cleaner-1',
    name: 'Sarah Tremblay',
    email: 'sarah@crispcleaners.ca',
    phone: '(416) 555-0144',
    rating: 4.96,
    totalJobsDone: 142,
    status: 'active',
    role: 'crew_lead',
    primaryRegion: 'Downtown Toronto (M5 / M4)',
    insuranceVerified: true,
    specialties: ['residential', 'deep_clean', 'airbnb', 'move_in_out']
  };

  // Counts for Badges
  const leadCount = leads.filter(l => l.status === 'new').length;
  const overdueInvoiceCount = invoices.filter(i => i.status === 'overdue' || (i.status === 'unpaid' && new Date(i.dueDate) < new Date())).length;
  const todayJobCount = jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length;
  const partnerAppCount = partnerApps.filter(p => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Dynamic Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold ${
            toastMessage.type === 'success' 
              ? 'bg-slate-900 text-white border-teal-500' 
              : 'bg-teal-50 text-teal-900 border-teal-200'
          }`}>
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CUSTOMER-FACING FRONT-END WEBSITE VIEW */}
      {/* ========================================================================= */}
      {appMode === 'website' ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <WebsiteHeader
            currentView={websiteView}
            onNavigateView={(view) => {
              setWebsiteView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBookingModal={handleOpenBookingModal}
            onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
            isAdminLoggedIn={!!adminUser}
            onNavigateToCRM={() => setAppMode('crm')}
          />

          {/* Body based on active website view */}
          <main className="flex-1">
            {websiteView === 'home' && (
              <MainLandingPage
                onNavigateView={(view) => {
                  setWebsiteView(view);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenBookingModal={handleOpenBookingModal}
                regions={regions}
              />
            )}

            {websiteView === 'residential' && (
              <ResidentialPage onOpenBookingModal={handleOpenBookingModal} />
            )}

            {websiteView === 'window_cleaning' && (
              <WindowCleaningPage onOpenBookingModal={handleOpenBookingModal} />
            )}

            {websiteView === 'commercial' && (
              <CommercialCleaningPage onOpenBookingModal={handleOpenBookingModal} />
            )}

            {websiteView === 'airbnb' && (
              <AirbnbPage onOpenBookingModal={handleOpenBookingModal} />
            )}

            {websiteView === 'garage_cleanout' && (
              <GarageCleanoutPage onOpenBookingModal={handleOpenBookingModal} />
            )}

            {websiteView === 'move_in_out' && (
              <MoveInOutPage onOpenBookingModal={handleOpenBookingModal} />
            )}

            {websiteView === 'partner_program' && (
              <PartnerProgramPage
                regions={regions}
                onSubmitApplication={handleSavePartnerApplication}
              />
            )}
          </main>

          {/* Footer */}
          <WebsiteFooter
            onNavigateView={(view) => {
              setWebsiteView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBookingModal={() => handleOpenBookingModal()}
            onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
          />
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. ADMIN & STAFF CRM MANAGEMENT WORKSPACE */
        /* ========================================================================= */
        <div className="flex-1 flex flex-col">
          {/* Top Operational Navbar */}
          <Navbar
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            onOpenAIModal={() => setIsAIOpen(true)}
            onOpenSettings={() => setIsFirebaseModalOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            pendingLeadsCount={leadCount}
            onSwitchToWebsite={() => setAppMode('website')}
          />

          <div className="flex-1 flex flex-row">
            {/* Sidebar */}
            <Sidebar
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              currentRole={currentRole}
              leadCount={leadCount}
              partnerAppCount={partnerAppCount}
              overdueInvoiceCount={overdueInvoiceCount}
              todayJobCount={todayJobCount}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main CRM Workspace Area */}
            <main className="flex-1 overflow-x-hidden min-w-0 bg-slate-50">
              {currentTab === 'dashboard' && (
                <Dashboard
                  jobs={jobs}
                  customers={customers}
                  cleaners={cleaners}
                  invoices={invoices}
                  leads={leads}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onOpenNewJob={() => setCurrentTab('jobs')}
                  onOpenSmartScheduling={() => setIsSchedulingOpen(true)}
                  onOpenAIModal={() => setIsAIOpen(true)}
                  onOpenSmartNotes={(job) => setSmartNotesJob(job)}
                  onOpenCustomerComm={(job, type) => setCommModalData({ data: job, type })}
                  onSelectLead={(lead) => setCurrentTab('leads')}
                  onUpdateJobStatus={handleUpdateJobStatus}
                />
              )}

              {currentTab === 'calendar' && (
                <CalendarView
                  jobs={jobs}
                  cleaners={cleaners}
                  customers={customers}
                  onOpenNewJob={() => setCurrentTab('jobs')}
                  onOpenJobDetails={(job) => setCurrentTab('jobs')}
                  onOpenSmartScheduling={() => setIsSchedulingOpen(true)}
                  onUpdateJobDate={(jobId, date, time) => {
                    const j = jobs.find(job => job.id === jobId);
                    if (j) handleSaveJob({ ...j, date, time });
                  }}
                />
              )}

              {currentTab === 'jobs' && (
                <JobManagement
                  jobs={jobs}
                  customers={customers}
                  cleaners={cleaners}
                  onSaveJob={handleSaveJob}
                  onDeleteJob={handleDeleteJob}
                  onGenerateInvoice={handleAutoGenerateInvoice}
                  onOpenSmartNotes={(job) => setSmartNotesJob(job)}
                  onOpenCustomerComm={(job, type) => setCommModalData({ data: job, type })}
                />
              )}

              {currentTab === 'customers' && (
                <CustomerManagement
                  customers={customers}
                  jobs={jobs}
                  onSaveCustomer={handleSaveCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  onOpenNewJobForCustomer={(cust) => setCurrentTab('jobs')}
                  onOpenCustomerComm={(cust, type) => setCommModalData({ data: cust, type })}
                />
              )}

              {currentTab === 'cleaners' && (
                <CleanersView
                  cleaners={cleaners}
                  jobs={jobs}
                  onSaveCleaner={handleSaveCleaner}
                  onOpenJobDetails={(job) => setCurrentTab('jobs')}
                />
              )}

              {currentTab === 'invoicing' && (
                <InvoicingView
                  invoices={invoices}
                  customers={customers}
                  onSaveInvoice={handleSaveInvoice}
                  onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                  onOpenCustomerComm={(inv, type) => setCommModalData({ data: inv, type })}
                />
              )}

              {currentTab === 'leads' && (
                <LeadsView
                  leads={leads}
                  onSaveLead={handleSaveLead}
                  onConvertLeadToCustomer={handleConvertLeadToCustomer}
                  onOpenCustomerComm={(lead) => setCommModalData({ data: lead, type: 'confirmation' })}
                />
              )}

              {currentTab === 'partners' && (
                <PartnerApplicationsView
                  applications={partnerApps}
                  regions={regions}
                  cleaners={cleaners}
                  onSaveApplication={handleSavePartnerApplication}
                  onDeleteApplication={handleDeletePartnerApplication}
                  onSaveRegion={handleSaveRegion}
                  onConvertToCleaner={handleConvertPartnerToCleaner}
                />
              )}

              {currentTab === 'website-form' && (
                <WebsiteLeadForm
                  onSubmitLead={(lead) => {
                    handleSaveLead(lead);
                    showToast(`New inquiry received from ${lead.name} and auto-routed to Leads Pipeline!`);
                  }}
                />
              )}

              {currentTab === 'feedback' && (
                <FeedbackAnalyticsModal
                  isOpen={true}
                  onClose={() => setCurrentTab('dashboard')}
                  jobs={jobs}
                />
              )}

              {currentTab === 'field-app' && (
                <FieldCleanerPortal
                  jobs={jobs}
                  currentCleaner={currentCleanerUser as Cleaner}
                  onUpdateJobStatus={handleUpdateJobStatus}
                  onToggleChecklist={handleToggleChecklistItem}
                  onOpenSmartNotes={(job) => setSmartNotesJob(job)}
                />
              )}

              {currentTab === 'smtp-settings' && (
                <div className="p-6 max-w-5xl mx-auto">
                  <SMTPConfigView />
                </div>
              )}

              {currentTab === 'settings' && (
                <div className="p-6 max-w-4xl mx-auto space-y-6">
                  {/* Admin User Info Card */}
                  {adminUser && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
                          {adminUser.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{adminUser.name}</h3>
                          <p className="text-xs text-slate-500">
                            Username: <strong className="text-slate-800">{adminUser.username}</strong> • Role: <strong className="text-teal-700 uppercase">{adminUser.role}</strong>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleAdminLogout}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}

                  <FirebaseConfigModal
                    isOpen={true}
                    onClose={() => setCurrentTab('dashboard')}
                    onResetData={handleResetData}
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GLOBAL MODALS (Booking Wizard, Admin Auth, AI Copilot, Smart Notes, Dispatch) */}
      {/* ========================================================================= */}
      {/* Customer Interactive Booking & Timing Modal */}
      <ServiceBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialService={bookingModalInitialService}
        onSubmitBooking={handleCustomerBookingSubmit}
      />

      {/* Admin Username/Password Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Global AI Copilot Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        jobs={jobs}
        customers={customers}
        cleaners={cleaners}
        invoices={invoices}
        leads={leads}
      />

      {/* Smart Route & Dispatch Optimizer Modal */}
      <SmartSchedulingModal
        isOpen={isSchedulingOpen}
        onClose={() => setIsSchedulingOpen(false)}
        jobs={jobs}
        cleaners={cleaners}
      />

      {/* AI Smart Notes Cleaner Modal */}
      <SmartNotesModal
        isOpen={!!smartNotesJob}
        onClose={() => setSmartNotesJob(null)}
        job={smartNotesJob}
        onSaveNotes={handleSaveSmartNotes}
      />

      {/* Automated Customer Dispatch Modal */}
      {commModalData && (
        <CustomerCommModal
          isOpen={true}
          onClose={() => setCommModalData(null)}
          targetData={commModalData.data}
          initialType={commModalData.type}
        />
      )}

      {/* Firebase Settings Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onResetData={handleResetData}
      />
    </div>
  );
}
