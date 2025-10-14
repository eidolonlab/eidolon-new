# Environment Access & Deployment Management Guide

## Quick Overview

Your Eidolon app now has three separate environments managed through **environment switching** rather than separate URLs. All environments share the same codebase and database, but feature access and data visibility are controlled by the current environment setting.

---

## How the System Works

### Single Codebase, Multiple Environments

Unlike traditional multi-environment setups with separate URLs, this system uses:

- **One URL** for your application
- **Environment switcher** in the Admin Dashboard
- **Context-aware behavior** based on current environment
- **Feature flags** to control what's enabled per environment

### Environment Storage

The current environment is stored in:
1. **Browser localStorage**: Persists across page reloads
2. **Environment context**: Available throughout the app
3. **Activity logs**: All actions are tagged with the environment they occurred in

---

## Accessing Different Environments

### For Admins (You)

#### 1. Access the Admin Dashboard
```
1. Go to your app URL (e.g., https://yourapp.com)
2. Click login and sign in with your admin account
3. Navigate to /admin or click "Admin" in the navigation
```

#### 2. Switch Environments
```
Admin Dashboard → Environments Tab → Click "Switch to [Environment]"
```

When you switch environments:
- ✅ The entire app context changes to that environment
- ✅ Feature flags for that environment are applied
- ✅ All actions are logged under that environment
- ✅ The page reloads to apply changes
- ⚠️ Settings persist in browser until you switch again

### Current Environment Indicator

You'll see a colored banner showing your current environment:
- 🟢 **Green**: Production (live environment)
- 🟡 **Yellow**: Staging (pre-production testing)
- 🔵 **Blue**: Development (active development)

### For Team Members

Team members can only access environments you've granted them access to:

1. **Default Access**: Everyone can access Production
2. **Restricted Access**: Dev and Staging require explicit grants

#### Granting Access to Team Members

```
1. Admin Dashboard → Environments Tab
2. Select the environment (Dev or Staging)
3. Click "Grant Access" (if button exists) or:
   - Use the programmatic method below
   - Or manually insert into database
```

**Programmatic Access Grant** (via browser console as admin):
```javascript
import { environmentManager } from './lib/environmentManager';

// Grant staging access to a user
await environmentManager.grantEnvironmentAccess(
  'user-uuid-here',
  'staging',
  'editor'  // or 'viewer' or 'admin'
);
```

**Direct Database Access Grant** (via Supabase Dashboard):
```sql
-- First, get the environment ID
SELECT id FROM environments WHERE name = 'staging';

-- Then grant access
INSERT INTO environment_access (user_id, environment_id, access_level, granted_by)
VALUES (
  'user-uuid',
  'environment-uuid-from-above',
  'editor',  -- viewer, editor, or admin
  'your-admin-uuid'
);
```

---

## Promoting Deployments Between Environments

### Important: This System Uses Environment Context, Not Separate Deployments

Since all environments share the same codebase, "promotion" means:
1. Testing features in dev/staging with feature flags
2. Enabling those features in production when ready
3. Optionally deploying new code to your hosting platform

### Recommended Workflow

#### Phase 1: Development
```bash
1. Switch to Development environment in Admin Dashboard
2. Enable feature flags for testing:
   Admin Dashboard → Environments → Toggle features ON for Dev
3. Test new features locally:
   npm run dev
4. Verify everything works as expected
```

#### Phase 2: Staging Validation
```bash
1. Switch to Staging environment in Admin Dashboard
2. Enable feature flags for staging:
   Admin Dashboard → Environments → Toggle features ON for Staging
3. Deploy to your hosting platform (Vercel/Netlify):
   npm run build
   vercel --prod  # or your deployment command
4. Test with your team in staging environment
5. Monitor Activity Analytics for any issues
```

#### Phase 3: Production Release
```bash
1. After staging approval, ensure latest code is deployed
2. Switch to Production environment in Admin Dashboard
3. Enable feature flags gradually:
   Admin Dashboard → Environments → Toggle features ON for Production
4. Monitor Activity Analytics closely:
   Admin Dashboard → Activity Tab
5. Watch for:
   - Error rates
   - User engagement
   - Feature usage patterns
```

### Emergency Rollback

If you need to quickly disable a problematic feature:

```bash
1. Admin Dashboard → Environments Tab
2. Toggle the feature flag OFF for Production
3. No code deployment needed - takes effect immediately
```

---

## Managing Feature Flags

### What Are Feature Flags?

Feature flags let you control which features are enabled in each environment without deploying new code.

### Current Feature Flags

| Feature Flag | Purpose | Default Enabled In |
|--------------|---------|-------------------|
| `advanced_analytics` | Advanced analytics dashboard | Dev, Staging |
| `beta_features` | Experimental beta features | Dev only |
| `admin_panel` | Admin dashboard access | All environments |
| `user_activity_tracking` | Track user activities | Production |
| `environment_switcher` | Allow environment switching | Dev, Staging |

### How to Use Feature Flags

#### In Admin Dashboard
```
1. Navigate to: Admin Dashboard → Environments Tab
2. Scroll to "Feature Flags" table
3. Toggle switches for each environment:
   - Left (Gray) = Disabled
   - Right (Green) = Enabled
```

#### In Your Code
```typescript
import { environmentManager } from './lib/environmentManager';

// Check if a feature is enabled
const showAdvancedAnalytics = await environmentManager.isFeatureEnabled('advanced_analytics');

if (showAdvancedAnalytics) {
  // Show advanced analytics UI
}
```

#### Adding New Feature Flags

**Via Supabase Dashboard**:
```sql
INSERT INTO feature_flags (flag_key, name, description, enabled_environments)
VALUES (
  'new_feature',
  'New Feature Name',
  'Description of what this feature does',
  ARRAY['dev']  -- Start with dev only
);
```

**Via Admin API** (future enhancement):
```typescript
// This would need to be added to your admin dashboard
await supabase.from('feature_flags').insert({
  flag_key: 'new_feature',
  name: 'New Feature Name',
  description: 'Description',
  enabled_environments: ['dev']
});
```

---

## Monitoring & Activity Tracking

### Viewing User Activity

```
1. Admin Dashboard → Activity Tab
2. Filter by:
   - Time range (24h, 7d, 30d, all time)
   - Activity type (login, weave_created, etc.)
   - Environment (dev, staging, production)
```

### Key Metrics to Monitor

#### After Feature Release:
- ✅ **Total Activities**: Should increase with new feature usage
- ✅ **Unique Users**: Track adoption rate
- ✅ **Activity by Environment**: Ensure production activity looks normal
- ⚠️ **Error patterns**: Look for unusual activity spikes

#### Activity Types Tracked:
- `login` - User logged in
- `logout` - User logged out
- `weave_created` - Memory weave created
- `weave_modified` - Memory weave updated
- `session_started` - Retrieval session began
- `environment_switched` - User/admin changed environments
- `feature_flag_updated` - Feature flag configuration changed
- `access_granted` - User given environment access
- `access_revoked` - User environment access removed

### Exporting Activity Data

```
1. Admin Dashboard → Activity Tab
2. Click "Export CSV" button
3. Opens CSV file with:
   - Timestamp
   - User ID
   - Activity Type
   - Environment
   - Session Duration
   - User Agent (browser/device info)
```

---

## Database Management

### Environment Tables

Your database now has these new tables:

#### 1. `environments`
Stores environment configurations
```sql
SELECT * FROM environments;
-- Shows: dev, staging, production with their configs
```

#### 2. `environment_access`
Controls who can access which environments
```sql
-- View all access grants
SELECT
  u.email,
  e.name as environment,
  ea.access_level,
  ea.granted_at
FROM environment_access ea
JOIN auth.users u ON u.id = ea.user_id
JOIN environments e ON e.id = ea.environment_id;
```

#### 3. `user_activities`
Logs all user actions
```sql
-- View recent activities
SELECT
  ua.activity_type,
  ua.environment,
  ua.created_at,
  u.email
FROM user_activities ua
LEFT JOIN auth.users u ON u.id = ua.user_id
ORDER BY ua.created_at DESC
LIMIT 100;
```

#### 4. `feature_flags`
Manages feature toggles
```sql
-- View all feature flags
SELECT
  flag_key,
  name,
  enabled_environments
FROM feature_flags;
```

### Useful Database Queries

#### Check Your Own Access
```sql
SELECT
  e.name as environment,
  ea.access_level
FROM environment_access ea
JOIN environments e ON e.id = ea.environment_id
WHERE ea.user_id = auth.uid();
```

#### View Environment Usage Stats
```sql
SELECT
  environment,
  COUNT(*) as activity_count,
  COUNT(DISTINCT user_id) as unique_users
FROM user_activities
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY environment
ORDER BY activity_count DESC;
```

#### Find Most Active Users
```sql
SELECT
  u.email,
  COUNT(*) as activity_count,
  MAX(ua.created_at) as last_activity
FROM user_activities ua
LEFT JOIN auth.users u ON u.id = ua.user_id
WHERE ua.created_at > NOW() - INTERVAL '7 days'
GROUP BY u.email
ORDER BY activity_count DESC
LIMIT 10;
```

---

## Security & Access Control

### Who Can Access What?

#### Production Environment
- ✅ **Anyone** can access (public)
- ✅ Unauthenticated users see login screen
- ✅ Authenticated users can use the app

#### Staging Environment
- ✅ **Admins** automatically have access
- ✅ **Granted users** with explicit access
- ❌ Everyone else is blocked

#### Development Environment
- ✅ **Admins** automatically have access
- ✅ **Technical team** with explicit access
- ❌ Everyone else is blocked

### Access Levels Explained

1. **Viewer**
   - Can view and use features
   - Cannot modify configurations
   - Cannot grant access to others

2. **Editor**
   - Can view and use features
   - Can test and modify data
   - Cannot grant access to others

3. **Admin**
   - Full access to everything
   - Can modify configurations
   - Can grant/revoke access
   - Can manage feature flags

### Best Practices

✅ **Do:**
- Keep dev and staging access restricted
- Grant minimum necessary access level
- Review access grants monthly
- Monitor activity logs for unusual patterns
- Test feature flags in dev before staging
- Test in staging before enabling in production

❌ **Don't:**
- Give everyone admin access
- Test untested features directly in production
- Share admin credentials
- Enable all feature flags at once in production
- Ignore activity analytics

---

## Troubleshooting

### "Access Denied" Error

**Problem**: User gets "Access denied to [environment] environment"

**Solutions**:
1. Check if user has access grant:
   ```sql
   SELECT * FROM environment_access WHERE user_id = 'user-uuid';
   ```
2. Grant access via admin dashboard or database
3. User should refresh page after access grant

### Environment Not Switching

**Problem**: Environment stays on production even after switching

**Solutions**:
1. Clear browser localStorage and try again
2. Hard refresh the page (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify user has access to target environment

### Feature Flag Not Working

**Problem**: Feature enabled but not showing up

**Solutions**:
1. Check current environment:
   - Admin Dashboard shows current environment
2. Verify feature is enabled for current environment:
   ```sql
   SELECT * FROM feature_flags WHERE flag_key = 'your-feature';
   ```
3. Hard refresh the page
4. Check browser console for errors

### Activity Not Being Tracked

**Problem**: No activities showing in Activity Analytics

**Solutions**:
1. Verify `user_activity_tracking` feature flag is enabled
2. Check database connection
3. Look for JavaScript errors in browser console
4. Ensure user is authenticated

---

## Quick Reference Commands

### Environment Management
```bash
# Development
npm run dev                    # Start local dev server

# Building
npm run build                  # Build for production
npm run preview               # Preview production build locally

# Deployment (example for Vercel)
vercel                        # Deploy to preview
vercel --prod                 # Deploy to production

# Mobile
npm run build:mobile          # Build and sync mobile apps
npm run ios:open              # Open iOS project
npm run android:open          # Open Android project
```

### Browser Console Commands (as Admin)

```javascript
// Check current environment
environmentManager.getCurrentEnvironment()

// Check if feature is enabled
await environmentManager.isFeatureEnabled('feature_key')

// Get available environments
await environmentManager.getAvailableEnvironments()

// Get user activities
await environmentManager.getUserActivities(null, 100)
```

---

## Summary: Your Deployment Workflow

### Daily Development Workflow
```
1. Login as admin
2. Switch to Development environment
3. Enable features you want to test
4. Develop and test locally (npm run dev)
5. Review activity logs for any issues
```

### Weekly Staging Releases
```
1. Switch to Staging environment
2. Enable features ready for QA
3. Deploy latest code: npm run build && vercel --prod
4. Test with team members
5. Review Activity Analytics
6. Get approval before production
```

### Production Releases
```
1. Ensure latest code is deployed
2. Switch to Production environment
3. Enable feature flags ONE AT A TIME
4. Monitor Activity Analytics closely
5. Keep Admin Dashboard open for quick rollback
```

### Emergency Situations
```
1. Admin Dashboard → Environments
2. Toggle problematic feature OFF immediately
3. No code deployment needed
4. Takes effect instantly
5. Review activity logs to understand impact
```

---

## Next Steps

1. **Try It Out**:
   - Login to your admin account
   - Navigate to Admin Dashboard → Environments
   - Switch between dev, staging, and production
   - Toggle some feature flags

2. **Invite Your Team**:
   - Add team members to auth.users
   - Grant them staging access
   - Have them test the staging environment

3. **Set Up Monitoring**:
   - Check Activity Analytics daily
   - Export and review activity logs
   - Monitor feature adoption rates

4. **Plan Your First Release**:
   - Pick a feature to release
   - Test in dev → staging → production
   - Monitor closely after release

---

**Need Help?**
- Review the Activity logs for errors
- Check browser console for frontend issues
- Review Supabase logs for database issues
- Re-read this guide for specific scenarios

**Last Updated**: January 2025
