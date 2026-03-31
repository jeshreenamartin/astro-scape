import React from 'react';
import { PLAYER_SIZE, GROUND_Y } from '../constants';

const Player = ({ y, isJumping }) => {
  // For pixel perfect hitboxes we keep the visual tied precisely to the Y prop
  return (
    <div 
      className={`pixel-dog ${!isJumping ? 'dog-run' : ''}`}
      style={{
        top: `${y}px`,
        // When jumping, we cancel the run animation and set static pos
        animation: isJumping ? 'none' : undefined
      }}
    />
  );
};

export default Player;
