# Google SSO Quick Start

## 🚀 Quick Setup (5 Minutes)

### 1. Get Google OAuth Credentials

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Navigate to: **APIs & Services** → **Credentials**
4. Click: **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Configure:
   - **Type**: Web application
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copy **Client ID** and **Client Secret**

### 2. Set Environment Variables

Create `.env.local` in your project root:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-secret-here
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Start Your App

```bash
yarn dev
```

### 4. Test Login

1. Open: http://localhost:3000
2. Click **"Sign in with Google"** in the header
3. Sign in with your Google account
4. You're done! 🎉

---

## 📋 Files Created

- ✅ `src/lib/auth.js` - NextAuth configuration
- ✅ `src/app/api/auth/[...nextauth]/route.js` - API route
- ✅ `src/components/SessionProvider.js` - Session provider
- ✅ `src/app/layout.js` - Updated with provider
- ✅ `src/app/page.js` - Login/logout UI added

---

## 🔧 For Production

1. **Update Google Cloud Console:**
   - Add production domain to **Authorized JavaScript origins**
   - Add production callback URL to **Authorized redirect URIs**

2. **Set Environment Variables in Vercel:**
   - Go to: Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain

3. **Redeploy**

---

## ❓ Common Issues

**"redirect_uri_mismatch"**
- Check redirect URI in Google Console matches exactly
- Should be: `http://localhost:3000/api/auth/callback/google`

**"Invalid credentials"**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Restart dev server after changing `.env.local`

**Session not working**
- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your actual URL

---

## 📚 Full Documentation

See `GOOGLE_SSO_SETUP.md` for detailed step-by-step instructions.
