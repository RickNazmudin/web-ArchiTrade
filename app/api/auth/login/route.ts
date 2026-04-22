/**
 * POST /api/auth/login
 * Server-side login endpoint dengan validation & rate limiting
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { VALIDATION, MESSAGES } from "@/lib/constants";
import {
  checkRateLimit,
  getClientIP,
  createRateLimitKey,
} from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // ✅ Rate limiting check (10 attempts per 15 minutes)
    const clientIP = getClientIP(request);
    const rateLimitKey = createRateLimitKey(clientIP, "/api/auth/login");
    const rateLimitResult = checkRateLimit(rateLimitKey, 10, 15 * 60 * 1000);

    if (!rateLimitResult.isAllowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login. Coba lagi dalam ${rateLimitResult.retryAfter} detik.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": (rateLimitResult.retryAfter || 900).toString(),
          },
        },
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // ✅ Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 },
      );
    }

    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 },
      );
    }

    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        {
          error: `Password minimal ${VALIDATION.PASSWORD_MIN_LENGTH} karakter`,
        },
        { status: 400 },
      );
    }

    // ✅ Create server-side Supabase client
    let response = NextResponse.json({ success: true });
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

    // ✅ Authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[API] Login error:", error.code);
      return NextResponse.json(
        { error: MESSAGES.AUTH.LOGIN_FAILED },
        { status: 401 },
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: MESSAGES.AUTH.LOGIN_FAILED },
        { status: 401 },
      );
    }

    // ✅ Fetch user profile for role
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, full_name")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("[API] Profile fetch error:", profileError);
      return NextResponse.json(
        { error: MESSAGES.ERROR.FETCH_FAILED },
        { status: 500 },
      );
    }

    // ✅ Create final response with user data
    const finalResponse = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      profile: {
        role: profileData?.role,
        full_name: profileData?.full_name,
      },
    });

    // ✅ Copy all cookies from auth response to final response
    if (data.session?.access_token) {
      finalResponse.cookies.set("auth_token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    // ✅ Copy session cookies from initial response
    response.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value);
    });

    return finalResponse;
  } catch (error: any) {
    console.error("[API] Login exception:", error);
    return NextResponse.json(
      { error: MESSAGES.ERROR.SERVER_ERROR },
      { status: 500 },
    );
  }
}
