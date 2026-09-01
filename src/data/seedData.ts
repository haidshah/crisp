import { Customer, Cleaner, Job, Invoice, Lead, CustomerFeedback, PartnerApplication, RegionTerritory } from '../types';
import { ALL_CANADIAN_REGIONS } from './canadianLocations';

export const INITIAL_CLEANERS: Cleaner[] = [
  {
    id: 'cleaner-1',
    name: 'Sarah Tremblay',
    email: 'sarah.t@crispcleaners.ca',
    phone: '(416) 555-0142',
    role: 'team_lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    status: 'on_job',
    skills: ['Deep Clean Specialist', 'Eco-Friendly Chem', 'Commercial Sites', 'Move-in Sanitization'],
    hourlyRate: 34.00,
    serviceZones: ['Downtown Toronto', 'Yorkville', 'The Annex'],
    performanceNotes: 'Punctual, thorough, client favorite for luxury condos.',
    color: '#0d9488' // teal-600
  },
  {
    id: 'cleaner-2',
    name: 'Marcus Chen',
    email: 'marcus.c@crispcleaners.ca',
    phone: '(416) 555-0188',
    role: 'lead_cleaner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    status: 'available',
    skills: ['Hardwood Polishing', 'Commercial Office', 'Window Washing', 'Post-Construction'],
    hourlyRate: 31.50,
    serviceZones: ['North York', 'Midtown', 'Etobicoke'],
    performanceNotes: 'Fast, great equipment maintenance, high efficiency on large homes.',
    color: '#0284c7' // sky-600
  },
  {
    id: 'cleaner-3',
    name: 'Elena Rostova',
    email: 'elena.r@crispcleaners.ca',
    phone: '(647) 555-0219',
    role: 'cleaner',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    status: 'available',
    skills: ['Residential Standard', 'Kitchen Appliance Deep Clean', 'Pet-Friendly Sanitation'],
    hourlyRate: 28.50,
    serviceZones: ['Downtown Toronto', 'Liberty Village', 'King West'],
    performanceNotes: 'Exceptional attention to details in bathrooms and kitchens.',
    color: '#d97706' // amber-600
  },
  {
    id: 'cleaner-4',
    name: 'David MacLeod',
    email: 'david.m@crispcleaners.ca',
    phone: '(905) 555-0371',
    role: 'cleaner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.79,
    status: 'off_duty',
    skills: ['Carpet Extraction', 'Move-out Inspections', 'Floor Buffing'],
    hourlyRate: 29.00,
    serviceZones: ['Etobicoke', 'Mississauga East', 'High Park'],
    performanceNotes: 'Reliable weekend team member, handles heavy carpet & deep clean jobs.',
    color: '#7c3aed' // violet-600
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Amara Vance',
    email: 'amara.vance@vancetech.io',
    phone: '(416) 555-9831',
    address: '180 University Ave',
    unit: 'Penthouse 4201',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5H 0A2',
    propertyType: 'residential',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2400,
    accessInstructions: 'Concierge has fob under "Vance". Buzz code #4201. Please take service elevator with cleaning carts.',
    notes: 'Uses organic plant-based products only due to infant and Golden Retriever. Do not vacuum master bedroom while nursery door is shut.',
    tags: ['VIP', 'Recurring Biweekly', 'Eco-Products Only', 'Pets on Site'],
    totalSpent: 2890,
    serviceCount: 9,
    createdAt: '2026-01-15'
  },
  {
    id: 'cust-2',
    name: 'Apex Design Studio (Liam Scott)',
    email: 'liam@apexstudio.design',
    phone: '(416) 555-4490',
    address: '372 Richmond St W',
    unit: 'Suite 300',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5V 1X6',
    propertyType: 'commercial',
    sqft: 4500,
    accessInstructions: 'Lockbox on back alley entrance code: 8842#. Alarm disarm pin is in office keycard cabinet.',
    notes: 'Creative architectural office. Trash recycling sorting is strict. Wipe iMac glass screens with microfiber only.',
    tags: ['Commercial', 'Weekly Recurring', 'High Priority'],
    totalSpent: 4200,
    serviceCount: 14,
    createdAt: '2025-11-20'
  },
  {
    id: 'cust-3',
    name: 'Julian & Claire Dubois',
    email: 'julian.dubois@rogers.ca',
    phone: '(647) 555-7120',
    address: '45 Roxborough St W',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M4V 1T9',
    propertyType: 'residential',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3800,
    accessInstructions: 'Keypad on side porch door. Code 1994*. Two friendly golden doodles may be in backyard.',
    notes: 'Heritage hardwood floors require Bona cleaner only (in pantry). High ceilings in foyer.',
    tags: ['Residential', 'Biweekly Recurring', 'Heritage Home'],
    totalSpent: 3450,
    serviceCount: 8,
    createdAt: '2026-02-01'
  },
  {
    id: 'cust-4',
    name: 'Sophia Patel',
    email: 'sophia.patel89@gmail.com',
    phone: '(416) 555-3311',
    address: '88 Blue Jays Way',
    unit: 'Apt 1204',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5V 0L7',
    propertyType: 'residential',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    accessInstructions: 'Key with front desk. Tell security you are from Crisp Cleaners for Sophia Patel.',
    notes: 'Standard bi-weekly condo clean. Empty dishwasher and wipe balcony glass if weather permitting.',
    tags: ['Standard Clean', 'Biweekly', 'Condo'],
    totalSpent: 1140,
    serviceCount: 6,
    createdAt: '2026-03-10'
  },
  {
    id: 'cust-5',
    name: 'Northgate Medical Clinic',
    email: 'facilities@northgatemed.ca',
    phone: '(416) 555-8900',
    address: '500 Sheppard Ave E',
    unit: 'Suite 210',
    city: 'North York',
    province: 'ON',
    postalCode: 'M2N 6H7',
    propertyType: 'commercial',
    sqft: 3200,
    accessInstructions: 'Staff door key held in Knox Box. Code 7720. Clean after 7:00 PM when clinic closes.',
    notes: 'Medical-grade surface sanitization required in all exam rooms (Rooms 1-6). Medical waste disposal by clinic staff.',
    tags: ['Medical/Sanitization', 'Commercial', 'Weekly'],
    totalSpent: 5600,
    serviceCount: 16,
    createdAt: '2025-09-14'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-101',
    customerId: 'cust-1',
    customerName: 'Amara Vance',
    customerPhone: '(416) 555-9831',
    customerAddress: '180 University Ave, PH 4201, Toronto',
    customerCity: 'Toronto',
    propertyType: 'residential',
    serviceType: 'deep_clean',
    date: '2026-08-26', // Tomorrow
    time: '09:00',
    durationHours: 3.5,
    recurringFrequency: 'biweekly',
    assignedCleanerIds: ['cleaner-1', 'cleaner-3'],
    assignedCleanerNames: ['Sarah Tremblay', 'Elena Rostova'],
    status: 'scheduled',
    price: 320.00,
    specialInstructions: 'Remember eco-friendly cleaning solutions only. Clean oven interior and polish marble kitchen counter.',
    checklist: [
      { id: 'chk-1', task: 'Dust and sanitize all surface counters & ledges', completed: false, room: 'Living' },
      { id: 'chk-2', task: 'Deep clean master bath & jet tub with organic descaler', completed: false, room: 'Bath' },
      { id: 'chk-3', task: 'Clean interior oven & wipe stainless range hood', completed: false, room: 'Kitchen' },
      { id: 'chk-4', task: 'Mop hardwood floors with warm microfiber mop', completed: false, room: 'Throughout' },
      { id: 'chk-5', task: 'Sanitize nursery changing station & wipe baseboards', completed: false, room: 'Nursery' }
    ],
    cleanerNotes: '',
    createdAt: '2026-08-20'
  },
  {
    id: 'job-102',
    customerId: 'cust-2',
    customerName: 'Apex Design Studio',
    customerPhone: '(416) 555-4490',
    customerAddress: '372 Richmond St W, Suite 300, Toronto',
    customerCity: 'Toronto',
    propertyType: 'commercial',
    serviceType: 'commercial',
    date: '2026-08-26',
    time: '18:00',
    durationHours: 2.5,
    recurringFrequency: 'weekly',
    assignedCleanerIds: ['cleaner-2'],
    assignedCleanerNames: ['Marcus Chen'],
    status: 'scheduled',
    price: 275.00,
    specialInstructions: 'After-hours cleaning. Sanitize conference table, empty 24 individual desk bins, clean kitchen espresso machine.',
    checklist: [
      { id: 'chk-6', task: 'Empty and replace liners in all desk bins and kitchen', completed: false, room: 'Open Office' },
      { id: 'chk-7', task: 'Wipe all glass partitions and conference room tables', completed: false, room: 'Meeting Rooms' },
      { id: 'chk-8', task: 'Sanitize kitchen sink, espresso drip tray & microwave', completed: false, room: 'Kitchen' },
      { id: 'chk-9', task: 'Vacuum all carpet tiles and damp mop polished concrete', completed: false, room: 'Floors' }
    ],
    cleanerNotes: '',
    createdAt: '2026-08-21'
  },
  {
    id: 'job-103',
    customerId: 'cust-4',
    customerName: 'Sophia Patel',
    customerPhone: '(416) 555-3311',
    customerAddress: '88 Blue Jays Way, Apt 1204, Toronto',
    customerCity: 'Toronto',
    propertyType: 'residential',
    serviceType: 'standard',
    date: '2026-08-25', // Today
    time: '13:30',
    durationHours: 2.0,
    recurringFrequency: 'biweekly',
    assignedCleanerIds: ['cleaner-1'],
    assignedCleanerNames: ['Sarah Tremblay'],
    status: 'in_progress',
    price: 165.00,
    specialInstructions: 'Wipe balcony glass door interior. Fold spare towels in guest closet.',
    checklist: [
      { id: 'chk-10', task: 'Dust all furniture surfaces & lamps', completed: true, room: 'Living' },
      { id: 'chk-11', task: 'Scrub bathroom sink, shower glass & toilet', completed: true, room: 'Bath' },
      { id: 'chk-12', task: 'Wipe kitchen counters, stove & exterior appliances', completed: false, room: 'Kitchen' },
      { id: 'chk-13', task: 'Vacuum area rug and mop laminate flooring', completed: false, room: 'Throughout' }
    ],
    cleanerNotes: 'Customer left laundry on bed; neatly stacked beside dresser. Kitchen underway.',
    createdAt: '2026-08-18'
  },
  {
    id: 'job-104',
    customerId: 'cust-3',
    customerName: 'Julian & Claire Dubois',
    customerPhone: '(647) 555-7120',
    customerAddress: '45 Roxborough St W, Toronto',
    customerCity: 'Toronto',
    propertyType: 'residential',
    serviceType: 'deep_clean',
    date: '2026-08-24', // Yesterday
    time: '10:00',
    durationHours: 4.0,
    recurringFrequency: 'biweekly',
    assignedCleanerIds: ['cleaner-1', 'cleaner-2'],
    assignedCleanerNames: ['Sarah Tremblay', 'Marcus Chen'],
    status: 'completed',
    price: 395.00,
    specialInstructions: 'Detailed baseboard dusting and chandeliers.',
    checklist: [
      { id: 'chk-14', task: 'Foyer chandelier dusting & high crown molding', completed: true },
      { id: 'chk-15', task: 'Full kitchen cabinetry degreasing and stove deep scrub', completed: true },
      { id: 'chk-16', task: '4 Bathrooms complete grout and glass descaling', completed: true },
      { id: 'chk-17', task: 'Hardwood floor Bona polish throughout 3 floors', completed: true }
    ],
    cleanerNotes: 'Job completed smoothly. Client was home for walkthrough and was delighted with the foyer chandeliers.',
    feedback: {
      rating: 5,
      review: 'Sarah and Marcus did an unbelievable job on our Rosedale home! The chandeliers are glowing and our hardwood floors look brand new. Best cleaning service in Toronto hands down.',
      date: '2026-08-24',
      aspects: {
        cleanliness: 5,
        punctuality: 5,
        communication: 5
      }
    },
    invoiceId: 'inv-201',
    createdAt: '2026-08-15'
  },
  {
    id: 'job-105',
    customerId: 'cust-5',
    customerName: 'Northgate Medical Clinic',
    customerPhone: '(416) 555-8900',
    customerAddress: '500 Sheppard Ave E, Suite 210, North York',
    customerCity: 'North York',
    propertyType: 'commercial',
    serviceType: 'commercial',
    date: '2026-08-23',
    time: '19:30',
    durationHours: 3.0,
    recurringFrequency: 'weekly',
    assignedCleanerIds: ['cleaner-2'],
    assignedCleanerNames: ['Marcus Chen'],
    status: 'completed',
    price: 350.00,
    specialInstructions: 'Medical grade disinfectant across exam tables and reception glass.',
    checklist: [
      { id: 'chk-18', task: 'Exam rooms 1-6 clinical disinfection', completed: true },
      { id: 'chk-19', task: 'Reception check-in acrylic shields & counters', completed: true },
      { id: 'chk-20', task: 'Sterilize waiting area seating & sanitize floors', completed: true }
    ],
    cleanerNotes: 'All 6 exam rooms disinfected with hospital grade solution. Refilled sanitizer dispensers in lobby.',
    feedback: {
      rating: 5,
      review: 'Marcus continues to provide stellar service for our clinic. Always meticulous, follows medical sanitization protocols to the letter. Highly reliable!',
      date: '2026-08-24',
      aspects: {
        cleanliness: 5,
        punctuality: 5,
        communication: 5
      }
    },
    invoiceId: 'inv-202',
    createdAt: '2026-08-16'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-201',
    invoiceNumber: 'INV-2026-0089',
    jobId: 'job-104',
    customerId: 'cust-3',
    customerName: 'Julian & Claire Dubois',
    customerEmail: 'julian.dubois@rogers.ca',
    customerAddress: '45 Roxborough St W, Toronto, ON M4V 1T9',
    issueDate: '2026-08-24',
    dueDate: '2026-09-07',
    lineItems: [
      { description: 'Premium Residential Deep Clean (4 Bed / 4 Bath, 3800 sqft)', quantity: 1, unitPrice: 350.00, total: 350.00 },
      { description: 'Chandelier Delicate Dusting & Foyer Glass Detailing', quantity: 1, unitPrice: 45.00, total: 45.00 }
    ],
    subtotal: 395.00,
    taxRate: 0.13,
    taxAmount: 51.35,
    total: 446.35,
    status: 'paid',
    paymentMethod: 'interac_etransfer',
    paidAt: '2026-08-24T18:30:00Z',
    notes: 'Thank you for choosing Crisp Cleaners! Payment received via Interac e-Transfer.'
  },
  {
    id: 'inv-202',
    invoiceNumber: 'INV-2026-0090',
    jobId: 'job-105',
    customerId: 'cust-5',
    customerName: 'Northgate Medical Clinic',
    customerEmail: 'facilities@northgatemed.ca',
    customerAddress: '500 Sheppard Ave E, Suite 210, North York, ON M2N 6H7',
    issueDate: '2026-08-23',
    dueDate: '2026-09-06',
    lineItems: [
      { description: 'Commercial Medical Sanitization & Weekly Deep Maintenance', quantity: 1, unitPrice: 350.00, total: 350.00 }
    ],
    subtotal: 350.00,
    taxRate: 0.13,
    taxAmount: 45.50,
    total: 395.50,
    status: 'unpaid',
    notes: 'Net 14 payment terms for corporate accounts.'
  },
  {
    id: 'inv-203',
    invoiceNumber: 'INV-2026-0078',
    jobId: 'job-99',
    customerId: 'cust-2',
    customerName: 'Apex Design Studio (Liam Scott)',
    customerEmail: 'liam@apexstudio.design',
    customerAddress: '372 Richmond St W, Suite 300, Toronto, ON M5V 1X6',
    issueDate: '2026-08-10',
    dueDate: '2026-08-20', // Overdue!
    lineItems: [
      { description: 'Commercial Creative Studio Weekly Clean (4500 sqft)', quantity: 1, unitPrice: 275.00, total: 275.00 }
    ],
    subtotal: 275.00,
    taxRate: 0.13,
    taxAmount: 35.75,
    total: 310.75,
    status: 'overdue',
    notes: 'Payment overdue by 5 days. Friendly reminder sent via email.'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-301',
    name: 'Dr. Michael Sterling',
    email: 'm.sterling@sterlingortho.ca',
    phone: '(416) 555-6621',
    address: '220 Bay Street, Suite 1400',
    city: 'Toronto',
    propertyType: 'commercial',
    serviceRequested: 'commercial',
    sqft: 5200,
    frequency: 'weekly',
    preferredDate: '2026-09-01',
    message: 'We are expanding our dental/orthodontic clinic on Bay Street. Looking for a high-end, reliable cleaning company for 3x weekly evening sanitization starting next week. Need insured staff and bonded keyholders.',
    source: 'website_form',
    status: 'new',
    estimatedValue: 1400,
    aiScore: 96,
    aiPriority: 'high',
    aiAnalysis: 'High-value commercial inquiry (5200 sqft dental clinic on Bay St). Requesting 3x weekly recurring service with estimated monthly billing of $1,400-$1,800. Ready to start next week with strict requirement for bonded staff.',
    suggestedReply: 'Dear Dr. Sterling,\n\nThank you for reaching out to Crisp Cleaners! We specialize in premium commercial and medical clinic sanitization across Downtown Toronto, with fully bonded, background-checked staff and full WSIB/commercial liability insurance.\n\nWe would love to conduct a brief 15-minute site walkthrough at 220 Bay Street this Thursday or Friday to provide an exact tailored proposal for your 3x weekly schedule. Does 10:00 AM or 2:00 PM work best for your team?\n\nWarm regards,\nCrisp Cleaners Client Relations\n(416) 555-CRISP | crispcleaners.ca',
    createdAt: '2026-08-25T14:20:00Z'
  },
  {
    id: 'lead-302',
    name: 'Kendra Kowalski',
    email: 'kendra.k@gmail.com',
    phone: '(647) 555-8812',
    address: '75 High Park Ave',
    city: 'Toronto',
    propertyType: 'residential',
    serviceRequested: 'move_in_out',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    frequency: 'one_time',
    preferredDate: '2026-08-29',
    message: 'Moving out of our High Park condo on Saturday morning. Need a comprehensive move-out clean including inside all cupboards, fridge, and oven to secure our full deposit back.',
    source: 'google_search',
    status: 'qualified',
    estimatedValue: 295,
    aiScore: 88,
    aiPriority: 'high',
    aiAnalysis: 'Move-out clean with firm date this Saturday (Aug 29). High conversion probability due to immediate deadline and specific scope (cupboards, fridge, oven). Estimated value $295-$340.',
    suggestedReply: 'Hi Kendra,\n\nCongratulations on the move! We would be delighted to handle your complete Move-Out Clean at 75 High Park Ave on Saturday, August 29th.\n\nOur Move-In/Out Deep Package includes full interior/exterior detailing of all cupboards, oven, refrigerator, bathroom descaling, baseboards, and deposit-ready guarantee for $295 + HST.\n\nWe have a morning slot available starting at 9:00 AM. Would you like us to secure this booking for you today?\n\nBest,\nCrisp Cleaners Team',
    createdAt: '2026-08-25T09:10:00Z'
  },
  {
    id: 'lead-303',
    name: 'Robert Hastings',
    email: 'hastings.invest@gmail.com',
    phone: '(416) 555-1994',
    address: '12 Forest Hill Rd',
    city: 'Toronto',
    propertyType: 'residential',
    serviceRequested: 'deep_clean',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 6500,
    frequency: 'biweekly',
    preferredDate: '2026-09-05',
    message: 'Looking for a regular 2-person cleaning crew for large family estate in Forest Hill. Need eco-friendly products, window interior washing, and fine furniture care.',
    source: 'referral',
    status: 'new',
    estimatedValue: 650,
    aiScore: 94,
    aiPriority: 'high',
    aiAnalysis: 'Luxury residential lead (6,500 sqft in Forest Hill). High recurring value ($650/visit bi-weekly = ~$1,300/mo). Client arrived via referral and has specific premium care requirements.',
    suggestedReply: 'Dear Mr. Hastings,\n\nThank you for considering Crisp Cleaners. We take great pride in servicing fine homes and estates across Forest Hill with dedicated, background-checked 2-person teams and premium plant-based formulations.\n\nWe would welcome the opportunity to meet for a walk-through at 12 Forest Hill Rd to document your specific furniture care protocols and confirm your bi-weekly schedule.\n\nBest regards,\nCrisp Cleaners Concierge Team',
    createdAt: '2026-08-24T16:45:00Z'
  },
  {
    id: 'lead-304',
    name: 'Tanya Gomez',
    email: 'tanya.g@yahoo.com',
    phone: '(905) 555-9011',
    address: 'Etobicoke Lakeshore',
    city: 'Etobicoke',
    propertyType: 'residential',
    serviceRequested: 'standard',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 550,
    frequency: 'monthly',
    message: 'Just checking how much you charge for a quick 1-bed condo clean once in a while.',
    source: 'social_media',
    status: 'new',
    estimatedValue: 140,
    aiScore: 52,
    aiPriority: 'low',
    aiAnalysis: 'Low-touch casual inquiry. Small 1-bedroom condo looking for intermittent monthly or ad-hoc cleaning. Price-sensitive.',
    suggestedReply: 'Hi Tanya,\n\nThanks for reaching out! Our standard 1-Bedroom / 1-Bathroom condo clean is $145 + HST (approx. 2 hours of thorough cleaning by our vetted pros). If you set up regular monthly service, you also save 10% on every visit.\n\nWould you like to try a first clean next week?\n\nBest,\nCrisp Cleaners',
    createdAt: '2026-08-23T11:00:00Z'
  }
];

export const INITIAL_REVIEWS: { customerName: string; rating: number; review: string; date: string; service: string; cleaner: string }[] = [
  {
    customerName: 'Julian & Claire Dubois',
    rating: 5,
    review: 'Sarah and Marcus did an unbelievable job on our Rosedale home! The chandeliers are glowing and our hardwood floors look brand new. Best cleaning service in Toronto hands down.',
    date: '2026-08-24',
    service: 'Deep Clean',
    cleaner: 'Sarah Tremblay & Marcus Chen'
  },
  {
    customerName: 'Northgate Medical Clinic',
    rating: 5,
    review: 'Marcus continues to provide stellar service for our clinic. Always meticulous, follows medical sanitization protocols to the letter. Highly reliable!',
    date: '2026-08-24',
    service: 'Commercial Sanitization',
    cleaner: 'Marcus Chen'
  },
  {
    customerName: 'Amara Vance',
    rating: 5,
    review: 'The eco-friendly products are a breath of fresh air. Sarah is so sweet with our baby and dog, and the penthouse always sparkles after she leaves.',
    date: '2026-08-12',
    service: 'Residential Biweekly',
    cleaner: 'Sarah Tremblay'
  },
  {
    customerName: 'Liam Scott (Apex Studio)',
    rating: 4.8,
    review: 'Our team loves walking into a fresh, spotless design studio on Monday mornings. Great communication and billing is super straightforward.',
    date: '2026-08-08',
    service: 'Commercial Office',
    cleaner: 'Marcus Chen'
  },
  {
    customerName: 'Sophia Patel',
    rating: 5,
    review: 'Elena did such a great job on my condo bath and kitchen. Everything smelled crisp and clean without harsh chemical odors. 10/10 recommend!',
    date: '2026-07-28',
    service: 'Standard Condo Clean',
    cleaner: 'Elena Rostova'
  },
  {
    customerName: 'David & Karen Wu',
    rating: 4.5,
    review: 'Prompt arrival and very polite. Missed the underside of the kitchen toaster oven slightly, but fixed it immediately when asked. Excellent overall.',
    date: '2026-07-20',
    service: 'Move-in Deep Clean',
    cleaner: 'David MacLeod'
  }
];

// Aliases for compatibility
export const SEED_CUSTOMERS = INITIAL_CUSTOMERS;
export const SEED_CLEANERS = INITIAL_CLEANERS;
export const SEED_JOBS = INITIAL_JOBS;
export const SEED_INVOICES = INITIAL_INVOICES;
export const SEED_LEADS = INITIAL_LEADS;

export const INITIAL_REGIONS: RegionTerritory[] = ALL_CANADIAN_REGIONS;

export const INITIAL_PARTNER_APPLICATIONS: PartnerApplication[] = [
  {
    id: 'partner-app-1',
    fullName: 'Mateo Morales',
    businessName: 'Morales Sparkling Solutions Inc.',
    email: 'mateo@moralessolutions.ca',
    phone: '(416) 555-0812',
    primaryRegion: 'Mississauga City Centre & Port Credit',
    secondaryRegions: ['Oakville, Burlington & Milton', 'Etobicoke & High Park Corridor'],
    partnerType: 'subcontractor',
    experienceYears: 6,
    teamSize: '3_5_cleaners',
    hasEquipmentAndSupplies: true,
    hasInsurance: true,
    hasWSIBOrBonding: true,
    qualifiedServices: ['residential', 'deep_clean', 'move_in_out', 'commercial', 'window_cleaning'],
    weeklyJobCapacity: 18,
    availability: ['Weekdays', 'Weekends', 'Emergency/Same-Day'],
    vehicleAccess: true,
    notes: 'Operate 2 fully equipped service vans in Peel region. Looking for steady overflow dispatches and territory lock.',
    status: 'pending',
    submittedAt: '2026-08-25'
  },
  {
    id: 'partner-app-2',
    fullName: 'Ananya Sharma',
    businessName: 'PureClean Living Ltd.',
    email: 'ananya@purecleanliving.ca',
    phone: '(647) 555-0934',
    primaryRegion: 'Markham & Richmond Hill',
    secondaryRegions: ['North York & Bayview'],
    partnerType: 'franchise',
    experienceYears: 4,
    teamSize: '2_cleaners',
    hasEquipmentAndSupplies: true,
    hasInsurance: true,
    hasWSIBOrBonding: true,
    qualifiedServices: ['residential', 'deep_clean', 'airbnb', 'garage_cleanout'],
    weeklyJobCapacity: 12,
    availability: ['Weekdays', 'Mornings', 'Midday'],
    vehicleAccess: true,
    notes: 'Interested in acquiring exclusive franchise territory rights for Markham & Richmond Hill.',
    status: 'reviewed',
    submittedAt: '2026-08-24'
  },
  {
    id: 'partner-app-3',
    fullName: 'Tariq Al-Mansoor',
    businessName: 'Apex Commercial Janitorial',
    email: 'tariq@apexjanitorial.ca',
    phone: '(905) 555-0455',
    primaryRegion: 'Vaughan, Woodbridge & Kleinburg',
    secondaryRegions: ['North York & Bayview', 'Markham & Richmond Hill'],
    partnerType: 'subcontractor',
    experienceYears: 8,
    teamSize: '6_plus',
    hasEquipmentAndSupplies: true,
    hasInsurance: true,
    hasWSIBOrBonding: true,
    qualifiedServices: ['commercial', 'restaurant', 'post_construction', 'window_cleaning', 'garage_cleanout'],
    weeklyJobCapacity: 25,
    availability: ['Evenings', 'Night Shifts', 'Weekends'],
    vehicleAccess: true,
    notes: 'Specialized in restaurant kitchen degreasing, commercial sanitization and post-construction power washing.',
    status: 'region_locked',
    lockedRegionExpiry: '2027-08-25',
    submittedAt: '2026-08-20'
  }
];

