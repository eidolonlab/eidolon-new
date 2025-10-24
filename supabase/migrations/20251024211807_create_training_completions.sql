/*
  # Create Training Completions System

  1. New Tables
    - `training_completions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `module_id` (text) - Training module identifier
      - `score` (integer) - Points earned in session
      - `rounds_completed` (integer) - Number of rounds completed
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on training_completions table
    - Users can only view and insert their own training data
    - Users cannot modify or delete training history

  3. Indexes
    - Index on user_id for fast user lookups
    - Index on completed_at for time-based queries
    - Index on module_id for module-specific analytics
*/

-- Create training_completions table
CREATE TABLE IF NOT EXISTS training_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  module_id text NOT NULL,
  score integer DEFAULT 0,
  rounds_completed integer DEFAULT 0,
  completed_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_training_completions_user_id ON training_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_training_completions_completed_at ON training_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_training_completions_module_id ON training_completions(module_id);
CREATE INDEX IF NOT EXISTS idx_training_completions_user_module ON training_completions(user_id, module_id);

-- Enable RLS
ALTER TABLE training_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own training completions"
  ON training_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own training completions"
  ON training_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to get user training stats
CREATE OR REPLACE FUNCTION get_user_training_stats(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_sessions', COUNT(*),
    'total_score', COALESCE(SUM(score), 0),
    'total_rounds', COALESCE(SUM(rounds_completed), 0),
    'favorite_module', (
      SELECT module_id
      FROM training_completions
      WHERE user_id = p_user_id
      GROUP BY module_id
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ),
    'this_week_sessions', (
      SELECT COUNT(*)
      FROM training_completions
      WHERE user_id = p_user_id
        AND completed_at >= NOW() - INTERVAL '7 days'
    ),
    'this_week_score', (
      SELECT COALESCE(SUM(score), 0)
      FROM training_completions
      WHERE user_id = p_user_id
        AND completed_at >= NOW() - INTERVAL '7 days'
    )
  ) INTO v_stats
  FROM training_completions
  WHERE user_id = p_user_id;

  RETURN COALESCE(v_stats, jsonb_build_object(
    'total_sessions', 0,
    'total_score', 0,
    'total_rounds', 0,
    'favorite_module', null,
    'this_week_sessions', 0,
    'this_week_score', 0
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;