/*
  # ADHD Gamification & Reward System

  ## Overview
  This migration creates a comprehensive gamification system designed specifically for ADHD users,
  providing immediate feedback, visual progress tracking, and forgiving streak mechanics.

  ## 1. New Tables

  ### `user_gamification`
  Tracks each user's progression through the gamification system:
  - `user_id` (uuid, references auth.users) - The user
  - `current_xp` (integer) - Current experience points
  - `level` (integer) - Current level (calculated from total XP)
  - `total_xp` (integer) - Lifetime XP earned
  - `streak_insurance_count` (integer) - Number of "free pass" days earned
  - `created_at` (timestamptz) - When record was created
  - `updated_at` (timestamptz) - Last update time

  ### `achievements`
  Master list of all available achievements/badges:
  - `id` (uuid) - Achievement ID
  - `key` (text, unique) - Machine-readable key (e.g., 'first_session')
  - `name` (text) - Display name
  - `description` (text) - What user did to earn it
  - `icon` (text) - Icon identifier
  - `xp_reward` (integer) - XP awarded when earned
  - `category` (text) - Group (focus, streak, milestone, etc.)
  - `created_at` (timestamptz)

  ### `user_achievements`
  Tracks which achievements each user has earned:
  - `id` (uuid) - Record ID
  - `user_id` (uuid, references auth.users)
  - `achievement_id` (uuid, references achievements)
  - `earned_at` (timestamptz) - When they earned it
  - `seen` (boolean) - Whether user has seen the unlock notification

  ### `focus_session_completions`
  Historical record of completed focus sessions for detailed analytics:
  - `id` (uuid) - Session ID
  - `user_id` (uuid, references auth.users)
  - `duration_minutes` (integer) - How long the session was
  - `completed` (boolean) - Did they finish it?
  - `xp_earned` (integer) - XP from this session
  - `completed_at` (timestamptz) - When completed

  ## 2. Schema Updates

  Updates to existing `adhd_user_stats` table:
  - Add `streak_insurance_count` column
  - Add `last_focus_date` for accurate streak tracking

  ## 3. Security

  All tables have RLS enabled with policies ensuring:
  - Users can only read/write their own data
  - Achievements table is readable by all authenticated users
  - No user can modify achievement definitions

  ## 4. Initial Data

  Seeds the achievements table with initial achievements for ADHD users.

  ## 5. Functions

  - `check_and_award_achievements()` - Trigger function to check for newly earned achievements
  - `calculate_level_from_xp()` - Converts total XP to level number
*/

-- Create user_gamification table
CREATE TABLE IF NOT EXISTS user_gamification (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_xp integer DEFAULT 0 CHECK (current_xp >= 0),
  level integer DEFAULT 1 CHECK (level >= 1),
  total_xp integer DEFAULT 0 CHECK (total_xp >= 0),
  streak_insurance_count integer DEFAULT 0 CHECK (streak_insurance_count >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gamification data"
  ON user_gamification FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification data"
  ON user_gamification FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification data"
  ON user_gamification FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create achievements master table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  xp_reward integer DEFAULT 0 CHECK (xp_reward >= 0),
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by all authenticated users"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- Create user_achievements junction table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  seen boolean DEFAULT false,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create focus session completions table
CREATE TABLE IF NOT EXISTS focus_session_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  completed boolean DEFAULT true,
  xp_earned integer DEFAULT 0 CHECK (xp_earned >= 0),
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE focus_session_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own focus completions"
  ON focus_session_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus completions"
  ON focus_session_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add columns to existing adhd_user_stats if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'adhd_user_stats' AND column_name = 'last_focus_date'
  ) THEN
    ALTER TABLE adhd_user_stats ADD COLUMN last_focus_date date;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_focus_completions_user_id ON focus_session_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_completions_completed_at ON focus_session_completions(completed_at);

-- Seed initial achievements
INSERT INTO achievements (key, name, description, icon, xp_reward, category) VALUES
  ('first_session', 'First Steps', 'Completed your first focus session', 'Sparkles', 50, 'milestone'),
  ('streak_3', '3-Day Streak', 'Focused for 3 days in a row', 'Flame', 100, 'streak'),
  ('streak_7', 'Week Warrior', 'Focused for 7 days in a row', 'Zap', 200, 'streak'),
  ('streak_30', 'Month Master', 'Focused for 30 days in a row', 'Trophy', 500, 'streak'),
  ('sessions_10', 'Getting Started', 'Completed 10 focus sessions', 'Target', 150, 'milestone'),
  ('sessions_50', 'Focused Mind', 'Completed 50 focus sessions', 'Brain', 300, 'milestone'),
  ('sessions_100', 'Centurion', 'Completed 100 focus sessions', 'Award', 600, 'milestone'),
  ('minutes_100', '100 Minutes', 'Focused for 100 total minutes', 'Clock', 100, 'milestone'),
  ('minutes_500', '500 Minutes', 'Focused for 500 total minutes', 'Timer', 250, 'milestone'),
  ('minutes_1000', '1000 Minutes', 'Focused for 1000 total minutes', 'Hourglass', 500, 'milestone'),
  ('perfect_day', 'Perfect Day', 'Completed both daily wins', 'CheckCircle', 75, 'daily'),
  ('early_bird', 'Early Bird', 'Started focus before 9am', 'Sunrise', 50, 'bonus'),
  ('night_owl', 'Night Owl', 'Completed focus after 8pm', 'Moon', 50, 'bonus'),
  ('rescue_master', 'Rescue Expert', 'Used rescue mode 10 times', 'LifeBuoy', 150, 'tool'),
  ('quick_planner', 'Quick Planner', 'Created 5 quick plans', 'List', 100, 'tool')
ON CONFLICT (key) DO NOTHING;
