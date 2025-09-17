/*
  # Fix anonymous user creation policy

  1. Security Changes
    - Add proper RLS policy for anonymous users to insert records
    - Allow anonymous role to create user records for consent tracking
    - Ensure policy works with auth.role() = 'anon'
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow anonymous user creation" ON users;

-- Create a proper policy for anonymous users
CREATE POLICY "Enable insert for anonymous users"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also ensure authenticated users can still insert their own data
CREATE POLICY "Enable insert for authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);