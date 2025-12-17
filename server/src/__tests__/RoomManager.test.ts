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
      const room = roomManager.joinRoom(roomId, player2);
      
      // Simulate handler incrementing roundNumber before reset
      if (room) {
        room.roundNumber += 1;
      }
      
      roomManager.resetRoundSelections(roomId);
      
      const updatedRoom = roomManager.getRoom(roomId);
      expect(updatedRoom?.players[0].selectedOption).toBeNull();
      expect(updatedRoom?.players[0].isConfirmed).toBe(false);
      expect(updatedRoom?.players[1].selectedOption).toBeNull();
      expect(updatedRoom?.players[1].isConfirmed).toBe(false);
      expect(updatedRoom?.gameState).toBe('SELECTING');
      expect(updatedRoom?.roundNumber).toBe(2);
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

  describe('Room switching scenarios', () => {
    test('should allow player to leave room and join new room successfully', () => {
      // Create first room with player1
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId1 = 'ROOM01';
      roomManager.createRoom(roomId1, player1);

      // Player2 joins first room
      const player2: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      roomManager.joinRoom(roomId1, player2);

      // Player2 selects and confirms
      roomManager.updatePlayerSelection('socket2', 'Rock');
      roomManager.confirmPlayerSelection('socket2');

      // Player2 leaves room
      roomManager.removePlayerFromRoom('socket2');

      // Verify player2 is no longer in first room
      const room1AfterLeave = roomManager.getRoom(roomId1);
      expect(room1AfterLeave?.players.length).toBe(1);
      expect(room1AfterLeave?.players[0].socketId).toBe('socket1');

      // Player2 creates new room
      const roomId2 = 'ROOM02';
      const player2NewRoom: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const newRoom = roomManager.createRoom(roomId2, player2NewRoom);

      // Verify player2 is in new room with clean state
      expect(newRoom).not.toBeNull();
      expect(newRoom.players.length).toBe(1);
      expect(newRoom.players[0].socketId).toBe('socket2');
      expect(newRoom.players[0].selectedOption).toBeNull();
      expect(newRoom.players[0].isConfirmed).toBe(false);
    });

    test('should handle player leaving and joining different room with fresh state', () => {
      // Player creates room1
      const player: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 5,
        winStreak: 3,
        selectedOption: 'Rock',
        isConfirmed: true,
      };

      const roomId1 = 'ROOM03';
      roomManager.createRoom(roomId1, player);

      // Player leaves room1
      roomManager.removePlayerFromRoom('socket1');

      // Create room2
      const player3: Player = {
        socketId: 'socket3',
        nickname: 'Player3',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId2 = 'ROOM04';
      roomManager.createRoom(roomId2, player3);

      // Player joins room2 with fresh state
      const playerFresh: Player = {
        socketId: 'socket1',
        nickname: 'TestPlayer',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const room2 = roomManager.joinRoom(roomId2, playerFresh);

      // Verify player joined with clean state
      expect(room2).not.toBeNull();
      expect(room2?.players.length).toBe(2);
      const joinedPlayer = room2?.players.find(p => p.socketId === 'socket1');
      expect(joinedPlayer?.selectedOption).toBeNull();
      expect(joinedPlayer?.isConfirmed).toBe(false);
      expect(joinedPlayer?.score).toBe(0);
      expect(joinedPlayer?.winStreak).toBe(0);
    });

    test('should allow player to select and confirm in new room after leaving previous room', () => {
      // Player1 creates room1
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId1 = 'ROOM05';
      roomManager.createRoom(roomId1, player1);

      // Player2 joins room1
      const player2: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      roomManager.joinRoom(roomId1, player2);

      // Player2 selects and confirms in room1
      roomManager.updatePlayerSelection('socket2', 'Rock');
      roomManager.confirmPlayerSelection('socket2');

      // Verify selection in room1
      let room1 = roomManager.getRoom(roomId1);
      let player2InRoom1 = room1?.players.find(p => p.socketId === 'socket2');
      expect(player2InRoom1?.selectedOption).toBe('Rock');
      expect(player2InRoom1?.isConfirmed).toBe(true);

      // Player2 leaves room1
      roomManager.removePlayerFromRoom('socket2');

      // Player3 creates room2
      const player3: Player = {
        socketId: 'socket3',
        nickname: 'Player3',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const roomId2 = 'ROOM06';
      roomManager.createRoom(roomId2, player3);

      // Player2 joins room2 with fresh state
      const player2Fresh: Player = {
        socketId: 'socket2',
        nickname: 'Player2',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };

      const room2 = roomManager.joinRoom(roomId2, player2Fresh);

      // Player2 should be able to select and confirm in room2
      const selectionResult = roomManager.updatePlayerSelection('socket2', 'Paper');
      expect(selectionResult).toBe(true);

      const confirmResult = roomManager.confirmPlayerSelection('socket2');
      expect(confirmResult).toBe(true);

      // Verify player2 state in room2
      const room2Updated = roomManager.getRoom(roomId2);
      const player2InRoom2 = room2Updated?.players.find(p => p.socketId === 'socket2');
      expect(player2InRoom2?.selectedOption).toBe('Paper');
      expect(player2InRoom2?.isConfirmed).toBe(true);

      // Verify room2 is in correct state
      expect(room2Updated?.gameState).toBe('SELECTING');
    });

    test('should handle multiple room switches without state persistence', () => {
      // Create and leave room1
      const roomId1 = 'ROOM07';
      const player1: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };
      roomManager.createRoom(roomId1, player1);
      roomManager.updatePlayerSelection('socket1', 'Rock');
      roomManager.removePlayerFromRoom('socket1');

      // Create and leave room2
      const roomId2 = 'ROOM08';
      const player2: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };
      roomManager.createRoom(roomId2, player2);
      roomManager.updatePlayerSelection('socket1', 'Paper');
      roomManager.removePlayerFromRoom('socket1');

      // Create room3 with fresh player object
      const roomId3 = 'ROOM09';
      const player3: Player = {
        socketId: 'socket1',
        nickname: 'Player1',
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };
      roomManager.createRoom(roomId3, player3);

      // Verify clean state in room3
      const room3 = roomManager.getRoom(roomId3);
      expect(room3?.players[0].selectedOption).toBeNull();
      expect(room3?.players[0].isConfirmed).toBe(false);
    });
  });
});
