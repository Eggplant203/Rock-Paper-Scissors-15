import { RoomManager } from '../rooms/RoomManager';
import { Player } from '../../../shared/types';
import { GameOption } from '../../../shared/options';

describe('RoomManager', () => {
  let roomManager: RoomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  describe('generateRoomId', () => {
    test('should generate a 6-character room ID', () => {
      const roomId = roomManager.generateRoomId();
      expect(roomId).toHaveLength(6);
    });

    test('should generate unique room IDs', () => {
      const roomIds = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const roomId = roomManager.generateRoomId();
        roomIds.add(roomId);
      }
      expect(roomIds.size).toBeGreaterThan(90); // Should be mostly unique
    });

    test('should only contain alphanumeric characters', () => {
      const roomId = roomManager.generateRoomId();
      expect(roomId).toMatch(/^[A-Z0-9]{6}$/);
    });
  });

  describe('createRoom', () => {
    test('should create a new room with a player', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST01';
      const room = roomManager.createRoom(roomId, player);

      expect(room).toBeDefined();
      expect(room.roomId).toBe(roomId);
      expect(room.players).toHaveLength(1);
      expect(room.players[0]).toBe(player);
      expect(room.gameState).toBe('WAITING');
      expect(room.roundNumber).toBe(0);
    });

    test('should store the room in the manager', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST02';
      roomManager.createRoom(roomId, player);
      
      const retrievedRoom = roomManager.getRoom(roomId);
      expect(retrievedRoom).toBeDefined();
      expect(retrievedRoom?.roomId).toBe(roomId);
    });
  });

  describe('getRoom', () => {
    test('should return undefined for non-existent room', () => {
      const room = roomManager.getRoom('NONEXIST');
      expect(room).toBeUndefined();
    });

    test('should return the correct room', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST03';
      roomManager.createRoom(roomId, player);
      
      const room = roomManager.getRoom(roomId);
      expect(room?.roomId).toBe(roomId);
    });
  });

  describe('joinRoom', () => {
    test('should return null for non-existent room', () => {
      const player: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const result = roomManager.joinRoom('NONEXIST', player);
      expect(result).toBeNull();
    });

    test('should allow second player to join', () => {
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const player2: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST04';
      roomManager.createRoom(roomId, player1);
      const room = roomManager.joinRoom(roomId, player2);

      expect(room).not.toBeNull();
      expect(room?.players).toHaveLength(2);
      expect(room?.players[1]).toBe(player2);
    });

    test('should change game state to SELECTING when second player joins', () => {
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const player2: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST05';
      roomManager.createRoom(roomId, player1);
      const room = roomManager.joinRoom(roomId, player2);

      expect(room?.gameState).toBe('SELECTING');
      expect(room?.roundNumber).toBe(1);
    });

    test('should not allow third player to join', () => {
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const player2: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const player3: Player = {
        socketId: 'socket3',
        nickname: 'Player3',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST06';
      roomManager.createRoom(roomId, player1);
      roomManager.joinRoom(roomId, player2);
      const result = roomManager.joinRoom(roomId, player3);

      expect(result).toBeNull();
    });
  });

  describe('removePlayerFromRoom', () => {
    test('should remove player from room', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST07';
      roomManager.createRoom(roomId, player);
      
      const room = roomManager.removePlayerFromRoom('socket1');
      expect(room).not.toBeNull();
    });

    test('should delete room when last player leaves', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST08';
      roomManager.createRoom(roomId, player);
      roomManager.removePlayerFromRoom('socket1');
      
      const room = roomManager.getRoom(roomId);
      expect(room).toBeUndefined();
    });

    test('should reset room state when one player leaves', () => {
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const player2: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: 'Rock',
        isConfirmed: true,
      };

      const roomId = 'TEST09';
      roomManager.createRoom(roomId, player1);
      roomManager.joinRoom(roomId, player2);
      
      roomManager.removePlayerFromRoom('socket2');
      
      const room = roomManager.getRoom(roomId);
      expect(room?.gameState).toBe('WAITING');
      expect(room?.players[0].isConfirmed).toBe(false);
      expect(room?.players[0].selectedOption).toBeNull();
    });
  });

  describe('updatePlayerNickname', () => {
    test('should update player nickname', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'OldName',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST10';
      roomManager.createRoom(roomId, player);
      
      const result = roomManager.updatePlayerNickname('socket1', 'NewName');
      expect(result).toBe(true);
      
      const room = roomManager.getRoom(roomId);
      expect(room?.players[0].nickname).toBe('NewName');
    });

    test('should return false for non-existent player', () => {
      const result = roomManager.updatePlayerNickname('nonexistent', 'NewName');
      expect(result).toBe(false);
    });
  });

  describe('updatePlayerSelection', () => {
    test('should update player selection', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST11';
      roomManager.createRoom(roomId, player);
      
      const result = roomManager.updatePlayerSelection('socket1', 'Rock');
      expect(result).toBe(true);
      
      const room = roomManager.getRoom(roomId);
      expect(room?.players[0].selectedOption).toBe('Rock');
      expect(room?.players[0].isConfirmed).toBe(false);
    });
  });

  describe('confirmPlayerSelection', () => {
    test('should confirm player selection', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: 'Rock',
        isConfirmed: false,
      };

      const roomId = 'TEST12';
      roomManager.createRoom(roomId, player);
      
      const result = roomManager.confirmPlayerSelection('socket1');
      expect(result).toBe(true);
      
      const room = roomManager.getRoom(roomId);
      expect(room?.players[0].isConfirmed).toBe(true);
    });

    test('should return false if no option selected', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST13';
      roomManager.createRoom(roomId, player);
      
      const result = roomManager.confirmPlayerSelection('socket1');
      expect(result).toBe(false);
    });
  });

  describe('areBothPlayersConfirmed', () => {
    test('should return true when both players confirmed', () => {
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: 'Rock',
        isConfirmed: true,
      };

      const player2: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: 'Paper',
        isConfirmed: true,
      };

      const roomId = 'TEST14';
      roomManager.createRoom(roomId, player1);
      roomManager.joinRoom(roomId, player2);
      
      const result = roomManager.areBothPlayersConfirmed(roomId);
      expect(result).toBe(true);
    });

    test('should return false when only one player confirmed', () => {
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: 'Rock',
        isConfirmed: true,
      };

      const player2: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: 'Paper',
        isConfirmed: false,
      };

      const roomId = 'TEST15';
      roomManager.createRoom(roomId, player1);
      roomManager.joinRoom(roomId, player2);
      
      const result = roomManager.areBothPlayersConfirmed(roomId);
      expect(result).toBe(false);
    });

    test('should return false when room has only one player', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: 'Rock',
        isConfirmed: true,
      };

      const roomId = 'TEST16';
      roomManager.createRoom(roomId, player);
      
      const result = roomManager.areBothPlayersConfirmed(roomId);
      expect(result).toBe(false);
    });
  });

  describe('resetRoundSelections', () => {
    test('should reset player selections', () => {
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 5,
        winStreak: 2,
        selectedOption: 'Rock',
        isConfirmed: true,
      };

      const player2: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 3,
        winStreak: 1,
        selectedOption: 'Paper',
        isConfirmed: true,
      };

      const roomId = 'TEST17';
      roomManager.createRoom(roomId, player1);
      roomManager.joinRoom(roomId, player2);
      
      roomManager.resetRoundSelections(roomId);
      
      const room = roomManager.getRoom(roomId);
      expect(room?.players[0].selectedOption).toBeNull();
      expect(room?.players[0].isConfirmed).toBe(false);
      expect(room?.players[1].selectedOption).toBeNull();
      expect(room?.players[1].isConfirmed).toBe(false);
      expect(room?.gameState).toBe('SELECTING');
      expect(room?.roundNumber).toBe(2);
    });
  });

  describe('findRoomBySocketId', () => {
    test('should find room by socket ID', () => {
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId = 'TEST18';
      roomManager.createRoom(roomId, player);
      
      const foundRoom = roomManager.findRoomBySocketId('socket1');
      expect(foundRoom).not.toBeNull();
      expect(foundRoom?.roomId).toBe(roomId);
    });

    test('should return null for non-existent socket ID', () => {
      const foundRoom = roomManager.findRoomBySocketId('nonexistent');
      expect(foundRoom).toBeNull();
    });
  });
});
