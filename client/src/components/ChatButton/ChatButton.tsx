import React from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '../../utils/audio';
import './ChatButton.scss';

interface ChatButtonProps {
  onClick: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    audioManager.play('click', 0.3);
    onClick();
  };

  return (
    <motion.button
      className="chat-button"
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      title="Send Sticker"
    >
      😊
    </motion.button>
  );
};
