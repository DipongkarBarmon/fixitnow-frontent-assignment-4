"use server";

import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  Booking,
  BookingFilters,
  BookingStatus,
  CreateBookingInput,
} from "@/types";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils/format";

export async function getBookings(filters?: BookingFilters) {
  const query = filters ? buildQueryString(filters as Record<string, string | number | undefined>) : "";
  return apiClient<PaginatedResponse<Booking>>(`${API_ROUTES.BOOKINGS.LIST}${query}`, {
    cache: "no-store",
  });
}

export async function getBookingById(id: string) {
  return apiClient<ApiResponse<Booking>>(API_ROUTES.BOOKINGS.DETAIL(id), {
    cache: "no-store",
  });
}

export async function createBooking(data: CreateBookingInput) {
  return apiClient<ApiResponse<Booking>>(API_ROUTES.BOOKINGS.CREATE, {
    method: "POST",
    body: data as unknown as Record<string, unknown>,
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  return apiClient<ApiResponse<Booking>>(API_ROUTES.BOOKINGS.UPDATE_STATUS(id), {
    method: "PATCH",
    body: { status },
  });
}

export async function cancelBooking(id: string) {
  return apiClient<ApiResponse<Booking>>(API_ROUTES.BOOKINGS.CANCEL(id), {
    method: "PATCH",
  });
}
