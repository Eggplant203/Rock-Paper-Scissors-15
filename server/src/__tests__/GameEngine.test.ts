import { GameEngine } from '../game/GameEngine';
import { Room, Player } from '../../../shared/types';

describe('GameEngine', () => {
  let gameEngine: GameEngine;

  beforeEach(() => {
    gameEngine = new GameEngine();
  });

  describe('calculateRoundResult', () => {
    test('should return null when room has less than 2 players', () => {
      const room: Room = {
        roomId: 'TEST01',
        players: [{
          socketId: 'socket1',
          nickname: 'Player1',
          score: 0,
          winStreak: 0,
          selectedOption: 'Rock',
          isConfirmed: true,
        }],
        gameState: 'SELECTING',
        roundNumber: 1,
        createdAt: Date.now(),
      };

      const result = gameEngine.calculateRoundResult(room);
      expect(result).toBeNull();
    });

    test('should return null when player1 has no selection', () => {
      const room: Room = {
        roomId: 'TEST02',
        players: [
          {
            socketId: 'socket1',
            nickname: 'Player1',
            score: 0,
            winStreak: 0,
            selectedOption: null,
            isConfirmed: false,
          },
          {
            socketId: 'socket2',
            nickname: 'Player2',
            score: 0,
            winStreak: 0,
            selectedOption: 'Paper',
            isConfirmed: true,
          }
        ],
        gameState: 'SELECTING',
        roundNumber: 1,
        createdAt: Date.now(),
      };

      const result = gameEngine.calculateRoundResult(room);
      expect(result).toBeNull();
    });

    test('should calculate correct result when Rock vs Paper', () => {
      const room: Room = {
        roomId: 'TEST03',
        players: [
          {
            socketId: 'socket1',
            nickname: 'Player1',
            score: 0,
            winStreak: 0,
            selectedOption: 'Rock',
            isConfirmed: true,
          },
          {
            socketId: 'socket2',
            nickname: 'Player2',
            score: 0,
            winStreak: 0,
            selectedOption: 'Paper',
            isConfirmed: true,
          }
        ],
        gameState: 'COUNTDOWN',
        roundNumber: 1,
        createdAt: Date.now(),
      };

      const result = gameEngine.calculateRoundResult(room);
      
      expect(result).not.toBeNull();
      expect(result?.player1.result).toBe('LOSE');
      expect(result?.player2.result).toBe('WIN');
      expect(result?.player1.score).toBe(0);
      expect(result?.player2.score).toBe(1);
      expect(result?.player2.scoreGained).toBe(1);
    });

    test('should handle draw correctly', () => {
      const room: Room = {
        roomId: 'TEST04',
        players: [
          {
            socketId: 'socket1',
            nickname: 'Player1',
            score: 5,
            winStreak: 2,
            selectedOption: 'Rock',
            isConfirmed: true,
          },
          {
            socketId: 'socket2',
            nickname: 'Player2',
            score: 3,
            winStreak: 1,
            selectedOption: 'Rock',
            isConfirmed: true,
          }
        ],
        gameState: 'COUNTDOWN',
        roundNumber: 3,
        createdAt: Date.now(),
      };

      const result = gameEngine.calculateRoundResult(room);
      
      expect(result?.player1.result).toBe('DRAW');
      expect(result?.player2.result).toBe('DRAW');
      expect(result?.player1.scoreGained).toBe(0);
      expect(result?.player2.scoreGained).toBe(0);
      expect(result?.player1.winStreak).toBe(2); // Maintained
      expect(result?.player2.winStreak).toBe(1); // Maintained
    });

    test('should calculate win streak bonus correctly', () => {
      const room: Room = {
        roomId: 'TEST05',
        players: [
          {
            socketId: 'socket1',
            nickname: 'Player1',
            score: 10,
            winStreak: 5,
            selectedOption: 'Rock',
            isConfirmed: true,
          },
          {
            socketId: 'socket2',
            nickname: 'Player2',
            score: 2,
            winStreak: 0,
            selectedOption: 'Fire',
            isConfirmed: true,
          }
        ],
        gameState: 'COUNTDOWN',
        roundNumber: 6,
        createdAt: Date.now(),
      };

      const result = gameEngine.calculateRoundResult(room);
      
      // Player1 (Rock) beats Fire, with streak 5 -> should get 3 points
      expect(result?.player1.result).toBe('WIN');
      expect(result?.player1.scoreGained).toBe(3); // Streak >= 5 bonus
      expect(result?.player1.score).toBe(13);
      expect(result?.player1.winStreak).toBe(6);
      
      // Player2 loses
      expect(result?.player2.result).toBe('LOSE');
      expect(result?.player2.scoreGained).toBe(0);
      expect(result?.player2.winStreak).toBe(0); // Reset
    });

    test('should reset win streak on loss', () => {
      const room: Room = {
        roomId: 'TEST06',
        players: [
          {
            socketId: 'socket1',
            nickname: 'Player1',
            score: 15,
            winStreak: 10,
            selectedOption: 'Rock',
            isConfirmed: true,
          },
          {
            socketId: 'socket2',
            nickname: 'Player2',
            score: 8,
            winStreak: 2,
            selectedOption: 'Paper',
            isConfirmed: true,
          }
        ],
        gameState: 'COUNTDOWN',
        roundNumber: 12,
        createdAt: Date.now(),
      };

      const result = gameEngine.calculateRoundResult(room);
      
      // Player1 loses, streak should reset
      expect(result?.player1.result).toBe('LOSE');
      expect(result?.player1.winStreak).toBe(0);
      
      // Player2 wins with streak 2, should get +1
      expect(result?.player2.result).toBe('WIN');
      expect(result?.player2.scoreGained).toBe(1);
      expect(result?.player2.winStreak).toBe(3);
    });

    test('should update player stats in the room', () => {
      const room: Room = {
        roomId: 'TEST07',
        players: [
          {
            socketId: 'socket1',
            nickname: 'Player1',
            score: 0,
            winStreak: 0,
            selectedOption: 'Gun',
            isConfirmed: true,
          },
          {
            socketId: 'socket2',
            nickname: 'Player2',
            score: 0,
            winStreak: 0,
            selectedOption: 'Rock',
            isConfirmed: true,
          }
        ],
        gameState: 'COUNTDOWN',
        roundNumber: 1,
        createdAt: Date.now(),
      };

      const result = gameEngine.calculateRoundResult(room);
      
      // Gun beats Rock
      expect(room.players[0].score).toBe(1);
      expect(room.players[0].winStreak).toBe(1);
      expect(room.players[1].score).toBe(0);
      expect(room.players[1].winStreak).toBe(0);
    });

    test('should handle all 15 options correctly', () => {
      const testCases = [
        { p1: 'Rock', p2: 'Fire', p1Result: 'WIN' },
        { p1: 'Gun', p2: 'Rock', p1Result: 'WIN' },
        { p1: 'Lightning', p2: 'Gun', p1Result: 'WIN' },
        { p1: 'Devil', p2: 'Lightning', p1Result: 'WIN' },
        { p1: 'Dragon', p2: 'Devil', p1Result: 'WIN' },
        { p1: 'Water', p2: 'Dragon', p1Result: 'WIN' },
        { p1: 'Air', p2: 'Water', p1Result: 'WIN' },
        { p1: 'Paper', p2: 'Air', p1Result: 'WIN' },
        { p1: 'Sponge', p2: 'Paper', p1Result: 'WIN' },
        { p1: 'Wolf', p2: 'Sponge', p1Result: 'WIN' },
        { p1: 'Tree', p2: 'Wolf', p1Result: 'WIN' },
        { p1: 'Human', p2: 'Tree', p1Result: 'WIN' },
        { p1: 'Snake', p2: 'Human', p1Result: 'WIN' },
        { p1: 'Scissors', p2: 'Snake', p1Result: 'WIN' },
        { p1: 'Fire', p2: 'Scissors', p1Result: 'WIN' },
      ];

      testCases.forEach(({ p1, p2, p1Result }) => {
        const room: Room = {
          roomId: 'TEST',
          players: [
            {
              socketId: 'socket1',
              nickname: 'Player1',
              score: 0,
              winStreak: 0,
              selectedOption: p1 as any,
              isConfirmed: true,
            },
            {
              socketId: 'socket2',
              nickname: 'Player2',
              score: 0,
              winStreak: 0,
              selectedOption: p2 as any,
              isConfirmed: true,
            }
          ],
          gameState: 'COUNTDOWN',
          roundNumber: 1,
          createdAt: Date.now(),
        };

        const result = gameEngine.calculateRoundResult(room);
        expect(result?.player1.result).toBe(p1Result);
      });
    });
  });
});
