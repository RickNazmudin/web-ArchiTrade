import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Matikan semua logika auth sementara untuk mengetes apakah website bisa terbuka
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
