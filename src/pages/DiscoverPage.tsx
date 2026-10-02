import React, { useState } from 'react';
import { Compass, Sparkles, Heart, Bookmark, Filter, ArrowRight, Share2 } from 'lucide-react';
import { DiscoverLook, Outfit, NavPage } from '../types';
import { DISCOVER_LOOKS, STYLE_AESTHETICS } from '../services/mockData';

interface DiscoverPageProps {
  onStyleLikeThis: (look: DiscoverLook) => void;
  onOpenOutfit: (outfit: Outfit) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  onStyleLikeThis,
  onOpenOutfit,
}) => {
  const [selectedAesthetic, setSelectedAesthetic] = useState<string>('All');
  const [likedLooks, setLikedLooks] = useState<string[]>(['disc-1']);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedLooks.includes(id)) {
      setLikedLooks(likedLooks.filter((l) => l !== id));
    } else {
      setLikedLooks([...likedLooks, id]);
    }
  };

  const filteredLooks = DISCOVER_LOOKS.filter((look) => {
    if (selectedAesthetic === 'All') return true;
    return look.aesthetic.toLowerCase().includes(selectedAesthetic.toLowerCase());
  });

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      {/* Editorial Header */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-noir-900 via-noir-850 to-noir-900 border border-gold-500/20 shadow-xl overflow-hidden">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>GLOBAL EDITORIAL FEED</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-silk-100">
            Discover & Trend Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-silk-400 mt-2 leading-relaxed">
            Curated runway aesthetics, street-style moodboards, and timeless silhouettes. Tap{' '}
            <strong className="text-gold-300">"Style Me Like This"</strong> to instantly adapt any
            look to your wardrobe & sizing.
          </p>
        </div>
      </section>

      {/* Aesthetic Filter Chips */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {['All', ...STYLE_AESTHETICS].map((aes) => {
          const isActive = selectedAesthetic === aes;
          return (
            <button
              key={aes}
              onClick={() => setSelectedAesthetic(aes)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-gold-500 text-noir-950 font-bold shadow-sm'
                  : 'bg-noir-900 text-silk-400 hover:text-silk-200 border border-white/5 hover:border-white/20'
              }`}
            >
              {aes}
            </button>
          );
        })}
      </section>

      {/* Editorial Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLooks.map((look) => {
          const isLiked = likedLooks.includes(look.id);

          return (
            <article
              key={look.id}
              onClick={() => onOpenOutfit(look.fullOutfit)}
              className="group cursor-pointer rounded-3xl bg-noir-900 border border-white/10 hover:border-gold-500/40 overflow-hidden shadow-luxury transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Hero Image */}
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <img
                  src={look.heroImageUrl}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/20 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-noir-950/80 backdrop-blur-md border border-white/10 text-silk-200 font-mono text-[10px] uppercase">
                    {look.aesthetic} · {look.season}
                  </span>

                  <button
                    onClick={(e) => toggleLike(look.id, e)}
                    className="p-2 rounded-full bg-noir-950/70 backdrop-blur-md text-silk-300 hover:text-gold-400 transition-colors border border-white/10"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-gold-400 text-gold-400' : ''}`} />
                  </button>
                </div>

                {/* Bottom title inside hero */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-mono text-gold-400 uppercase tracking-widest">
                    Curated by {look.curator}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-silk-100 group-hover:text-gold-200 transition-colors">
                    {look.title}
                  </h3>
                </div>
              </div>

              {/* Description & Tags */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-silk-300 leading-relaxed font-sans">{look.subtitle}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {look.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-silk-400 border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Key Pieces Preview */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-silk-400 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>Includes 5 styled garments</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStyleLikeThis(look);
                    }}
                    className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-xs transition-all shadow-luxury-glow flex items-center gap-1.5 hover:scale-[1.02]"
                  >
                    <span>Style Me Like This</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
