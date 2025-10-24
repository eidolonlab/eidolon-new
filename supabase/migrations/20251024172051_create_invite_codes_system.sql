/*
  # Create Invite Codes System

  1. New Tables
    - `invite_codes` - Store invite codes for user registration
      - `id` (uuid, primary key)
      - `code` (text, unique) - The invite code
      - `email` (text, nullable) - Optional email restriction
      - `max_uses` (integer, nullable) - Maximum number of uses (null = unlimited)
      - `used_count` (integer) - Current number of uses
      - `expires_at` (timestamptz, nullable) - Expiration date (null = never expires)
      - `is_active` (boolean) - Whether the code is active
      - `created_by` (uuid) - Admin who created the code
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on invite_codes table
    - Add policy for anonymous users to validate codes (read-only)
    - Add policy for admins to manage codes

  3. Sample Data
    - Insert FOUNDER2024, DEMO2024, and BETA2024 codes
*/

-- Create invite_codes table
CREATE TABLE IF NOT EXISTS invite_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  email text,
  max_uses integer,
  used_count integer DEFAULT 0 NOT NULL,
  expires_at timestamptz,
  is_active boolean DEFAULT true NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT invite_codes_code_format CHECK (length(code) >= 4),
  CONSTRAINT invite_codes_used_count_check CHECK (used_count >= 0),
  CONSTRAINT invite_codes_max_uses_check CHECK (max_uses IS NULL OR max_uses > 0)
);

-- Enable RLS
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users to validate codes (read-only for validation)
CREATE POLICY "Anyone can validate invite codes"
  ON invite_codes
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  );

-- Policy for admins to manage invite codes
CREATE POLICY "Admins can manage invite codes"
  ON invite_codes
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
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_active ON invite_codes(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_invite_codes_expires_at ON invite_codes(expires_at);

-- Insert the three invite codes
INSERT INTO invite_codes (code, max_uses, expires_at, is_active) VALUES
  ('FOUNDER2024', NULL, NULL, true),
  ('DEMO2024', NULL, NULL, true),
  ('BETA2024', NULL, NULL, true)
ON CONFLICT (code) DO NOTHING;
