/*
  # Fix Invite Validation Function

  ## Changes
  - Grant execute permissions to authenticated and anon roles
  - Ensure function returns proper JSON format
  - Fix any potential null handling issues
*/

-- Drop and recreate the function with proper permissions
DROP FUNCTION IF EXISTS validate_and_consume_invite(text, text);

CREATE OR REPLACE FUNCTION validate_and_consume_invite(
  p_code text,
  p_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_invite invite_codes%ROWTYPE;
  v_result jsonb;
BEGIN
  -- Find the invite code (case insensitive)
  SELECT * INTO v_invite
  FROM invite_codes
  WHERE UPPER(code) = UPPER(p_code)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (email IS NULL OR LOWER(email) = LOWER(p_email))
  FOR UPDATE;

  -- Check if code exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invalid or expired invite code'
    );
  END IF;

  -- Check if max uses exceeded
  IF v_invite.max_uses IS NOT NULL AND v_invite.used_count >= v_invite.max_uses THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'This invite code has reached its maximum uses'
    );
  END IF;

  -- Code is valid - increment used count
  UPDATE invite_codes
  SET used_count = used_count + 1
  WHERE id = v_invite.id;

  RETURN jsonb_build_object(
    'valid', true,
    'invite_id', v_invite.id::text
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'An error occurred validating the invite code'
    );
END;
$$;

-- Grant execute permissions to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION validate_and_consume_invite(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_and_consume_invite(text, text) TO anon;

-- Add comment for documentation
COMMENT ON FUNCTION validate_and_consume_invite IS 'Validates an invite code and increments usage count. Accessible by authenticated and anonymous users for signup flow.';