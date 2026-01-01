# Supabase Setup Guide

Follow these steps to connect your API Keys Dashboard to Supabase.

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"** and wait for it to be ready (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 3: Set Up Environment Variables

1. In your project root, create a file named `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-id` with your actual project ID
- `your-anon-key-here` with your actual anon key

## Step 4: Create the Database Table

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase-schema.sql` from your project
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)

This will create:
- ✅ `api_keys` table
- ✅ Indexes for performance
- ✅ Auto-update trigger for `updated_at`
- ✅ Row Level Security policies

## Step 5: Verify the Table

1. In Supabase dashboard, click **Table Editor**
2. You should see `api_keys` table
3. Click on it to see the structure

## Step 6: Test the Integration

1. Make sure your `.env.local` file is set up correctly
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Navigate to `/Dashbords` in your browser
4. Try creating an API key
5. Check Supabase Table Editor to see if the data appears

## Troubleshooting

### Error: "Missing Supabase environment variables"
- ✅ Check that `.env.local` exists in the project root
- ✅ Verify variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Restart your dev server after creating/updating `.env.local`

### Error: "relation 'api_keys' does not exist"
- ✅ Make sure you ran the SQL schema in Step 4
- ✅ Check the SQL Editor for any errors
- ✅ Verify the table exists in Table Editor

### Error: "new row violates row-level security policy"
- ✅ The schema includes a permissive policy for development
- ✅ If you see this error, check RLS policies in Supabase
- ✅ Go to: Table Editor > api_keys > Policies

### Data not appearing
- ✅ Check browser console for errors
- ✅ Verify credentials in `.env.local` are correct
- ✅ Check Supabase dashboard > Table Editor to see if data is there
- ✅ Make sure you're looking at the right project

### Connection issues
- ✅ Verify your Supabase project is active (not paused)
- ✅ Check your internet connection
- ✅ Try refreshing the page

## Security Notes

⚠️ **For Production:**
- The current RLS policy allows all operations (for development)
- In production, you should:
  1. Add user authentication
  2. Update RLS policies to restrict access
  3. Only allow authenticated users to manage their own API keys

## Next Steps

- ✅ Add user authentication (Supabase Auth)
- ✅ Customize RLS policies for your use case
- ✅ Add more fields to the `api_keys` table if needed
- ✅ Set up database backups in Supabase

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
