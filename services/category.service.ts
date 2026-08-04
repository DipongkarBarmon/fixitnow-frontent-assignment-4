"use server";

import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Category } from "@/types";
import { API_ROUTES } from "@/constants";

export interface CategoryPayload {
  name: string;
  icon?: string;
  description?: string;
}

export async function getCategories() {
  return apiClient<ApiResponse<Category[]>>(API_ROUTES.CATEGORIES.LIST, {
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

export async function createCategory(data: CategoryPayload) {
  return apiClient<ApiResponse<Category>>(API_ROUTES.ADMIN.CREATE_CATEGORY, {
    method: "POST",
    body: data,
  });
}

export async function updateCategory(id: string, data: Partial<CategoryPayload>) {
  return apiClient<ApiResponse<Category>>(API_ROUTES.ADMIN.UPDATE_CATEGORY(id), {
    method: "PUT",
    body: data,
  });
}

export async function deleteCategory(id: string) {
  return apiClient<ApiResponse<null>>(API_ROUTES.ADMIN.DELETE_CATEGORY(id), {
    method: "DELETE",
  });
}

