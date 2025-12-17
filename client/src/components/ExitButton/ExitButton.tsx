import React from 'react';
import { motion } from 'framer-motion';
import { socketService } from '../../services/socket';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../utils/audio';
import './ExitButton.scss';

export const ExitButton: React.FC = () => {
  const { resetGame } = useGameStore();

  const handleExit = () => {
    const socket = socketService.getSocket();
    if (socket) {
      // Emit leave_room to clean up server state
      socket.emit('leave_room');
    }
    
    // Play sound and reset to menu
    audioManager.play('click');
    resetGame();
  };

  return (
    <motion.button
      className="exit-button"
      onClick={handleExit}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      title="Exit to Menu"
    >
      ✕
    </motion.button>
  );
};
