import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  X, 
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  LogIn,
  Layers
} from 'lucide-react';
import { AdminAuthUser, UserRole } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminAuthUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('crisp2026!');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Valid credential check (support default admin / crisp2026!, or custom staff)
      if ((username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'crisp') && 
          (password === 'crisp2026!' || password === 'admin123' || password === 'crisp')) {
        
        const user: AdminAuthUser = {
          id: 'admin-' + Date.now(),
          username: username.trim(),
          name: username.toLowerCase() === 'admin' ? 'Sarah Tremblay (Lead Admin)' : 'Office Operator',
          email: `${username.trim().toLowerCase()}@crispcleaners.ca`,
          role: selectedRole,
          token: 'jwt-crisp-' + Math.random().toString(36).substring(2),
          loginTime: new Date().toISOString()
        };

        setIsLoading(false);
        onLoginSuccess(user);
      } else if (username.trim() && password.trim().length >= 4) {
        // Allow flexible staff/cleaner credentials with custom roles
        const user: AdminAuthUser = {
          id: 'user-' + Date.now(),
          username: username.trim(),
          name: `${username.charAt(0).toUpperCase() + username.slice(1)} (Staff)`,
          email: `${username.trim().toLowerCase()}@crispcleaners.ca`,
          role: selectedRole,
          token: 'jwt-crisp-' + Math.random().toString(36).substring(2),
          loginTime: new Date().toISOString()
        };
        setIsLoading(false);
        onLoginSuccess(user);
      } else {
        setIsLoading(false);
        setError('Invalid username or password. Default is "admin" / "crisp2026!"');
      }
    }, 400);
  };

  const handleQuickDemoAdmin = () => {
    setUsername('admin');
    setPassword('crisp2026!');
    setSelectedRole('admin');
    const user: AdminAuthUser = {
      id: 'admin-demo',
      username: 'admin',
      name: 'Sarah Tremblay (Administrator)',
      email: 'admin@crispcleaners.ca',
      role: 'admin',
      token: 'jwt-demo-token',
      loginTime: new Date().toISOString()
    };
    onLoginSuccess(user);
  };

  const handleQuickDemoStaff = () => {
    setUsername('dispatcher');
    setPassword('crisp2026!');
    setSelectedRole('staff');
    const user: AdminAuthUser = {
      id: 'staff-demo',
      username: 'dispatcher',
      name: 'Marcus Dispatcher',
      email: 'dispatch@crispcleaners.ca',
      role: 'staff',
      token: 'jwt-staff-demo',
      loginTime: new Date().toISOString()
    };
    onLoginSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800">
                  Staff & Admin Portal
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Crisp Cleaners CRM Login
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Authorized access for management, dispatch & team leads
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Access Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'admin'
                    ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                Administrator
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('staff')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'staff'
                    ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                Office Dispatch
              </button>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Username or Staff ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded-sm border-slate-300 focus:ring-teal-500"
              />
              <span>Remember session on this device</span>
            </label>
            <span className="text-teal-700 font-semibold cursor-pointer hover:underline text-[11px]">
              Need Help?
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In to CRM Dashboard</span>
              </>
            )}
          </button>

          {/* Quick Demo Logins Box */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">
              Quick 1-Click Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="p-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700">
                    👑 Full Admin
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">admin / crisp2026!</p>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoStaff}
                className="p-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700">
                    📋 Dispatch Staff
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">dispatcher / crisp2026!</p>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
