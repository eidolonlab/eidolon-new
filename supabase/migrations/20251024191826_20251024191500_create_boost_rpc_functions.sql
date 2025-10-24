/*
  # Create RPC Functions for Boost System
  
  Workaround for PostgREST schema cache issue. These functions allow
  the frontend to access boost data via RPC calls instead of direct table access.
*/

-- Function to get all active boost activities for a pillar
CREATE OR REPLACE FUNCTION rpc_get_boost_activities(p_pillar text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT *
      FROM boost_activities
      WHERE pillar = p_pillar
        AND is_active = true
      ORDER BY sort_order
    ) t
  );
END;
$$;

GRANT EXECUTE ON FUNCTION rpc_get_boost_activities(text) TO anon, authenticated;

-- Function to get user's boost completions for today
CREATE OR REPLACE FUNCTION rpc_get_today_completions(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today_start timestamptz;
  v_today_end timestamptz;
BEGIN
  v_today_start := date_trunc('day', now());
  v_today_end := v_today_start + interval '1 day';
  
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT activity_id
      FROM boost_completions
      WHERE user_id = p_user_id
        AND completed_at >= v_today_start
        AND completed_at < v_today_end
    ) t
  );
END;
$$;

GRANT EXECUTE ON FUNCTION rpc_get_today_completions(uuid) TO authenticated;

-- Function to get user's boost streak
CREATE OR REPLACE FUNCTION rpc_get_boost_streak(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT row_to_json(t)
    FROM (
      SELECT *
      FROM boost_streaks
      WHERE user_id = p_user_id
    ) t
  );
END;
$$;

GRANT EXECUTE ON FUNCTION rpc_get_boost_streak(uuid) TO authenticated;

-- Function to record a boost completion
CREATE OR REPLACE FUNCTION rpc_record_boost_completion(
  p_user_id uuid,
  p_activity_id uuid,
  p_duration_ms integer,
  p_mood_before integer DEFAULT NULL,
  p_mood_after integer DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_completion_id uuid;
  v_xp_awarded integer := 10;
BEGIN
  -- Insert the completion
  INSERT INTO boost_completions (
    user_id,
    activity_id,
    duration_ms,
    mood_before,
    mood_after,
    notes,
    xp_awarded
  ) VALUES (
    p_user_id,
    p_activity_id,
    p_duration_ms,
    p_mood_before,
    p_mood_after,
    p_notes,
    v_xp_awarded
  )
  RETURNING id INTO v_completion_id;
  
  RETURN json_build_object(
    'success', true,
    'completion_id', v_completion_id,
    'xp_awarded', v_xp_awarded
  );
END;
$$;

GRANT EXECUTE ON FUNCTION rpc_record_boost_completion(uuid, uuid, integer, integer, integer, text) TO authenticated;