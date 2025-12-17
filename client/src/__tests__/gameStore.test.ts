import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameStore } from '../store/gameStore';
import { GAME_OPTIONS } from '../../../shared/options';

describe('GameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { resetGame } = useGameStore.getState();
    resetGame();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useGameStore());
      
      expect(result.current.isConnected).toBe(false);
      expect(result.current.roomId).toBeNull();
      expect(result.current.currentPlayer).toBeNull();
      expect(result.current.opponent).toBeNull();
      expect(result.current.gameState).toBe('MENU');
      expect(result.current.selectedOption).toBeNull();
      expect(result.current.isConfirmed).toBe(false);
      expect(result.current.countdownValue).toBeNull();
      expect(result.current.roundResult).toBeNull();
      expect(result.current.errorMessage).toBeNull();
    });
  });

  describe('Connection State', () => {
    it('should update connection state', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setConnected(true);
      });
      
      expect(result.current.isConnected).toBe(true);
    });
  });

  describe('Room State', () => {
    it('should set room ID', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setRoomId('TEST01');
      });
      
      expect(result.current.roomId).toBe('TEST01');
    });

    it('should clear room ID', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setRoomId('TEST01');
        result.current.setRoomId(null);
      });
      
      expect(result.current.roomId).toBeNull();
    });
  });

  describe('Player State', () => {
    it('should set current player', () => {
      const { result } = renderHook(() => useGameStore());
      
      const player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };
      
      act(() => {
        result.current.setCurrentPlayer(player);
      });
      
      expect(result.current.currentPlayer).toEqual(player);
    });

    it('should set opponent', () => {
      const { result } = renderHook(() => useGameStore());
      
      const opponent = {
        socketId: 'socket2',
        nickname: 'Opponent',
        score: 5,
        winStreak: 2,
        selectedOption: null,
        isConfirmed: false,
      };
      
      act(() => {
        result.current.setOpponent(opponent);
      });
      
      expect(result.current.opponent).toEqual(opponent);
    });
  });

  describe('Game State', () => {
    it('should update game state', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setGameState('LOBBY');
      });
      
      expect(result.current.gameState).toBe('LOBBY');
      
      act(() => {
        result.current.setGameState('SELECTING');
      });
      
      expect(result.current.gameState).toBe('SELECTING');
    });
  });

  describe('Selection State', () => {
    it('should set selected option', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setSelectedOption('Rock');
      });
      
      expect(result.current.selectedOption).toBe('Rock');
    });

    it('should change selected option', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setSelectedOption('Rock');
        result.current.setSelectedOption('Paper');
      });
      
      expect(result.current.selectedOption).toBe('Paper');
    });

    it('should set confirmed state', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setConfirmed(true);
      });
      
      expect(result.current.isConfirmed).toBe(true);
    });
  });

  describe('Countdown State', () => {
    it('should set countdown value', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setCountdownValue(3);
      });
      
      expect(result.current.countdownValue).toBe(3);
    });

    it('should clear countdown value', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setCountdownValue(3);
        result.current.setCountdownValue(null);
      });
      
      expect(result.current.countdownValue).toBeNull();
    });
  });

  describe('Round Result State', () => {
    it('should set round result', () => {
      const { result } = renderHook(() => useGameStore());
      
      const roundResult = {
        player1: {
          socketId: 'socket1',
          nickname: 'Player1',
          option: 'Rock' as any,
          result: 'WIN' as const,
          score: 1,
          scoreGained: 1,
          winStreak: 1,
        },
        player2: {
          socketId: 'socket2',
          nickname: 'Player2',
          option: 'Scissors' as any,
          result: 'LOSE' as const,
          score: 0,
          scoreGained: 0,
          winStreak: 0,
        },
        roundNumber: 1,
      };
      
      act(() => {
        result.current.setRoundResult(roundResult);
      });
      
      expect(result.current.roundResult).toEqual(roundResult);
    });
  });

  describe('Error Message State', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setErrorMessage('Test error');
      });
      
      expect(result.current.errorMessage).toBe('Test error');
    });

    it('should clear error message', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setErrorMessage('Test error');
        result.current.setErrorMessage(null);
      });
      
      expect(result.current.errorMessage).toBeNull();
    });
  });

  describe('Update Players', () => {
    it('should update current player and opponent from players array', () => {
      const { result } = renderHook(() => useGameStore());
      
      // Set current player first
      const currentPlayer = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };
      
      act(() => {
        result.current.setCurrentPlayer(currentPlayer);
      });
      
      // Update players
      const players = [
        {
          socketId: 'socket1',
          nickname: 'Player1',
          score: 5,
          winStreak: 2,
          selectedOption: 'Rock' as any,
          isConfirmed: true,
        },
        {
          socketId: 'socket2',
          nickname: 'Player2',
          score: 3,
          winStreak: 1,
          selectedOption: 'Paper' as any,
          isConfirmed: false,
        },
      ];
      
      act(() => {
        result.current.updatePlayers(players);
      });
      
      expect(result.current.currentPlayer?.score).toBe(5);
      expect(result.current.currentPlayer?.winStreak).toBe(2);
      expect(result.current.opponent?.socketId).toBe('socket2');
      expect(result.current.opponent?.score).toBe(3);
    });

    it('should handle opponent leaving', () => {
      const { result } = renderHook(() => useGameStore());
      
      const currentPlayer = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 5,
        winStreak: 2,
        selectedOption: null,
        isConfirmed: false,
      };
      
      act(() => {
        result.current.setCurrentPlayer(currentPlayer);
        result.current.setOpponent({
          socketId: 'socket2',
          nickname: 'Player2',
          score: 3,
          winStreak: 1,
          selectedOption: null,
          isConfirmed: false,
        });
      });
      
      // Update with only current player
      act(() => {
        result.current.updatePlayers([currentPlayer]);
      });
      
      expect(result.current.opponent).toBeNull();
    });
  });

  describe('Reset Game', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useGameStore());
      
      // Set various states
      act(() => {
        result.current.setRoomId('TEST01');
        result.current.setCurrentPlayer({
          socketId: 'socket1',
          nickname: 'TestPlayer',
          score: 10,
          winStreak: 3,
          selectedOption: 'Rock',
          isConfirmed: true,
        });
        result.current.setGameState('SELECTING');
        result.current.setSelectedOption('Rock');
        result.current.setConfirmed(true);
      });
      
      // Reset
      act(() => {
        result.current.resetGame();
      });
      
      // Verify reset
      expect(result.current.roomId).toBeNull();
      expect(result.current.currentPlayer).toBeNull();
      expect(result.current.opponent).toBeNull();
      expect(result.current.gameState).toBe('MENU');
      expect(result.current.selectedOption).toBeNull();
      expect(result.current.isConfirmed).toBe(false);
      expect(result.current.countdownValue).toBeNull();
      expect(result.current.roundResult).toBeNull();
      expect(result.current.errorMessage).toBeNull();
    });
  });
});
