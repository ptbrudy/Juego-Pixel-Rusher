import React, { useState, useCallback, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import MainMenuScreen from './components/MainMenuScreen';
import GameOverScreen from './components/GameOverScreen';
import { GameState, HighScore } from './types';
import { MAX_HIGH_SCORES } from './constants';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MainMenu);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [allPlayers, setAllPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHighScores = async () => {
    const { data, error } = await supabase
      .from('scores')
      .select('score, players(name)')
      .order('score', { ascending: false })
      .limit(MAX_HIGH_SCORES);

    if (error) {
      const errorMessage = error.message || 'An unknown error occurred.';
      console.error('Error fetching high scores:', errorMessage, error);
      setError(`Failed to load scores: ${errorMessage}`);
      setHighScores([]);
    } else if (data) {
      const formattedScores = data
        .map(s => ({
          name: s.players?.name,
          score: s.score,
        }))
        .filter((s): s is HighScore => typeof s.name === 'string' && typeof s.score === 'number');
      setHighScores(formattedScores);
    }
  };

  const fetchAllPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('name')
      .order('name', { ascending: true });

    if (error) {
      const errorMessage = error.message || 'An unknown error occurred.';
      console.error('Error fetching players:', errorMessage, error);
      setError(`Failed to load players: ${errorMessage}`);
      setAllPlayers([]);
    } else if (data) {
      setAllPlayers(data.map(p => p.name));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchHighScores(), fetchAllPlayers()]);
      setLoading(false);
    };
    fetchData();
  }, []);

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

  const endGame = useCallback(async (finalScore: number) => {
    setGameState(GameState.GameOver);
    setScore(finalScore);
    setLoading(true);
    setError(null);

    try {
        // 1. Get or create player
        const { data: playerData, error: playerError } = await supabase
            .from('players')
            .upsert({ name: playerName.toUpperCase() })
            .select('id')
            .single();

        if (playerError || !playerData) {
            throw playerError || new Error("Player data not found");
        }
        
        // 2. Insert score
        const { error: scoreError } = await supabase
            .from('scores')
            .insert({ player_id: playerData.id, score: finalScore });

        if (scoreError) {
            throw scoreError;
        }

        // 3. Refresh high scores and players list
        await Promise.all([fetchHighScores(), fetchAllPlayers()]);

    } catch (e: any) {
        const errorMessage = e.message || 'An unknown error occurred.';
        console.error('Error saving score:', errorMessage, e);
        setError(`Could not save your score: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
}, [playerName]);

  const renderContent = () => {
    if (loading && gameState === GameState.MainMenu) {
      return (
        <div className="flex flex-col items-center justify-center bg-black border-4 border-teal-400 rounded-lg p-8 h-[640px]">
          <h1 className="text-4xl text-yellow-400 animate-pulse">LOADING...</h1>
        </div>
      );
    }

    switch (gameState) {
      case GameState.MainMenu:
        return <MainMenuScreen 
                  onStartGame={startGame} 
                  highScores={highScores} 
                  currentPlayerName={playerName} 
                  onPlayerChange={handlePlayerChange}
                  allPlayers={allPlayers}
                  isLoading={loading}
                  error={error}
                />;
      case GameState.Playing:
        return <GameScreen onGameOver={endGame} />;
      case GameState.GameOver:
        return <GameOverScreen 
                  score={score} 
                  onRestart={backToMenu} 
                  highScores={highScores} 
                  currentPlayerName={playerName} 
                  isLoading={loading}
                  error={error}
                />;
      default:
        return <MainMenuScreen 
                  onStartGame={startGame} 
                  highScores={highScores} 
                  currentPlayerName={playerName} 
                  onPlayerChange={handlePlayerChange} 
                  allPlayers={allPlayers}
                  isLoading={loading}
                  error={error}
                />;
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
