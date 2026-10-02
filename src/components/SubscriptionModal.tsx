import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Shield, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface SubscriptionModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: 'NIKA Atelier VIP' | 'NIKA Haute Privé') => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  profile,
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    setIsUpgrading(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C5A059', '#E9D19E', '#FFFFFF'],
    });

    setTimeout(() => {
      onUpgrade('NIKA Atelier VIP');
      setIsUpgrading(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-noir-900 border border-gold-500/40 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-silk-300 hover:text-silk-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown Monogram Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/40 mx-auto flex items-center justify-center text-gold-400 mb-3 shadow-luxury-glow">
            <Crown className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/30">
            PRIVATE MEMBERSHIP
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-silk-100 mt-2">
            NIKA Atelier VIP
          </h2>
          <p className="text-xs sm:text-sm text-silk-400 mt-1 max-w-sm mx-auto">
            Unlimited AI fashion intelligence, 4K virtual try-on, and human editorial stylist review.
          </p>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-noir-850 border border-white/5 max-w-xs mx-auto mb-6">
          <button
            onClick={() => setBillingCycle('annual')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono transition-all ${
              billingCycle === 'annual'
                ? 'bg-gold-500 text-noir-950 font-bold shadow-sm'
                : 'text-silk-400 hover:text-silk-200'
            }`}
          >
            Annual (Save 35%)
          </button>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono transition-all ${
              billingCycle === 'monthly'
                ? 'bg-gold-500 text-noir-950 font-bold shadow-sm'
                : 'text-silk-400 hover:text-silk-200'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Tier Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-noir-800 to-noir-850 border border-gold-500/30 mb-6 relative overflow-hidden">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase text-gold-400">Atelier Tier</span>
              <div className="text-3xl font-serif font-bold gold-gradient-text mt-0.5">
                {billingCycle === 'annual' ? '$12.40' : '$19.00'}
                <span className="text-xs font-sans text-silk-400 font-normal"> / month</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {billingCycle === 'annual' ? 'Billed $149/year' : 'Cancel anytime'}
            </span>
          </div>

          <div className="space-y-3 text-xs text-silk-200 border-t border-white/5 pt-4">
            {[
              'Unlimited live Gemini 3.5 Flash styling queries',
              'AI Virtual Try-On Studio (high-resolution drape & lighting simulations)',
              'Wardrobe Gap Intelligence & 10-piece capsule generator',
              'Unlimited closet item digitization with auto-background removal',
              'Personalized color season palette calibrated to your skin tone',
              '15% boutique partner discount codes (SSENSE, Net-A-Porter, Farfetch)',
              'Direct concierge chat with Milan-based human stylist'
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Action */}
        <div className="space-y-3">
          <button
            onClick={handleUpgradeClick}
            disabled={isUpgrading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-300 text-noir-950 font-bold text-sm tracking-wide transition-all shadow-luxury-glow flex items-center justify-center gap-2"
          >
            {isUpgrading ? (
              <Sparkles className="w-4 h-4 animate-spin text-noir-950" />
            ) : (
              <Crown className="w-4 h-4 text-noir-950" />
            )}
            <span>{isUpgrading ? 'Activating Atelier VIP...' : 'Join NIKA Atelier VIP'}</span>
          </button>

          <p className="text-[10px] text-center text-silk-500 font-mono">
            30-day style guarantee · Instant activation · Cancel anytime with 1-tap
          </p>
        </div>
      </div>
    </div>
  );
};
