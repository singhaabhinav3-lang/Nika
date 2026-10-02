import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shirt,
  CloudSun,
  DollarSign,
  Palette,
  Sliders,
  Check,
  AlertCircle,
  Clock,
  Compass
} from 'lucide-react';
import { WardrobeItem, Outfit, UserProfile } from '../types';
import {
  OCCASIONS_LIST,
  WEATHER_PRESETS,
  STYLE_AESTHETICS,
  BUDGET_TIERS
} from '../services/mockData';
import { geminiStylistService } from '../services/geminiStylistService';

interface CreateOutfitPageProps {
  profile: UserProfile;
  wardrobe: WardrobeItem[];
  prefilledOccasion?: string;
  onOutfitGenerated: (outfit: Outfit) => void;
}

export const CreateOutfitPage: React.FC<CreateOutfitPageProps> = ({
  profile,
  wardrobe,
  prefilledOccasion,
  onOutfitGenerated,
}) => {
  const [occasion, setOccasion] = useState(prefilledOccasion || 'Cocktail & Dinner');
  const [customOccasion, setCustomOccasion] = useState('');
  const [weatherPreset, setWeatherPreset] = useState(WEATHER_PRESETS[0]);
  const [styleAesthetic, setStyleAesthetic] = useState(profile.styleAesthetics[0] || 'Quiet Luxury');
  const [budgetTier, setBudgetTier] = useState(profile.budgetTier);
  const [useClosetOnly, setUseClosetOnly] = useState(false);
  const [customNotes, setCustomNotes] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    'Analyzing your digital wardrobe inventory...',
    'Consulting Milanese color harmony & proportions...',
    'Calibrating thermal silhouette to weather...',
    'Synthesizing editorial masterclass notes...',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 550);

    try {
      const finalOccasion = customOccasion.trim() ? customOccasion.trim() : occasion;

      const outfit = await geminiStylistService.generateOutfit({
        occasion: finalOccasion,
        weather: weatherPreset.label,
        temperature: weatherPreset.temp,
        styleAesthetic,
        budgetTier,
        useClosetOnly,
        userWardrobe: wardrobe,
        customNotes: customNotes.trim() || undefined,
      });

      clearInterval(stepInterval);
      setTimeout(() => {
        setIsGenerating(false);
        onOutfitGenerated(outfit);
      }, 500);
    } catch (err) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      console.error('Error generating outfit:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>WHAT SHOULD I WEAR?</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-silk-100">
          Curate Your Ensemble
        </h1>
        <p className="text-xs sm:text-sm text-silk-400 mt-2">
          Tell NIKA where you’re going and under what sky. We will assemble a balanced,
          magazine-grade look.
        </p>
      </div>

      {isGenerating ? (
        /* Animated Generating Studio */
        <div className="p-8 sm:p-12 rounded-3xl glass-panel-gold bg-noir-900 border border-gold-500/40 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gold-500/20 border-t-gold-400 animate-spin" />
            <div className="absolute inset-3 rounded-full border-2 border-white/10 border-b-silk-200 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-2xl font-bold gold-gradient-text">N</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold text-silk-100">
              NIKA Styling Engine in Progress
            </h3>
            <p className="text-xs font-mono text-gold-400 uppercase tracking-widest mt-2 min-h-[20px]">
              {loadingSteps[loadingStep]}
            </p>
          </div>

          <div className="w-full max-w-md mx-auto h-1.5 rounded-full bg-noir-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 rounded-full transition-all duration-500"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>

          <p className="text-[11px] text-silk-500 font-mono">
            Applying color harmony, proportions & weather index for {profile.location}
          </p>
        </div>
      ) : (
        /* Form Studio */
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Step 1: Occasion */}
          <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 shadow-luxury space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> 1. Where are you going?
              </label>
              <span className="text-[11px] text-silk-500">Select or enter bespoke</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {OCCASIONS_LIST.map((occ) => {
                const isSelected = occasion === occ.label && !customOccasion;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => {
                      setOccasion(occ.label);
                      setCustomOccasion('');
                    }}
                    className={`p-3 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
                        : 'bg-noir-850 text-silk-300 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-semibold line-clamp-1">{occ.label}</div>
                    <div className="text-[10px] text-silk-500 line-clamp-1 mt-0.5">{occ.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Occasion Text */}
            <div className="pt-2">
              <input
                type="text"
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                placeholder="Or type bespoke setting (e.g. Gallery vernissage in Basel, rainy coffee meeting)"
                className="w-full px-4 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-xs focus:outline-none focus:border-gold-500/60 placeholder-silk-600"
              />
            </div>
          </div>

          {/* Step 2: Weather & Climate */}
          <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 shadow-luxury space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
              <CloudSun className="w-4 h-4" /> 2. Weather & Forecast
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {WEATHER_PRESETS.map((w) => {
                const isSelected = weatherPreset.id === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWeatherPreset(w)}
                    className={`p-3 rounded-2xl text-center transition-all ${
                      isSelected
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-sm'
                        : 'bg-noir-850 text-silk-300 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-sm font-bold font-mono text-silk-100">{w.temp}</div>
                    <div className="text-xs font-medium mt-0.5">{w.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Aesthetic & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Style Aesthetic */}
            <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 shadow-luxury space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4" /> 3. Style Aesthetic Vibe
              </label>
              <select
                value={styleAesthetic}
                onChange={(e) => setStyleAesthetic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-xs focus:outline-none focus:border-gold-500/60"
              >
                {STYLE_AESTHETICS.map((aes) => (
                  <option key={aes} value={aes}>
                    {aes}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-silk-500">
                Calibrates cut, color saturation, and accessories
              </p>
            </div>

            {/* Budget Calibration */}
            <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 shadow-luxury space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> 4. Budget Tier
              </label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-xs focus:outline-none focus:border-gold-500/60"
              >
                {BUDGET_TIERS.map((b) => (
                  <option key={b.id} value={b.label}>
                    {b.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-silk-500">
                Guides retailer and piece recommendations
              </p>
            </div>
          </div>

          {/* Step 4: AI Wardrobe-Only Switch */}
          <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 shadow-luxury">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-silk-100">
                    Style Exclusively From My Wardrobe
                  </h4>
                  <p className="text-xs text-silk-400">
                    {useClosetOnly
                      ? `Using your ${wardrobe.length} cataloged closet items only`
                      : 'Blends your wardrobe with recommended high-street & designer staples'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setUseClosetOnly(!useClosetOnly)}
                className={`w-14 h-8 rounded-full p-1 transition-colors shrink-0 ${
                  useClosetOnly ? 'bg-gold-500' : 'bg-noir-800 border border-white/10'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-noir-950 transition-transform ${
                    useClosetOnly ? 'translate-x-6 bg-noir-950' : 'translate-x-0 bg-silk-400'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Step 5: Bespoke Stylist Notes */}
          <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 shadow-luxury space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-silk-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-gold-400" /> 5. Special Preferences (Optional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. 'I want to wear my camel coat', 'Must be comfortable for walking', 'No black'"
              className="w-full px-4 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-xs focus:outline-none focus:border-gold-500/60 placeholder-silk-600"
            />
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-300 text-noir-950 font-bold text-base tracking-wide transition-all shadow-luxury-glow flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-99"
            >
              <Sparkles className="w-5 h-5 text-noir-950" />
              <span>Generate Personalized Outfit</span>
              <ArrowRight className="w-5 h-5 text-noir-950" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
