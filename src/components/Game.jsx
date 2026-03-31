import React from 'react';
import Player from './Player';
import Obstacle from './Obstacle';
import Background from './Background';
import UI from './UI';
import { GAME_STATES } from '../hooks/useGameEngine';
import { GROUND_Y } from '../constants';

const Game = ({ gameEngine, playerHooks }) => {
  const isJumping = playerHooks.playerY < GROUND_Y;

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {/* Background handles the sliding ground & stars */}
      {/* Passing score proxy as a loose speed metric, normally gameEngine would expose current speed */}
      <Background speed={gameEngine.gameState === GAME_STATES.PLAYING ? 5 + (gameEngine.score * 0.01) : 0.1} />

      <UI 
        score={gameEngine.score} 
        gameState={gameEngine.gameState} 
        togglePause={gameEngine.togglePause}
        quitGame={gameEngine.quitGame}
      />

      <Player y={playerHooks.playerY} isJumping={isJumping} />

      {/* Render all spawned obstacles moving from right to left */}
      {gameEngine.obstacles.map(obs => (
        <Obstacle 
          key={obs.id}
          type={obs.type}
          x={obs.x}
          y={obs.y}
          w={obs.w}
          h={obs.h}
        />
      ))}
    </div>
  );
};

export default Game;
