"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  icon?: string;

}

export interface CategoryActionResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Server action to create a new category in Admin Dashboard
 * Endpoint: POST /api/category/create-category
 */
export default async function createCategoryAction(
  data: CreateCategoryPayload
): Promise<CategoryActionResult> {
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
  console.log("backendUrl", backendUrl);

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const payload = {
      name: data.name.trim(),
      description: data.description ? data.description.trim() : "",
      ...(data.icon?.trim() ? { icon: data.icon.trim() } : {})
    };

    const res = await fetch(`${backendUrl}/api/admin/create-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    let result;
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
        message: result.message || "Failed to create category",
      };
    }

    // Revalidate category paths
    try {
      revalidatePath("/admin-dashboard/categories");
      revalidatePath("/categories");
      revalidatePath("/services");
    } catch (err) {
      console.warn("[createCategoryAction] revalidatePath error:", err);
    }

    return {
      success: true,
      message: result.message || "Category created successfully",
      data: result.data || result,
    };
  } catch (error: any) {
    console.error("[createCategoryAction] Server Action Error:", error);
    return {
      success: false,
      message:
        error?.message ||
        `Unable to connect to backend server at ${backendUrl}. Please ensure server is running.`,
    };
  }
}

/**
 * Server action to update a category in Admin Dashboard
 * Endpoint: PUT /api/category/update-category/:categoryId
 */
export async function updateCategoryAction(
  categoryId: string,
  data: UpdateCategoryPayload
): Promise<CategoryActionResult> {
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

  if (!categoryId) {
    return {
      success: false,
      message: "Category ID is required for update",
    };
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const payload: Record<string, any> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.description !== undefined) payload.description = data.description.trim();
    if (data.icon !== undefined) payload.icon = data.icon.trim();


    const res = await fetch(`${backendUrl}/api/category/update-category/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    let result;
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
        message: result.message || "Failed to update category",
      };
    }

    // Revalidate category paths
    try {
      revalidatePath("/admin-dashboard/categories");
      revalidatePath("/categories");
      revalidatePath("/services");
    } catch (err) {
      console.warn("[updateCategoryAction] revalidatePath error:", err);
    }

    return {
      success: true,
      message: result.message || "Category updated successfully",
      data: result.data || result,
    };
  } catch (error: any) {
    console.error("[updateCategoryAction] Server Action Error:", error);
    return {
      success: false,
      message:
        error?.message ||
        `Unable to connect to backend server at ${backendUrl}. Please ensure server is running.`,
    };
  }
}

/**
 * Server action to delete a category in Admin Dashboard
 * Endpoint: DELETE /api/category/delete-category/:categoryId
 */
export async function deleteCategoryAction(
  categoryId: string
): Promise<CategoryActionResult> {
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

  if (!categoryId) {
    return {
      success: false,
      message: "Category ID is required for deletion",
    };
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${backendUrl}/api/category/delete-category/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      cache: "no-store",
    });

    let result;
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
        message: result.message || "Failed to delete category",
      };
    }

    // Revalidate category paths
    try {
      revalidatePath("/admin-dashboard/categories");
      revalidatePath("/categories");
      revalidatePath("/services");
    } catch (err) {
      console.warn("[deleteCategoryAction] revalidatePath error:", err);
    }

    return {
      success: true,
      message: result.message || "Category deleted successfully",
      data: result.data || result,
    };
  } catch (error: any) {
    console.error("[deleteCategoryAction] Server Action Error:", error);
    return {
      success: false,
      message:
        error?.message ||
        `Unable to connect to backend server at ${backendUrl}. Please ensure server is running.`,
    };
  }
}

