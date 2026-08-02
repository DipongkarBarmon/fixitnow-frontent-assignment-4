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

  if (result.success) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data?.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("refreshToken", result.data?.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
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
