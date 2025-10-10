/*
  # User Authentication and Profile Setup

  1. Changes
    - Update users table to link with auth.users
    - Add automatic user profile creation on signup
    - Update RLS policies to use auth.uid() correctly
    - Create function to auto-generate user_hash

  2. Security
    - All tables secured with RLS
    - Users can only access their own data
    - Automatic user profile creation on first login
*/

-- Function to generate user hash from auth user ID
CREATE OR REPLACE FUNCTION generate_user_hash(user_id uuid)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(sha256(user_id::text::bytea), 'hex');
END;
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, user_hash, is_anonymous, created_at, last_active)
  VALUES (
    NEW.id,
    NEW.email,
    generate_user_hash(NEW.id),
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update existing users table policies for better auth integration
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update memory_weaves policies
DROP POLICY IF EXISTS "Users can read own weaves" ON memory_weaves;
DROP POLICY IF EXISTS "Users can insert own weaves" ON memory_weaves;
DROP POLICY IF EXISTS "Users can update own weaves" ON memory_weaves;
DROP POLICY IF EXISTS "Users can delete own weaves" ON memory_weaves;

CREATE POLICY "Users can read own weaves"
  ON memory_weaves
  FOR SELECT
  TO authenticated
  USING (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert own weaves"
  ON memory_weaves
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own weaves"
  ON memory_weaves
  FOR UPDATE
  TO authenticated
  USING (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete own weaves"
  ON memory_weaves
  FOR DELETE
  TO authenticated
  USING (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

-- Update retrieval_sessions policies
DROP POLICY IF EXISTS "Users can read own sessions" ON retrieval_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON retrieval_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON retrieval_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON retrieval_sessions;

CREATE POLICY "Users can read own sessions"
  ON retrieval_sessions
  FOR SELECT
  TO authenticated
  USING (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert own sessions"
  ON retrieval_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own sessions"
  ON retrieval_sessions
  FOR UPDATE
  TO authenticated
  USING (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete own sessions"
  ON retrieval_sessions
  FOR DELETE
  TO authenticated
  USING (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

-- Update analytics_events policies
DROP POLICY IF EXISTS "Users can insert own analytics" ON analytics_events;
DROP POLICY IF EXISTS "Users can read own analytics" ON analytics_events;

CREATE POLICY "Users can insert own analytics"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can read own analytics"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

-- Update clinical_outcomes policies
DROP POLICY IF EXISTS "Users can manage own outcomes" ON clinical_outcomes;
DROP POLICY IF EXISTS "Users can read own outcomes" ON clinical_outcomes;
DROP POLICY IF EXISTS "Users can insert own outcomes" ON clinical_outcomes;
DROP POLICY IF EXISTS "Users can update own outcomes" ON clinical_outcomes;

CREATE POLICY "Users can read own outcomes"
  ON clinical_outcomes
  FOR SELECT
  TO authenticated
  USING (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert own outcomes"
  ON clinical_outcomes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own outcomes"
  ON clinical_outcomes
  FOR UPDATE
  TO authenticated
  USING (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    user_hash = (SELECT user_hash FROM users WHERE id = auth.uid())
  );

-- Helper function to get current user's hash
CREATE OR REPLACE FUNCTION get_current_user_hash()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_hash_result text;
BEGIN
  SELECT user_hash INTO user_hash_result
  FROM users
  WHERE id = auth.uid();

  RETURN user_hash_result;
END;
$$;
