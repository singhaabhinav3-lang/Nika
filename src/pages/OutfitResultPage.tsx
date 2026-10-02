import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Share2,
  ShoppingBag,
  Eye,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Layers,
  Thermometer,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Outfit, OutfitPiece, NavPage } from '../types';

interface OutfitResultPageProps {
  outfit: Outfit;
  onNavigate: (page: NavPage) => void;
  onSaveOutfit: (outfit: Outfit) => void;
  onOpenShopModal: () => void;
  onOpenTryOnModal: () => void;
  onOpenShareModal: () => void;
}

export const OutfitResultPage: React.FC<OutfitResultPageProps> = ({
  outfit,
  onNavigate,
  onSaveOutfit,
  onOpenShopModal,
  onOpenTryOnModal,
  onOpenShareModal,
}) => {
  const [currentOutfit, setCurrentOutfit] = useState<Outfit>(outfit);
  const [isSaved, setIsSaved] = useState(outfit.isFavorite);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSaveOutfit({ ...currentOutfit, isFavorite: !isSaved });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  };

  // Swap item simulation (allows user to swap shoes or jacket dynamically)
  const handleSwapPiece = (category: string) => {
    const newPieces = { ...currentOutfit.pieces };

    if (category === 'footwear') {
      const isHeels = newPieces.shoes.name.includes('Pumps') || newPieces.shoes.name.includes('Heel');
      newPieces.shoes = {
        id: `swapped-${Date.now()}`,
        name: isHeels ? 'Polished Leather Penny Loafers' : 'Pointed Kitten-Heel Mules',
        category: 'footwear',
        brand: isHeels ? 'Loro Piana' : 'Saint Laurent',
        color: isHeels ? 'Burgundy Oxblood' : 'Midnight Noir',
        colorHex: isHeels ? '#4A1D24' : '#141417',
        imageUrl: isHeels
          ? 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
        isFromCloset: false,
        price: 890,
        retailer: 'Farfetch',
      };
    } else if (category === 'outerwear' && newPieces.outerwear) {
      const isCoat = newPieces.outerwear.name.includes('Coat');
      newPieces.outerwear = {
        id: `swapped-out-${Date.now()}`,
        name: isCoat ? 'Structured Virgin Wool Blazer' : 'Double-Breasted Wool Camel Coat',
        category: 'outerwear',
        brand: isCoat ? 'Saint Laurent' : 'Max Mara',
        color: isCoat ? 'Dark Taupe' : 'Warm Camel',
        colorHex: isCoat ? '#3D3833' : '#C09363',
        imageUrl: isCoat
          ? 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=600&q=80',
        isFromCloset: false,
        price: 1850,
        retailer: 'Net-A-Porter',
      };
    }

    setCurrentOutfit({ ...currentOutfit, pieces: newPieces });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-28 animate-fade-in">
      {/* Top Navigation & Action Row */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('create')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-noir-900 border border-white/10 hover:border-gold-500/40 text-xs font-mono text-silk-300 hover:text-silk-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stylist</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Virtual Try-On Studio trigger */}
          <button
            onClick={onOpenTryOnModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-xs font-mono text-gold-300 border border-gold-500/40 transition-all hover:scale-[1.02]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>AI Virtual Try-On</span>
          </button>

          {/* Share */}
          <button
            onClick={onOpenShareModal}
            className="p-2 rounded-xl bg-noir-900 border border-white/10 hover:border-gold-500/40 text-silk-300 hover:text-silk-100 transition-colors"
            title="Share Look"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Favorite */}
          <button
            onClick={handleSave}
            className="p-2 rounded-xl bg-noir-900 border border-white/10 hover:border-gold-500/40 text-silk-300 hover:text-gold-400 transition-colors"
            title={isSaved ? 'Saved to Lookbook' : 'Save to Lookbook'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-gold-400 text-gold-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Toast alert */}
      {saveToast && (
        <div className="p-3 rounded-2xl bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-mono flex items-center justify-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-gold-400" />
          <span>{isSaved ? 'Look added to your private Lookbook' : 'Look removed from Lookbook'}</span>
        </div>
      )}

      {/* Editorial Title Banner */}
      <section className="relative p-6 sm:p-10 rounded-3xl glass-panel-gold border border-gold-500/30 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-noir-950/80 px-2.5 py-1 rounded-full border border-gold-500/30">
            NIKA EDITORIAL DIRECTIVE
          </span>
          <span className="text-[10px] font-mono text-silk-300 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
            {currentOutfit.occasion}
          </span>
          <span className="text-[10px] font-mono text-silk-300 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-gold-400" />
            {currentOutfit.weather} ({currentOutfit.temperature})
          </span>
          <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold">
            {currentOutfit.confidenceScore}% VIBE MATCH
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-silk-100 tracking-tight">
          {currentOutfit.title}
        </h1>
        <p className="text-sm sm:text-base text-silk-300 font-serif italic mt-2">
          "{currentOutfit.tagline}"
        </p>

        {/* Color Palette Swatches */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-silk-400 uppercase tracking-wider block mb-2">
              Harmonic Color Palette
            </span>
            <div className="flex items-center gap-2.5">
              {currentOutfit.colorPalette.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-noir-900/80 px-2.5 py-1 rounded-lg border border-white/5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[11px] font-mono text-silk-200">{c.name}</span>
                  <span className="text-[9px] font-mono text-gold-400/80 uppercase">({c.role})</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenShopModal}
            className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-luxury-glow flex items-center gap-2 hover:scale-[1.02]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop This Look</span>
          </button>
        </div>
      </section>

      {/* Visual Garment Collage Gallery */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-bold text-silk-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-gold-400" /> Curated Garment Ensemble
          </h2>
          <span className="text-[11px] font-mono text-silk-400">
            {currentOutfit.isClosetOnly ? '100% Sourced From Your Closet' : 'Digital Wardrobe & Recommended Staples'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            currentOutfit.pieces.top,
            currentOutfit.pieces.bottom,
            currentOutfit.pieces.dress,
            currentOutfit.pieces.outerwear,
            currentOutfit.pieces.shoes,
            currentOutfit.pieces.bag,
            ...currentOutfit.pieces.accessories,
          ]
            .filter(Boolean)
            .map((piece, idx) => (
              <div
                key={piece!.id || idx}
                className="group relative rounded-2xl bg-noir-900 border border-white/10 hover:border-gold-500/40 overflow-hidden shadow-sm transition-all flex flex-col"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <img
                    src={piece!.imageUrl}
                    alt={piece!.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-gold-300 border border-white/10">
                      {piece!.category}
                    </span>
                    {piece!.isFromCloset && (
                      <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                        In Closet
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-silk-400 font-semibold">
                      {piece!.brand}
                    </div>
                    <h4 className="text-xs font-semibold text-silk-100 line-clamp-1">{piece!.name}</h4>
                    <p className="text-[10px] text-silk-500 font-mono mt-0.5">{piece!.color}</p>
                  </div>

                  {/* Swap Piece button for Footwear and Outerwear */}
                  {(piece!.category === 'footwear' || piece!.category === 'outerwear') && (
                    <button
                      onClick={() => handleSwapPiece(piece!.category)}
                      className="mt-2 text-[10px] font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1 pt-1 border-t border-white/5"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Swap Alternative</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Stylist Masterclass Note */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 shadow-luxury space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <h3 className="text-sm font-mono uppercase tracking-wider text-gold-300 font-semibold">
              Stylist Proportions Rationale
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-silk-200 leading-relaxed font-sans">
            {currentOutfit.silhouetteRationale}
          </p>

          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase text-silk-400 block mb-1.5">
              Layering & Weather Guide
            </span>
            <p className="text-xs text-silk-300 leading-relaxed font-sans">
              {currentOutfit.layeringGuide}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 shadow-luxury space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-gold-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-400" /> Editorial Styling Tips
          </h3>

          <ul className="space-y-2.5 text-xs text-silk-300">
            {currentOutfit.stylingTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Persistent Bottom Call-to-Action Bar */}
      <div className="p-4 rounded-2xl glass-panel-gold border border-gold-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
        <div className="text-center sm:text-left">
          <span className="text-xs font-serif font-bold text-silk-100 block">
            Ready to wear "{currentOutfit.title}"?
          </span>
          <span className="text-[11px] text-silk-400 font-mono">
            Preview on your virtual silhouette or shop affiliate pieces
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenTryOnModal}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-noir-850 hover:bg-white/10 text-xs font-mono text-silk-200 border border-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-gold-400" />
            <span>Virtual Try-On</span>
          </button>

          <button
            onClick={onOpenShopModal}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-luxury-glow flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop Pieces</span>
          </button>
        </div>
      </div>
    </div>
  );
};
