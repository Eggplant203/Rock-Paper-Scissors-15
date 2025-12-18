import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { socketService } from '../../services/socket';
import { generateRandomNickname } from '../../utils/nickname';
import { audioManager } from '../../utils/audio';
import { HelpButton } from '../HelpButton/HelpButton';
import './Lobby.scss';

const NICKNAME_STORAGE_KEY = 'rps15_nickname';

export const Lobby: React.FC = () => {
  const [nickname, setNickname] = useState(() => {
    // Load nickname from localStorage or generate new one
    const saved = localStorage.getItem(NICKNAME_STORAGE_KEY);
    return saved || generateRandomNickname();
  });
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save nickname to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
  }, [nickname]);

  const handleCreateRoom = () => {
    setIsCreating(true);
    setError(null);
    audioManager.play('click');

    const socket = socketService.getSocket();
    if (!socket) {
      setError('Not connected to server');
      setIsCreating(false);
      return;
    }

    socket.emit('create_room', nickname, (roomId) => {
      console.log('Room created:', roomId);
      setIsCreating(false);
    });
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsJoining(true);
    setError(null);
    audioManager.play('click');

    const socket = socketService.getSocket();
    if (!socket) {
      setError('Not connected to server');
      setIsJoining(false);
      return;
    }

    socket.emit('join_room', { roomId: roomCode.toUpperCase(), nickname }, (success, errorMsg) => {
      setIsJoining(false);
      if (!success) {
        setError(errorMsg || 'Failed to join room');
      }
    });
  };

  const handleRandomNickname = () => {
    audioManager.play('click', 0.3);
    setNickname(generateRandomNickname());
  };

  return (
    <>
      <HelpButton />
      <div className="lobby-container">
        <motion.div
          className="lobby-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="title">RPS-15 Arena</h1>
        <p className="subtitle">Rock Paper Scissors with 15 Options!</p>

        <div className="nickname-section">
          <label>Your Nickname</label>
          <div className="nickname-input-group">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              placeholder="Enter nickname"
            />
            <button 
              className="random-btn"
              onClick={handleRandomNickname}
              title="Generate random nickname"
            >
              🎲
            </button>
          </div>
        </div>

        <div className="actions">
          <motion.button
            className="btn btn-primary"
            onClick={handleCreateRoom}
            disabled={isCreating || !nickname.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCreating ? 'Creating...' : 'Create Room'}
          </motion.button>

          <div className="divider">OR</div>

          <div className="join-section">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter Room Code"
              maxLength={6}
              className="room-code-input"
            />
            <motion.button
              className="btn btn-secondary"
              onClick={handleJoinRoom}
              disabled={isJoining || !nickname.trim() || !roomCode.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </motion.button>
          </div>
        </div>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
    </>
  );
};
