import { useState, useRef, useEffect, useCallback } from 'react';
import { OBSTACLE_TYPES, GAME_SPEED_START, GAME_SPEED_MAX, PLAYER_SIZE, GROUND_Y } from '../constants';

export const GAME_STATES = {
  START: 'START',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

// Simple AABB collision detection
const detectCollision = (playerRect, obstacleRect) => {
  return (
    playerRect.x < obstacleRect.x + obstacleRect.w &&
    playerRect.x + playerRect.w > obstacleRect.x &&
    playerRect.y < obstacleRect.y + obstacleRect.h &&
    playerRect.h + playerRect.y > obstacleRect.y
  );
};

export const useGameEngine = (playerHooks) => {
  const [gameState, setGameState] = useState(GAME_STATES.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  
  const requestRef = useRef();
  const lastTimeRef = useRef();
  const speedRef = useRef(GAME_SPEED_START);
  const distSinceLastSpawn = useRef(0);
  
  // State refs for the game loop to avoid stale closures
  const stateRef = useRef(gameState);
  stateRef.current = gameState;
  
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const obsRef = useRef(obstacles);
  obsRef.current = obstacles;

  // Initialize high score
  useEffect(() => {
    const savedScore = localStorage.getItem('astroscape_hi');
    if (savedScore) setHighScore(parseInt(savedScore, 10));
  }, []);

  const generateObstacle = useCallback(() => {
    const randomTypeRaw = Math.random();
    let type = OBSTACLE_TYPES.SPIKE;
    let w = 30;
    let h = 30;
    let y = GROUND_Y + PLAYER_SIZE - h;

    if (randomTypeRaw > 0.4 && randomTypeRaw <= 0.8) {
      type = OBSTACLE_TYPES.ROVER;
      w = 40;
      h = 20;
      y = GROUND_Y + PLAYER_SIZE - h;
    } else if (randomTypeRaw > 0.8) {
      type = OBSTACLE_TYPES.UFO;
      w = 50;
      h = 20;
      y = GROUND_Y - 50; // Floating
    }

    return {
      id: Date.now() + Math.random(),
      x: 800, // Spawn off screen to the right
      y,
      w,
      h,
      type
    };
  }, []);

  const gameOver = useCallback(() => {
    setGameState(GAME_STATES.GAME_OVER);
    if (scoreRef.current > highScore) {
      setHighScore(Math.floor(scoreRef.current));
      localStorage.setItem('astroscape_hi', Math.floor(scoreRef.current));
    }
  }, [highScore]);

  const gameLoop = useCallback((time) => {
    if (stateRef.current !== GAME_STATES.PLAYING) return;
    
    if (lastTimeRef.current != undefined) {
      // 1. Update Physics
      const newPlayerInfo = playerHooks.updatePlayerPhysics();
      
      // 2. Increase Difficulty iteratively
      speedRef.current = Math.min(GAME_SPEED_MAX, speedRef.current + 0.001);
      
      // 3. Move Obstacles & Spawn
      const currentSpeed = speedRef.current;
      distSinceLastSpawn.current += currentSpeed;
      
      let nextObstacles = obsRef.current
        .map(ob => ({ ...ob, x: ob.x - currentSpeed }))
        .filter(ob => ob.x + ob.w > -100); // Remove off-screen
      
      // Spawn new one if traveled far enough
      // Base spawn distance on speed so they don't clump
      const minSpawnDist = 400 + (Math.random() * 300); 
      if (distSinceLastSpawn.current > minSpawnDist) {
        nextObstacles.push(generateObstacle());
        distSinceLastSpawn.current = 0;
      }
      setObstacles(nextObstacles);
      
      // 4. Collision Detection
      const playerRect = { x: 50, y: newPlayerInfo.y, w: PLAYER_SIZE, h: PLAYER_SIZE }; // player x is fixed
      for (const ob of nextObstacles) {
        // slightly reduce hitbox for fairness
        const hitboxOb = { x: ob.x + 5, y: ob.y + 5, w: ob.w - 10, h: ob.h - 10 };
        if (detectCollision(playerRect, hitboxOb)) {
          gameOver();
          return; // Stop logic on game over
        }
      }

      // 5. Update Score
      setScore(prev => prev + 0.1);
    }
    
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [playerHooks, generateObstacle, gameOver]);

  // Start/Stop Loop based on state
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      lastTimeRef.current = window.performance.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, gameLoop]);

  const startGame = () => {
    setGameState(GAME_STATES.PLAYING);
    setScore(0);
    speedRef.current = GAME_SPEED_START;
    distSinceLastSpawn.current = 0;
    playerHooks.resetPlayer();
    
    // Spawn an initial obstacle visibly on screen so the player sees one right away
    setObstacles([{
      id: Date.now(),
      x: 600,
      y: GROUND_Y + PLAYER_SIZE - 30,
      w: 30,
      h: 30,
      type: OBSTACLE_TYPES.SPIKE
    }]);
  };

  const togglePause = () => {
    if (gameState === GAME_STATES.PLAYING) {
      setGameState(GAME_STATES.PAUSED);
    } else if (gameState === GAME_STATES.PAUSED) {
      setGameState(GAME_STATES.PLAYING);
    }
  };

  const quitGame = () => {
    setGameState(GAME_STATES.START);
    setScore(0);
    setObstacles([]);
    playerHooks.resetPlayer();
  };

  return {
    gameState,
    score: Math.floor(score),
    highScore,
    obstacles,
    startGame,
    togglePause,
    quitGame
  };
};
