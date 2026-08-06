import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPut, apiDelete } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import {
  getAllUsersAction,
  getUserByIdAction,
  updateUserStatusAction,
  deleteUserAction,
} from "@/app/(dashboardGroup)/admin-dashboard/_actions/userAction";
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
 * Primary: Server Action via getAllUsersAction (handles cookies and auth headers)
 * Fallback: Client-side axios
 */
export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.USERS(filters as Record<string, unknown>),
    queryFn: async () => {
      let res: any = null;

      // 1. Try Server Action first (Node.js server-to-server fetch with Authorization Bearer cookie token)
      try {
        const actionResult = await getAllUsersAction({
          page: filters.page,
          limit: filters.limit,
          role: filters.role as string,
          status: filters.status as string,
          search: filters.search,
        });
        if (actionResult.success && actionResult.data) {
          res = actionResult.data;
        }
      } catch (err) {
        console.warn("[useAdminUsers] Server action fallback to client fetch:", err);
      }

      // 2. Fallback to client-side Axios
      if (!res) {
        try {
          res = await apiGet<any>(API_ROUTES.ADMIN.GET_ALL_USERS, {
            ...filters,
            searchTerm: filters.search,
          });
        } catch (err) {
          console.warn("[useAdminUsers] Client axios fetch error:", err);
        }
      }

      // Normalize array or paginated data structure
      let rawData: any[] = [];
      if (Array.isArray(res)) {
        rawData = res;
      } else if (Array.isArray(res?.data)) {
        rawData = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        rawData = res.data.data;
      } else if (Array.isArray(res?.data?.users)) {
        rawData = res.data.users;
      } else if (Array.isArray(res?.users)) {
        rawData = res.users;
      }

      const normalizedUsers: User[] = rawData.map((u: any) => ({
        ...u,
        id: u.id || u._id || String(u._id || ""),
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Anonymous User",
        email: u.email || "",
        role: u.role || "CUSTOMER",
        status: u.status || (u.isBanned ? "BLOCKED" : "ACTIVE"),
        phoneNumber: u.phoneNumber || u.phone || "",
        phone: u.phone || u.phoneNumber || "",
        profilePhoto: u.profilePhoto || u.avatar || "",
        avatar: u.avatar || u.profilePhoto || "",
        address: u.address || "",
        isVerified: u.isVerified ?? false,
        isBanned: u.isBanned ?? (u.status === "BLOCKED"),
        createdAt: u.createdAt || new Date().toISOString(),
        updatedAt: u.updatedAt || new Date().toISOString(),
      }));

      const meta = res?.meta || res?.data?.meta || {
        page: filters.page || 1,
        limit: filters.limit || 10,
        total: normalizedUsers.length,
        totalPages: Math.ceil((normalizedUsers.length || 1) / (filters.limit || 10)),
      };

      return {
        success: true,
        message: res?.message || "Users retrieved",
        data: normalizedUsers,
        meta,
      } as PaginatedResponse<User>;
    },
  });
}

/**
 * Fetch single user details in Admin Dashboard.
 * Endpoint: router.get('api/admin/get-user', auth(Role.ADMIN), adminController.getUserById)
 */
export function useAdminUserDetail(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: async () => {
      if (!userId) return null;
      let res: any = null;

      // 1. Try Server Action first
      try {
        const actionResult = await getUserByIdAction(userId);
        if (actionResult.success && actionResult.data) {
          res = actionResult.data;
        }
      } catch (err) {
        console.warn("[useAdminUserDetail] Server action fallback to client fetch:", err);
      }

      // 2. Fallback to client-side Axios
      if (!res) {
        try {
          res = await apiGet<any>(API_ROUTES.ADMIN.GET_USER(userId));
        } catch (err) {
          console.warn("[useAdminUserDetail] Client axios fetch error:", err);
        }
      }

      const raw = res?.data?.user || res?.data || res;
      if (!raw || typeof raw !== "object") return null;

      const user: User = {
        ...raw,
        id: raw.id || raw._id || userId,
        name: raw.name || `${raw.firstName || ""} ${raw.lastName || ""}`.trim() || "Anonymous User",
        email: raw.email || "",
        role: raw.role || "CUSTOMER",
        status: raw.status || (raw.isBanned ? "BLOCKED" : "ACTIVE"),
        phoneNumber: raw.phoneNumber || raw.phone || "",
        phone: raw.phone || raw.phoneNumber || "",
        profilePhoto: raw.profilePhoto || raw.avatar || "",
        avatar: raw.avatar || raw.profilePhoto || "",
        address: raw.address || "",
        isVerified: raw.isVerified ?? false,
        isBanned: raw.isBanned ?? (raw.status === "BLOCKED"),
        createdAt: raw.createdAt || new Date().toISOString(),
        updatedAt: raw.updatedAt || new Date().toISOString(),
      };

      return {
        success: true,
        data: user,
      };
    },
    enabled: !!userId,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update user status (ACTIVE or BLOCKED).
 * Endpoint: router.put('api/admin/update-user-status', auth(Role.ADMIN), adminController.updateUserStatus)
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: "ACTIVE" | "BLOCKED" }) => {
      const res = await updateUserStatusAction(userId, status);
      if (!res.success) throw new Error(res.message);
      return res as ApiResponse<User>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
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
    mutationFn: async (userId: string) => {
      const res = await updateUserStatusAction(userId, "BLOCKED");
      if (!res.success) throw new Error(res.message);
      return res as ApiResponse<User>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
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
    mutationFn: async (userId: string) => {
      const res = await updateUserStatusAction(userId, "ACTIVE");
      if (!res.success) throw new Error(res.message);
      return res as ApiResponse<User>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATS });
    },
  });
}

/**
 * Delete a user permanently from the platform.
 * Endpoint: router.delete('api/admin/delete-user', auth(Role.ADMIN), adminController.deleteUserById)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await deleteUserAction(userId);
      if (!res.success) throw new Error(res.message);
      return res as ApiResponse<null>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATS });
    },
  });
}

