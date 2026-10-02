import { WardrobeItem, Outfit, UserProfile } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_WARDROBE, INITIAL_SAVED_OUTFITS } from './mockData';

const KEY_PROFILE = 'nika_user_profile';
const KEY_WARDROBE = 'nika_wardrobe_items';
const KEY_OUTFITS = 'nika_saved_outfits';

export const storageService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEY_PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading user profile', e);
    }
    this.saveProfile(INITIAL_USER_PROFILE);
    return INITIAL_USER_PROFILE;
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed saving profile', e);
    }
  },

  getWardrobe(): WardrobeItem[] {
    try {
      const data = localStorage.getItem(KEY_WARDROBE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading wardrobe', e);
    }
    this.saveWardrobe(INITIAL_WARDROBE);
    return INITIAL_WARDROBE;
  },

  saveWardrobe(items: WardrobeItem[]): void {
    try {
      localStorage.setItem(KEY_WARDROBE, JSON.stringify(items));
    } catch (e) {
      console.error('Failed saving wardrobe', e);
    }
  },

  addWardrobeItem(item: Omit<WardrobeItem, 'id' | 'addedAt' | 'timesWorn'>): WardrobeItem {
    const items = this.getWardrobe();
    const newItem: WardrobeItem = {
      ...item,
      id: `w-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
      timesWorn: 0,
    };
    items.unshift(newItem);
    this.saveWardrobe(items);

    // Update profile stats
    const profile = this.getProfile();
    profile.stats.totalClosetPieces = items.length;
    this.saveProfile(profile);

    return newItem;
  },

  deleteWardrobeItem(id: string): void {
    const items = this.getWardrobe().filter((i) => i.id !== id);
    this.saveWardrobe(items);
    const profile = this.getProfile();
    profile.stats.totalClosetPieces = items.length;
    this.saveProfile(profile);
  },

  getSavedOutfits(): Outfit[] {
    try {
      const data = localStorage.getItem(KEY_OUTFITS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed reading outfits', e);
    }
    this.saveOutfits(INITIAL_SAVED_OUTFITS);
    return INITIAL_SAVED_OUTFITS;
  },

  saveOutfits(outfits: Outfit[]): void {
    try {
      localStorage.setItem(KEY_OUTFITS, JSON.stringify(outfits));
    } catch (e) {
      console.error('Failed saving outfits', e);
    }
  },

  saveNewOutfit(outfit: Outfit): Outfit {
    const list = this.getSavedOutfits();
    const toSave: Outfit = {
      ...outfit,
      savedAt: 'Just now',
      isFavorite: true,
    };
    list.unshift(toSave);
    this.saveOutfits(list);

    // Update profile stats
    const profile = this.getProfile();
    profile.stats.looksSaved = list.length;
    profile.stats.looksGenerated += 1;
    this.saveProfile(profile);

    return toSave;
  },

  toggleFavoriteOutfit(id: string): Outfit[] {
    const list = this.getSavedOutfits().map((outfit) => {
      if (outfit.id === id) {
        return { ...outfit, isFavorite: !outfit.isFavorite };
      }
      return outfit;
    });
    this.saveOutfits(list);
    return list;
  },

  deleteSavedOutfit(id: string): void {
    const list = this.getSavedOutfits().filter((o) => o.id !== id);
    this.saveOutfits(list);
    const profile = this.getProfile();
    profile.stats.looksSaved = list.length;
    this.saveProfile(profile);
  },

  getPostgresSchemaSql(): string {
    return `-- NIKA Luxury Fashion Stylist PostgreSQL Schema
-- Production Ready Relational Schema

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    location VARCHAR(120),
    budget_tier VARCHAR(50) DEFAULT 'Designer Luxury',
    color_season VARCHAR(50),
    vip_tier VARCHAR(50) DEFAULT 'NIKA Atelier VIP',
    is_vip BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wardrobe_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- tops, bottoms, dresses, outerwear, footwear, bags, accessories
    subcategory VARCHAR(50),
    brand VARCHAR(100),
    color_name VARCHAR(50),
    color_hex VARCHAR(7),
    season VARCHAR(50) DEFAULT 'All-Season',
    image_url TEXT,
    in_closet BOOLEAN DEFAULT TRUE,
    times_worn INT DEFAULT 0,
    occasions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE outfits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    tagline TEXT,
    occasion VARCHAR(100) NOT NULL,
    weather VARCHAR(100),
    style_aesthetic VARCHAR(100),
    budget_tier VARCHAR(50),
    confidence_score INT DEFAULT 98,
    is_closet_only BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    styling_tips TEXT[],
    color_palette JSONB,
    pieces_breakdown JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wardrobe_user ON wardrobe_items(user_id);
CREATE INDEX idx_outfits_user ON outfits(user_id);
`;
  }
};
