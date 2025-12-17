import { describe, it, expect } from 'vitest';
import { generateRandomNickname } from '../utils/nickname';

describe('Nickname Utility', () => {
  describe('generateRandomNickname', () => {
    it('should generate a nickname', () => {
      const nickname = generateRandomNickname();
      expect(nickname).toBeDefined();
      expect(typeof nickname).toBe('string');
      expect(nickname.length).toBeGreaterThan(0);
    });

    it('should generate nicknames with correct format', () => {
      const nickname = generateRandomNickname();
      // Should be AdjectiveNounNumber format
      expect(nickname).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d+$/);
    });

    it('should generate different nicknames', () => {
      const nicknames = new Set<string>();
      for (let i = 0; i < 50; i++) {
        nicknames.add(generateRandomNickname());
      }
      // Should generate varied nicknames
      expect(nicknames.size).toBeGreaterThan(30);
    });

    it('should have number between 0 and 998', () => {
      for (let i = 0; i < 20; i++) {
        const nickname = generateRandomNickname();
        const match = nickname.match(/(\d+)$/);
        expect(match).not.toBeNull();
        if (match) {
          const number = parseInt(match[1]);
          expect(number).toBeGreaterThanOrEqual(0);
          expect(number).toBeLessThan(999);
        }
      }
    });

    it('should start with capital letter', () => {
      const nickname = generateRandomNickname();
      expect(nickname[0]).toMatch(/[A-Z]/);
    });

    it('should contain adjective and noun from predefined lists', () => {
      const adjectives = [
        'Swift', 'Brave', 'Clever', 'Mighty', 'Silent', 'Golden', 'Shadow', 'Thunder',
        'Cosmic', 'Blazing', 'Mystic', 'Ancient', 'Noble', 'Wild', 'Iron', 'Storm',
        'Crystal', 'Frost', 'Crimson', 'Emerald', 'Royal', 'Steel', 'Lunar', 'Solar'
      ];
      
      const nouns = [
        'Wolf', 'Dragon', 'Eagle', 'Tiger', 'Phoenix', 'Bear', 'Hawk', 'Lion',
        'Falcon', 'Panther', 'Raven', 'Viper', 'Warrior', 'Knight', 'Hunter', 'Samurai',
        'Ninja', 'Guardian', 'Champion', 'Legend', 'Hero', 'Master', 'Sage', 'Wizard'
      ];

      for (let i = 0; i < 10; i++) {
        const nickname = generateRandomNickname();
        const hasAdjective = adjectives.some(adj => nickname.startsWith(adj));
        expect(hasAdjective).toBe(true);
        
        const hasNoun = nouns.some(noun => {
          const regex = new RegExp(noun + '\\d+$');
          return regex.test(nickname);
        });
        expect(hasNoun).toBe(true);
      }
    });
  });
});
