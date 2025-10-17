/*
  # Create Accountability Buddies System

  1. New Tables
    - `buddy_connections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `buddy_user_id` (uuid, references auth.users)
      - `status` (text: pending, accepted, declined)
      - `created_at` (timestamptz)
      - `accepted_at` (timestamptz, nullable)

    - `buddy_invites`
      - `id` (uuid, primary key)
      - `from_user_id` (uuid, references auth.users)
      - `invite_code` (text, unique)
      - `max_uses` (integer, default 1)
      - `uses_count` (integer, default 0)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can view their own connections and invites
    - Users can create buddy invites
    - Users can accept buddy invites

  3. Indexes
    - Index on user_id and buddy_user_id for fast lookups
    - Index on invite_code for fast validation
*/

-- Create buddy_connections table
CREATE TABLE IF NOT EXISTS buddy_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  buddy_user_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  UNIQUE(user_id, buddy_user_id)
);

-- Create buddy_invites table
CREATE TABLE IF NOT EXISTS buddy_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES auth.users NOT NULL,
  invite_code text UNIQUE NOT NULL,
  max_uses integer DEFAULT 1,
  uses_count integer DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_buddy_connections_user_id ON buddy_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_buddy_connections_buddy_user_id ON buddy_connections(buddy_user_id);
CREATE INDEX IF NOT EXISTS idx_buddy_connections_status ON buddy_connections(status);
CREATE INDEX IF NOT EXISTS idx_buddy_invites_code ON buddy_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_buddy_invites_from_user ON buddy_invites(from_user_id);

-- Enable RLS
ALTER TABLE buddy_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_invites ENABLE ROW LEVEL SECURITY;

-- Buddy connections policies
CREATE POLICY "Users can view their own connections"
  ON buddy_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = buddy_user_id);

CREATE POLICY "Users can create buddy connections"
  ON buddy_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
  ON buddy_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = buddy_user_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = buddy_user_id);

CREATE POLICY "Users can delete their own connections"
  ON buddy_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = buddy_user_id);

-- Buddy invites policies
CREATE POLICY "Users can view their own invites"
  ON buddy_invites FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id);

CREATE POLICY "Users can create buddy invites"
  ON buddy_invites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can view invites by code"
  ON buddy_invites FOR SELECT
  TO authenticated
  USING (true);

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_buddy_invite_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));

    SELECT EXISTS(
      SELECT 1 FROM buddy_invites WHERE invite_code = code
    ) INTO exists;

    EXIT WHEN NOT exists;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to accept buddy invite
CREATE OR REPLACE FUNCTION accept_buddy_invite(p_invite_code text)
RETURNS jsonb AS $$
DECLARE
  v_invite_record RECORD;
  v_connection_id uuid;
BEGIN
  SELECT * INTO v_invite_record
  FROM buddy_invites
  WHERE invite_code = p_invite_code
    AND uses_count < max_uses
    AND expires_at > now();

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired invite code'
    );
  END IF;

  IF v_invite_record.from_user_id = auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot accept your own invite'
    );
  END IF;

  IF EXISTS (
    SELECT 1 FROM buddy_connections
    WHERE (user_id = auth.uid() AND buddy_user_id = v_invite_record.from_user_id)
       OR (user_id = v_invite_record.from_user_id AND buddy_user_id = auth.uid())
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Already connected with this user'
    );
  END IF;

  INSERT INTO buddy_connections (user_id, buddy_user_id, status, accepted_at)
  VALUES (v_invite_record.from_user_id, auth.uid(), 'accepted', now())
  RETURNING id INTO v_connection_id;

  UPDATE buddy_invites
  SET uses_count = uses_count + 1
  WHERE id = v_invite_record.id;

  RETURN jsonb_build_object(
    'success', true,
    'connection_id', v_connection_id,
    'buddy_user_id', v_invite_record.from_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
