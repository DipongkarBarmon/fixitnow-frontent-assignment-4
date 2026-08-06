"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface UserActionResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

/**
 * Robust fetch helper that extracts the auth accessToken from cookies and
 * tests candidate routes until a successful non-404 response is returned.
 */
async function fetchBackendUserAction(
  candidatePaths: string[],
  options: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    params?: Record<string, string | number | boolean | undefined>;
  }
): Promise<UserActionResult> {
  const backendUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://localhost:5000";

  let accessToken: string | undefined;
  try {
    const cookieStore = await cookies();
    accessToken = cookieStore.get("accessToken")?.value;
  } catch {
    // Client-side or SSR context where cookies are unavailable
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let lastErrorMsg = "Unable to complete user administrative operation";

  for (const path of candidatePaths) {
    let targetUrl = `${backendUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

    // Append query params if present
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          searchParams.append(k, String(v));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        targetUrl += (targetUrl.includes("?") ? "&" : "?") + queryString;
      }
    }

    try {
      console.log(`[userAction] Fetching ${options.method} ${targetUrl}`);
      const res = await fetch(targetUrl, {
        method: options.method,
        headers,
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
        cache: "no-store",
      });

      // If route not mounted at this candidate path, continue to next candidate
      if (res.status === 404) {
        lastErrorMsg = `Route not found at ${path} (404)`;
        continue;
      }

      let result: any;
      try {
        result = await res.json();
      } catch {
        return {
          success: false,
          message: `Backend returned non-JSON response (${res.status} ${res.statusText})`,
        };
      }

      console.log(`[userAction] Response from ${targetUrl} (Status ${res.status}):`, result?.success ?? true);

      if (!res.ok || result.success === false) {
        return {
          success: false,
          message: result.message || `Request failed with status ${res.status}`,
          data: result.data || result,
        };
      }

      return {
        success: true,
        message: result.message || "Operation completed successfully",
        data: result.data || result,
      };
    } catch (err: any) {
      lastErrorMsg = err?.message || `Network error connecting to ${targetUrl}`;
      console.warn(`[userAction] Fetch error on ${targetUrl}:`, lastErrorMsg);
    }
  }

  return {
    success: false,
    message: lastErrorMsg,
  };
}

/**
 * Server action to get all users in Admin Dashboard
 * Endpoint: router.get('api/admin/get-all-users', auth(Role.ADMIN), adminController.getAllUsers)
 */
export async function getAllUsersAction(
  params: GetAllUsersParams = {}
): Promise<UserActionResult> {
  const queryParams: Record<string, string | number | undefined> = {};
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.role && params.role !== "ALL") queryParams.role = params.role;
  if (params.status && params.status !== "ALL") queryParams.status = params.status;
  if (params.search) {
    queryParams.search = params.search;
    queryParams.searchTerm = params.search;
  }

  const candidatePaths = [
    "/api/admin/get-all-users",
    "/admin/get-all-users",
    "/api/get-all-users",
    "/get-all-users",
    "/api/admin/users",
    "/api/users",
    "/admin/users",
  ];

  return await fetchBackendUserAction(candidatePaths, {
    method: "GET",
    params: queryParams,
  });
}

/**
 * Server action to get single user by ID in Admin Dashboard
 * Endpoint: router.get('api/admin/get-user', auth(Role.ADMIN), adminController.getUserById)
 */
export async function getUserByIdAction(
  userId: string
): Promise<UserActionResult> {
  if (!userId) {
    return { success: false, message: "User ID is required" };
  }

  const candidatePaths = [
    `/api/admin/get-user?userId=${encodeURIComponent(userId)}`,
    `/api/admin/get-user/${encodeURIComponent(userId)}`,
    `/api/admin/users/${encodeURIComponent(userId)}`,
    `/api/users/${encodeURIComponent(userId)}`,
    `/get-user/${encodeURIComponent(userId)}`,
    `/get-user?userId=${encodeURIComponent(userId)}`,
  ];

  return await fetchBackendUserAction(candidatePaths, {
    method: "GET",
  });
}

/**
 * Server action to update user status (ACTIVE / BLOCKED) in Admin Dashboard
 * Endpoint: router.put('api/admin/update-user-status', auth(Role.ADMIN), adminController.updateUserStatus)
 */
export async function updateUserStatusAction(
  userId: string,
  status: "ACTIVE" | "BLOCKED"
): Promise<UserActionResult> {
  if (!userId) {
    return { success: false, message: "User ID is required" };
  }
  if (!status) {
    return { success: false, message: "Status is required" };
  }

  const payload = { userId, status };

  const candidatePaths = [
    `/api/admin/update-user-status?userId=${encodeURIComponent(userId)}&status=${encodeURIComponent(status)}`,
    `/api/admin/update-user-status`,
    `/api/admin/update-user-status/${encodeURIComponent(userId)}`,
    `/api/admin/users/${encodeURIComponent(userId)}/status`,
    `/update-user-status`,
  ];

  const result = await fetchBackendUserAction(candidatePaths, {
    method: "PUT",
    body: payload,
  });

  if (result.success) {
    try {
      revalidatePath("/admin-dashboard/users");
      revalidatePath("/admin-dashboard");
    } catch (err) {
      console.warn("[updateUserStatusAction] revalidatePath warning:", err);
    }
  }

  return result;
}

/**
 * Server action to permanently delete a user in Admin Dashboard
 * Endpoint: router.delete('api/admin/delete-user', auth(Role.ADMIN), adminController.deleteUserById)
 */
export async function deleteUserAction(
  userId: string
): Promise<UserActionResult> {
  if (!userId) {
    return { success: false, message: "User ID is required" };
  }

  const encodedId = encodeURIComponent(userId);
  const candidatePaths = [
    `/api/admin/delete-user?userId=${encodedId}`,
    `/api/admin/delete-user?id=${encodedId}`,
    `/admin/delete-user?userId=${encodedId}`,
    `/admin/delete-user?id=${encodedId}`,
    `/api/admin/delete-user/${encodedId}`,
    `/admin/delete-user/${encodedId}`,
    `/delete-user?userId=${encodedId}`,
    `/delete-user/${encodedId}`,
    `/api/admin/users/${encodedId}`,
    `/api/users/${encodedId}`,
  ];

  const result = await fetchBackendUserAction(candidatePaths, {
    method: "DELETE",
    body: { userId, id: userId },
  });

  if (result.success) {
    try {
      revalidatePath("/admin-dashboard/users");
      revalidatePath("/admin-dashboard");
    } catch (err) {
      console.warn("[deleteUserAction] revalidatePath warning:", err);
    }
  }

  return result;
}
