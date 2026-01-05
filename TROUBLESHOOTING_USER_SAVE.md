# Troubleshooting: User Data Not Saving to Supabase

If user data is not being saved to the `users` table after Google login, follow these steps:

## Step 1: Test Supabase Connection

1. **Start your development server:**
   ```bash
   yarn dev
   ```

2. **Test the Supabase connection:**
   - Open: http://localhost:3000/api/test-supabase-users
   - This will test:
     - ✅ Supabase connection
     - ✅ Users table exists
     - ✅ Can query users
     - ✅ Can insert users
     - ✅ Can delete users

3. **Check the response:**
   - If all tests pass: ✅ Connection is working
   - If tests fail: Follow the error messages below

## Step 2: Check Server Console Logs

When you log in, check your terminal (where `yarn dev` is running) for logs:

**Expected logs on successful login:**
```
🔐 JWT Callback triggered - User signing in: { email: '...', name: '...', provider: 'google' }
📊 Checking if user exists in Supabase...
🆕 Creating new user in Supabase: user@example.com
✅ New user created successfully in Supabase: { id: '...', email: '...' }
```

**If you see errors:**
- Look for ❌ symbols
- Check the error code and message
- Follow the troubleshooting steps below

## Step 3: Common Issues and Solutions

### Issue 1: "Table doesn't exist" (Error code: 42P01)

**Symptoms:**
- Error: `relation "users" does not exist`
- Test endpoint shows: `tableExists: ❌ Table doesn't exist`

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `supabase-users-schema.sql`
3. Verify table exists: Table Editor → `users` table
4. Try logging in again

### Issue 2: "RLS policy blocking" (Error code: 42501)

**Symptoms:**
- Error: `new row violates row-level security policy`
- Test endpoint shows: `rlsIssue: ❌ RLS policy blocking`

**Solution:**
1. Go to Supabase Dashboard → Table Editor → `users` table
2. Click on "Policies" tab
3. Check if "Allow all operations" policy exists
4. If not, create it:
   ```sql
   CREATE POLICY "Allow all operations" ON users
     FOR ALL
     USING (true)
     WITH CHECK (true);
   ```
5. Or disable RLS temporarily for testing:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ```

### Issue 3: Missing Environment Variables

**Symptoms:**
- Console shows: `❌ Supabase environment variables are missing!`
- Test endpoint shows environment variables as missing

**Solution:**
1. Check `.env.local` file exists in project root
2. Verify it contains:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Restart dev server after adding variables:
   ```bash
   # Stop server (Ctrl+C)
   yarn dev
   ```

### Issue 4: JWT Callback Not Running

**Symptoms:**
- No logs in console when logging in
- User can log in but no Supabase operations happen

**Solution:**
1. Check that `src/lib/auth.js` is properly configured
2. Verify NextAuth route exists: `src/app/api/auth/[...nextauth]/route.js`
3. Check browser console for NextAuth errors
4. Try signing out and signing in again

### Issue 5: Duplicate Key Error

**Symptoms:**
- Error: `duplicate key value violates unique constraint`
- User already exists but update fails

**Solution:**
- This is actually OK - it means the user exists
- The system should update the existing user
- Check if the update query is working
- Look for "User exists, updating last_login" in logs

## Step 4: Manual Verification

### Check if Users Table Exists

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Look for `users` table
4. If missing, run the schema SQL

### Check Table Structure

The `users` table should have:
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `name` (VARCHAR)
- `image` (TEXT)
- `provider` (VARCHAR)
- `provider_id` (VARCHAR, Unique)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `last_login` (TIMESTAMP)

### Check RLS Policies

1. Go to Supabase Dashboard → Table Editor → `users`
2. Click **Policies** tab
3. Should see "Allow all operations" policy
4. If not, create it (see Issue 2 above)

### Check Environment Variables

Run this in your terminal:
```bash
node -e "console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'); console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');"
```

Or check `.env.local` file directly.

## Step 5: Debug Checklist

Use this checklist to systematically debug:

- [ ] Supabase project is active (not paused)
- [ ] Environment variables are set in `.env.local`
- [ ] Dev server was restarted after adding env variables
- [ ] `users` table exists in Supabase
- [ ] Table has correct structure (all columns)
- [ ] RLS policy allows inserts
- [ ] Test endpoint (`/api/test-supabase-users`) passes all tests
- [ ] Server console shows JWT callback logs
- [ ] No errors in server console
- [ ] No errors in browser console

## Step 6: Enable Detailed Logging

The updated code now includes detailed logging. When you log in, you should see:

1. **JWT Callback triggered** - Confirms callback is running
2. **Checking if user exists** - Confirms Supabase query
3. **Creating new user** or **User exists, updating** - Shows the action
4. **Success/Error messages** - Shows the result

If you don't see these logs, the JWT callback might not be running.

## Step 7: Test the Flow

1. **Clear browser cookies** (to force fresh login)
2. **Sign out** if already signed in
3. **Sign in with Google**
4. **Watch server console** for logs
5. **Check Supabase Table Editor** for new user

## Still Not Working?

If none of the above works:

1. **Share the error message** from server console
2. **Share the test endpoint response** (`/api/test-supabase-users`)
3. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for errors related to `users` table

## Quick Fix Commands

### Recreate Users Table

```sql
-- Drop and recreate (WARNING: This deletes all users!)
DROP TABLE IF EXISTS users CASCADE;

-- Then run the schema from supabase-users-schema.sql
```

### Reset RLS Policies

```sql
-- Drop all policies
DROP POLICY IF EXISTS "Allow all operations" ON users;

-- Recreate permissive policy
CREATE POLICY "Allow all operations" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Disable RLS (Development Only)

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

---

**Need more help?** Check the server console logs and share the error messages for more specific guidance.
