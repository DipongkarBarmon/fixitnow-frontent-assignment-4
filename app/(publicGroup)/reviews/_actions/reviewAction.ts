"use server";

import type { Review } from "@/types";

export async function getAllReviewsAction(limit?: number, serviceId?: string): Promise<Review[]> {
  const backendUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://localhost:5000";

  let targetUrl = `${backendUrl.replace(/\/$/, "")}/api/review/get-reviews`;
  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  if (serviceId) params.append("serviceId", serviceId);
  
  const queryString = params.toString();
  if (queryString) {
    targetUrl += `?${queryString}`;
  }

  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const result = await res.json();
    const rawData = result.data;
    return Array.isArray(rawData) ? rawData : (Array.isArray((rawData as any)?.data) ? (rawData as any).data : []);
  } catch (err) {
    console.error("[getAllReviewsAction] Failed to fetch reviews:", err);
    return [];
  }
}
