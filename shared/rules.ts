import { GameOption, getOptionIndex } from './options';
import { GameResult } from './types';

/**
 * Determines the result of a round between two options
 * Each option beats the next 7 options in circular order
 * 
 * @param playerOption - The option chosen by the player
 * @param opponentOption - The option chosen by the opponent
 * @returns 'WIN' if player wins, 'LOSE' if player loses, 'DRAW' if tie
 */
export function determineWinner(
  playerOption: GameOption,
  opponentOption: GameOption
): GameResult {
  if (playerOption === opponentOption) {
    return 'DRAW';
  }

  const playerIndex = getOptionIndex(playerOption);
  const opponentIndex = getOptionIndex(opponentOption);
  
  // Calculate circular distance from player to opponent
  // Each option beats the NEXT 7 options clockwise (circular)
  const distance = (opponentIndex - playerIndex + 15) % 15;
  
  // If opponent is in positions 8-14 after player (clockwise), player wins
  // Because player beats the 7 options BEFORE player (counter-clockwise)
  // which are the last 7 positions in circular order
  if (distance >= 8 && distance <= 14) {
    return 'WIN';
  } else {
    return 'LOSE';
  }
}

/**
 * Calculates score gained based on win streak
 * Win streak >= 5: +3
 * Win streak >= 3: +2
 * Regular win: +1
 * Lose/Draw: +0
 */
export function calculateScoreGain(result: GameResult, currentWinStreak: number): number {
  if (result !== 'WIN') {
    return 0;
  }

  if (currentWinStreak >= 5) {
    return 3;
  } else if (currentWinStreak >= 3) {
    return 2;
  } else {
    return 1;
  }
}

/**
 * Updates win streak based on result
 * Win: increment
 * Lose: reset to 0
 * Draw: keep current
 */
export function updateWinStreak(result: GameResult, currentWinStreak: number): number {
  if (result === 'WIN') {
    return currentWinStreak + 1;
  } else if (result === 'LOSE') {
    return 0;
  } else {
    return currentWinStreak;
  }
}
