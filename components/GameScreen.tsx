import React, { useState, useEffect, useRef, useCallback } from 'react';
import Player from './Player';
import Obstacle from './Obstacle';
import { GameObject, Position } from '../types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_INITIAL_Y,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  INITIAL_OBSTACLE_SPEED,
  OBSTACLE_SPEED_INCREASE,
  OBSTACLE_SPAWN_INTERVAL_MS,
} from '../constants';

interface GameScreenProps {
  onGameOver: (score: number) => void;
}

const checkCollision = (rect1: GameObject, rect2: GameObject): boolean => {
  return (
    rect1.position.x < rect2.position.x + rect2.size.width &&
    rect1.position.x + rect1.size.width > rect2.position.x &&
    rect1.position.y < rect2.position.y + rect2.size.height &&
    rect1.position.y + rect1.size.height > rect2.position.y
  );
};

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [playerPos, setPlayerPos] = useState<Position>({
    x: (GAME_WIDTH - PLAYER_WIDTH) / 2,
    y: PLAYER_INITIAL_Y,
  });
  const [obstacles, setObstacles] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Refs for state that needs to be accessed inside the game loop
  // but is controlled by React's render cycle or props.
  const playerPosRef = useRef(playerPos);
  playerPosRef.current = playerPos;
  
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  useEffect(() => {
    // Game state variables are managed locally within the effect
    let isGameOver = false;
    let currentScore = 0;
    let gameSpeed = INITIAL_OBSTACLE_SPEED;
    let lastObstacleSpawnTime = 0;
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      if (isGameOver) {
        return;
      }
      
      if (lastObstacleSpawnTime === 0) {
        lastObstacleSpawnTime = timestamp;
      }

      // Update score and game speed
      currentScore += 1;
      setScore(currentScore); // Update score for display
      gameSpeed += OBSTACLE_SPEED_INCREASE;

      // Update obstacles and check for collisions
      setObstacles(prevObstacles => {
        // If game is over, don't update obstacles
        if (isGameOver) return prevObstacles;

        // Move existing obstacles
        let newObstacles = prevObstacles
          .map(obs => ({
            ...obs,
            position: { ...obs.position, y: obs.position.y + gameSpeed },
          }))
          .filter(obs => obs.position.y < GAME_HEIGHT);

        // Spawn new obstacles
        if (timestamp - lastObstacleSpawnTime > OBSTACLE_SPAWN_INTERVAL_MS) {
          lastObstacleSpawnTime = timestamp;
          newObstacles.push({
            id: timestamp,
            position: { x: Math.random() * (GAME_WIDTH - OBSTACLE_WIDTH), y: -OBSTACLE_HEIGHT },
            size: { width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT },
          });
        }

        // Check for collisions
        const playerRect = {
          position: playerPosRef.current,
          size: { width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
          id: -1,
        };
        for (const obstacle of newObstacles) {
          if (checkCollision(playerRect, obstacle)) {
            isGameOver = true;
            onGameOverRef.current(currentScore);
            return prevObstacles; // Return old state to stop rendering new obstacles
          }
        }
        return newObstacles;
      });
      
      if (!isGameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    // Start the game loop
    animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup function to stop the loop when the component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x - PLAYER_WIDTH / 2, GAME_WIDTH - PLAYER_WIDTH));
    setPlayerPos(prev => ({ ...prev, x: clampedX }));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x - PLAYER_WIDTH / 2, GAME_WIDTH - PLAYER_WIDTH));
    setPlayerPos(prev => ({ ...prev, x: clampedX }));
  }, []);

  return (
    <div
      ref={gameAreaRef}
      className="relative bg-black border-4 border-gray-600 overflow-hidden cursor-none"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <div className="absolute top-2 left-2 text-lg text-yellow-400 z-10 font-mono">
        SCORE: {score}
      </div>
      <Player position={playerPos} />
      {obstacles.map(obs => (
        <Obstacle key={obs.id} position={obs.position} />
      ))}
    </div>
  );
};

export default GameScreen;