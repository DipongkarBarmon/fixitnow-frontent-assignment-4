"use server";

import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Category, PaginatedResponse } from "@/types";
import { API_ROUTES } from "@/constants";

export async function getCategories() {
  return apiClient<PaginatedResponse<Category>>(API_ROUTES.CATEGORIES.LIST, {
    revalidate: 3600,
    tags: ["categories"],
  });
}

export async function getCategoryById(id: string) {
  return apiClient<ApiResponse<Category>>(API_ROUTES.CATEGORIES.DETAIL(id), {
    revalidate: 3600,
    tags: ["categories", id],
  });
}

export async function createCategory(data: { name: string; description?: string; image?: string }) {
  return apiClient<ApiResponse<Category>>(API_ROUTES.CATEGORIES.LIST, {
    method: "POST",
    body: data,
  });
}

export async function updateCategory(id: string, data: { name?: string; description?: string; image?: string }) {
  return apiClient<ApiResponse<Category>>(API_ROUTES.CATEGORIES.DETAIL(id), {
    method: "PATCH",
    body: data,
  });
}

export async function deleteCategory(id: string) {
  return apiClient<ApiResponse<null>>(API_ROUTES.CATEGORIES.DETAIL(id), {
    method: "DELETE",
  });
}
