import React, { useEffect } from 'react';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOverScreen from './components/GameOverScreen';
import { useGameEngine, GAME_STATES } from './hooks/useGameEngine';
import { usePlayer } from './hooks/usePlayer';

function App() {
  const playerHooks = usePlayer();
  const gameEngine = useGameEngine(playerHooks);

  // Global keydown for jump (Spacebar) listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        // Prevent default scrolling
        e.preventDefault();
        
        if (gameEngine.gameState === GAME_STATES.START) {
          gameEngine.startGame();
        } else if (gameEngine.gameState === GAME_STATES.PLAYING) {
          playerHooks.jump();
        } else if (gameEngine.gameState === GAME_STATES.GAME_OVER) {
          gameEngine.startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameEngine.gameState, gameEngine, playerHooks]);

  return (
    <div className="game-container">
      {/* Background elements are always visible to act as parallax or static backdrop */}
      {gameEngine.gameState === GAME_STATES.START && (
        <StartScreen onStart={gameEngine.startGame} />
      )}
      
      {gameEngine.gameState === GAME_STATES.GAME_OVER && (
        <GameOverScreen
          score={gameEngine.score}
          highScore={gameEngine.highScore}
          onRestart={gameEngine.startGame}
          onQuit={gameEngine.quitGame}
        />
      )}

      {/* Main Game Screen renders the actual elements (obstructions, ground, dog) */}
      <Game gameEngine={gameEngine} playerHooks={playerHooks} />
    </div>
  );
}

export default App;
