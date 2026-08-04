"use server";

import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
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
  return apiClient<ApiResponse<User[]>>(`${API_ROUTES.ADMIN.GET_ALL_USERS}${query}`, {
    cache: "no-store",
  });
}

export async function getUserById(userId: string) {
  return apiClient<ApiResponse<User>>(API_ROUTES.ADMIN.GET_USER(userId), {
    cache: "no-store",
  });
}

export async function updateUserStatus(userId: string, status: "ACTIVE" | "BLOCKED") {
  return apiClient<ApiResponse<User>>(
    `${API_ROUTES.ADMIN.UPDATE_USER_STATUS}?userId=${encodeURIComponent(userId)}&status=${encodeURIComponent(status)}`,
    {
      method: "PUT",
    }
  );
}

export async function banUser(id: string) {
  return updateUserStatus(id, "BLOCKED");
}

export async function unbanUser(id: string) {
  return updateUserStatus(id, "ACTIVE");
}

export async function deleteUser(id: string) {
  return apiClient<ApiResponse<null>>(API_ROUTES.ADMIN.DELETE_USER(id), {
    method: "DELETE",
  });
}

