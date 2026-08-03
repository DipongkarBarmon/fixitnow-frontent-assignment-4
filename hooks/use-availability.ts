import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type { ApiResponse, Availability, SetAvailabilityInput } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch availability schedule for a specific technician.
 */
export function useAvailability(technicianId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.AVAILABILITY.BY_TECHNICIAN(technicianId),
    queryFn: () =>
      apiGet<ApiResponse<Availability[]>>(
        API_ROUTES.AVAILABILITY.GET(technicianId)
      ),
    enabled: !!technicianId,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create or update availability time slots / blocked dates for a technician.
 */
export function useSetAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetAvailabilityInput) =>
      apiPost<ApiResponse<Availability>>(API_ROUTES.AVAILABILITY.SET, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

/**
 * Delete a specific availability slot by ID.
 */
export function useRemoveAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) =>
      apiDelete<ApiResponse<null>>(API_ROUTES.AVAILABILITY.REMOVE(slotId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}
