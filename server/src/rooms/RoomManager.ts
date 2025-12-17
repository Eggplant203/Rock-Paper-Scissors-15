import { Room, Player } from '../../../shared/types';
import { GameOption } from '../../../shared/options';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  generateRoomId(): string {
    // Generate 6-character room code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomId = '';
    for (let i = 0; i < 6; i++) {
      roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure unique
    if (this.rooms.has(roomId)) {
      return this.generateRoomId();
    }
    
    return roomId;
  }

  createRoom(roomId: string, player: Player): Room {
    const room: Room = {
      roomId,
      players: [player],
      gameState: 'WAITING',
      roundNumber: 0,
      createdAt: Date.now(),
    };
    
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  joinRoom(roomId: string, player: Player): Room | null {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return null;
    }
    
    if (room.players.length >= 2) {
      return null;
    }
    
    room.players.push(player);
    
    if (room.players.length === 2) {
      room.gameState = 'SELECTING';
      room.roundNumber = 1;
    }
    
    return room;
  }

  removePlayerFromRoom(socketId: string): Room | null {
    for (const [roomId, room] of this.rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.socketId === socketId);
      
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        // If room is empty, delete it
        if (room.players.length === 0) {
          this.rooms.delete(roomId);
        } else {
          // Reset room state if player left
          room.gameState = 'WAITING';
          room.players[0].isConfirmed = false;
          room.players[0].selectedOption = null;
        }
        
        return room;
      }
    }
    
    return null;
  }

  findRoomBySocketId(socketId: string): Room | null {
    for (const room of this.rooms.values()) {
      if (room.players.some(p => p.socketId === socketId)) {
        return room;
      }
    }
    return null;
  }

  updatePlayerNickname(socketId: string, nickname: string): boolean {
    const room = this.findRoomBySocketId(socketId);
    if (!room) return false;
    
    const player = room.players.find(p => p.socketId === socketId);
    if (!player) return false;
    
    player.nickname = nickname;
    return true;
  }

  updatePlayerSelection(socketId: string, option: GameOption): boolean {
    const room = this.findRoomBySocketId(socketId);
    if (!room) return false;
    
    const player = room.players.find(p => p.socketId === socketId);
    if (!player) return false;
    
    player.selectedOption = option;
    player.isConfirmed = false;
    return true;
  }

  confirmPlayerSelection(socketId: string): boolean {
    const room = this.findRoomBySocketId(socketId);
    if (!room) return false;
    
    const player = room.players.find(p => p.socketId === socketId);
    if (!player || !player.selectedOption) return false;
    
    player.isConfirmed = true;
    return true;
  }

  areBothPlayersConfirmed(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room || room.players.length !== 2) return false;
    
    return room.players.every(p => p.isConfirmed && p.selectedOption !== null);
  }

  markPlayerReadyForNextRound(socketId: string): boolean {
    const room = this.findRoomBySocketId(socketId);
    if (!room) return false;

    const player = room.players.find(p => p.socketId === socketId);
    if (!player) return false;

    player.isReadyForNextRound = true;
    return true;
  }

  areBothPlayersReadyForNextRound(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room || room.players.length !== 2) return false;
    
    return room.players.every(p => p.isReadyForNextRound === true);
  }

  resetRoundSelections(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    room.players.forEach(player => {
      player.selectedOption = null;
      player.isConfirmed = false;
      player.isReadyForNextRound = false;
    });
    
    room.gameState = 'SELECTING';
    // roundNumber is incremented in handler before calling this
  }

  // Clean up old rooms (optional - run periodically)
  cleanupOldRooms(maxAgeMs: number = 3600000): void {
    const now = Date.now();
    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.createdAt > maxAgeMs) {
        this.rooms.delete(roomId);
      }
    }
  }
}
