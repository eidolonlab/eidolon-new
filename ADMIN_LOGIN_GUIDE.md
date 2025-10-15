# Admin Dashboard Login Guide

## 🚪 How to Access the Admin Dashboard

### Step 1: Navigate to the Admin URL

Go to your app and add `/admin` to the URL:

```
https://yourapp.com/admin
```

For example:
- If deployed on Vercel: `https://your-project.vercel.app/admin`
- If running locally: `http://localhost:5173/admin`

### Step 2: You'll See the Admin Login Screen

You'll be presented with a login screen that looks like this:

```
┌─────────────────────────────────────┐
│          🛡️ Admin Access            │
│                                      │
│     Sign in to admin dashboard      │
│                                      │
│  Email: [_________________]         │
│  Password: [_________________]      │
│                                      │
│         [ Sign In ]                 │
│                                      │
│  Don't have an account?             │
│  [ Create Admin Account ]           │
└─────────────────────────────────────┘
```

---

## 🆕 First Time Setup (Creating Your Admin Account)

### If You Don't Have an Admin Account Yet:

1. **Click "Create Admin Account"** (link at the bottom)

2. **Enter your details:**
   - Email: Your email address
   - Password: Create a strong password (min 6 characters)

3. **Click "Sign Up"**

4. **Important**: Check if Supabase email confirmation is enabled:
   - If email confirmation is **disabled** (default): You can log in immediately
   - If email confirmation is **enabled**: Check your email for a confirmation link

5. **After signup:**
   - You'll see: "Admin account created successfully! You can now sign in."
   - Click "Already have an account? Sign in"
   - Enter your email and password
   - Click "Sign In"

6. **You're in!** You'll be automatically redirected to the Admin Dashboard

---

## 🔑 Logging In (Existing Admin Account)

### If You Already Have an Account:

1. Go to: `https://yourapp.com/admin`

2. Enter your credentials:
   - Email: Your registered email
   - Password: Your password

3. Click **"Sign In"**

4. You'll be automatically redirected to the Admin Dashboard

---

## 🔧 Troubleshooting

### "Invalid login credentials" Error

**Possible causes:**
1. Wrong email or password
2. Account doesn't exist yet
3. Email not confirmed (if confirmation is enabled)

**Solutions:**
- Double-check your email and password
- Try creating a new admin account if you haven't yet
- Check your email for confirmation link (if applicable)

### Email Confirmation Required?

By default, Supabase requires email confirmation. To disable it:

1. Go to your **Supabase Dashboard**
2. Navigate to: **Authentication → Providers → Email**
3. Toggle **OFF** "Confirm email"
4. Now you can sign in immediately after signup

### Can't Access `/admin` Route

**Check:**
1. Are you using the correct URL? (add `/admin` to your base URL)
2. Is your app running? (check dev server or deployment)
3. Check browser console (F12) for errors

### "Checking authentication..." Stuck

**Solutions:**
1. Refresh the page (Ctrl + R or Cmd + R)
2. Clear browser cache and cookies
3. Check if Supabase is configured correctly (check `.env` file)
4. Check browser console for errors

---

## 🎯 Quick Access Methods

### Method 1: Direct URL
```
Type in browser: https://yourapp.com/admin
```

### Method 2: Via Main App (If Logged In)
```
1. Login to your app normally
2. You'll see an "Admin" button in the navigation
3. Click "Admin" button
4. You'll be taken to the Admin Dashboard
```

### Method 3: Manual Navigation
```
1. Go to your app homepage
2. Add /admin to the URL in the browser address bar
3. Press Enter
```

---

## �� How the System Works

### Automatic Admin Creation

The system is designed to be developer-friendly:

1. **First signup** at `/admin` automatically creates an admin account
2. **If you login** and you're not in the `admin_users` table, you're automatically added as an admin
3. **No manual database setup required!**

### Admin Check Flow

```
Navigate to /admin
      ↓
Are you logged in?
      ↓
   NO → Show login screen
      ↓
Login with email/password
      ↓
Check if email exists in admin_users table
      ↓
   NO → Automatically add you as admin
      ↓
   YES → Load admin dashboard
      ↓
Show Admin Dashboard ✅
```

---

## 🔐 Security Notes

### Who Can Access Admin Dashboard?

- **Only users with accounts in the `admin_users` table**
- **First user to sign up** at `/admin` becomes an admin automatically
- **Subsequent signups** at `/admin` also create admin accounts (currently)

### Current Behavior (Important!)

⚠️ **Note**: Currently, anyone who signs up at `/admin` gets admin access. This is fine for:
- Personal projects
- Internal tools
- Small teams

🔒 **For Production**: You may want to restrict this. Here's how:

1. **Remove the signup option** from AdminAuth component
2. **Manually add admins** via Supabase Dashboard:

```sql
-- Add a new admin user
INSERT INTO admin_users (email, role, permissions)
VALUES (
  'admin@example.com',
  'admin',
  '{"dashboard": true, "analytics": true, "users": true}'
);
```

---

## 📋 Step-by-Step First Login (Complete Example)

Let's walk through your first login:

### Step 1: Open Admin Page
```
Open browser → Type: http://localhost:5173/admin (or your deployed URL)
```

### Step 2: You'll See Login Screen
```
Screen shows: "Admin Access - Sign in to admin dashboard"
```

### Step 3: Create Account (First Time)
```
Click: "Don't have an account? Create one"
Enter email: you@example.com
Enter password: YourSecurePassword123
Click: "Sign Up"
```

### Step 4: Wait for Success Message
```
Alert appears: "Admin account created successfully! You can now sign in."
Click: OK
Screen switches back to login form
```

### Step 5: Sign In
```
Enter email: you@example.com
Enter password: YourSecurePassword123
Click: "Sign In"
```

### Step 6: You're In!
```
Page loads → Admin Dashboard appears with:
- Navigation buttons (Activity, Environments, Dev Tools)
- Stats cards
- Charts and analytics
- Admin functionality
```

---

## 🎉 What You Can Do After Login

Once logged in to the Admin Dashboard, you can:

✅ View user analytics and statistics
✅ Monitor user activities across all environments
✅ Switch between dev/staging/production environments
✅ Manage feature flags (enable/disable features per environment)
✅ Access developer tools
✅ Manage users and beta testing
✅ Export activity data
✅ Grant environment access to team members

---

## 💡 Pro Tips

1. **Bookmark the admin URL** for quick access
2. **Save your credentials** securely (use a password manager)
3. **Enable two-factor authentication** in production (via Supabase settings)
4. **Regularly review** the activity logs for security
5. **Create multiple admin accounts** for your team members via SQL

---

## 🆘 Still Can't Login?

If you're still having issues:

1. **Check Supabase Configuration**:
   ```bash
   # Check your .env file has these variables:
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Check Database Connection**:
   - Open browser console (F12)
   - Look for Supabase connection errors
   - Verify your Supabase project is active

3. **Verify Admin Users Table Exists**:
   - Go to Supabase Dashboard
   - Navigate to Table Editor
   - Check if `admin_users` table exists
   - If not, the migration may not have run

4. **Check Browser Console**:
   - Press F12
   - Go to Console tab
   - Look for red error messages
   - Share these errors if you need help

5. **Try Incognito/Private Mode**:
   - Sometimes browser extensions interfere
   - Try accessing in incognito mode
   - If it works, clear your browser cache

---

## 📞 Quick Reference

| What | How |
|------|-----|
| **Admin URL** | `yourapp.com/admin` |
| **First Login** | Create account at `/admin` |
| **Forgot Password** | Use Supabase Auth reset (add feature if needed) |
| **Check If Admin** | Query: `SELECT * FROM admin_users WHERE email = 'your@email.com';` |
| **Manually Add Admin** | Insert into `admin_users` table via Supabase Dashboard |
| **Logout** | Click "Sign Out" button in Admin Dashboard |

---

**Ready to login?** Just navigate to `/admin` and create your account! 🚀
