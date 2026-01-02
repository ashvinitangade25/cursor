# Vercel Deployment Guide

## Fixing "Failed to fetch" Error

The "Failed to fetch" error on Vercel is caused by missing Supabase environment variables. Follow these steps to fix it:

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add the following variables:

### For Production:
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Supabase Project URL (e.g., `https://xxxxx.supabase.co`)
- **Environment**: Select `Production`, `Preview`, and `Development`

- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anon public key
- **Environment**: Select `Production`, `Preview`, and `Development`

5. Click **Save** for each variable

## Step 3: Redeploy Your Application

After adding the environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the **⋯** (three dots) menu on your latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

## Step 4: Verify the Fix

1. Wait for the deployment to complete
2. Visit your Vercel app URL
3. The "Failed to fetch" error should be resolved
4. Check the browser console (F12) to ensure there are no Supabase connection errors

## Troubleshooting

### Still getting "Failed to fetch"?
- ✅ Verify environment variable names are **exactly**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Check that values are correct (no extra spaces, correct URLs)
- ✅ Ensure variables are enabled for the correct environment (Production/Preview/Development)
- ✅ Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- ✅ Check Vercel deployment logs for any errors

### Environment variables not updating?
- ✅ Make sure you clicked **Save** after adding each variable
- ✅ Redeploy your application after adding variables
- ✅ Check that you're viewing the correct project in Vercel

### CORS errors?
- ✅ Verify your Supabase project is active (not paused)
- ✅ Check Supabase dashboard → Settings → API → CORS settings
- ✅ Ensure your Vercel domain is allowed in Supabase CORS settings (if applicable)

## Local Development Setup

For local development, create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit `.env.local` to Git. It's already in `.gitignore`.

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
