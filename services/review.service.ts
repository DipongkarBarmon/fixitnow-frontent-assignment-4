"use server";

import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  Review,
  ReviewFilters,
  CreateReviewInput,
} from "@/types";
import { API_ROUTES } from "@/constants";
import { buildQueryString } from "@/utils/format";

export async function createReview(data: CreateReviewInput) {
  return apiClient<ApiResponse<Review>>(API_ROUTES.REVIEWS.CREATE, {
    method: "POST",
    body: data as unknown as Record<string, unknown>,
  });
}

export async function getReviews(filters?: ReviewFilters) {
  const query = filters ? buildQueryString(filters as Record<string, string | number | undefined>) : "";
  return apiClient<PaginatedResponse<Review>>(`${API_ROUTES.REVIEWS.LIST}${query}`, {
    revalidate: 300,
    tags: ["reviews"],
  });
}

export async function getServiceReviews(serviceId: string) {
  return apiClient<PaginatedResponse<Review>>(API_ROUTES.REVIEWS.BY_SERVICE(serviceId), {
    revalidate: 300,
    tags: ["reviews", "service", serviceId],
  });
}
