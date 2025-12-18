import { describe, it, expect } from 'vitest';
import { STICKER_CATEGORIES } from '../stickers';

describe('Stickers', () => {
  describe('STICKER_CATEGORIES', () => {
    it('should have at least one category', () => {
      expect(STICKER_CATEGORIES.length).toBeGreaterThan(0);
    });

    it('should have valid category structure', () => {
      STICKER_CATEGORIES.forEach(category => {
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('stickers');
        expect(typeof category.name).toBe('string');
        expect(Array.isArray(category.stickers)).toBe(true);
        expect(category.stickers.length).toBeGreaterThan(0);
      });
    });

    it('should have unique category names', () => {
      const names = STICKER_CATEGORIES.map(cat => cat.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('should have valid sticker paths', () => {
      STICKER_CATEGORIES.forEach(category => {
        category.stickers.forEach(sticker => {
          expect(typeof sticker).toBe('string');
          expect(sticker).toMatch(/^\/assets\/images\/stickers\/.+\..+$/);
        });
      });
    });

    it('should have expected categories', () => {
      const categoryNames = STICKER_CATEGORIES.map(cat => cat.name);
      expect(categoryNames).toContain('Bán Mình Cho Tư Bản');
      expect(categoryNames).toContain('Creative Vibes');
      expect(categoryNames).toContain('Cò Lõ');
      expect(categoryNames).toContain('Mèo Méo');
      expect(categoryNames).toContain('Quàng thượng on the mic');
    });
  });
});
