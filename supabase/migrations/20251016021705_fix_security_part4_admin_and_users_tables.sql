/*
  # Security Fixes Part 4 - Admin Tables and Users RLS

  ## Changes
  1. Enable RLS on users table
  2. Consolidate duplicate policies on admin-related tables
  3. Optimize all admin policies with (select ...) pattern

  ## Tables Updated
  - users (enable RLS, consolidate policies)
  - admin_users
  - beta_features
  - beta_invitations
  - user_feedback
  - deployments
  - environments
  - environment_access
  - user_activities
  - feature_flags
*/

-- ==========================================
-- ENABLE RLS ON USERS TABLE
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users table - Consolidate policies (uses id column)
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can manage own profile"
  ON users FOR ALL
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- ==========================================
-- ADMIN USERS
-- ==========================================

DROP POLICY IF EXISTS "Users can read own admin data" ON admin_users;
DROP POLICY IF EXISTS "Users can insert own admin record" ON admin_users;
DROP POLICY IF EXISTS "Users can update own admin data" ON admin_users;

CREATE POLICY "Users can manage own admin data"
  ON admin_users FOR ALL
  TO authenticated
  USING (email = (select auth.jwt() ->> 'email'))
  WITH CHECK (email = (select auth.jwt() ->> 'email'));

-- ==========================================
-- BETA FEATURES - Keep read for all, write for admins
-- ==========================================

DROP POLICY IF EXISTS "Anyone can read beta features" ON beta_features;
DROP POLICY IF EXISTS "Admins can manage beta features" ON beta_features;

CREATE POLICY "All authenticated users can read beta features"
  ON beta_features FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage beta features"
  ON beta_features FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  );

-- ==========================================
-- BETA INVITATIONS
-- ==========================================

DROP POLICY IF EXISTS "Admins can manage beta invitations" ON beta_invitations;

CREATE POLICY "Admins can manage beta invitations"
  ON beta_invitations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  );

-- ==========================================
-- USER FEEDBACK - Consolidate duplicate policies
-- ==========================================

DROP POLICY IF EXISTS "Users can read their own feedback" ON user_feedback;
DROP POLICY IF EXISTS "Users can submit their own feedback" ON user_feedback;
DROP POLICY IF EXISTS "Admins can manage all feedback" ON user_feedback;

CREATE POLICY "Users can manage own feedback"
  ON user_feedback FOR ALL
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  )
  WITH CHECK (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  );

-- ==========================================
-- DEPLOYMENTS
-- ==========================================

DROP POLICY IF EXISTS "Admins can manage deployments" ON deployments;

CREATE POLICY "Admins can manage deployments"
  ON deployments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  );

-- ==========================================
-- ENVIRONMENTS - Keep read for all, write for admins
-- ==========================================

DROP POLICY IF EXISTS "Anyone can view environments" ON environments;
DROP POLICY IF EXISTS "Admins can manage environments" ON environments;

CREATE POLICY "All authenticated users can view environments"
  ON environments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage environments"
  ON environments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  );

-- ==========================================
-- ENVIRONMENT ACCESS - Consolidate policies
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own access" ON environment_access;
DROP POLICY IF EXISTS "Admins can manage all access" ON environment_access;

CREATE POLICY "Users can manage own environment access"
  ON environment_access FOR ALL
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  )
  WITH CHECK (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  );

-- ==========================================
-- USER ACTIVITIES - Consolidate policies
-- ==========================================

DROP POLICY IF EXISTS "Users can view own activities" ON user_activities;
DROP POLICY IF EXISTS "System can insert activities" ON user_activities;
DROP POLICY IF EXISTS "Admins can view all activities" ON user_activities;

CREATE POLICY "Users can view own activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  );

CREATE POLICY "System can insert activities"
  ON user_activities FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- FEATURE FLAGS - Keep read for all, write for admins
-- ==========================================

DROP POLICY IF EXISTS "Authenticated users can view feature flags" ON feature_flags;
DROP POLICY IF EXISTS "Admins can manage feature flags" ON feature_flags;

CREATE POLICY "All authenticated users can view feature flags"
  ON feature_flags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage feature flags"
  ON feature_flags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = (select auth.jwt() ->> 'email')
      AND role = 'admin'
    )
  );