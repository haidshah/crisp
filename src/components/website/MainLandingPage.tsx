import React, { useState } from 'react';
import { 
  Sparkles, 
  Home, 
  Sun, 
  Building2, 
  KeyRound, 
  Truck, 
  Layers, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  MapPin, 
  Phone, 
  DollarSign, 
  ChevronRight,
  Zap,
  Lock,
  Heart,
  Droplets
} from 'lucide-react';
import { ServiceType, RegionTerritory } from '../../types';
import { WebsitePageView } from './WebsiteHeader';
import { useUserLocation } from '../../services/locationService';
import { isPrimaryServiceArea, getProvinceByCode } from '../../data/canadianLocations';

interface MainLandingPageProps {
  onNavigateView: (view: WebsitePageView) => void;
  onOpenBookingModal: (service?: ServiceType) => void;
  regions: RegionTerritory[];
}

export const MainLandingPage: React.FC<MainLandingPageProps> = ({
  onNavigateView,
  onOpenBookingModal,
  regions
}) => {
  // User Auto-Detected Location
  const { location: userLoc } = useUserLocation();

  // Quick Calculator State on Hero
  const [quickService, setQuickService] = useState<ServiceType>('residential');
  const [quickBedrooms, setQuickBedrooms] = useState<number>(2);
  const [quickFrequency, setQuickFrequency] = useState<'one_time' | 'biweekly'>('biweekly');

  const calculateQuickEstimate = () => {
    let base = 120 + quickBedrooms * 30 + 50;
    if (quickService === 'deep_clean') base = 220 + quickBedrooms * 40;
    if (quickService === 'window_cleaning') base = 149;
    if (quickService === 'commercial') base = 240;
    if (quickService === 'airbnb') base = 145 + quickBedrooms * 25;
    if (quickService === 'garage_cleanout') base = 195;
    if (quickService === 'move_in_out') base = 260 + quickBedrooms * 40;

    if (quickFrequency === 'biweekly') {
      base = Math.round(base * 0.85);
    }
    return base;
  };

  const services = [
    {
      id: 'residential' as WebsitePageView,
      serviceType: 'residential' as ServiceType,
      title: 'Residential Home Cleaning',
      desc: 'Routine upkeep & deep sanitation for condos, townhomes, and detached family houses.',
      icon: Home,
      pricing: 'From $149',
      features: ['Kitchen & Bath Detailing', 'HEPA Vacuuming', 'Eco-Friendly Detergents']
    },
    {
      id: 'window_cleaning' as WebsitePageView,
      serviceType: 'window_cleaning' as ServiceType,
      title: 'Window Cleaning (Int & Ext)',
      desc: 'Deionized pure water scrub, streak-free glass squeegee, screen wash, and track vacuuming.',
      icon: Sun,
      pricing: 'From $149',
      features: ['Pure Water-Fed Pole', 'Screens & Tracks', '48-Hr Rain Guarantee']
    },
    {
      id: 'commercial' as WebsitePageView,
      serviceType: 'commercial' as ServiceType,
      title: 'Commercial & Restaurants',
      desc: 'DineSafe food-grade degreasing, office janitorial, medical clinic sanitization & night shifts.',
      icon: Building2,
      pricing: 'From $220',
      features: ['Restaurant Kitchens', 'After-Hours Key Access', 'DineSafe Ready']
    },
    {
      id: 'airbnb' as WebsitePageView,
      serviceType: 'airbnb' as ServiceType,
      title: 'Airbnb & Rental Turnover',
      desc: 'Rapid 2-hour turnovers between 11 AM and 3 PM. Linen laundering, staging, and damage photos.',
      icon: KeyRound,
      pricing: 'From $135',
      features: ['2-Hr Turnaround', 'Hotel Linen Wash', 'Photo Proof Verification']
    },
    {
      id: 'garage_cleanout' as WebsitePageView,
      serviceType: 'garage_cleanout' as ServiceType,
      title: 'Garage Clean Out & Haul',
      desc: 'Floor degreasing, cobweb removal, donation sorting, junk haul, and storage rack organization.',
      icon: Truck,
      pricing: 'From $195',
      features: ['Floor Pressure Wash', 'Sort & Junk Haul', 'Tool Rack Organization']
    },
    {
      id: 'move_in_out' as WebsitePageView,
      serviceType: 'move_in_out' as ServiceType,
      title: 'Move-In / Move-Out Deep',
      desc: 'Guaranteed 100% rental deposit return. Empty cabinet interiors, oven scrub, and baseboard detailing.',
      icon: Layers,
      pricing: 'From $240',
      features: ['Deposit Safe Guarantee', 'Inside Oven & Fridge', 'All Cabinet Shelves']
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION WITH INSTANT CALCULATOR */}
      <section className="relative bg-linear-to-b from-teal-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {userLoc 
                  ? (isPrimaryServiceArea(userLoc.city, userLoc.province)
                    ? `Primary Hub: Cambridge & Waterloo Region • Priority Dispatch`
                    : `Serving ${userLoc.city}, ${userLoc.province} & Cambridge HQ`)
                  : `Cambridge HQ, Waterloo Region & All Canadian Territories`}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Sparkling clean homes, businesses & rentals — on your exact schedule.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              From residential homes and sparkling windows to restaurant kitchens, Airbnb turnovers, garages, and move-out deep scrubs. Choose your preferred timing and relax while our vetted crews make it shine.
            </p>

            {/* Value bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>$2M Bonded & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Select 3-Hr Arrival Slot</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>100% Sparkle Guarantee</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => onOpenBookingModal()}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Instant Clean / Get Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateView('partner_program')}
                className="px-6 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Cleaners: Lock a Region</span>
              </button>
            </div>
          </div>

          {/* Right Hero: Interactive Quick Quote Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900">Instant Price Estimator</h3>
                    <p className="text-[10px] text-slate-400">Live 60-second quote</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                  Save 15% Bi-Weekly
                </span>
              </div>

              {/* Service Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Cleaning Service
                </label>
                <select
                  value={quickService}
                  onChange={(e) => setQuickService(e.target.value as ServiceType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="residential">🏠 Residential Home Maintenance</option>
                  <option value="deep_clean">✨ Deep Spring Sanitization</option>
                  <option value="window_cleaning">☀️ Window Cleaning (Int & Ext)</option>
                  <option value="commercial">🏢 Commercial & Restaurant</option>
                  <option value="airbnb">🔑 Airbnb & Rental Turnover (2-Hr)</option>
                  <option value="garage_cleanout">🚛 Garage Clean Out & Pressure Wash</option>
                  <option value="move_in_out">📦 Move-In / Move-Out Deep Clean</option>
                </select>
              </div>

              {/* Bedrooms / Size */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Property Bedrooms
                  </label>
                  <span className="text-xs font-bold text-teal-700">{quickBedrooms} Bedroom(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuickBedrooms(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        quickBedrooms === num
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuickFrequency('biweekly')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    quickFrequency === 'biweekly'
                      ? 'bg-teal-50 border-teal-500 text-teal-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span>Bi-Weekly (Most Popular)</span>
                  <span className="block text-[10px] text-teal-700 font-extrabold">-15% OFF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickFrequency('one_time')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    quickFrequency === 'one_time'
                      ? 'bg-teal-50 border-teal-500 text-teal-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <span>One-Time Clean</span>
                  <span className="block text-[10px] text-slate-400 font-normal">Standard Rate</span>
                </button>
              </div>

              {/* Price Calculation Display */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Price</span>
                  <span className="text-2xl font-black text-teal-400">
                    ${calculateQuickEstimate()} <span className="text-xs text-slate-400 font-normal">CAD</span>
                  </span>
                </div>

                <button
                  onClick={() => onOpenBookingModal(quickService)}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Lock Time Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TIMING & ARRIVAL PREFERENCE HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl border border-teal-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Smart Timing & Arrival Preferences</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                You pick the exact arrival window. We arrive right on time.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                No more waiting around all day. Choose morning (8–11 AM), midday (11–2 PM), afternoon (2–5 PM), or after-hours night shifts for restaurants and commercial offices. Receive live SMS updates 30 minutes before arrival.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2.5">
              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-200">🌿 Flexible Timing Option:</span>
                <span className="font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md">
                  Save 5% Eco Discount
                </span>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-200">⚡ Same-Day Emergency:</span>
                <span className="font-bold text-teal-300 bg-teal-950 px-2 py-0.5 rounded-md">
                  Express 2-Hr Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED INDIVIDUAL SERVICES GRID (Each with page link & instant book) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Complete Cleaning Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Specialized Cleaning for Every Space
          </h2>
          <p className="text-sm text-slate-600">
            Click any service to view the dedicated individual page, pricing breakdowns, and checklists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-teal-100 text-teal-900 font-bold text-xs rounded-full">
                      {srv.pricing}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onNavigateView(srv.id)}
                    className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {srv.desc}
                  </p>

                  {/* Bullet features */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action CTAs */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onNavigateView(srv.id)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition-all text-center cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onOpenBookingModal(srv.serviceType)}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PARTNER PROGRAM CALLOUT & TERRITORY LOCKING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-amber-400 rounded-full text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Canada-Wide Partner & Franchise Program</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
              Cleaners & Subcontractors: Lock Your City Across Canada
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-900/90 leading-relaxed">
              Are you a professional cleaner or operating a commercial cleaning fleet? Partner with Crisp Cleaners to secure steady daily routes in Ontario, BC, Alberta, Quebec, Prairies & Atlantic Canada. Earn $35–$55/hr, keep 100% of tips, and lock exclusive rights to your Canadian city and postal codes.
            </p>
          </div>

          <button
            onClick={() => onNavigateView('partner_program')}
            className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Search & Lock Your City</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. CANADA-WIDE SERVICE REGIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Proudly Serving Canadian Cities & Hubs
            </h2>
            <p className="text-xs text-slate-500">
              Dispatched daily with localized mobile crews across major metropolitan and regional centers in Canada.
            </p>
          </div>

          <button
            onClick={() => onNavigateView('partner_program')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Explore all {regions.length}+ Canada locations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {regions.slice(0, 12).map((reg) => (
            <div
              key={reg.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-teal-300 transition-all"
            >
              <div className="flex items-center gap-1.5 text-teal-700">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{reg.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {reg.provinceName || reg.province || 'Canada'} • {reg.averageWeeklyJobs} cleans/wk
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
