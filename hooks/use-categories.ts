import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type { Category, ApiResponse } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all service categories.
 */
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.ALL,
    queryFn: () => apiGet<ApiResponse<Category[]>>(API_ROUTES.CATEGORIES.LIST),
    staleTime: 10 * 60 * 1000, // 10 minutes — categories rarely change
  });
}

/**
 * Fetch a single category by ID.
 */
export function useCategoryDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.DETAIL(id),
    queryFn: () =>
      apiGet<ApiResponse<Category>>(API_ROUTES.CATEGORIES.DETAIL(id)),
    enabled: !!id,
  });
}
