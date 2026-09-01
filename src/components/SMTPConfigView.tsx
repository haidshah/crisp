import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Server, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Save, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Globe, 
  Zap, 
  HelpCircle, 
  Check, 
  Cpu, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { EmailService } from '../services/emailService';

export const SMTPConfigView: React.FC = () => {
  const [host, setHost] = useState('mail.crispcleaners.ca');
  const [port, setPort] = useState(465);
  const [secure, setSecure] = useState(true);
  const [user, setUser] = useState('contact@crispcleaners.ca');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [fromName, setFromName] = useState('Crisp Cleaners Canada');
  const [fromEmail, setFromEmail] = useState('contact@crispcleaners.ca');
  const [adminEmails, setAdminEmails] = useState('contact@crispcleaners.ca, contactcrispcleaners@gmail.com');
  const [testRecipient, setTestRecipient] = useState('contact@crispcleaners.ca');
  
  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [hasExistingPassword, setHasExistingPassword] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    timestamp: string;
  } | null>(null);

  // Load existing config on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const data = await EmailService.getSMTPConfig();
      if (data) {
        if (data.host) setHost(data.host);
        if (data.port) setPort(Number(data.port));
        if (data.secure !== undefined) setSecure(data.secure);
        if (data.user) setUser(data.user);
        if (data.fromName) setFromName(data.fromName);
        if (data.fromEmail) setFromEmail(data.fromEmail);
        if (data.adminNotificationEmails) {
          setAdminEmails(data.adminNotificationEmails.join(', '));
        }
        setHasExistingPassword(!!data.hasPassword);
        setIsConfigured(!!data.isConfigured);
        if (data.updatedAt) setUpdatedAt(data.updatedAt);
      }
    } catch (e) {
      console.warn('Could not load SMTP config:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (presetType: 'cpanel' | 'gmail' | 'office365') => {
    if (presetType === 'cpanel') {
      setHost('mail.crispcleaners.ca');
      setPort(465);
      setSecure(true);
      setUser('contact@crispcleaners.ca');
      setFromEmail('contact@crispcleaners.ca');
      setFromName('Crisp Cleaners Canada');
    } else if (presetType === 'gmail') {
      setHost('smtp.gmail.com');
      setPort(465);
      setSecure(true);
      setUser('contactcrispcleaners@gmail.com');
      setFromEmail('contactcrispcleaners@gmail.com');
      setFromName('Crisp Cleaners');
    } else if (presetType === 'office365') {
      setHost('smtp.office365.com');
      setPort(587);
      setSecure(false);
      setUser('contact@crispcleaners.ca');
      setFromEmail('contact@crispcleaners.ca');
      setFromName('Crisp Cleaners Canada');
    }
    setSaveSuccess(null);
    setTestResult(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);
    setTestResult(null);

    const emailList = adminEmails
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.includes('@'));

    try {
      const res = await EmailService.saveSMTPConfig({
        host,
        port: Number(port),
        secure: secure || port === 465,
        user,
        pass: pass || undefined,
        fromName,
        fromEmail,
        adminNotificationEmails: emailList.length ? emailList : ['contact@crispcleaners.ca', 'contactcrispcleaners@gmail.com']
      });

      setSaveSuccess('SMTP credentials saved successfully! Active transporter refreshed.');
      setIsConfigured(true);
      if (pass) setHasExistingPassword(true);
      setUpdatedAt(new Date().toISOString());
      setPass('');
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Failed to save SMTP credentials',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await EmailService.testSMTPConnection({
        host,
        port: Number(port),
        secure: secure || port === 465,
        user,
        pass: pass || undefined,
        testRecipient: testRecipient.trim() || 'contact@crispcleaners.ca'
      });

      setTestResult({
        success: true,
        message: res.message || `Test email successfully sent to ${testRecipient}!`,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Connection test failed. Check host, port, username, or app password.',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Email & SMTP Server Configuration</h2>
              {isConfigured ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured & Active</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Awaiting Password</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure cPanel Webmail, Google Workspace, or custom SMTP so all customer bookings, quotes, and partner applications are dispatched directly to <strong className="text-slate-700 font-semibold">contact@crispcleaners.ca</strong> & <strong className="text-slate-700 font-semibold">contactcrispcleaners@gmail.com</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={loadConfig}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Server Config</span>
        </button>
      </div>

      {/* Quick Setup Presets */}
      <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          1-Click Email Provider Presets
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleApplyPreset('cpanel')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              host === 'mail.crispcleaners.ca'
                ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900">cPanel Webmail (crispcleaners.ca)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">Recommended</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Host: mail.crispcleaners.ca • Port 465 (SSL). Native cPanel email accounts.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('gmail')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              host === 'smtp.gmail.com'
                ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900">Google Workspace / Gmail</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">App Password</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Host: smtp.gmail.com • Port 465 (SSL) / 587 (TLS). Uses 16-digit Google App Password.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('office365')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              host === 'smtp.office365.com'
                ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900">Microsoft 365 / Outlook</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">TLS 587</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Host: smtp.office365.com • Port 587 (STARTTLS).
            </p>
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Server className="w-4 h-4 text-teal-600" />
                <span>SMTP Connection Credentials</span>
              </h3>
              {updatedAt && (
                <span className="text-[11px] text-slate-400">
                  Last updated: {new Date(updatedAt).toLocaleDateString()} {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SMTP Host Server *
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="mail.crispcleaners.ca"
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Port *
                </label>
                <select
                  value={port}
                  onChange={(e) => {
                    const p = Number(e.target.value);
                    setPort(p);
                    setSecure(p === 465);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value={465}>465 (SSL Encrypted)</option>
                  <option value={587}>587 (TLS / STARTTLS)</option>
                  <option value={2525}>2525 (Alternative)</option>
                  <option value={25}>25 (Standard Unencrypted)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SMTP Username / Email Address *
                </label>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="contact@crispcleaners.ca"
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    SMTP Password / App Secret *
                  </label>
                  {hasExistingPassword && !pass && (
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
                      Password Saved
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder={hasExistingPassword ? '•••••••••••••••• (Leave blank to keep)' : 'Enter email account password'}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sender From Name
                </label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Crisp Cleaners Canada"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sender From Email Address
                </label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="contact@crispcleaners.ca"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Notification Inboxes (Dual-Delivery Destinations)
              </label>
              <input
                type="text"
                value={adminEmails}
                onChange={(e) => setAdminEmails(e.target.value)}
                placeholder="contact@crispcleaners.ca, contactcrispcleaners@gmail.com"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Comma-separated list. All appointments, quotes, and franchise applications are automatically delivered to all listed inboxes.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Credentials persist to server storage (.smtp-config.json)</span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save SMTP Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Live Tester & Diagnostics */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Live SMTP Tester</span>
            </h3>

            <p className="text-xs text-slate-500">
              Verify server connection, authentication handshake, and dispatch a test email.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Send Test Email To:
              </label>
              <input
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="contact@crispcleaners.ca"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Connecting to Mail Server...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-teal-400" />
                  <span>Test Connection & Send Email</span>
                </>
              )}
            </button>

            {testResult && (
              <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                testResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testResult.success ? 'SMTP Handshake Succeeded!' : 'Connection Failed'}</span>
                </div>
                <p className="text-[11px] opacity-90">
                  {testResult.message || testResult.error}
                </p>
                <div className="text-[10px] opacity-60 text-right pt-1">
                  Checked at {testResult.timestamp}
                </div>
              </div>
            )}
          </div>

          {/* cPanel Guide Card */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>cPanel Quick Guide</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
              <li>
                In cPanel, create the email account under <strong className="text-white">Email Accounts</strong>: <code className="text-teal-300 font-mono">contact@crispcleaners.ca</code>.
              </li>
              <li>
                Set SMTP Host to <code className="text-teal-300 font-mono">mail.crispcleaners.ca</code>.
              </li>
              <li>
                Use SSL Port <strong className="text-white">465</strong> for encrypted transport.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
