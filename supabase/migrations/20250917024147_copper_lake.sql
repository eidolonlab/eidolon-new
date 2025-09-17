/*
  # Add initial admin user

  This migration adds the first admin user to access the dashboard.
  Replace the email with your actual admin email address.
*/

-- Insert initial admin user (replace with your email)
INSERT INTO admin_users (email, role, permissions)
VALUES (
  'admin@tryeidolon.com', -- Replace with your email
  'admin',
  '{"dashboard": true, "export": true, "analytics": true}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions;