import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return response;
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
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

    const pathname = request.nextUrl.pathname;

    const isProtectedRoute = 
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/subscription") ||
      pathname.startsWith("/invoices") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/notifications") ||
      pathname.startsWith("/support");

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    // Only call getUser if it's a protected route or an auth page (to redirect if already logged in)
    if (isProtectedRoute || isAuthPage) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isProtectedRoute && !user) {
        const url = new URL("/login", request.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }

      if (isAuthPage && user) {
        // Redirect to dashboard if trying to access login/register while logged in
        const profile = await supabase.from("profiles").select("role").eq("id", user.id).single();
        const target = profile.data?.role === "admin" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(target, request.url));
      }
    }

    return response;
  } catch (error) {
    console.error("[Middleware Error]:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
