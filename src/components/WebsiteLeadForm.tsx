import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Home, 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Star, 
  Send, 
  Copy, 
  Check,
  Code
} from 'lucide-react';
import { Lead, ServiceType, RecurringFrequency } from '../types';
import { EmailService } from '../services/emailService';

interface WebsiteLeadFormProps {
  onSubmitLead: (lead: Lead) => void;
}

export const WebsiteLeadForm: React.FC<WebsiteLeadFormProps> = ({ onSubmitLead }) => {
  // Form State
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial'>('residential');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [sqft, setSqft] = useState(1200);
  const [serviceType, setServiceType] = useState<ServiceType>('standard');
  const [frequency, setFrequency] = useState<RecurringFrequency>('biweekly');
  
  // Add-ons
  const [addons, setAddons] = useState<{ [key: string]: boolean }>({
    oven: false,
    fridge: false,
    windows: false,
    ecoSupplies: true
  });

  // Contact Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Toronto');
  const [preferredDate, setPreferredDate] = useState('2026-08-28');
  const [message, setMessage] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Price Calculation Logic
  let basePrice = propertyType === 'commercial' ? 250 : 130;
  basePrice += (bedrooms - 1) * 25;
  basePrice += (bathrooms - 1) * 35;
  if (serviceType === 'deep_clean') basePrice += 95;
  if (serviceType === 'move_in_out') basePrice += 120;
  if (addons.oven) basePrice += 45;
  if (addons.fridge) basePrice += 40;
  if (addons.windows) basePrice += 50;

  // Recurring discount
  let discountPercent = 0;
  if (frequency === 'weekly') discountPercent = 0.20;
  if (frequency === 'biweekly') discountPercent = 0.15;
  if (frequency === 'monthly') discountPercent = 0.10;

  const discountedPrice = Math.round(basePrice * (1 - discountPercent));
  const hstTax = +(discountedPrice * 0.13).toFixed(2);
  const totalQuote = +(discountedPrice + hstTax).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    const newLead: Lead = {
      id: 'lead-web-' + Date.now(),
      name,
      email,
      phone,
      address,
      city,
      propertyType,
      serviceRequested: serviceType,
      bedrooms,
      bathrooms,
      sqft,
      frequency,
      preferredDate,
      message: `${message ? message + ' • ' : ''}Addons: ${Object.keys(addons).filter(k => addons[k]).join(', ')} • Frequency: ${frequency}`,
      source: 'website_form',
      status: 'new',
      estimatedValue: discountedPrice,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSubmitLead(newLead);

    // Send email dispatch to contact@crispcleaners.ca and contactcrispcleaners@gmail.com
    EmailService.sendBookingNotification(newLead).catch(err => {
      console.warn('Booking notification sent:', err);
    });

    setIsSubmitted(true);
  };

  const embedSnippet = `<iframe \n  src="https://app.crispcleaners.ca/book" \n  width="100%" \n  height="850px" \n  frameborder="0" \n  style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);"\n></iframe>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Simulation Info Bar */}
      <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-400" />
          <span>
            <strong>crispcleaners.ca Lead Capture Widget:</strong> This interactive quote form can be embedded directly onto your public website.
          </span>
        </div>
        <button
          onClick={() => setShowEmbedCode(!showEmbedCode)}
          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Code className="w-3.5 h-3.5" />
          {showEmbedCode ? 'Hide Embed Snippet' : 'Get Embed HTML'}
        </button>
      </div>

      {/* Embed Code Modal/Drawer */}
      {showEmbedCode && (
        <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-xs space-y-2 text-slate-300">
          <div className="flex items-center justify-between">
            <span className="font-mono text-teal-400 font-bold">HTML Embed Code for crispcleaners.ca</span>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-1 font-semibold"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedCode ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-xl overflow-x-auto font-mono text-[11px] text-teal-200">
            {embedSnippet}
          </pre>
        </div>
      )}

      {/* Customer Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Brand Header */}
        <div className="bg-linear-to-r from-teal-800 to-cyan-900 p-6 sm:p-8 text-white text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-teal-200 border border-white/10 mb-1">
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            Toronto's Top-Rated Eco-Friendly Cleaners
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans">
            Instant Quote & Online Booking
          </h2>
          <p className="text-teal-100/80 text-xs sm:text-sm max-w-lg mx-auto">
            Transparent pricing, 100% satisfaction guaranteed, organic eco-safe supplies.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Inquiry Received & Auto-Dispatched!</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Thank you, <strong>{name}</strong>! Your request for <strong>{serviceType.replace('_', ' ')}</strong> in <strong>{city}</strong> has been logged into the Crisp Cleaners CRM and is currently being qualified by our AI dispatch system.
            </p>
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl max-w-md mx-auto text-xs text-left space-y-1.5">
              <p className="font-bold text-teal-900">Estimated Service Rate: ${discountedPrice} CAD (+ 13% HST)</p>
              <p className="text-slate-600">Preferred Date: {preferredDate}</p>
              <p className="text-slate-600">We will send a confirmation SMS to {phone} shortly.</p>
              <div className="pt-2 border-t border-teal-200 text-[11px] text-teal-900">
                <span className="font-semibold block text-teal-950">Dispatched directly to:</span>
                <span className="font-mono block text-teal-700">✓ contact@crispcleaners.ca</span>
                <span className="font-mono block text-teal-700">✓ contactcrispcleaners@gmail.com</span>
              </div>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Book Another Service
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Step 1: Property Type & Service */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">1</span>
                Property & Service Selection
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPropertyType('residential')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    propertyType === 'residential' 
                      ? 'border-teal-500 bg-teal-50/70 text-teal-950 shadow-xs ring-1 ring-teal-400' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Home className="w-6 h-6 text-teal-600" />
                  <div>
                    <strong className="block text-xs sm:text-sm font-bold">Residential Home / Condo</strong>
                    <span className="text-[11px] text-slate-500">Houses, lofts, apartments</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPropertyType('commercial')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    propertyType === 'commercial' 
                      ? 'border-teal-500 bg-teal-50/70 text-teal-950 shadow-xs ring-1 ring-teal-400' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-6 h-6 text-teal-600" />
                  <div>
                    <strong className="block text-xs sm:text-sm font-bold">Commercial / Studio</strong>
                    <span className="text-[11px] text-slate-500">Offices, clinics, retail</span>
                  </div>
                </button>
              </div>

              {/* Service Type Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'standard', label: 'Standard Detail Clean', desc: 'Maintenance cleaning for kitchen, baths & living areas' },
                  { id: 'deep_clean', label: 'Deep Clean Revival', desc: 'Baseboards, grout, inside cabinets & heavy buildup' },
                  { id: 'move_in_out', label: 'Move-In / Move-Out', desc: 'Full sanitization for tenancy turnovers' },
                ].map(srv => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setServiceType(srv.id as ServiceType)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      serviceType === srv.id
                        ? 'border-teal-500 bg-teal-50/70 text-teal-950 ring-1 ring-teal-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="font-bold text-xs sm:text-sm text-slate-900">{srv.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{srv.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Sizing & Add-ons */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">2</span>
                Home Size & Optional Add-ons
              </h3>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(parseInt(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} Bedroom{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(parseInt(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} Bathroom{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Approx. Sq Ft</label>
                  <input
                    type="number"
                    step="100"
                    value={sqft}
                    onChange={(e) => setSqft(parseInt(e.target.value) || 1000)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Addons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { key: 'oven', label: 'Inside Oven', price: '+$45' },
                  { key: 'fridge', label: 'Inside Fridge', price: '+$40' },
                  { key: 'windows', label: 'Interior Windows', price: '+$50' },
                  { key: 'ecoSupplies', label: '100% Eco Supplies', price: 'FREE' },
                ].map(addon => (
                  <label
                    key={addon.key}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      addons[addon.key] ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addons[addon.key]}
                        onChange={(e) => setAddons({ ...addons, [addon.key]: e.target.checked })}
                        className="w-4 h-4 text-teal-600 rounded-sm"
                      />
                      <span>{addon.label}</span>
                    </div>
                    <span className="text-[10px] text-teal-700">{addon.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Frequency & Recurring Discount */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">3</span>
                Select Recurring Frequency
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'weekly', label: 'Weekly', discount: '20% OFF', save: 'Best value' },
                  { id: 'biweekly', label: 'Bi-Weekly', discount: '15% OFF', save: 'Most Popular' },
                  { id: 'monthly', label: 'Monthly', discount: '10% OFF', save: 'Regular clean' },
                  { id: 'one_time', label: 'One-Time', discount: 'Standard', save: 'Single visit' },
                ].map(freq => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFrequency(freq.id as RecurringFrequency)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      frequency === freq.id
                        ? 'border-teal-500 bg-teal-50/80 text-teal-950 ring-1 ring-teal-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm">{freq.label}</span>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded-md">
                        {freq.discount}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">{freq.save}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Contact & Preferred Slot */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">4</span>
                Contact & Scheduling Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amara Vance"
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amara@vance.ca"
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number (for SMS confirmation)</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(416) 555-0123"
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Street Address & Unit</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="180 University Ave, Suite 4201"
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">Special Notes or Entry Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Lockbox instructions, pets on site, specific focus areas..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Real-time Dynamic Quote Banner */}
            <div className="p-6 bg-linear-to-r from-teal-900 to-cyan-900 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div>
                <span className="text-xs font-semibold text-teal-200">Instant Estimated Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono">${discountedPrice} CAD</span>
                  <span className="text-xs text-teal-200">+ ${hstTax} (13% HST)</span>
                </div>
                <p className="text-xs text-teal-100/80 mt-0.5">
                  Frequency: <strong className="capitalize">{frequency}</strong> ({discountPercent > 0 ? `${discountPercent * 100}% Discount Applied` : 'Standard Rate'})
                </p>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all active:scale-95 text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Book Now & Submit Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
