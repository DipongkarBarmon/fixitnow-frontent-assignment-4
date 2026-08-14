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
      apiGet<PaginatedResponse<Booking>>("/api/technician/get-all-booking", {
        ...filters,
        page: filters.page,
        limit: filters.limit,
      }).catch(() => 
        apiGet<PaginatedResponse<Booking>>(API_ROUTES.BOOKINGS.LIST, {
          ...filters,
          page: filters.page,
          limit: filters.limit,
        })
      ),
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
 * Update a booking's status (ACCEPTED / DECLINED / IN_PROGRESS / COMPLETED / CANCELLED).
 */
export function useUpdateBookingStatus(bookingId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id?: string; status: BookingStatus } | BookingStatus) => {
      const id = typeof params === "object" ? params.id || bookingId : bookingId;
      const status = typeof params === "object" ? params.status : params;
      if (!id) throw new Error("Booking ID is required to update status");
      return apiPatch<ApiResponse<Booking>>(
        API_ROUTES.BOOKINGS.UPDATE_STATUS(id),
        { status }
      );
    },
    onSuccess: (_, variables) => {
      const id = typeof variables === "object" ? variables.id || bookingId : bookingId;
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
      if (id) {
        void queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.BOOKINGS.DETAIL(id),
        });
      }
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
      apiPost<ApiResponse<Booking>>(API_ROUTES.BOOKINGS.CANCEL(bookingId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOKINGS.DETAIL(bookingId),
      });
    },
  });
}

/**
 * Accept a booking (technician action).
 */
export function useAcceptBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      apiPost<ApiResponse<Booking>>(API_ROUTES.TECHNICIANS.ACCEPT_BOOKING(bookingId), {}),
    onSuccess: (_, bookingId) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.DETAIL(bookingId) });
    },
  });
}

/**
 * Decline a booking (technician action).
 */
export function useDeclineBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      apiPost<ApiResponse<Booking>>(API_ROUTES.TECHNICIANS.DECLINE_BOOKING(bookingId), {}),
    onSuccess: (_, bookingId) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.DETAIL(bookingId) });
    },
  });
}

/**
 * Start working on a booking (technician action).
 */
export function useStartWorkingBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      apiPost<ApiResponse<Booking>>(API_ROUTES.TECHNICIANS.START_WORKING(bookingId), {}),
    onSuccess: (_, bookingId) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.DETAIL(bookingId) });
    },
  });
}

/**
 * Complete a booking (technician action).
 */
export function useCompleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      apiPost<ApiResponse<Booking>>(API_ROUTES.TECHNICIANS.COMPLETE_BOOKING(bookingId), {}),
    onSuccess: (_, bookingId) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.DETAIL(bookingId) });
    },
  });
}
