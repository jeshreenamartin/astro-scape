import { useState, useRef, useCallback } from 'react';
import { GRAVITY, JUMP_VELOCITY, GROUND_Y } from '../constants';

export const usePlayer = () => {
  const yRef = useRef(GROUND_Y);
  const vRef = useRef(0);
  
  // We still use state so React can render the new position
  const [playerY, setPlayerY] = useState(GROUND_Y);

  const jump = useCallback(() => {
    if (yRef.current >= GROUND_Y) {
      vRef.current = JUMP_VELOCITY;
    }
  }, []);

  const updatePlayerPhysics = useCallback(() => {
    let newY = yRef.current + vRef.current;
    let newVelY = vRef.current + GRAVITY;

    if (newY >= GROUND_Y) {
      newY = GROUND_Y;
      newVelY = 0;
    }

    yRef.current = newY;
    vRef.current = newVelY;
    
    setPlayerY(newY); // trigger re-render
    
    return { y: newY, vel: newVelY };
  }, []);

  const resetPlayer = useCallback(() => {
    yRef.current = GROUND_Y;
    vRef.current = 0;
    setPlayerY(GROUND_Y);
  }, []);

  return { playerY, jump, updatePlayerPhysics, resetPlayer };
};
