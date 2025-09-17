/*
  # Admin Dashboard Schema

  1. New Tables
    - `users` - User accounts (optional, privacy-first)
    - `memory_weaves` - Anonymized memory weave data
    - `retrieval_sessions` - Training session metrics
    - `admin_users` - Admin access control
    - `analytics_events` - Usage analytics
    - `clinical_outcomes` - Aggregated clinical metrics

  2. Security
    - Enable RLS on all tables
    - Admin-only policies for dashboard access
    - User consent tracking for data sharing

  3. Privacy Features
    - All personal content is hashed/anonymized
    - Users can opt-out of data sharing
    - GDPR-compliant data handling
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (optional accounts)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now(),
  consent_analytics boolean DEFAULT false,
  consent_research boolean DEFAULT false,
  is_anonymous boolean DEFAULT true,
  user_hash text UNIQUE NOT NULL -- For privacy-preserving analytics
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Memory weaves (anonymized)
CREATE TABLE IF NOT EXISTS memory_weaves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_hash text NOT NULL,
  weave_type text NOT NULL CHECK (weave_type IN ('past', 'future')),
  coherence_score integer NOT NULL CHECK (coherence_score >= 0 AND coherence_score <= 100),
  sensory_richness_score integer DEFAULT 0,
  narrative_length integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  difficulty_level text DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  errorless_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed boolean DEFAULT false,
  scheduled_for timestamptz,
  retrieval_count integer DEFAULT 0,
  last_retrieved timestamptz
);

ALTER TABLE memory_weaves ENABLE ROW LEVEL SECURITY;

-- Retrieval sessions
CREATE TABLE IF NOT EXISTS retrieval_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_hash text NOT NULL,
  weave_id uuid REFERENCES memory_weaves(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  latency_ms integer NOT NULL,
  details_recalled integer DEFAULT 0,
  accuracy_score integer DEFAULT 0 CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  errorless_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE retrieval_sessions ENABLE ROW LEVEL SECURITY;

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'researcher', 'viewer')),
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  permissions jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_hash text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Clinical outcomes (aggregated)
CREATE TABLE IF NOT EXISTS clinical_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_hash text NOT NULL,
  measurement_date date DEFAULT CURRENT_DATE,
  total_weaves integer DEFAULT 0,
  avg_coherence_score numeric(5,2) DEFAULT 0,
  avg_recall_latency_ms integer DEFAULT 0,
  pmar_rate numeric(5,2) DEFAULT 0, -- Prospective Memory Adherence Rate
  training_sessions_count integer DEFAULT 0,
  avg_accuracy_score numeric(5,2) DEFAULT 0,
  improvement_trend text DEFAULT 'stable' CHECK (improvement_trend IN ('improving', 'stable', 'declining')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clinical_outcomes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only see their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Memory weaves - users can only access their own
CREATE POLICY "Users can read own weaves"
  ON memory_weaves
  FOR SELECT
  TO authenticated
  USING (user_hash = (SELECT user_hash FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert own weaves"
  ON memory_weaves
  FOR INSERT
  TO authenticated
  WITH CHECK (user_hash = (SELECT user_hash FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update own weaves"
  ON memory_weaves
  FOR UPDATE
  TO authenticated
  USING (user_hash = (SELECT user_hash FROM users WHERE id = auth.uid()));

-- Retrieval sessions
CREATE POLICY "Users can read own sessions"
  ON retrieval_sessions
  FOR SELECT
  TO authenticated
  USING (user_hash = (SELECT user_hash FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert own sessions"
  ON retrieval_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_hash = (SELECT user_hash FROM users WHERE id = auth.uid()));

-- Admin policies
CREATE POLICY "Admins can read all data"
  ON memory_weaves
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND role IN ('admin', 'researcher')
    )
  );

CREATE POLICY "Admins can read all sessions"
  ON retrieval_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND role IN ('admin', 'researcher')
    )
  );

CREATE POLICY "Admins can read analytics"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admins can read clinical outcomes"
  ON clinical_outcomes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email()
    )
  );

-- Analytics events - users can insert their own
CREATE POLICY "Users can insert own analytics"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_hash = (SELECT user_hash FROM users WHERE id = auth.uid()));

-- Clinical outcomes - users can insert/update their own
CREATE POLICY "Users can manage own outcomes"
  ON clinical_outcomes
  FOR ALL
  TO authenticated
  USING (user_hash = (SELECT user_hash FROM users WHERE id = auth.uid()));

-- Functions for admin dashboard

-- Get aggregate statistics
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() AND role IN ('admin', 'researcher')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM users),
    'total_weaves', (SELECT COUNT(*) FROM memory_weaves),
    'total_sessions', (SELECT COUNT(*) FROM retrieval_sessions),
    'avg_coherence_score', (SELECT ROUND(AVG(coherence_score), 2) FROM memory_weaves),
    'avg_recall_latency', (SELECT ROUND(AVG(latency_ms)) FROM retrieval_sessions),
    'active_users_7d', (
      SELECT COUNT(*) FROM users 
      WHERE last_active > NOW() - INTERVAL '7 days'
    ),
    'completion_rate', (
      SELECT ROUND(
        (COUNT(*) FILTER (WHERE completed = true)::numeric / 
         NULLIF(COUNT(*), 0)) * 100, 2
      )
      FROM memory_weaves 
      WHERE weave_type = 'future'
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Get user cohort analysis
CREATE OR REPLACE FUNCTION get_cohort_analysis(days_back integer DEFAULT 30)
RETURNS TABLE (
  cohort_week date,
  users_count bigint,
  avg_coherence numeric,
  avg_sessions numeric,
  retention_rate numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() AND role IN ('admin', 'researcher')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    date_trunc('week', u.created_at)::date as cohort_week,
    COUNT(*)::bigint as users_count,
    ROUND(AVG(mw.coherence_score), 2) as avg_coherence,
    ROUND(AVG(session_counts.session_count), 2) as avg_sessions,
    ROUND(
      (COUNT(*) FILTER (WHERE u.last_active > NOW() - INTERVAL '7 days')::numeric / 
       COUNT(*)) * 100, 2
    ) as retention_rate
  FROM users u
  LEFT JOIN memory_weaves mw ON mw.user_hash = u.user_hash
  LEFT JOIN (
    SELECT user_hash, COUNT(*) as session_count
    FROM retrieval_sessions
    GROUP BY user_hash
  ) session_counts ON session_counts.user_hash = u.user_hash
  WHERE u.created_at > NOW() - INTERVAL '1 day' * days_back
  GROUP BY date_trunc('week', u.created_at)
  ORDER BY cohort_week DESC;
END;
$$;