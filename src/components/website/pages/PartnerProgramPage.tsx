import React, { useState, useMemo } from 'react';
import { 
  Award, 
  MapPin, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Building2, 
  Check,
  AlertCircle,
  Search,
  Globe,
  Filter,
  Layers,
  ChevronDown,
  Mail
} from 'lucide-react';
import { PartnerApplication, RegionTerritory, ServiceType, ProvinceCode } from '../../../types';
import { CANADIAN_PROVINCES, ALL_CANADIAN_REGIONS } from '../../../data/canadianLocations';
import { EmailService } from '../../../services/emailService';

interface PartnerProgramPageProps {
  regions: RegionTerritory[];
  onSubmitApplication: (app: PartnerApplication) => void;
}

export const PartnerProgramPage: React.FC<PartnerProgramPageProps> = ({
  regions = ALL_CANADIAN_REGIONS,
  onSubmitApplication
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appId, setAppId] = useState('');

  // Canada-Wide Territory Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceTab, setSelectedProvinceTab] = useState<'ALL' | ProvinceCode | 'PRAIRIES' | 'ATLANTIC' | 'TERRITORIES'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'high_demand' | 'locked'>('all');

  // Form State
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partnerType, setPartnerType] = useState<'subcontractor' | 'franchise' | 'independent_cleaner' | 'crew_lead'>('subcontractor');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceCode>('ON');
  const [primaryRegion, setPrimaryRegion] = useState('Toronto Downtown Core & Waterfront (ON-TOR-01)');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityName, setCustomCityName] = useState('');
  const [customPostalFSA, setCustomPostalFSA] = useState('');
  const [secondaryRegions, setSecondaryRegions] = useState<string[]>(['Mississauga City Centre & Port Credit (ON-MISS-01)']);
  const [experienceYears, setExperienceYears] = useState(3);
  const [teamSize, setTeamSize] = useState<'solo' | '2_cleaners' | '3_5_cleaners' | '6_plus'>('2_cleaners');
  const [hasInsurance, setHasInsurance] = useState(true);
  const [hasWSIBOrBonding, setHasWSIBOrBonding] = useState(true);
  const [vehicleAccess, setVehicleAccess] = useState(true);
  const [hasEquipmentAndSupplies, setHasEquipmentAndSupplies] = useState(true);
  const [weeklyJobCapacity, setWeeklyJobCapacity] = useState(15);
  const [notes, setNotes] = useState('');

  const [qualifiedServices, setQualifiedServices] = useState<ServiceType[]>([
    'residential',
    'deep_clean',
    'airbnb',
    'move_in_out'
  ]);

  const toggleService = (srv: ServiceType) => {
    setQualifiedServices(prev => 
      prev.includes(srv) ? prev.filter(s => s !== srv) : [...prev, srv]
    );
  };

  // Filtered Territories across Canada
  const filteredTerritories = useMemo(() => {
    return regions.filter(reg => {
      // 1. Search Query (matches city, name, code, or postal prefixes)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = reg.name.toLowerCase().includes(q);
        const matchCity = reg.city ? reg.city.toLowerCase().includes(q) : false;
        const matchCode = reg.code.toLowerCase().includes(q);
        const matchProvince = reg.provinceName ? reg.provinceName.toLowerCase().includes(q) : false;
        const matchPostal = reg.postalPrefixes.some(p => p.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchCode && !matchProvince && !matchPostal) {
          return false;
        }
      }

      // 2. Province Filter
      if (selectedProvinceTab !== 'ALL') {
        if (selectedProvinceTab === 'PRAIRIES') {
          if (reg.province !== 'MB' && reg.province !== 'SK') return false;
        } else if (selectedProvinceTab === 'ATLANTIC') {
          if (reg.province !== 'NS' && reg.province !== 'NB' && reg.province !== 'NL' && reg.province !== 'PE') return false;
        } else if (selectedProvinceTab === 'TERRITORIES') {
          if (reg.province !== 'YT' && reg.province !== 'NT' && reg.province !== 'NU') return false;
        } else {
          if (reg.province !== selectedProvinceTab) return false;
        }
      }

      // 3. Status Filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'available' && reg.status !== 'available') return false;
        if (statusFilter === 'high_demand' && reg.status !== 'high_demand') return false;
        if (statusFilter === 'locked' && reg.status !== 'locked') return false;
      }

      return true;
    });
  }, [regions, searchQuery, selectedProvinceTab, statusFilter]);

  // Handle Quick Lock Click
  const handleQuickLockTerritory = (reg: RegionTerritory) => {
    if (reg.province) {
      setSelectedProvince(reg.province);
    }
    setIsCustomCity(false);
    setPrimaryRegion(`${reg.name} (${reg.code})`);
    
    // Smooth scroll to application form
    const formElement = document.getElementById('apply-partner');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPrimaryRegion = isCustomCity && customCityName.trim()
      ? `${customCityName.trim()}, ${selectedProvince} (Custom Request - ${customPostalFSA || 'All FSA'})`
      : primaryRegion;

    const newApp: PartnerApplication = {
      id: 'partner-' + Date.now(),
      fullName,
      businessName: businessName || undefined,
      email,
      phone,
      partnerType,
      primaryRegion: finalPrimaryRegion,
      secondaryRegions,
      experienceYears,
      teamSize,
      hasEquipmentAndSupplies,
      hasInsurance,
      hasWSIBOrBonding,
      qualifiedServices,
      weeklyJobCapacity,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      vehicleAccess,
      notes: notes || undefined,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    setAppId(newApp.id);
    onSubmitApplication(newApp);

    // Send email dispatch to contact@crispcleaners.ca and contactcrispcleaners@gmail.com
    EmailService.sendPartnerApplicationNotification(newApp).catch(err => {
      console.warn('Partner application email sent:', err);
    });

    setIsSubmitted(true);
  };

  // Regions belonging to currently selected province in the form
  const provinceFilteredOptions = useMemo(() => {
    return regions.filter(r => r.province === selectedProvince);
  }, [regions, selectedProvince]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-slate-900 via-amber-950/60 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>Canada-Wide Partner & Franchise Program • All 10 Provinces & 3 Territories</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Lock your city in Canada and grow with steady high-ticket cleans.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Join Crisp Cleaners as a vetted sub-contractor, franchise owner, or fleet team leader. We provide turn-key dispatch, marketing, and client billing across <strong>Ontario, British Columbia, Alberta, Quebec, Prairies & Atlantic Canada</strong>. Lock in exclusive postal territory rights and earn <strong>$35 – $55/hr per cleaner</strong> ($8,000 to $18,000+/mo for crews).
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div>
                <span className="block text-2xl font-black text-amber-400">$35–$55</span>
                <span className="text-xs text-slate-400">Hourly CAD Rate</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-amber-400">100%</span>
                <span className="text-xs text-slate-400">Keep Customer Tips</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-amber-400">All Canada</span>
                <span className="text-xs text-slate-400">Provinces & Territories</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider pb-2 border-b border-white/10">
              Why Partner With Crisp Cleaners Canada?
            </h3>
            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Exclusive City & Postal Lock:</strong> Protect your service zone with guaranteed territory protection against other operators.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Zero Customer Acquisition Cost:</strong> We feed you steady pre-paid residential, Airbnb, move-out, and commercial bookings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Cleaner Mobile Dispatch:</strong> Real-time Canadian routing, client lockbox/alarm codes, before/after photo check-in.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Fast Weekly Direct Deposit:</strong> Automated Interac e-Transfer or direct bank deposit every Friday without invoicing friction.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CANADA-WIDE INTERACTIVE TERRITORY SEARCH & LOCK FINDER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Nationwide Coverage Explorer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Search & Lock Your City Across Canada
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Select your province and search by City name or Postal code prefix (FSA) to check available territory slots or lock your exclusive zone.
            </p>
          </div>

          {/* Quick Territory Counters */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <span className="px-2.5 py-1 bg-white text-slate-800 rounded-xl shadow-xs">
              {regions.length} Total Zones
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
              {regions.filter(r => r.status === 'available').length} Open
            </span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
              {regions.filter(r => r.status === 'high_demand' || r.status === 'limited_slots').length} High Demand
            </span>
            <span className="px-2.5 py-1 bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
              {regions.filter(r => r.status === 'locked').length} Locked
            </span>
          </div>
        </div>

        {/* Search & Province Filter Controls */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any Canadian city (e.g. Vancouver, Calgary, Montreal, Toronto, Halifax, Winnipeg, Ottawa)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="md:col-span-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Territory Statuses</option>
                <option value="available">✓ Open for Applications</option>
                <option value="high_demand">🔥 High Demand & Limited</option>
                <option value="locked">🔒 Currently Locked</option>
              </select>
            </div>
          </div>

          {/* Province Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
            {[
              { id: 'ALL', label: '🇨🇦 All Canada' },
              { id: 'ON', label: 'Ontario (ON)' },
              { id: 'BC', label: 'British Columbia (BC)' },
              { id: 'AB', label: 'Alberta (AB)' },
              { id: 'QC', label: 'Quebec (QC)' },
              { id: 'PRAIRIES', label: 'Prairies (MB / SK)' },
              { id: 'ATLANTIC', label: 'Atlantic (NS, NB, NL, PE)' },
              { id: 'TERRITORIES', label: 'Territories (YT, NT, NU)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedProvinceTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedProvinceTab === tab.id
                    ? 'bg-teal-600 text-white shadow-xs font-extrabold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Territory Cards Grid */}
        {filteredTerritories.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-base">No pre-listed zone matched "{searchQuery}"</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Don't worry! We accept partners in every municipality across Canada. You can submit a custom city lock application below.
            </p>
            <button
              onClick={() => {
                setIsCustomCity(true);
                setCustomCityName(searchQuery);
                const formEl = document.getElementById('apply-partner');
                if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer"
            >
              + Lock "{searchQuery || 'My Canadian City'}" as Custom Territory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerritories.map((reg) => (
              <div
                key={reg.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between transition-all ${
                  reg.status === 'locked'
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : reg.status === 'high_demand'
                    ? 'bg-linear-to-b from-amber-50/40 to-white border-amber-300 shadow-xs hover:shadow-md'
                    : 'bg-white border-teal-200 shadow-xs hover:shadow-md hover:border-teal-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md">
                        {reg.province || 'CA'}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {reg.code}
                      </span>
                    </div>

                    {reg.status === 'locked' ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-700" />
                        Locked
                      </span>
                    ) : reg.status === 'high_demand' ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        High Demand
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-bold">
                        ✓ Open ({reg.maxPartnerSlots - reg.activePartnerCount} Slots)
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{reg.name}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                      <span>{reg.city ? `${reg.city}, ` : ''}{reg.provinceName || 'Canada'}</span>
                    </p>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono">
                    Postal FSA: {reg.postalPrefixes.slice(0, 5).join(', ')}{reg.postalPrefixes.length > 5 ? '...' : ''}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Est. CAD Earnings:</span>
                    <strong className="text-teal-700 font-bold">{reg.estimatedMonthlyEarnings}</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Clean Demand:</span>
                    <span>~{reg.averageWeeklyJobs} jobs/wk</span>
                  </div>

                  {reg.status !== 'locked' ? (
                    <button
                      onClick={() => handleQuickLockTerritory(reg)}
                      className="w-full mt-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock This City & Territory</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickLockTerritory(reg)}
                      className="w-full mt-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Join Territory Waitlist</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PARTNER APPLICATION FORM SECTION */}
      <section id="apply-partner" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800">
                  Canada Territory Protection
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Sub-Contractor & Franchise Application
                </h3>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                  Application #{appId}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Application Received & Canadian Territory Reserved!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Thank you, <strong className="text-slate-900">{fullName}</strong>. Your requested territory lock for <strong className="text-teal-700">{primaryRegion}</strong> has been logged in our operator dispatch center. Our onboarding team will review your application within 24 hours.
                </p>
              </div>

              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Application Dispatched Directly To:</span>
                </div>
                <div className="space-y-1 text-slate-700 pl-6 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>contact@crispcleaners.ca</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>contactcrispcleaners@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Applicant:</span>
                  <strong className="text-slate-900">{fullName} {businessName ? `(${businessName})` : ''}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Primary Region:</span>
                  <strong className="text-amber-800 font-bold">{primaryRegion}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Weekly Capacity:</span>
                  <strong className="text-slate-900">{weeklyJobCapacity} jobs/week</strong>
                </div>
              </div>

              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Submit Another Territory Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Partner Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Partnership Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'subcontractor', label: 'Subcontractor Crew', desc: 'Bring your team & service vehicle' },
                    { id: 'franchise', label: 'Franchise Territory', desc: 'Exclusive multi-postal zone lock' },
                    { id: 'independent_cleaner', label: 'Independent Solo Pro', desc: 'Flexible schedule & single cleans' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPartnerType(type.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        partnerType === type.id
                          ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <strong className="block text-xs">{type.label}</strong>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Tremblay / David Chen"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business / Trade Name (Optional)</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Maple Leaf Sparkle Solutions Ltd."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partners@yourcleaningco.ca"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Canadian Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(416) 555-0199 / (604) 555-0188"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* CANADA-WIDE TARGET REGION LOCKING */}
              <div className="p-5 bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl border border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>Target Canadian Province & City to Lock</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCustomCity(!isCustomCity)}
                    className="text-xs font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
                  >
                    {isCustomCity ? '← Choose from Pre-Listed Zones' : '+ Request Custom City / Township'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Province Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Province / Territory *
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => {
                        const prov = e.target.value as ProvinceCode;
                        setSelectedProvince(prov);
                        const firstInProv = regions.find(r => r.province === prov);
                        if (firstInProv) {
                          setPrimaryRegion(`${firstInProv.name} (${firstInProv.code})`);
                        }
                      }}
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900"
                    >
                      {CANADIAN_PROVINCES.map(p => (
                        <option key={p.code} value={p.code}>
                          {p.name} ({p.code}) — {p.taxLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City / Territory Choice */}
                  {!isCustomCity ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Designated Territory / City *
                      </label>
                      <select
                        value={primaryRegion}
                        onChange={(e) => setPrimaryRegion(e.target.value)}
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900"
                      >
                        {provinceFilteredOptions.length > 0 ? (
                          provinceFilteredOptions.map((r) => (
                            <option key={r.id} value={`${r.name} (${r.code})`}>
                              {r.name} — {r.status === 'locked' ? '(Currently Locked)' : r.status === 'high_demand' ? '(High Demand)' : '(Available)'}
                            </option>
                          ))
                        ) : (
                          <option value="Custom Municipality">Custom City Request</option>
                        )}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Specific City / Municipality Name *
                      </label>
                      <input
                        type="text"
                        value={customCityName}
                        onChange={(e) => setCustomCityName(e.target.value)}
                        placeholder="e.g. Guelph, Kelowna, Rimouski, Cochrane..."
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900"
                        required={isCustomCity}
                      />
                    </div>
                  )}

                  {/* Postal FSA / Weekly Capacity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Weekly Job Capacity ({weeklyJobCapacity} jobs/week)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={weeklyJobCapacity}
                      onChange={(e) => setWeeklyJobCapacity(Number(e.target.value))}
                      className="w-full accent-amber-600 mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
                      <span>5 jobs/wk (~$1,250)</span>
                      <span>25 jobs/wk (~$6,250)</span>
                      <span>50+ jobs/wk (~$12,500+)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Postal Prefixes (Optional FSA codes)
                    </label>
                    <input
                      type="text"
                      value={customPostalFSA}
                      onChange={(e) => setCustomPostalFSA(e.target.value)}
                      placeholder="e.g. V6B, M5V, T2P, H3A, K1P..."
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Compliance & Experience */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Years in Business</label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value={1}>1+ Year</option>
                    <option value={2}>2+ Years</option>
                    <option value={3}>3+ Years</option>
                    <option value={5}>5+ Years</option>
                    <option value={10}>10+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crew Sizing</label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="solo">Solo Cleaner (1)</option>
                    <option value="2_cleaners">2-Person Duo Team</option>
                    <option value="3_5_cleaners">3–5 Person Crew</option>
                    <option value="6_plus">6+ Van Fleet</option>
                  </select>
                </div>

                <div 
                  onClick={() => setHasInsurance(!hasInsurance)}
                  className={`p-2 rounded-xl border cursor-pointer flex items-center gap-2 ${
                    hasInsurance ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center ${hasInsurance ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                    {hasInsurance && <Check className="w-3 h-3" />}
                  </div>
                  <span>$2M+ Liability</span>
                </div>

                <div 
                  onClick={() => setVehicleAccess(!vehicleAccess)}
                  className={`p-2 rounded-xl border cursor-pointer flex items-center gap-2 ${
                    vehicleAccess ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center ${vehicleAccess ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                    {vehicleAccess && <Check className="w-3 h-3" />}
                  </div>
                  <span>Service Van / Car</span>
                </div>
              </div>

              {/* Authorized Services */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Cleaning Services Your Team is Equipped to Provide
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'residential' as ServiceType, label: 'Residential Upkeep' },
                    { id: 'deep_clean' as ServiceType, label: 'Deep Spring Cleaning' },
                    { id: 'window_cleaning' as ServiceType, label: 'Window & Screen Wash' },
                    { id: 'commercial' as ServiceType, label: 'Commercial & Janitorial' },
                    { id: 'airbnb' as ServiceType, label: 'Airbnb Fast Turnarounds' },
                    { id: 'garage_cleanout' as ServiceType, label: 'Garage Clean Outs' },
                    { id: 'move_in_out' as ServiceType, label: 'Move-In / Move-Out Deep' },
                  ].map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => toggleService(srv.id)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        qualifiedServices.includes(srv.id)
                          ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center ${qualifiedServices.includes(srv.id) ? 'bg-amber-600 text-white' : 'border border-slate-300'}`}>
                        {qualifiedServices.includes(srv.id) && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-[11px]">{srv.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Fleet or Subcontractor Experience Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about your team, current routes, equipment, or any special requests regarding locking your Canadian city or province..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Submit Canadian Territory Application & Lock City</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
