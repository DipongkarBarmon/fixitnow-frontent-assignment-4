import { format, formatDistanceToNow, parseISO } from "date-fns";

/**
 * Format currency with BDT or USD symbol
 */
export function formatCurrency(amount: number, currency = "BDT"): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateStr?: string | null, formatStr = "MMM dd, yyyy"): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), formatStr);
  } catch {
    return dateStr;
  }
}

/**
 * Format a date string to a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

/**
 * Format a rating number or string safely
 */
export function formatRating(rating?: number | string | null): string {
  if (rating === undefined || rating === null || rating === "") return "5.0";
  const num = Number(rating);
  return isNaN(num) ? "5.0" : num.toFixed(1);
}

/**
 * Get initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Build query string from filter object
 */
export function buildQueryString(
  filters: Record<string, string | number | boolean | undefined>
): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.set(key, String(value));
    }
  });
  const queryStr = params.toString();
  return queryStr ? `?${queryStr}` : "";
}

/**
 * Generate a placeholder avatar URL
 */
export function getAvatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || "User")}`;
}

/**
 * Safely get a valid image URL for avatars, prioritizing profile photo
 */
export function getSafeAvatarUrl(photoUrl?: string | null, name = "User"): string {
  if (!photoUrl || typeof photoUrl !== "string") {
    return getAvatarUrl(name);
  }
  const trimmed = photoUrl.trim();
  if (
    !trimmed ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed === "default" ||
    trimmed === "[object Object]"
  ) {
    return getAvatarUrl(name);
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return getAvatarUrl(name);
    }
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `/${trimmed}`;
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  // Basic BD phone formatting
  if (phone.startsWith("+880")) {
    return phone.replace(/(\+880)(\d{4})(\d{6})/, "$1 $2-$3");
  }
  return phone;
}

/**
 * Format duration in minutes to a human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}
