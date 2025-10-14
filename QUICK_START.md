# Quick Start: Environment & Deployment Management

## 🎯 What You Need to Know

Your Eidolon app now has a **single URL with three virtual environments** that you can switch between:

- **Production** 🟢 - Live users (public)
- **Staging** 🟡 - Pre-release testing (restricted)
- **Development** 🔵 - Active development (restricted)

**Key Point**: You don't have separate URLs for each environment. Instead, you **switch environments** within the Admin Dashboard, and the app behaves differently based on your current environment.

---

## 🚀 Getting Started (First Time Setup)

### Step 1: Access Your Admin Dashboard
```
1. Go to your app URL (e.g., https://yourapp.com)
2. Login with your admin account
3. Navigate to: /admin
```

### Step 2: Explore the Environments
```
1. Click the orange "Environments" button
2. You'll see three environment cards:
   - Development (blue)
   - Staging (yellow)
   - Production (green - currently active by default)
```

### Step 3: Try Switching Environments
```
1. Click "Switch to Development" on the Dev card
2. Page will reload
3. You'll see a blue banner: "Current Environment: Development"
4. All your actions are now tagged as "dev" in activity logs
```

### Step 4: Explore Feature Flags
```
1. Scroll down to the "Feature Flags" table
2. See which features are enabled in each environment
3. Try toggling a feature on/off for different environments
4. Changes take effect immediately (no code deployment needed!)
```

### Step 5: Check Activity Analytics
```
1. Go back to Admin Dashboard
2. Click the green "Activity" button
3. See all tracked user activities:
   - Who did what
   - In which environment
   - When it happened
```

---

## 📋 Daily Workflow

### For Development Work
```
1. Admin Dashboard → Environments → "Switch to Development"
2. Enable any experimental features you want to test
3. Work locally: npm run dev
4. Test your changes
5. Check Activity tab for any errors
```

### For Staging Review
```
1. Admin Dashboard → Environments → "Switch to Staging"
2. Enable features ready for QA testing
3. Deploy your code: npm run build && vercel --prod
4. Test with your team
5. Review Activity Analytics for issues
```

### For Production Release
```
1. Admin Dashboard → Environments → "Switch to Production"
2. Enable ONE feature flag at a time
3. Monitor Activity Analytics closely
4. Watch for unusual activity or errors
5. If issues arise, disable the feature flag immediately
```

---

## 🎛️ How It Actually Works

### The Simple Explanation

Think of it like this:

**Traditional approach (NOT what you have)**:
```
dev.yourapp.com      → Dev server with dev database
staging.yourapp.com  → Staging server with staging database
yourapp.com          → Production server with production database
```

**Your approach (what you HAVE)**:
```
yourapp.com + [Environment Context]
   ↓
   When environment = "dev":
      - Show dev features
      - Tag activities as "dev"
      - Apply dev feature flags

   When environment = "staging":
      - Show staging features
      - Tag activities as "staging"
      - Apply staging feature flags

   When environment = "production":
      - Show production features
      - Tag activities as "production"
      - Apply production feature flags
```

### What Changes When You Switch?

1. **Feature Visibility**: Feature flags control what's enabled
2. **Activity Logging**: All actions tagged with current environment
3. **UI Indicators**: Color-coded banner shows current environment
4. **Access Behavior**: Production is public, others are restricted

### What Stays the Same?

1. **Database**: All environments share the same database
2. **Code**: Same codebase for all environments
3. **URL**: Same URL for all environments
4. **Users**: Same user accounts across all environments

---

## 🔑 Managing Access

### Who Can Access What (By Default)?

| Environment | You (Admin) | Team Members | Public Users |
|-------------|-------------|--------------|--------------|
| Production | ✅ Yes | ✅ Yes | ✅ Yes (login required) |
| Staging | ✅ Yes | ❌ No | ❌ No |
| Development | ✅ Yes | ❌ No | ❌ No |

### Granting Access to Team Members

**Option 1: Via Supabase Dashboard (Easiest)**
```sql
-- 1. Get the environment ID for staging
SELECT id FROM environments WHERE name = 'staging';
-- Copy the UUID

-- 2. Get your team member's user ID
SELECT id, email FROM auth.users WHERE email = 'teammate@email.com';
-- Copy their UUID

-- 3. Grant them access
INSERT INTO environment_access (user_id, environment_id, access_level)
VALUES (
  'team-member-uuid',
  'staging-environment-uuid',
  'editor'  -- or 'viewer' or 'admin'
);
```

**Option 2: Future Enhancement**
In the future, you can add a UI in the Admin Dashboard to grant access with a form.

---

## 🎚️ Understanding Feature Flags

### What Are They?

Feature flags are like light switches for your features:
- ✅ **ON**: Feature is active and visible
- ❌ **OFF**: Feature is hidden/disabled

### Why Use Them?

1. **Test safely**: Enable in dev, test before enabling in production
2. **Gradual rollout**: Enable for staging team before public
3. **Quick rollback**: Disable instantly if something breaks
4. **No deployment**: Changes take effect immediately

### Current Feature Flags

| Flag | What It Controls | Currently Enabled In |
|------|------------------|---------------------|
| `advanced_analytics` | Advanced analytics dashboard | Dev, Staging |
| `beta_features` | Experimental features | Dev only |
| `admin_panel` | Admin dashboard access | All environments |
| `user_activity_tracking` | Activity logging | Production |
| `environment_switcher` | Environment switching UI | Dev, Staging |

### How to Use Them

**In Admin Dashboard**:
```
1. Environments tab → Feature Flags table
2. Click toggle switch for desired environment
3. Left (gray) = OFF, Right (green) = ON
4. Changes apply immediately!
```

**In Your Code**:
```typescript
// Check if feature should be shown
const isEnabled = await environmentManager.isFeatureEnabled('advanced_analytics');

if (isEnabled) {
  // Show the feature
  return <AdvancedAnalytics />;
}
```

---

## 📊 Monitoring Your App

### Activity Analytics Dashboard

**What It Shows**:
- Total activities across all environments
- Unique users engaging with your app
- Average session duration
- Top activities (what users do most)
- Activities by environment (dev vs staging vs prod)
- Timeline of activity over last 7 days

**How to Access**:
```
Admin Dashboard → Click green "Activity" button
```

**What to Watch For**:
- ✅ **Steady growth**: Good sign
- ⚠️ **Sudden spikes**: Could indicate issues or bot traffic
- ⚠️ **Sharp drops**: Could indicate broken features
- ⚠️ **Error patterns**: Check for repeated failed actions

### Exporting Data

```
Activity Dashboard → "Export CSV" button
→ Downloads complete activity log with:
  - Timestamps
  - User IDs
  - Activity types
  - Environments
  - Session durations
  - Browser/device info
```

---

## 🚨 Emergency Procedures

### If Something Breaks in Production

**Immediate Action (takes 10 seconds)**:
```
1. Admin Dashboard → Environments tab
2. Find the problematic feature in Feature Flags table
3. Toggle it OFF for Production (click the switch)
4. Feature is immediately disabled!
5. No code deployment needed
```

**Follow-Up Actions**:
```
1. Check Activity Analytics for impact:
   - How many users affected?
   - What errors occurred?
   - When did it start?

2. Switch to Development environment:
   - Reproduce the issue
   - Fix the problem
   - Test thoroughly

3. Re-enable when fixed:
   - Test in dev first
   - Test in staging second
   - Re-enable in production last
```

---

## 🎓 Common Scenarios

### Scenario 1: Testing a New Feature

```
1. Switch to Development
2. Enable feature flag for 'dev'
3. Test locally (npm run dev)
4. Fix any issues
5. Deploy code
6. Switch to Staging
7. Enable feature flag for 'staging'
8. Have team test
9. Get approval
10. Switch to Production
11. Enable feature flag for 'production'
12. Monitor Activity Analytics
```

### Scenario 2: Team Member Needs Staging Access

```
1. Open Supabase Dashboard
2. Run this SQL:
   INSERT INTO environment_access (user_id, environment_id, access_level)
   SELECT
     (SELECT id FROM auth.users WHERE email = 'their-email@example.com'),
     (SELECT id FROM environments WHERE name = 'staging'),
     'editor';
3. Tell them to refresh their browser
4. They can now switch to staging!
```

### Scenario 3: Gradual Feature Rollout

```
1. Enable in Dev → Test with yourself
2. Enable in Staging → Test with team (5 people)
3. Enable in Production → All users (monitor closely)
4. If issues → Disable in Production immediately
```

### Scenario 4: Checking What Someone Did

```
1. Admin Dashboard → Activity tab
2. Filter by time range (when it happened)
3. Look for their User ID in the table
4. See all their activities with timestamps
5. Export CSV for detailed analysis
```

---

## 🔧 Technical Details

### Environment Storage

**Where is "current environment" stored?**
```javascript
// In browser localStorage
localStorage.getItem('app_environment')  // Returns: 'dev', 'staging', or 'production'

// In context (throughout the app)
environmentManager.getCurrentEnvironment()  // Returns: 'dev', 'staging', or 'production'
```

**What happens when you switch?**
```javascript
1. Check if user has access to target environment
2. If yes:
   - Save to localStorage: localStorage.setItem('app_environment', 'staging')
   - Log the switch: user_activities table gets new row
   - Reload page: window.location.reload()
3. If no:
   - Show error: "Access denied"
```

### Database Tables

**4 new tables were created**:

1. **environments**: Stores env configs (dev, staging, production)
2. **environment_access**: Controls who can access which env
3. **user_activities**: Logs all user actions with environment tag
4. **feature_flags**: Stores feature toggle configurations

### Activity Tracking

**What gets tracked automatically?**
- User logins and logouts
- Memory weave creation and updates
- Session starts and ends
- Environment switches
- Feature flag changes
- Admin actions

**Where to see it?**
- Admin Dashboard → Activity tab
- Or query database: `SELECT * FROM user_activities`

---

## 📝 Best Practices Checklist

✅ **Before Releasing a Feature**:
- [ ] Tested in Development environment
- [ ] Tested in Staging environment with team
- [ ] Reviewed Activity Analytics for staging issues
- [ ] Got approval from team lead
- [ ] Documented feature in release notes

✅ **When Releasing to Production**:
- [ ] Switched to Production environment
- [ ] Enabled feature flag for production
- [ ] Watching Activity Analytics dashboard
- [ ] Have rollback plan ready (disable feature flag)
- [ ] Monitoring for 1-2 hours after release

✅ **Weekly Maintenance**:
- [ ] Review Activity Analytics for trends
- [ ] Export activity data for long-term storage
- [ ] Check which features are enabled where
- [ ] Review team member access grants
- [ ] Update deployment documentation

---

## 🆘 Getting Help

**If you're stuck**:

1. **Check current environment**: Look for colored banner at top
2. **Check browser console**: Press F12 → Console tab
3. **Check Activity logs**: Admin Dashboard → Activity
4. **Check database**: Supabase Dashboard → Table Editor
5. **Read the docs**:
   - `ENVIRONMENT_ACCESS_GUIDE.md` - Detailed guide
   - `DEPLOYMENT_GUIDE.md` - Full deployment workflow

**Common Issues & Solutions**:

| Problem | Solution |
|---------|----------|
| Can't switch environment | Check if you have access grant |
| Feature not showing | Check feature flag for current env |
| Activity not logged | Ensure `user_activity_tracking` is enabled |
| Access denied error | Grant access via database |

---

## 📞 Quick Reference

### Important URLs
```
Main App:        https://yourapp.com
Admin Dashboard: https://yourapp.com/admin
Supabase:        https://supabase.com/dashboard
```

### Key Commands
```bash
npm run dev          # Local development
npm run build        # Build for production
vercel --prod        # Deploy to production
```

### Database Queries
```sql
-- Check your environment access
SELECT e.name FROM environment_access ea
JOIN environments e ON e.id = ea.environment_id
WHERE ea.user_id = auth.uid();

-- View recent activities
SELECT * FROM user_activities
ORDER BY created_at DESC LIMIT 50;

-- Check feature flags
SELECT flag_key, name, enabled_environments
FROM feature_flags;
```

---

## ✅ Quick Action Items

**Right Now**:
1. ✅ Login to Admin Dashboard
2. ✅ Click "Environments" button
3. ✅ Try switching between environments
4. ✅ Click "Activity" button and explore
5. ✅ Toggle a feature flag on/off

**This Week**:
1. ⏳ Add a team member to staging
2. ⏳ Test a feature in dev → staging → production
3. ⏳ Export activity data and review
4. ⏳ Create your first custom feature flag

**This Month**:
1. 📅 Set up monitoring alerts
2. 📅 Train your team on the system
3. 📅 Establish release schedule
4. 📅 Document your specific workflows

---

**You're all set!** 🎉

Start by exploring the Admin Dashboard and switching between environments. The system is designed to be intuitive - click around and see how it works!
