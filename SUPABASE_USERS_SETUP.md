# Supabase Users Table Setup Guide

This guide will help you set up the users table in Supabase to store Google SSO user information.

## Step 1: Create the Users Table in Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

3. **Run the Users Table Schema**
   - Open the file `supabase-users-schema.sql` from your project
   - Copy the entire SQL content
   - Paste it into the SQL Editor
   - Click **"Run"** (or press Ctrl+Enter)

   This will create:
   - ✅ `users` table with all necessary fields
   - ✅ Indexes for better performance
   - ✅ Auto-update trigger for `updated_at`
   - ✅ Row Level Security policies

## Step 2: Verify the Table

1. **Check Table Editor**
   - Click **"Table Editor"** in the left sidebar
   - You should see the `users` table
   - Click on it to see the structure

2. **Verify Table Structure**
   The table should have these columns:
   - `id` (UUID, Primary Key)
   - `email` (VARCHAR, Unique, Not Null)
   - `name` (VARCHAR)
   - `image` (TEXT)
   - `provider` (VARCHAR, Default: 'google')
   - `provider_id` (VARCHAR, Unique, Not Null)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
   - `last_login` (TIMESTAMP)

## Step 3: Test User Creation

1. **Start Your Development Server**
   ```bash
   yarn dev
   ```

2. **Test Google Login**
   - Navigate to: http://localhost:3000
   - Click **"Sign in with Google"**
   - Complete the OAuth flow

3. **Verify User in Supabase**
   - Go back to Supabase Dashboard
   - Click **"Table Editor"** → **"users"**
   - You should see your user record with:
     - Your email address
     - Your name
     - Your profile image URL
     - Provider: "google"
     - Provider ID (from Google)
     - Created at timestamp
     - Last login timestamp

## How It Works

### First Login Flow

1. User clicks "Sign in with Google"
2. User authenticates with Google
3. NextAuth `jwt` callback is triggered
4. System checks if user exists in Supabase by email
5. If user doesn't exist:
   - Creates new user record in Supabase
   - Stores: email, name, image, provider, provider_id
6. If user exists:
   - Updates `last_login` timestamp
   - Updates name and image (in case they changed)
7. User session is created with Supabase user ID

### Subsequent Logins

1. User signs in again
2. System finds existing user by email
3. Updates `last_login` timestamp
4. Updates name/image if changed
5. User session is created

## Table Schema Details

```sql
users
├── id (UUID) - Primary key, auto-generated
├── email (VARCHAR) - User's email (unique)
├── name (VARCHAR) - User's display name
├── image (TEXT) - Profile image URL
├── provider (VARCHAR) - OAuth provider ('google')
├── provider_id (VARCHAR) - Google user ID (unique)
├── created_at (TIMESTAMP) - Account creation time
├── updated_at (TIMESTAMP) - Last update time
└── last_login (TIMESTAMP) - Last login time
```

## Indexes

The schema creates indexes on:
- `email` - For fast email lookups
- `provider_id` - For fast provider ID lookups
- `provider` - For filtering by provider

## Row Level Security (RLS)

The schema includes a permissive policy for development:
- Allows all operations (SELECT, INSERT, UPDATE, DELETE)
- **For production**, you should update this policy to:
  - Only allow authenticated users to read their own data
  - Only allow system to create/update users

## Troubleshooting

### Error: "relation 'users' does not exist"

**Solution:**
- Make sure you ran the SQL schema in Step 1
- Check the SQL Editor for any errors
- Verify the table exists in Table Editor

### Error: "duplicate key value violates unique constraint"

**Solution:**
- This means a user with that email already exists
- The system will update the existing user instead of creating a new one
- This is expected behavior for returning users

### User not appearing in Supabase

**Check:**
1. Browser console for errors (F12)
2. Server console (terminal) for Supabase errors
3. Verify Supabase credentials in `.env.local`
4. Check RLS policies allow inserts

### "new row violates row-level security policy"

**Solution:**
- The schema includes a permissive policy
- If you see this error, check RLS policies:
  - Go to: Table Editor → users → Policies
  - Ensure "Allow all operations" policy exists and is enabled

## Production Considerations

### 1. Update RLS Policies

Replace the permissive policy with:

```sql
-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Allow system to insert new users
CREATE POLICY "System can insert users" ON users
  FOR INSERT
  WITH CHECK (true);

-- Allow system to update users
CREATE POLICY "System can update users" ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

### 2. Add Additional Fields (Optional)

You might want to add:
- `role` - User role (admin, user, etc.)
- `is_active` - Account status
- `preferences` - JSON field for user preferences
- `metadata` - JSON field for additional data

### 3. Backup Strategy

- Set up regular backups in Supabase
- Export user data periodically
- Keep audit logs of user changes

## API Usage

Once users are stored in Supabase, you can:

1. **Query users from your API routes:**
   ```javascript
   import { supabaseServer } from "@/lib/supabase-server";
   
   const { data: users } = await supabaseServer
     .from("users")
     .select("*");
   ```

2. **Get user by email:**
   ```javascript
   const { data: user } = await supabaseServer
     .from("users")
     .select("*")
     .eq("email", "user@example.com")
     .single();
   ```

3. **Get user by Supabase ID:**
   ```javascript
   const { data: user } = await supabaseServer
     .from("users")
     .select("*")
     .eq("id", supabaseUserId)
     .single();
   ```

## Next Steps

- ✅ Users are automatically saved on first login
- ✅ Last login is updated on each sign-in
- ✅ User data is linked to Supabase user ID
- 🔄 Consider adding user preferences
- 🔄 Consider adding user roles/permissions
- 🔄 Consider adding user activity tracking

## Support

If you encounter issues:
1. Check server console for detailed error messages
2. Verify Supabase credentials are correct
3. Check RLS policies are configured properly
4. Review the troubleshooting section above

---

**Congratulations!** 🎉 Your users will now be automatically saved to Supabase on first login!
