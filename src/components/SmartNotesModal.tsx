import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  FileText, 
  Mic, 
  Save, 
  Check, 
  Copy,
  AlertCircle
} from 'lucide-react';
import { Job, Customer } from '../types';
import { cleanSmartNotesAI } from '../services/geminiService';

interface SmartNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  customer?: Customer;
  onSaveNotes: (jobId: string, cleanedNotes: string) => void;
}

export const SmartNotesModal: React.FC<SmartNotesModalProps> = ({
  isOpen,
  onClose,
  job,
  customer,
  onSaveNotes
}) => {
  const [roughNotes, setRoughNotes] = useState(
    job?.cleanerNotes || 'Master bath done heavy soap scum took extra 20m. Living room rug vacuumed dog fur severe. Kitchen oven wiped good. Alarm set to 1994 on exit.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanedOutput, setCleanedOutput] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleRunCleanNotes = async () => {
    if (!roughNotes.trim()) return;
    setIsProcessing(true);
    try {
      const result = await cleanSmartNotesAI(roughNotes, {
        customerName: job.customerName,
        serviceType: job.serviceType,
        jobDate: job.date
      });
      setCleanedOutput(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToRecord = () => {
    const formattedNote = cleanedOutput?.structuredNotes || cleanedOutput?.professionalSummary || roughNotes;
    onSaveNotes(job.id, formattedNote);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-amber-300 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                AI Smart Field Notes Cleaner
              </h2>
              <p className="text-xs text-slate-500">
                Turns rough shorthand or voice speech into structured customer CRM logs
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Job Context Chip */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-800">{job.customerName}</span>
            <span className="text-slate-500 ml-2">({job.customerAddress})</span>
          </div>
          <span className="font-mono text-teal-700 font-bold uppercase">{job.serviceType.replace('_', ' ')}</span>
        </div>

        {/* Input Rough Field Notes */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-teal-600" />
              Raw Cleaner Field Speech / Shorthand
            </label>
            <span className="text-[10px] text-slate-400">Type rough bullets or speak</span>
          </div>
          <textarea
            rows={3}
            value={roughNotes}
            onChange={(e) => setRoughNotes(e.target.value)}
            placeholder="e.g. Master bath done, heavy grout, dog was friendly, lockbox code worked..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-teal-500 outline-hidden leading-relaxed text-slate-800"
          />
        </div>

        {/* Trigger Button */}
        <button
          onClick={handleRunCleanNotes}
          disabled={isProcessing || !roughNotes.trim()}
          className="w-full py-2.5 bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          {isProcessing ? 'Processing Shorthand with Gemini...' : 'Transform into Professional CRM Note'}
        </button>

        {/* Cleaned Output */}
        {cleanedOutput && (
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-teal-200/80">
              <span className="font-bold text-teal-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Structured Service Log
              </span>
              <span className="text-[10px] text-teal-700 font-semibold uppercase">Formatted</span>
            </div>

            <p className="text-slate-800 leading-relaxed font-sans whitespace-pre-line bg-white p-3 rounded-xl border border-teal-200">
              {cleanedOutput.professionalSummary || cleanedOutput.structuredNotes}
            </p>

            {cleanedOutput.actionItems && cleanedOutput.actionItems.length > 0 && (
              <div className="space-y-1">
                <span className="font-bold text-teal-900 text-[11px]">Follow-Up Flags:</span>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                  {cleanedOutput.actionItems.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>

          {cleanedOutput && (
            <button
              onClick={handleSaveToRecord}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {savedSuccess ? 'Saved to CRM!' : 'Save to Job & Customer Record'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
