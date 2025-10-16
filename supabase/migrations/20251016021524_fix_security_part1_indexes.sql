/*
  # Security Fixes Part 1 - Foreign Key Indexes

  ## Changes
  Add missing foreign key indexes for optimal query performance

  ## Indexes Added
  - beta_invitations.invited_by
  - deployments.deployed_by, rollback_target  
  - environment_access.environment_id, granted_by
  - quick_plans.used_in_session_id
  - retrieval_sessions.weave_id
  - user_feedback.feature_id, user_id
*/

-- Beta invitations
CREATE INDEX IF NOT EXISTS idx_beta_invitations_invited_by 
  ON beta_invitations(invited_by);

-- Deployments
CREATE INDEX IF NOT EXISTS idx_deployments_deployed_by 
  ON deployments(deployed_by);

CREATE INDEX IF NOT EXISTS idx_deployments_rollback_target 
  ON deployments(rollback_target);

-- Environment access
CREATE INDEX IF NOT EXISTS idx_environment_access_environment_id 
  ON environment_access(environment_id);

CREATE INDEX IF NOT EXISTS idx_environment_access_granted_by 
  ON environment_access(granted_by);

-- Quick plans
CREATE INDEX IF NOT EXISTS idx_quick_plans_used_in_session_id 
  ON quick_plans(used_in_session_id);

-- Retrieval sessions
CREATE INDEX IF NOT EXISTS idx_retrieval_sessions_weave_id 
  ON retrieval_sessions(weave_id);

-- User feedback
CREATE INDEX IF NOT EXISTS idx_user_feedback_feature_id 
  ON user_feedback(feature_id);

CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id_fk 
  ON user_feedback(user_id);