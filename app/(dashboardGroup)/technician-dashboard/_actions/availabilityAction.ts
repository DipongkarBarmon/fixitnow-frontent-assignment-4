"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface CreateAvailabilityPayload {
  date: string; // ISO string
  startTime: string; // ISO string
  endTime: string; // ISO string
}

export interface Availability {
  id: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityActionResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

async function fetchBackendAvailabilityAction<T = any>(
  candidatePaths: string[],
  options: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    params?: Record<string, string | number | boolean | undefined>;
  }
): Promise<AvailabilityActionResult<T>> {
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

  let lastErrorMsg = "Unable to complete availability operation";

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
      console.log(`[availabilityAction] Fetching ${options.method} ${targetUrl}`);
      const res = await fetch(targetUrl, {
        method: options.method,
        headers,
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
        cache: "no-store",
      });

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
      console.warn(`[availabilityAction] Fetch error on ${targetUrl}:`, lastErrorMsg);
    }
  }

  return {
    success: false,
    message: lastErrorMsg,
  };
}

export async function createAvailabilityAction(
  data: CreateAvailabilityPayload
): Promise<AvailabilityActionResult<Availability>> {
  const candidatePaths = [
    "/api/availability/create-availability",
    "/api/availabilities/create-availability",
    "/availability/create-availability",
  ];

  const result = await fetchBackendAvailabilityAction<Availability>(candidatePaths, {
    method: "POST",
    body: data,
  });

  if (result.success) {
    try {
      revalidatePath("/technician-dashboard/availability");
    } catch (err) {
      console.warn("[createAvailabilityAction] revalidatePath warning:", err);
    }
  }

  return result;
}

export async function getAllAvailabilityAction(): Promise<AvailabilityActionResult<Availability[]>> {
  const candidatePaths = [
    "/api/availability/get-all-availability",
    "/api/availabilities/get-all-availability",
    "/availability/get-all-availability",
  ];

  return await fetchBackendAvailabilityAction<Availability[]>(candidatePaths, {
    method: "GET",
  });
}

export async function deleteAvailabilityByIdAction(
  availabilityId: string
): Promise<AvailabilityActionResult> {
  const encodedId = encodeURIComponent(availabilityId);
  const candidatePaths = [
    `/api/availability/delete-availability/${encodedId}`,
    `/api/availabilities/delete-availability/${encodedId}`,
    `/availability/delete-availability/${encodedId}`,
  ];

  const result = await fetchBackendAvailabilityAction(candidatePaths, {
    method: "DELETE",
  });

  if (result.success) {
    try {
      revalidatePath("/technician-dashboard/availability");
    } catch (err) {
      console.warn("[deleteAvailabilityByIdAction] revalidatePath warning:", err);
    }
  }

  return result;
}
