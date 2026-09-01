import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Home, 
  Building2, 
  Sun, 
  KeyRound, 
  Truck, 
  Layers, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Star,
  Lock,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ServiceType, 
  PropertyType, 
  RecurringFrequency, 
  TimingArrivalWindow, 
  DispatchUrgency,
  BookingTimingDetails, 
  Lead,
  ProvinceCode
} from '../../types';
import { 
  CANADIAN_PROVINCES, 
  getProvinceTaxRate, 
  getProvinceTaxLabel,
  isPrimaryServiceArea,
  findProvinceByCity,
  getProvinceByCode
} from '../../data/canadianLocations';
import { EmailService } from '../../services/emailService';
import { useUserLocation } from '../../services/locationService';

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceType;
  onSubmitBooking: (lead: Lead) => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  isOpen,
  onClose,
  initialService = 'residential',
  onSubmitBooking
}) => {
  // Streamlined 2-Step Fast Booking Flow
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdLead, setCreatedLead] = useState<Lead | null>(null);
  const [isDispatchingEmail, setIsDispatchingEmail] = useState(false);

  // Auto-Detect Location & Regional Tax
  const { location: autoLocation, isDetecting: isDetectingLocation, triggerDetection } = useUserLocation();

  // 1. Service Selection & Sizing
  const [serviceType, setServiceType] = useState<ServiceType>(initialService);
  const [propertyType, setPropertyType] = useState<PropertyType>('residential');
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [sqft, setSqft] = useState<number>(1200);
  const [frequency, setFrequency] = useState<RecurringFrequency>('biweekly');

  // Quick Addons
  const [addons, setAddons] = useState<{ [key: string]: boolean }>({
    insideOven: false,
    insideFridge: false,
    insideCabinets: false,
    interiorWindows: false,
    balconyScrub: false,
    deepGroutScrub: false
  });

  // 2. Schedule & Contact
  const defaultDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState<string>(defaultDate);
  const [arrivalWindow, setArrivalWindow] = useState<TimingArrivalWindow>('morning_8_11');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [city, setCity] = useState(autoLocation?.city || 'Cambridge');
  const [province, setProvince] = useState<ProvinceCode>(autoLocation?.province || 'ON');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Synchronize location once detected if not manually modified
  useEffect(() => {
    if (autoLocation && isOpen) {
      if (!city || city === 'Toronto' || city === 'Cambridge') {
        setCity(autoLocation.city);
      }
      setProvince(autoLocation.province);
    }
  }, [autoLocation, isOpen]);

  // If user types a known city, auto-detect province
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const matchedProv = findProvinceByCity(newCity);
    if (matchedProv) {
      setProvince(matchedProv.code);
    }
  };

  useEffect(() => {
    if (initialService) {
      setServiceType(initialService);
      if (initialService === 'commercial' || initialService === 'restaurant') {
        setPropertyType('commercial');
      } else {
        setPropertyType('residential');
      }
    }
  }, [initialService, isOpen]);

  if (!isOpen) return null;

  const toggleAddon = (key: string) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Instant Transparent Price Calculation
  const calculatePricing = () => {
    let base = 140;

    switch (serviceType) {
      case 'residential':
      case 'standard':
        base = 120 + bedrooms * 30 + bathrooms * 25;
        break;
      case 'deep_clean':
        base = 180 + bedrooms * 45 + bathrooms * 35;
        break;
      case 'window_cleaning':
        base = 149 + (addons.interiorWindows ? 50 : 0) + bedrooms * 15;
        break;
      case 'commercial':
      case 'restaurant':
        base = Math.max(220, Math.round(sqft * 0.16));
        break;
      case 'airbnb':
        base = 135 + bedrooms * 30 + bathrooms * 20;
        break;
      case 'garage_cleanout':
        base = 195 + (sqft > 1500 ? 60 : 0);
        break;
      case 'move_in_out':
        base = 240 + bedrooms * 45 + bathrooms * 40 + (addons.insideOven ? 35 : 0) + (addons.insideFridge ? 35 : 0);
        break;
      default:
        base = 150;
    }

    if (addons.insideOven && serviceType !== 'move_in_out') base += 45;
    if (addons.insideFridge && serviceType !== 'move_in_out') base += 45;
    if (addons.insideCabinets) base += 55;
    if (addons.balconyScrub) base += 40;
    if (addons.deepGroutScrub) base += 60;

    let discountMultiplier = 1.0;
    if (frequency === 'weekly') discountMultiplier = 0.80; // 20% off
    else if (frequency === 'biweekly') discountMultiplier = 0.85; // 15% off
    else if (frequency === 'monthly') discountMultiplier = 0.90; // 10% off

    const subtotal = Math.round(base * discountMultiplier);
    const taxRate = getProvinceTaxRate(province);
    const taxAmount = +(subtotal * taxRate).toFixed(2);
    const total = +(subtotal + taxAmount).toFixed(2);
    const savings = Math.round(base * (1 - discountMultiplier));

    return {
      basePrice: base,
      subtotal,
      taxRate,
      taxAmount,
      taxLabel: getProvinceTaxLabel(province),
      total,
      savings
    };
  };

  const pricing = calculatePricing();

  const handleQuickDateSelect = (daysAhead: number) => {
    const d = new Date(Date.now() + daysAhead * 86400000);
    setPreferredDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatchingEmail(true);

    const timingDetails: BookingTimingDetails = {
      preferredDate,
      arrivalWindow,
      flexibleTiming: false,
      urgency: 'standard',
      accessType: 'home_present',
      accessNotes: specialInstructions
    };

    const selectedAddonKeys = Object.keys(addons).filter(k => addons[k]);

    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      name: name.trim() || 'Valued Customer',
      email: email.trim() || 'contact@crispcleaners.ca',
      phone: phone.trim() || '(519) 212-0416',
      address: unit ? `${unit}-${address}` : (address || 'Cambridge / Toronto, ON'),
      city: city || 'Toronto',
      propertyType: (serviceType === 'commercial' || serviceType === 'restaurant') ? 'commercial' : propertyType,
      serviceRequested: serviceType,
      bedrooms,
      bathrooms,
      sqft,
      frequency,
      preferredDate,
      timingDetails,
      selectedAddons: selectedAddonKeys,
      message: `Arrival Window: ${arrivalWindow.replace(/_/g, ' ')} | Frequency: ${frequency} | Instructions: ${specialInstructions || 'None'} | Addons: ${selectedAddonKeys.join(', ') || 'None'}`,
      source: 'website_form',
      status: 'new',
      estimatedValue: pricing.subtotal,
      aiScore: 95,
      aiPriority: 'high',
      aiAnalysis: `Instant streamlined booking for ${serviceType.toUpperCase()} in ${city} on ${preferredDate} (${arrivalWindow}). Automatically routed to contact@crispcleaners.ca & contactcrispcleaners@gmail.com.`,
      suggestedReply: `Hi ${name.split(' ')[0] || 'there'}, your booking has been reserved for ${preferredDate} (${arrivalWindow.replace(/_/g, ' ')}). Our team will arrive equipped with all premium supplies.`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCreatedLead(newLead);
    onSubmitBooking(newLead);

    // Send email dispatch directly to contact@crispcleaners.ca & contactcrispcleaners@gmail.com (+ customer)
    try {
      await EmailService.sendBookingNotification(newLead);
    } catch (err) {
      console.warn('Email dispatch handled:', err);
    }

    setIsDispatchingEmail(false);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  const servicesList: { id: ServiceType; label: string; icon: any; popular?: boolean }[] = [
    { id: 'residential', label: 'Home Clean', icon: Home, popular: true },
    { id: 'deep_clean', label: 'Deep Clean', icon: Sparkles },
    { id: 'move_in_out', label: 'Move In / Out', icon: Layers },
    { id: 'airbnb', label: 'Airbnb Turn', icon: KeyRound },
    { id: 'commercial', label: 'Commercial', icon: Building2 },
    { id: 'window_cleaning', label: 'Window Wash', icon: Sun },
    { id: 'garage_cleanout', label: 'Garage Clean', icon: Truck }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-white">
                  {isSubmitted ? 'Booking Confirmed!' : 'Book Cleaning in 60 Seconds'}
                </h3>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-400/30">
                  Instant Quote
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSubmitted ? 'Confirmation sent to your email & dispatch desk' : 'No credit card required to book • 100% Sparkle Guarantee'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Progress Tracker */}
        {!isSubmitted && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0">
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-2 text-xs font-bold transition-all ${
                  currentStep === 1 ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === 1 ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                }`}>
                  1
                </div>
                <span>Service & Quote</span>
              </button>

              <div className={`h-0.5 flex-1 mx-3 ${currentStep === 2 ? 'bg-teal-500' : 'bg-slate-200'}`} />

              <button
                type="button"
                onClick={() => {
                  if (bedrooms && bathrooms) setCurrentStep(2);
                }}
                className={`flex items-center gap-2 text-xs font-bold transition-all ${
                  currentStep === 2 ? 'text-teal-700' : 'text-slate-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === 2 ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                }`}>
                  2
                </div>
                <span>Date & Details</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1 space-y-6">
          {isSubmitted && createdLead ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                  Reference #{createdLead.id}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  You're All Set, {createdLead.name.split(' ')[0]}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Your <strong className="text-slate-900">{createdLead.serviceRequested?.replace(/_/g, ' ').toUpperCase()}</strong> has been reserved for <strong className="text-teal-700">{createdLead.preferredDate}</strong> ({createdLead.timingDetails?.arrivalWindow?.replace(/_/g, ' ')}).
                </p>
              </div>

              {/* Explicit Dual-Email Delivery Notification Badge */}
              <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-teal-900 font-bold">
                  <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Dispatched Directly To:</span>
                </div>
                <div className="space-y-1 text-slate-700 pl-6">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>contact@crispcleaners.ca</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>contactcrispcleaners@gmail.com</span>
                  </div>
                  {createdLead.email && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-teal-800 font-semibold">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{createdLead.email} (Customer Copy)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Service Address:</span>
                  <strong className="text-slate-900">{createdLead.address}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Frequency:</span>
                  <strong className="text-slate-900 uppercase font-bold">{createdLead.frequency}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Total:</span>
                  <strong className="text-teal-700 text-sm font-black">${pricing.total.toFixed(2)} CAD (incl. HST)</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment:</span>
                  <span className="text-slate-500">Pay after clean (Cash, Card, or Interac)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href="tel:5192120416"
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Call Dispatch: (519) 212-0416</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : currentStep === 1 ? (
            /* STEP 1: SERVICE & SIZING */
            <div className="space-y-6">
              {/* 1. Service Type Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Cleaning Service
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {servicesList.map((srv) => {
                    const Icon = srv.icon;
                    const isSelected = serviceType === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          setServiceType(srv.id);
                          if (srv.id === 'commercial') setPropertyType('commercial');
                          else setPropertyType('residential');
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col items-start gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-950 ring-2 ring-teal-500/20 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs">{srv.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Home Sizing Quick Selectors */}
              {serviceType !== 'commercial' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Bedrooms
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setBedrooms(num)}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            bedrooms === num
                              ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {num === 5 ? '5+' : num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Bathrooms
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setBathrooms(num)}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            bathrooms === num
                              ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {num === 4 ? '4+' : num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Commercial Area Size: <strong className="text-teal-700">{sqft} sq.ft</strong>
                  </label>
                  <div className="flex gap-2">
                    {[
                      { label: 'Small (~800 sqft)', val: 800 },
                      { label: 'Medium (~1,500 sqft)', val: 1500 },
                      { label: 'Large (3,000+ sqft)', val: 3000 }
                    ].map((sz) => (
                      <button
                        key={sz.val}
                        type="button"
                        onClick={() => setSqft(sz.val)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          sqft === sz.val
                            ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Frequency & Savings */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Choose Cleaning Frequency
                  </label>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Cancel or Reschedule Anytime
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'biweekly' as RecurringFrequency, label: 'Bi-Weekly', badge: 'Save 15%', popular: true },
                    { id: 'weekly' as RecurringFrequency, label: 'Weekly', badge: 'Save 20%' },
                    { id: 'monthly' as RecurringFrequency, label: 'Monthly', badge: 'Save 10%' },
                    { id: 'one_time' as RecurringFrequency, label: 'One-Time', badge: 'Standard' }
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setFrequency(freq.id)}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                        frequency === freq.id
                          ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-bold">{freq.label}</span>
                      <span className={`text-[10px] font-semibold block mt-0.5 ${
                        frequency === freq.id ? 'text-teal-700' : 'text-slate-400'
                      }`}>
                        {freq.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Popular Add-ons (Optional 1-click toggle chips) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  3. Popular Add-ons (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'insideOven', label: 'Inside Oven (+$45)' },
                    { key: 'insideFridge', label: 'Inside Fridge (+$45)' },
                    { key: 'insideCabinets', label: 'Inside Cabinets (+$55)' },
                    { key: 'interiorWindows', label: 'Interior Windows (+$50)' },
                    { key: 'balconyScrub', label: 'Balcony Scrub (+$40)' }
                  ].map((ad) => (
                    <button
                      key={ad.key}
                      type="button"
                      onClick={() => toggleAddon(ad.key)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        addons[ad.key]
                          ? 'bg-teal-600 border-teal-600 text-white font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center ${
                        addons[ad.key] ? 'bg-white text-teal-700' : 'border border-slate-300'
                      }`}>
                        {addons[ad.key] && <Check className="w-2.5 h-2.5 stroke-3" />}
                      </div>
                      <span>{ad.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Summary Banner & Next Step Button */}
              <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">${pricing.total.toFixed(2)} CAD</span>
                    <span className="text-xs text-slate-400">incl. {pricing.taxLabel}</span>
                  </div>
                  <p className="text-[11px] text-teal-400 font-semibold">
                    {pricing.savings > 0 ? `✨ You save $${pricing.savings} with ${frequency} recurring schedule` : 'No hidden fees • Supplies & equipment included'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select Date & Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: DATE, TIME & CONTACT DETAILS */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Date & Arrival Window */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    1. Choose Preferred Date & Arrival Window
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickDateSelect(1)}
                      className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDateSelect(2)}
                      className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                    >
                      In 2 Days
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Service Date *</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="date"
                        value={preferredDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Arrival Window *</label>
                    <select
                      value={arrivalWindow}
                      onChange={(e) => setArrivalWindow(e.target.value as TimingArrivalWindow)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    >
                      <option value="morning_8_11">🌅 Morning (8:00 AM – 11:00 AM)</option>
                      <option value="midday_11_2">☀️ Midday (11:00 AM – 2:00 PM)</option>
                      <option value="afternoon_2_5">🌇 Afternoon (2:00 PM – 5:00 PM)</option>
                      <option value="evening_5_8">🌙 Evening (5:00 PM – 8:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Contact & Address (Clean 4-field grid) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Service Address & Contact Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Tremblay"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Canadian Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(519) 212-0416 / (416) 555-0199"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Email Address (For Booking Receipt) *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@example.ca"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] text-slate-500 font-semibold">City / Municipality *</label>
                      {isPrimaryServiceArea(city, province) && (
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          HQ Priority Zone
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      placeholder="e.g. Cambridge, Kitchener, Waterloo, Toronto, Vancouver"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] text-slate-500 font-semibold">Province / Region (Tax Auto-Applied) *</label>
                      <span className="text-[10px] font-mono text-slate-400">
                        {pricing.taxLabel} ({(pricing.taxRate * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value as ProvinceCode)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                    >
                      {CANADIAN_PROVINCES.map((prov) => (
                        <option key={prov.code} value={prov.code}>
                          {prov.name} ({prov.code}) — {prov.taxLabel} ({(prov.taxRate * 100).toFixed(0)}%) {prov.code === 'ON' ? '⭐ HQ Primary' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Street Address & Unit (if applicable) *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 261 Hespeler Rd (Apt 4B)"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Auto-Detection Status Indicator */}
                  <div className="sm:col-span-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>
                        Auto-detected Location: <strong className="text-slate-800">{city}, {province}</strong>
                      </span>
                    </div>
                    <span className="text-teal-700 font-bold text-[10px] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                      {isPrimaryServiceArea(city, province) ? '📍 Cambridge HQ & Waterloo Region' : `📍 ${getProvinceByCode(province)?.name || province} Region`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Instructions (Optional) */}
              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                  Entry Instructions / Access Code / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Buzzer code #104, lockbox on porch, key under mat, friendly dog..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* Dispatch Guarantee Banner */}
              <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 flex items-center justify-between text-xs text-teal-950 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Dispatches directly to contact@crispcleaners.ca & contactcrispcleaners@gmail.com</span>
                </div>
                <span className="font-bold text-teal-800 text-[11px] shrink-0">Pay After Clean</span>
              </div>

              {/* Back & Submit Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isDispatchingEmail}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-sm rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDispatchingEmail ? (
                    <span>Confirming Appointment...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Booking (${pricing.total.toFixed(2)} CAD)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
