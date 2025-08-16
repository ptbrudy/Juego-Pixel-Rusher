
import React from 'react';
import { HighScore } from '../types';
import HighScores from './HighScores';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  highScores: HighScore[];
  currentPlayerName: string;
  isLoading: boolean;
  error: string | null;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart, highScores, currentPlayerName, isLoading, error }) => {
  const isNewHighScore = highScores.length > 0 && score > 0 && highScores.some(
    hs => hs.score === score && hs.name.toUpperCase() === currentPlayerName.toUpperCase()
  );

  return (
    <div className="flex flex-col items-center justify-between bg-black border-4 border-red-500 rounded-lg p-8 shadow-lg shadow-red-500/20 h-[640px]">
      <div className="text-center h-16">
        <h1 className="text-6xl text-red-500">GAME OVER</h1>
        {isNewHighScore && !isLoading && <p className="text-xl text-green-400 mt-4 animate-bounce">NEW HIGH SCORE!</p>}
      </div>

      <div className="text-center">
        <p className="text-2xl text-gray-300 mb-2">FINAL SCORE</p>
        <p className="text-7xl text-yellow-400">{score}</p>
      </div>

       {isLoading && <p className="text-lg text-yellow-400 animate-pulse">SAVING SCORE...</p>}
       {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        onClick={onRestart}
        disabled={isLoading}
        className="px-8 py-4 bg-yellow-400 text-black text-2xl border-2 border-yellow-200 rounded-md hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 transform hover:scale-105 transition-transform duration-200 disabled:bg-gray-600"
      >
        PLAY AGAIN
      </button>

      <HighScores scores={highScores} currentPlayerScore={score} />
    </div>
  );
};

export default GameOverScreen;
