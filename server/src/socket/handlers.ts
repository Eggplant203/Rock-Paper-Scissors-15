import { Server, Socket } from 'socket.io';
import { RoomManager } from '../rooms/RoomManager';
import { GameEngine } from '../game/GameEngine';
import { generateRandomNickname } from '../utils/nickname';
import { Player } from '../../../shared/types';
import { isValidOption } from '../../../shared/options';
import type { ServerToClientEvents, ClientToServerEvents } from '../../../shared/types';

export function setupSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  roomManager: RoomManager,
  gameEngine: GameEngine
) {
  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log(`Client connected: ${socket.id}`);

    // Create room
    socket.on('create_room', (nickname, callback) => {
      // Check if socket is already in a room and remove it first
      const existingRoom = roomManager.findRoomBySocketId(socket.id);
      if (existingRoom) {
        socket.leave(existingRoom.roomId);
        roomManager.removePlayerFromRoom(socket.id);
        console.log(`${socket.id} left previous room: ${existingRoom.roomId}`);
      }
      
      const roomId = roomManager.generateRoomId();
      
      const player: Player = {
        socketId: socket.id,
        nickname: nickname || generateRandomNickname(),
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };
      
      const room = roomManager.createRoom(roomId, player);
      socket.join(roomId);
      
      socket.emit('room_joined', {
        roomId,
        player,
        players: room.players,
      });
      
      callback(roomId);
      console.log(`Room created: ${roomId} by ${player.nickname}`);
    });

    // Join room
    socket.on('join_room', ({ roomId, nickname }, callback) => {
      // Check if socket is already in a room and remove it first
      const currentRoom = roomManager.findRoomBySocketId(socket.id);
      if (currentRoom) {
        socket.leave(currentRoom.roomId);
        const leftRoom = roomManager.removePlayerFromRoom(socket.id);
        console.log(`${socket.id} left previous room: ${currentRoom.roomId}`);
        
        // Notify remaining players in the old room
        if (leftRoom && leftRoom.players.length > 0) {
          io.to(leftRoom.roomId).emit('opponent_left');
          io.to(leftRoom.roomId).emit('player_update', leftRoom.players);
        }
      }
      
      const existingRoom = roomManager.getRoom(roomId);
      
      if (!existingRoom) {
        callback(false, 'Room not found');
        return;
      }
      
      if (existingRoom.players.length >= 2) {
        callback(false, 'Room is full');
        return;
      }
      
      const player: Player = {
        socketId: socket.id,
        nickname: nickname || generateRandomNickname(),
        score: 0,
        winStreak: 0,
        selectedOption: null,
        isConfirmed: false,
      };
      
      const room = roomManager.joinRoom(roomId, player);
      
      if (!room) {
        callback(false, 'Failed to join room');
        return;
      }
      
      socket.join(roomId);
      
      // Notify the joining player
      socket.emit('room_joined', {
        roomId,
        player,
        players: room.players,
      });
      
      // Notify all players in room
      io.to(roomId).emit('player_update', room.players);
      
      callback(true);
      console.log(`${player.nickname} joined room: ${roomId}`);
    });

    // Change nickname
    socket.on('change_nickname', (nickname) => {
      const updated = roomManager.updatePlayerNickname(socket.id, nickname);
      
      if (updated) {
        const room = roomManager.findRoomBySocketId(socket.id);
        if (room) {
          io.to(room.roomId).emit('player_update', room.players);
        }
      }
    });

    // Select option
    socket.on('select_option', (option) => {
      if (!isValidOption(option)) {
        socket.emit('error', 'Invalid option');
        return;
      }
      
      const updated = roomManager.updatePlayerSelection(socket.id, option);
      
      if (updated) {
        const room = roomManager.findRoomBySocketId(socket.id);
        if (room) {
          io.to(room.roomId).emit('player_update', room.players);
        }
      }
    });

    // Confirm selection
    socket.on('confirm_selection', async () => {
      const confirmed = roomManager.confirmPlayerSelection(socket.id);
      
      if (!confirmed) {
        socket.emit('error', 'Cannot confirm selection');
        return;
      }
      
      const room = roomManager.findRoomBySocketId(socket.id);
      if (!room) return;
      
      io.to(room.roomId).emit('player_update', room.players);
      
      // Check if both players confirmed
      if (roomManager.areBothPlayersConfirmed(room.roomId)) {
        io.to(room.roomId).emit('both_confirmed');
        
        // Start countdown
        await countdown(io, room.roomId);
        
        // Calculate result
        const result = gameEngine.calculateRoundResult(room);
        
        if (result) {
          room.gameState = 'RESULT';
          io.to(room.roomId).emit('round_result', result);
        }
      }
    });

    // Ready for next round
    socket.on('ready_for_next_round', () => {
      const ready = roomManager.markPlayerReadyForNextRound(socket.id);
      
      if (!ready) {
        socket.emit('error', 'Cannot mark as ready');
        return;
      }
      
      const room = roomManager.findRoomBySocketId(socket.id);
      if (!room) return;
      
      io.to(room.roomId).emit('player_update', room.players);
      
      // Check if both players are ready
      if (roomManager.areBothPlayersReadyForNextRound(room.roomId)) {
        // Increment round number BEFORE resetting selections
        room.roundNumber += 1;
        roomManager.resetRoundSelections(room.roomId);
        io.to(room.roomId).emit('both_ready_next_round');
        io.to(room.roomId).emit('player_update', room.players);
      }
    });

    // Leave room
    socket.on('leave_room', () => {
      const room = roomManager.findRoomBySocketId(socket.id);
      if (room) {
        // Leave socket.io room first
        socket.leave(room.roomId);
        console.log(`${socket.id} left room: ${room.roomId}`);
      }
      handleDisconnect();
    });

    // Disconnect
    socket.on('disconnect', () => {
      handleDisconnect();
    });

    function handleDisconnect() {
      const room = roomManager.removePlayerFromRoom(socket.id);
      
      if (room && room.players.length > 0) {
        io.to(room.roomId).emit('opponent_left');
        io.to(room.roomId).emit('player_update', room.players);
      }
      
      console.log(`Client disconnected: ${socket.id}`);
    }
  });
}

// Countdown helper
async function countdown(io: Server<ClientToServerEvents, ServerToClientEvents>, roomId: string): Promise<void> {
  for (let i = 3; i > 0; i--) {
    io.to(roomId).emit('countdown', i);
    await sleep(500);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
