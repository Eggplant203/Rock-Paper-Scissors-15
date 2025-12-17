import { generateRandomNickname } from '../utils/nickname';

describe('Nickname Generator', () => {
  describe('generateRandomNickname', () => {
    test('should generate a nickname', () => {
      const nickname = generateRandomNickname();
      expect(nickname).toBeDefined();
      expect(typeof nickname).toBe('string');
      expect(nickname.length).toBeGreaterThan(0);
    });

    test('should generate nicknames with correct format', () => {
      const nickname = generateRandomNickname();
      // Should be AdjectiveNounNumber format
      expect(nickname).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d+$/);
    });

    test('should generate different nicknames', () => {
      const nicknames = new Set<string>();
      for (let i = 0; i < 50; i++) {
        nicknames.add(generateRandomNickname());
      }
      // Should generate varied nicknames
      expect(nicknames.size).toBeGreaterThan(30);
    });

    test('should have number between 0 and 999', () => {
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

    test('should start with capital letter', () => {
      const nickname = generateRandomNickname();
      expect(nickname[0]).toMatch(/[A-Z]/);
    });
  });
});
