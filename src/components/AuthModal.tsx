import React, { useState } from 'react';
import { X, User, Check, Sparkles, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { STYLE_AESTHETICS, BUDGET_TIERS } from '../services/mockData';

interface AuthModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<'auth' | 'style'>('auth');
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [location, setLocation] = useState(profile.location);
  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>(profile.styleAesthetics);
  const [budgetTier, setBudgetTier] = useState(profile.budgetTier);
  const [fitPreference, setFitPreference] = useState(profile.sizing.fitPreference);

  if (!isOpen) return null;

  const toggleAesthetic = (aesthetic: string) => {
    if (selectedAesthetics.includes(aesthetic)) {
      setSelectedAesthetics(selectedAesthetics.filter((a) => a !== aesthetic));
    } else {
      setSelectedAesthetics([...selectedAesthetics, aesthetic]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'Elena Vance',
      email: email.trim() || 'elena.vance@atelier.io',
      location: location.trim() || 'Milan, Italy',
      styleAesthetics: selectedAesthetics.length > 0 ? selectedAesthetics : ['Quiet Luxury'],
      budgetTier: budgetTier as any,
      sizing: {
        ...profile.sizing,
        fitPreference,
      },
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-noir-900 border border-gold-500/30 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-silk-300 hover:text-silk-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
          <button
            onClick={() => setStep('auth')}
            className={`text-xs font-mono uppercase tracking-wider pb-1 transition-colors ${
              step === 'auth' ? 'text-gold-400 border-b-2 border-gold-500 font-bold' : 'text-silk-400'
            }`}
          >
            1. Account Identity
          </button>
          <span className="text-silk-600 text-xs">/</span>
          <button
            onClick={() => setStep('style')}
            className={`text-xs font-mono uppercase tracking-wider pb-1 transition-colors ${
              step === 'style' ? 'text-gold-400 border-b-2 border-gold-500 font-bold' : 'text-silk-400'
            }`}
          >
            2. Style DNA Profile
          </button>
        </div>

        {step === 'auth' ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 mx-auto flex items-center justify-center text-gold-400 mb-2">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-silk-100">Client Profile</h3>
              <p className="text-xs text-silk-400 mt-1">
                Personalize your NIKA fashion consultant credentials
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm focus:outline-none focus:border-gold-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm focus:outline-none focus:border-gold-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                  Primary Fashion City / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Milan, Paris, New York, London"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm focus:outline-none focus:border-gold-500/60"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep('style')}
                  className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-luxury-glow"
                >
                  <span>Continue to Style DNA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 mx-auto flex items-center justify-center text-gold-400 mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-silk-100">Style DNA Settings</h3>
              <p className="text-xs text-silk-400 mt-1">
                Defines the silhouettes and rules NIKA uses to dress you
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-silk-400 mb-2">
                  Aesthetic Preferences (Select all that fit)
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_AESTHETICS.map((aes) => {
                    const isSelected = selectedAesthetics.includes(aes);
                    return (
                      <button
                        key={aes}
                        type="button"
                        onClick={() => toggleAesthetic(aes)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50'
                            : 'bg-noir-850 text-silk-400 border border-white/5 hover:border-white/20'
                        }`}
                      >
                        {aes}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                  Budget Calibration
                </label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm focus:outline-none focus:border-gold-500/60"
                >
                  {BUDGET_TIERS.map((b) => (
                    <option key={b.id} value={b.label}>
                      {b.label} ({b.range})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                  Cut & Proportions Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'Relaxed Tailoring',
                    'Slim Structured',
                    'Oversized Editorial',
                  ].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFitPreference(f as any)}
                      className={`p-2 rounded-xl text-center text-xs font-medium transition-all ${
                        fitPreference === f
                          ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50'
                          : 'bg-noir-850 text-silk-400 border border-white/5'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-luxury-glow"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Style DNA Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
