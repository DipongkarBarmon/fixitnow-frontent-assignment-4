import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

function parseJwtPayload(token?: string): Record<string, any> | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token?: string): boolean {
  if (!token) return true;
  try {
    const payload = parseJwtPayload(token);
    if (!payload) return true;
    if (payload.exp && typeof payload.exp === "number") {
      // Check expiration in seconds (with 10s grace period)
      return Date.now() >= (payload.exp - 10) * 1000;
    }
    return false;
  } catch {
    return true;
  }
}

function getRoleFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const payload = parseJwtPayload(token);
    if (!payload) return null;
    const role = payload?.role || payload?.user?.role || payload?.roleName;
    return typeof role === "string" ? role.toUpperCase() : null;
  } catch {
    return null;
  }
}

function getDashboardByRole(role?: string | null): string {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "TECHNICIAN") return "/technician-dashboard";
  return "/dashboard";
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const expired = isTokenExpired(accessToken);
  const isValidAuth = !!accessToken && !expired;
  const role = isValidAuth ? getRoleFromToken(accessToken) : null;

  // Check route types
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/technician-dashboard") ||
    pathname.startsWith("/admin-dashboard");
  const isApiRoute = pathname.startsWith("/api");

  // Allow API routes
  if (isApiRoute) return NextResponse.next();

  // If visiting auth pages (login/register) and user ALREADY has a VALID non-expired session,
  // redirect them to their dashboard unless ?force=true is passed
  if (isAuthRoute && isValidAuth && !searchParams.has("force")) {
    const destination = getDashboardByRole(role);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // If visiting auth pages and the cookie has an EXPIRED or INVALID token,
  // clear the stale cookies so the login/register forms can be used cleanly
  if (isAuthRoute && accessToken && !isValidAuth) {
    const response = NextResponse.next();
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // Protect dashboard routes: if not authenticated or token expired, redirect to login
  if (isDashboardRoute && !isValidAuth) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (accessToken && !isValidAuth) {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }
    return response;
  }

  // Role-based protection on dashboard routes
  if (isDashboardRoute && isValidAuth) {
    if (pathname.startsWith("/admin-dashboard") && role !== "ADMIN") {
      return NextResponse.redirect(new URL(getDashboardByRole(role), request.url));
    }

    if (pathname.startsWith("/technician-dashboard") && role !== "TECHNICIAN" && role !== "ADMIN") {
      return NextResponse.redirect(new URL(getDashboardByRole(role), request.url));
    }

    // Direct root customer dashboard access redirect for admins/technicians
    if (pathname === "/dashboard" && role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }

    if (pathname === "/dashboard" && role === "TECHNICIAN") {
      return NextResponse.redirect(new URL("/technician-dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
