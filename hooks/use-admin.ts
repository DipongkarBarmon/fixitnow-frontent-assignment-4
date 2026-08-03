import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch, apiDelete } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  UserFilters,
  DashboardStats,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch platform-wide dashboard statistics for the admin.
 */
export function useAdminStats() {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.STATS,
    queryFn: () =>
      apiGet<ApiResponse<DashboardStats>>(API_ROUTES.ADMIN.STATS),
  });
}

/**
 * Fetch a paginated/filtered list of all users on the platform.
 */
export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.USERS(filters as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<User>>(API_ROUTES.USERS.LIST, {
        ...filters,
        page: filters.page,
        limit: filters.limit,
      }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ban a user from the platform.
 */
export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiPatch<ApiResponse<User>>(API_ROUTES.USERS.BAN(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATS });
    },
  });
}

/**
 * Unban a user on the platform.
 */
export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiPatch<ApiResponse<User>>(API_ROUTES.USERS.UNBAN(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATS });
    },
  });
}

/**
 * Delete a user from the platform.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiDelete<ApiResponse<null>>(API_ROUTES.USERS.DELETE(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATS });
    },
  });
}
