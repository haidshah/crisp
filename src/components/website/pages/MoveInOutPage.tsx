import React from 'react';
import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Home, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { ServiceType } from '../../../types';

interface PageProps {
  onOpenBookingModal: (service?: ServiceType) => void;
}

export const MoveInOutPage: React.FC<PageProps> = ({ onOpenBookingModal }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-linear-to-b from-teal-950 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Move-In & Move-Out Deep Cleaning • 100% Deposit Safe</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Get 100% of your rental deposit back.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Moving is stressful enough. Hand off the heavy cleaning to Crisp Cleaners. We clean inside empty cabinets, scrub appliances, polish baseboards, and leave the property in impeccable inspection-ready condition.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBookingModal('move_in_out')}
                className="px-8 py-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Move Clean (From $240)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider pb-2 border-b border-white/10">
              Landlord & Tenant Board Approved Standard
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Inside & behind oven, stovetop burners & range hood filters</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Inside refrigerator shelves, crisper bins & freezer defrost wipe</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Inside all kitchen and bathroom cabinets, drawers & shelves</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Full hand-wipe of baseboards, door frames, switch plates & light fixtures</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Award className="w-8 h-8 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Security Deposit Return Guarantee</h3>
            <p className="text-xs text-slate-500">If your landlord points out any cleaning issues during the walkthrough, we return within 24 hours to rectify it at $0 charge.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Clock className="w-8 h-8 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Turnkey Keybox / Lockbox Entry</h3>
            <p className="text-xs text-slate-500">No need to sit around in an empty house. Provide lockbox details and let our crew perform their magic while you unpack.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Home className="w-8 h-8 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Move-In Sanitization for Buyers</h3>
            <p className="text-xs text-slate-500">Moving into a newly purchased house or condo? We fully sanitize previous owner touchpoints for a truly fresh start.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
