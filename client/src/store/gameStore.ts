import { create } from 'zustand';
import { Player, RoundResult } from '../../../shared/types';
import { GameOption } from '../../../shared/options';

export type GameState = 'MENU' | 'LOBBY' | 'SELECTING' | 'WAITING' | 'COUNTDOWN' | 'RESULT';

interface GameStore {
  // Connection state
  isConnected: boolean;
  setConnected: (connected: boolean) => void;

  // Room state
  roomId: string | null;
  setRoomId: (roomId: string | null) => void;

  // Player state
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;

  opponent: Player | null;
  setOpponent: (opponent: Player | null) => void;

  // Game state
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // Selection state
  selectedOption: GameOption | null;
  setSelectedOption: (option: GameOption | null) => void;

  isConfirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;

  // Round state
  roundNumber: number;
  setRoundNumber: (round: number) => void;

  countdownValue: number | null;
  setCountdownValue: (value: number | null) => void;

  roundResult: RoundResult | null;
  setRoundResult: (result: RoundResult | null) => void;

  // UI state
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;

  // Actions
  updatePlayers: (players: Player[]) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  isConnected: false,
  roomId: null,
  currentPlayer: null,
  opponent: null,
  gameState: 'MENU',
  selectedOption: null,
  isConfirmed: false,
  roundNumber: 1,
  countdownValue: null,
  roundResult: null,
  errorMessage: null,

  // Setters
  setConnected: (connected) => set({ isConnected: connected }),
  setRoomId: (roomId) => set({ roomId }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setOpponent: (opponent) => set({ opponent }),
  setGameState: (state) => set({ gameState: state }),
  setSelectedOption: (option) => set({ selectedOption: option }),
  setConfirmed: (confirmed) => set({ isConfirmed: confirmed }),
  setRoundNumber: (round) => set({ roundNumber: round }),
  setCountdownValue: (value) => set({ countdownValue: value }),
  setRoundResult: (result) => set({ roundResult: result }),
  setErrorMessage: (message) => set({ errorMessage: message }),

  // Complex actions
  updatePlayers: (players) => {
    const currentPlayerId = get().currentPlayer?.socketId;
    if (!currentPlayerId) return;

    const current = players.find(p => p.socketId === currentPlayerId);
    const opp = players.find(p => p.socketId !== currentPlayerId);

    if (current) set({ currentPlayer: current });
    // Always update opponent, even if undefined (when opponent leaves)
    set({ opponent: opp || null });
  },

  resetGame: () => set({
    roomId: null,
    currentPlayer: null,
    opponent: null,
    gameState: 'MENU',
    selectedOption: null,
    isConfirmed: false,
    roundNumber: 1,
    countdownValue: null,
    roundResult: null,
    errorMessage: null,
  }),
}));
