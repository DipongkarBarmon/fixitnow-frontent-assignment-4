"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { TechnicianProfile } from "@/types";

export interface CreateTechnicianProfilePayload {
  address: string;
  bio?: string;
  skills: string[];
  experience?: number;
  hourlyRate?: number;
  certifications?: string[];
  location?: string;
}

export interface UpdateTechnicianProfilePayload {
  address?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  certifications?: string[];
  location?: string;
}

export interface TechnicianActionResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Robust fetch helper for Technician Server Actions with cookie-based authorization
 * and intelligent candidate route failover.
 */
async function fetchBackendTechnicianAction<T = any>(
  candidatePaths: string[],
  options: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    params?: Record<string, string | number | boolean | undefined>;
  }
): Promise<TechnicianActionResult<T>> {
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

  let lastErrorMsg = "Unable to complete technician profile operation";

  for (const path of candidatePaths) {
    let targetUrl = `${backendUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

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
      console.log(`[technicianAction] Fetching ${options.method} ${targetUrl}`);
      const res = await fetch(targetUrl, {
        method: options.method,
        headers,
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
        cache: "no-store",
      });

      // If route not mounted here (404), try next candidate
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

  console.log(
    `[technicianAction] Response from ${targetUrl} (Status ${res.status}):`,
    result?.success ?? true,
    result?.message || "",
    result?.error || ""
  );

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
  lastErrorMsg = err?.message || `Network error connecting to ${targetUrl}`;
  console.warn(`[technicianAction] Fetch error on ${targetUrl}:`, lastErrorMsg);
}
}

return {
  success: false,
  message: lastErrorMsg,
};
}

/**
 * Server action to create a technician profile.
 * Endpoint: router.post('api/technician/create-technician-profile', auth(Role.TECHNICIAN), technicianController.createTechnicianProfile)
 */
export async function createTechnicianProfileAction(
  data: CreateTechnicianProfilePayload
): Promise<TechnicianActionResult<TechnicianProfile>> {
  if (!data.address || !data.address.trim()) {
    return { success: false, message: "Address is required for your technician profile" };
  }

  if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
    return { success: false, message: "At least one skill or specialty is required" };
  }

  // Exact Prisma schema fields for TechnicianProfile model
  const payload: Record<string, any> = {
    address: data.address.trim(),
    skills: data.skills.map((s) => s.trim()).filter(Boolean),
  };

  if (data.bio && data.bio.trim()) {
    payload.bio = data.bio.trim();
  }

  const candidatePaths = [
    "/api/technician/create-technician-profile",
    "/api/technicians/create-technician-profile",
    "/technician/create-technician-profile",
    "/api/technician/profile",
    "/api/technicians/profile",
  ];

  const result = await fetchBackendTechnicianAction<TechnicianProfile>(candidatePaths, {
    method: "POST",
    body: payload,
  });

  if (result.success) {
    try {
      revalidatePath("/technician-dashboard/profile");
      revalidatePath("/technician-dashboard");
      revalidatePath("/technicians");
    } catch (err) {
      console.warn("[createTechnicianProfileAction] revalidatePath warning:", err);
    }
  }

  return result;
}

/**
 * Server action to get logged-in technician's own profile.
 * Endpoint: router.get('api/technician/get-own-technician-profile', auth(Role.TECHNICIAN), technicianController.getOwnTechnicianProfile)
 */
export async function getOwnTechnicianProfileAction(): Promise<TechnicianActionResult<TechnicianProfile>> {
  const candidatePaths = [
    "/api/technician/get-own-technician-profile",
    "/api/technicians/get-own-technician-profile",
    "/api/technician/me",
    "/api/technicians/me",
    "/api/technician/profile",
    "/technician/get-own-technician-profile",
    "/technician/me",
  ];

  return await fetchBackendTechnicianAction<TechnicianProfile>(candidatePaths, {
    method: "GET",
  });
}

// Alias for getOwnTechnicianProfileAction
export const getMyTechnicianProfileAction = getOwnTechnicianProfileAction;

/**
 * Server action to get single technician profile by ID.
 * Endpoint: router.get('api/technician/get-technician-profile/:technicianId', technicianController.getTechnicianProfile)
 */
export async function getTechnicianProfileByIdAction(
  technicianId: string
): Promise<TechnicianActionResult<TechnicianProfile>> {
  if (!technicianId) {
    return { success: false, message: "Technician ID is required" };
  }

  const encodedId = encodeURIComponent(technicianId);
  const candidatePaths = [
    `/api/technician/get-technician-profile/${encodedId}`,
    `/api/technicians/get-technician-profile/${encodedId}`,
    `/api/technician/${encodedId}`,
    `/api/technicians/${encodedId}`,
    `/get-technician-profile/${encodedId}`,
  ];

  return await fetchBackendTechnicianAction<TechnicianProfile>(candidatePaths, {
    method: "GET",
  });
}

/**
 * Server action to get all technician profiles.
 * Endpoint: router.get('api/technician/get-all-technician-profile', technicianController.getAllTechnicianProfile)
 */
export async function getAllTechnicianProfilesAction(): Promise<TechnicianActionResult<TechnicianProfile[]>> {
  const candidatePaths = [
    "/api/technician/get-all-technician-profile",
    "/api/technicians/get-all-technician-profile",
    "/api/technicians",
    "/api/technician/all",
    "/get-all-technician-profile",
  ];

  return await fetchBackendTechnicianAction<TechnicianProfile[]>(candidatePaths, {
    method: "GET",
  });
}

/**
 * Server action to update a technician profile.
 * Endpoint: router.put('api/technician/update-technician-profile/:technicianId', auth(Role.TECHNICIAN), technicianController.updateTechnicianProfile)
 */
export async function updateTechnicianProfileAction(
  technicianId: string,
  data: UpdateTechnicianProfilePayload,
  fallbackId?: string
): Promise<TechnicianActionResult<TechnicianProfile>> {
  if (!technicianId && !fallbackId) {
    return { success: false, message: "Technician ID is required for updating profile" };
  }

  // Strict Prisma schema fields for TechnicianProfile model: address, skills, bio
  const payload: Record<string, any> = {};
  if (data.address !== undefined && data.address !== null) {
    payload.address = data.address.trim();
  }
  if (data.bio !== undefined && data.bio !== null) {
    payload.bio = data.bio.trim();
  }
  if (Array.isArray(data.skills)) {
    payload.skills = data.skills.map((s) => s.trim()).filter(Boolean);
  }

  const idsToTry = Array.from(new Set([technicianId, fallbackId].filter(Boolean) as string[]));
  const candidatePaths: string[] = [];

  idsToTry.forEach((id) => {
    const encodedId = encodeURIComponent(id);
    candidatePaths.push(
      `/api/technician/update-technician-profile/${encodedId}`,
      `/api/technicians/update-technician-profile/${encodedId}`,
      `/api/technician/${encodedId}`,
      `/api/technicians/${encodedId}`,
      `/update-technician-profile/${encodedId}`
    );
  });

  candidatePaths.push(
    `/api/technician/update-technician-profile`,
    `/api/technicians/update-technician-profile`,
    `/api/technician/profile`,
    `/api/technicians/profile`
  );

  let result = await fetchBackendTechnicianAction<TechnicianProfile>(candidatePaths, {
    method: "PUT",
    body: payload,
  });

  // If PUT fails, fallback to PATCH
  if (!result.success) {
    console.warn("[updateTechnicianProfileAction] PUT failed, attempting PATCH fallback...");
    result = await fetchBackendTechnicianAction<TechnicianProfile>(candidatePaths, {
      method: "PATCH",
      body: payload,
    });
  }

  if (result.success) {
    try {
      revalidatePath("/technician-dashboard/profile");
      revalidatePath("/technician-dashboard");
      revalidatePath("/technicians");
      idsToTry.forEach((id) => revalidatePath(`/technicians/${encodeURIComponent(id)}`));
    } catch (err) {
      console.warn("[updateTechnicianProfileAction] revalidatePath warning:", err);
    }
  }

  return result;
}

/**
 * Server action to delete a technician profile.
 * Endpoint: router.delete('api/technician/delete-technician-profile/:technicianId', auth(Role.TECHNICIAN), technicianController.deleteTechnicianProfile)
 */
export async function deleteTechnicianProfileAction(
  technicianId: string,
  fallbackId?: string
): Promise<TechnicianActionResult> {
  if (!technicianId && !fallbackId) {
    return { success: false, message: "Technician ID is required for deletion" };
  }

  const idsToTry = Array.from(new Set([technicianId, fallbackId].filter(Boolean) as string[]));
  const candidatePaths: string[] = [];

  idsToTry.forEach((id) => {
    const encodedId = encodeURIComponent(id);
    candidatePaths.push(
      `/api/technician/delete-technician-profile/${encodedId}`,
      `/api/technicians/delete-technician-profile/${encodedId}`,
      `/api/technician/${encodedId}`,
      `/api/technicians/${encodedId}`,
      `/delete-technician-profile/${encodedId}`
    );
  });

  candidatePaths.push(
    `/api/technician/delete-technician-profile`,
    `/api/technicians/delete-technician-profile`
  );

  const result = await fetchBackendTechnicianAction(candidatePaths, {
    method: "DELETE",
  });

  if (result.success) {
    try {
      revalidatePath("/technician-dashboard/profile");
      revalidatePath("/technician-dashboard");
      revalidatePath("/technicians");
      idsToTry.forEach((id) => revalidatePath(`/technicians/${encodeURIComponent(id)}`));
    } catch (err) {
      console.warn("[deleteTechnicianProfileAction] revalidatePath warning:", err);
    }
  }

  return result;
}

export default createTechnicianProfileAction;
