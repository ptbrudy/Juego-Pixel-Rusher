
export enum GameState {
  MainMenu,
  Playing,
  GameOver,
}

export interface Position {
  x: number;
  y: number;
}

export interface GameObject {
  id: number;
  position: Position;
  size: {
    width: number;
    height: number;
  };
}

export interface HighScore {
  name: string;
  score: number;
}
