import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  Menu, 
  X, 
  Home, 
  Building2, 
  Layers, 
  Truck, 
  KeyRound, 
  Award,
  Star,
  CheckCircle2,
  ArrowRight,
  Sun
} from 'lucide-react';
import { ServiceType } from '../../types';

export type WebsitePageView = 
  | 'home'
  | 'residential'
  | 'window_cleaning'
  | 'commercial'
  | 'airbnb'
  | 'garage_cleanout'
  | 'move_in_out'
  | 'partner_program';

interface WebsiteHeaderProps {
  currentView: WebsitePageView;
  onNavigateView: (view: WebsitePageView) => void;
  onOpenBookingModal: (initialService?: ServiceType) => void;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onNavigateToCRM: () => void;
}

export const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({
  currentView,
  onNavigateView,
  onOpenBookingModal,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onNavigateToCRM
}) => {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const servicesList = [
    {
      id: 'residential' as WebsitePageView,
      serviceType: 'residential' as ServiceType,
      title: 'Residential Cleaning',
      desc: 'Standard maintenance, recurring & deep home sanitization',
      icon: Home,
      tag: 'From $149'
    },
    {
      id: 'window_cleaning' as WebsitePageView,
      serviceType: 'window_cleaning' as ServiceType,
      title: 'Window Cleaning',
      desc: 'Interior & exterior streak-free glass, screens & sills',
      icon: Sun,
      tag: 'Streak-Free'
    },
    {
      id: 'commercial' as WebsitePageView,
      serviceType: 'commercial' as ServiceType,
      title: 'Commercial & Restaurants',
      desc: 'Health code sanitization, offices, dining & night janitorial',
      icon: Building2,
      tag: 'Post-Hours'
    },
    {
      id: 'airbnb' as WebsitePageView,
      serviceType: 'airbnb' as ServiceType,
      title: 'Airbnb & Rental Turnover',
      desc: 'Fast 2-hr turnaround, hotel linens, restocking & damage checks',
      icon: KeyRound,
      tag: '2-Hr Turn'
    },
    {
      id: 'garage_cleanout' as WebsitePageView,
      serviceType: 'garage_cleanout' as ServiceType,
      title: 'Garage Clean Out & Haul',
      desc: 'Floor power scrub, declutter sorting & rack organization',
      icon: Truck,
      tag: 'Heavy Duty'
    },
    {
      id: 'move_in_out' as WebsitePageView,
      serviceType: 'move_in_out' as ServiceType,
      title: 'Move-In / Move-Out',
      desc: 'Deposit return guarantee, appliance scrub & deep baseboards',
      icon: Layers,
      tag: 'Deposit Safe'
    }
  ];

  const handleServiceSelect = (view: WebsitePageView) => {
    onNavigateView(view);
    setIsServicesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification Announcement Bar */}
      <div className="bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
              GTA Top Rated
            </span>
            <span className="hidden sm:inline text-slate-300">
              Toronto, North York, Mississauga, Etobicoke, York Region & Halton
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>4.95/5 Rating (850+ Cleans)</span>
            </div>
            <a 
              href="tel:4165550199" 
              className="flex items-center gap-1 hover:text-teal-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-teal-400" />
              <span className="font-bold">(416) 555-CRISP</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div 
            onClick={() => onNavigateView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">
                  Crisp<span className="text-teal-600">Cleaners</span>
                </span>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-md">
                  .ca
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
                Premium Cleaning & Field Ops
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigateView('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'home'
                  ? 'text-teal-700 bg-teal-50/80'
                  : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentView !== 'home' && currentView !== 'partner_program'
                    ? 'text-teal-700 bg-teal-50/80'
                    : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
                }`}
              >
                <span>Services ({servicesList.length})</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {isServicesDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsServicesDropdownOpen(false)}
                  className="absolute top-full left-0 mt-1 w-[460px] bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 grid grid-cols-1 gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                >
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      All Cleaning Specializations
                    </span>
                    <span className="text-[11px] font-bold text-teal-700">
                      100% Sparkle Guarantee
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {servicesList.map(s => {
                      const Icon = s.icon;
                      const isCurrent = currentView === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleServiceSelect(s.id)}
                          className={`p-2.5 rounded-2xl cursor-pointer border transition-all ${
                            isCurrent
                              ? 'bg-teal-50/90 border-teal-400 text-teal-950 shadow-xs'
                              : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="block text-xs font-bold text-slate-900 leading-tight">
                                {s.title}
                              </strong>
                              <span className="text-[10px] font-bold text-teal-700">{s.tag}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                            {s.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Partner Program Link */}
            <button
              onClick={() => onNavigateView('partner_program')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'partner_program'
                  ? 'text-amber-800 bg-amber-50 border border-amber-200 shadow-xs'
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50/50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Partner Program</span>
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-black uppercase">
                Lock Region
              </span>
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Admin / CRM Entry Button */}
            {isAdminLoggedIn ? (
              <button
                onClick={onNavigateToCRM}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Enter CRM Backend Workspace"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Admin CRM</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Staff & Admin Portal Login"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Portal</span>
              </button>
            )}

            {/* Main Book Cleaning Button */}
            <button
              onClick={() => onOpenBookingModal()}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black tracking-wide shadow-md hover:shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>Book Clean / Quote</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenBookingModal()}
              className="px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold"
            >
              Book Now
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => { onNavigateView('home'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
            >
              Home
            </button>

            <p className="px-3 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Specialized Services
            </p>
            {servicesList.map(s => (
              <button
                key={s.id}
                onClick={() => handleServiceSelect(s.id)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-teal-50 flex items-center justify-between"
              >
                <span>{s.title}</span>
                <span className="text-[10px] text-teal-700 font-bold">{s.tag}</span>
              </button>
            ))}

            <button
              onClick={() => { onNavigateView('partner_program'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 flex items-center justify-between mt-2"
            >
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Cleaner Partner Program</span>
              </div>
              <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                Lock Region
              </span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {isAdminLoggedIn ? (
              <button
                onClick={() => { onNavigateToCRM(); setIsMobileMenuOpen(false); }}
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Enter Admin CRM
              </button>
            ) : (
              <button
                onClick={() => { onOpenAdminLogin(); setIsMobileMenuOpen(false); }}
                className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-slate-500" />
                Staff & Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
