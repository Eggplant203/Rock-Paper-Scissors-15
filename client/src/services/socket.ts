import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '../../../shared/types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  connect(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!this.socket) {
      this.socket = io(SERVER_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('Connected to server:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  cleanup() {
    // Remove all listeners without disconnecting
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
