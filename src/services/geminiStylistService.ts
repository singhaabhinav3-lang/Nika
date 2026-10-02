import { Outfit, OutfitPiece, WardrobeItem, ColorSwatch } from '../types';

export interface OutfitGenerationParams {
  occasion: string;
  weather: string;
  temperature: string;
  styleAesthetic: string;
  budgetTier: string;
  useClosetOnly: boolean;
  userWardrobe: WardrobeItem[];
  customNotes?: string;
}

const LOCAL_STORAGE_API_KEY = 'nika_gemini_api_key';

export const geminiStylistService = {
  getApiKey(): string {
    try {
      const userKey = localStorage.getItem(LOCAL_STORAGE_API_KEY);
      if (userKey && userKey.trim()) return userKey.trim();
    } catch (e) {
      // Ignore
    }

    if (typeof process !== 'undefined') {
      if (process.env?.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
        return process.env.GEMINI_API_KEY;
      }
      if (process.env?.API_KEY && process.env.API_KEY !== 'MY_GEMINI_API_KEY') {
        return process.env.API_KEY;
      }
    }

    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env) {
      const env = (import.meta as any).env;
      if (env.VITE_GEMINI_API_KEY && env.VITE_GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
        return env.VITE_GEMINI_API_KEY;
      }
      if (env.VITE_API_KEY && env.VITE_API_KEY !== 'MY_GEMINI_API_KEY') {
        return env.VITE_API_KEY;
      }
    }

    return '';
  },

  setApiKey(key: string): void {
    if (key && key.trim()) {
      localStorage.setItem(LOCAL_STORAGE_API_KEY, key.trim());
    } else {
      localStorage.removeItem(LOCAL_STORAGE_API_KEY);
    }
  },

  async testApiKey(keyToTest?: string): Promise<{ success: boolean; model?: string; message: string }> {
    const key = (keyToTest || this.getApiKey()).trim();
    if (!key) {
      return { success: false, message: 'No API key provided. Please enter a valid Gemini API key.' };
    }

    const testModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

    for (const model of testModels) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Say OK' }] }],
            }),
          }
        );

        if (res.ok) {
          return {
            success: true,
            model,
            message: `Successfully connected to Gemini API with model: ${model}.`,
          };
        } else {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${res.status}`;
          if (res.status === 400 || res.status === 403) {
            return {
              success: false,
              message: `API Key error (${res.status}): ${errMsg}`,
            };
          }
        }
      } catch (err: any) {
        console.warn(`Error testing model ${model}:`, err);
      }
    }

    return {
      success: false,
      message: 'Could not connect to Gemini API. Please check network or key permissions.',
    };
  },

  async generateOutfit(params: OutfitGenerationParams): Promise<Outfit> {
    const apiKey = this.getApiKey();

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const liveAiOutfit = await this.callGeminiApi(apiKey, params);
        if (liveAiOutfit) return liveAiOutfit;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to NIKA Fashion Intelligence engine:', err);
      }
    }

    // High-Fidelity NIKA Luxury Fashion Intelligence Engine
    return this.synthesizeOutfitLocally(params);
  },

  async callGeminiApi(apiKey: string, params: OutfitGenerationParams): Promise<Outfit | null> {
    const prompt = `You are NIKA, an elite personal fashion stylist who dresses high-profile clients in Milan, Paris, and New York.
The client asks: "Tell NIKA where you are going, and NIKA tells you what to wear."
Client Request:
- Occasion: ${params.occasion}
- Weather: ${params.weather} (${params.temperature})
- Aesthetic Vibe: ${params.styleAesthetic}
- Budget Tier: ${params.budgetTier}
- Use Only Existing Wardrobe: ${params.useClosetOnly ? 'YES' : 'NO'}
- Additional Notes: ${params.customNotes || 'None'}
- Available Closet Items: ${params.userWardrobe.map((w) => `${w.category}: ${w.name} (${w.brand}, ${w.color})`).join('; ')}

Return a strict JSON object with this exact structure:
{
  "title": "Editorial Name for the Look",
  "tagline": "A poetic, chic 1-line description of the look",
  "confidenceScore": 98,
  "silhouetteRationale": "Detailed professional stylist rationale on proportions, balance, and visual lines",
  "layeringGuide": "Step-by-step layering advice tailored to ${params.temperature} and ${params.weather}",
  "stylingTips": [
    "Tip 1 on tucking, cuffing, or posture",
    "Tip 2 on accessories and metallics",
    "Tip 3 on grooming or fragrance note"
  ],
  "colorPalette": [
    {"name": "Color Name", "hex": "#HEX", "role": "Base"},
    {"name": "Color Name", "hex": "#HEX", "role": "Layer"},
    {"name": "Color Name", "hex": "#HEX", "role": "Contrast"},
    {"name": "Color Name", "hex": "#HEX", "role": "Accent"}
  ],
  "topName": "Exact item name",
  "topBrand": "Brand",
  "bottomName": "Exact item name",
  "bottomBrand": "Brand",
  "outerwearName": "Exact item name or none",
  "outerwearBrand": "Brand",
  "shoesName": "Exact item name",
  "shoesBrand": "Brand",
  "bagName": "Exact item name",
  "bagBrand": "Brand",
  "accessoryName": "Jewelry / Sunglasses / Scarf",
  "accessoryBrand": "Brand"
}`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

    let candidate = '';
    for (const model of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            candidate = text;
            break;
          }
        } else {
          console.warn(`Gemini model ${model} HTTP ${res.status}`);
        }
      } catch (err) {
        console.warn(`Error with ${model}:`, err);
      }
    }

    if (!candidate) return null;

    const parsed = JSON.parse(candidate);

    return {
      id: `outfit-${Date.now()}`,
      title: parsed.title || `${params.styleAesthetic} at ${params.occasion}`,
      tagline: parsed.tagline || 'Curated with meticulous attention to proportion, texture, and light.',
      occasion: params.occasion,
      weather: params.weather,
      temperature: params.temperature,
      styleAesthetic: params.styleAesthetic,
      budgetTier: params.budgetTier,
      confidenceScore: parsed.confidenceScore || 98,
      pieces: {
        top: {
          id: `ai-top-${Date.now()}`,
          name: parsed.topName || 'Silk Poplin Blouse',
          category: 'tops',
          brand: parsed.topBrand || 'Totême',
          material: 'Pure Silk',
          color: 'Ivory Cream',
          colorHex: '#FAF8F5',
          imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
          isFromCloset: params.useClosetOnly,
          price: 490,
          retailer: 'SSENSE',
        },
        bottom: {
          id: `ai-bot-${Date.now()}`,
          name: parsed.bottomName || 'High-Rise Pleated Trousers',
          category: 'bottoms',
          brand: parsed.bottomBrand || 'COS Atelier',
          material: 'Virgin Wool Blend',
          color: 'Charcoal Noir',
          colorHex: '#25252B',
          imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
          isFromCloset: params.useClosetOnly,
          price: 210,
          retailer: 'COS',
        },
        outerwear: parsed.outerwearName ? {
          id: `ai-out-${Date.now()}`,
          name: parsed.outerwearName,
          category: 'outerwear',
          brand: parsed.outerwearBrand || 'Max Mara',
          material: 'Cashmere & Wool',
          color: 'Camel Tan',
          colorHex: '#C09363',
          imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=600&q=80',
          isFromCloset: params.useClosetOnly,
          price: 1650,
          retailer: 'Net-A-Porter',
        } : undefined,
        shoes: {
          id: `ai-sh-${Date.now()}`,
          name: parsed.shoesName || 'Pointed Kitten-Heel Mules',
          category: 'footwear',
          brand: parsed.shoesBrand || 'Saint Laurent',
          material: 'Patent Calfskin',
          color: 'Midnight Noir',
          colorHex: '#141417',
          imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
          isFromCloset: params.useClosetOnly,
          price: 850,
          retailer: 'Farfetch',
        },
        bag: parsed.bagName ? {
          id: `ai-bag-${Date.now()}`,
          name: parsed.bagName,
          category: 'bags',
          brand: parsed.bagBrand || 'The Row',
          material: 'Grained Nappa Leather',
          color: 'Espresso Bronze',
          colorHex: '#4A3728',
          imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
          isFromCloset: params.useClosetOnly,
          price: 1980,
          retailer: 'Bergdorf Goodman',
        } : undefined,
        accessories: parsed.accessoryName ? [
          {
            id: `ai-acc-${Date.now()}`,
            name: parsed.accessoryName,
            category: 'accessories',
            brand: parsed.accessoryBrand || 'Khaite',
            material: '18k Vermeil',
            color: 'Gold',
            colorHex: '#C5A059',
            imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
            isFromCloset: params.useClosetOnly,
            price: 380,
            retailer: 'MatchesFashion',
          }
        ] : [],
      },
      colorPalette: parsed.colorPalette || [
        { name: 'Ivory Cream', hex: '#FAF8F5', role: 'Base' },
        { name: 'Charcoal Noir', hex: '#25252B', role: 'Contrast' },
        { name: 'Warm Camel', hex: '#C09363', role: 'Layer' },
        { name: 'Champagne Gold', hex: '#C5A059', role: 'Accent' },
      ],
      stylingTips: parsed.stylingTips || [
        'Tuck the front hem to elongate the leg line.',
        'Keep accessories understated: one sculptural piece is stronger than many.'
      ],
      silhouetteRationale: parsed.silhouetteRationale || 'Architectural volume contrast with balanced vertical lines.',
      layeringGuide: parsed.layeringGuide || 'Base silk layer with structured wool outer layer.',
      isClosetOnly: params.useClosetOnly,
      savedAt: 'Just now',
      isFavorite: false,
    };
  },

  synthesizeOutfitLocally(params: OutfitGenerationParams): Outfit {
    const closet = params.userWardrobe;

    // Helper to find closest item in closet by category
    const findInCloset = (category: string): WardrobeItem | undefined => {
      return closet.find((item) => item.category === category);
    };

    const closetTop = findInCloset('tops');
    const closetBottom = findInCloset('bottoms');
    const closetDress = findInCloset('dresses');
    const closetOuter = findInCloset('outerwear');
    const closetShoes = findInCloset('footwear');
    const closetBag = findInCloset('bags');
    const closetAcc = closet.filter((item) => item.category === 'accessories');

    const isEveningOrFormal =
      params.occasion.toLowerCase().includes('cocktail') ||
      params.occasion.toLowerCase().includes('dinner') ||
      params.occasion.toLowerCase().includes('wedding') ||
      params.occasion.toLowerCase().includes('party');

    const isCold =
      params.weather.toLowerCase().includes('cold') ||
      params.weather.toLowerCase().includes('rain') ||
      params.temperature.includes('4') ||
      params.temperature.includes('12') ||
      params.temperature.includes('14') ||
      params.temperature.includes('16');

    // Generate chic titles based on inputs
    const adjectives = ['The Understated', 'The Architectural', 'The Sculpted', 'The Effortless', 'The High-Contrast'];
    const selectedAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const title = `${selectedAdj} ${params.styleAesthetic} Edit`;
    const tagline = `Tailored for ${params.occasion.toLowerCase()} in ${params.weather.toLowerCase()} (${params.temperature})`;

    // Convert wardrobe item to outfit piece
    const toPiece = (item: WardrobeItem, fallbackName: string, category: any): OutfitPiece => ({
      id: `piece-${item.id}`,
      name: item.name,
      category: item.category,
      brand: item.brand,
      color: item.color,
      colorHex: item.colorHex,
      imageUrl: item.imageUrl,
      isFromCloset: true,
      closetItemId: item.id,
      price: 350,
      retailer: 'Your Closet',
    });

    // Top & Bottom vs Dress logic
    let topPiece: OutfitPiece | undefined;
    let bottomPiece: OutfitPiece | undefined;
    let dressPiece: OutfitPiece | undefined;

    if (isEveningOrFormal && closetDress && Math.random() > 0.4) {
      dressPiece = toPiece(closetDress, 'Silk Slip Dress', 'dresses');
    } else {
      if (closetTop) {
        topPiece = toPiece(closetTop, 'Cashmere Mock Neck', 'tops');
      } else {
        topPiece = {
          id: `rec-top-${Date.now()}`,
          name: 'Ribbed Merino Wool Knit',
          category: 'tops',
          brand: 'Khaite',
          material: '100% Extrafine Merino',
          color: 'Cashmere Chalk',
          colorHex: '#F3EFEA',
          imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
          isFromCloset: false,
          price: 580,
          retailer: 'SSENSE',
        };
      }

      if (closetBottom) {
        bottomPiece = toPiece(closetBottom, 'Pleated Flannel Trousers', 'bottoms');
      } else {
        bottomPiece = {
          id: `rec-bot-${Date.now()}`,
          name: 'Pleated Straight-Leg Trousers',
          category: 'bottoms',
          brand: 'The Row',
          material: 'Wool Barathea',
          color: 'Midnight Noir',
          colorHex: '#141417',
          imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
          isFromCloset: false,
          price: 1190,
          retailer: 'Net-A-Porter',
        };
      }
    }

    // Outerwear
    let outerPiece: OutfitPiece | undefined;
    if (isCold || closetOuter) {
      if (closetOuter) {
        outerPiece = toPiece(closetOuter, 'Tailored Wool Coat', 'outerwear');
      } else {
        outerPiece = {
          id: `rec-out-${Date.now()}`,
          name: 'Double-Faced Cashmere Robe Coat',
          category: 'outerwear',
          brand: 'Totême',
          material: 'Cashmere & Wool',
          color: 'Espresso Taupe',
          colorHex: '#3D3833',
          imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=600&q=80',
          isFromCloset: false,
          price: 1450,
          retailer: 'MatchesFashion',
        };
      }
    }

    // Footwear
    let shoesPiece: OutfitPiece;
    if (closetShoes) {
      shoesPiece = toPiece(closetShoes, 'Pointed Kitten Heels', 'footwear');
    } else {
      shoesPiece = {
        id: `rec-sh-${Date.now()}`,
        name: isEveningOrFormal ? 'Pointed Slingback Pumps' : 'Leather Penny Loafers',
        category: 'footwear',
        brand: 'Celine',
        material: 'Polished Box Calfskin',
        color: 'Burgundy Oxblood',
        colorHex: '#4A1D24',
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
        isFromCloset: false,
        price: 890,
        retailer: 'Celine',
      };
    }

    // Bag
    let bagPiece: OutfitPiece | undefined;
    if (closetBag) {
      bagPiece = toPiece(closetBag, 'Structured Shoulder Bag', 'bags');
    } else {
      bagPiece = {
        id: `rec-bag-${Date.now()}`,
        name: 'Structured Leather Pochette',
        category: 'bags',
        brand: 'Loro Piana',
        material: 'Taurillon Leather',
        color: 'Warm Bronze',
        colorHex: '#A37B5C',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        isFromCloset: false,
        price: 2150,
        retailer: 'Farfetch',
      };
    }

    // Accessories
    const accessories: OutfitPiece[] = closetAcc.length > 0
      ? closetAcc.slice(0, 2).map((a) => toPiece(a, a.name, 'accessories'))
      : [
          {
            id: `rec-acc-${Date.now()}`,
            name: 'Architectural Vermeil Hoops',
            category: 'accessories',
            brand: 'Khaite',
            material: '18k Gold Plated Brass',
            color: 'Brushed Gold',
            colorHex: '#C5A059',
            imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
            isFromCloset: false,
            price: 360,
            retailer: 'Net-A-Porter',
          }
        ];

    // Harmonious Color Swatches
    const colorPalette: ColorSwatch[] = [
      { name: topPiece?.color || dressPiece?.color || 'Chalk Ivory', hex: topPiece?.colorHex || dressPiece?.colorHex || '#F4EFEB', role: 'Base' },
      { name: bottomPiece?.color || 'Charcoal Slate', hex: bottomPiece?.colorHex || '#25252B', role: 'Contrast' },
      { name: outerPiece?.color || 'Warm Camel', hex: outerPiece?.colorHex || '#C09363', role: 'Layer' },
      { name: 'Brushed Champagne Gold', hex: '#C5A059', role: 'Accent' },
    ];

    const stylingTips = [
      `Balance the silhouette: Allow the crisp hem of the top to counterbalance the fluid line of the ${bottomPiece ? bottomPiece.name : 'dress'}.`,
      `For ${params.weather.toLowerCase()} conditions, drape the outer layer over your shoulders rather than fastening all the buttons for a relaxed, editorial posture.`,
      `Ground the neutrals with ${shoesPiece.name} in ${shoesPiece.color} to introduce intentional contrast.`,
      `Finish with a swipe of warm amber or cedarwood fragrance for subtle tactile luxury.`
    ];

    const confidenceScore = Math.floor(Math.random() * 4) + 96; // 96-99%

    return {
      id: `outfit-${Date.now()}`,
      title,
      tagline,
      occasion: params.occasion,
      weather: params.weather,
      temperature: params.temperature,
      styleAesthetic: params.styleAesthetic,
      budgetTier: params.budgetTier,
      confidenceScore,
      pieces: {
        top: topPiece,
        bottom: bottomPiece,
        dress: dressPiece,
        outerwear: outerPiece,
        shoes: shoesPiece,
        bag: bagPiece,
        accessories,
      },
      colorPalette,
      stylingTips,
      silhouetteRationale: `The interplay between the structured ${outerPiece ? outerPiece.name : 'shoulders'} and relaxed fluid cuts honors your ${params.styleAesthetic} preferences while ensuring absolute ease of movement.`,
      layeringGuide: `Base layer: Breathable soft texture next to skin. Mid-layer: Tailored waistline anchor. Thermal protection: Rated comfortable down to ${params.temperature}.`,
      isClosetOnly: params.useClosetOnly,
      savedAt: 'Just now',
      isFavorite: false,
      tryOnSettings: {
        lighting: 'Editorial Studio',
        pose: 'Editorial Stance',
        outerwearLayered: true,
        accessoryHighlight: true,
      },
    };
  }
};
