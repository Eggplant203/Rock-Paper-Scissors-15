import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './rooms/RoomManager';
import { GameEngine } from './game/GameEngine';
import { setupSocketHandlers } from './socket/handlers';
import type { ServerToClientEvents, ClientToServerEvents } from '../../shared/types';

const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize managers
const roomManager = new RoomManager();
const gameEngine = new GameEngine();

// Setup socket handlers
setupSocketHandlers(io, roomManager, gameEngine);

// Cleanup old rooms every hour
setInterval(() => {
  roomManager.cleanupOldRooms();
}, 3600000);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for connections`);
});
