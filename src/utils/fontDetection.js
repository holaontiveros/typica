// Font detection utility that works for both Tauri (desktop) and web
import { FontAPI } from './fontAPI.js';

class FontDetector {
  constructor() {
    this.detectedFonts = new Map();
    this.isInitialized = false;
  }

  // Initialize the font detector by fetching from API (Tauri or web)
  async init() {
    if (this.isInitialized) {
      return this.getFonts();
    }

    console.log('Fetching system fonts...');
    
    try {
      const data = await FontAPI.getFonts();
      
      if (!data.success) {
        throw new Error(`Font API error: ${data.error}`);
      }
      
      // Clear existing fonts
      this.detectedFonts.clear();
      
      // Add fonts from API response
      for (const font of data.fonts) {
        this.detectedFonts.set(font.name, font);
      }
      
      const fontCount = data.fonts.length;
      console.log(`Successfully loaded ${fontCount} fonts`);
      
      if (data.cached) {
        console.log('Fonts loaded from cache');
      }
      
      console.log('Running in Tauri desktop app mode');
      
      this.isInitialized = true;
      return this.getFonts();
      
    } catch (error) {
      console.error('Failed to fetch fonts from API:', error);
      
      // Fallback to basic generic fonts if API fails
      console.log('Using fallback generic fonts...');
      this.addGenericFonts();
      this.isInitialized = true;
      
      return this.getFonts();
    }
  }

  // Add generic font families as fallback
  addGenericFonts() {
    const genericFonts = [
      { name: 'serif', classification: 'serif', weight: 'regular' },
      { name: 'sans-serif', classification: 'sans-serif', weight: 'regular' },
      { name: 'monospace', classification: 'monospace', weight: 'regular' },
      { name: 'cursive', classification: 'cursive', weight: 'regular' },
      { name: 'fantasy', classification: 'fantasy', weight: 'regular' }
    ];
    
    for (const genericFont of genericFonts) {
      this.detectedFonts.set(genericFont.name, {
        name: genericFont.name,
        family: genericFont.name,
        classification: genericFont.classification,
        weight: genericFont.weight,
        variants: 1,
        isSystemFont: false,
        isGeneric: true,
        isAvailable: true,
        detectionMethod: 'generic'
      });
    }
  }

  // Get all detected fonts as an array
  getFonts() {
    return Array.from(this.detectedFonts.values())
      .sort((a, b) => {
        // Sort generics last, then alphabetically
        if (a.isGeneric && !b.isGeneric) return 1;
        if (!a.isGeneric && b.isGeneric) return -1;
        return a.name.localeCompare(b.name);
      });
  }

  // Check if a specific font is available by name
  isFontAvailableByName(fontName) {
    return this.detectedFonts.has(fontName);
  }

  // Get fonts by classification
  getFontsByType(type) {
    return this.getFonts().filter(font => font.classification === type);
  }

  // Get font info by name
  getFontInfo(fontName) {
    return this.detectedFonts.get(fontName);
  }

  // Get statistics about detected fonts
  getStats() {
    const fonts = this.getFonts();
    const stats = {
      total: fonts.length,
      system: fonts.filter(f => f.isSystemFont).length,
      generic: fonts.filter(f => f.isGeneric).length,
      byType: {}
    };
    
    for (const type of ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy']) {
      stats.byType[type] = fonts.filter(f => f.classification === type).length;
    }
    
    return stats;
  }

  // Refresh fonts from API
  async refresh() {
    this.isInitialized = false;
    this.detectedFonts.clear();
    return await this.init();
  }
}

// Create a singleton instance
const fontManager = new FontDetector();

export { fontManager, FontDetector };