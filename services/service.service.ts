"use server";

import { apiClient } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, Service, ServiceFilters } from "@/types";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils/format";

export async function getServices(filters?: ServiceFilters) {
  const query = filters ? buildQueryString(filters as Record<string, string | number | undefined>) : "";
  return apiClient<PaginatedResponse<Service>>(`${API_ROUTES.SERVICES.LIST}${query}`, {
    revalidate: 300,
    tags: ["services"],
  });
}

export async function getServiceById(id: string) {
  return apiClient<ApiResponse<Service>>(API_ROUTES.SERVICES.DETAIL(id), {
    revalidate: 300,
    tags: ["services", id],
  });
}

export async function getFeaturedServices() {
  return apiClient<ApiResponse<Service[]>>(API_ROUTES.SERVICES.FEATURED, {
    revalidate: 600,
    tags: ["services", "featured"],
  });
}

export async function createService(data: Partial<Service>) {
  return apiClient<ApiResponse<Service>>(API_ROUTES.SERVICES.LIST, {
    method: "POST",
    body: data as Record<string, unknown>,
  });
}

export async function updateService(id: string, data: Partial<Service>) {
  return apiClient<ApiResponse<Service>>(API_ROUTES.SERVICES.DETAIL(id), {
    method: "PATCH",
    body: data as Record<string, unknown>,
  });
}

export async function deleteService(id: string) {
  return apiClient<ApiResponse<null>>(API_ROUTES.SERVICES.DETAIL(id), {
    method: "DELETE",
  });
}
