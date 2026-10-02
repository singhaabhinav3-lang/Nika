import React, { useState } from 'react';
import { X, Copy, Check, Share2, Instagram, MessageCircle, Sparkles } from 'lucide-react';
import { Outfit } from '../types';

interface ShareOutfitModalProps {
  outfit: Outfit;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareOutfitModal: React.FC<ShareOutfitModalProps> = ({ outfit, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `Styled by NIKA AI Stylist: "${outfit.title}" for ${outfit.occasion} (${outfit.temperature}). Key pieces: ${outfit.pieces.top?.name || outfit.pieces.dress?.name}, ${outfit.pieces.bottom?.name || ''}, and ${outfit.pieces.shoes.name}.`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${shareText}\nhttps://nika.atelier.fashion/look/${outfit.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-noir-900 border border-gold-500/30 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-silk-300 hover:text-silk-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 mx-auto flex items-center justify-center text-gold-400 mb-2">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif font-bold text-silk-100">Share Editorial Lookbook</h3>
          <p className="text-xs text-silk-400 mt-1">
            Export or send this curated outfit to friends or social circles
          </p>
        </div>

        {/* Editorial Fashion Card Preview */}
        <div className="p-5 rounded-2xl bg-noir-950 border border-white/10 shadow-2xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Mini Branding Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm tracking-widest text-silk-100">NIKA</span>
              <span className="text-[9px] font-mono uppercase text-gold-400">Atelier Edit</span>
            </div>
            <span className="text-[10px] font-mono text-silk-400">
              {outfit.occasion} · {outfit.temperature}
            </span>
          </div>

          <h4 className="text-lg font-serif font-bold text-silk-100">{outfit.title}</h4>
          <p className="text-xs text-silk-400 italic mt-0.5 font-serif line-clamp-1">"{outfit.tagline}"</p>

          {/* Pieces Collage Preview */}
          <div className="grid grid-cols-4 gap-2 my-4">
            {[
              outfit.pieces.top || outfit.pieces.dress,
              outfit.pieces.bottom || outfit.pieces.outerwear,
              outfit.pieces.shoes,
              outfit.pieces.bag || outfit.pieces.accessories[0],
            ]
              .filter(Boolean)
              .map((p, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                  <img src={p!.imageUrl} alt={p!.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[8px] font-mono uppercase px-1 rounded bg-black/60 text-silk-200 truncate max-w-[90%]">
                    {p!.brand}
                  </span>
                </div>
              ))}
          </div>

          {/* Palette Swatches */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              {outfit.colorPalette.map((c, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-gold-400">
              {outfit.confidenceScore}% VIBE MATCH
            </span>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-luxury-glow"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link & Breakdown Copied!' : 'Copy Look Link & Styling Notes'}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-noir-850 hover:bg-white/5 border border-white/10 text-xs text-silk-200 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Share to Stories</span>
            </button>
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-noir-850 hover:bg-white/5 border border-white/10 text-xs text-silk-200 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Send in iMessage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
