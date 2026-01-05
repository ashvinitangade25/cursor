# SSL Certificate Fix

## Issue: Self-Signed Certificate Error

**Error Message:**
```
Error: self-signed certificate in certificate chain (SELF_SIGNED_CERT_IN_CHAIN)
```

## Solution Applied

The SSL certificate handling has been added to `src/lib/supabase-server.js` to handle self-signed certificates in development environments.

### What Was Changed

1. **Added SSL Certificate Handling**
   - Disables SSL certificate verification in development mode only
   - Configures HTTPS agent to accept self-signed certificates
   - Only applies when `NODE_ENV !== "production"`

2. **Files Updated**
   - ✅ `src/lib/supabase-server.js` - Added SSL certificate handling

### How It Works

```javascript
// Only in development
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  
  https.globalAgent = httpsAgent;
}
```

### Security Note

⚠️ **Important:** This SSL certificate bypass is **ONLY enabled in development mode**. In production (`NODE_ENV === "production"`), SSL verification remains enabled for security.

### When This Applies

- ✅ Local development (`yarn dev`)
- ✅ Development environment
- ❌ Production environment (SSL verification enabled)

### Testing

After this fix, you should be able to:

1. **Connect to Supabase** without SSL certificate errors
2. **Save users to database** on Google login
3. **Query Supabase** from API routes

### If Issues Persist

If you still see SSL errors:

1. **Check Environment:**
   ```bash
   echo $NODE_ENV
   ```
   Should be `development` or empty (not `production`)

2. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   yarn dev
   ```

3. **Verify Supabase URL:**
   - Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`
   - URL should start with `https://`

4. **Check Network:**
   - Some corporate networks/proxies may interfere
   - Try from a different network if possible

### Production Deployment

In production (Vercel, etc.):

- SSL verification is **enabled** (secure)
- Supabase uses valid SSL certificates
- No SSL bypass needed

### Alternative Solutions (If Needed)

If you need to handle SSL in production (not recommended):

1. **Environment Variable:**
   ```env
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```
   ⚠️ **Only use this if absolutely necessary and understand the security implications**

2. **Custom HTTPS Agent:**
   - Configure Supabase client with custom fetch
   - Use a custom HTTPS agent with certificate handling

### Related Files

- `src/lib/supabase-server.js` - Server-side Supabase client (SSL handling)
- `src/lib/supabase.js` - Client-side Supabase client (browser handles SSL)
- `src/app/api/validate-key/route.js` - Also has SSL handling for reference

---

**Status:** ✅ SSL certificate handling implemented for development environment.
