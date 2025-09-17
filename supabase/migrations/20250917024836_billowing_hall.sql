/*
  # Fix analytics events RLS policy for anonymous users

  1. Security Changes
    - Add policy to allow anonymous users to insert analytics events
    - This enables tracking of anonymous usage statistics as intended

  2. Changes
    - Create policy "Allow anonymous analytics insertion" for INSERT operations
    - Policy allows both anonymous (anon) and authenticated users to insert events
*/

-- Allow anonymous users to insert analytics events
CREATE POLICY "Allow anonymous analytics insertion"
  ON analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);