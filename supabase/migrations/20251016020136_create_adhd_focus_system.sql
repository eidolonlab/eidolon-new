/*
  # ADHD Focus System - Core Tables

  ## Overview
  This migration creates the complete database structure for the ADHD-first Focus Center,
  including focus sessions, rescue interventions, quick plans, meaningful wins, and user stats.

  ## New Tables
  
  ### `focus_sessions`
  Tracks all focus sessions (25/15/5 minute blocks)
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `task` (text) - what the user is working on
  - `duration_preset` (int) - selected duration in minutes (25, 15, or 5)
  - `actual_duration` (int) - actual seconds spent
  - `completed` (boolean) - whether session was finished or abandoned
  - `steps_completed` (text[]) - array of step descriptions marked done
  - `supports_used` (jsonb) - body_double, brown_noise, etc.
  - `barriers` (text[]) - what got in the way (tab switching, phone, etc.)
  - `reflection_emoji` (text) - quick emotional check-in
  - `reflection_text` (text) - one-line "what helped/hindered"
  - `started_at` (timestamptz)
  - `finished_at` (timestamptz)

  ### `rescue_sessions`
  Tracks 90-second rescue interventions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `rescue_type` (text) - overwhelm, distraction, or emotion
  - `duration_seconds` (int) - actual time spent
  - `helpful_rating` (int) - 1-5 scale
  - `notes` (text)
  - `created_at` (timestamptz)

  ### `quick_plans`
  AI-generated task breakdowns
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `task_input` (text) - original task description
  - `steps` (text[]) - 3 bite-size steps
  - `if_then_blockers` (text[]) - 2 implementation intentions
  - `when_where` (text) - timing/location suggestion
  - `pinned` (boolean) - ready to use in next session
  - `used_in_session_id` (uuid) - link to focus_session if used
  - `created_at` (timestamptz)

  ### `meaningful_wins`
  Daily micro-goals and celebrations
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `win_text` (text)
  - `suggested_by_ai` (boolean)
  - `completed` (boolean)
  - `completed_at` (timestamptz)
  - `date` (date) - for daily grouping
  - `created_at` (timestamptz)

  ### `focus_user_settings`
  User preferences for focus sessions
  - `user_id` (uuid, primary key, references auth.users)
  - `default_duration` (int) - 25, 15, or 5
  - `body_double_enabled` (boolean)
  - `brown_noise_enabled` (boolean)
  - `reduce_motion` (boolean) - accessibility
  - `voice_input_default` (boolean)
  - `last_task` (text) - for quick restart
  - `updated_at` (timestamptz)

  ### `adhd_user_stats`
  Aggregated weekly stats for insights
  - `user_id` (uuid, primary key, references auth.users)
  - `week_start_date` (date) - Monday of current week
  - `total_starts` (int)
  - `total_finishes` (int)
  - `total_focus_minutes` (int)
  - `current_streak_days` (int)
  - `longest_streak_days` (int)
  - `last_session_date` (date)
  - `top_barriers` (jsonb) - frequency map of barriers
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users only

  ## Important Notes
  - All timestamps use timestamptz for proper timezone handling
  - Arrays and JSONB used for flexible data storage
  - Indexes added on user_id and date fields for performance
  - Default values set to reduce friction in data entry
*/

-- Focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task text DEFAULT '',
  duration_preset int NOT NULL CHECK (duration_preset IN (5, 15, 25)),
  actual_duration int DEFAULT 0,
  completed boolean DEFAULT false,
  steps_completed text[] DEFAULT '{}',
  supports_used jsonb DEFAULT '{}',
  barriers text[] DEFAULT '{}',
  reflection_emoji text DEFAULT '',
  reflection_text text DEFAULT '',
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Rescue sessions table
CREATE TABLE IF NOT EXISTS rescue_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rescue_type text NOT NULL CHECK (rescue_type IN ('overwhelm', 'distraction', 'emotion')),
  duration_seconds int DEFAULT 90,
  helpful_rating int CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Quick plans table
CREATE TABLE IF NOT EXISTS quick_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_input text NOT NULL,
  steps text[] DEFAULT '{}',
  if_then_blockers text[] DEFAULT '{}',
  when_where text DEFAULT '',
  pinned boolean DEFAULT false,
  used_in_session_id uuid REFERENCES focus_sessions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Meaningful wins table
CREATE TABLE IF NOT EXISTS meaningful_wins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  win_text text NOT NULL,
  suggested_by_ai boolean DEFAULT false,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Focus user settings table
CREATE TABLE IF NOT EXISTS focus_user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_duration int DEFAULT 25 CHECK (default_duration IN (5, 15, 25)),
  body_double_enabled boolean DEFAULT false,
  brown_noise_enabled boolean DEFAULT false,
  reduce_motion boolean DEFAULT true,
  voice_input_default boolean DEFAULT false,
  last_task text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- ADHD user stats table
CREATE TABLE IF NOT EXISTS adhd_user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date date DEFAULT CURRENT_DATE,
  total_starts int DEFAULT 0,
  total_finishes int DEFAULT 0,
  total_focus_minutes int DEFAULT 0,
  current_streak_days int DEFAULT 0,
  longest_streak_days int DEFAULT 0,
  last_session_date date,
  top_barriers jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started_at ON focus_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_rescue_sessions_user_id ON rescue_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_plans_user_id ON quick_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meaningful_wins_user_id ON meaningful_wins(user_id);
CREATE INDEX IF NOT EXISTS idx_meaningful_wins_date ON meaningful_wins(date);

-- Enable Row Level Security
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rescue_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meaningful_wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhd_user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for focus_sessions
CREATE POLICY "Users can view own focus sessions"
  ON focus_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus sessions"
  ON focus_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own focus sessions"
  ON focus_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own focus sessions"
  ON focus_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rescue_sessions
CREATE POLICY "Users can view own rescue sessions"
  ON rescue_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rescue sessions"
  ON rescue_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rescue sessions"
  ON rescue_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own rescue sessions"
  ON rescue_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for quick_plans
CREATE POLICY "Users can view own quick plans"
  ON quick_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quick plans"
  ON quick_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quick plans"
  ON quick_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quick plans"
  ON quick_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for meaningful_wins
CREATE POLICY "Users can view own meaningful wins"
  ON meaningful_wins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meaningful wins"
  ON meaningful_wins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meaningful wins"
  ON meaningful_wins FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meaningful wins"
  ON meaningful_wins FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for focus_user_settings
CREATE POLICY "Users can view own focus settings"
  ON focus_user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus settings"
  ON focus_user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own focus settings"
  ON focus_user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for adhd_user_stats
CREATE POLICY "Users can view own ADHD stats"
  ON adhd_user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ADHD stats"
  ON adhd_user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ADHD stats"
  ON adhd_user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to auto-update stats when a session is completed
CREATE OR REPLACE FUNCTION update_adhd_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user stats
  INSERT INTO adhd_user_stats (user_id, week_start_date, total_starts, total_finishes, total_focus_minutes, last_session_date)
  VALUES (
    NEW.user_id,
    date_trunc('week', CURRENT_DATE)::date,
    1,
    CASE WHEN NEW.completed THEN 1 ELSE 0 END,
    CASE WHEN NEW.completed THEN ROUND(NEW.actual_duration / 60.0) ELSE 0 END,
    CURRENT_DATE
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_starts = adhd_user_stats.total_starts + 1,
    total_finishes = adhd_user_stats.total_finishes + CASE WHEN NEW.completed THEN 1 ELSE 0 END,
    total_focus_minutes = adhd_user_stats.total_focus_minutes + CASE WHEN NEW.completed THEN ROUND(NEW.actual_duration / 60.0) ELSE 0 END,
    last_session_date = CURRENT_DATE,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update stats
CREATE TRIGGER on_focus_session_complete
  AFTER INSERT OR UPDATE ON focus_sessions
  FOR EACH ROW
  WHEN (NEW.finished_at IS NOT NULL)
  EXECUTE FUNCTION update_adhd_stats();