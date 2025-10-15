# Admin Authentication Troubleshooting Guide

## 🔍 Issue: "Authentication Failed" Error

If you're getting an "Authentication failed" error when trying to create an admin account, here are the solutions:

---

## ✅ Solution 1: Use an Existing Admin Account

**Your database already has admin accounts!** Try logging in with one of these:

### Existing Admin Accounts:
1. **admin@eidolon.com**
2. **admin@tryeidolon.com**
3. **erewallc@gmail.com**

### Steps:
1. Go to `/admin`
2. **DO NOT click "Create Admin Account"**
3. Enter one of the emails above
4. Enter the password you set for that account
5. Click "Sign In"

---

## ✅ Solution 2: Reset Password for Existing Account

If you don't remember the password for the existing accounts:

### Option A: Via Supabase Dashboard (Easiest)

1. Go to your **Supabase Dashboard**
2. Navigate to: **Authentication → Users**
3. Find the user (e.g., `admin@tryeidolon.com`)
4. Click the three dots (⋮) → **Send Password Recovery Email**
5. Check your email for the reset link
6. Set a new password
7. Go back to `/admin` and sign in

### Option B: Delete and Recreate

1. Go to **Supabase Dashboard → Authentication → Users**
2. Find the user you want to delete
3. Click the three dots (⋮) → **Delete User**
4. Go to `/admin` in your app
5. Click "Create Admin Account"
6. Use the same email address
7. Set a new password
8. Sign in

---

## ✅ Solution 3: Create a New Admin with Different Email

If you want to create a completely new admin account:

1. Go to `/admin`
2. Click "Create Admin Account"
3. **Use a DIFFERENT email** (not one of the existing ones)
   - Example: `youremail@gmail.com`
4. Enter a strong password
5. Click "Sign Up"
6. Sign in with the new credentials

---

## 🔧 Common Authentication Errors & Solutions

### Error: "Invalid login credentials"

**Cause**: Wrong email or password, or account doesn't exist

**Solutions**:
- Double-check email spelling (it's case-sensitive)
- Verify you're using the correct password
- Try password reset via Supabase Dashboard
- Make sure the account exists in **Authentication → Users**

### Error: "Email not confirmed"

**Cause**: Email confirmation is enabled but you haven't confirmed your email

**Solutions**:
1. Check your email inbox for confirmation email
2. OR disable email confirmation:
   - Supabase Dashboard → **Authentication → Providers → Email**
   - Toggle **OFF** "Confirm email"
   - Try signing up again

### Error: "User already registered"

**Cause**: Trying to create account with existing email

**Solutions**:
- Sign in instead of signing up
- Use a different email address
- Reset password for existing account

### Error: "Authentication session missing"

**Cause**: Session expired or browser issue

**Solutions**:
1. Clear browser cache and cookies
2. Try in incognito/private mode
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Close all browser tabs and try again

---

## 🎯 Recommended Approach

**For First-Time Setup:**

1. **Try logging in first** with existing accounts:
   ```
   Email: admin@tryeidolon.com
   Password: (try your most common password)
   ```

2. **If that doesn't work**, reset the password:
   - Supabase Dashboard → Authentication → Users
   - Find admin@tryeidolon.com
   - Send password recovery email
   - Set new password
   - Login

3. **If you want a fresh start**:
   - Delete all existing admin accounts via Supabase Dashboard
   - Create new account at `/admin`
   - Use your own email address

---

## 🔐 Creating a Secure Admin Account

When creating a new admin account, follow these guidelines:

### Strong Password Requirements:
- ✅ At least 8 characters (Supabase minimum is 6)
- ✅ Mix of uppercase and lowercase letters
- ✅ Include numbers
- ✅ Include special characters (@, #, $, etc.)

### Good Password Examples:
- `AdminP@ss2024!`
- `Eid0lon$ecure123`
- `MyStr0ng!Passw0rd`

### Bad Password Examples:
- ❌ `password` (too common)
- ❌ `admin123` (too simple)
- ❌ `12345678` (only numbers)

---

## 🛠️ Manual Account Creation (Advanced)

If the UI signup isn't working, you can create an admin account manually:

### Step 1: Create Auth User via Supabase Dashboard

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **"Add user"** button
3. Enter:
   - Email: `youremail@example.com`
   - Password: Your secure password
   - Auto Confirm User: **✅ Check this box**
4. Click **"Create user"**

### Step 2: Add to admin_users Table

1. Go to **Supabase Dashboard → SQL Editor**
2. Run this SQL:

```sql
-- Replace with your actual email and user ID
INSERT INTO admin_users (email, role, permissions)
VALUES (
  'youremail@example.com',  -- Your email from Step 1
  'admin',
  '{"dashboard": true, "analytics": true, "users": true}'::jsonb
);
```

3. Click **"Run"**

### Step 3: Login

1. Go to `/admin`
2. Enter your email and password
3. Click "Sign In"
4. You're in!

---

## 📊 Verify Your Setup

After successfully logging in, verify everything is working:

### Check 1: Admin Dashboard Loads
- ✅ You should see the Admin Dashboard
- ✅ Navigation buttons: Activity, Environments, Dev Tools
- ✅ No errors in browser console (F12)

### Check 2: Your Account is in Database

Run this query in Supabase SQL Editor:

```sql
-- Check auth.users
SELECT id, email, confirmed_at
FROM auth.users
WHERE email = 'youremail@example.com';

-- Check admin_users
SELECT id, email, role, permissions
FROM admin_users
WHERE email = 'youremail@example.com';
```

Both queries should return your account info.

### Check 3: Permissions Work
- ✅ Click "Activity" button → Should show activity analytics
- ✅ Click "Environments" button → Should show environments
- ✅ Click "Dev Tools" button → Should show developer tools

---

## 🚨 Still Having Issues?

### Debug Checklist:

1. **Check Browser Console** (F12 → Console tab)
   - Look for red error messages
   - Common errors:
     - Network errors → Check internet connection
     - CORS errors → Check Supabase URL in `.env`
     - Auth errors → Check credentials

2. **Verify Supabase Configuration**
   ```bash
   # Check your .env file
   cat .env

   # Should see:
   # VITE_SUPABASE_URL=https://your-project.supabase.co
   # VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Check Supabase Project Status**
   - Go to Supabase Dashboard
   - Check if project is active (not paused)
   - Check if database is healthy

4. **Test Auth Directly in Supabase**
   - Supabase Dashboard → Authentication → Users
   - Click on a user → "Send magic link"
   - If magic link doesn't work, there might be a Supabase configuration issue

5. **Check RLS Policies**

   Run this to check if RLS is blocking access:

   ```sql
   -- Check admin_users RLS policies
   SELECT * FROM pg_policies
   WHERE tablename = 'admin_users';
   ```

---

## 💡 Pro Tips

1. **Use a Password Manager**: Store your admin credentials securely in LastPass, 1Password, or similar

2. **Create Multiple Admins**: For team projects, create separate admin accounts for each team member

3. **Test in Incognito**: When troubleshooting, test in incognito mode to rule out browser cache issues

4. **Keep Supabase URL Handy**: Bookmark your Supabase Dashboard for quick access

5. **Document Your Credentials**: Keep a secure note with:
   - Admin email
   - Date created
   - Purpose (personal, production, development, etc.)

---

## 📞 Quick Reference Commands

### Check if User Exists:
```sql
SELECT email FROM auth.users WHERE email = 'your@email.com';
```

### Check if User is Admin:
```sql
SELECT email, role FROM admin_users WHERE email = 'your@email.com';
```

### Delete All Admin Accounts (Fresh Start):
```sql
-- WARNING: This will delete all admin users!
DELETE FROM admin_users;
DELETE FROM auth.users WHERE email LIKE '%admin%';
```

### Create Admin Manually:
```sql
-- First create in auth.users via Supabase Dashboard
-- Then add to admin_users:
INSERT INTO admin_users (email, role, permissions)
VALUES ('your@email.com', 'admin', '{"dashboard": true}'::jsonb);
```

---

## 🎉 Success Indicators

You've successfully resolved the issue when:

✅ You can navigate to `/admin` without errors
✅ You can sign in with your credentials
✅ Admin Dashboard loads completely
✅ All navigation buttons work
✅ No errors in browser console
✅ You can access Activity, Environments, and Dev Tools

---

## 📝 Next Steps After Login

Once you've successfully logged in:

1. **Explore the Admin Dashboard**
   - Check Activity Analytics
   - Explore Environment Manager
   - Review User Management

2. **Set Up Your Preferences**
   - Switch to Development environment
   - Enable/disable feature flags
   - Configure settings

3. **Secure Your Account**
   - Use a strong, unique password
   - Enable 2FA (if available in Supabase)
   - Don't share credentials

4. **Read the Docs**
   - `QUICK_START.md` - Quick start guide
   - `ENVIRONMENT_ACCESS_GUIDE.md` - Environment management
   - `DEPLOYMENT_GUIDE.md` - Deployment workflows

---

**Good luck!** 🚀 If you're still stuck after trying these solutions, the issue might be with your Supabase project configuration. Check the Supabase Dashboard for any alerts or notifications.
