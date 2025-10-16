/*
  # Security Fixes Part 3 - Optimize RLS for Memory Tables

  ## Changes
  Update RLS policies to use (select get_current_user_hash()) pattern and consolidate duplicate policies
  These tables use user_hash instead of user_id

  ## Tables Updated
  - memory_weaves (consolidate admin/user policies)
  - retrieval_sessions (consolidate admin/user policies)
  - analytics_events (consolidate duplicate policies)
  - clinical_outcomes (consolidate admin/user policies)
*/

-- Memory Weaves - Consolidate policies
DROP POLICY IF EXISTS "Users can read own weaves" ON memory_weaves;
DROP POLICY IF EXISTS "Users can insert own weaves" ON memory_weaves;
DROP POLICY IF EXISTS "Users can update own weaves" ON memory_weaves;
DROP POLICY IF EXISTS "Users can delete own weaves" ON memory_weaves;
DROP POLICY IF EXISTS "Admins can read all data" ON memory_weaves;

CREATE POLICY "Users can read own weaves"
  ON memory_weaves FOR SELECT
  TO authenticated
  USING (user_hash = (select get_current_user_hash()));

CREATE POLICY "Users can insert own weaves"
  ON memory_weaves FOR INSERT
  TO authenticated
  WITH CHECK (user_hash = (select get_current_user_hash()));

CREATE POLICY "Users can update own weaves"
  ON memory_weaves FOR UPDATE
  TO authenticated
  USING (user_hash = (select get_current_user_hash()))
  WITH CHECK (user_hash = (select get_current_user_hash()));

CREATE POLICY "Users can delete own weaves"
  ON memory_weaves FOR DELETE
  TO authenticated
  USING (user_hash = (select get_current_user_hash()));

-- Retrieval Sessions - Consolidate policies
DROP POLICY IF EXISTS "Users can read own sessions" ON retrieval_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON retrieval_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON retrieval_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON retrieval_sessions;
DROP POLICY IF EXISTS "Admins can read all sessions" ON retrieval_sessions;

CREATE POLICY "Users can read own sessions"
  ON retrieval_sessions FOR SELECT
  TO authenticated
  USING (user_hash = (select get_current_user_hash()));

CREATE POLICY "Users can insert own sessions"
  ON retrieval_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_hash = (select get_current_user_hash()));

CREATE POLICY "Users can update own sessions"
  ON retrieval_sessions FOR UPDATE
  TO authenticated
  USING (user_hash = (select get_current_user_hash()))
  WITH CHECK (user_hash = (select get_current_user_hash()));

CREATE POLICY "Users can delete own sessions"
  ON retrieval_sessions FOR DELETE
  TO authenticated
  USING (user_hash = (select get_current_user_hash()));

-- Analytics Events - Consolidate duplicate policies
DROP POLICY IF EXISTS "Users can read own analytics" ON analytics_events;
DROP POLICY IF EXISTS "Users can insert own analytics" ON analytics_events;
DROP POLICY IF EXISTS "Admins can read analytics" ON analytics_events;
DROP POLICY IF EXISTS "Allow anonymous analytics insertion" ON analytics_events;

CREATE POLICY "Users can manage own analytics"
  ON analytics_events FOR ALL
  TO authenticated
  USING (user_hash = (select get_current_user_hash()))
  WITH CHECK (user_hash = (select get_current_user_hash()));

-- Clinical Outcomes - Consolidate admin/user policies
DROP POLICY IF EXISTS "Users can read own outcomes" ON clinical_outcomes;
DROP POLICY IF EXISTS "Users can insert own outcomes" ON clinical_outcomes;
DROP POLICY IF EXISTS "Users can update own outcomes" ON clinical_outcomes;
DROP POLICY IF EXISTS "Admins can read clinical outcomes" ON clinical_outcomes;

CREATE POLICY "Users can manage own outcomes"
  ON clinical_outcomes FOR ALL
  TO authenticated
  USING (user_hash = (select get_current_user_hash()))
  WITH CHECK (user_hash = (select get_current_user_hash()));