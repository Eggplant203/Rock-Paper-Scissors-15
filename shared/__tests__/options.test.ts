import { GAME_OPTIONS, isValidOption, getOptionIndex } from '../options';

describe('Game Options', () => {
  describe('GAME_OPTIONS', () => {
    test('should have exactly 15 options', () => {
      expect(GAME_OPTIONS).toHaveLength(15);
    });

    test('should contain all required options', () => {
      const expectedOptions = [
        'Rock', 'Gun', 'Lightning', 'Devil', 'Dragon',
        'Water', 'Air', 'Paper', 'Sponge', 'Wolf',
        'Tree', 'Human', 'Snake', 'Scissors', 'Fire'
      ];
      
      expect(GAME_OPTIONS).toEqual(expectedOptions);
    });

    test('should have unique options', () => {
      const uniqueOptions = new Set(GAME_OPTIONS);
      expect(uniqueOptions.size).toBe(15);
    });
  });

  describe('isValidOption', () => {
    test('should return true for valid options', () => {
      GAME_OPTIONS.forEach(option => {
        expect(isValidOption(option)).toBe(true);
      });
    });

    test('should return false for invalid options', () => {
      expect(isValidOption('InvalidOption')).toBe(false);
      expect(isValidOption('rock')).toBe(false); // case sensitive
      expect(isValidOption('')).toBe(false);
      expect(isValidOption('Stone')).toBe(false);
    });
  });

  describe('getOptionIndex', () => {
    test('should return correct index for each option', () => {
      expect(getOptionIndex('Rock')).toBe(0);
      expect(getOptionIndex('Gun')).toBe(1);
      expect(getOptionIndex('Lightning')).toBe(2);
      expect(getOptionIndex('Devil')).toBe(3);
      expect(getOptionIndex('Dragon')).toBe(4);
      expect(getOptionIndex('Water')).toBe(5);
      expect(getOptionIndex('Air')).toBe(6);
      expect(getOptionIndex('Paper')).toBe(7);
      expect(getOptionIndex('Sponge')).toBe(8);
      expect(getOptionIndex('Wolf')).toBe(9);
      expect(getOptionIndex('Tree')).toBe(10);
      expect(getOptionIndex('Human')).toBe(11);
      expect(getOptionIndex('Snake')).toBe(12);
      expect(getOptionIndex('Scissors')).toBe(13);
      expect(getOptionIndex('Fire')).toBe(14);
    });

    test('should return -1 for invalid options', () => {
      expect(getOptionIndex('InvalidOption' as any)).toBe(-1);
    });
  });
});
