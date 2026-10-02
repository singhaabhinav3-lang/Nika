export type GarmentCategory =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'footwear'
  | 'bags'
  | 'accessories';

export interface WardrobeItem {
  id: string;
  name: string;
  category: GarmentCategory;
  subcategory: string;
  color: string;
  colorHex: string;
  season: 'All-Season' | 'Spring/Summer' | 'Fall/Winter';
  brand: string;
  imageUrl: string;
  inCloset: boolean;
  occasions: string[];
  timesWorn: number;
  addedAt: string;
  notes?: string;
}

export interface OutfitPiece {
  id: string;
  name: string;
  category: GarmentCategory;
  brand: string;
  material?: string;
  color: string;
  colorHex: string;
  imageUrl: string;
  isFromCloset: boolean;
  closetItemId?: string;
  price?: number;
  retailer?: string;
  shopUrl?: string;
  inStock?: boolean;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'Base' | 'Accent' | 'Layer' | 'Contrast';
}

export interface Outfit {
  id: string;
  title: string;
  tagline: string;
  occasion: string;
  weather: string;
  temperature: string;
  styleAesthetic: string;
  budgetTier: string;
  confidenceScore: number; // e.g. 96 - 99
  pieces: {
    top?: OutfitPiece;
    bottom?: OutfitPiece;
    dress?: OutfitPiece;
    outerwear?: OutfitPiece;
    shoes: OutfitPiece;
    bag?: OutfitPiece;
    accessories: OutfitPiece[];
  };
  colorPalette: ColorSwatch[];
  stylingTips: string[];
  silhouetteRationale: string;
  layeringGuide: string;
  isClosetOnly: boolean;
  savedAt?: string;
  isFavorite: boolean;
  tryOnSettings?: {
    lighting: 'Editorial Studio' | 'Golden Hour' | 'Evening Lounge' | 'Natural Daylight';
    pose: 'Editorial Stance' | 'Runway Stride' | 'Seated Chic';
    outerwearLayered: boolean;
    accessoryHighlight: boolean;
  };
}

export interface DiscoverLook {
  id: string;
  title: string;
  subtitle: string;
  aesthetic: string;
  season: string;
  tags: string[];
  heroImageUrl: string;
  curator: string;
  likes: number;
  saves: number;
  fullOutfit: Outfit;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  styleAesthetics: string[];
  favoriteColors: string[];
  preferredOccasions: string[];
  budgetTier: 'Conscious' | 'Elevated Contemporary' | 'Designer Luxury' | 'Haute Couture';
  location: string;
  weatherUnit: '°C' | '°F';
  colorSeason: string; // e.g., 'Deep Autumn', 'Cool Summer', 'Light Spring'
  sizing: {
    top: string;
    bottom: string;
    shoes: string;
    height: string;
    fitPreference: 'Relaxed Tailoring' | 'Slim Structured' | 'Oversized Editorial';
  };
  isVipMember: boolean;
  vipTier: 'Complimentary' | 'NIKA Atelier VIP' | 'NIKA Haute Privé';
  memberSince: string;
  stats: {
    totalClosetPieces: number;
    looksGenerated: number;
    looksSaved: number;
    wardrobeUtilization: number; // e.g. 84%
  };
}

export type NavPage = 'home' | 'discover' | 'create' | 'outfit-result' | 'wardrobe' | 'profile';
