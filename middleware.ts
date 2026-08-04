import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

function getRoleFromToken(token?: string): string | null {
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
    const parsed = JSON.parse(jsonPayload);
    const role = parsed?.role || parsed?.user?.role || parsed?.roleName;
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
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const role = getRoleFromToken(accessToken);

  // Check if the path starts with any public route pattern
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/technician-dashboard") ||
    pathname.startsWith("/admin-dashboard");
  const isApiRoute = pathname.startsWith("/api");

  // Allow API routes
  if (isApiRoute) return NextResponse.next();

  // Redirect authenticated users away from auth pages to their role-specific dashboard
  if (isAuthRoute && accessToken) {
    const destination = getDashboardByRole(role);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Protect dashboard routes
  if (isDashboardRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based protection on dashboard routes
  if (isDashboardRoute && accessToken) {
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
