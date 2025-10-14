/*
  # Multi-Environment System with User Activity Tracking
  
  ## Overview
  Creates a comprehensive system for managing multiple environments (dev/staging/production)
  with detailed user activity tracking and access control.
  
  ## New Tables
  
  ### 1. `environments`
  Manages different deployment environments
  - `id` (uuid, primary key)
  - `name` (text) - dev, staging, production
  - `display_name` (text) - Human-readable name
  - `is_active` (boolean) - Whether environment is currently active
  - `config` (jsonb) - Environment-specific configuration
  - `created_at` (timestamptz)
  
  ### 2. `environment_access`
  Controls who can access which environments
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `environment_id` (uuid, references environments)
  - `access_level` (text) - viewer, editor, admin
  - `granted_by` (uuid) - Who granted access
  - `granted_at` (timestamptz)
  
  ### 3. `user_activities`
  Tracks all user actions across the platform
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `activity_type` (text) - login, logout, weave_created, etc.
  - `activity_data` (jsonb) - Additional context data
  - `environment` (text) - Which environment
  - `ip_address` (text) - User's IP
  - `user_agent` (text) - Browser/device info
  - `session_duration_ms` (integer) - How long the session lasted
  - `created_at` (timestamptz)
  
  ### 4. `feature_flags`
  Environment-based feature toggle system
  - `id` (uuid, primary key)
  - `flag_key` (text, unique) - Unique identifier
  - `name` (text) - Human-readable name
  - `description` (text)
  - `enabled_environments` (text[]) - Which environments it's enabled in
  - `config` (jsonb) - Additional configuration
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Security
  - Row Level Security enabled on all tables
  - Only authenticated users can access
  - Environment access controlled by environment_access table
  - Admin users have full access to all environments
*/

-- Create environments table
CREATE TABLE IF NOT EXISTS environments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  is_active boolean DEFAULT true,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create environment access table
CREATE TABLE IF NOT EXISTS environment_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  environment_id uuid REFERENCES environments(id) ON DELETE CASCADE NOT NULL,
  access_level text NOT NULL CHECK (access_level IN ('viewer', 'editor', 'admin')),
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  UNIQUE(user_id, environment_id)
);

-- Create user activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  environment text DEFAULT 'production',
  ip_address text,
  user_agent text,
  session_duration_ms integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster activity queries
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_environment ON user_activities(environment);

-- Create feature flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  enabled_environments text[] DEFAULT ARRAY['dev'],
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default environments
INSERT INTO environments (name, display_name, config) VALUES
  ('dev', 'Development', '{"description": "Development environment for active feature work", "auto_sync": true, "public_access": false}'),
  ('staging', 'Staging', '{"description": "Pre-production testing environment", "require_approval": false, "public_access": false}'),
  ('production', 'Production', '{"description": "Live production environment", "require_approval": true, "public_access": true}')
ON CONFLICT (name) DO NOTHING;

-- Insert default feature flags
INSERT INTO feature_flags (flag_key, name, description, enabled_environments) VALUES
  ('advanced_analytics', 'Advanced Analytics', 'Enable advanced analytics dashboard', ARRAY['dev', 'staging']),
  ('beta_features', 'Beta Features', 'Access to experimental beta features', ARRAY['dev']),
  ('admin_panel', 'Admin Panel', 'Access to admin dashboard', ARRAY['dev', 'staging', 'production']),
  ('user_activity_tracking', 'User Activity Tracking', 'Track detailed user activities', ARRAY['dev', 'staging', 'production']),
  ('environment_switcher', 'Environment Switcher', 'Allow switching between environments', ARRAY['dev', 'staging'])
ON CONFLICT (flag_key) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Environments policies
CREATE POLICY "Anyone can view environments"
  ON environments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage environments"
  ON environments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Environment access policies
CREATE POLICY "Users can view their own access"
  ON environment_access FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all access"
  ON environment_access FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- User activities policies
CREATE POLICY "Users can view own activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert activities"
  ON user_activities FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND admin_users.role = 'admin'
    )
  );

-- Feature flags policies
CREATE POLICY "Authenticated users can view feature flags"
  ON feature_flags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage feature flags"
  ON feature_flags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND admin_users.role = 'admin'
    )
  );