import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type {
  TechnicianProfile,
  TechnicianFilters,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated/filtered list of technicians.
 */
export function useTechnicians(filters: TechnicianFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.TECHNICIANS.FILTERED(
      filters as Record<string, unknown>
    ),
    queryFn: () =>
      apiGet<PaginatedResponse<TechnicianProfile>>(
        API_ROUTES.TECHNICIANS.LIST,
        {
          ...filters,
          minRating: filters.minRating,
          minExperience: filters.minExperience,
          page: filters.page,
          limit: filters.limit,
        }
      ),
  });
}

/**
 * Fetch a single technician by ID.
 */
export function useTechnicianDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TECHNICIANS.DETAIL(id),
    queryFn: () =>
      apiGet<ApiResponse<TechnicianProfile>>(
        API_ROUTES.TECHNICIANS.DETAIL(id)
      ),
    enabled: !!id,
  });
}

/**
 * Fetch the logged-in technician's own profile.
 */
export function useMyTechnicianProfile() {
  return useQuery({
    queryKey: [...QUERY_KEYS.TECHNICIANS.ALL, "profile"],
    queryFn: () =>
      apiGet<ApiResponse<TechnicianProfile>>(API_ROUTES.TECHNICIANS.PROFILE),
  });
}

/**
 * Fetch top-rated technicians for showcase sections.
 */
export function useTopRatedTechnicians() {
  return useQuery({
    queryKey: QUERY_KEYS.TECHNICIANS.TOP_RATED,
    queryFn: () =>
      apiGet<ApiResponse<TechnicianProfile[]>>(
        API_ROUTES.TECHNICIANS.TOP_RATED
      ),
    staleTime: 5 * 60 * 1000,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update the logged-in technician's profile details.
 */
export function useUpdateTechnicianProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TechnicianProfile>) =>
      apiPatch<ApiResponse<TechnicianProfile>>(API_ROUTES.TECHNICIANS.PROFILE, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.TECHNICIANS.ALL, "profile"],
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TECHNICIANS.ALL,
      });
    },
  });
}

