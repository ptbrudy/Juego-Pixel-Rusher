import React, { useState } from 'react';
import HighScores from './HighScores';
import { HighScore } from '../types';

interface MainMenuScreenProps {
  onStartGame: () => void;
  highScores: HighScore[];
  currentPlayerName: string;
  onPlayerChange: (name: string) => void;
}

const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ onStartGame, highScores, currentPlayerName, onPlayerChange }) => {
  const [isChangingPlayer, setIsChangingPlayer] = useState(!currentPlayerName);
  const [newName, setNewName] = useState('');

  const uniquePlayers = [...new Set(highScores.map(s => s.name.toUpperCase()).filter(Boolean))];

  const handleSelectPlayer = (name: string) => {
    onPlayerChange(name);
    setIsChangingPlayer(false);
  };

  const handleAddNewPlayer = () => {
    if (newName.trim()) {
      onPlayerChange(newName.trim());
      setNewName('');
      setIsChangingPlayer(false);
    }
  };

  if (isChangingPlayer) {
    return (
      <div className="flex flex-col items-center justify-center bg-black border-4 border-teal-400 rounded-lg p-8 shadow-lg shadow-teal-500/20 h-[640px]">
        <h2 className="text-3xl text-yellow-400 mb-6 text-center">CHOOSE PLAYER</h2>
        
        {uniquePlayers.length > 0 && (
          <div className="w-full mb-6 text-center">
            <p className="text-gray-400 mb-3 text-sm tracking-widest">EXISTING PLAYERS</p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {uniquePlayers.map(player => (
                <button 
                  key={player} 
                  onClick={() => handleSelectPlayer(player)}
                  className="px-4 py-2 bg-gray-800 text-teal-300 border-2 border-gray-600 hover:bg-gray-700 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  {player}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex flex-col items-center mt-4">
            <p className="text-gray-400 mb-3 text-sm tracking-widest">OR ADD NEW</p>
            <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value.slice(0, 10))}
                placeholder="ENTER NAME"
                maxLength={10}
                className="w-full max-w-xs px-4 py-2 mb-4 bg-gray-800 border-2 border-teal-400 text-white text-center text-lg tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
                aria-label="Enter new player name"
            />
            <button
                onClick={handleAddNewPlayer}
                disabled={!newName.trim()}
                className="w-full max-w-xs px-6 py-3 bg-green-500 text-black text-xl border-2 border-green-300 rounded-md hover:bg-green-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
                SELECT
            </button>
        </div>
        
        {currentPlayerName && (
            <button onClick={() => setIsChangingPlayer(false)} className="mt-auto text-gray-500 hover:text-white underline">
                CANCEL
            </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between bg-black border-4 border-teal-400 rounded-lg p-8 shadow-lg shadow-teal-500/20 h-[640px]">
      <div className="text-center">
        <h1 className="text-5xl text-teal-400 mb-4 tracking-wider">PIXEL</h1>
        <h1 className="text-5xl text-green-400 mb-8 tracking-wider">RUSHER</h1>
        <p className="text-sm text-center text-gray-300">Dodge the falling blocks! <br/> Move with your finger or mouse.</p>
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="mb-6 text-center bg-gray-800/50 border border-gray-700 rounded-lg px-6 py-3">
          <p className="text-gray-400 text-sm tracking-widest">CURRENT PLAYER</p>
          <div className="flex items-baseline justify-center gap-4 mt-1">
            <p className="text-2xl text-green-400">{currentPlayerName.toUpperCase()}</p>
            <button 
                onClick={() => setIsChangingPlayer(true)}
                className="text-sm text-yellow-400 hover:text-yellow-200 underline"
            >
                (change)
            </button>
          </div>
        </div>
        
        <button
          onClick={onStartGame}
          disabled={!currentPlayerName}
          className="px-8 py-4 bg-green-500 text-black text-2xl border-2 border-green-300 rounded-md hover:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 transition-transform duration-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed"
        >
          START GAME
        </button>
      </div>

      <HighScores scores={highScores} />
    </div>
  );
};

export default MainMenuScreen;
