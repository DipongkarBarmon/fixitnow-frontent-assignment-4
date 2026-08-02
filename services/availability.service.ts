"use server";

import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Availability, SetAvailabilityInput } from "@/types";
import { API_ROUTES } from "@/constants";

export async function getAvailability(technicianId: string) {
  return apiClient<ApiResponse<Availability[]>>(API_ROUTES.AVAILABILITY.GET(technicianId), {
    cache: "no-store",
  });
}

export async function setAvailability(data: SetAvailabilityInput) {
  return apiClient<ApiResponse<Availability>>(API_ROUTES.AVAILABILITY.SET, {
    method: "POST",
    body: data as unknown as Record<string, unknown>,
  });
}

export async function removeTimeSlot(id: string) {
  return apiClient<ApiResponse<null>>(API_ROUTES.AVAILABILITY.REMOVE(id), {
    method: "DELETE",
  });
}
