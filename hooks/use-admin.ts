import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut, apiDelete } from "@/lib/axios-client";
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
 * Fetch a list of all users on the platform.
 */
export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.USERS(filters as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<User>>(API_ROUTES.ADMIN.GET_ALL_USERS, {
        ...filters,
        searchTerm: filters.search,
      }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update user status (ACTIVE or BLOCKED).
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "ACTIVE" | "BLOCKED" }) =>
      apiPut<ApiResponse<User>>(
        `${API_ROUTES.ADMIN.UPDATE_USER_STATUS}?userId=${encodeURIComponent(userId)}&status=${encodeURIComponent(status)}`
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATS });
    },
  });
}

/**
 * Ban a user from the platform.
 */
export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiPut<ApiResponse<User>>(
        `${API_ROUTES.ADMIN.UPDATE_USER_STATUS}?userId=${encodeURIComponent(userId)}&status=BLOCKED`
      ),
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
      apiPut<ApiResponse<User>>(
        `${API_ROUTES.ADMIN.UPDATE_USER_STATUS}?userId=${encodeURIComponent(userId)}&status=ACTIVE`
      ),
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
      apiDelete<ApiResponse<null>>(API_ROUTES.ADMIN.DELETE_USER(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATS });
    },
  });
}

