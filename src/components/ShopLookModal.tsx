import React, { useState } from 'react';
import { X, ExternalLink, Tag, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { Outfit, OutfitPiece } from '../types';

interface ShopLookModalProps {
  outfit: Outfit;
  isOpen: boolean;
  onClose: () => void;
}

export const ShopLookModal: React.FC<ShopLookModalProps> = ({ outfit, isOpen, onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'clothing' | 'shoes' | 'accessories'>('all');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Flatten pieces
  const pieces: OutfitPiece[] = [];
  if (outfit.pieces.top) pieces.push(outfit.pieces.top);
  if (outfit.pieces.bottom) pieces.push(outfit.pieces.bottom);
  if (outfit.pieces.dress) pieces.push(outfit.pieces.dress);
  if (outfit.pieces.outerwear) pieces.push(outfit.pieces.outerwear);
  pieces.push(outfit.pieces.shoes);
  if (outfit.pieces.bag) pieces.push(outfit.pieces.bag);
  outfit.pieces.accessories.forEach((a) => pieces.push(a));

  const filteredPieces = pieces.filter((p) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'clothing') return ['tops', 'bottoms', 'dresses', 'outerwear'].includes(p.category);
    if (selectedFilter === 'shoes') return p.category === 'footwear';
    if (selectedFilter === 'accessories') return ['accessories', 'bags'].includes(p.category);
    return true;
  });

  const totalEstimate = pieces.reduce((sum, p) => sum + (p.price || 400), 0);

  const copyPromo = () => {
    navigator.clipboard?.writeText('NIKA-ATELIER-15');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-noir-900 border border-gold-500/30 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-silk-300 hover:text-silk-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                AFFILIATE CURATION
              </span>
              <span className="text-xs text-silk-400 font-mono">Guaranteed Authenticity</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-silk-100 mt-1">
              Shop This Look
            </h2>
            <p className="text-xs sm:text-sm text-silk-400 mt-0.5">
              Direct-to-retailer pieces hand-matched for "{outfit.title}"
            </p>
          </div>
        </div>

        {/* Exclusive Promo Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-gold-500/15 via-gold-400/10 to-noir-850 border border-gold-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-gold-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gold-300">
                Exclusive NIKA Partner Code: 15% Off
              </p>
              <p className="text-[11px] text-silk-400">
                Valid at SSENSE, Net-A-Porter, and Farfetch
              </p>
            </div>
          </div>
          <button
            onClick={copyPromo}
            className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-noir-950 text-xs font-semibold tracking-wider font-mono uppercase transition-colors shrink-0"
          >
            {copiedCode ? 'COPIED!' : 'COPY CODE'}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All Pieces (${pieces.length})` },
            { id: 'clothing', label: 'Garments' },
            { id: 'shoes', label: 'Footwear' },
            { id: 'accessories', label: 'Bags & Jewelry' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedFilter === f.id
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                  : 'bg-white/5 text-silk-400 hover:text-silk-200 border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Pieces List */}
        <div className="space-y-3 mb-6">
          {filteredPieces.map((piece) => {
            const price = piece.price || 420;
            const retailer = piece.retailer || 'Luxury Partner';

            return (
              <div
                key={piece.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-noir-850/80 border border-white/5 hover:border-gold-500/30 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={piece.imageUrl}
                    alt={piece.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gold-400 font-mono">
                        {piece.brand}
                      </span>
                      {piece.isFromCloset && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          In Your Closet
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-silk-100 line-clamp-1">{piece.name}</h4>
                    <p className="text-xs text-silk-400 font-mono mt-0.5">
                      {piece.material || piece.color} · Available at {retailer}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-silk-100 font-mono">${price}</div>
                  <a
                    href={piece.shopUrl || 'https://www.ssense.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 hover:bg-gold-500/20 text-xs text-gold-300 border border-white/10 hover:border-gold-500/40 transition-all"
                  >
                    <span>{piece.isFromCloset ? 'View Dupe' : 'Shop'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-silk-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>NIKA earns a boutique commission on verified retail purchases.</span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div>
              <span className="text-[10px] uppercase text-silk-400 font-mono block">Estimated Look</span>
              <span className="text-lg font-bold font-serif gold-gradient-text">${totalEstimate}</span>
            </div>
            <button
              onClick={() => {
                window.open('https://www.ssense.com', '_blank');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-semibold text-sm transition-all shadow-luxury-glow"
            >
              <span>Shop Complete Look</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
