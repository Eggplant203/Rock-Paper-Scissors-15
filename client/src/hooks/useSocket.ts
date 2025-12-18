import { useEffect } from 'react';
import { socketService } from '../services/socket';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audio';

export function useSocket() {
  const {
    setConnected,
    setRoomId,
    setCurrentPlayer,
    gameState,
    setGameState,
    updatePlayers,
    setCountdownValue,
    setRoundResult,
    setErrorMessage,
    setConfirmed,
    setSelectedOption,
    resetGame,
  } = useGameStore();

  useEffect(() => {
    const socket = socketService.connect();

    // Connection events
    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Room events
    socket.on('room_joined', ({ roomId, player, players }) => {
      setRoomId(roomId);
      setCurrentPlayer(player);
      updatePlayers(players);
      
      if (players.length === 1) {
        setGameState('LOBBY');
      } else {
        setGameState('SELECTING');
      }
    });

    socket.on('player_update', (players) => {
      updatePlayers(players);
      
      // Sync local UI state with server player state
      const { currentPlayer, selectedOption, isConfirmed } = useGameStore.getState();
      if (currentPlayer) {
        const serverPlayer = players.find(p => p.socketId === currentPlayer.socketId);
        if (serverPlayer) {
          // If server reset player state, sync local state
          if (serverPlayer.selectedOption === null && selectedOption !== null) {
            setSelectedOption(null);
          }
          if (serverPlayer.isConfirmed === false && isConfirmed === true) {
            setConfirmed(false);
          }
        }
      }
      
      // Update game state based on players
      // Get current state from store instead of closure
      const currentState = useGameStore.getState().gameState;
      if (players.length === 2 && currentState === 'LOBBY') {
        setGameState('SELECTING');
      }
    });

    socket.on('both_confirmed', () => {
      setGameState('COUNTDOWN');
      audioManager.play('countdown', 0.5);
    });

    socket.on('countdown', (count) => {
      setCountdownValue(count);
      audioManager.play('click', 0.3);
      
      // When countdown reaches 1, stop countdown sound and clear after animation
      if (count === 1) {
        setTimeout(() => {
          audioManager.stop('countdown');
          setCountdownValue(null);
        }, 1000);
      }
    });

    socket.on('round_result', (result) => {
      // Delay showing result until countdown animation completes
      setTimeout(() => {
        setRoundResult(result);
        setGameState('RESULT');
      
      // Find current player's result and update scores
      const { currentPlayer, setCurrentPlayer, setOpponent, setRoundNumber } = useGameStore.getState();
      
      // Update round number from result
      setRoundNumber(result.roundNumber);
      
      if (currentPlayer) {
        const isPlayer1 = result.player1.socketId === currentPlayer.socketId;
        const playerResult = isPlayer1 ? result.player1 : result.player2;
        const opponentResult = isPlayer1 ? result.player2 : result.player1;
        
        // Update current player with new score and winStreak
        setCurrentPlayer({
          ...currentPlayer,
          score: playerResult.score,
          winStreak: playerResult.winStreak
        });
        
        // Update opponent with new score and winStreak
        const opponent = useGameStore.getState().opponent;
        if (opponent) {
          setOpponent({
            ...opponent,
            score: opponentResult.score,
            winStreak: opponentResult.winStreak
          });
        }
        
        // Play appropriate sound
        if (playerResult.result === 'WIN') {
          audioManager.play('win');
        } else if (playerResult.result === 'LOSE') {
          audioManager.play('lose');
        } else {
          audioManager.play('draw');
        }
      }
      }, 1200); // Wait for countdown to finish
    });

    socket.on('both_ready_next_round', () => {
      const { roundNumber, setRoundNumber } = useGameStore.getState();
      
      // Increment round number immediately for next round
      setRoundNumber(roundNumber + 1);
      
      setRoundResult(null);
      setGameState('SELECTING');
      setConfirmed(false);
      setSelectedOption(null);
      audioManager.play('click');
    });

    socket.on('opponent_left', () => {
      setErrorMessage('Opponent left the game');
      audioManager.play('logout', 0.5);
      
      // Return to menu but keep connection and listeners
      setTimeout(() => {
        // Emit leave_room to server to clean up socket rooms
        socket.emit('leave_room');
        resetGame();
        setErrorMessage(null);
      }, 2000);
    });

    socket.on('error', (message) => {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 3000);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room_joined');
      socket.off('player_update');
      socket.off('both_confirmed');
      socket.off('countdown');
      socket.off('round_result');
      socket.off('both_ready_next_round');
      socket.off('opponent_left');
      socket.off('error');
    };
  }, []);

  return socketService.getSocket();
}
