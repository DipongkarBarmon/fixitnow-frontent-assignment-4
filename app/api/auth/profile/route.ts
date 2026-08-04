import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/api-client";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

function decodeJwtPayload(token: string): Record<string, any> | null {
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

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ success: false, data: null });
  }

  // Attempt to decode user info from the token as a dependable baseline
  const tokenPayload = decodeJwtPayload(accessToken);
  let fallbackUser: any = null;

  if (tokenPayload) {
    const rawRole =
      tokenPayload.role ||
      tokenPayload.user?.role ||
      tokenPayload.roleName ||
      "CUSTOMER";
    const normalizedRole = typeof rawRole === "string" ? rawRole.toUpperCase() : "CUSTOMER";
    const email = tokenPayload.email || tokenPayload.user?.email || "";
    const name = tokenPayload.name || tokenPayload.user?.name || (email ? email.split("@")[0] : "User");
    const id = tokenPayload.userId || tokenPayload.id || tokenPayload.sub || "user-id";

    fallbackUser = {
      id,
      email,
      name,
      role: normalizedRole,
      avatar: tokenPayload.avatar || tokenPayload.user?.avatar,
      phone: tokenPayload.phone || tokenPayload.user?.phone,
      isVerified: tokenPayload.isVerified ?? true,
      createdAt: tokenPayload.createdAt || new Date().toISOString(),
      updatedAt: tokenPayload.updatedAt || new Date().toISOString(),
    };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const rawUser = data?.data || data?.user || (data?.success ? data : null);

      if (rawUser && typeof rawUser === "object" && rawUser.email) {
        const role = typeof rawUser.role === "string" ? rawUser.role.toUpperCase() : "CUSTOMER";
        return NextResponse.json({
          success: true,
          data: {
            ...rawUser,
            role,
          },
        });
      }
    }

    // If backend profile endpoint is not available or returned non-200, use token payload
    if (fallbackUser) {
      return NextResponse.json({ success: true, data: fallbackUser });
    }

    return NextResponse.json({ success: false, data: null });
  } catch {
    // Network failure connecting to backend - use token payload fallback
    if (fallbackUser) {
      return NextResponse.json({ success: true, data: fallbackUser });
    }
    return NextResponse.json({ success: false, data: null });
  }
}
