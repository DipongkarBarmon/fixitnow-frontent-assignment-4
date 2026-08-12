"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { CreateTechnicianServiceInput } from "@/hooks/use-services";
import type { Service } from "@/types";

export interface ServiceActionResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

async function fetchBackendServiceAction<T = any>(
  path: string,
  options: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
  }
): Promise<ServiceActionResult<T>> {
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
    console.warn(`[fetchBackendServiceAction] Fetch error on ${targetUrl}:`, err?.message);
    return {
      success: false,
      message: err?.message || "Network error connecting to backend",
    };
  }
}

export async function createServiceAction(
  data: CreateTechnicianServiceInput
): Promise<ServiceActionResult> {
  const result = await fetchBackendServiceAction("/api/technician/create-service", {
    method: "POST",
    body: data,
  });

  if (result.success) {
    revalidatePath("/technician-dashboard/services");
  }
  return result;
}

export async function updateServiceAction(
  serviceId: string,
  data: Partial<CreateTechnicianServiceInput>
): Promise<ServiceActionResult> {
  const result = await fetchBackendServiceAction(`/api/technician/update-service/${serviceId}`, {
    method: "PUT",
    body: data,
  });

  if (result.success) {
    revalidatePath("/technician-dashboard/services");
  }
  return result;
}

export async function deleteServiceAction(
  serviceId: string
): Promise<ServiceActionResult> {
  const result = await fetchBackendServiceAction(`/api/technician/delete-service/${serviceId}`, {
    method: "DELETE",
  });

  if (result.success) {
    revalidatePath("/technician-dashboard/services");
  }
  return result;
}

export async function getTechnicianServicesAction(): Promise<ServiceActionResult<Service[]>> {
  // Try the technician-specific endpoints first, fallback to the generic one
  const candidatePaths = [
    "/api/service/get-all-service",
    "/api/services/get-all-service",
    "/get-all-service",
    "/api/technician/get-all-service",
    "/api/services",
  ];

  for (const path of candidatePaths) {
    const result = await fetchBackendServiceAction<Service[]>(path, {
      method: "GET",
    });
    console.log(`[getTechnicianServicesAction] Path: ${path}, Result:`, result);

    if (result.success) {
      // If the backend returns a nested paginated response like result.data.data
      if (result.data && !Array.isArray(result.data) && Array.isArray((result.data as any).data)) {
         result.data = (result.data as any).data;
      }
      return result;
    }
  }

  return { success: false, message: "Failed to fetch technician services", data: [] };
}
