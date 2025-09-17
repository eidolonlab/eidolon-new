/*
  # Temporarily disable RLS for users table

  This migration temporarily disables Row Level Security on the users table
  to allow anonymous user creation for analytics and consent tracking.
  
  1. Changes
     - Disable RLS on users table to allow anonymous inserts
     - This is necessary for the app to create user records for consent tracking
  
  Note: This is a temporary solution. In production, you may want to implement
  more specific RLS policies that properly handle anonymous user creation.
*/

-- Temporarily disable RLS on users table to allow anonymous user creation
ALTER TABLE users DISABLE ROW LEVEL SECURITY;