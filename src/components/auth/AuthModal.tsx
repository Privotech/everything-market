import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Eye,
  EyeOff,
  Store,
  Database,
  CheckCircle2,
  AlertTriangle,
  History,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { evaluatePasswordStrength, UserRole } from '@/lib/neon-auth.ts';

export default function AuthModal() {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    logout,
    changeUserPassword,
    dbInfo,
    securityLogs,
    refreshSecurityLogs,
  } = useAuth();

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [lockoutCountdown, setLockoutCountdown] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('BUYER');
  const [regStoreName, setRegStoreName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // Security / Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutCountdown === null || lockoutCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockoutCountdown((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutCountdown]);

  if (!isAuthModalOpen) return null;

  // Real-time password evaluation for registration
  const regStrength = evaluatePasswordStrength(regPassword);
  const newPassStrength = evaluatePasswordStrength(newPassword);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setIsSubmitting(true);

    try {
      const res = await login(signInEmail, signInPassword);
      if (!res.success) {
        setSignInError(res.error || 'Authentication failed');
        if (res.lockoutSecondsRemaining) {
          setLockoutCountdown(res.lockoutSecondsRemaining);
        }
      }
    } catch {
      setSignInError('An unexpected server error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      return;
    }

    if (regStrength.score < 2) {
      setRegError('Password does not satisfy the security requirements');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await register({
        email: regEmail,
        password: regPassword,
        firstName: regFirstName,
        lastName: regLastName,
        phone: regPhone,
        role: regRole,
        storeName: regRole === 'SELLER' ? regStoreName : undefined,
      });

      if (!res.success) {
        setRegError(res.error || 'Registration failed');
      } else {
        setRegSuccess(true);
      }
    } catch {
      setRegError('Failed to register account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMessage({ text: 'New passwords do not match', isError: true });
      return;
    }

    if (newPassStrength.score < 2) {
      setPasswordChangeMessage({
        text: 'New password must meet security requirements',
        isError: true,
      });
      return;
    }

    setIsSubmitting(true);
    const res = await changeUserPassword(oldPassword, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setPasswordChangeMessage({
        text: 'Password updated successfully! Salted PBKDF2 hash stored.',
        isError: false,
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setPasswordChangeMessage({
        text: res.error || 'Failed to update password',
        isError: true,
      });
    }
  };

  const applyDemoCredentials = (email: string, pass: string) => {
    setSignInEmail(email);
    setSignInPassword(pass);
    setSignInError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                EverythingMarket ID
                <span className="flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                  <Database className="h-3 w-3" />
                  NeonDB
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                PostgreSQL & PBKDF2 Cryptographic Security
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1">
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signin');
                  setSignInError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  authModalMode === 'signin'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setRegError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  authModalMode === 'signup'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Register / Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAuthModalMode('profile')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  authModalMode === 'profile'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Account Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('security');
                  refreshSecurityLogs();
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  authModalMode === 'security'
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Security & Audit Logs
              </button>
            </>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* ===================== SIGN IN VIEW ===================== */}
          {authModalMode === 'signin' && !isAuthenticated && (
            <div className="space-y-5">
              {/* Lockout Warning */}
              {lockoutCountdown !== null && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-rose-300">
                  <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold">Brute-Force Security Cooldown Active</p>
                    <p className="text-rose-200/80 mt-0.5">
                      Account locked to prevent credential stuffing. Please wait{' '}
                      <span className="font-mono font-bold text-white bg-rose-950 px-1.5 py-0.5 rounded border border-rose-500/30">
                        {lockoutCountdown}s
                      </span>{' '}
                      before attempting another login.
                    </p>
                  </div>
                </div>
              )}

              {/* General Error Banner */}
              {signInError && !lockoutCountdown && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{signInError}</span>
                </div>
              )}

              {/* 1-Click Quick Demo Switcher */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Quick Test Accounts</span>
                  <span className="text-[10px] text-amber-400 font-normal">1-click autofill</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyDemoCredentials('buyer@everythingmarket.dev', 'Password@123!')}
                    className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900 p-2 text-center hover:border-orange-500/50 hover:bg-orange-500/10 transition-colors"
                  >
                    <User className="h-4 w-4 text-orange-400 mb-1" />
                    <span className="text-xs font-bold text-white">Shopper</span>
                    <span className="text-[10px] text-slate-400">Buyer Role</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyDemoCredentials('seller@everythingmarket.dev', 'Password@123!')}
                    className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900 p-2 text-center hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors"
                  >
                    <Store className="h-4 w-4 text-purple-400 mb-1" />
                    <span className="text-xs font-bold text-white">Merchant</span>
                    <span className="text-[10px] text-slate-400">Seller Hub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyDemoCredentials('admin@everythingmarket.dev', 'Password@123!')}
                    className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900 p-2 text-center hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400 mb-1" />
                    <span className="text-xs font-bold text-white">Admin</span>
                    <span className="text-[10px] text-slate-400">Full Access</span>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="shopper@everythingmarket.dev"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <span className="text-[11px] text-slate-400">Encrypted with PBKDF2</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || lockoutCountdown !== null}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      <span>Sign In to EverythingMarket</span>
                    </>
                  )}
                </button>
              </form>

              {/* Switch to Signup */}
              <div className="text-center pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('signup');
                      setRegError(null);
                    }}
                    className="font-bold text-orange-400 hover:underline"
                  >
                    Register free with NeonDB
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ===================== REGISTER VIEW ===================== */}
          {authModalMode === 'signup' && !isAuthenticated && (
            <div className="space-y-5">
              {regError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Account registered and authenticated via PostgreSQL!</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Account Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Select Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegRole('BUYER')}
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                        regRole === 'BUYER'
                          ? 'border-orange-500 bg-orange-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <User className={`h-5 w-5 mt-0.5 ${regRole === 'BUYER' ? 'text-orange-400' : ''}`} />
                      <div>
                        <div className="text-xs font-bold text-white">Shopper / Buyer</div>
                        <div className="text-[11px] text-slate-400">
                          Shop flash deals, wholesale B2B, track orders
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegRole('SELLER')}
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                        regRole === 'SELLER'
                          ? 'border-purple-500 bg-purple-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Store className={`h-5 w-5 mt-0.5 ${regRole === 'SELLER' ? 'text-purple-400' : ''}`} />
                      <div>
                        <div className="text-xs font-bold text-white">Verified Merchant</div>
                        <div className="text-[11px] text-slate-400">
                          List products, manage stock, set MOQs
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Store Name if Seller */}
                {regRole === 'SELLER' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Merchant Store Name
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                      <input
                        type="text"
                        required
                        value={regStoreName}
                        onChange={(e) => setRegStoreName(e.target.value)}
                        placeholder="Apex Global Factory Store"
                        className="w-full rounded-xl border border-purple-500/50 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="shopper@domain.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password with Strength Meter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Master Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 8 chars with upper, lower, numbers"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Bar */}
                  {regPassword.length > 0 && (
                    <div className="mt-2 space-y-1.5 rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Password Strength:</span>
                        <span
                          className={`font-bold ${
                            regStrength.score >= 4
                              ? 'text-emerald-400'
                              : regStrength.score === 3
                              ? 'text-yellow-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {regStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            regStrength.score >= 4
                              ? 'bg-emerald-500'
                              : regStrength.score === 3
                              ? 'bg-yellow-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${regStrength.percentage}%` }}
                        />
                      </div>

                      {/* Rule Checks Pill Grid */}
                      <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                        <span
                          className={`flex items-center gap-1 ${
                            regStrength.checks.minLength ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {regStrength.checks.minLength ? '✓' : '○'} 8+ Characters
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            regStrength.checks.hasUpper && regStrength.checks.hasLower
                              ? 'text-emerald-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {regStrength.checks.hasUpper && regStrength.checks.hasLower
                            ? '✓'
                            : '○'}{' '}
                          Upper & Lowercase
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            regStrength.checks.hasNumber ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {regStrength.checks.hasNumber ? '✓' : '○'} Number (0-9)
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            regStrength.checks.hasSpecial ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {regStrength.checks.hasSpecial ? '✓' : '○'} Special Symbol
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={`w-full rounded-xl border bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none ${
                      regConfirmPassword && regConfirmPassword !== regPassword
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-orange-500'
                    }`}
                  />
                  {regConfirmPassword && regConfirmPassword !== regPassword && (
                    <p className="text-[11px] text-rose-400 mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || regStrength.score < 2 || regPassword !== regConfirmPassword}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Registering in NeonDB...</span>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ===================== ACCOUNT PROFILE VIEW ===================== */}
          {authModalMode === 'profile' && isAuthenticated && user && (
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-lg font-black text-white shadow-lg shadow-orange-500/20">
                    {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'EverythingMarket Shopper'}
                    </h3>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-400 border border-orange-500/30">
                        {user.role} ROLE
                      </span>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {user.sellerProfile && (
                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-xs">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Store className="h-4 w-4" />
                      Merchant Store: {user.sellerProfile.storeName}
                    </div>
                    <p className="text-purple-200/70 text-[11px] mt-0.5">
                      Slug: /{user.sellerProfile.storeSlug} • Status: {user.sellerProfile.verificationStatus}
                    </p>
                  </div>
                )}
              </div>

              {/* Database & Infrastructure Security Badge */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Database className="h-4 w-4" />
                    {dbInfo.provider}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    SSL Enabled
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-400 break-all bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  {dbInfo.maskedUrl}
                </div>
                <p className="text-[10px] text-slate-500">
                  Zero-trust identity store schema synced with Prisma ORM / PostgreSQL.
                </p>
              </div>

              {/* Logout Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('security')}
                  className="text-xs font-semibold text-orange-400 hover:underline flex items-center gap-1"
                >
                  <History className="h-3.5 w-3.5" />
                  View Security & Audit Logs
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* ===================== SECURITY & AUDIT VIEW ===================== */}
          {authModalMode === 'security' && isAuthenticated && user && (
            <div className="space-y-6">
              {/* Change Password Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-orange-400" />
                  Change Master Password
                </h3>

                {passwordChangeMessage && (
                  <div
                    className={`rounded-lg p-2.5 text-xs flex items-center gap-1.5 ${
                      passwordChangeMessage.isError
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {passwordChangeMessage.isError ? (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    )}
                    <span>{passwordChangeMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !oldPassword || !newPassword}
                    className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
                  >
                    Update Password (PBKDF2-SHA512)
                  </button>
                </form>
              </div>

              {/* Security Audit Log */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    Security Event Audit Log
                  </h3>
                  <button
                    type="button"
                    onClick={refreshSecurityLogs}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Refresh
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {securityLogs.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">
                      No security alerts or login attempts recorded yet.
                    </p>
                  ) : (
                    securityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold font-mono uppercase ${
                                log.severity === 'CRITICAL'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : log.severity === 'WARNING'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {log.eventType}
                            </span>
                            <span className="text-[11px] text-slate-300 font-medium">{log.details}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
