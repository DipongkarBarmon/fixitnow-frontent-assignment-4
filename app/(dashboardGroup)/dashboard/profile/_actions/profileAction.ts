"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface ProfileActionResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

const PROFILE_API = {
  me: "/api/auth/me",
  update: "/api/auth/update-profile",
  delete: "/api/auth/delete-profile",
} as const;

async function fetchBackendProfileAction<T = any>(
  path: string,
  options: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
  }
): Promise<ProfileActionResult<T>> {
  const backendUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://localhost:5000";

  let accessToken: string | undefined;
  try {
    const cookieStore = await cookies();
    accessToken = cookieStore.get("accessToken")?.value;
  } catch {
    // SSR or client context fallback
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const targetUrl = `${backendUrl.replace(/\/$/, "")}${path}`;

  try {
    const res = await fetch(targetUrl, {
      method: options.method,
      headers,
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      cache: "no-store",
    });

    let result: any;
    try {
      result = await res.json();
    } catch {
      return {
        success: false,
        message: `Backend returned non-JSON response (${res.status} ${res.statusText})`,
      };
    }

    if (!res.ok || result.success === false) {
      return {
        success: false,
        message: result.message || result.error || `Request failed with status ${res.status}`,
        data: result.data || result,
      };
    }

    return {
      success: true,
      message: result.message || "Operation completed successfully",
      data: result.data ?? result,
    };
  } catch (err: any) {
    console.warn(`[fetchBackendProfileAction] Fetch error on ${targetUrl}:`, err?.message);
    return {
      success: false,
      message: err?.message || "Network error connecting to backend",
    };
  }
}

export async function getUserProfileAction(): Promise<ProfileActionResult> {
  return fetchBackendProfileAction(PROFILE_API.me, { method: "GET" });
}

export async function updateUserProfileAction(
  data: Record<string, any>
): Promise<ProfileActionResult> {
  const result = await fetchBackendProfileAction(PROFILE_API.update, {
    method: "PUT",
    body: data,
  });

  if (result.success) {
    revalidatePath("/dashboard/profile");
    revalidatePath("/technician-dashboard/profile");
    revalidatePath("/admin-dashboard/settings");
  }

  return result;
}

export async function deleteUserProfileAction(): Promise<ProfileActionResult> {
  return fetchBackendProfileAction(PROFILE_API.delete, { method: "DELETE" });
}
