import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CloudSun,
  Shirt,
  Bookmark,
  Compass,
  ChevronRight,
  Flame,
  Star,
  Layers,
  Heart
} from 'lucide-react';
import { UserProfile, Outfit, WardrobeItem, NavPage } from '../types';
import { OCCASIONS_LIST } from '../services/mockData';

interface HomePageProps {
  profile: UserProfile;
  savedOutfits: Outfit[];
  wardrobe: WardrobeItem[];
  onNavigate: (page: NavPage) => void;
  onSelectOccasion: (occasion: string) => void;
  onOpenOutfit: (outfit: Outfit) => void;
  onOpenVipModal: () => void;
  onToggleFavorite: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  profile,
  savedOutfits,
  wardrobe,
  onNavigate,
  onSelectOccasion,
  onOpenOutfit,
  onOpenVipModal,
  onToggleFavorite,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');

  const featuredLook = savedOutfits[0];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPrompt.trim()) {
      onSelectOccasion(quickPrompt.trim());
      onNavigate('create');
    } else {
      onNavigate('create');
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      {/* Editorial Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden glass-panel-gold p-6 sm:p-10 border border-gold-500/30 shadow-2xl">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-gold-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-noir-900/90 border border-gold-500/30 text-gold-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>SOLVING: "I HAVE CLOTHES, BUT NOTHING TO WEAR"</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-silk-100 tracking-tight leading-[1.15]">
            Tell NIKA where you’re going.
            <span className="block italic font-normal gold-gradient-text mt-1">
              We’ll curate the rest.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-silk-300 mt-4 leading-relaxed font-sans max-w-xl">
            Effortless styling calibrated to your body, aesthetic DNA, today’s climate in{' '}
            <strong className="text-silk-100 font-semibold">{profile.location}</strong>, and
            your digital closet.
          </p>

          {/* Quick Input Bar */}
          <form onSubmit={handleQuickSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="e.g. Dinner with creative director at rooftop sushi..."
                className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-noir-950/80 border border-white/10 hover:border-gold-500/40 text-silk-100 placeholder-silk-500 text-sm focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
              />
              <button
                type="button"
                onClick={() => setQuickPrompt('Cocktail party in Brera')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase text-gold-400/80 hover:text-gold-300 bg-white/5 px-2 py-0.5 rounded"
              >
                Inspire
              </button>
            </div>

            <button
              type="submit"
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-noir-950 font-bold text-sm tracking-wide transition-all shadow-luxury-glow flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02] active:scale-98"
            >
              <span>Style My Look</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Occasion Fast-Track Carousel */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-silk-100">Where Are You Going?</h2>
            <p className="text-xs text-silk-400">Instant AI curated dress codes</p>
          </div>
          <button
            onClick={() => onNavigate('create')}
            className="text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300 flex items-center gap-1"
          >
            <span>All Occasions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {OCCASIONS_LIST.slice(0, 4).map((occ) => (
            <button
              key={occ.id}
              onClick={() => {
                onSelectOccasion(occ.label);
                onNavigate('create');
              }}
              className="group p-4 rounded-2xl bg-noir-900 border border-white/5 hover:border-gold-500/40 text-left transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 group-hover:text-gold-300">
                  {occ.label.split(' ')[0]}
                </span>
                <span className="w-2 h-2 rounded-full bg-gold-500/40 group-hover:bg-gold-400" />
              </div>
              <h3 className="text-sm font-semibold text-silk-100 group-hover:text-gold-200 transition-colors line-clamp-1">
                {occ.label}
              </h3>
              <p className="text-[11px] text-silk-400 mt-1 line-clamp-1">{occ.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Look of the Day & Closet Sync Status */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Look of the Day Card */}
        {featuredLook && (
          <div className="lg:col-span-7 rounded-3xl bg-noir-900 border border-white/10 hover:border-gold-500/30 overflow-hidden shadow-luxury transition-all">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
              <img
                src={featuredLook.pieces.outerwear?.imageUrl || featuredLook.pieces.top?.imageUrl}
                alt={featuredLook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/40 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-noir-950/80 backdrop-blur-md border border-gold-500/30 text-gold-300 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                  Look of the Day
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-silk-200 font-mono text-[10px]">
                  {featuredLook.occasion}
                </span>
              </div>

              <button
                onClick={() => onToggleFavorite(featuredLook.id)}
                className="absolute top-4 right-4 p-2 rounded-full bg-noir-950/70 backdrop-blur-md text-silk-300 hover:text-gold-400 transition-colors border border-white/10"
              >
                <Heart
                  className={`w-4 h-4 ${
                    featuredLook.isFavorite ? 'fill-gold-400 text-gold-400' : ''
                  }`}
                />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-silk-100">
                  {featuredLook.title}
                </h3>
                <p className="text-xs sm:text-sm text-silk-300 line-clamp-1 mt-0.5">
                  {featuredLook.tagline}
                </p>
              </div>
            </div>

            <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5 bg-noir-900/90">
              {/* Palette pills */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-silk-400 uppercase">Palette:</span>
                <div className="flex items-center gap-1.5">
                  {featuredLook.colorPalette.map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onOpenOutfit(featuredLook)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>View Breakdown & Try-On</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Digital Closet & Climate Widget */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          {/* Smart Wardrobe Status */}
          <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 shadow-luxury space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-silk-100">Your AI Wardrobe</h3>
                  <p className="text-[11px] text-silk-400 font-mono">
                    {wardrobe.length} cataloged pieces ready
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('wardrobe')}
                className="text-xs font-mono uppercase text-gold-400 hover:text-gold-300"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {wardrobe.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square rounded-xl overflow-hidden border border-white/10"
                >
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[8px] font-mono uppercase px-1 rounded bg-black/70 text-silk-200">
                    {item.subcategory}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                onSelectOccasion('Curated from my closet only');
                onNavigate('create');
              }}
              className="w-full py-2.5 rounded-xl bg-noir-850 hover:bg-gold-500/10 border border-gold-500/30 text-xs font-semibold text-gold-300 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Generate Look From My Clothes Only</span>
            </button>
          </div>

          {/* Style DNA & Atelier Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-noir-850 to-noir-900 border border-gold-500/20 shadow-luxury space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
                ACTIVE STYLE PROFILE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/10 text-gold-300 border border-gold-500/30">
                {profile.vipTier}
              </span>
            </div>

            <h4 className="text-base font-serif font-bold text-silk-100">
              {profile.styleAesthetics.join(' · ')}
            </h4>

            <p className="text-xs text-silk-400 leading-relaxed">
              Color Season: <strong className="text-silk-200">{profile.colorSeason}</strong>.
              Silhouette: <strong className="text-silk-200">{profile.sizing.fitPreference}</strong>.
            </p>

            <button
              onClick={onOpenVipModal}
              className="text-xs font-mono uppercase text-gold-400 hover:text-gold-300 flex items-center gap-1 pt-1"
            >
              <span>Explore Atelier VIP Perks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Saved Looks Carousel */}
      {savedOutfits.length > 1 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-silk-100">Your Saved Ensembles</h2>
              <p className="text-xs text-silk-400">Curated looks ready to wear</p>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs font-mono uppercase text-gold-400 hover:text-gold-300 flex items-center gap-1"
            >
              <span>View All ({savedOutfits.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedOutfits.slice(1, 4).map((outfit) => (
              <div
                key={outfit.id}
                onClick={() => onOpenOutfit(outfit)}
                className="group cursor-pointer rounded-2xl bg-noir-900 border border-white/5 hover:border-gold-500/40 p-4 transition-all shadow-sm hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between text-xs text-silk-400 mb-2 font-mono">
                  <span>{outfit.occasion}</span>
                  <span className="text-gold-400 font-semibold">{outfit.confidenceScore}% MATCH</span>
                </div>

                <h3 className="text-base font-serif font-bold text-silk-100 group-hover:text-gold-300 transition-colors">
                  {outfit.title}
                </h3>
                <p className="text-xs text-silk-400 line-clamp-1 mt-0.5">{outfit.tagline}</p>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <div className="flex -space-x-2 overflow-hidden">
                    {[outfit.pieces.top, outfit.pieces.bottom, outfit.pieces.shoes]
                      .filter(Boolean)
                      .map((p, i) => (
                        <img
                          key={i}
                          src={p!.imageUrl}
                          alt={p!.name}
                          className="w-7 h-7 rounded-full object-cover border-2 border-noir-900"
                        />
                      ))}
                  </div>
                  <span className="text-[11px] text-silk-400 font-mono ml-auto">
                    {outfit.weather}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
