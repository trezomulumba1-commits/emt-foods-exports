import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, ShieldCheck, ArrowRight, RefreshCw, Plane } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
  onSignInSuccess?: () => void;
}

const vibrate = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
};

export default function LoginModal({ isOpen, onClose, onLogin, onSignInSuccess }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    vibrate();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isRegister && !fullName) {
      setError('Please provide your name.');
      return;
    }

    setIsLoading(true);

    if (isRegister) {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          }
        }
      });
      setIsLoading(false);
      if (authError) {
        setError(authError.message);
      } else {
        setSuccess('Account created successfully! You can now log in.');
        setTimeout(() => {
          setIsRegister(false);
          setPassword('');
          setSuccess('');
        }, 2500);
      }
    } else {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setIsLoading(false);
      if (authError) {
        setError('Invalid login credentials. Please check your email and password.');
      } else {
        setSuccess('Login successful! Opening your profile...');
        if (onLogin) onLogin();
        if (onSignInSuccess) onSignInSuccess();
        setTimeout(() => {
          onClose();
          setEmail('');
          setPassword('');
          setSuccess('');
        }, 1500);
      }
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    vibrate();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    setIsLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess('A password reset link has been sent to your email. Please check your inbox!');
    }
  };

  const handleGoogleLogin = async () => {
    vibrate();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (authError) {
      setError(authError.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-surf w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border bt z-10 flex flex-col"
          >
            {/* Top Brand Banner using generated Air Freight image */}
            <div className="px-6 py-8 flex items-center justify-between relative overflow-hidden bg-[#0a0a0a]">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none" 
                style={{ backgroundImage: 'url(/air_freight_cargo.png)' }}
              />
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="ac-bg p-2 rounded-lg">
                  <Plane className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="serif text-xl tracking-wide text-white">
                    EMT Foods Exports
                  </h3>
                  <p className="t3 mono text-[9px] uppercase tracking-wider">
                    {isForgotPassword ? 'Reset Password' : isRegister ? 'Register Account' : 'Client Login'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { vibrate(); onClose(); }}
                className="relative z-10 text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Form */}
            <div className="p-6 space-y-5">
              {/* Trust Badge */}
              <div className="bg-t2 border bt p-3 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 ac shrink-0" />
                <span className="t2 text-xs font-light leading-snug">
                  Sign in to view your quotes, request bulk purchases, and track active shipments.
                </span>
              </div>

              {/* Status Alerts */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  <p className="text-xs font-medium text-red-500">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                  <p className="text-xs font-medium text-green-600 dark:text-green-400">{success}</p>
                </div>
              )}

              {isForgotPassword ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="mono t3 text-[10px] uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 t3" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-transparent border bt rounded-lg text-sm t focus:outline-none focus:border-[var(--accent)] transition-all"
                        required />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading}
                    className="w-full btn-primary py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                    {isLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <div className="text-center pt-2">
                    <button type="button" onClick={() => { vibrate(); setIsForgotPassword(false); setError(''); setSuccess(''); }}
                      className="mono text-[10px] uppercase tracking-wider ac hover:underline cursor-pointer">
                      Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="mono t3 text-[10px] uppercase tracking-wider block">Your Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-3 py-2.5 bg-transparent border bt rounded-lg text-sm t focus:outline-none focus:border-[var(--accent)] transition-all"
                          required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="mono t3 text-[10px] uppercase tracking-wider block">Company</label>
                        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Optional"
                          className="w-full px-3 py-2.5 bg-transparent border bt rounded-lg text-sm t focus:outline-none focus:border-[var(--accent)] transition-all" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="mono t3 text-[10px] uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 t3" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-transparent border bt rounded-lg text-sm t focus:outline-none focus:border-[var(--accent)] transition-all"
                        required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="mono t3 text-[10px] uppercase tracking-wider block">Password</label>
                      {!isRegister && (
                        <button type="button" onClick={() => { vibrate(); setIsForgotPassword(true); setError(''); setSuccess(''); }}
                          className="text-[10px] ac hover:underline cursor-pointer font-medium">
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 t3" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-transparent border bt rounded-lg text-sm t focus:outline-none focus:border-[var(--accent)] transition-all"
                        required />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading}
                    className="w-full btn-primary py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                    {isLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Please wait...</> : <>{isRegister ? 'Register Account' : 'Sign In'} <ArrowRight className="w-4 h-4" /></>}
                  </button>

                  <div className="relative py-2 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t bt"></div>
                    </div>
                    <div className="relative bg-surf px-4 text-[10px] uppercase tracking-widest t3">or</div>
                  </div>

                  <button type="button" onClick={handleGoogleLogin} disabled={isLoading}
                    className="w-full btn-ghost py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[10px] t3 mr-1 font-light">
                      {isRegister ? 'Already have an account?' : 'Need a customer account?'}
                    </span>
                    <button type="button" onClick={() => { vibrate(); setIsRegister(!isRegister); setError(''); setSuccess(''); }}
                      className="mono text-[10px] uppercase tracking-wider ac hover:underline cursor-pointer">
                      {isRegister ? 'Sign In' : 'Sign Up'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
