"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rules_1 = require("../rules");
describe('Game Rules', () => {
    describe('determineWinner', () => {
        test('should return DRAW when both players choose the same option', () => {
            expect((0, rules_1.determineWinner)('Rock', 'Rock')).toBe('DRAW');
            expect((0, rules_1.determineWinner)('Gun', 'Gun')).toBe('DRAW');
            expect((0, rules_1.determineWinner)('Fire', 'Fire')).toBe('DRAW');
        });
        test('Rock should beat correct 7 options', () => {
            // Rock beats: Fire, Scissors, Snake, Human, Tree, Wolf, Sponge
            expect((0, rules_1.determineWinner)('Rock', 'Fire')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Rock', 'Scissors')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Rock', 'Snake')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Rock', 'Human')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Rock', 'Tree')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Rock', 'Wolf')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Rock', 'Sponge')).toBe('WIN');
        });
        test('Rock should lose to correct 7 options', () => {
            // Rock loses to: Gun, Lightning, Devil, Dragon, Water, Air, Paper
            expect((0, rules_1.determineWinner)('Rock', 'Gun')).toBe('LOSE');
            expect((0, rules_1.determineWinner)('Rock', 'Lightning')).toBe('LOSE');
            expect((0, rules_1.determineWinner)('Rock', 'Devil')).toBe('LOSE');
            expect((0, rules_1.determineWinner)('Rock', 'Dragon')).toBe('LOSE');
            expect((0, rules_1.determineWinner)('Rock', 'Water')).toBe('LOSE');
            expect((0, rules_1.determineWinner)('Rock', 'Air')).toBe('LOSE');
            expect((0, rules_1.determineWinner)('Rock', 'Paper')).toBe('LOSE');
        });
        test('Gun should beat correct 7 options', () => {
            // Gun beats: Rock, Fire, Scissors, Snake, Human, Tree, Wolf
            expect((0, rules_1.determineWinner)('Gun', 'Rock')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Gun', 'Fire')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Gun', 'Scissors')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Gun', 'Snake')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Gun', 'Human')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Gun', 'Tree')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Gun', 'Wolf')).toBe('WIN');
        });
        test('Paper should beat correct 7 options', () => {
            // Paper beats: Air, Water, Dragon, Devil, Lightning, Gun, Rock
            expect((0, rules_1.determineWinner)('Paper', 'Air')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Paper', 'Water')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Paper', 'Dragon')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Paper', 'Devil')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Paper', 'Lightning')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Paper', 'Gun')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Paper', 'Rock')).toBe('WIN');
        });
        test('Fire should beat correct 7 options', () => {
            // Fire beats: Scissors, Snake, Human, Tree, Wolf, Sponge, Paper
            expect((0, rules_1.determineWinner)('Fire', 'Scissors')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Fire', 'Snake')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Fire', 'Human')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Fire', 'Tree')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Fire', 'Wolf')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Fire', 'Sponge')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Fire', 'Paper')).toBe('WIN');
        });
        test('Scissors should beat correct 7 options', () => {
            // Scissors beats: Snake, Human, Tree, Wolf, Sponge, Paper, Air
            expect((0, rules_1.determineWinner)('Scissors', 'Snake')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Scissors', 'Human')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Scissors', 'Tree')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Scissors', 'Wolf')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Scissors', 'Sponge')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Scissors', 'Paper')).toBe('WIN');
            expect((0, rules_1.determineWinner)('Scissors', 'Air')).toBe('WIN');
        });
        test('should be consistent with reverse logic', () => {
            // If A beats B, then B should lose to A
            const optionA = 'Rock';
            const optionB = 'Fire';
            const resultA = (0, rules_1.determineWinner)(optionA, optionB);
            const resultB = (0, rules_1.determineWinner)(optionB, optionA);
            if (resultA === 'WIN') {
                expect(resultB).toBe('LOSE');
            }
            else if (resultA === 'LOSE') {
                expect(resultB).toBe('WIN');
            }
            else {
                expect(resultB).toBe('DRAW');
            }
        });
    });
    describe('calculateScoreGain', () => {
        test('should return 0 for LOSE', () => {
            expect((0, rules_1.calculateScoreGain)('LOSE', 0)).toBe(0);
            expect((0, rules_1.calculateScoreGain)('LOSE', 5)).toBe(0);
            expect((0, rules_1.calculateScoreGain)('LOSE', 10)).toBe(0);
        });
        test('should return 0 for DRAW', () => {
            expect((0, rules_1.calculateScoreGain)('DRAW', 0)).toBe(0);
            expect((0, rules_1.calculateScoreGain)('DRAW', 3)).toBe(0);
            expect((0, rules_1.calculateScoreGain)('DRAW', 5)).toBe(0);
        });
        test('should return 1 for WIN with streak < 3', () => {
            expect((0, rules_1.calculateScoreGain)('WIN', 0)).toBe(1);
            expect((0, rules_1.calculateScoreGain)('WIN', 1)).toBe(1);
            expect((0, rules_1.calculateScoreGain)('WIN', 2)).toBe(1);
        });
        test('should return 2 for WIN with streak >= 3 and < 5', () => {
            expect((0, rules_1.calculateScoreGain)('WIN', 3)).toBe(2);
            expect((0, rules_1.calculateScoreGain)('WIN', 4)).toBe(2);
        });
        test('should return 3 for WIN with streak >= 5', () => {
            expect((0, rules_1.calculateScoreGain)('WIN', 5)).toBe(3);
            expect((0, rules_1.calculateScoreGain)('WIN', 6)).toBe(3);
            expect((0, rules_1.calculateScoreGain)('WIN', 10)).toBe(3);
        });
    });
    describe('updateWinStreak', () => {
        test('should increment streak on WIN', () => {
            expect((0, rules_1.updateWinStreak)('WIN', 0)).toBe(1);
            expect((0, rules_1.updateWinStreak)('WIN', 1)).toBe(2);
            expect((0, rules_1.updateWinStreak)('WIN', 5)).toBe(6);
        });
        test('should reset streak to 0 on LOSE', () => {
            expect((0, rules_1.updateWinStreak)('LOSE', 0)).toBe(0);
            expect((0, rules_1.updateWinStreak)('LOSE', 3)).toBe(0);
            expect((0, rules_1.updateWinStreak)('LOSE', 10)).toBe(0);
        });
        test('should keep streak unchanged on DRAW', () => {
            expect((0, rules_1.updateWinStreak)('DRAW', 0)).toBe(0);
            expect((0, rules_1.updateWinStreak)('DRAW', 3)).toBe(3);
            expect((0, rules_1.updateWinStreak)('DRAW', 5)).toBe(5);
        });
    });
    describe('Complete game scenarios', () => {
        test('should handle a complete winning streak', () => {
            let streak = 0;
            let totalScore = 0;
            // Win 1 (streak 0 -> 1): +1
            const gain1 = (0, rules_1.calculateScoreGain)('WIN', streak);
            streak = (0, rules_1.updateWinStreak)('WIN', streak);
            totalScore += gain1;
            expect(totalScore).toBe(1);
            expect(streak).toBe(1);
            // Win 2 (streak 1 -> 2): +1
            const gain2 = (0, rules_1.calculateScoreGain)('WIN', streak);
            streak = (0, rules_1.updateWinStreak)('WIN', streak);
            totalScore += gain2;
            expect(totalScore).toBe(2);
            expect(streak).toBe(2);
            // Win 3 (streak 2 -> 3): +1
            const gain3 = (0, rules_1.calculateScoreGain)('WIN', streak);
            streak = (0, rules_1.updateWinStreak)('WIN', streak);
            totalScore += gain3;
            expect(totalScore).toBe(3);
            expect(streak).toBe(3);
            // Win 4 (streak 3 -> 4): +2 (streak bonus starts)
            const gain4 = (0, rules_1.calculateScoreGain)('WIN', streak);
            streak = (0, rules_1.updateWinStreak)('WIN', streak);
            totalScore += gain4;
            expect(totalScore).toBe(5);
            expect(streak).toBe(4);
            // Win 5 (streak 4 -> 5): +2
            const gain5 = (0, rules_1.calculateScoreGain)('WIN', streak);
            streak = (0, rules_1.updateWinStreak)('WIN', streak);
            totalScore += gain5;
            expect(totalScore).toBe(7);
            expect(streak).toBe(5);
            // Win 6 (streak 5 -> 6): +3 (max bonus)
            const gain6 = (0, rules_1.calculateScoreGain)('WIN', streak);
            streak = (0, rules_1.updateWinStreak)('WIN', streak);
            totalScore += gain6;
            expect(totalScore).toBe(10);
            expect(streak).toBe(6);
        });
        test('should handle streak break', () => {
            let streak = 5;
            let totalScore = 10;
            // Lose - streak resets
            const loseGain = (0, rules_1.calculateScoreGain)('LOSE', streak);
            streak = (0, rules_1.updateWinStreak)('LOSE', streak);
            totalScore += loseGain;
            expect(totalScore).toBe(10); // No points gained
            expect(streak).toBe(0); // Streak reset
            // Win again - back to +1
            const winGain = (0, rules_1.calculateScoreGain)('WIN', streak);
            streak = (0, rules_1.updateWinStreak)('WIN', streak);
            totalScore += winGain;
            expect(totalScore).toBe(11);
            expect(streak).toBe(1);
        });
        test('should handle draw without breaking streak', () => {
            let streak = 3;
            const drawGain = (0, rules_1.calculateScoreGain)('DRAW', streak);
            const newStreak = (0, rules_1.updateWinStreak)('DRAW', streak);
            expect(drawGain).toBe(0);
            expect(newStreak).toBe(3); // Streak maintained
        });
    });
});
//# sourceMappingURL=rules.test.js.map