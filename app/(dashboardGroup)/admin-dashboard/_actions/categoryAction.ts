"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface CategoryActionResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Robust fetch helper that iterates over candidate routes until a non-404 response is received
 */
async function fetchBackendAction(
  candidatePaths: string[],
  options: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
  }
): Promise<CategoryActionResult> {
  const backendUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://localhost:5000";

  let accessToken: string | undefined;
  try {
    const cookieStore = await cookies();
    accessToken = cookieStore.get("accessToken")?.value;
  } catch {
    // Client-side or SSR context where cookies are unavailable
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let lastErrorMsg = "Unable to complete category operation";

  for (const path of candidatePaths) {
    const targetUrl = `${backendUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    try {
      const res = await fetch(targetUrl, {
        method: options.method,
        headers,
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
        cache: "no-store",
      });

      // If route not mounted here (404), try next candidate
      if (res.status === 404) {
        lastErrorMsg = `Route not found at ${path} (404)`;
        continue;
      }

      let result: any;
      try {
        result = await res.json();
      } catch {
        return {
          success: false,
          message: `Backend returned non-JSON response (${res.status} ${res.statusText})`,
        };
      }

      if (!res.ok || result.success === false) {
        return {
          success: false,
          message: result.message || `Request failed with status ${res.status}`,
          data: result.data || result,
        };
      }

      return {
        success: true,
        message: result.message || "Operation completed successfully",
        data: result.data || result,
      };
    } catch (err: any) {
      lastErrorMsg = err?.message || `Network error connecting to ${targetUrl}`;
    }
  }

  return {
    success: false,
    message: lastErrorMsg,
  };
}

/**
 * Server action to create a new category in Admin Dashboard
 * Endpoint: router.post('/create-category', auth(Role.ADMIN), adminController.createCategory)
 */
export default async function createCategoryAction(
  data: CreateCategoryPayload
): Promise<CategoryActionResult> {
  if (!data.name || !data.name.trim()) {
    return { success: false, message: "Category name is required" };
  }

  const payload = {
    name: data.name.trim(),
    description: data.description ? data.description.trim() : "",
    icon: data.icon?.trim() || data.image?.trim() || "",
  };

  const candidatePaths = [
    "/api/category/create-category",
    "/api/admin/create-category",
    "/api/categories/create-category",
    "/create-category",
  ];

  const result = await fetchBackendAction(candidatePaths, {
    method: "POST",
    body: payload,
  });

  if (result.success) {
    try {
      revalidatePath("/admin-dashboard/categories");
      revalidatePath("/categories");
      revalidatePath("/services");
    } catch (err) {
      console.warn("[createCategoryAction] revalidatePath warning:", err);
    }
  }

  return result;
}

/**
 * Server action to update a category in Admin Dashboard
 * Endpoint: router.put('/update-category/:categoryId', auth(Role.ADMIN), adminController.updateCategoryById)
 */
export async function updateCategoryAction(
  categoryId: string,
  data: UpdateCategoryPayload
): Promise<CategoryActionResult> {
  if (!categoryId) {
    return { success: false, message: "Category ID is required for update" };
  }

  const payload: Record<string, any> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.description !== undefined) payload.description = data.description.trim();
  if (data.icon !== undefined || data.image !== undefined) {
    payload.icon = (data.icon || data.image || "").trim();
  }

  const candidatePaths = [
    `/api/category/update-category/${categoryId}`,
    `/api/admin/update-category/${categoryId}`,
    `/api/categories/update-category/${categoryId}`,
    `/update-category/${categoryId}`,
  ];

  const result = await fetchBackendAction(candidatePaths, {
    method: "PUT",
    body: payload,
  });

  if (result.success) {
    try {
      revalidatePath("/admin-dashboard/categories");
      revalidatePath("/categories");
      revalidatePath("/services");
    } catch (err) {
      console.warn("[updateCategoryAction] revalidatePath warning:", err);
    }
  }

  return result;
}

/**
 * Server action to delete a category in Admin Dashboard
 * Endpoint: router.delete('/delete-category/:categoryId', auth(Role.ADMIN), adminController.deleteCategoryById)
 */
export async function deleteCategoryAction(
  categoryId: string
): Promise<CategoryActionResult> {
  if (!categoryId) {
    return { success: false, message: "Category ID is required for deletion" };
  }

  const candidatePaths = [
    `/api/category/delete-category/${categoryId}`,
    `/api/admin/delete-category/${categoryId}`,
    `/api/categories/delete-category/${categoryId}`,
    `/delete-category/${categoryId}`,
  ];

  const result = await fetchBackendAction(candidatePaths, {
    method: "DELETE",
  });

  if (result.success) {
    try {
      revalidatePath("/admin-dashboard/categories");
      revalidatePath("/categories");
      revalidatePath("/services");
    } catch (err) {
      console.warn("[deleteCategoryAction] revalidatePath warning:", err);
    }
  }

  return result;
}

/**
 * Server action to get all categories
 * Endpoint: router.get('/get-all-category', categoryController.getAllCategory)
 */
export async function getAllCategoriesAction(): Promise<CategoryActionResult> {
  const candidatePaths = [
    "/api/category/get-all-category",
    "/api/admin/get-all-category",
    "/api/categories/get-all-category",
    "/get-all-category",
    "/api/get-all-category",
  ];

  return await fetchBackendAction(candidatePaths, {
    method: "GET",
  });
}

/**
 * Server action to get a category by ID
 * Endpoint: router.get('/get-category/:categoryId', categoryController.getCategoryById)
 */
export async function getCategoryByIdAction(
  categoryId: string
): Promise<CategoryActionResult> {
  if (!categoryId) {
    return { success: false, message: "Category ID is required" };
  }

  const candidatePaths = [
    `/api/category/get-category/${categoryId}`,
    `/api/admin/get-category/${categoryId}`,
    `/api/categories/get-category/${categoryId}`,
    `/get-category/${categoryId}`,
    `/api/category/${categoryId}`,
  ];

  return await fetchBackendAction(candidatePaths, {
    method: "GET",
  });
}



