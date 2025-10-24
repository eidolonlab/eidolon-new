/*
  # Create ADHD Boosts Enhancement System

  ## Overview
  Implements the 4-pillar ADHD enhancement framework:
  1. Switch Control - Attention shifting micro-interventions
  2. Strength Engine - ADHD strengths tracking and celebration
  3. Body Balance - Physical coordination and balance activities
  4. Time Navigation - Time blindness support and urgency visualization

  ## New Tables

  ### `boost_activities`
  Master table of all boost activities/exercises
  - `id` (uuid, primary key)
  - `pillar` (text) - which pillar: switch_control, strength_engine, body_balance, time_navigation
  - `type` (text) - activity subtype
  - `name` (text) - display name
  - `description` (text) - user-facing description
  - `duration_seconds` (integer) - expected duration
  - `difficulty_level` (integer) - 1-5 scale
  - `animation_data` (jsonb) - animation config
  - `encouragement_text` (jsonb) - array of encouragement messages
  - `instructions` (jsonb) - step-by-step instructions
  - `is_active` (boolean) - feature flag per activity
  - `sort_order` (integer) - display ordering
  - `created_at` (timestamptz)

  ### `boost_completions`
  Tracks user completions of boost activities
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `activity_id` (uuid, foreign key)
  - `completed_at` (timestamptz)
  - `duration_ms` (integer) - actual duration taken
  - `mood_before` (integer) - 1-5 scale, nullable
  - `mood_after` (integer) - 1-5 scale, nullable
  - `notes` (text) - user notes, nullable
  - `xp_awarded` (integer) - gamification integration

  ### `boost_streaks`
  Tracks user boost streaks and statistics
  - `user_id` (uuid, primary key)
  - `current_streak` (integer) - consecutive days
  - `longest_streak` (integer) - all-time best
  - `last_boost_date` (date) - most recent boost day
  - `total_boosts_completed` (integer) - lifetime count
  - `total_xp_earned` (integer) - from boosts
  - `updated_at` (timestamptz)

  ### `strength_moments`
  Pillar 2: Tracks user strength manifestations
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `strength_type` (text) - creative, intuitive, energetic, compassionate
  - `description` (text) - what the user did
  - `spark_score` (integer) - 1-100 energy level
  - `created_at` (timestamptz)

  ### `time_anchors`
  Pillar 4: User's time navigation tasks
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `task_name` (text)
  - `urgency_level` (text) - now, soon, later
  - `estimated_minutes` (integer)
  - `is_completed` (boolean)
  - `completed_at` (timestamptz, nullable)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Admin users have read access to all data
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: boost_activities (master data)
CREATE TABLE IF NOT EXISTS boost_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar text NOT NULL CHECK (pillar IN ('switch_control', 'strength_engine', 'body_balance', 'time_navigation')),
  type text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  duration_seconds integer NOT NULL DEFAULT 30,
  difficulty_level integer NOT NULL DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  animation_data jsonb DEFAULT '{}'::jsonb,
  encouragement_text jsonb DEFAULT '[]'::jsonb,
  instructions jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table 2: boost_completions
CREATE TABLE IF NOT EXISTS boost_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id uuid NOT NULL REFERENCES boost_activities(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  duration_ms integer NOT NULL,
  mood_before integer CHECK (mood_before BETWEEN 1 AND 5),
  mood_after integer CHECK (mood_after BETWEEN 1 AND 5),
  notes text,
  xp_awarded integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Table 3: boost_streaks
CREATE TABLE IF NOT EXISTS boost_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_boost_date date,
  total_boosts_completed integer DEFAULT 0,
  total_xp_earned integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Table 4: strength_moments (Pillar 2)
CREATE TABLE IF NOT EXISTS strength_moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strength_type text NOT NULL CHECK (strength_type IN ('creative', 'intuitive', 'energetic', 'compassionate')),
  description text NOT NULL,
  spark_score integer NOT NULL DEFAULT 50 CHECK (spark_score BETWEEN 1 AND 100),
  created_at timestamptz DEFAULT now()
);

-- Table 5: time_anchors (Pillar 4)
CREATE TABLE IF NOT EXISTS time_anchors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_name text NOT NULL,
  urgency_level text NOT NULL DEFAULT 'later' CHECK (urgency_level IN ('now', 'soon', 'later')),
  estimated_minutes integer DEFAULT 30,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_boost_completions_user_id ON boost_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_boost_completions_activity_id ON boost_completions(activity_id);
CREATE INDEX IF NOT EXISTS idx_boost_completions_completed_at ON boost_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_strength_moments_user_id ON strength_moments(user_id);
CREATE INDEX IF NOT EXISTS idx_time_anchors_user_id ON time_anchors(user_id);
CREATE INDEX IF NOT EXISTS idx_boost_activities_pillar ON boost_activities(pillar);
CREATE INDEX IF NOT EXISTS idx_boost_activities_is_active ON boost_activities(is_active);

-- Enable Row Level Security
ALTER TABLE boost_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE boost_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boost_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE strength_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_anchors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boost_activities (public read, admin write)
CREATE POLICY "Anyone can view active boost activities"
  ON boost_activities FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage boost activities"
  ON boost_activities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- RLS Policies for boost_completions
CREATE POLICY "Users can view own boost completions"
  ON boost_completions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own boost completions"
  ON boost_completions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own boost completions"
  ON boost_completions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all boost completions"
  ON boost_completions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- RLS Policies for boost_streaks
CREATE POLICY "Users can view own boost streaks"
  ON boost_streaks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own boost streaks"
  ON boost_streaks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own boost streaks"
  ON boost_streaks FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for strength_moments
CREATE POLICY "Users can view own strength moments"
  ON strength_moments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own strength moments"
  ON strength_moments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own strength moments"
  ON strength_moments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own strength moments"
  ON strength_moments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for time_anchors
CREATE POLICY "Users can view own time anchors"
  ON time_anchors FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own time anchors"
  ON time_anchors FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own time anchors"
  ON time_anchors FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own time anchors"
  ON time_anchors FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to update boost streaks
CREATE OR REPLACE FUNCTION update_boost_streak(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_last_boost_date date;
  v_current_date date := CURRENT_DATE;
  v_current_streak integer := 0;
  v_longest_streak integer := 0;
BEGIN
  -- Get or create streak record
  INSERT INTO boost_streaks (user_id, current_streak, longest_streak)
  VALUES (p_user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get last boost date
  SELECT last_boost_date, current_streak, longest_streak
  INTO v_last_boost_date, v_current_streak, v_longest_streak
  FROM boost_streaks
  WHERE user_id = p_user_id;

  -- Calculate new streak
  IF v_last_boost_date IS NULL OR v_last_boost_date = v_current_date THEN
    -- First boost or same day - keep current streak
    v_current_streak := COALESCE(v_current_streak, 0);
  ELSIF v_last_boost_date = v_current_date - INTERVAL '1 day' THEN
    -- Yesterday - increment streak
    v_current_streak := v_current_streak + 1;
  ELSE
    -- Streak broken - reset to 1
    v_current_streak := 1;
  END IF;

  -- Update longest streak if needed
  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  -- Update the record
  UPDATE boost_streaks
  SET
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_boost_date = v_current_date,
    total_boosts_completed = total_boosts_completed + 1,
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update streak when boost is completed
CREATE OR REPLACE FUNCTION trigger_update_boost_streak()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_boost_streak(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_boost_completion_update_streak
  AFTER INSERT ON boost_completions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_boost_streak();

-- Insert seed data for boost activities
INSERT INTO boost_activities (pillar, type, name, description, duration_seconds, difficulty_level, instructions, encouragement_text, sort_order) VALUES
-- Pillar 1: Switch Control
('switch_control', 'glitch_switch', 'Stand & Stretch', 'Quick physical reset to break rumination loops', 30, 1,
  '["Stand up from your seat", "Reach arms overhead", "Take 3 deep breaths", "Shake out your body"]'::jsonb,
  '["You''re doing it!", "Feel that energy shift?", "Nice work breaking the loop!"]'::jsonb, 1),

('switch_control', 'glitch_switch', 'Object Focus', 'Ground yourself by describing your surroundings', 30, 1,
  '["Look at an object near you", "Describe 3 details about it", "Touch it if you can", "Notice how you feel now"]'::jsonb,
  '["Great awareness!", "You''re present now", "That''s the shift!"]'::jsonb, 2),

('switch_control', 'grounding', 'Breath Trace', 'Follow the moving line with your breath', 60, 2,
  '["Watch the expanding circle", "Breathe in as it grows", "Breathe out as it shrinks", "Match your breath to the rhythm"]'::jsonb,
  '["Perfect rhythm", "You''re centered now", "Beautiful breathing!"]'::jsonb, 3),

('switch_control', 'momentum', 'Two Minute Start', 'Just begin. We''ll stay with you.', 120, 1,
  '["Pick the thing you''ve been avoiding", "Set timer for 2 minutes", "Start. Just start.", "You did it!"]'::jsonb,
  '["You started! That''s huge!", "Momentum is building", "See? You can do hard things!"]'::jsonb, 4),

('switch_control', 'emergency', 'Panic Redirect', 'Quick support when you''re overwhelmed', 90, 1,
  '["You''re okay. Breathe.", "Name 3 things you can see", "Pick ONE small action", "Do just that one thing"]'::jsonb,
  '["You''re safe", "One step at a time", "I''m here with you", "You''re doing great"]'::jsonb, 5),

-- Pillar 3: Body Balance
('body_balance', 'balance', 'Single-Leg Stand', 'Balance on one leg to activate coordination', 30, 2,
  '["Stand near a wall for safety", "Lift one foot off the ground", "Hold for 30 seconds", "Switch legs and repeat"]'::jsonb,
  '["Steady!", "You''ve got this!", "Balance champion!"]'::jsonb, 6),

('body_balance', 'balance', 'Eyes-Closed Balance', 'Advanced balance for attention boost', 20, 3,
  '["Stand with feet together", "Close your eyes", "Hold steady for 20 seconds", "Notice how focused you feel"]'::jsonb,
  '["Impressive!", "Your brain is working hard!", "Focus activated!"]'::jsonb, 7),

('body_balance', 'coordination', 'Jump Reset', 'Quick energy burst and coordination', 30, 1,
  '["Stand with space around you", "Jump 10 times", "Clap at the top of each jump", "Feel that energy!"]'::jsonb,
  '["Energy boost!", "You''re powered up!", "Fantastic!"]'::jsonb, 8),

('body_balance', 'coordination', 'Pattern Throw', 'Hand-eye coordination challenge', 60, 3,
  '["Take a soft object (ball, rolled socks)", "Toss from hand to hand", "Count to 20 catches", "Try not to drop it!"]'::jsonb,
  '["Smooth!", "Coordination unlocked!", "Your brain is learning!"]'::jsonb, 9),

('body_balance', 'strength', 'Plank Hold', 'Core strength and attention', 30, 3,
  '["Get into plank position", "Hold for 30 seconds", "Focus on your breathing", "You''re stronger than you think!"]'::jsonb,
  '["Strength!", "You''re powerful!", "Core engaged!"]'::jsonb, 10),

('body_balance', 'coordination', 'Wall Touch Sprint', 'Quick movement coordination', 20, 2,
  '["Stand facing a wall", "Touch wall with both hands", "Step back 2 paces", "Repeat 10 times quickly"]'::jsonb,
  '["Speed!", "Coordination master!", "You''re quick!"]'::jsonb, 11)

ON CONFLICT DO NOTHING;
