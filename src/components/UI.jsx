import React from 'react';
import { GAME_STATES } from '../hooks/useGameEngine';

const UI = ({ score, gameState, togglePause, quitGame }) => {
  if (gameState === GAME_STATES.START || gameState === GAME_STATES.GAME_OVER) {
    return null;
  }

  return (
    <>
      <div className="hud">
        {gameState !== GAME_STATES.PAUSED && (
          <button className="btn-pause" onClick={togglePause}>
            PAUSE
          </button>
        )}
        <div className="score-display text-neon-cyan">
          SCORE: {score}
        </div>
      </div>
      
      {gameState === GAME_STATES.PAUSED && (
        <div className="screen-overlay" style={{ background: 'rgba(5, 5, 16, 0.9)' }}>
          <h1 className="text-neon-cyan" style={{ fontSize: '32px', marginBottom: '30px' }}>
            PAUSED
          </h1>
          <button className="btn-retro" onClick={togglePause} style={{ marginTop: '0', marginBottom: '20px' }}>
            RESUME
          </button>
          <button 
            className="btn-retro" 
            onClick={quitGame} 
            style={{ 
              marginTop: '0', 
              borderColor: 'var(--neon-pink)', 
              color: 'var(--neon-pink)', 
              boxShadow: '0 0 10px var(--neon-pink), inset 0 0 10px var(--neon-pink)' 
            }}
          >
            EXIT GAME
          </button>
        </div>
      )}
    </>
  );
};

export default UI;
