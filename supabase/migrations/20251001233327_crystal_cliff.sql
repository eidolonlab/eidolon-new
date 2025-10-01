/*
  # User Management and Beta Testing Schema

  1. New Tables
    - `beta_features`
      - `id` (uuid, primary key)
      - `name` (text, feature name)
      - `description` (text, feature description)
      - `enabled_for_roles` (text[], roles that have access)
      - `enabled_for_users` (text[], specific user IDs with access)
      - `rollout_percentage` (integer, 0-100 percentage rollout)
      - `status` (text, development/beta/production/deprecated)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `beta_invitations`
      - `id` (uuid, primary key)
      - `email` (text, invited email)
      - `invited_by` (uuid, admin who sent invitation)
      - `features` (text[], features they'll have access to)
      - `status` (text, pending/accepted/expired)
      - `expires_at` (timestamp)
      - `accepted_at` (timestamp, nullable)
      - `created_at` (timestamp)

    - `user_feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `feature_id` (uuid, references beta_features.id, nullable)
      - `type` (text, bug/feature_request/general/beta_feedback)
      - `title` (text, feedback title)
      - `description` (text, feedback content)
      - `priority` (text, low/medium/high/critical)
      - `status` (text, open/in_progress/resolved/closed)
      - `admin_response` (text, nullable)
      - `resolved_at` (timestamp, nullable)
      - `created_at` (timestamp)

    - `deployments`
      - `id` (uuid, primary key)
      - `environment` (text, staging/production)
      - `version` (text, version number)
      - `commit_hash` (text, git commit hash)
      - `deployed_by` (uuid, references admin_users.id)
      - `status` (text, pending/deploying/success/failed/rolled_back)
      - `build_time` (integer, seconds)
      - `features` (text[], deployed features)
      - `notes` (text, deployment notes)
      - `rollback_target` (uuid, references deployments.id, nullable)
      - `deployed_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for admin access
    - Add policies for user feedback submission

  3. Indexes
    - Add indexes for common queries
    - Add indexes for user lookups and feature checks
*/

-- Beta Features Table
CREATE TABLE IF NOT EXISTS beta_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  enabled_for_roles text[] DEFAULT '{}',
  enabled_for_users text[] DEFAULT '{}',
  rollout_percentage integer DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  status text DEFAULT 'development' CHECK (status IN ('development', 'beta', 'production', 'deprecated')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE beta_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage beta features"
  ON beta_features
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = email() 
      AND admin_users.role IN ('admin', 'developer')
    )
  );

-- Beta Invitations Table
CREATE TABLE IF NOT EXISTS beta_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  invited_by uuid REFERENCES admin_users(id),
  features text[] DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE beta_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage beta invitations"
  ON beta_invitations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = email() 
      AND admin_users.role IN ('admin', 'developer')
    )
  );

-- User Feedback Table
CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  feature_id uuid REFERENCES beta_features(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('bug', 'feature_request', 'general', 'beta_feedback')),
  title text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_response text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit their own feedback"
  ON user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = uid());

CREATE POLICY "Users can read their own feedback"
  ON user_feedback
  FOR SELECT
  TO authenticated
  USING (user_id = uid());

CREATE POLICY "Admins can manage all feedback"
  ON user_feedback
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = email() 
      AND admin_users.role IN ('admin', 'developer')
    )
  );

-- Deployments Table
CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  environment text NOT NULL CHECK (environment IN ('staging', 'production')),
  version text NOT NULL,
  commit_hash text NOT NULL,
  deployed_by uuid REFERENCES admin_users(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'deploying', 'success', 'failed', 'rolled_back')),
  build_time integer DEFAULT 0,
  features text[] DEFAULT '{}',
  notes text,
  rollback_target uuid REFERENCES deployments(id),
  deployed_at timestamptz DEFAULT now()
);

ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage deployments"
  ON deployments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = email() 
      AND admin_users.role IN ('admin', 'developer')
    )
  );

-- Add beta_features column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'beta_features'
  ) THEN
    ALTER TABLE users ADD COLUMN beta_features text[] DEFAULT '{}';
  END IF;
END $$;

-- Add role column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text DEFAULT 'regular_user' CHECK (role IN ('beta_tester', 'regular_user', 'admin', 'developer'));
  END IF;
END $$;

-- Add status column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'status'
  ) THEN
    ALTER TABLE users ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended'));
  END IF;
END $$;

-- Add metadata column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE users ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- Add feedback_count column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'feedback_count'
  ) THEN
    ALTER TABLE users ADD COLUMN feedback_count integer DEFAULT 0;
  END IF;
END $$;

-- Add session_count column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'session_count'
  ) THEN
    ALTER TABLE users ADD COLUMN session_count integer DEFAULT 0;
  END IF;
END $$;

-- Add avg_coherence_score column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'avg_coherence_score'
  ) THEN
    ALTER TABLE users ADD COLUMN avg_coherence_score numeric(5,2) DEFAULT 0;
  END IF;
END $$;

-- Add onboarding_completed column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE users ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beta_features_status ON beta_features(status);
CREATE INDEX IF NOT EXISTS idx_beta_features_rollout ON beta_features(rollout_percentage);
CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(type);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_priority ON user_feedback(priority);
CREATE INDEX IF NOT EXISTS idx_deployments_environment ON deployments(environment);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Function to check if user has access to a feature
CREATE OR REPLACE FUNCTION user_has_feature_access(
  user_hash_param text,
  feature_id_param uuid
) RETURNS boolean AS $$
DECLARE
  user_record users%ROWTYPE;
  feature_record beta_features%ROWTYPE;
  user_number integer;
  threshold integer;
BEGIN
  -- Get user record
  SELECT * INTO user_record FROM users WHERE user_hash = user_hash_param;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Get feature record
  SELECT * INTO feature_record FROM beta_features WHERE id = feature_id_param;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if user's role is enabled
  IF user_record.role = ANY(feature_record.enabled_for_roles) THEN
    RETURN true;
  END IF;

  -- Check if user is specifically enabled
  IF user_record.id::text = ANY(feature_record.enabled_for_users) THEN
    RETURN true;
  END IF;

  -- Check rollout percentage
  IF feature_record.rollout_percentage > 0 THEN
    -- Use last 4 characters of user_hash as pseudo-random number
    user_number := ('x' || right(user_record.user_hash, 4))::bit(16)::integer;
    threshold := (feature_record.rollout_percentage::float / 100 * 65535)::integer;
    
    IF user_number < threshold THEN
      RETURN true;
    END IF;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin stats with user management data
CREATE OR REPLACE FUNCTION get_admin_stats_with_users() RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM users),
    'beta_testers', (SELECT COUNT(*) FROM users WHERE role = 'beta_tester'),
    'active_users_7d', (SELECT COUNT(*) FROM users WHERE last_active > now() - interval '7 days'),
    'total_weaves', (SELECT COUNT(*) FROM memory_weaves),
    'total_sessions', (SELECT COUNT(*) FROM retrieval_sessions),
    'avg_coherence_score', (SELECT COALESCE(AVG(coherence_score), 0) FROM memory_weaves),
    'avg_recall_latency', (SELECT COALESCE(AVG(latency_ms), 0) FROM retrieval_sessions),
    'completion_rate', (
      SELECT COALESCE(
        (COUNT(*) FILTER (WHERE completed = true)::float / NULLIF(COUNT(*), 0)) * 100, 
        0
      ) FROM memory_weaves WHERE weave_type = 'future'
    ),
    'feedback_count', (SELECT COUNT(*) FROM user_feedback),
    'bug_reports', (SELECT COUNT(*) FROM user_feedback WHERE type = 'bug'),
    'feature_requests', (SELECT COUNT(*) FROM user_feedback WHERE type = 'feature_request')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample beta features
INSERT INTO beta_features (name, description, enabled_for_roles, rollout_percentage, status) VALUES
  ('StoryGraph', 'Visual knowledge map of people, places, projects & promises', ARRAY['beta_tester', 'admin'], 0, 'beta'),
  ('Voice Memory Interface', 'Speak your memories with emotional analysis', ARRAY['admin'], 0, 'development'),
  ('Biometric Integration', 'Heart rate and stress monitoring during training', ARRAY[], 0, 'development'),
  ('Advanced Analytics', 'Detailed memory performance analytics', ARRAY['beta_tester'], 25, 'beta'),
  ('Social Memory Sharing', 'Share memories with family and friends', ARRAY[], 0, 'development')
ON CONFLICT (name) DO NOTHING;