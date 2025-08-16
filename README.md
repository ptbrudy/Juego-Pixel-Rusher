# Pixel Rusher

An addictive retro-style arcade game where you must dodge falling blocks to survive. The longer you last, the higher your score!

## How to Play

- **Objective:** Survive as long as possible by dodging the red blocks falling from the top of the screen.
- **Controls:** Move your green player block left and right by moving your mouse or dragging your finger across the game area.
- **Scoring:** Your score increases the longer you stay alive. The game speed gradually increases, making it more challenging.

## Supabase Backend Setup

To store high scores persistently and make them available across sessions and devices, you can set up a backend using [Supabase](https://supabase.com/). Below are the required SQL statements to create the necessary tables in your Supabase project's SQL Editor.

### 1. Players Table

This table stores unique player names to avoid duplication.

```sql
-- Create the players table
CREATE TABLE public.players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add a comment for clarity
COMMENT ON TABLE public.players IS 'Stores unique player information.';
```

**Columns:**
- `id`: A unique identifier for each player (UUID).
- `name`: The player's name. The `UNIQUE` constraint ensures no two players have the same name.
- `created_at`: A timestamp indicating when the player was first added.

### 2. Scores Table

This table stores the scores achieved by players and links back to the `players` table.

```sql
-- Create the scores table
CREATE TABLE public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  score INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add indexes for better query performance, especially for leaderboards
CREATE INDEX ON public.scores (player_id);
CREATE INDEX ON public.scores (score DESC);

-- Add comments for clarity
COMMENT ON TABLE public.scores IS 'Stores individual game scores for players.';
COMMENT ON COLUMN public.scores.player_id IS 'Links to the player who achieved the score.';
```

**Columns:**
- `id`: A unique identifier for each score entry (UUID).
- `player_id`: A reference to the `id` in the `players` table. `ON DELETE CASCADE` means if a player is deleted, all their scores are deleted too.
- `score`: The numerical score achieved.
- `created_at`: A timestamp indicating when the score was recorded.

### 3. Row Level Security (RLS)

For security, it's crucial to enable Row Level Security (RLS) on your tables and define policies for who can read or write data. You should enable RLS on both tables and then create policies.

**Example Policies:**
Here are some basic policies. You can run these in the SQL Editor after creating the tables.

```sql
-- 1. Enable RLS on both tables
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to allow anyone to read player and score data
-- This is useful for public leaderboards.
CREATE POLICY "Allow public read access"
ON public.players FOR SELECT
USING (true);

CREATE POLICY "Allow public read access"
ON public.scores FOR SELECT
USING (true);

-- 3. Create a policy to allow any authenticated user to add new players and scores.
-- This assumes you have Supabase Auth set up.
-- For a simple game without logins, you might use anon key access with more restrictive rules.
CREATE POLICY "Allow authenticated users to insert players"
ON public.players FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert scores"
ON public.scores FOR INSERT
TO authenticated
WITH CHECK (true);
```

With this setup, you can use the Supabase client library in your application to fetch and submit high scores.
