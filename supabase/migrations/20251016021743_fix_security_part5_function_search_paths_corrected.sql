/*
  # Security Fixes Part 5 - Function Search Paths

  ## Changes
  Fix mutable search paths in all functions to prevent security vulnerabilities

  ## Functions Updated
  - generate_user_hash(uuid)
  - handle_new_user()
  - get_current_user_hash()
  - update_adhd_stats()
  - get_admin_stats()
  - get_cohort_analysis(integer)

  ## Security Impact
  Setting search_path to 'public, pg_temp' makes functions immune to 
  search_path manipulation attacks and ensures predictable behavior.
*/

-- Update all functions to have immutable search path
ALTER FUNCTION generate_user_hash(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION get_current_user_hash() SET search_path = public, pg_temp;
ALTER FUNCTION update_adhd_stats() SET search_path = public, pg_temp;
ALTER FUNCTION get_admin_stats() SET search_path = public, pg_temp;
ALTER FUNCTION get_cohort_analysis(integer) SET search_path = public, pg_temp;