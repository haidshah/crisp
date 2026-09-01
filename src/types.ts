export type UserRole = 'admin' | 'staff' | 'cleaner';

export type PropertyType = 'residential' | 'commercial';

export type ServiceType = 
  | 'standard' 
  | 'deep_clean' 
  | 'residential'
  | 'window_cleaning'
  | 'commercial' 
  | 'restaurant'
  | 'airbnb'
  | 'garage_cleanout'
  | 'move_in_out' 
  | 'post_construction' 
  | 'window_carpet';

export type RecurringFrequency = 'one_time' | 'weekly' | 'biweekly' | 'monthly';

export type TimingArrivalWindow = 
  | 'morning_8_11' 
  | 'midday_11_2' 
  | 'afternoon_2_5' 
  | 'evening_5_9' 
  | 'flexible_anytime';

export type DispatchUrgency = 'standard' | 'priority_48h' | 'emergency_sameday';

export interface BookingTimingDetails {
  preferredDate: string;
  arrivalWindow: TimingArrivalWindow;
  flexibleTiming: boolean;
  alternateDate?: string;
  alternateWindow?: TimingArrivalWindow;
  urgency: DispatchUrgency;
  accessType?: 'home_present' | 'lockbox_code' | 'concierge_buzz' | 'hidden_key' | 'after_hours_key';
  accessNotes?: string;
}

export interface PartnerApplication {
  id: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone: string;
  primaryRegion: string;
  secondaryRegions: string[];
  partnerType: 'subcontractor' | 'franchise' | 'independent_cleaner' | 'crew_lead';
  experienceYears: number;
  teamSize: 'solo' | '2_cleaners' | '3_5_cleaners' | '6_plus';
  hasEquipmentAndSupplies: boolean;
  hasInsurance: boolean;
  hasWSIBOrBonding: boolean;
  qualifiedServices: ServiceType[];
  weeklyJobCapacity: number;
  availability: string[];
  vehicleAccess: boolean;
  notes?: string;
  status: 'pending' | 'reviewed' | 'region_locked' | 'approved' | 'declined';
  lockedRegionExpiry?: string;
  submittedAt: string;
}

export type ProvinceCode = 
  | 'ON' // Ontario
  | 'BC' // British Columbia
  | 'AB' // Alberta
  | 'QC' // Quebec
  | 'MB' // Manitoba
  | 'SK' // Saskatchewan
  | 'NS' // Nova Scotia
  | 'NB' // New Brunswick
  | 'NL' // Newfoundland and Labrador
  | 'PE' // Prince Edward Island
  | 'YT' // Yukon
  | 'NT' // Northwest Territories
  | 'NU'; // Nunavut

export interface RegionTerritory {
  id: string;
  name: string;
  code: string;
  city?: string;
  province?: ProvinceCode;
  provinceName?: string;
  postalPrefixes: string[];
  status: 'available' | 'locked' | 'high_demand' | 'limited_slots';
  activePartnerCount: number;
  maxPartnerSlots: number;
  assignedPartnerName?: string;
  averageWeeklyJobs: number;
  estimatedMonthlyEarnings: string;
  taxRate?: number;
  populationTier?: 'major_metro' | 'metro' | 'regional_hub' | 'growing_town';
}

export interface AdminAuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
  loginTime: string;
}

export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type InvoiceStatus = 'draft' | 'unpaid' | 'paid' | 'overdue';
export type PaymentStatus = InvoiceStatus;

export type PaymentMethod = 'credit_card' | 'interac_etransfer' | 'etransfer' | 'cash' | 'direct_deposit';

export type LeadStatus = 'new' | 'qualified' | 'contacted' | 'quoted' | 'converted' | 'archived';

export type LeadSource = 'website_form' | 'google_search' | 'referral' | 'phone_inquiry' | 'social_media';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  unit?: string;
  city: string;
  province: string;
  postalCode: string;
  propertyType: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  accessInstructions?: string;
  notes?: string;
  tags: string[];
  totalSpent: number;
  serviceCount: number;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  room?: string;
}

export interface CustomerFeedback {
  customerName?: string;
  rating: number; // 1-5
  review: string;
  date: string;
  aspects?: {
    cleanliness: number;
    punctuality: number;
    communication: number;
  };
}

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  propertyType: PropertyType;
  serviceType: ServiceType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationHours: number;
  recurringFrequency: RecurringFrequency;
  assignedCleanerIds: string[];
  assignedCleanerNames: string[];
  status: JobStatus;
  price: number;
  specialInstructions?: string;
  checklist: ChecklistItem[];
  cleanerNotes?: string;
  feedback?: CustomerFeedback;
  invoiceId?: string;
  createdAt: string;
}

export interface Cleaner {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'cleaner' | 'lead_cleaner' | 'team_lead';
  avatar: string;
  rating: number;
  status: 'available' | 'on_job' | 'off_duty';
  skills: string[];
  hourlyRate: number;
  serviceZones: string[];
  performanceNotes?: string;
  color: string;
}

export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
  amount?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  jobId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  issueDate: string;
  dueDate: string;
  lineItems?: InvoiceLineItem[];
  items?: any[];
  subtotal: number;
  taxRate?: number; // e.g. 0.13 for Ontario HST
  taxAmount?: number;
  tax?: number;
  total: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  paidAt?: string;
  paidDate?: string;
  notes?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  propertyType: PropertyType;
  serviceRequested: ServiceType;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  frequency: RecurringFrequency;
  preferredDate?: string;
  timingDetails?: BookingTimingDetails;
  selectedAddons?: string[];
  message: string;
  source: LeadSource;
  status: LeadStatus;
  estimatedValue: number;
  aiScore?: number; // 1-100
  aiPriority?: 'high' | 'medium' | 'low';
  aiAnalysis?: string;
  suggestedReply?: string;
  aiQualification?: any;
  createdAt: string;
}

export interface SmartRouteSuggestion {
  cleanerId: string;
  cleanerName: string;
  assignedJobIds: string[];
  estimatedTotalHours: number;
  estimatedTravelMinutes: number;
  routeOrder: {
    jobId: string;
    customerName: string;
    address: string;
    startTime: string;
    endTime: string;
  }[];
  reasoning: string;
}

export interface SmartNotesResult {
  formattedSummary: string;
  propertyCondition: string;
  suppliesUsedOrNeeded: string;
  customerPreferences: string;
  billingNotes: string;
  cleanerFeedbackSummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  toolInvocations?: {
    toolName: string;
    args: Record<string, any>;
    result?: any;
  }[];
  suggestedActions?: {
    label: string;
    actionType: string;
    payload: any;
  }[];
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  adminNotificationEmails: string[];
  updatedAt?: string;
  isConfigured?: boolean;
}

export interface UserLocationInfo {
  city: string;
  province: ProvinceCode;
  provinceName: string;
  taxRate: number;
  taxLabel: string;
  taxType: 'HST' | 'GST+PST' | 'GST+QST' | 'GST';
  isPrimaryArea: boolean; // Cambridge / Tri-Cities / GTA
  source: 'auto_detected' | 'manual_selection' | 'default_cambridge';
}

export interface FeedbackSummaryAnalysis {
  overallScore: number;
  totalReviewsAnalyzed: number;
  sentiment: 'exceptional' | 'positive' | 'neutral' | 'mixed' | 'negative';
  keyStrengths: string[];
  areasForImprovement: string[];
  topCleanersMentioned: {
    cleanerName: string;
    mentions: number;
    sentimentScore: number;
    notableQuote: string;
  }[];
  operationalRecommendations: string[];
}
