import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSocket } from './hooks/useSocket';
import { useGameStore } from './store/gameStore';
import { Lobby } from './components/Lobby/Lobby';
import { Room } from './components/Room/Room';
import { GameBoard } from './components/GameBoard/GameBoard';
import { initializeSounds, audioManager } from './utils/audio';
import { initializeBackground } from './utils/backgrounds';
import './App.scss';

function App() {
  useSocket();
  const { gameState, errorMessage } = useGameStore();
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    // Initialize random background on app load
    initializeBackground();

    // Initialize audio on first user interaction
    const handleFirstInteraction = () => {
      initializeSounds();
      setAudioInitialized(true);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Handle tab visibility change - pause/resume background music
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioManager.pauseBackground();
      } else {
        audioManager.resumeBackground();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle background music based on game state
  useEffect(() => {
    if (!audioInitialized) return;

    switch (gameState) {
      case 'MENU':
        audioManager.playBackground('background_menu', 0.3);
        break;
      case 'LOBBY':
        audioManager.playBackground('background_matchmaking', 0.3);
        break;
      case 'SELECTING':
      case 'WAITING':
        audioManager.playBackground('background_gameplay', 0.25);
        break;
      case 'COUNTDOWN':
      case 'RESULT':
        // Stop background music during countdown and result
        audioManager.stopAllBackgrounds();
        break;
    }
  }, [gameState, audioInitialized]);

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {gameState === 'MENU' && <Lobby key="lobby" />}
        {gameState === 'LOBBY' && <Room key="room" />}
        {(gameState === 'SELECTING' || gameState === 'WAITING' || gameState === 'COUNTDOWN' || gameState === 'RESULT') && (
          <GameBoard key="gameboard" />
        )}
      </AnimatePresence>

      {errorMessage && (
        <div className="error-toast">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default App;
