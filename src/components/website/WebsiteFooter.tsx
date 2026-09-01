import React from 'react';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Star, 
  CheckCircle2, 
  Award,
  ArrowRight,
  Sun,
  Home,
  Building2,
  KeyRound,
  Truck,
  Layers,
  Lock
} from 'lucide-react';
import { WebsitePageView } from './WebsiteHeader';

interface WebsiteFooterProps {
  onNavigateView: (view: WebsitePageView) => void;
  onOpenBookingModal: () => void;
  onOpenAdminLogin: () => void;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({
  onNavigateView,
  onOpenBookingModal,
  onOpenAdminLogin
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Guarantee & Callout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-900">
          <div className="flex items-start gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Bonded & $2M Insured</h4>
              <p className="text-xs text-slate-400 mt-1">
                Every cleaner is background-checked, insured, and thoroughly vetted for complete peace of mind.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Sparkle Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1">
                If anything isn't 100% spotless, notify us within 24 hours and we'll re-clean it free of charge.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Eco-Friendly & Pet Safe</h4>
              <p className="text-xs text-slate-400 mt-1">
                Non-toxic, plant-based cleaning agents that are safe for your family, pets, and indoor air quality.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
          {/* Company Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigateView('home')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-600/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-white">
                  Crisp<span className="text-teal-400">Cleaners</span>.ca
                </span>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Toronto & Greater Toronto Area
                </p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Crisp Cleaners is Ontario's premier residential, commercial, restaurant, Airbnb, window, and move-out cleaning service. Powered by smart scheduling and vetted field crews.
            </p>

            <div className="space-y-2 text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>(416) 555-CRISP / (416) 555-0199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>service@crispcleaners.ca</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>100 King St West, Suite 5600, Toronto, ON M5X 1C9</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Specialized Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateView('residential')} 
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Residential Home Cleaning
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateView('window_cleaning')} 
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Window Cleaning (Int/Ext)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateView('commercial')} 
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Commercial & Restaurants
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateView('airbnb')} 
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Airbnb & Short-Term Turn
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateView('garage_cleanout')} 
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Garage Clean Out & Haul
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateView('move_in_out')} 
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Move-In / Move-Out Deep
                </button>
              </li>
            </ul>
          </div>

          {/* Regional GTA Coverage */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Service Territories
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>• Downtown Toronto & Waterfront</li>
              <li>• North York & Bayview Village</li>
              <li>• Mississauga & Port Credit</li>
              <li>• Etobicoke & High Park</li>
              <li>• Markham & Richmond Hill</li>
              <li>• Scarborough & Bluffs</li>
              <li>• Oakville, Burlington & Milton</li>
              <li>• Vaughan & Woodbridge</li>
            </ul>
          </div>

          {/* Partner & Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Partners & Staff
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateView('partner_program')}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5"
                >
                  <span>Lock a Region (Partners)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('partner_program')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Subcontractor Earnings ($35-55/hr)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('partner_program')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Franchise Territory Rights
                </button>
              </li>
              <li className="pt-2 border-t border-slate-900">
                <button
                  onClick={onOpenAdminLogin}
                  className="text-slate-400 hover:text-white flex items-center gap-1.5 font-bold"
                >
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Admin & Dispatch Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Crisp Cleaners Inc. (crispcleaners.ca). All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>HST # 849201934RT0001</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
