"use server";

import { cookies } from "next/headers";

type loginActionState = {
  email: string;
  password: string;
};

export const loginAction = async (formData: loginActionState) => {
  const { email, password } = formData;
  const payload = { email, password };

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    let result;
    try {
      result = await res.json();
    } catch {
      return {
        success: false,
        message: `Backend returned invalid response (${res.status} ${res.statusText})`,
      };
    }

    if (result.success && result.data?.accessToken) {
      const cookieStore = await cookies();
      const isProduction = process.env.NODE_ENV === "production";

      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      });

      if (result.data?.refreshToken) {
        cookieStore.set("refreshToken", result.data.refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      // Ensure user and role exist in result.data with normalized uppercase role
      try {
        let extractedRole =
          result.data.user?.role ||
          result.data.role ||
          result.data.data?.role ||
          result.data.data?.user?.role;

        const tokenParts = result.data.accessToken.split(".");
        let tokenPayload: any = null;
        if (tokenParts.length >= 2) {
          const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
          tokenPayload = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
          if (!extractedRole) {
            extractedRole = tokenPayload.role || tokenPayload.user?.role || tokenPayload.roleName;
          }
        }

        const normalizedRole = typeof extractedRole === "string" ? extractedRole.toUpperCase() : "CUSTOMER";

        if (!result.data.user) {
          result.data.user = {
            id: tokenPayload?.userId || tokenPayload?.id || tokenPayload?.sub || "",
            email: tokenPayload?.email || email,
            name: tokenPayload?.name || email.split("@")[0],
            role: normalizedRole,
          };
        } else {
          result.data.user.role = normalizedRole;
        }

        result.data.role = normalizedRole;
      } catch (err) {
        console.error("[loginAction] Error normalizing user/role:", err);
      }
    }

    return result;
  } catch (error: any) {
    console.error("[loginAction] Connection failed:", error?.message || error);
    return {
      success: false,
      message:
        "Unable to connect to the backend server. Please make sure the backend is running at " +
        backendUrl,
    };
  }
};
   