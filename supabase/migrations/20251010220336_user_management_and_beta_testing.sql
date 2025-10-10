/*
  # User Management and Beta Testing Schema

  1. New Tables
    - `beta_features` - Feature flags and rollout management
    - `beta_invitations` - Beta testing invitations
    - `user_feedback` - User feedback and bug reports
    - `deployments` - Deployment tracking

  2. Security
    - Enable RLS on all new tables
    - Add policies for admin access and user feedback
*/

-- Beta Features Table
CREATE TABLE IF NOT EXISTS beta_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  enabled_for_roles text[] DEFAULT ARRAY[]::text[],
  enabled_for_users text[] DEFAULT ARRAY[]::text[],
  rollout_percentage integer DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  status text DEFAULT 'development' CHECK (status IN ('development', 'beta', 'production', 'deprecated')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE beta_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read beta features"
  ON beta_features
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage beta features"
  ON beta_features
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'developer')
    )
  );

-- Beta Invitations Table
CREATE TABLE IF NOT EXISTS beta_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  invited_by uuid REFERENCES admin_users(id),
  features text[] DEFAULT ARRAY[]::text[],
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
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'developer')
    )
  );

-- User Feedback Table
CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
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
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read their own feedback"
  ON user_feedback
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all feedback"
  ON user_feedback
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
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
  features text[] DEFAULT ARRAY[]::text[],
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
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'developer')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beta_features_status ON beta_features(status);
CREATE INDEX IF NOT EXISTS idx_beta_features_rollout ON beta_features(rollout_percentage);
CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(type);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_priority ON user_feedback(priority);
CREATE INDEX IF NOT EXISTS idx_deployments_environment ON deployments(environment);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);

-- Insert sample beta features
INSERT INTO beta_features (name, description, enabled_for_roles, rollout_percentage, status) VALUES
  ('StoryGraph', 'Visual knowledge map of people, places, projects & promises', ARRAY['beta_tester', 'admin']::text[], 0, 'beta'),
  ('Voice Memory Interface', 'Speak your memories with emotional analysis', ARRAY['admin']::text[], 0, 'development'),
  ('Biometric Integration', 'Heart rate and stress monitoring during training', ARRAY[]::text[], 0, 'development'),
  ('Advanced Analytics', 'Detailed memory performance analytics', ARRAY['beta_tester']::text[], 25, 'beta'),
  ('Social Memory Sharing', 'Share memories with family and friends', ARRAY[]::text[], 0, 'development')
ON CONFLICT (name) DO NOTHING;