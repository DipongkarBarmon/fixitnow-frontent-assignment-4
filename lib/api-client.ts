"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_API_URL;

interface FetchOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: Record<string, unknown> | unknown;
  tags?: string[];
  revalidate?: number;
  cache?: RequestCache;
}

/**
 * Server-side API client that automatically attaches auth cookies.
 * Use this in Server Components, Server Actions, and Route Handlers.
 */
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, tags, revalidate, cache } = options;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const fetchOptions: RequestInit & { next?: { tags?: string[]; revalidate?: number } } = {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...(cache ? { cache } : {}),
  };

  if (tags || revalidate !== undefined) {
    fetchOptions.next = {
      ...(tags && { tags }),
      ...(revalidate !== undefined && { revalidate }),
    };
  }

  const res = await fetch(`${BACKEND_URL}${endpoint}`, fetchOptions);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}

/**
 * Refresh access token using the refresh token cookie.
 * Returns the new access token or null.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (data.success && data.data?.accessToken) {
      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });

      if (data.data.refreshToken) {
        cookieStore.set("refreshToken", data.data.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return data.data.accessToken;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Clear auth cookies (for logout)
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

/**
 * Get the current access token
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}
