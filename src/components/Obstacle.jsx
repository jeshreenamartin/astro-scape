import React from 'react';
import { OBSTACLE_TYPES } from '../constants';

const Obstacle = ({ type, x, y, w, h }) => {
  let shapeClass = '';
  
  switch (type) {
    case OBSTACLE_TYPES.SPIKE:
      shapeClass = 'obstacle-spike';
      break;
    case OBSTACLE_TYPES.ROVER:
      shapeClass = 'obstacle-rover';
      break;
    case OBSTACLE_TYPES.UFO:
      shapeClass = 'obstacle-ufo';
      break;
    default:
      shapeClass = 'obstacle-spike';
  }

  // Position is driven straight via inline style due to loop
  // Notice we use left to adjust the X coord
  return (
    <div 
      className={`obstacle ${shapeClass}`}
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    />
  );
};

export default Obstacle;
