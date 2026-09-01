import React from 'react';
import { 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Droplets, 
  Eye, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { ServiceType } from '../../../types';

interface PageProps {
  onOpenBookingModal: (service?: ServiceType) => void;
}

export const WindowCleaningPage: React.FC<PageProps> = ({ onOpenBookingModal }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-linear-to-b from-sky-950 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
              <Sun className="w-4 h-4" />
              <span>Crystal Clear Window Cleaning • Residential & Commercial</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Streak-free clarity. Pure sunlight in every room.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              We utilize pure deionized water filtration, squeegee blades, and eco-friendly foaming agents to eliminate rain marks, pollen, grime, and hard water stains inside and out.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBookingModal('window_cleaning')}
                className="px-8 py-4 bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Window Clean (From $149)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider pb-2 border-b border-white/10">
              The Crisp Glass Standard
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Interior & Exterior Glass Panes (Up to 3 Storeys)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Screen Removal, Scrub & High-Pressure Rinse</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Window Track & Sill Vacuuming (Dirt & insect removal)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Balcony Glass Railings & French Patio Doors</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Pure Water-Fed Pole System</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Filtered deionized water attracts dirt without harsh chemical residue, leaving glass 100% spotless without water drop spots.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Fully Insured & WSIB Compliant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our technicians are certified for working at heights, fully insured with $2,000,000 commercial liability coverage across Ontario.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Rain Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If it rains within 48 hours of your service and spots your exterior windows, we will touch them up free of charge.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
