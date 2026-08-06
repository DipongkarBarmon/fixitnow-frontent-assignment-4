import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type { Category, ApiResponse } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all service categories from router.get('/get-all-category', categoryController.getAllCategory)
 */
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.ALL,
    queryFn: async () => {
      const res = await apiGet<any>(API_ROUTES.CATEGORIES.LIST);
      let list: Category[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.data?.categories)) {
        list = res.data.categories;
      } else if (Array.isArray(res?.categories)) {
        list = res.categories;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      }

      const normalizedList = list.map((cat: any) => ({
        ...cat,
        id: cat.id || cat._id || "",
        slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "",
      }));

      return {
        success: res?.success ?? true,
        message: res?.message ?? "",
        data: normalizedList,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single category by ID from router.get('/get-category/:categoryId', categoryController.getCategoryById)
 */
export function useCategoryDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.DETAIL(id),
    queryFn: async () => {
      if (!id) return { success: false, message: "No ID provided", data: null };
      const res = await apiGet<any>(API_ROUTES.CATEGORIES.DETAIL(id));
      const rawCat = res?.data?.category || res?.data || res;
      if (!rawCat || typeof rawCat !== "object") {
        return { success: false, message: res?.message || "Category not found", data: null };
      }
      const normalizedCat: Category = {
        ...rawCat,
        id: rawCat.id || rawCat._id || id,
        slug: rawCat.slug || rawCat.name?.toLowerCase().replace(/\s+/g, "-") || "",
      };
      return {
        success: res?.success ?? true,
        message: res?.message ?? "",
        data: normalizedCat,
      };
    },
    enabled: !!id,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

export interface CategoryMutationInput {
  name: string;
  icon?: string;
  description?: string;
  image?: string;
  slug?: string;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryMutationInput) =>
      apiPost<ApiResponse<Category>>(API_ROUTES.ADMIN.CREATE_CATEGORY, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryMutationInput> }) =>
      apiPut<ApiResponse<Category>>(API_ROUTES.ADMIN.UPDATE_CATEGORY(id), data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.DETAIL(variables.id) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiDelete<ApiResponse<null>>(API_ROUTES.ADMIN.DELETE_CATEGORY(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
}



