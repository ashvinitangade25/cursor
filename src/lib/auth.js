import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseServer } from "./supabase-server";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      // This callback runs when a user signs in
      if (account && user) {
        console.log("🔐 JWT Callback triggered - User signing in:", {
          email: user.email,
          name: user.name,
          provider: account.provider,
        });

        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.providerId = account.providerAccountId;

        // Save or update user in Supabase
        try {
          // Verify Supabase connection
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

          if (!supabaseUrl || !supabaseKey) {
            console.error("❌ Supabase environment variables are missing!");
            console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
            console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "✅ Set" : "❌ Missing");
            return token; // Continue without Supabase
          }

          console.log("📊 Checking if user exists in Supabase...");
          
          // Check if user already exists in Supabase
          const { data: existingUser, error: fetchError } = await supabaseServer
            .from("users")
            .select("id, email, last_login")
            .eq("email", user.email)
            .maybeSingle();

          if (fetchError) {
            if (fetchError.code === "PGRST116") {
              // PGRST116 is "no rows returned" - which is expected for new users
              console.log("ℹ️ User not found (new user):", user.email);
            } else {
              console.error("❌ Error checking user in Supabase:", {
                code: fetchError.code,
                message: fetchError.message,
                details: fetchError.details,
                hint: fetchError.hint,
              });
              return token; // Continue without Supabase
            }
          }

          if (existingUser) {
            console.log("✅ User exists, updating last_login:", existingUser.email);
            
            // User exists, update last_login timestamp
            const { data: updatedUser, error: updateError } = await supabaseServer
              .from("users")
              .update({
                last_login: new Date().toISOString(),
                name: user.name,
                image: user.image,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingUser.id)
              .select("id")
              .single();

            if (updateError) {
              console.error("❌ Error updating user in Supabase:", {
                code: updateError.code,
                message: updateError.message,
                details: updateError.details,
                hint: updateError.hint,
              });
            } else {
              console.log("✅ User login updated successfully:", updatedUser.id);
              // Store Supabase user ID in token
              token.supabaseUserId = existingUser.id;
            }
          } else {
            console.log("🆕 Creating new user in Supabase:", user.email);
            
            // New user, create in Supabase
            const { data: newUser, error: insertError } = await supabaseServer
              .from("users")
              .insert({
                email: user.email,
                name: user.name,
                image: user.image,
                provider: account.provider,
                provider_id: account.providerAccountId,
                last_login: new Date().toISOString(),
              })
              .select("id, email")
              .single();

            if (insertError) {
              console.error("❌ Error creating user in Supabase:", {
                code: insertError.code,
                message: insertError.message,
                details: insertError.details,
                hint: insertError.hint,
              });
              
              // Common error: table doesn't exist
              if (insertError.code === "42P01" || insertError.message?.includes("does not exist")) {
                console.error("💡 TIP: The 'users' table might not exist. Run the SQL schema from supabase-users-schema.sql");
              }
              
              // Common error: RLS policy blocking
              if (insertError.code === "42501" || insertError.message?.includes("row-level security")) {
                console.error("💡 TIP: RLS policy might be blocking the insert. Check your Row Level Security policies.");
              }
            } else {
              console.log("✅ New user created successfully in Supabase:", {
                id: newUser.id,
                email: newUser.email,
              });
              // Store Supabase user ID in token
              token.supabaseUserId = newUser.id;
            }
          }
        } catch (error) {
          console.error("❌ Unexpected error in user save/update:", {
            message: error.message,
            stack: error.stack,
          });
          // Don't block authentication if Supabase fails
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.supabaseUserId = token.supabaseUserId;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

//export default NextAuth(authOptions);
