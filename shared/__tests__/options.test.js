"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("../options");
describe('Game Options', () => {
    describe('GAME_OPTIONS', () => {
        test('should have exactly 15 options', () => {
            expect(options_1.GAME_OPTIONS).toHaveLength(15);
        });
        test('should contain all required options', () => {
            const expectedOptions = [
                'Rock', 'Gun', 'Lightning', 'Devil', 'Dragon',
                'Water', 'Air', 'Paper', 'Sponge', 'Wolf',
                'Tree', 'Human', 'Snake', 'Scissors', 'Fire'
            ];
            expect(options_1.GAME_OPTIONS).toEqual(expectedOptions);
        });
        test('should have unique options', () => {
            const uniqueOptions = new Set(options_1.GAME_OPTIONS);
            expect(uniqueOptions.size).toBe(15);
        });
    });
    describe('isValidOption', () => {
        test('should return true for valid options', () => {
            options_1.GAME_OPTIONS.forEach(option => {
                expect((0, options_1.isValidOption)(option)).toBe(true);
            });
        });
        test('should return false for invalid options', () => {
            expect((0, options_1.isValidOption)('InvalidOption')).toBe(false);
            expect((0, options_1.isValidOption)('rock')).toBe(false); // case sensitive
            expect((0, options_1.isValidOption)('')).toBe(false);
            expect((0, options_1.isValidOption)('Stone')).toBe(false);
        });
    });
    describe('getOptionIndex', () => {
        test('should return correct index for each option', () => {
            expect((0, options_1.getOptionIndex)('Rock')).toBe(0);
            expect((0, options_1.getOptionIndex)('Gun')).toBe(1);
            expect((0, options_1.getOptionIndex)('Lightning')).toBe(2);
            expect((0, options_1.getOptionIndex)('Devil')).toBe(3);
            expect((0, options_1.getOptionIndex)('Dragon')).toBe(4);
            expect((0, options_1.getOptionIndex)('Water')).toBe(5);
            expect((0, options_1.getOptionIndex)('Air')).toBe(6);
            expect((0, options_1.getOptionIndex)('Paper')).toBe(7);
            expect((0, options_1.getOptionIndex)('Sponge')).toBe(8);
            expect((0, options_1.getOptionIndex)('Wolf')).toBe(9);
            expect((0, options_1.getOptionIndex)('Tree')).toBe(10);
            expect((0, options_1.getOptionIndex)('Human')).toBe(11);
            expect((0, options_1.getOptionIndex)('Snake')).toBe(12);
            expect((0, options_1.getOptionIndex)('Scissors')).toBe(13);
            expect((0, options_1.getOptionIndex)('Fire')).toBe(14);
        });
        test('should return -1 for invalid options', () => {
            expect((0, options_1.getOptionIndex)('InvalidOption')).toBe(-1);
        });
    });
});
//# sourceMappingURL=options.test.js.map