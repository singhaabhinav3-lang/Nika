import React, { useState } from 'react';
import { X, Upload, Sparkles, Plus, Check } from 'lucide-react';
import { GarmentCategory, WardrobeItem } from '../types';

interface AddWardrobeItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<WardrobeItem, 'id' | 'addedAt' | 'timesWorn'>) => void;
}

const PRESET_GARMENTS = [
  {
    name: 'Silk Bias-Cut Midi Skirt',
    category: 'bottoms' as GarmentCategory,
    subcategory: 'Skirt',
    brand: 'Reformation',
    color: 'Champagne Silk',
    colorHex: '#EAE1CE',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80',
    season: 'All-Season' as const,
    occasions: ['Dinner Date', 'Cocktail', 'Summer Wedding'],
  },
  {
    name: 'Double-Breasted Cotton Trench',
    category: 'outerwear' as GarmentCategory,
    subcategory: 'Trench Coat',
    brand: 'Burberry Archive',
    color: 'Honey Beige',
    colorHex: '#D4C4A8',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
    season: 'All-Season' as const,
    occasions: ['Creative Business', 'Travel Luxe', 'Rainy Days'],
  },
  {
    name: 'Cashmere Polo Knit',
    category: 'tops' as GarmentCategory,
    subcategory: 'Knit Polo',
    brand: 'Loro Piana',
    color: 'Oatmeal Taupe',
    colorHex: '#D6CDC0',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    season: 'Fall/Winter' as const,
    occasions: ['Creative Business', 'Weekend Brunch'],
  },
  {
    name: 'Minimal Leather Crossbody',
    category: 'bags' as GarmentCategory,
    subcategory: 'Crossbody',
    brand: 'Celine',
    color: 'Midnight Noir',
    colorHex: '#141417',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    season: 'All-Season' as const,
    occasions: ['Everyday Luxe', 'Gallery Opening'],
  },
  {
    name: 'Leather Knee-High Boots',
    category: 'footwear' as GarmentCategory,
    subcategory: 'Boots',
    brand: 'Totême',
    color: 'Espresso Chocolate',
    colorHex: '#382218',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    season: 'Fall/Winter' as const,
    occasions: ['Dinner Date', 'Creative Business'],
  }
];

export const AddWardrobeItemModal: React.FC<AddWardrobeItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GarmentCategory>('tops');
  const [subcategory, setSubcategory] = useState('Knit');
  const [brand, setBrand] = useState('Totême');
  const [color, setColor] = useState('Ivory Cream');
  const [colorHex, setColorHex] = useState('#FAF8F5');
  const [season, setSeason] = useState<'All-Season' | 'Spring/Summer' | 'Fall/Winter'>('All-Season');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'
  );
  const [notes, setNotes] = useState('');
  const [isAiScanning, setIsAiScanning] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (p: typeof PRESET_GARMENTS[0]) => {
    setName(p.name);
    setCategory(p.category);
    setSubcategory(p.subcategory);
    setBrand(p.brand);
    setColor(p.color);
    setColorHex(p.colorHex);
    setSeason(p.season);
    setImageUrl(p.imageUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAiScanning(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
        setTimeout(() => {
          setIsAiScanning(false);
          if (!name) setName('Structured Tailored Piece');
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || 'Staple',
      brand: brand.trim() || 'Designer',
      color: color.trim() || 'Neutral',
      colorHex,
      season,
      imageUrl,
      inCloset: true,
      occasions: ['Creative Business', 'Dinner', 'Casual Luxe'],
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-noir-900 border border-gold-500/30 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-silk-300 hover:text-silk-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-silk-100">Digitize Wardrobe Piece</h3>
            <p className="text-xs text-silk-400">
              Upload garment photo or choose from curated staple silhouettes
            </p>
          </div>
        </div>

        {/* Quick Presets Carousel */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400">
              Instant Wardrobe Presets
            </span>
            <span className="text-[10px] text-silk-500">Tap to load preset</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_GARMENTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-gold-500/50 transition-all text-left"
              >
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                  <span className="text-[9px] text-silk-200 font-mono truncate w-full">{p.subcategory}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload & Preview */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-noir-850 border border-white/5">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
              <img src={imageUrl} alt="Piece Preview" className="w-full h-full object-cover" />
              {isAiScanning && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold-400 animate-spin" />
                  <span className="text-[8px] font-mono text-gold-300 mt-1">SCANNING</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-silk-200 mb-1">
                Garment Photography
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-xs font-mono text-gold-300 border border-gold-500/30 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-silk-400 mt-1">
                Zero permissions required with native Photo Picker
              </p>
            </div>
          </div>

          {/* Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                Garment Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ribbed Cashmere Mockneck"
                className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm focus:outline-none focus:border-gold-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                Brand / Designer
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Totême, COS, Vintage"
                className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          {/* Category & Season */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm focus:outline-none focus:border-gold-500/60"
              >
                <option value="tops">Tops & Blouses</option>
                <option value="bottoms">Trousers & Skirts</option>
                <option value="dresses">Dresses & Jumpsuits</option>
                <option value="outerwear">Coats & Blazers</option>
                <option value="footwear">Shoes & Boots</option>
                <option value="bags">Bags & Totes</option>
                <option value="accessories">Jewelry & Accents</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm focus:outline-none focus:border-gold-500/60"
              >
                <option value="All-Season">All-Season Staple</option>
                <option value="Spring/Summer">Spring / Summer</option>
                <option value="Fall/Winter">Fall / Winter</option>
              </select>
            </div>
          </div>

          {/* Color & Hex */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                Color Name
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Oatmeal Taupe, Camel"
                className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm focus:outline-none focus:border-gold-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-silk-400 mb-1">
                Color Swatch Tone
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border border-white/10 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-sm font-mono focus:outline-none focus:border-gold-500/60"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-sm tracking-wide transition-all shadow-luxury-glow flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Piece to AI Wardrobe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
