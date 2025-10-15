/*
  # Fix Admin Users RLS Policies
  
  This migration adds RLS policies to allow admin account creation and management.
  
  ## Changes
  
  1. **RLS Policies Added**:
     - Allow authenticated users to insert their own admin record during signup
     - Allow authenticated users to read their own admin data
     - Allow authenticated users to update their own admin data
  
  ## Security Notes
  
  - Users can only create admin records for their own email (matches auth.email())
  - Users can only read/update their own admin data
  - This enables self-service admin account creation at /admin
  - First signup automatically becomes an admin (by design for easy setup)
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert own admin record" ON admin_users;
DROP POLICY IF EXISTS "Users can read own admin data" ON admin_users;
DROP POLICY IF EXISTS "Users can update own admin data" ON admin_users;

-- Allow users to insert their own admin record during signup
-- This checks that the email being inserted matches the authenticated user's email
CREATE POLICY "Users can insert own admin record"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    email = auth.jwt()->>'email'
  );

-- Allow users to read their own admin data
CREATE POLICY "Users can read own admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    email = auth.jwt()->>'email'
  );

-- Allow users to update their own admin data
CREATE POLICY "Users can update own admin data"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    email = auth.jwt()->>'email'
  )
  WITH CHECK (
    email = auth.jwt()->>'email'
  );
