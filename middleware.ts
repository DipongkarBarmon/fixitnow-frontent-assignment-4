import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Check if the path starts with any public route pattern
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/technician-dashboard") || pathname.startsWith("/admin-dashboard");
  const isApiRoute = pathname.startsWith("/api");

  // Allow API routes
  if (isApiRoute) return NextResponse.next();

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect dashboard routes
  if (isDashboardRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
