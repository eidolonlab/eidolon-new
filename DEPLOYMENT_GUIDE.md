# Eidolon Deployment & Environment Management Guide

## Table of Contents
1. [Overview](#overview)
2. [Environment Architecture](#environment-architecture)
3. [Access Control](#access-control)
4. [Deployment Workflow](#deployment-workflow)
5. [Feature Flags](#feature-flags)
6. [User Activity Tracking](#user-activity-tracking)
7. [Security Best Practices](#security-best-practices)

---

## Overview

Eidolon uses a three-tier environment system to ensure safe, controlled deployments:

- **Development (dev)**: Active feature development and testing
- **Staging**: Pre-production testing and QA
- **Production**: Live environment for end users

Only you (as the owner) and explicitly authorized users can access non-production environments. Production is the only public-facing environment.

---

## Environment Architecture

### Environment Structure

Each environment is isolated with its own:
- Feature flag configuration
- Access control list
- Activity tracking
- Database state (shared but environment-aware)

### Environment Database Schema

```sql
-- Environments table
environments (
  id uuid PRIMARY KEY,
  name text UNIQUE, -- 'dev', 'staging', 'production'
  display_name text,
  is_active boolean,
  config jsonb,
  created_at timestamptz
)

-- Environment access control
environment_access (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  environment_id uuid REFERENCES environments,
  access_level text, -- 'viewer', 'editor', 'admin'
  granted_by uuid,
  granted_at timestamptz
)
```

---

## Access Control

### Default Access Rules

1. **Production Environment**
   - Public access (anyone can access)
   - All users see the login screen
   - Only authenticated users can use features

2. **Staging Environment**
   - Restricted access
   - Only users with explicit access grants
   - Admins have automatic access

3. **Development Environment**
   - Most restricted
   - Only technical team members
   - Requires admin-level permissions

### Granting Access

As an admin, you can grant access through the Admin Dashboard:

1. Navigate to Admin Dashboard → Environments
2. Select the environment
3. Click "Grant Access"
4. Enter user email and select access level:
   - **Viewer**: Read-only access, can view but not modify
   - **Editor**: Can make changes and test features
   - **Admin**: Full control including access management

### Programmatic Access Control

```typescript
import { environmentManager } from './lib/environmentManager';

// Check if user has access
const hasAccess = await environmentManager.checkEnvironmentAccess('staging');

// Grant access to a user
await environmentManager.grantEnvironmentAccess(
  userId,
  'staging',
  'editor'
);

// Revoke access
await environmentManager.revokeEnvironmentAccess(userId, 'staging');
```

---

## Deployment Workflow

### Recommended Deployment Flow

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│ Development │─────>│   Staging   │─────>│  Production  │
│   (dev)     │      │  (staging)  │      │  (prod)      │
└─────────────┘      └─────────────┘      └──────────────┘
     │                      │                      │
     │                      │                      │
  Feature                Testing              Live Users
  Development            & QA                 & Monitoring
```

### Step-by-Step Deployment Process

#### 1. Development Phase
```bash
# Switch to dev environment
# In Admin Dashboard: Environments → Switch to Development

# Develop and test features
npm run dev

# Enable feature flags for testing
# In Admin Dashboard: Environment → Feature Flags → Enable in Dev
```

#### 2. Push to Staging
```bash
# Build the application
npm run build

# Test the production build locally
npm run preview

# Deploy to staging (via your CI/CD or hosting platform)
# Example for Vercel:
vercel --prod --env ENVIRONMENT=staging

# In Admin Dashboard:
# - Switch to Staging environment
# - Enable relevant feature flags
# - Conduct thorough testing
```

#### 3. Deploy to Production
```bash
# After staging approval, deploy to production
vercel --prod --env ENVIRONMENT=production

# In Admin Dashboard:
# - Review all activity logs
# - Enable feature flags gradually (if using rollout)
# - Monitor user activity closely
```

### Rollback Procedure

If issues are detected in production:

1. **Immediate Actions**:
   - Disable problematic feature flags
   - Switch affected users to safe fallback

2. **Code Rollback**:
   ```bash
   # Roll back to previous deployment
   vercel rollback
   ```

3. **Database Rollback** (if needed):
   - Use Supabase dashboard to restore from backup
   - Contact DBA if critical

---

## Feature Flags

### Managing Feature Flags

Feature flags allow you to control feature availability per environment without code changes.

#### In Admin Dashboard

1. Navigate to **Environments** tab
2. View the Feature Flags table
3. Toggle features on/off for each environment

#### Feature Flag Schema

```sql
feature_flags (
  id uuid PRIMARY KEY,
  flag_key text UNIQUE,
  name text,
  description text,
  enabled_environments text[], -- ['dev', 'staging', 'production']
  config jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
```

#### Using Feature Flags in Code

```typescript
import { environmentManager } from './lib/environmentManager';

// Check if feature is enabled
const isEnabled = await environmentManager.isFeatureEnabled('advanced_analytics');

if (isEnabled) {
  // Show advanced analytics features
}
```

### Default Feature Flags

| Flag Key | Name | Enabled In |
|----------|------|------------|
| `advanced_analytics` | Advanced Analytics | Dev, Staging |
| `beta_features` | Beta Features | Dev |
| `admin_panel` | Admin Panel | Dev, Staging, Production |
| `user_activity_tracking` | User Activity Tracking | Production |
| `environment_switcher` | Environment Switcher | Dev, Staging |

---

## User Activity Tracking

### What is Tracked

All user activities are automatically logged:

- Login/logout events
- Memory weave creation/modification
- Session starts/ends
- Environment switches
- Feature flag changes
- Administrative actions

### Activity Schema

```sql
user_activities (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  activity_type text,
  activity_data jsonb,
  environment text,
  ip_address text,
  user_agent text,
  session_duration_ms integer,
  created_at timestamptz
)
```

### Viewing Activity Logs

1. Navigate to Admin Dashboard
2. Click **Activity** tab
3. Filter by:
   - Time range (24h, 7d, 30d, all)
   - Activity type
   - User
   - Environment

### Exporting Activity Data

Click **Export CSV** in the Activity Analytics view to download:
- Full activity history
- User behavior patterns
- Environment usage statistics

---

## Security Best Practices

### 1. Access Management

✅ **Do:**
- Grant minimum necessary permissions
- Review access grants regularly
- Revoke access when no longer needed
- Use viewer role for read-only needs

❌ **Don't:**
- Give admin access to all team members
- Leave unused access grants active
- Share admin credentials

### 2. Environment Isolation

✅ **Do:**
- Test all changes in dev first
- Require staging approval before production
- Monitor production activity closely
- Keep sensitive data only in production

❌ **Don't:**
- Test directly in production
- Skip staging environment
- Use production data in dev/staging

### 3. Feature Rollouts

✅ **Do:**
- Enable features in dev first
- Test thoroughly in staging
- Roll out gradually in production
- Monitor for issues after enabling

❌ **Don't:**
- Enable untested features in production
- Enable all features at once
- Ignore activity metrics after rollout

### 4. Activity Monitoring

✅ **Do:**
- Review activity logs regularly
- Set up alerts for unusual patterns
- Track key metrics (logins, errors)
- Export logs for long-term storage

❌ **Don't:**
- Ignore activity spikes
- Delete activity logs
- Share activity data publicly

---

## Continuous Deployment Best Practices

### CI/CD Integration

1. **Automated Testing**
   ```bash
   npm run lint
   npm run build
   npm test # if you add tests
   ```

2. **Environment Variables**
   ```bash
   # .env.development
   VITE_ENVIRONMENT=dev
   VITE_SUPABASE_URL=your-dev-url

   # .env.staging
   VITE_ENVIRONMENT=staging
   VITE_SUPABASE_URL=your-staging-url

   # .env.production
   VITE_ENVIRONMENT=production
   VITE_SUPABASE_URL=your-prod-url
   ```

3. **Deployment Hooks**
   ```bash
   # pre-deploy: Run tests and lint
   # deploy: Build and deploy
   # post-deploy: Run smoke tests
   # rollback: Automatic rollback on failure
   ```

### Monitoring After Deployment

1. Check Admin Dashboard → Activity for:
   - Error rates
   - User engagement
   - Feature usage

2. Monitor Supabase Dashboard for:
   - Database performance
   - API response times
   - Error logs

3. Set up alerts for:
   - High error rates
   - Unusual traffic patterns
   - Failed authentication attempts

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Mobile
npm run build:mobile     # Build and sync for mobile
npm run ios:open         # Open iOS project in Xcode
npm run android:open     # Open Android project in Android Studio

# Deployment (example for Vercel)
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
vercel rollback          # Rollback last deployment
```

---

## Getting Help

If you encounter issues:

1. Check activity logs in Admin Dashboard
2. Review Supabase logs for database errors
3. Check browser console for frontend errors
4. Review this deployment guide

For technical issues, ensure:
- All environment variables are set correctly
- Database migrations have run successfully
- User has proper access permissions
- Feature flags are configured correctly

---

## Appendix: Database Queries

### Check User Access

```sql
SELECT
  u.email,
  e.name as environment,
  ea.access_level
FROM environment_access ea
JOIN auth.users u ON u.id = ea.user_id
JOIN environments e ON e.id = ea.environment_id
WHERE u.email = 'user@example.com';
```

### View Recent Activities

```sql
SELECT
  u.email,
  ua.activity_type,
  ua.environment,
  ua.created_at
FROM user_activities ua
LEFT JOIN auth.users u ON u.id = ua.user_id
ORDER BY ua.created_at DESC
LIMIT 100;
```

### Check Feature Flag Status

```sql
SELECT
  flag_key,
  name,
  enabled_environments
FROM feature_flags
ORDER BY name;
```

---

**Last Updated**: January 2025
**Version**: 1.0
