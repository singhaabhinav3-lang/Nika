import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  KeyRound,
  User,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Crown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { firebaseAuthService, AuthUser } from '../services/firebase';
import { STYLE_AESTHETICS } from '../services/mockData';

interface AuthGateScreenProps {
  onSignedIn: (user: AuthUser) => void;
}

export const AuthGateScreen: React.FC<AuthGateScreenProps> = ({ onSignedIn }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [styleDNA, setStyleDNA] = useState('Quiet Luxury');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please provide both email and password.');
        }
        setSuccessMessage('Authenticating Atelier credentials...');
        const user = await firebaseAuthService.signIn(email, password);
        setSuccessMessage(`Welcome back, ${user.displayName || 'Client'}! Unlocking Atelier...`);
        setTimeout(() => {
          onSignedIn(user);
        }, 500);
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in your name, email, and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        setSuccessMessage('Creating client profile and generating Style DNA...');
        const user = await firebaseAuthService.signUp(name, email, password, styleDNA);
        setSuccessMessage(`Profile created for ${user.displayName}! Entering Atelier...`);
        setTimeout(() => {
          onSignedIn(user);
        }, 500);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setSuccessMessage('');
      setErrorMessage(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('Unlocking VIP Client Access (Elena Vance)...');
    try {
      const demoUser = await firebaseAuthService.signInDemoClient();
      setTimeout(() => {
        onSignedIn(demoUser);
      }, 400);
    } catch (e: any) {
      setErrorMessage('Could not sign in with demo client.');
      setIsLoading(false);
    }
  };

  const handleQuickFill = (presetEmail: string, presetPass: string, presetName?: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    if (presetName && mode === 'signup') {
      setName(presetName);
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-noir-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* Editorial Luxury Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-gold-500/10 via-noir-900/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl glass-panel-gold border border-gold-500/30 shadow-2xl p-6 sm:p-9 backdrop-blur-xl">
        {/* Monogram Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-noir-800 to-noir-900 border border-gold-500/40 mx-auto flex items-center justify-center shadow-luxury mb-3">
            <span className="font-serif font-black text-2xl gold-gradient-text tracking-tighter">N</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-noir-900 border border-gold-500/20 text-gold-400 text-[10px] font-mono tracking-widest uppercase mb-1">
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>AUTHENTICATION GATE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-silk-100 tracking-tight">
            NIKA <span className="font-normal italic text-gold-300">Atelier</span>
          </h1>
          <p className="text-xs text-silk-400 mt-1 max-w-xs mx-auto">
            "Tell NIKA where you're going, and NIKA tells you what to wear."
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="flex items-center p-1 rounded-xl bg-noir-900 border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              mode === 'signin'
                ? 'bg-gold-500 text-noir-950 font-bold shadow-sm'
                : 'text-silk-400 hover:text-silk-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              mode === 'signup'
                ? 'bg-gold-500 text-noir-950 font-bold shadow-sm'
                : 'text-silk-400 hover:text-silk-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-silk-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-noir-900 border border-white/10 text-silk-100 placeholder-silk-600 text-xs focus:outline-none focus:border-gold-500/60"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono uppercase text-silk-400">
                Email Address
              </label>
              {mode === 'signin' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('singhaabhinav3@gmail.com', 'password123')}
                    className="text-[10px] text-gold-400 hover:underline font-mono"
                  >
                    Use my email
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-silk-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@atelier.fashion"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-noir-900 border border-white/10 text-silk-100 placeholder-silk-600 text-xs focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
              Security Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-silk-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-noir-900 border border-white/10 text-silk-100 placeholder-silk-600 text-xs focus:outline-none focus:border-gold-500/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silk-500 hover:text-silk-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                Primary Aesthetic Vibe
              </label>
              <select
                value={styleDNA}
                onChange={(e) => setStyleDNA(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-noir-900 border border-white/10 text-silk-100 text-xs focus:outline-none focus:border-gold-500/60"
              >
                {STYLE_AESTHETICS.map((aes) => (
                  <option key={aes} value={aes}>
                    {aes}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-300 text-noir-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-luxury-glow flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-99 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-noir-950 border-t-transparent animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-noir-950" />
                  <span>{mode === 'signin' ? 'Unlock Atelier Access' : 'Create Client Profile'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-noir-950" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-noir-900 text-[10px] font-mono text-silk-500 uppercase tracking-widest">
            OR TEST INSTANTLY
          </span>
        </div>

        {/* Fast 1-Tap Demo Client Login */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-noir-900 hover:bg-white/5 border border-gold-500/30 text-gold-300 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 group hover:border-gold-400/60"
        >
          <Crown className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
          <span>Enter as Elena Vance (1-Tap VIP Access)</span>
        </button>

        {/* Security Assurance */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-silk-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Firebase Encrypted Authentication & Zero-Trust Sessions</span>
        </div>
      </div>
    </div>
  );
};
