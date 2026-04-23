/**
 * POST /api/auth/register
 * Server-side register endpoint dengan validation & rate limiting
 */

import { createServerClient } from "@supabase/ssr";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { VALIDATION, MESSAGES, USER_ROLES } from "@/lib/constants";
import {
  checkRateLimit,
  getClientIP,
  createRateLimitKey,
} from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // ✅ Rate limiting check (5 attempts per 1 hour - stricter untuk register)
    const clientIP = getClientIP(request);
    const rateLimitKey = createRateLimitKey(clientIP, "/api/auth/register");
    const rateLimitResult = checkRateLimit(rateLimitKey, 5, 60 * 60 * 1000);

    if (!rateLimitResult.isAllowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan registrasi. Coba lagi dalam ${rateLimitResult.retryAfter} detik.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": (rateLimitResult.retryAfter || 3600).toString(),
          },
        },
      );
    }

    const body = await request.json();
    const { email, password, confirmPassword, fullName } = body;

    // ✅ Input validation
    if (!email || !password || !confirmPassword || !fullName) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
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

    if (!VALIDATION.PASSWORD_REGEX.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password harus mengandung huruf besar, huruf kecil, dan angka",
        },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Password tidak cocok" },
        { status: 400 },
      );
    }

    if (fullName.trim().length < 3) {
      return NextResponse.json(
        { error: "Nama minimal 3 karakter" },
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

    // ✅ Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("[API] Register error:", error.code);
      if (error.code === "user_already_exists") {
        return NextResponse.json(
          { error: "Email sudah terdaftar" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: MESSAGES.AUTH.REGISTER_FAILED },
        { status: 400 },
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: MESSAGES.AUTH.REGISTER_FAILED },
        { status: 400 },
      );
    }

    // ✅ Create profile (Gunakan Admin Client untuk bypass RLS saat registrasi)
    const adminClient = createSupabaseAdmin();
    if (!adminClient) {
      return NextResponse.json(
        { error: "Server configuration error (Admin client missing)" },
        { status: 500 },
      );
    }

    const { error: profileError } = await adminClient.from("profiles").upsert([
      {
        id: data.user.id,
        email,
        full_name: fullName,
        role: USER_ROLES.USER,
        updated_at: new Date().toISOString(),
      },
    ], { onConflict: 'id' });

    if (profileError) {
      console.error("[API] Profile creation error:", profileError);
      // ✅ Cleanup: Delete from Auth if Profile creation failed
      await adminClient.auth.admin.deleteUser(data.user.id);
      return NextResponse.json(
        { error: MESSAGES.ERROR.SAVE_FAILED },
        { status: 500 },
      );
    }

    // ✅ Return success response
    return NextResponse.json(
      {
        success: true,
        message: MESSAGES.AUTH.REGISTER_SUCCESS,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[API] Register exception:", error);
    return NextResponse.json(
      { error: MESSAGES.ERROR.SERVER_ERROR },
      { status: 500 },
    );
  }
}
