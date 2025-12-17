import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSocket } from './hooks/useSocket';
import { useGameStore } from './store/gameStore';
import { Lobby } from './components/Lobby/Lobby';
import { Room } from './components/Room/Room';
import { GameBoard } from './components/GameBoard/GameBoard';
import { initializeSounds } from './utils/audio';
import { initializeBackground } from './utils/backgrounds';
import './App.scss';

function App() {
  useSocket();
  const { gameState, errorMessage } = useGameStore();

  useEffect(() => {
    // Initialize random background on app load
    initializeBackground();

    // Initialize audio on first user interaction
    const handleFirstInteraction = () => {
      initializeSounds();
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
