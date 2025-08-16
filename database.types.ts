export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      scores: {
        Row: {
          id: number;
          player_id: number;
          score: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          player_id: number;
          score: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          player_id?: number;
          score?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "scores_player_id_fkey";
            columns: ["player_id"];
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
