/**
 * POST /api/auth/logout
 * Server-side logout endpoint dengan rate limiting
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { MESSAGES } from "@/lib/constants";
import {
  checkRateLimit,
  getClientIP,
  createRateLimitKey,
} from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // ✅ Rate limiting check (generous limit untuk logout)
    const clientIP = getClientIP(request);
    const rateLimitKey = createRateLimitKey(clientIP, "/api/auth/logout");
    const rateLimitResult = checkRateLimit(rateLimitKey, 20, 60 * 1000);

    if (!rateLimitResult.isAllowed) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan logout" },
        { status: 429 },
      );
    }

    let response = NextResponse.json({ success: true });

    // ✅ Create server-side Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    // ✅ Sign out user
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[API] Logout error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // ✅ Clear auth cookies
    response.cookies.delete("auth_token");

    return NextResponse.json({
      success: true,
      message: MESSAGES.AUTH.LOGOUT_SUCCESS,
    });
  } catch (error: any) {
    console.error("[API] Logout exception:", error);
    return NextResponse.json(
      { error: MESSAGES.ERROR.SERVER_ERROR },
      { status: 500 },
    );
  }
}
