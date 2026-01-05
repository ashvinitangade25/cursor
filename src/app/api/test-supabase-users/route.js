import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

/**
 * GET /api/test-supabase-users
 * Test endpoint to verify Supabase connection and users table access
 */
export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Supabase environment variables",
          details: {
            NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "✅ Set" : "❌ Missing",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey ? "✅ Set" : "❌ Missing",
          },
        },
        { status: 500 }
      );
    }

    // Test 1: Check if we can query the users table
    console.log("Testing Supabase connection...");
    const { data: users, error: queryError } = await supabaseServer
      .from("users")
      .select("id, email, name, created_at")
      .limit(5);

    if (queryError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to query users table",
          details: {
            code: queryError.code,
            message: queryError.message,
            details: queryError.details,
            hint: queryError.hint,
          },
          troubleshooting: {
            tableExists: queryError.code === "42P01" ? "❌ Table doesn't exist" : "✅ Table exists",
            rlsIssue: queryError.code === "42501" ? "❌ RLS policy blocking" : "✅ RLS OK",
            suggestion: queryError.code === "42P01"
              ? "Run the SQL schema from supabase-users-schema.sql"
              : queryError.code === "42501"
              ? "Check Row Level Security policies in Supabase"
              : "Check Supabase connection and credentials",
          },
        },
        { status: 500 }
      );
    }

    // Test 2: Try to insert a test record (then delete it)
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: insertData, error: insertError } = await supabaseServer
      .from("users")
      .insert({
        email: testEmail,
        name: "Test User",
        provider: "test",
        provider_id: `test-${Date.now()}`,
      })
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to insert test user",
          details: {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
          },
          queryTest: {
            success: true,
            userCount: users?.length || 0,
          },
          troubleshooting: {
            rlsIssue: insertError.code === "42501" ? "❌ RLS policy blocking inserts" : "✅ RLS OK",
            suggestion: insertError.code === "42501"
              ? "Update RLS policy to allow inserts. Check SUPABASE_USERS_SETUP.md"
              : "Check table structure and constraints",
          },
        },
        { status: 500 }
      );
    }

    // Clean up test record
    if (insertData?.id) {
      await supabaseServer.from("users").delete().eq("id", insertData.id);
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection and users table are working correctly",
      tests: {
        connection: "✅ Connected",
        tableExists: "✅ Table exists",
        canQuery: "✅ Can query",
        canInsert: "✅ Can insert",
        canDelete: "✅ Can delete",
      },
      currentUsers: users?.length || 0,
      sampleUsers: users || [],
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
