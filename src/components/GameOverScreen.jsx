import React from 'react';

const GameOverScreen = ({ score, highScore, onRestart, onQuit }) => {
  return (
    <div className="screen-overlay" style={{ background: 'rgba(5, 5, 16, 0.9)' }}>
      <h1 className="text-neon-pink" style={{ fontSize: '48px', marginBottom: '20px' }}>
        GAME OVER
      </h1>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="text-neon-cyan" style={{ fontSize: '18px', marginBottom: '10px' }}>
          SCORE: {score}
        </p>
        <p style={{ fontSize: '14px', color: '#ffb3ba' }}>
          HIGH SCORE: {highScore}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button className="btn-retro" style={{ marginTop: 0 }} onClick={onRestart}>
          RESTART
        </button>
        <button 
          className="btn-retro" 
          onClick={onQuit}
          style={{ 
            marginTop: 0,
            borderColor: 'var(--neon-pink)', 
            color: 'var(--neon-pink)', 
            boxShadow: '0 0 10px var(--neon-pink), inset 0 0 10px var(--neon-pink)' 
          }}
        >
          EXIT GAME
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
