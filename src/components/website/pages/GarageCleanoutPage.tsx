import React from 'react';
import { 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Trash2, 
  Zap, 
  ArrowRight,
  Droplets,
  Layers
} from 'lucide-react';
import { ServiceType } from '../../../types';

interface PageProps {
  onOpenBookingModal: (service?: ServiceType) => void;
}

export const GarageCleanoutPage: React.FC<PageProps> = ({ onOpenBookingModal }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-linear-to-b from-slate-900 via-amber-950/40 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              <span>Garage Clean Out, Organization & Pressure Wash</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Reclaim your parking space & organized workshop.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Don't let seasonal clutter, cardboard boxes, and oil stains take over your garage. Our heavy-duty team sorts, hauls junk, sweeps cobwebs, wipes shelving, and pressure-washes concrete floors.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBookingModal('garage_cleanout')}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Garage Clean Out (From $195)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider pb-2 border-b border-white/10">
              Garage Transformation Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Complete sorting: Keep, Donate, Recycle & Junk</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>High-pressure concrete floor wash & oil stain degreasing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Ceiling cobweb sweep & garage door frame wiping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bin labeling & systematic tool shelf re-organization</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Droplets className="w-8 h-8 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Industrial Degreasing Equipment</h3>
            <p className="text-xs text-slate-500">We lift embedded winter salt deposits, vehicle oil drips, and rubber tire marks with commercial rotary scrubbers.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Trash2 className="w-8 h-8 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Eco-Conscious Disposal</h3>
            <p className="text-xs text-slate-500">We partner with local Toronto charities and metal recycling centers to divert over 60% of hauled items from landfills.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Zap className="w-8 h-8 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Single, Double & Triple Garages</h3>
            <p className="text-xs text-slate-500">Custom tailored crew sizes to finish even the most chaotic suburban garages in a single morning.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
