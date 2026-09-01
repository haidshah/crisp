import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { 
  Customer, 
  Cleaner, 
  Job, 
  Invoice, 
  Lead,
  PartnerApplication,
  RegionTerritory,
  AdminAuthUser
} from '../types';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_CLEANERS, 
  INITIAL_JOBS, 
  INITIAL_INVOICES, 
  INITIAL_LEADS,
  INITIAL_REGIONS,
  INITIAL_PARTNER_APPLICATIONS
} from '../data/seedData';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const STORAGE_KEYS = {
  CUSTOMERS: 'crisp_crm_customers_v1',
  CLEANERS: 'crisp_crm_cleaners_v1',
  JOBS: 'crisp_crm_jobs_v1',
  INVOICES: 'crisp_crm_invoices_v1',
  LEADS: 'crisp_crm_leads_v1',
  PARTNERS: 'crisp_crm_partners_v1',
  REGIONS: 'crisp_crm_regions_v1',
  ADMIN_AUTH: 'crisp_admin_auth_v1',
  FIREBASE_CONFIG: 'crisp_firebase_config_v1',
  USE_FIREBASE: 'crisp_use_firebase_v1'
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Initialize Firebase if configured
export function initFirebase(config?: FirebaseConfig) {
  try {
    const activeConfig = config || getStoredFirebaseConfig();
    if (activeConfig && activeConfig.projectId && activeConfig.apiKey) {
      if (!getApps().length) {
        app = initializeApp(activeConfig);
      } else {
        app = getApps()[0];
      }
      db = getFirestore(app);
      auth = getAuth(app);
      console.log('Firebase initialized successfully for project:', activeConfig.projectId);
      return true;
    }
  } catch (err) {
    console.warn('Firebase init error:', err);
  }
  return false;
}

export function getStoredFirebaseConfig(): FirebaseConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore
  }
  return null;
}

export function saveFirebaseConfig(config: FirebaseConfig) {
  localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(config));
  localStorage.setItem(STORAGE_KEYS.USE_FIREBASE, 'true');
  initFirebase(config);
}

export function isFirebaseActive(): boolean {
  return !!db && localStorage.getItem(STORAGE_KEYS.USE_FIREBASE) === 'true';
}

export function setUseFirebase(use: boolean) {
  localStorage.setItem(STORAGE_KEYS.USE_FIREBASE, use ? 'true' : 'false');
}

// Local Storage + Reactive Sync Fallback Engine
export const CRMStore = {
  getCustomers(): Customer[] {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!saved) {
      this.saveCustomers(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_CUSTOMERS;
    }
  },

  saveCustomers(customers: Customer[]) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  saveCustomer(customer: Customer) {
    const list = this.getCustomers();
    const idx = list.findIndex(c => c.id === customer.id);
    if (idx >= 0) {
      list[idx] = customer;
    } else {
      list.unshift(customer);
    }
    this.saveCustomers(list);
  },

  deleteCustomer(customerId: string) {
    const list = this.getCustomers().filter(c => c.id !== customerId);
    this.saveCustomers(list);
  },

  getCleaners(): Cleaner[] {
    const saved = localStorage.getItem(STORAGE_KEYS.CLEANERS);
    if (!saved) {
      this.saveCleaners(INITIAL_CLEANERS);
      return INITIAL_CLEANERS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_CLEANERS;
    }
  },

  saveCleaners(cleaners: Cleaner[]) {
    localStorage.setItem(STORAGE_KEYS.CLEANERS, JSON.stringify(cleaners));
  },

  saveCleaner(cleaner: Cleaner) {
    const list = this.getCleaners();
    const idx = list.findIndex(c => c.id === cleaner.id);
    if (idx >= 0) {
      list[idx] = cleaner;
    } else {
      list.unshift(cleaner);
    }
    this.saveCleaners(list);
  },

  getJobs(): Job[] {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (!saved) {
      this.saveJobs(INITIAL_JOBS);
      return INITIAL_JOBS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_JOBS;
    }
  },

  saveJobs(jobs: Job[]) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  },

  saveJob(job: Job) {
    const list = this.getJobs();
    const idx = list.findIndex(j => j.id === job.id);
    if (idx >= 0) {
      list[idx] = job;
    } else {
      list.unshift(job);
    }
    this.saveJobs(list);
  },

  deleteJob(jobId: string) {
    const list = this.getJobs().filter(j => j.id !== jobId);
    this.saveJobs(list);
  },

  getInvoices(): Invoice[] {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!saved) {
      this.saveInvoices(INITIAL_INVOICES);
      return INITIAL_INVOICES;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_INVOICES;
    }
  },

  saveInvoices(invoices: Invoice[]) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },

  saveInvoice(invoice: Invoice) {
    const list = this.getInvoices();
    const idx = list.findIndex(i => i.id === invoice.id);
    if (idx >= 0) {
      list[idx] = invoice;
    } else {
      list.unshift(invoice);
    }
    this.saveInvoices(list);
  },

  getLeads(): Lead[] {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (!saved) {
      this.saveLeads(INITIAL_LEADS);
      return INITIAL_LEADS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_LEADS;
    }
  },

  saveLeads(leads: Lead[]) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  },

  saveLead(lead: Lead) {
    const list = this.getLeads();
    const idx = list.findIndex(l => l.id === lead.id);
    if (idx >= 0) {
      list[idx] = lead;
    } else {
      list.unshift(lead);
    }
    this.saveLeads(list);
  },

  getPartnerApplications(): PartnerApplication[] {
    const saved = localStorage.getItem(STORAGE_KEYS.PARTNERS);
    if (!saved) {
      this.savePartnerApplications(INITIAL_PARTNER_APPLICATIONS);
      return INITIAL_PARTNER_APPLICATIONS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_PARTNER_APPLICATIONS;
    }
  },

  savePartnerApplications(partners: PartnerApplication[]) {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
  },

  savePartnerApplication(partner: PartnerApplication) {
    const list = this.getPartnerApplications();
    const idx = list.findIndex(p => p.id === partner.id);
    if (idx >= 0) {
      list[idx] = partner;
    } else {
      list.unshift(partner);
    }
    this.savePartnerApplications(list);
  },

  deletePartnerApplication(partnerId: string) {
    const list = this.getPartnerApplications().filter(p => p.id !== partnerId);
    this.savePartnerApplications(list);
  },

  getRegions(): RegionTerritory[] {
    const saved = localStorage.getItem(STORAGE_KEYS.REGIONS);
    if (!saved) {
      this.saveRegions(INITIAL_REGIONS);
      return INITIAL_REGIONS;
    }
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_REGIONS.length) {
        return parsed;
      }
      // Merge with INITIAL_REGIONS to ensure all Canadian provinces and cities are available
      const existingMap = new Map<string, RegionTerritory>(
        parsed.map((r: RegionTerritory) => [r.id, r])
      );
      const merged = INITIAL_REGIONS.map(reg => {
        const existing = existingMap.get(reg.id);
        return existing ? { ...reg, ...existing } : reg;
      });
      this.saveRegions(merged);
      return merged;
    } catch {
      return INITIAL_REGIONS;
    }
  },

  saveRegions(regions: RegionTerritory[]) {
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions));
  },

  saveRegion(region: RegionTerritory) {
    const list = this.getRegions();
    const idx = list.findIndex(r => r.id === region.id);
    if (idx >= 0) {
      list[idx] = region;
    } else {
      list.push(region);
    }
    this.saveRegions(list);
  },

  getAdminAuth(): AdminAuthUser | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  },

  setAdminAuth(user: AdminAuthUser | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.CLEANERS, JSON.stringify(INITIAL_CLEANERS));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(INITIAL_PARTNER_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(INITIAL_REGIONS));
  },

  resetToDefaults() {
    this.resetAllData();
  }
};

// Initialize on load
initFirebase();
