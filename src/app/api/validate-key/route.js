import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import https from "https";

// Disable SSL certificate verification
// WARNING: This should only be used in development, never in production!
if (typeof process !== "undefined") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // Configure HTTPS agent to reject unauthorized certificates
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  // Set as default agent
  https.globalAgent = httpsAgent;
}

/**
 * POST /api/validate-key
 * Validates an API key and returns whether it's valid
 *
 * Request body: { key: string }
 * Response: { valid: boolean, message: string, data?: object }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { key } = body;

    // Validate input
    if (!key || typeof key !== "string" || key.trim() === "") {
      return NextResponse.json(
        {
          valid: false,
          message: "API key is required",
        },
        { status: 400 }
      );
    }

    // Query Supabase to check if the API key exists and is active
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, status, key, usage")
      .eq("key", key.trim())
      .eq("status", "active")
      .maybeSingle();

    // Handle Supabase errors
    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" - which is expected for invalid keys
      console.error("Error validating API key:", error);
      return NextResponse.json(
        {
          valid: false,
          message: "Error validating API key. Please try again.",
        },
        { status: 500 }
      );
    }

    // Check if key is valid
    if (data && data.status === "active") {
      // Valid API key - increment usage counter
      await supabase
        .from("api_keys")
        .update({ usage: (data.usage || 0) + 1 })
        .eq("id", data.id);

      return NextResponse.json({
        valid: true,
        message: "Valid API key",
        data: {
          id: data.id,
          name: data.name,
          status: data.status,
        },
      });
    } else {
      // Invalid API key
      return NextResponse.json({
        valid: false,
        message: "Invalid API key. Please check your key and try again.",
      });
    }
  } catch (error) {
    console.error("Error in validate-key API:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError || error.message?.includes("JSON")) {
      return NextResponse.json(
        {
          valid: false,
          message: "Invalid request body",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        valid: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
