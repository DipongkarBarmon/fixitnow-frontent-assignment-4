"use server";

import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  UserFilters,
  DashboardStats,
} from "@/types";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils/format";

export async function getDashboardStats() {
  return apiClient<ApiResponse<DashboardStats>>(API_ROUTES.ADMIN.STATS, {
    cache: "no-store",
  });
}

export async function getUsers(filters?: UserFilters) {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : "";
  return apiClient<PaginatedResponse<User>>(`${API_ROUTES.USERS.LIST}${query}`, {
    cache: "no-store",
  });
}

export async function banUser(id: string) {
  return apiClient<ApiResponse<User>>(API_ROUTES.USERS.BAN(id), {
    method: "PATCH",
  });
}

export async function unbanUser(id: string) {
  return apiClient<ApiResponse<User>>(API_ROUTES.USERS.UNBAN(id), {
    method: "PATCH",
  });
}

export async function deleteUser(id: string) {
  return apiClient<ApiResponse<null>>(API_ROUTES.USERS.DELETE(id), {
    method: "DELETE",
  });
}
