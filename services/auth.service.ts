"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_API_URL;

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "TECHNICIAN";
  phone?: string;
}

export async function loginAction(formData: LoginInput) {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: formData.email, password: formData.password }),
  });

  const result = await res.json();

  if (result.success && result.data?.accessToken) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    if (result.data?.refreshToken) {
      cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

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
          email: tokenPayload?.email || formData.email,
          name: tokenPayload?.name || formData.email.split("@")[0],
          role: normalizedRole,
        };
      } else {
        result.data.user.role = normalizedRole;
      }

      result.data.role = normalizedRole;
    } catch (err) {
      console.error("[auth.service.loginAction] Error normalizing role:", err);
    }
  }

  return result;
}

export async function registerAction(formData: RegisterInput) {
  const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await res.json();

  if (result.success && result.data?.accessToken) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return result;
}

export async function forgotPasswordAction(email: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return res.json();
}

export async function resetPasswordAction(token: string, password: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });

  return res.json();
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return { success: true, message: "Logged out successfully" };
}
