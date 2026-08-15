import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/axios-client";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type {
  Review,
  ReviewFilters,
  CreateReviewInput,
  UpdateReviewInput,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch reviews with optional filters.
 */
export function useReviews(filters: ReviewFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.REVIEWS.FILTERED(filters as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<Review>>(API_ROUTES.REVIEWS.LIST, {
        ...filters,
        page: filters.page,
        limit: filters.limit,
      }),
  });
}

/**
 * Fetch all reviews for a specific service.
 */
export function useReviewsByService(serviceId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.REVIEWS.BY_SERVICE(serviceId),
    queryFn: () =>
      apiGet<PaginatedResponse<Review>>(
        API_ROUTES.REVIEWS.BY_SERVICE(serviceId)
      ),
    enabled: !!serviceId,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submit a review for a completed booking.
 */
export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewInput) =>
      apiPost<ApiResponse<Review>>(API_ROUTES.REVIEWS.CREATE, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.ALL });
      if (variables.bookingId) {
        // Invalidate the booking detail since it embeds the review
        void queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.BOOKINGS.DETAIL(variables.bookingId),
        });
      }
    },
  });
}

/**
 * Update an existing review.
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewInput }) =>
      apiPatch<ApiResponse<Review>>(API_ROUTES.REVIEWS.UPDATE(id), data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.ALL });
    },
  });
}

/**
 * Delete an existing review.
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete<ApiResponse<null>>(API_ROUTES.REVIEWS.DELETE(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.ALL });
    },
  });
}
