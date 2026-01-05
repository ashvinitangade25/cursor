# Disable SSL Certificate Verification

To disable SSL certificate verification for development, you have two options:

## Option 1: Environment Variable (Recommended)

Add this to your `.env.local` file:

```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```

Then restart your development server.

## Option 2: Set in PowerShell before starting server

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
npm run dev
```

## Option 3: Set in Command Prompt before starting server

```cmd
set NODE_TLS_REJECT_UNAUTHORIZED=0
npm run dev
```

## Important Security Warning

⚠️ **NEVER use this in production!** Disabling SSL certificate verification is a security risk and should only be used in development environments.
