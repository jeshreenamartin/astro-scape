import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="screen-overlay">
      <h1 className="text-neon-pink" style={{ fontSize: '48px', marginBottom: '10px' }}>
        ASTROSCAPE
      </h1>
      <h2 className="text-neon-cyan" style={{ fontSize: '18px', marginBottom: '40px' }}>
        Press Start to Run
      </h2>
      <button className="btn-retro" onClick={onStart}>
        START PLAYING
      </button>
      <p style={{ marginTop: '30px', fontSize: '12px', color: '#888' }}>
        Controls: Spacebar / Click to Jump
      </p>
    </div>
  );
};

export default StartScreen;
