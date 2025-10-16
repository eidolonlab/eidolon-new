# Supabase Email Configuration Guide

## Current Status

✅ **Signup Form Fixed** - The missing `inviteCode` state variable has been added
✅ **Password Reset Code Working** - The frontend logic is complete and working

⚠️ **Email Delivery Not Working** - This requires Supabase configuration in the dashboard

## Why Emails Aren't Sending

Supabase requires email configuration before it can send password reset emails. By default, Supabase uses a rate-limited email service that may not work for all projects.

## How to Configure Supabase Email

### Option 1: Use Supabase's Default Email (Quick Test)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Email Templates**
4. Check that "Enable email confirmations" is OFF (we have it disabled)
5. Go to **Settings** → **API**
6. Verify your project URL and keys match your `.env` file

**Limitation:** Supabase's default email service has rate limits and may not deliver reliably.

### Option 2: Configure Custom SMTP (Recommended for Production)

This is the most reliable option for production use.

1. Go to **Settings** → **Auth** in your Supabase Dashboard
2. Scroll to **SMTP Settings**
3. Enable "Enable Custom SMTP"
4. Configure with your email provider:

#### Popular SMTP Providers:

**SendGrid (Recommended)**
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Your SendGrid API Key]
Sender Email: noreply@yourdomain.com
Sender Name: Eidolon
```

**Amazon SES**
```
Host: email-smtp.[region].amazonaws.com
Port: 587
Username: [Your SES SMTP Username]
Password: [Your SES SMTP Password]
Sender Email: noreply@yourdomain.com
Sender Name: Eidolon
```

**Postmark**
```
Host: smtp.postmarkapp.com
Port: 587
Username: [Your Postmark Server API Token]
Password: [Your Postmark Server API Token]
Sender Email: noreply@yourdomain.com
Sender Name: Eidolon
```

**Mailgun**
```
Host: smtp.mailgun.org
Port: 587
Username: postmaster@[your-domain].mailgun.org
Password: [Your Mailgun Password]
Sender Email: noreply@yourdomain.com
Sender Name: Eidolon
```

**Gmail (Development Only - Not for Production)**
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: [Your App Password]
Sender Email: your-email@gmail.com
Sender Name: Eidolon

Note: You must enable "2-Step Verification" and create an "App Password"
```

### Option 3: Test Without Email (Development)

For development/testing, you can bypass email verification:

1. Go to **Authentication** → **Providers** → **Email**
2. Turn OFF "Confirm email"
3. Users can sign up without email confirmation
4. Password resets won't work without SMTP configured

## Current Configuration in Code

### Password Reset Flow (Already Implemented)

```typescript
// In AuthForm.tsx - line 46-60
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});
```

This code:
✅ Calls Supabase's password reset API
✅ Specifies where to redirect after clicking the email link
✅ Shows success message to user
❌ Requires SMTP to actually send the email

### What Happens When You Click "Send Reset Link"

1. **Frontend** calls `supabase.auth.resetPasswordForEmail()`
2. **Supabase** generates a secure reset token
3. **Supabase** attempts to send email via configured SMTP
4. **If SMTP configured:** Email is sent ✅
5. **If SMTP not configured:** Request succeeds but no email sent ❌

## Testing Without SMTP (Temporary Solution)

While you set up SMTP, you can test the app by:

### Method 1: Sign Up New Users
- Users can create accounts with invite codes
- They can sign in immediately (no email confirmation needed)
- This works without any email configuration

### Method 2: Direct Database Password Reset (Admin Only)

If you need to reset a password for testing:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find the user
3. Click the three dots → **Send Magic Link** or **Reset Password**
4. Or use SQL to update the password directly (not recommended for production)

## Recommended Setup Steps

### For Development/Testing
1. ✅ Keep email confirmation OFF (already done)
2. ✅ Use invite code system for controlled access (already done)
3. ⚠️ Accept that password reset won't work without SMTP
4. Use the admin dashboard to manage test users

### For Production
1. ✅ Set up custom SMTP (SendGrid, SES, or Postmark)
2. ✅ Configure sender domain and verify it
3. ✅ Test email delivery
4. ✅ Customize email templates in Supabase dashboard
5. ✅ Monitor email delivery logs

## Email Templates

Once SMTP is configured, you can customize these templates in the Supabase Dashboard:

- **Confirm signup** (currently disabled)
- **Magic Link** (if enabled)
- **Change Email Address**
- **Reset Password** ← This is what you need!

### Customizing the Reset Password Email

1. Go to **Authentication** → **Email Templates**
2. Find "Reset Password"
3. Customize the template with your branding
4. Available variables:
   - `{{ .Token }}` - The reset token
   - `{{ .SiteURL }}` - Your site URL
   - `{{ .RedirectTo }}` - Where to redirect after reset

## Verification Checklist

Before password reset emails will work:

- [ ] SMTP configured in Supabase Dashboard
- [ ] Sender email verified with your SMTP provider
- [ ] Email templates reviewed and customized
- [ ] Test email sent successfully
- [ ] Spam folder checked
- [ ] Rate limits understood (if using default Supabase email)
- [ ] Production domain configured (if using custom domain)

## Current Workarounds

Until email is configured:

### For Users Who Forgot Password:
1. Contact admin via support
2. Admin can send magic link from dashboard
3. Admin can create a new invite code for them to create new account
4. Admin can manually reset their password in dashboard

### For Testing:
1. Use test accounts you create
2. Save passwords in a password manager
3. Create new test accounts with different emails if needed
4. Use invite codes: DEMO2024, BETA2024, FOUNDER2024

## Error Messages You Might See

**"Password reset link sent! Check your email"**
- ✅ Frontend code worked
- ✅ Supabase accepted the request
- ❌ Email may not actually be sent without SMTP

**"Failed to send reset email"**
- ❌ Request failed
- Check console for error details
- Verify Supabase connection

**No error but no email received:**
- SMTP not configured in Supabase
- Email in spam folder
- Wrong email address entered
- Rate limit reached (default Supabase email)

## Quick Start: Get Email Working in 10 Minutes

### Using SendGrid (Free Tier Available)

1. **Sign up for SendGrid:** https://signup.sendgrid.com/
2. **Create API Key:** Settings → API Keys → Create API Key
3. **Verify Sender:** Settings → Sender Authentication → Verify Single Sender
4. **Configure in Supabase:**
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: [Your API Key]
   - Sender: [Your verified email]
5. **Test:** Try password reset in your app!

## Summary

### ✅ What's Working Now
- Signup form with invite codes
- Sign in functionality
- Password reset UI and logic
- Frontend is complete and functional

### ⚠️ What Needs Configuration
- SMTP settings in Supabase Dashboard
- Email sender verification
- Email template customization (optional)

### 🎯 Next Steps
1. Choose an SMTP provider (SendGrid recommended)
2. Configure SMTP in Supabase Dashboard
3. Test password reset flow
4. Customize email templates
5. Monitor email delivery

Once SMTP is configured, password reset emails will work automatically with the existing code!
