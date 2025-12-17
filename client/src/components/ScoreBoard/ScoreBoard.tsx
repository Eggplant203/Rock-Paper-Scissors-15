import React from 'react';
import { motion } from 'framer-motion';
import './ScoreBoard.scss';

interface ScoreBoardProps {
  playerName: string;
  playerScore: number;
  playerStreak: number;
  opponentName?: string;
  opponentScore?: number;
  opponentStreak?: number;
  isPlayerOne?: boolean; // true if current player is player 1
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerName,
  playerScore,
  playerStreak,
  opponentName,
  opponentScore,
  opponentStreak,
  isPlayerOne = true,
}) => {
  return (
    <div className="scoreboard">
      <motion.div 
        className={`score-card player ${isPlayerOne ? 'blue' : 'pink'}`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="score-header you">You</div>
        <div className="player-name">{playerName}</div>
        <motion.div 
          className="score-value"
          key={playerScore}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {playerScore}
        </motion.div>
        {playerStreak > 0 && (
          <div className="streak-badge">
            🔥 {playerStreak} win streak
          </div>
        )}
      </motion.div>

      <div className="vs-divider">VS</div>

      {opponentName ? (
        <motion.div 
          className={`score-card opponent ${isPlayerOne ? 'pink' : 'blue'}`}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="score-header opponent-label">Opponent</div>
          <div className="player-name">{opponentName}</div>
          <motion.div 
            className="score-value"
            key={opponentScore ?? 0}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {opponentScore ?? 0}
          </motion.div>
          {opponentStreak !== undefined && opponentStreak > 0 && (
            <div className="streak-badge">
              🔥 {opponentStreak} win streak
            </div>
          )}
        </motion.div>
      ) : (
        <div className="score-card opponent waiting">
          <div className="waiting-text">Waiting for opponent...</div>
        </div>
      )}
    </div>
  );
};
