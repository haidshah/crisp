import React from 'react';
import { 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Star, 
  Camera, 
  Layers, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ServiceType } from '../../../types';

interface PageProps {
  onOpenBookingModal: (service?: ServiceType) => void;
}

export const AirbnbPage: React.FC<PageProps> = ({ onOpenBookingModal }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-linear-to-b from-teal-950 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <KeyRound className="w-4 h-4" />
              <span>Airbnb & Short-Term Rental Turnover • Superhost Grade</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              2-Hour turnover. 5-Star guest cleanliness ratings.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Never stress a 11:00 AM checkout and 3:00 PM check-in again. We wash hotel linens, stage pillows, restock amenities, inspect for guest damage, and submit timestamped photos directly to your dashboard.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBookingModal('airbnb')}
                className="px-8 py-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Turnover Clean (From $135)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider pb-2 border-b border-white/10">
              Turnover Standard Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Complete linen strip, wash, dry & hotel corner bed fold</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Restock coffee pods, toilet paper, shampoo & guest basket</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Damage & smoke odor inspection with photos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Smart lock battery check & code synchronization</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <Clock className="w-8 h-8 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Guaranteed Turnaround Window</h3>
            <p className="text-xs text-slate-600">We operate between 10:30 AM and 3:30 PM with dedicated crews across downtown condos and suburban homes.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <Camera className="w-8 h-8 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Instant Photo Verification</h3>
            <p className="text-xs text-slate-600">Cleaners upload live completion photos into the Crisp Cleaners portal so you can verify guest-readiness remotely.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Superhost Protection</h3>
            <p className="text-xs text-slate-600">Consistently maintain 5-star cleanliness ratings to maximize your Airbnb search ranking and nightly rates.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
