import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socketService } from '../../services/socket';
import { useGameStore } from '../../store/gameStore';
import { GAME_OPTIONS } from '../../../../shared/options';
import { OptionCard } from '../OptionCard/OptionCard';
import { ScoreBoard } from '../ScoreBoard/ScoreBoard';
import { Countdown } from '../Countdown/Countdown';
import { ExitButton } from '../ExitButton/ExitButton';
import { HelpButton } from '../HelpButton/HelpButton';
import { audioManager } from '../../utils/audio';
import './GameBoard.scss';

export const GameBoard: React.FC = () => {
  const {
    currentPlayer,
    opponent,
    selectedOption,
    setSelectedOption,
    isConfirmed,
    setConfirmed,
    gameState,
    countdownValue,
    roundResult,
    roundNumber,
  } = useGameStore();

  const handleSelectOption = (option: typeof GAME_OPTIONS[number]) => {
    if (isConfirmed) return;
    
    setSelectedOption(option);
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('select_option', option);
    }
  };

  const handleConfirm = () => {
    if (!selectedOption || isConfirmed) return;
    
    audioManager.play('click');
    setConfirmed(true);
    
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('confirm_selection');
    }
  };

  const getPlayerResult = () => {
    if (!roundResult || !currentPlayer) return null;
    
    return roundResult.player1.socketId === currentPlayer.socketId
      ? roundResult.player1
      : roundResult.player2;
  };

  const getOpponentResult = () => {
    if (!roundResult || !currentPlayer) return null;
    
    return roundResult.player1.socketId === currentPlayer.socketId
      ? roundResult.player2
      : roundResult.player1;
  };

  // Determine if current player is player 1 (creator = blue) or player 2 (joiner = pink)
  // Player 1 is the one whose socketId matches player1 in roundResult
  const isPlayerOne = roundResult 
    ? roundResult.player1.socketId === currentPlayer?.socketId
    : true; // Default to player 1 color if no round result yet

  const playerColor: 'blue' | 'pink' = isPlayerOne ? 'blue' : 'pink';

  return (
    <div className="gameboard-container">
      <ExitButton />
      <HelpButton />
      <ScoreBoard
        playerName={currentPlayer?.nickname || 'You'}
        playerScore={currentPlayer?.score || 0}
        playerStreak={currentPlayer?.winStreak || 0}
        opponentName={opponent?.nickname}
        opponentScore={opponent?.score}
        opponentStreak={opponent?.winStreak}
        isPlayerOne={isPlayerOne}
      />

      {gameState === 'SELECTING' && (
        <motion.div
          className="selection-phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="round-indicator">Round {roundNumber}</div>
          <div className="phase-header">
            <h2>Choose Your Weapon!</h2>
            {opponent?.isConfirmed && (
              <div className="opponent-ready">Opponent is ready! ⏳</div>
            )}
          </div>

          <div className="options-grid">
            {GAME_OPTIONS.map((option) => (
              <OptionCard
                key={option}
                option={option}
                isSelected={selectedOption === option}
                isDisabled={isConfirmed}
                onSelect={handleSelectOption}
                playerColor={playerColor}
              />
            ))}
          </div>

          <motion.button
            className={`confirm-button ${!selectedOption || isConfirmed ? 'disabled' : ''}`}
            onClick={handleConfirm}
            disabled={!selectedOption || isConfirmed}
            animate={selectedOption && !isConfirmed ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 4px 12px rgba(102, 126, 234, 0.4)',
                '0 8px 24px rgba(102, 126, 234, 0.6)',
                '0 4px 12px rgba(102, 126, 234, 0.4)',
              ],
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {isConfirmed ? '✓ Confirmed! Waiting...' : 'Confirm Selection'}
          </motion.button>
        </motion.div>
      )}

      {gameState === 'WAITING' && (
        <div className="waiting-phase">
          <motion.div
            className="waiting-message"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Waiting for opponent...
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {gameState === 'COUNTDOWN' && countdownValue && (
          <Countdown count={countdownValue} />
        )}
      </AnimatePresence>

      {gameState === 'RESULT' && roundResult && (
        <motion.div
          className="result-phase"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="result-content">
            <div className="round-indicator-result">Round {roundNumber}</div>
            <div className="choices">
              <div className="choice-card player">
                <div className="choice-label">You</div>
                <img
                  src={`/assets/images/options/${getPlayerResult()?.option.toLowerCase()}.png`}
                  alt={getPlayerResult()?.option}
                  className="choice-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="choice-name">{getPlayerResult()?.option}</div>
              </div>

              <div className="vs-divider">VS</div>

              <div className="choice-card opponent">
                <div className="choice-label">Opponent</div>
                <img
                  src={`/assets/images/options/${getOpponentResult()?.option.toLowerCase()}.png`}
                  alt={getOpponentResult()?.option}
                  className="choice-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="choice-name">{getOpponentResult()?.option}</div>
              </div>
            </div>

            <motion.div
              className={`result-banner ${getPlayerResult()?.result.toLowerCase()}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              {getPlayerResult()?.result === 'WIN' && '🎉 YOU WIN! 🎉'}
              {getPlayerResult()?.result === 'LOSE' && '😢 YOU LOSE 😢'}
              {getPlayerResult()?.result === 'DRAW' && '🤝 DRAW 🤝'}
            </motion.div>

            {getPlayerResult()?.scoreGained ? (
              <motion.div
                className="score-gained"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                +{getPlayerResult()?.scoreGained} Points!
              </motion.div>
            ) : null}

            <motion.button
              className={`ready-button ${currentPlayer?.isReadyForNextRound ? 'ready' : ''}`}
              onClick={() => {
                const socket = socketService.getSocket();
                if (socket && !currentPlayer?.isReadyForNextRound) {
                  socket.emit('ready_for_next_round');
                  audioManager.play('click');
                }
              }}
              disabled={currentPlayer?.isReadyForNextRound}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {currentPlayer?.isReadyForNextRound ? '✓ Ready!' : 'Ready for Next Round'}
            </motion.button>

            <motion.div
              className="ready-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {currentPlayer?.isReadyForNextRound && !opponent?.isReadyForNextRound && (
                <div className="waiting-opponent-ready">
                  <span className="status-icon">⏳</span>
                  Waiting for opponent...
                </div>
              )}
              
              {!currentPlayer?.isReadyForNextRound && opponent?.isReadyForNextRound && (
                <div className="opponent-ready-status">
                  <span className="status-icon">✓</span>
                  Opponent is ready!
                </div>
              )}

              {currentPlayer?.isReadyForNextRound && opponent?.isReadyForNextRound && (
                <div className="both-ready-status">
                  <span className="status-icon">✓✓</span>
                  Both ready! Starting next round...
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
