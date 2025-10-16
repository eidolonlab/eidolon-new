/*
  # Security Fixes Part 2 - Optimize RLS for ADHD Tables

  ## Changes
  Update RLS policies to use (select auth.uid()) pattern for better performance.
  This prevents re-evaluation of auth.uid() for each row.

  ## Tables Updated
  - focus_sessions
  - rescue_sessions
  - quick_plans
  - meaningful_wins
  - focus_user_settings
  - adhd_user_stats
*/

-- Focus Sessions
DROP POLICY IF EXISTS "Users can view own focus sessions" ON focus_sessions;
DROP POLICY IF EXISTS "Users can insert own focus sessions" ON focus_sessions;
DROP POLICY IF EXISTS "Users can update own focus sessions" ON focus_sessions;
DROP POLICY IF EXISTS "Users can delete own focus sessions" ON focus_sessions;

CREATE POLICY "Users can view own focus sessions"
  ON focus_sessions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own focus sessions"
  ON focus_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own focus sessions"
  ON focus_sessions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own focus sessions"
  ON focus_sessions FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Rescue Sessions
DROP POLICY IF EXISTS "Users can view own rescue sessions" ON rescue_sessions;
DROP POLICY IF EXISTS "Users can insert own rescue sessions" ON rescue_sessions;
DROP POLICY IF EXISTS "Users can update own rescue sessions" ON rescue_sessions;
DROP POLICY IF EXISTS "Users can delete own rescue sessions" ON rescue_sessions;

CREATE POLICY "Users can view own rescue sessions"
  ON rescue_sessions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own rescue sessions"
  ON rescue_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own rescue sessions"
  ON rescue_sessions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own rescue sessions"
  ON rescue_sessions FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Quick Plans
DROP POLICY IF EXISTS "Users can view own quick plans" ON quick_plans;
DROP POLICY IF EXISTS "Users can insert own quick plans" ON quick_plans;
DROP POLICY IF EXISTS "Users can update own quick plans" ON quick_plans;
DROP POLICY IF EXISTS "Users can delete own quick plans" ON quick_plans;

CREATE POLICY "Users can view own quick plans"
  ON quick_plans FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own quick plans"
  ON quick_plans FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own quick plans"
  ON quick_plans FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own quick plans"
  ON quick_plans FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Meaningful Wins
DROP POLICY IF EXISTS "Users can view own meaningful wins" ON meaningful_wins;
DROP POLICY IF EXISTS "Users can insert own meaningful wins" ON meaningful_wins;
DROP POLICY IF EXISTS "Users can update own meaningful wins" ON meaningful_wins;
DROP POLICY IF EXISTS "Users can delete own meaningful wins" ON meaningful_wins;

CREATE POLICY "Users can view own meaningful wins"
  ON meaningful_wins FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own meaningful wins"
  ON meaningful_wins FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own meaningful wins"
  ON meaningful_wins FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own meaningful wins"
  ON meaningful_wins FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Focus User Settings
DROP POLICY IF EXISTS "Users can view own focus settings" ON focus_user_settings;
DROP POLICY IF EXISTS "Users can insert own focus settings" ON focus_user_settings;
DROP POLICY IF EXISTS "Users can update own focus settings" ON focus_user_settings;

CREATE POLICY "Users can view own focus settings"
  ON focus_user_settings FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own focus settings"
  ON focus_user_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own focus settings"
  ON focus_user_settings FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ADHD User Stats
DROP POLICY IF EXISTS "Users can view own ADHD stats" ON adhd_user_stats;
DROP POLICY IF EXISTS "Users can insert own ADHD stats" ON adhd_user_stats;
DROP POLICY IF EXISTS "Users can update own ADHD stats" ON adhd_user_stats;

CREATE POLICY "Users can view own ADHD stats"
  ON adhd_user_stats FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own ADHD stats"
  ON adhd_user_stats FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own ADHD stats"
  ON adhd_user_stats FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));