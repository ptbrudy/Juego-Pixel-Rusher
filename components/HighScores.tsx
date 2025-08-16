
import React from 'react';
import { HighScore } from '../types';

interface HighScoresProps {
  scores: HighScore[];
  currentPlayerScore?: number;
}

const HighScores: React.FC<HighScoresProps> = ({ scores, currentPlayerScore }) => {
  // A score is only a "current player score" if it's on the board.
  const isScoreOnBoard = scores.some(s => s.score === currentPlayerScore);

  return (
    <div className="w-full mt-4">
      <h2 className="text-2xl text-center text-yellow-400 mb-4">HIGH SCORES</h2>
      {scores.length > 0 ? (
        <ol className="text-lg space-y-2 text-center">
          {scores.map((score, index) => (
            <li
              key={index}
              className={`flex justify-between px-2 py-1 rounded ${
                isScoreOnBoard && score.score === currentPlayerScore ? 'bg-green-500/20 text-green-300 animate-pulse' : 'text-gray-300'
              }`}
            >
              <span className="font-mono mr-4">{`${index + 1}. ${score.name.toUpperCase()}`}</span>
              <span className="font-mono">{score.score}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-center text-gray-500">NO SCORES YET!</p>
      )}
    </div>
  );
};

export default HighScores;
