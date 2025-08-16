
import React from 'react';
import { Position } from '../types';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants';

interface PlayerProps {
  position: Position;
}

const Player: React.FC<PlayerProps> = ({ position }) => {
  return (
    <div
      className="absolute bg-green-400 border-2 border-green-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_HEIGHT}px`,
      }}
    />
  );
};

export default Player;
