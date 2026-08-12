"use server";

import type { Service } from "@/types";

export interface PublicServiceActionResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

const getBackendUrl = () =>
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "http://localhost:5000";

export async function getAllServiceAction(): Promise<PublicServiceActionResult<Service[]>> {
  const backendUrl = getBackendUrl();
  const candidatePaths = [
    "/api/service/get-all-service",
    "/api/services/get-all-service",
    "/get-all-service",
    "/api/services",
  ];

  let lastErrorMsg = "Failed to fetch services";

  for (const path of candidatePaths) {
    const targetUrl = `${backendUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    try {
      const res = await fetch(targetUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.status === 404) continue;

      let result: any;
      try {
        result = await res.json();
      } catch {
        continue;
      }

      if (res.ok && (result.success === true || Array.isArray(result.data) || Array.isArray(result))) {
        return {
          success: true,
          message: result.message || "Services fetched successfully",
          data: result.data ?? result,
        };
      }
    } catch (err: any) {
      lastErrorMsg = err?.message || `Network error connecting to ${targetUrl}`;
    }
  }

  return {
    success: false,
    message: lastErrorMsg,
  };
}

export async function getServiceByIdAction(
  serviceId: string
): Promise<PublicServiceActionResult<Service>> {
  const backendUrl = getBackendUrl();
  const candidatePaths = [
    `/api/service/get-service/${serviceId}`,
    `/api/services/get-service/${serviceId}`,
    `/get-service/${serviceId}`,
    `/api/services/${serviceId}`,
  ];

  let lastErrorMsg = "Failed to fetch service details";

  for (const path of candidatePaths) {
    const targetUrl = `${backendUrl.replace(/\/$/, "")}${path}`;
    try {
      const res = await fetch(targetUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.status === 404) continue;

      let result: any;
      try {
        result = await res.json();
      } catch {
        continue;
      }

      if (res.ok && (result.success === true || result.data || result.id)) {
        return {
          success: true,
          message: result.message || "Service fetched successfully",
          data: result.data ?? result,
        };
      }
    } catch (err: any) {
      lastErrorMsg = err?.message || `Network error connecting to ${targetUrl}`;
    }
  }

  return {
    success: false,
    message: lastErrorMsg,
  };
}
