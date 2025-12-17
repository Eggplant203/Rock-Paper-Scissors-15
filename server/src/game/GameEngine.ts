import { determineWinner, calculateScoreGain, updateWinStreak } from '../../../shared/rules';
import { Room, RoundResult, Player } from '../../../shared/types';

export class GameEngine {
  calculateRoundResult(room: Room): RoundResult | null {
    if (room.players.length !== 2) return null;
    
    const [player1, player2] = room.players;
    
    if (!player1.selectedOption || !player2.selectedOption) return null;
    
    // Determine results for both players
    const player1Result = determineWinner(player1.selectedOption, player2.selectedOption);
    const player2Result = determineWinner(player2.selectedOption, player1.selectedOption);
    
    // Update win streaks
    const newWinStreak1 = updateWinStreak(player1Result, player1.winStreak);
    const newWinStreak2 = updateWinStreak(player2Result, player2.winStreak);
    
    // Calculate score gains
    const scoreGain1 = calculateScoreGain(player1Result, player1.winStreak);
    const scoreGain2 = calculateScoreGain(player2Result, player2.winStreak);
    
    // Update player stats
    player1.score += scoreGain1;
    player1.winStreak = newWinStreak1;
    
    player2.score += scoreGain2;
    player2.winStreak = newWinStreak2;
    
    const result: RoundResult = {
      player1: {
        socketId: player1.socketId,
        nickname: player1.nickname,
        option: player1.selectedOption,
        result: player1Result,
        score: player1.score,
        scoreGained: scoreGain1,
        winStreak: player1.winStreak,
      },
      player2: {
        socketId: player2.socketId,
        nickname: player2.nickname,
        option: player2.selectedOption,
        result: player2Result,
        score: player2.score,
        scoreGained: scoreGain2,
        winStreak: player2.winStreak,
      },
      roundNumber: room.roundNumber,
    };
    
    return result;
  }
}
