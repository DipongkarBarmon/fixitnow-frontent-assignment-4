"use server";

import { apiClient } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, TechnicianProfile, TechnicianFilters } from "@/types";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils/format";

export async function getTechnicians(filters?: TechnicianFilters) {
  const query = filters ? buildQueryString(filters as Record<string, string | number | undefined>) : "";
  return apiClient<PaginatedResponse<TechnicianProfile>>(`${API_ROUTES.TECHNICIANS.LIST}${query}`, {
    revalidate: 300,
    tags: ["technicians"],
  });
}

export async function getTechnicianById(id: string) {
  return apiClient<ApiResponse<TechnicianProfile>>(API_ROUTES.TECHNICIANS.DETAIL(id), {
    revalidate: 300,
    tags: ["technicians", id],
  });
}

export async function getTopRatedTechnicians() {
  return apiClient<ApiResponse<TechnicianProfile[]>>(API_ROUTES.TECHNICIANS.TOP_RATED, {
    revalidate: 600,
    tags: ["technicians", "top-rated"],
  });
}

export async function updateTechnicianProfile(data: Partial<TechnicianProfile>) {
  return apiClient<ApiResponse<TechnicianProfile>>(API_ROUTES.TECHNICIANS.PROFILE, {
    method: "PATCH",
    body: data as Record<string, unknown>,
  });
}
