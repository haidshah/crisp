import React from 'react';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Users, 
  Flame, 
  ArrowRight,
  FileText,
  DollarSign
} from 'lucide-react';
import { ServiceType } from '../../../types';

interface PageProps {
  onOpenBookingModal: (service?: ServiceType) => void;
}

export const CommercialCleaningPage: React.FC<PageProps> = ({ onOpenBookingModal }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-linear-to-b from-slate-900 via-teal-950 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Commercial, Office & Restaurant Sanitation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Spotless facilities. DineSafe & health code compliant.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              We keep Toronto's top restaurants, dental clinics, boutique offices, and retail storefronts operating at peak cleanliness. Night janitorial shifts and after-hours keyholder access available.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBookingModal('commercial')}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Request Commercial Estimate (From $220)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider pb-2 border-b border-white/10">
              Commercial Cleaning Capabilities
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Restaurants & Bars:</strong> Kitchen deep degreasing, line hood wipe down, dining floor scrub, bar sanitization & grease-trap support.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Offices & Tech Studios:</strong> Workstation disinfectant, boardroom detailing, restroom restock, kitchen lunchroom cleanup.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Medical & Clinics:</strong> Hospital-grade terminal sanitization, bio-touchpoint sterilization, waiting room hygiene.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Night Janitorial:</strong> 7 days a week shifts between 9:00 PM and 5:00 AM with digital GPS check-in.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <ShieldCheck className="w-8 h-8 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">COI & Certificate of Insurance</h3>
            <p className="text-xs text-slate-500">We issue official certificates of insurance naming your landlord or property management company as additional insured.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Clock className="w-8 h-8 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">After-Hours & Keyholder Service</h3>
            <p className="text-xs text-slate-500">Secure key-box holding, alarm arming/disarming protocol, and time-stamped digital photographic reports after every shift.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <FileText className="w-8 h-8 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">DineSafe Green Pass Ready</h3>
            <p className="text-xs text-slate-500">Keep Toronto Public Health inspectors happy with sanitary logs, certified chemical dilution, and commercial food-contact sanitizers.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
