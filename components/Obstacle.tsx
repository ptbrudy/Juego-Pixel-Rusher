
import React from 'react';
import { Position } from '../types';
import { OBSTACLE_WIDTH, OBSTACLE_HEIGHT } from '../constants';

interface ObstacleProps {
  position: Position;
}

const Obstacle: React.FC<ObstacleProps> = ({ position }) => {
  return (
    <div
      className="absolute bg-red-500 border-2 border-red-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${OBSTACLE_WIDTH}px`,
        height: `${OBSTACLE_HEIGHT}px`,
      }}
    />
  );
};

export default Obstacle;
