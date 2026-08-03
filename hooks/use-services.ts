import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type {
  Service,
  ServiceFilters,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated/filtered list of services.
 */
export function useServices(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.SERVICES.FILTERED(filters as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<Service>>(API_ROUTES.SERVICES.LIST, {
        ...filters,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
        page: filters.page,
        limit: filters.limit,
      }),
  });
}

/**
 * Fetch a single service by ID.
 */
export function useServiceDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SERVICES.DETAIL(id),
    queryFn: () => apiGet<ApiResponse<Service>>(API_ROUTES.SERVICES.DETAIL(id)),
    enabled: !!id,
  });
}

/**
 * Fetch featured/highlighted services for the homepage.
 */
export function useFeaturedServices() {
  return useQuery({
    queryKey: QUERY_KEYS.SERVICES.FEATURED,
    queryFn: () => apiGet<ApiResponse<Service[]>>(API_ROUTES.SERVICES.FEATURED),
    staleTime: 5 * 60 * 1000, // 5 minutes — relatively stable data
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin & Technician Mutations (create / update / delete)
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateServiceInput {
  name: string;
  description: string;
  categoryId: string;
  startingPrice: number;
  duration?: number;
  image?: string;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  isActive?: boolean;
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServiceInput) =>
      apiPost<ApiResponse<Service>>(API_ROUTES.SERVICES.LIST, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES.ALL });
    },
  });
}

export function useUpdateService(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateServiceInput) =>
      apiPatch<ApiResponse<Service>>(API_ROUTES.SERVICES.DETAIL(id), data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES.ALL });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERVICES.DETAIL(id),
      });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiDelete<ApiResponse<null>>(API_ROUTES.SERVICES.DETAIL(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES.ALL });
    },
  });
}

