import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type {
  Payment,
  PaymentFilters,
  InitiatePaymentInput,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch the current user's payment history with optional filters. */
export function usePayments(filters: PaymentFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENTS.FILTERED(filters as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<Payment>>(API_ROUTES.PAYMENTS.LIST, {
        ...(filters as Record<string, string | number | boolean | undefined>),
      }),
  });
}

/** Fetch a single payment by ID. */
export function usePaymentById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENTS.DETAIL(id),
    queryFn: () =>
      apiGet<ApiResponse<Payment>>(API_ROUTES.PAYMENTS.DETAIL(id)),
    enabled: !!id,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/** Initiate a payment — returns redirectUrl for Stripe/SSLCommerz. */
export function useInitiatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InitiatePaymentInput) =>
      apiPost<ApiResponse<{ redirectUrl: string; payment: Payment }>>(
        API_ROUTES.PAYMENTS.INITIATE,
        data
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.ALL });
    },
  });
}
