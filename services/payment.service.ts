"use server";

import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  Payment,
  PaymentFilters,
  InitiatePaymentInput,
} from "@/types";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils/format";

export async function initiatePayment(data: InitiatePaymentInput) {
  return apiClient<ApiResponse<{ redirectUrl: string; payment: Payment }>>(
    API_ROUTES.PAYMENTS.INITIATE,
    {
      method: "POST",
      body: data as unknown as Record<string, unknown>,
    }
  );
}

export async function getPayments(filters?: PaymentFilters) {
  const query = filters ? buildQueryString(filters as Record<string, string | number | undefined>) : "";
  return apiClient<PaginatedResponse<Payment>>(`${API_ROUTES.PAYMENTS.LIST}${query}`, {
    cache: "no-store",
  });
}

export async function getPaymentById(id: string) {
  return apiClient<ApiResponse<Payment>>(API_ROUTES.PAYMENTS.DETAIL(id), {
    cache: "no-store",
  });
}
