import React, { useState } from 'react';
import {
  Shirt,
  Plus,
  Sparkles,
  Filter,
  Trash2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Search
} from 'lucide-react';
import { WardrobeItem, GarmentCategory, NavPage } from '../types';

interface WardrobePageProps {
  wardrobe: WardrobeItem[];
  onOpenAddItemModal: () => void;
  onDeleteItem: (id: string) => void;
  onNavigate: (page: NavPage) => void;
  onGenerateClosetOutfit: () => void;
}

export const WardrobePage: React.FC<WardrobePageProps> = ({
  wardrobe,
  onOpenAddItemModal,
  onDeleteItem,
  onNavigate,
  onGenerateClosetOutfit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Pieces', count: wardrobe.length },
    { id: 'tops', label: 'Tops', count: wardrobe.filter((i) => i.category === 'tops').length },
    { id: 'bottoms', label: 'Bottoms', count: wardrobe.filter((i) => i.category === 'bottoms').length },
    { id: 'dresses', label: 'Dresses', count: wardrobe.filter((i) => i.category === 'dresses').length },
    { id: 'outerwear', label: 'Outerwear', count: wardrobe.filter((i) => i.category === 'outerwear').length },
    { id: 'footwear', label: 'Footwear', count: wardrobe.filter((i) => i.category === 'footwear').length },
    { id: 'bags', label: 'Bags', count: wardrobe.filter((i) => i.category === 'bags').length },
    { id: 'accessories', label: 'Accessories', count: wardrobe.filter((i) => i.category === 'accessories').length },
  ];

  const filteredItems = wardrobe.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason =
      selectedSeason === 'All' || item.season === selectedSeason || item.season === 'All-Season';
    return matchesCat && matchesSearch && matchesSeason;
  });

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      {/* Top Banner & Stats */}
      <section className="relative rounded-3xl p-6 sm:p-8 glass-panel-gold border border-gold-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-3">
            <Shirt className="w-3.5 h-3.5 text-gold-400" />
            <span>AI DIGITAL WARDROBE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-silk-100">
            Your Private Closet
          </h1>
          <p className="text-xs sm:text-sm text-silk-300 mt-2 leading-relaxed">
            Digitize every piece you own. NIKA cross-references proportions, colors, and cuts
            to build unlimited outfits exclusively from what already hangs in your closet.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenAddItemModal}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-luxury-glow flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Piece</span>
          </button>

          <button
            onClick={onGenerateClosetOutfit}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-noir-850 hover:bg-noir-800 text-gold-300 border border-gold-500/30 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Style From Closet</span>
          </button>
        </div>
      </section>

      {/* Wardrobe AI Gap Intelligence */}
      <section className="p-5 rounded-2xl bg-noir-900 border border-white/10 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400">
              AI CAPSULE AUDIT
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">86% Versatility Score</span>
          </div>
          <p className="text-xs text-silk-200 mt-1 leading-relaxed">
            Your wardrobe has strong foundations in cashmere and tailored trousers. To unlock 18+
            new transitional looks, consider adding a{' '}
            <strong className="text-gold-300">double-breasted camel trench</strong> and{' '}
            <strong className="text-gold-300">oxblood leather loafers</strong>.
          </p>
        </div>
      </section>

      {/* Search & Season Controls */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-silk-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand, garment, color..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-noir-900 border border-white/10 text-xs text-silk-100 placeholder-silk-500 focus:outline-none focus:border-gold-500/60"
          />
        </div>

        {/* Season Pill Selectors */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 text-xs">
          {['All', 'All-Season', 'Spring/Summer', 'Fall/Winter'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedSeason === s
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                  : 'bg-noir-900 text-silk-400 hover:text-silk-200 border border-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Category Tabs */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gold-500 text-noir-950 font-bold shadow-sm'
                  : 'bg-noir-900 text-silk-400 hover:text-silk-200 border border-white/5'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-noir-950 text-gold-400' : 'bg-white/5 text-silk-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </section>

      {/* Wardrobe Grid */}
      <section>
        {filteredItems.length === 0 ? (
          <div className="p-12 rounded-3xl bg-noir-900 border border-white/10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-silk-500">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-silk-100">No Pieces Found</h3>
            <p className="text-xs text-silk-400 max-w-sm mx-auto">
              No garments match "{searchQuery || selectedCategory}". Add a new piece or reset
              filters.
            </p>
            <button
              onClick={onOpenAddItemModal}
              className="px-4 py-2 rounded-xl bg-gold-500 text-noir-950 font-bold text-xs"
            >
              Upload Garment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-noir-900 border border-white/10 hover:border-gold-500/40 overflow-hidden shadow-sm transition-all flex flex-col"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-silk-200 border border-white/10">
                      {item.subcategory}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-gold-950/80 text-gold-300 border border-gold-500/30">
                      {item.season}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-900/80 text-silk-400 hover:text-rose-200 opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                    title="Remove piece"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-semibold">
                      {item.brand}
                    </div>
                    <h4 className="text-xs font-semibold text-silk-100 line-clamp-1 mt-0.5">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/20"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-[10px] text-silk-400 font-mono">{item.color}</span>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-silk-500">
                    <span>Worn {item.timesWorn} times</span>
                    <span className="text-emerald-400">Ready</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
