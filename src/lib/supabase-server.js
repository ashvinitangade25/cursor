import { createClient } from "@supabase/supabase-js";
import https from "https";

// Disable SSL certificate verification for development
// WARNING: This should only be used in development, never in production!
// This handles self-signed certificates and certificate chain issues
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  // Only disable SSL verification in development
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // Configure HTTPS agent to accept self-signed certificates
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  // Set as default agent for all HTTPS requests
  https.globalAgent = httpsAgent;
}

// Server-side Supabase client for use in API routes and server components
// This uses the same environment variables but is optimized for server-side use

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ Supabase environment variables are missing!\n" +
    "For local development: Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local\n" +
    "For Vercel: Add these variables in Project Settings → Environment Variables"
  );
}

export const supabaseServer = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
