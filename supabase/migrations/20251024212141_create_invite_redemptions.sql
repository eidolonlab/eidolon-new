/*
  # Create Invite Redemptions System

  1. New Tables
    - `invite_redemptions`
      - `id` (uuid, primary key)
      - `invite_code_id` (uuid, references invite_codes)
      - `user_id` (uuid, references auth.users)
      - `email` (text) - Email of user who redeemed
      - `redeemed_at` (timestamptz)

  2. Security
    - Enable RLS on invite_redemptions table
    - Users can view their own redemptions
    - System can insert redemptions

  3. Indexes
    - Index on invite_code_id for fast lookups
    - Index on user_id for user history
*/

-- Create invite_redemptions table
CREATE TABLE IF NOT EXISTS invite_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code_id uuid REFERENCES invite_codes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  redeemed_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invite_redemptions_invite_code_id ON invite_redemptions(invite_code_id);
CREATE INDEX IF NOT EXISTS idx_invite_redemptions_user_id ON invite_redemptions(user_id);

-- Enable RLS
ALTER TABLE invite_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own redemptions"
  ON invite_redemptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert redemptions"
  ON invite_redemptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);