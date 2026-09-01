import React, { useState } from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Key, 
  Server, 
  Copy, 
  Check
} from 'lucide-react';
import { isFirebaseActive, CRMStore } from '../lib/firebase';
import { SEED_CUSTOMERS, SEED_JOBS, SEED_CLEANERS, SEED_INVOICES, SEED_LEADS } from '../data/seedData';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  onResetData
}) => {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const isConnected = isFirebaseActive();

  if (!isOpen) return null;

  const sampleEnvConfig = `# Firebase Firestore Configuration (Optional)
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN="crisp-cleaners-crm.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="crisp-cleaners-crm"
VITE_FIREBASE_STORAGE_BUCKET="crisp-cleaners-crm.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""`;

  const handleExportJSON = () => {
    const backup = {
      customers: CRMStore.getCustomers(),
      jobs: CRMStore.getJobs(),
      cleaners: CRMStore.getCleaners(),
      invoices: CRMStore.getInvoices(),
      leads: CRMStore.getLeads(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crisp-cleaners-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleResetData = () => {
    onResetData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Firebase Firestore & Storage Engine
              </h2>
              <p className="text-slate-500">
                Hybrid Cloud Persistence with Instant Client Fallback
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          isConnected 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
            : 'bg-teal-50/70 border-teal-300 text-teal-950'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">
              {isConnected ? 'Connected to Firebase Firestore Live Database' : 'Active Storage Engine: Local Persistence Layer'}
            </h4>
            <p className="leading-relaxed text-slate-600">
              {isConnected
                ? 'Your CRM records are synchronizing in real time to your Firebase project.'
                : 'All changes (customers, job schedules, cleaner profiles, invoices, leads) are persisted locally in browser state. To link your remote Firebase Firestore cluster, add the standard Firebase environment variables.'}
            </p>
          </div>
        </div>

        {/* Environment Config Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Firebase Environment Variables</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(sampleEnvConfig);
                setCopiedEnv(true);
                setTimeout(() => setCopiedEnv(false), 2000);
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 flex items-center gap-1"
            >
              {copiedEnv ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedEnv ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 bg-slate-900 text-teal-200 rounded-xl font-mono text-[11px] overflow-x-auto">
            {sampleEnvConfig}
          </pre>
        </div>

        {/* Data Tools */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <span className="font-bold text-slate-800 text-xs">CRM Database Utilities</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportJSON}
              className="p-3 bg-white hover:bg-teal-50 border border-slate-200 rounded-xl font-semibold text-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>Export Full JSON Backup</span>
            </button>

            <button
              onClick={handleResetData}
              className="p-3 bg-white hover:bg-amber-50 border border-slate-200 rounded-xl font-semibold text-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>{resetDone ? 'Reset to Seed Data!' : 'Reset Demo Data'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
