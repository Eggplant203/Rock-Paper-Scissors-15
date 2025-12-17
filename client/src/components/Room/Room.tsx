import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../utils/audio';
import { ExitButton } from '../ExitButton/ExitButton';
import { HelpButton } from '../HelpButton/HelpButton';
import './Room.scss';

export const Room: React.FC = () => {
  const { roomId, currentPlayer, opponent } = useGameStore();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!roomId) return;
    
    try {
      await navigator.clipboard.writeText(roomId);
      audioManager.play('click', 0.3);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <HelpButton />
      <motion.div
        className="room-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      <ExitButton />
      <div className="room-header">
        <h2>Room Code</h2>
        <div className="room-code-wrapper">
          <div className="room-code">{roomId}</div>
          <motion.button
            className="copy-button"
            onClick={handleCopyCode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? '✓' : '📋'}
          </motion.button>
        </div>
        <p className="room-instruction">Share this code with your friend!</p>
      </div>

      <div className="players-waiting">
        <div className="player-slot filled">
          <div className="player-avatar">👤</div>
          <div className="player-info">
            <div className="player-name">{currentPlayer?.nickname}</div>
            <div className="player-status">Ready</div>
          </div>
        </div>

        <div className="vs-text">VS</div>

        {opponent ? (
          <div className="player-slot filled">
            <div className="player-avatar">👤</div>
            <div className="player-info">
              <div className="player-name">{opponent.nickname}</div>
              <div className="player-status">Ready</div>
            </div>
          </div>
        ) : (
          <div className="player-slot empty">
            <motion.div
              className="waiting-indicator"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="waiting-text">Waiting for opponent...</div>
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
    </>
  );
};
