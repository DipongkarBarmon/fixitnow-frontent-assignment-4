/**
 * Browser-side Axios client with automatic auth & token refresh.
 * Use this in Client Components and TanStack Query hooks.
 */
import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// Instance
// ─────────────────────────────────────────────────────────────────────────────

const axiosClient = axios.create({
  baseURL: typeof window !== "undefined" ? "/" : (process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:5000"),
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send httpOnly cookies automatically
});

// ─────────────────────────────────────────────────────────────────────────────
// Request Interceptor — attach access token from cookie (client-readable copy)
// Note: httpOnly tokens are sent automatically via withCredentials.
// If you maintain a client-readable token in localStorage, attach it here.
// ─────────────────────────────────────────────────────────────────────────────

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Tokens are httpOnly cookies → sent automatically by the browser.
    // If you ever store a client-readable token, add it here:
    // const token = localStorage.getItem("accessToken");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────────────────────
// Response Interceptor — handle 401 → refresh → retry
// ─────────────────────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(axiosClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Hit our Next.js route handler which proxies to the backend refresh endpoint
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Refresh failed");

        const data = (await res.json()) as { success: boolean };
        if (!data.success) throw new Error("Refresh failed");

        onTokenRefreshed("");
        isRefreshing = false;

        return axiosClient(originalRequest);
      } catch {
        isRefreshing = false;
        refreshSubscribers = [];
        // Redirect to login on refresh failure
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Typed convenience helpers
// ─────────────────────────────────────────────────────────────────────────────

export async function apiGet<T>(
  url: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const response = await axiosClient.get<T>(url, { params });
  return response.data;
}

export async function apiPost<T, D = unknown>(
  url: string,
  data?: D
): Promise<T> {
  const response = await axiosClient.post<T>(url, data);
  return response.data;
}

export async function apiPatch<T, D = unknown>(
  url: string,
  data?: D
): Promise<T> {
  const response = await axiosClient.patch<T>(url, data);
  return response.data;
}

export async function apiPut<T, D = unknown>(
  url: string,
  data?: D
): Promise<T> {
  const response = await axiosClient.put<T>(url, data);
  return response.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await axiosClient.delete<T>(url);
  return response.data;
}

export default axiosClient;
