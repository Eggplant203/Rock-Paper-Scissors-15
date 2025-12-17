import { GameOption } from './options';
import { GameResult } from './types';
/**
 * Determines the result of a round between two options
 * Each option beats the next 7 options in circular order
 *
 * @param playerOption - The option chosen by the player
 * @param opponentOption - The option chosen by the opponent
 * @returns 'WIN' if player wins, 'LOSE' if player loses, 'DRAW' if tie
 */
export declare function determineWinner(playerOption: GameOption, opponentOption: GameOption): GameResult;
/**
 * Calculates score gained based on win streak
 * Win streak >= 5: +3
 * Win streak >= 3: +2
 * Regular win: +1
 * Lose/Draw: +0
 */
export declare function calculateScoreGain(result: GameResult, currentWinStreak: number): number;
/**
 * Updates win streak based on result
 * Win: increment
 * Lose: reset to 0
 * Draw: keep current
 */
export declare function updateWinStreak(result: GameResult, currentWinStreak: number): number;
//# sourceMappingURL=rules.d.ts.map