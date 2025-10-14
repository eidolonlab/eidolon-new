# Eidolon Environment System - Visual Overview

## 🎯 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your App (Single URL)                     │
│                     https://yourapp.com                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Environment Manager                           │
│              (Controls current environment context)              │
│                                                                   │
│  Current Environment: [Dev | Staging | Production]              │
│  Stored in: localStorage + React Context                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
          ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
          │     DEV     │ │   STAGING   │ │ PRODUCTION  │
          │   (Blue)    │ │  (Yellow)   │ │   (Green)   │
          └─────────────┘ └─────────────┘ └─────────────┘
          │             │ │             │ │             │
          │ Access:     │ │ Access:     │ │ Access:     │
          │ • Admins    │ │ • Admins    │ │ • Everyone  │
          │ • Granted   │ │ • Granted   │ │ (public)    │
          │             │ │             │ │             │
          └─────────────┘ └─────────────┘ └─────────────┘
                    │            │            │
                    └────────────┼────────────┘
                                 ▼
          ┌─────────────────────────────────────────────┐
          │         Feature Flags (per environment)      │
          ├─────────────────────────────────────────────┤
          │  advanced_analytics:  [✓] [✓] [ ]          │
          │  beta_features:       [✓] [ ] [ ]          │
          │  admin_panel:         [✓] [✓] [✓]          │
          └─────────────────────────────────────────────┘
                                 │
                                 ▼
          ┌─────────────────────────────────────────────┐
          │         Activity Tracking System             │
          │  All actions tagged with environment         │
          └─────────────────────────────────────────────┘
                                 │
                                 ▼
          ┌─────────────────────────────────────────────┐
          │        Single Supabase Database              │
          │  • environments                              │
          │  • environment_access                        │
          │  • user_activities                           │
          │  • feature_flags                             │
          │  • ... (your existing tables)                │
          └─────────────────────────────────────────────┘
```

---

## 🔄 How Environment Switching Works

```
┌──────────────────────────────────────────────────────────────┐
│ Step 1: User Clicks "Switch to Staging"                      │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Step 2: Check Access Permission                              │
│   ┌────────────────────────────────────────┐                 │
│   │ Query: environment_access table        │                 │
│   │ Does user have access to staging?      │                 │
│   └────────────────────────────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
         │                                    │
         │ ✅ YES                             │ ❌ NO
         ▼                                    ▼
┌─────────────────────────┐    ┌──────────────────────────────┐
│ Step 3: Update Context  │    │ Show Error Message:          │
│ • localStorage = staging│    │ "Access denied to staging    │
│ • Track activity        │    │  environment"                │
│ • Reload page           │    └──────────────────────────────┘
└─────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Page Reloads with New Environment                   │
│ • Yellow banner shows "Current Environment: Staging"        │
│ • Feature flags for staging are applied                     │
│ • All new activities tagged as "staging"                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎛️ Feature Flag System Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Developer adds new feature to code:                         │
│  <AdvancedAnalytics />                                       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Wrap with feature flag check:                               │
│                                                               │
│  const isEnabled = await isFeatureEnabled('advanced_analytics');│
│  if (isEnabled) {                                            │
│    return <AdvancedAnalytics />;                            │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  System checks feature_flags table:                          │
│  ┌────────────────────────────────────────────────┐         │
│  │ flag_key: 'advanced_analytics'                 │         │
│  │ enabled_environments: ['dev', 'staging']       │         │
│  └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │   DEV    │  │ STAGING  │  │   PROD   │
    │  ✅ ON   │  │  ✅ ON   │  │  ❌ OFF  │
    └──────────┘  └──────────┘  └──────────┘
         │             │             │
         ▼             ▼             ▼
    Shows        Shows         Hidden
    Feature      Feature       Feature
```

---

## 📊 Activity Tracking Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User Action (e.g., creates a memory weave)                 │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Trigger: Database trigger on weaves table                   │
│  OR Manual call: environmentManager.trackActivity()          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Collect Activity Data:                                      │
│  ┌────────────────────────────────────────────┐             │
│  │ • user_id          (who)                   │             │
│  │ • activity_type    (what)                  │             │
│  │ • environment      (where: dev/staging/prod)│            │
│  │ • activity_data    (details in JSON)       │             │
│  │ • timestamp        (when)                  │             │
│  │ • user_agent       (browser/device)        │             │
│  │ • session_duration (how long)              │             │
│  └────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Insert into user_activities table                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Activity Dashboard Updates:                                 │
│  • Total Activities count increases                          │
│  • Activity appears in recent activities table               │
│  • Charts/graphs update automatically                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Promotion Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 1: DEVELOPMENT                      │
└─────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────┐
│ 1. Switch to Dev environment                     │
│ 2. Enable feature flags for testing              │
│ 3. npm run dev (local testing)                   │
│ 4. Test thoroughly                               │
│ 5. Review Activity Analytics for errors          │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
                    ✅ Dev Approved
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 2: STAGING                          │
└─────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────┐
│ 1. Switch to Staging environment                 │
│ 2. Enable feature flags for staging              │
│ 3. npm run build && deploy                       │
│ 4. Team tests in staging                         │
│ 5. Review Activity Analytics                     │
│ 6. Get QA approval                               │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
                    ✅ Staging Approved
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   PHASE 3: PRODUCTION                        │
└─────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────┐
│ 1. Switch to Production environment              │
│ 2. Enable feature flags ONE AT A TIME            │
│ 3. Monitor Activity Analytics CLOSELY            │
│ 4. Watch for unusual patterns                    │
│ 5. Keep rollback ready (disable flag)            │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
         ✅ Success            ❌ Issues Detected
              │                     │
              │                     ▼
              │         ┌────────────────────┐
              │         │ IMMEDIATE ROLLBACK │
              │         │ Disable feature    │
              │         │ flag instantly     │
              │         └────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│  Feature Successfully Released!                              │
│  • Monitor for 24-48 hours                                   │
│  • Export activity logs for analysis                         │
│  • Document in release notes                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Access Control Matrix

```
┌────────────────────────────────────────────────────────────────┐
│                     Access Control System                       │
└────────────────────────────────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Production     │  │    Staging       │  │   Development    │
│   Environment    │  │   Environment    │  │   Environment    │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ Access Control:  │  │ Access Control:  │  │ Access Control:  │
│                  │  │                  │  │                  │
│ ✅ Public        │  │ ❌ Private       │  │ ❌ Private       │
│ Anyone can login │  │ Restricted       │  │ Most Restricted  │
│                  │  │                  │  │                  │
│ Users:           │  │ Users:           │  │ Users:           │
│ • All users      │  │ • Admins only    │  │ • Admins only    │
│ • Need to login  │  │ • Granted users  │  │ • Tech team      │
│                  │  │                  │  │                  │
│ Permissions:     │  │ Permissions:     │  │ Permissions:     │
│ • Use features   │  │ • Test features  │  │ • Test features  │
│ • View data      │  │ • View data      │  │ • Debug          │
│ • Create content │  │ • QA testing     │  │ • Develop        │
└──────────────────┘  └──────────────────┘  └──────────────────┘

Access Levels:
┌─────────────────────────────────────────────────────────────┐
│ ADMIN    ► Full control over everything                     │
│            • Grant/revoke access                             │
│            • Manage feature flags                            │
│            • View all activities                             │
├─────────────────────────────────────────────────────────────┤
│ EDITOR   ► Can modify and test                              │
│            • Test features                                   │
│            • Modify data                                     │
│            • Cannot grant access                             │
├─────────────────────────────────────────────────────────────┤
│ VIEWER   ► Read-only access                                 │
│            • View features                                   │
│            • View data                                       │
│            • Cannot modify                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Admin Dashboard Structure

```
┌──────────────────────────────────────────────────────────────┐
│                 ADMIN DASHBOARD (Main View)                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [← Back to App]         Eidolon Admin Dashboard             │
│                                                               │
│  [Activity] [Environments] [Dev Tools] [Export] [Refresh]    │
└──────────────────────────────────────────────────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐
│  ACTIVITY VIEW  │  │ ENVIRONMENT VIEW │  │ DEVELOPER VIEW │
├─────────────────┤  ├──────────────────┤  ├────────────────┤
│                 │  │                  │  │                │
│ • Stats Cards   │  │ • Environment    │  │ • User Mgmt    │
│   - Total       │  │   Cards          │  │ • Beta Testing │
│   - Users       │  │   - Dev          │  │ • Deployments  │
│   - Sessions    │  │   - Staging      │  │ • Feature Mgmt │
│   - Duration    │  │   - Production   │  │                │
│                 │  │                  │  │                │
│ • Top Activities│  │ • Feature Flags  │  │                │
│   Bar Chart     │  │   Toggle Table   │  │                │
│                 │  │   [✓] [✓] [ ]    │  │                │
│ • By Environment│  │                  │  │                │
│   Breakdown     │  │ • Access Grants  │  │                │
│                 │  │   (Future)       │  │                │
│ • Timeline      │  │                  │  │                │
│   Last 7 days   │  │                  │  │                │
│                 │  │                  │  │                │
│ • Recent Table  │  │                  │  │                │
│   50 latest     │  │                  │  │                │
│                 │  │                  │  │                │
│ [Export CSV]    │  │ [Switch Env]     │  │ [Manage Users] │
└─────────────────┘  └──────────────────┘  └────────────────┘
```

---

## 🗄️ Database Schema Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     NEW TABLES CREATED                       │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ environments                                               │
├───────────────────────────────────────────────────────────┤
│ id              uuid (PK)                                  │
│ name            text (dev, staging, production)            │
│ display_name    text                                       │
│ is_active       boolean                                    │
│ config          jsonb (metadata)                           │
│ created_at      timestamp                                  │
└───────────────────────────────────────────────────────────┘
                         │
                         │ Referenced by
                         ▼
┌───────────────────────────────────────────────────────────┐
│ environment_access                                         │
├───────────────────────────────────────────────────────────┤
│ id              uuid (PK)                                  │
│ user_id         uuid (FK → auth.users)                     │
│ environment_id  uuid (FK → environments)                   │
│ access_level    text (viewer, editor, admin)              │
│ granted_by      uuid (FK → auth.users)                     │
│ granted_at      timestamp                                  │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ user_activities                                            │
├───────────────────────────────────────────────────────────┤
│ id                   uuid (PK)                             │
│ user_id              uuid (FK → auth.users)                │
│ activity_type        text                                  │
│ activity_data        jsonb                                 │
│ environment          text (dev, staging, production)       │
│ ip_address           text                                  │
│ user_agent           text                                  │
│ session_duration_ms  integer                               │
│ created_at           timestamp                             │
│                                                             │
│ Indexes:                                                   │
│ • user_id                                                  │
│ • activity_type                                            │
│ • environment                                              │
│ • created_at                                               │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ feature_flags                                              │
├───────────────────────────────────────────────────────────┤
│ id                   uuid (PK)                             │
│ flag_key             text (unique)                         │
│ name                 text                                  │
│ description          text                                  │
│ enabled_environments text[] (array)                        │
│ config               jsonb                                 │
│ created_at           timestamp                             │
│ updated_at           timestamp                             │
└───────────────────────────────────────────────────────────┘
```

---

## 🎯 Summary: What You Have Now

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  SINGLE URL DEPLOYMENT                                     ┃
┃  https://yourapp.com                                       ┃
┃                                                            ┃
┃  + 3 Virtual Environments (switchable in Admin Dashboard) ┃
┃    • Development (restricted)                             ┃
┃    • Staging (restricted)                                 ┃
┃    • Production (public)                                  ┃
┃                                                            ┃
┃  + Feature Flag System                                    ┃
┃    • Control features per environment                     ┃
┃    • No code deployment needed                            ┃
┃    • Instant rollback capability                          ┃
┃                                                            ┃
┃  + Comprehensive Activity Tracking                        ┃
┃    • All user actions logged                              ┃
┃    • Environment tagged                                   ┃
┃    • Exportable analytics                                 ┃
┃                                                            ┃
┃  + Access Control System                                  ┃
┃    • Production: Public                                   ┃
┃    • Staging: Team only                                   ┃
┃    • Development: Tech team only                          ┃
┃                                                            ┃
┃  + Admin Dashboard                                        ┃
┃    • Activity Analytics                                   ┃
┃    • Environment Management                               ┃
┃    • Feature Flag Control                                 ┃
┃    • User Management                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## ✨ Key Benefits

1. **Single URL Simplicity**: One URL to manage, not three
2. **Instant Rollback**: Disable feature flags without code deployment
3. **Safe Testing**: Test in dev/staging before production
4. **Full Visibility**: Track every user action with environment context
5. **Flexible Access**: Control who can access what
6. **No Downtime**: Environment switching is instant

---

**Ready to use it?** Start with the `QUICK_START.md` guide!
