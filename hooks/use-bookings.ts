import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type {
  Booking,
  BookingFilters,
  BookingStatus,
  CreateBookingInput,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all bookings for the current user (role-aware on the backend).
 */
export function useBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKINGS.FILTERED(filters as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<Booking>>(API_ROUTES.BOOKINGS.LIST, {
        ...filters,
        page: filters.page,
        limit: filters.limit,
      }),
  });
}

/**
 * Fetch a single booking by ID.
 */
export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKINGS.DETAIL(id),
    queryFn: () =>
      apiGet<ApiResponse<Booking>>(API_ROUTES.BOOKINGS.DETAIL(id)),
    enabled: !!id,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new booking.
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingInput) =>
      apiPost<ApiResponse<Booking>>(API_ROUTES.BOOKINGS.CREATE, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
    },
  });
}

/**
 * Update a booking's status (ACCEPTED / DECLINED / IN_PROGRESS / COMPLETED).
 */
export function useUpdateBookingStatus(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: BookingStatus) =>
      apiPatch<ApiResponse<Booking>>(
        API_ROUTES.BOOKINGS.UPDATE_STATUS(bookingId),
        { status }
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOKINGS.DETAIL(bookingId),
      });
    },
  });
}

/**
 * Cancel a booking (customer action).
 */
export function useCancelBooking(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiDelete<ApiResponse<Booking>>(API_ROUTES.BOOKINGS.CANCEL(bookingId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOKINGS.DETAIL(bookingId),
      });
    },
  });
}
