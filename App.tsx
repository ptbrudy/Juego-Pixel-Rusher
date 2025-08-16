import React, { useState, useCallback, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import MainMenuScreen from './components/MainMenuScreen';
import GameOverScreen from './components/GameOverScreen';
import { GameState, HighScore } from './types';
import { HIGH_SCORES_KEY, MAX_HIGH_SCORES } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MainMenu);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  useEffect(() => {
    try {
      const storedScores = localStorage.getItem(HIGH_SCORES_KEY);
      if (storedScores) {
        setHighScores(JSON.parse(storedScores));
      }
    } catch (error) {
      console.error("Failed to load high scores:", error);
      setHighScores([]);
    }
  }, []);

  const saveHighScores = (scores: HighScore[]) => {
    try {
      const newHighScores = [...scores];
      newHighScores.sort((a, b) => b.score - a.score);
      const topScores = newHighScores.slice(0, MAX_HIGH_SCORES);
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores));
      setHighScores(topScores);
    } catch (error) {
      console.error("Failed to save high scores:", error);
    }
  };

  const handlePlayerChange = useCallback((name: string) => {
    if (name.trim()) {
      setPlayerName(name.trim());
    }
  }, []);

  const startGame = useCallback(() => {
    if (playerName) {
      setScore(0);
      setGameState(GameState.Playing);
    }
  }, [playerName]);

  const backToMenu = useCallback(() => {
    setGameState(GameState.MainMenu);
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setScore(finalScore);
    const newScore: HighScore = { name: playerName, score: finalScore };
    saveHighScores([...highScores, newScore]);
    setGameState(GameState.GameOver);
  }, [playerName, highScores]);

  const renderContent = () => {
    switch (gameState) {
      case GameState.MainMenu:
        return <MainMenuScreen onStartGame={startGame} highScores={highScores} currentPlayerName={playerName} onPlayerChange={handlePlayerChange} />;
      case GameState.Playing:
        return <GameScreen onGameOver={endGame} />;
      case GameState.GameOver:
        return <GameOverScreen score={score} onRestart={backToMenu} highScores={highScores} />;
      default:
        return <MainMenuScreen onStartGame={startGame} highScores={highScores} currentPlayerName={playerName} onPlayerChange={handlePlayerChange} />;
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
