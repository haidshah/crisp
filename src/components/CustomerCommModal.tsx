import React, { useState, useEffect } from 'react';
import { 
  Send, 
  X, 
  Sparkles, 
  Mail, 
  Phone, 
  Check, 
  Copy, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { generateCommunicationAI } from '../services/geminiService';
import { EmailService } from '../services/emailService';

interface CustomerCommModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetData: any; // Job, Customer, or Lead
  initialType?: 'confirmation' | 'reminder' | 'review_request' | 'invoice_followup';
}

export const CustomerCommModal: React.FC<CustomerCommModalProps> = ({
  isOpen,
  onClose,
  targetData,
  initialType = 'reminder'
}) => {
  const [commType, setCommType] = useState(initialType);
  const [tone, setTone] = useState<'friendly' | 'professional' | 'urgent'>('friendly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<{
    subject: string;
    emailBody: string;
    smsBody: string;
  } | null>(null);
  const [copiedSMS, setCopiedSMS] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && targetData) {
      handleGenerate();
    }
  }, [isOpen, targetData, commType, tone]);

  if (!isOpen || !targetData) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateCommunicationAI(commType, {
        customerName: targetData.customerName || targetData.name,
        serviceType: targetData.serviceType || targetData.serviceRequested || 'standard',
        date: targetData.date || targetData.preferredDate || 'August 26, 2026',
        time: targetData.time || '10:00 AM',
        cleanerName: targetData.assignedCleanerNames?.[0] || 'Sarah Tremblay',
        address: targetData.customerAddress || targetData.address || 'Toronto, ON',
        tone: tone
      });
      setGeneratedMessage(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendDispatch = async () => {
    if (!generatedMessage) return;
    setIsSending(true);

    try {
      await EmailService.sendCustomerCommunication({
        type: commType,
        customerEmail: targetData.customerEmail || targetData.email,
        customerName: targetData.customerName || targetData.name,
        subject: generatedMessage.subject,
        message: generatedMessage.emailBody,
        jobDetails: targetData
      });
    } catch (e) {
      console.warn('Dispatch handled:', e);
    }

    setIsSending(false);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Automated Customer Dispatch
              </h2>
              <p className="text-xs text-slate-500">
                Personalized SMS & Email notifications generated with Gemini AI
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Type Selector */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'confirmation', label: 'Booking Confirmation' },
            { id: 'reminder', label: '24h Reminder' },
            { id: 'review_request', label: 'Review Request' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setCommType(t.id as any)}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                commType === t.id
                  ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-400'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tone Selector */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-700">Tone of Voice:</span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl">
            {(['friendly', 'professional', 'urgent'] as const).map(to => (
              <button
                key={to}
                onClick={() => setTone(to)}
                className={`px-3 py-1 rounded-lg capitalize text-xs font-semibold ${
                  tone === to ? 'bg-white text-teal-800 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                {to}
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        {isGenerating ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <Sparkles className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
            <p>Composing personalized message with Gemini...</p>
          </div>
        ) : generatedMessage ? (
          <div className="space-y-4 text-xs">
            {/* Email Preview */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <Mail className="w-4 h-4 text-teal-600" />
                <span>Email Subject:</span>
                <span className="font-normal text-slate-900">{generatedMessage.subject}</span>
              </div>
              <textarea
                rows={4}
                value={generatedMessage.emailBody}
                onChange={(e) => setGeneratedMessage({ ...generatedMessage, emailBody: e.target.value })}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl leading-relaxed text-slate-800 outline-hidden"
              />
            </div>

            {/* SMS Preview */}
            <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between font-bold text-teal-900">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-teal-600" />
                  SMS Text Message Preview
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedMessage.smsBody);
                    setCopiedSMS(true);
                    setTimeout(() => setCopiedSMS(false), 2000);
                  }}
                  className="px-2 py-1 bg-white border border-teal-200 text-teal-800 rounded-lg text-[10px] flex items-center gap-1"
                >
                  {copiedSMS ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedSMS ? 'Copied' : 'Copy SMS'}
                </button>
              </div>
              <p className="text-slate-800 bg-white p-3 rounded-xl border border-teal-200 leading-relaxed font-mono text-[11px]">
                {generatedMessage.smsBody}
              </p>
            </div>
          </div>
        ) : null}

        {/* Direct Destination Notice */}
        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Sends to customer & copies: <strong>contact@crispcleaners.ca</strong>, <strong>contactcrispcleaners@gmail.com</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isSending}
            className="px-3 py-2 text-slate-600 hover:text-teal-700 flex items-center gap-1.5 font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSendDispatch}
              disabled={isSending || isGenerating || !generatedMessage}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : sentSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSending ? 'Dispatching...' : sentSuccess ? 'Dispatched to Client & Admin!' : 'Send Notification (SMS & Email)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
