// ==========================================
// API Routes
// ==========================================

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    LOGOUT: "/api/auth/logout",
  },
  USERS: {
    PROFILE: "/api/users/profile",
    LIST: "/api/users",
    BAN: (id: string) => `/api/users/${id}/ban`,
    UNBAN: (id: string) => `/api/users/${id}/unban`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
  CATEGORIES: {
    LIST: "/api/categories",
    DETAIL: (id: string) => `/api/categories/${id}`,
  },
  SERVICES: {
    LIST: "/api/services",
    DETAIL: (id: string) => `/api/services/${id}`,
    FEATURED: "/api/services/featured",
  },
  TECHNICIANS: {
    LIST: "/api/technicians",
    DETAIL: (id: string) => `/api/technicians/${id}`,
    PROFILE: "/api/technicians/profile",
    TOP_RATED: "/api/technicians/top-rated",
  },
  AVAILABILITY: {
    GET: (technicianId: string) => `/api/availability/${technicianId}`,
    SET: "/api/availability",
    REMOVE: (id: string) => `/api/availability/${id}`,
  },
  BOOKINGS: {
    LIST: "/api/bookings",
    CREATE: "/api/bookings",
    DETAIL: (id: string) => `/api/bookings/${id}`,
    UPDATE_STATUS: (id: string) => `/api/bookings/${id}/status`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
  },
  PAYMENTS: {
    INITIATE: "/api/payments/initiate",
    LIST: "/api/payments",
    DETAIL: (id: string) => `/api/payments/${id}`,
  },
  REVIEWS: {
    LIST: "/api/reviews",
    CREATE: "/api/reviews",
    BY_SERVICE: (serviceId: string) => `/api/reviews/service/${serviceId}`,
  },
  ADMIN: {
    STATS: "/api/admin/stats",
  },
} as const;

// ==========================================
// Query Keys
// ==========================================

export const QUERY_KEYS = {
  AUTH: {
    USER: ["auth", "user"],
    PROFILE: ["auth", "profile"],
  },
  CATEGORIES: {
    ALL: ["categories"],
    DETAIL: (id: string) => ["categories", id],
  },
  SERVICES: {
    ALL: ["services"],
    DETAIL: (id: string) => ["services", id],
    FEATURED: ["services", "featured"],
    FILTERED: (filters: Record<string, unknown>) => ["services", "filtered", filters],
  },
  TECHNICIANS: {
    ALL: ["technicians"],
    DETAIL: (id: string) => ["technicians", id],
    TOP_RATED: ["technicians", "top-rated"],
    FILTERED: (filters: Record<string, unknown>) => ["technicians", "filtered", filters],
  },
  AVAILABILITY: {
    BY_TECHNICIAN: (technicianId: string) => ["availability", technicianId],
  },
  BOOKINGS: {
    ALL: ["bookings"],
    DETAIL: (id: string) => ["bookings", id],
    FILTERED: (filters: Record<string, unknown>) => ["bookings", "filtered", filters],
  },
  PAYMENTS: {
    ALL: ["payments"],
    DETAIL: (id: string) => ["payments", id],
    FILTERED: (filters: Record<string, unknown>) => ["payments", "filtered", filters],
  },
  REVIEWS: {
    ALL: ["reviews"],
    BY_SERVICE: (serviceId: string) => ["reviews", "service", serviceId],
    FILTERED: (filters: Record<string, unknown>) => ["reviews", "filtered", filters],
  },
  ADMIN: {
    STATS: ["admin", "stats"],
    USERS: (filters: Record<string, unknown>) => ["admin", "users", filters],
  },
} as const;

// ==========================================
// Navigation
// ==========================================

export const PUBLIC_NAV_ITEMS = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Categories", href: "/categories" },
  { title: "Technicians", href: "/technicians" },
  { title: "Reviews", href: "/reviews" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
] as const;

export const CUSTOMER_SIDEBAR_ITEMS = [
  { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "My Bookings", href: "/dashboard/bookings", icon: "Calendar" },
  { title: "Payments", href: "/dashboard/payments", icon: "CreditCard" },
  { title: "Reviews", href: "/dashboard/reviews", icon: "Star" },
  { title: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
  { title: "Profile", href: "/dashboard/profile", icon: "User" },
  { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const TECHNICIAN_SIDEBAR_ITEMS = [
  { title: "Overview", href: "/technician-dashboard", icon: "LayoutDashboard" },
  { title: "Bookings", href: "/technician-dashboard/bookings", icon: "Calendar" },
  { title: "My Services", href: "/technician-dashboard/services", icon: "Wrench" },
  { title: "Availability", href: "/technician-dashboard/availability", icon: "Clock" },
  { title: "Reviews", href: "/technician-dashboard/reviews", icon: "Star" },
  { title: "Earnings", href: "/technician-dashboard/earnings", icon: "TrendingUp" },
  { title: "Profile", href: "/technician-dashboard/profile", icon: "User" },
  { title: "Settings", href: "/technician-dashboard/settings", icon: "Settings" },
] as const;

export const ADMIN_SIDEBAR_ITEMS = [
  { title: "Overview", href: "/admin-dashboard", icon: "LayoutDashboard" },
  { title: "Users", href: "/admin-dashboard/users", icon: "Users" },
  { title: "Categories", href: "/admin-dashboard/categories", icon: "FolderTree" },
  { title: "Services", href: "/admin-dashboard/services", icon: "Wrench" },
  { title: "Bookings", href: "/admin-dashboard/bookings", icon: "Calendar" },
  { title: "Payments", href: "/admin-dashboard/payments", icon: "CreditCard" },
  { title: "Reports", href: "/admin-dashboard/reports", icon: "BarChart3" },
  { title: "Settings", href: "/admin-dashboard/settings", icon: "Settings" },
] as const;

// ==========================================
// Booking Status Config
// ==========================================

export const BOOKING_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: { label: "Pending", color: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  ACCEPTED: { label: "Accepted", color: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  DECLINED: { label: "Declined", color: "text-red-700 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" },
  IN_PROGRESS: { label: "In Progress", color: "text-purple-700 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  COMPLETED: { label: "Completed", color: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
  CANCELLED: { label: "Cancelled", color: "text-neutral-700 dark:text-neutral-400", bgColor: "bg-neutral-100 dark:bg-neutral-800" },
};

export const PAYMENT_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: { label: "Pending", color: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  PAID: { label: "Paid", color: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
  FAILED: { label: "Failed", color: "text-red-700 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" },
  REFUNDED: { label: "Refunded", color: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
};

// ==========================================
// Misc Constants
// ==========================================

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_RATING = 5;
export const PRICE_RANGE = { min: 0, max: 10000 };
