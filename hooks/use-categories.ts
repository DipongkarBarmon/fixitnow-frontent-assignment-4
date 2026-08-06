import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import {
  getAllCategoriesAction,
  getCategoryByIdAction,
} from "@/app/(dashboardGroup)/admin-dashboard/_actions/categoryAction";
import type { Category, ApiResponse } from "@/types";

// Helper to clean URL strings that may have extra wrapping quotes
function cleanIconUrl(val?: string): string {
  if (!val) return "";
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s.trim();
}

// Helper to attempt multiple candidate endpoints for client-side API calls
async function fetchWithCandidateRoutes<T>(candidateEndpoints: string[]): Promise<T> {
  let lastError: any = null;

  for (const endpoint of candidateEndpoints) {
    try {
      const data = await apiGet<T>(endpoint);
      return data;
    } catch (err: any) {
      lastError = err;
      const status = err?.response?.status;
      // If 404 Route Not Found, try the next candidate endpoint
      if (status === 404) {
        continue;
      }
      // If other error (e.g. 500, 401, 403), throw immediately
      throw err;
    }
  }

  throw lastError || new Error("Failed to fetch from candidate routes");
}

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all service categories from router.get('/get-all-category', categoryController.getAllCategory)
 * Primary: Server Action via getAllCategoriesAction()
 * Fallback: Client axios candidate routes
 */
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.ALL,
    queryFn: async () => {
      let res: any = null;

      // 1. Try Server Action first (Node.js server-to-server fetch, zero CORS issues)
      try {
        const actionResult = await getAllCategoriesAction();
        if (actionResult.success && actionResult.data) {
          res = actionResult.data;
        }
      } catch (err) {
        console.warn("[useCategories] Server action fallback to client fetch:", err);
      }

      // 2. Fallback to client-side Axios candidate route discovery
      if (!res) {
        const candidateEndpoints = [
          API_ROUTES.CATEGORIES.LIST, // "/api/category/get-all-category"
          "/api/admin/get-all-category",
          "/api/categories/get-all-category",
          "/get-all-category",
          "/api/get-all-category",
          "/api/category/all",
          "/api/categories",
        ];
        res = await fetchWithCandidateRoutes<any>(candidateEndpoints);
      }

      let list: any[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res?.data?.categories)) {
        list = res.data.categories;
      } else if (Array.isArray(res?.categories)) {
        list = res.categories;
      }

      const normalizedList: Category[] = list.map((cat: any) => {
        const cleanedIcon = cleanIconUrl(cat.icon);
        const cleanedImage = cleanIconUrl(cat.image) || (cleanedIcon.startsWith("http") ? cleanedIcon : "");
        return {
          ...cat,
          id: cat.id || cat._id || "",
          _id: cat._id || cat.id || "",
          name: cat.name || "Untitled Category",
          description: cat.description || "",
          icon: cleanedIcon,
          image: cleanedImage,
          slug:
            cat.slug ||
            cat.name?.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-") ||
            "",
          serviceCount:
            cat.serviceCount ??
            cat.servicesCount ??
            (Array.isArray(cat.services) ? cat.services.length : 0),
          createdAt: cat.createdAt || new Date().toISOString(),
          updatedAt: cat.updatedAt || new Date().toISOString(),
        };
      });

      return {
        success: true,
        message: res?.message ?? "Categories loaded successfully",
        data: normalizedList,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single category by ID from router.get('/get-category/:categoryId', categoryController.getCategoryById)
 * Primary: Server Action via getCategoryByIdAction(id)
 * Fallback: Client axios candidate routes
 */
export function useCategoryDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.DETAIL(id),
    queryFn: async () => {
      if (!id) return { success: false, message: "No ID provided", data: null };

      let res: any = null;

      // 1. Try Server Action first
      try {
        const actionResult = await getCategoryByIdAction(id);
        if (actionResult.success && actionResult.data) {
          res = actionResult.data;
        }
      } catch (err) {
        console.warn("[useCategoryDetail] Server action fallback to client fetch:", err);
      }

      // 2. Fallback to client-side Axios candidate routes
      if (!res) {
        const candidateEndpoints = [
          API_ROUTES.CATEGORIES.DETAIL(id), // "/api/category/get-category/:id"
          `/api/admin/get-category/${id}`,
          `/api/categories/get-category/${id}`,
          `/get-category/${id}`,
          `/api/category/${id}`,
          `/api/admin/get-category?categoryId=${id}`,
        ];
        res = await fetchWithCandidateRoutes<any>(candidateEndpoints);
      }

      const rawCat = res?.data?.category || res?.data || res;

      if (!rawCat || typeof rawCat !== "object") {
        return { success: false, message: res?.message || "Category not found", data: null };
      }

      const cleanedIcon = cleanIconUrl(rawCat.icon);
      const cleanedImage = cleanIconUrl(rawCat.image) || (cleanedIcon.startsWith("http") ? cleanedIcon : "");

      const normalizedCat: Category = {
        ...rawCat,
        id: rawCat.id || rawCat._id || id,
        _id: rawCat._id || rawCat.id || id,
        name: rawCat.name || "Untitled Category",
        description: rawCat.description || "",
        icon: cleanedIcon,
        image: cleanedImage,
        slug:
          rawCat.slug ||
          rawCat.name?.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-") ||
          "",
        serviceCount:
          rawCat.serviceCount ??
          rawCat.servicesCount ??
          (Array.isArray(rawCat.services) ? rawCat.services.length : 0),
        createdAt: rawCat.createdAt || new Date().toISOString(),
        updatedAt: rawCat.updatedAt || new Date().toISOString(),
      };

      return {
        success: true,
        message: res?.message ?? "Category detail loaded successfully",
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
    mutationFn: async (data: CategoryMutationInput) => {
      const candidateEndpoints = [
        API_ROUTES.ADMIN.CREATE_CATEGORY, // "/api/category/create-category"
        "/api/admin/create-category",
        "/api/categories/create-category",
        "/create-category",
      ];
      let lastError: any = null;
      for (const endpoint of candidateEndpoints) {
        try {
          return await apiPost<ApiResponse<Category>>(endpoint, data);
        } catch (err: any) {
          lastError = err;
          if (err?.response?.status === 404) continue;
          throw err;
        }
      }
      throw lastError || new Error("Failed to create category");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CategoryMutationInput> }) => {
      const candidateEndpoints = [
        API_ROUTES.ADMIN.UPDATE_CATEGORY(id), // "/api/category/update-category/:id"
        `/api/admin/update-category/${id}`,
        `/api/categories/update-category/${id}`,
        `/update-category/${id}`,
      ];
      let lastError: any = null;
      for (const endpoint of candidateEndpoints) {
        try {
          return await apiPut<ApiResponse<Category>>(endpoint, data);
        } catch (err: any) {
          lastError = err;
          if (err?.response?.status === 404) continue;
          throw err;
        }
      }
      throw lastError || new Error("Failed to update category");
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.DETAIL(variables.id) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const candidateEndpoints = [
        API_ROUTES.ADMIN.DELETE_CATEGORY(id), // "/api/category/delete-category/:id"
        `/api/admin/delete-category/${id}`,
        `/api/categories/delete-category/${id}`,
        `/delete-category/${id}`,
      ];
      let lastError: any = null;
      for (const endpoint of candidateEndpoints) {
        try {
          return await apiDelete<ApiResponse<null>>(endpoint);
        } catch (err: any) {
          lastError = err;
          if (err?.response?.status === 404) continue;
          throw err;
        }
      }
      throw lastError || new Error("Failed to delete category");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
}




