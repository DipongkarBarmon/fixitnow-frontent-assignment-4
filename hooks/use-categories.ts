import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/axios-client";
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

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
  icon?: string;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      apiPost<ApiResponse<Category>>(API_ROUTES.CATEGORIES.LIST, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateCategoryInput>) =>
      apiPatch<ApiResponse<Category>>(API_ROUTES.CATEGORIES.DETAIL(id), data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.DETAIL(id) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiDelete<ApiResponse<null>>(API_ROUTES.CATEGORIES.DETAIL(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
}

