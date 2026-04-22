import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ✅ Log in development
  if (process.env.NODE_ENV === "development") {
    console.debug("[Middleware] Checking auth for path:", pathname);
  }

  // 1. Jika mencoba akses rute terproteksi (Dashboard, Admin, Invoices, dll)
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/subscription") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/support");

  if (isProtectedRoute && !user) {
    // Redirect ke login jika belum autentikasi
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Jika sudah login, cek Role untuk proteksi Admin vs Customer
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";
    const isAdminRoute = pathname.startsWith("/admin");

    // Jika mencoba akses rute Admin tapi bukan Admin
    if (isAdminRoute && !isAdmin) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Middleware] Non-admin tried to access admin route. Redirecting to /dashboard");
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Jika Admin mencoba akses rute Dashboard Customer (Opsional: biasanya admin dibiarkan saja atau redirect ke admin)
    if (pathname === "/dashboard" && isAdmin) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Middleware] Admin accessed /dashboard. Redirecting to /admin/dashboard");
      }
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

