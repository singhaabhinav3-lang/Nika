import React, { useState } from 'react';
import { X, Sparkles, Sun, Moon, Eye, Layers, RefreshCw, CheckCircle2, Sliders } from 'lucide-react';
import { Outfit } from '../types';

interface VirtualTryOnModalProps {
  outfit: Outfit;
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({ outfit, isOpen, onClose }) => {
  const [lighting, setLighting] = useState<'studio' | 'golden' | 'evening' | 'natural'>('studio');
  const [pose, setPose] = useState<'front' | 'stride' | 'profile'>('front');
  const [coatLayer, setCoatLayer] = useState(true);
  const [bagLayer, setBagLayer] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const handleRegeneratePose = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 900);
  };

  // Select lighting background gradient
  const getLightingStyle = () => {
    switch (lighting) {
      case 'golden':
        return 'from-amber-950/40 via-noir-900 to-amber-900/20 border-amber-500/30';
      case 'evening':
        return 'from-purple-950/40 via-noir-900 to-noir-950 border-purple-500/20';
      case 'natural':
        return 'from-sky-950/30 via-noir-900 to-noir-950 border-sky-500/20';
      default:
        return 'from-noir-800 via-noir-900 to-noir-950 border-gold-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-noir-900 border border-gold-500/30 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-silk-300 hover:text-silk-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-gold-400 animate-spin" style={{ animationDuration: '4s' }} />
                NIKA NEURAL TRY-ON STUDIO
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photorealistic Fit Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-silk-100 mt-1">
              AI Virtual Try-On Preview
            </h2>
            <p className="text-xs text-silk-400">
              Interactive drape simulation for "{outfit.title}"
            </p>
          </div>

          <button
            onClick={handleRegeneratePose}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-gold-500/20 text-xs text-gold-300 border border-white/10 hover:border-gold-500/40 transition-all font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Re-Render Drape</span>
          </button>
        </div>

        {/* Main Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Virtual Model Simulation Screen */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              className={`relative w-full aspect-[3/4] max-h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b ${getLightingStyle()} border shadow-2xl flex items-center justify-center p-4 transition-all duration-500`}
            >
              {isSimulating && (
                <div className="absolute inset-0 z-20 bg-noir-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full border-2 border-gold-500/30 border-t-gold-400 animate-spin mb-3" />
                  <p className="text-xs font-mono uppercase tracking-widest text-gold-300">
                    Computing Fabric Drape & Tension...
                  </p>
                  <p className="text-[11px] text-silk-400 mt-1">
                    Matching 175cm silhouette & proportions
                  </p>
                </div>
              )}

              {/* Editorial Model Visualization */}
              <div className="relative w-full h-full flex flex-col items-center justify-between">
                {/* Visual Canvas Layout */}
                <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85"
                    alt="AI Virtual Try On Model"
                    className={`w-full h-full object-cover rounded-xl transition-all duration-700 ${
                      lighting === 'evening' ? 'brightness-75 contrast-125' : ''
                    } ${lighting === 'golden' ? 'sepia-[0.2] brightness-95' : ''} ${
                      pose === 'stride' ? 'scale-105' : 'scale-100'
                    }`}
                  />

                  {/* Dynamic Layer Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none">
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/60 backdrop-blur-md text-silk-200 border border-white/10">
                      Top: {outfit.pieces.top?.name || outfit.pieces.dress?.name}
                    </span>
                    {coatLayer && outfit.pieces.outerwear && (
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/60 backdrop-blur-md text-gold-300 border border-gold-500/30">
                        Outer: {outfit.pieces.outerwear.name}
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/60 backdrop-blur-md text-silk-200 border border-white/10">
                      Shoes: {outfit.pieces.shoes.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Lighting & Pose Switchers */}
            <div className="w-full mt-4 flex items-center justify-between gap-2 p-2 rounded-2xl bg-noir-850 border border-white/5">
              <div className="flex items-center gap-1">
                {[
                  { id: 'studio', label: 'Studio' },
                  { id: 'golden', label: 'Golden Hour' },
                  { id: 'evening', label: 'Evening' },
                  { id: 'natural', label: 'Daylight' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLighting(l.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                      lighting === l.id
                        ? 'bg-gold-500 text-noir-950 font-bold'
                        : 'text-silk-400 hover:text-silk-200'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                {[
                  { id: 'front', label: 'Front' },
                  { id: 'stride', label: 'Runway' },
                  { id: 'profile', label: 'Side' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPose(p.id as any)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                      pose === p.id
                        ? 'bg-white/15 text-silk-100 font-semibold'
                        : 'text-silk-500 hover:text-silk-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Controls & Silhouette Metrics */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Fit & Proportions Analysis */}
            <div className="p-4 rounded-2xl bg-noir-850 border border-white/5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Silhouette & Drapery Metrics
              </h3>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-silk-300 mb-1 font-mono">
                    <span>Vertical Proportion Balance</span>
                    <span className="text-gold-300 font-semibold">98% Ideal</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-noir-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-silk-300 mb-1 font-mono">
                    <span>Fabric Weight Harmony</span>
                    <span className="text-emerald-400 font-semibold">95% Balanced</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-noir-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[95%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-silk-300 mb-1 font-mono">
                    <span>Thermal Appropriateness ({outfit.temperature})</span>
                    <span className="text-gold-300 font-semibold">100% Calibrated</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-noir-800 overflow-hidden">
                    <div className="h-full bg-gold-400 rounded-full w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="p-4 rounded-2xl bg-noir-850 border border-white/5 space-y-2.5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-silk-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gold-400" /> Interactive Garment Layers
              </h3>

              {outfit.pieces.outerwear && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-noir-900 border border-white/5">
                  <div className="text-xs">
                    <div className="font-semibold text-silk-200">Outerwear Layer</div>
                    <div className="text-[11px] text-silk-400">{outfit.pieces.outerwear.name}</div>
                  </div>
                  <button
                    onClick={() => setCoatLayer(!coatLayer)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      coatLayer ? 'bg-gold-500 text-noir-950' : 'bg-white/10 text-silk-400'
                    }`}
                  >
                    {coatLayer ? 'LAYERED' : 'REMOVED'}
                  </button>
                </div>
              )}

              {outfit.pieces.bag && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-noir-900 border border-white/5">
                  <div className="text-xs">
                    <div className="font-semibold text-silk-200">Leather Bag</div>
                    <div className="text-[11px] text-silk-400">{outfit.pieces.bag.name}</div>
                  </div>
                  <button
                    onClick={() => setBagLayer(!bagLayer)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      bagLayer ? 'bg-gold-500 text-noir-950' : 'bg-white/10 text-silk-400'
                    }`}
                  >
                    {bagLayer ? 'IN HAND' : 'OFF'}
                  </button>
                </div>
              )}
            </div>

            {/* Stylist Expert Fit Advice */}
            <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-xs text-silk-300 space-y-1">
              <p className="font-semibold text-gold-300 font-mono text-[11px] uppercase">
                Stylist Fit Observation
              </p>
              <p className="leading-relaxed text-silk-300">
                {outfit.stylingTips[0] ||
                  'The proportion highlights vertical lines while preserving natural mobility.'}
              </p>
            </div>

            {/* Done button */}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-noir-950 font-bold text-sm tracking-wide transition-all shadow-luxury-glow"
            >
              Confirm & Return to Look
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
