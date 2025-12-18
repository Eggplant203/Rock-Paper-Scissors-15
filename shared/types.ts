import { GameOption } from './options';

export type GameResult = 'WIN' | 'LOSE' | 'DRAW';

export interface Player {
  socketId: string;
  nickname: string;
  score: number;
  winStreak: number;
  selectedOption: GameOption | null;
  isConfirmed: boolean;
  isReadyForNextRound?: boolean;
}

export interface Room {
  roomId: string;
  players: Player[];
  gameState: 'WAITING' | 'SELECTING' | 'COUNTDOWN' | 'RESULT' | 'NEXT_ROUND';
  roundNumber: number;
  createdAt: number;
}

export interface RoundResult {
  player1: {
    socketId: string;
    nickname: string;
    option: GameOption;
    result: GameResult;
    score: number;
    scoreGained: number;
    winStreak: number;
  };
  player2: {
    socketId: string;
    nickname: string;
    option: GameOption;
    result: GameResult;
    score: number;
    scoreGained: number;
    winStreak: number;
  };
  roundNumber: number;
}

export interface StickerMessage {
  senderSocketId: string;
  senderNickname: string;
  stickerPath: string;
  timestamp: number;
}

// Socket event types
export interface ServerToClientEvents {
  room_joined: (data: { roomId: string; player: Player; players: Player[] }) => void;
  player_update: (players: Player[]) => void;
  both_confirmed: () => void;
  countdown: (count: number) => void;
  round_result: (result: RoundResult) => void;
  score_update: (players: Player[]) => void;
  both_ready_next_round: () => void;
  opponent_left: () => void;
  sticker_message: (message: StickerMessage) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  create_room: (nickname: string, callback: (roomId: string) => void) => void;
  join_room: (data: { roomId: string; nickname: string }, callback: (success: boolean, error?: string) => void) => void;
  change_nickname: (nickname: string) => void;
  select_option: (option: GameOption) => void;
  confirm_selection: () => void;
  ready_for_next_round: () => void;
  send_sticker: (stickerPath: string) => void;
  leave_room: () => void;
}
