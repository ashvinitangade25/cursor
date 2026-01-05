# Google SSO Setup Guide

This guide will walk you through setting up Google Single Sign-On (SSO) for your Next.js application step by step.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Your Next.js application running locally or deployed

---

## Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click on the project dropdown at the top of the page
   - Click **"New Project"**
   - Enter a project name (e.g., "My App SSO")
   - Click **"Create"**
   - Wait for the project to be created (may take a few seconds)

3. **Select Your Project**
   - Make sure your newly created project is selected in the project dropdown

---

## Step 2: Enable Google+ API (OAuth 2.0)

1. **Navigate to APIs & Services**
   - In the left sidebar, click **"APIs & Services"** → **"Library"**

2. **Search for OAuth Consent Screen**
   - In the search bar, type: **"OAuth consent screen"**
   - Click on **"OAuth consent screen"** from the results

3. **Configure OAuth Consent Screen**
   - **User Type**: Select **"External"** (unless you have a Google Workspace account)
   - Click **"Create"**

4. **Fill in App Information**
   - **App name**: Enter your application name (e.g., "My Research API Platform")
   - **User support email**: Select your email address
   - **App logo**: (Optional) Upload a logo for your app
   - **App domain**: (Optional) Your domain if you have one
   - **Developer contact information**: Enter your email address
   - Click **"Save and Continue"**

5. **Scopes** (Optional)
   - Click **"Add or Remove Scopes"**
   - By default, `openid`, `email`, `profile` are selected (these are sufficient)
   - Click **"Update"** then **"Save and Continue"**

6. **Test Users** (For External Apps)
   - If your app is in "Testing" mode, add test users:
     - Click **"Add Users"**
     - Enter email addresses of users who can test the app
     - Click **"Add"**
   - Click **"Save and Continue"**

7. **Summary**
   - Review your settings
   - Click **"Back to Dashboard"**

---

## Step 3: Create OAuth 2.0 Credentials

1. **Navigate to Credentials**
   - In the left sidebar, click **"APIs & Services"** → **"Credentials"**

2. **Create OAuth Client ID**
   - Click **"+ CREATE CREDENTIALS"** at the top
   - Select **"OAuth client ID"**

3. **Configure OAuth Client**
   - **Application type**: Select **"Web application"**
   - **Name**: Enter a name (e.g., "My App Web Client")

4. **Authorized JavaScript origins**
   - For **Local Development**:
     ```
     http://localhost:3000
     ```
   - For **Production** (Vercel/other hosting):
     ```
     https://your-domain.com
     https://your-app.vercel.app
     ```
   - Click **"+ ADD URI"** for each origin

5. **Authorized redirect URIs**
   - For **Local Development**:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - For **Production**:
     ```
     https://your-domain.com/api/auth/callback/google
     https://your-app.vercel.app/api/auth/callback/google
     ```
   - Click **"+ ADD URI"** for each redirect URI

6. **Create Credentials**
   - Click **"Create"**
   - **IMPORTANT**: A popup will appear with your credentials:
     - **Client ID**: Copy this value
     - **Client Secret**: Copy this value
   - ⚠️ **Save these credentials immediately** - you won't be able to see the secret again!

---

## Step 4: Configure Environment Variables

### For Local Development

1. **Create/Edit `.env.local` file** in your project root:
   ```env
   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-here
   ```

2. **Generate NEXTAUTH_SECRET**:
   - You can generate a random secret using:
     ```bash
     openssl rand -base64 32
     ```
   - Or use an online generator: https://generate-secret.vercel.app/32
   - Copy the generated value to `NEXTAUTH_SECRET`

### For Production (Vercel)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings**
   - Click **"Settings"** → **"Environment Variables"**

3. **Add Environment Variables**:
   - Click **"Add New"**
   - Add each variable:
     - **Name**: `GOOGLE_CLIENT_ID`
     - **Value**: Your Google Client ID
     - **Environment**: Production, Preview, Development (select all)
     - Click **"Save"**
   
   - Repeat for:
     - `GOOGLE_CLIENT_SECRET`
     - `NEXTAUTH_URL` (e.g., `https://your-app.vercel.app`)
     - `NEXTAUTH_SECRET` (same secret as local)

4. **Redeploy**
   - After adding variables, trigger a new deployment

---

## Step 5: Verify Installation

1. **Check Dependencies**
   - Ensure `next-auth` is installed:
     ```bash
     yarn list next-auth
     ```
   - If not installed:
     ```bash
     yarn add next-auth
     ```

2. **Verify Files Created**
   - ✅ `src/lib/auth.js` - NextAuth configuration
   - ✅ `src/app/api/auth/[...nextauth]/route.js` - API route handler
   - ✅ `src/components/SessionProvider.js` - Session provider component
   - ✅ `src/app/layout.js` - Updated with SessionProvider
   - ✅ `src/app/page.js` - Updated with login/logout UI

---

## Step 6: Test the Flow

### Local Testing

1. **Start Development Server**
   ```bash
   yarn dev
   ```

2. **Open Browser**
   - Navigate to: http://localhost:3000

3. **Test Login**
   - Click **"Sign in with Google"** button in the header
   - You should be redirected to Google's sign-in page
   - Sign in with your Google account
   - Grant permissions if prompted
   - You should be redirected back to your app

4. **Verify Session**
   - After login, you should see:
     - Your profile picture
     - Your name and email
     - A **"Sign Out"** button

5. **Test Logout**
   - Click **"Sign Out"**
   - You should be logged out and see the **"Sign in with Google"** button again

---

## Step 7: Troubleshooting

### Issue: "Error: Invalid credentials"

**Solution:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check for extra spaces or quotes in `.env.local`
- Restart your dev server after changing environment variables

### Issue: "redirect_uri_mismatch"

**Solution:**
- Ensure the redirect URI in Google Cloud Console matches exactly:
  - Local: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://your-domain.com/api/auth/callback/google`
- Check for trailing slashes or typos
- Wait a few minutes after updating (Google caches settings)

### Issue: "Access blocked: This app's request is invalid"

**Solution:**
- Your app might be in "Testing" mode
- Add your email as a test user in OAuth Consent Screen
- Or publish your app (for production use)

### Issue: Session not persisting

**Solution:**
- Verify `NEXTAUTH_SECRET` is set and consistent
- Check that `NEXTAUTH_URL` matches your actual URL
- Clear browser cookies and try again

### Issue: "NEXTAUTH_URL is not set"

**Solution:**
- Add `NEXTAUTH_URL` to your `.env.local`:
  ```
  NEXTAUTH_URL=http://localhost:3000
  ```
- For production, use your actual domain

---

## Step 8: Production Checklist

Before deploying to production:

- [ ] OAuth Consent Screen is published (or app is in production mode)
- [ ] Authorized JavaScript origins include your production domain
- [ ] Authorized redirect URIs include your production callback URL
- [ ] Environment variables are set in your hosting platform
- [ ] `NEXTAUTH_URL` is set to your production domain
- [ ] `NEXTAUTH_SECRET` is a strong, random value
- [ ] Test the login flow in production

---

## Security Best Practices

1. **Never commit credentials to Git**
   - `.env.local` should be in `.gitignore`
   - Use environment variables in production

2. **Use Strong Secrets**
   - `NEXTAUTH_SECRET` should be at least 32 characters
   - Use a cryptographically secure random generator

3. **Limit OAuth Scopes**
   - Only request the scopes you need
   - Default scopes (`openid`, `email`, `profile`) are usually sufficient

4. **HTTPS in Production**
   - Always use HTTPS in production
   - Google requires HTTPS for OAuth in production

5. **Regularly Rotate Secrets**
   - Periodically update `NEXTAUTH_SECRET`
   - Rotate OAuth credentials if compromised

---

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)

---

## Quick Reference: Environment Variables

```env
# Required
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3000  # or https://your-domain.com
NEXTAUTH_SECRET=your-random-32-char-secret
```

---

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the server console (terminal) for errors
3. Verify all environment variables are set
4. Ensure Google Cloud Console settings match your configuration
5. Review the troubleshooting section above

---

**Congratulations!** 🎉 You've successfully set up Google SSO for your application!
