import React from 'react';
import { 
  Home, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Heart,
  Droplets,
  Zap,
  Users
} from 'lucide-react';
import { ServiceType } from '../../../types';

interface PageProps {
  onOpenBookingModal: (service?: ServiceType) => void;
}

export const ResidentialPage: React.FC<PageProps> = ({ onOpenBookingModal }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-teal-950 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Home className="w-4 h-4" />
              <span>Residential Home Cleaning • Toronto & GTA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              A pristine home without lifting a finger.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Experience the fresh, crisp standard of hotel-grade home cleaning. From routine bi-weekly upkeep to heavy deep scrubbing, our vetted professionals make your sanctuary sparkle.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBookingModal('residential')}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Residential Clean (From $149)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <span>$2M Liability & Background Checked</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                What's Included
              </span>
              <span className="text-xs text-slate-400">50+ Point Checklist</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Kitchen:</strong> Countertops sanitized, stove exterior scrubbed, sink & faucet polished, microwave inside & out.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Bathrooms:</strong> Shower glass descaled, tile grout sanitized, toilets deep-scrubbed, mirror polished.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Living Areas:</strong> Hardwood floors wet-mopped, carpets vacuumed with HEPA filters, furniture dusted.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Bedrooms:</strong> Beds neatly made, linen changes upon request, surfaces wiped down.</span>
              </li>
            </ul>

            <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/30 text-teal-300 text-xs font-medium">
              🌿 100% Eco-friendly, plant-based cleaning solutions safe for pets & infants.
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-slate-900">
            Transparent, Fixed-Rate Home Packages
          </h2>
          <p className="text-sm text-slate-600">
            No surprise hourly overages. Select your home size and preferred recurring schedule to save up to 20%.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Condo / 1-Bed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all space-y-6">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase bg-teal-50 px-2.5 py-1 rounded-full">
                Condo & 1-2 Bed
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">$149 <span className="text-xs text-slate-400 font-normal">/ clean</span></h3>
              <p className="text-xs text-slate-500 mt-1">Ideal for condos, lofts, and 1-2 bedroom apartments up to 900 sq ft.</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <p>✓ 1 Cleaner for 2.0 - 2.5 Hours</p>
                <p>✓ Complete kitchen, bath & living sweep</p>
                <p>✓ Trash disposal & fresh bed tuck</p>
                <p>✓ Save 15% with Bi-Weekly booking</p>
              </div>
            </div>

            <button
              onClick={() => onOpenBookingModal('residential')}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Select Condo Clean
            </button>
          </div>

          {/* Standard Family Home */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-teal-500 shadow-xl flex flex-col justify-between relative space-y-6">
            <span className="absolute -top-3 right-6 bg-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Most Popular Choice
            </span>

            <div>
              <span className="text-xs font-bold text-teal-400 uppercase bg-teal-950 px-2.5 py-1 rounded-full border border-teal-800">
                3-4 Bed House / Townhouse
              </span>
              <h3 className="text-2xl font-black text-white mt-2">$219 <span className="text-xs text-slate-400 font-normal">/ clean</span></h3>
              <p className="text-xs text-slate-300 mt-1">Perfect for family townhomes and detached properties (1,200 - 2,500 sq ft).</p>
              
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-200">
                <p>✓ 2 Cleaners for 2.5 - 3.5 Hours</p>
                <p>✓ Multi-floor vacuuming & baseboards</p>
                <p>✓ Full kitchen degreasing & master bath scrub</p>
                <p>✓ Flexible arrival windows + SMS alert</p>
              </div>
            </div>

            <button
              onClick={() => onOpenBookingModal('residential')}
              className="w-full py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Book Family Home Clean
            </button>
          </div>

          {/* Deep Spring Sanitization */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase bg-cyan-50 px-2.5 py-1 rounded-full">
                Deep Spring Restoration
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">$299 <span className="text-xs text-slate-400 font-normal">/ clean</span></h3>
              <p className="text-xs text-slate-500 mt-1">Intensive top-to-bottom revival for homes requiring detail attention.</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <p>✓ Inside oven & inside fridge included</p>
                <p>✓ Hand-wiped baseboards & door frames</p>
                <p>✓ Tile grout heavy treatment</p>
                <p>✓ Air vent dusting & light fixtures</p>
              </div>
            </div>

            <button
              onClick={() => onOpenBookingModal('deep_clean')}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Select Deep Clean
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
