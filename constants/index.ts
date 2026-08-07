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
    LIST: "/api/admin/get-all-users",
    DETAIL: (id: string) => `/api/admin/get-user?userId=${id}`,
    UPDATE_STATUS: "/api/admin/update-user-status",
    BAN: (id: string) => `/api/admin/update-user-status?userId=${id}&status=BLOCKED`,
    UNBAN: (id: string) => `/api/admin/update-user-status?userId=${id}&status=ACTIVE`,
    DELETE: (id: string) => `/api/admin/delete-user?userId=${id}`,
  },
  CATEGORIES: {
    LIST: "/api/category/get-all-category",
    DETAIL: (id: string) => `/api/category/get-category/${id}`,
  },
  SERVICES: {
    LIST: "/api/services",
    DETAIL: (id: string) => `/api/services/${id}`,
    FEATURED: "/api/services/featured",
  },
  TECHNICIANS: {
    CREATE_PROFILE: "/api/technician/create-technician-profile",
    ME: "/api/technician/get-own-technician-profile",
    PROFILE: "/api/technician/get-own-technician-profile",
    LIST: "/api/technician/get-all-technician-profile",
    DETAIL: (id: string) => `/api/technician/get-technician-profile/${id}`,
    UPDATE: (id: string) => `/api/technician/update-technician-profile/${id}`,
    DELETE: (id: string) => `/api/technician/delete-technician-profile/${id}`,
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
    CREATE_CATEGORY: "/api/category/create-category",
    UPDATE_CATEGORY: (categoryId: string) => `/api/category/update-category/${categoryId}`,
    DELETE_CATEGORY: (categoryId: string) => `/api/category/delete-category/${categoryId}`,
    GET_ALL_USERS: "/api/admin/get-all-users",
    GET_USER: (userId: string) => `/api/admin/get-user?userId=${userId}`,
    UPDATE_USER_STATUS: "/api/admin/update-user-status",
    DELETE_USER: (userId: string) => `/api/admin/delete-user?userId=${userId}`,
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
  { title: "Categories", href: "/admin-dashboard/categories", icon: "FolderTree" },
  { title: "Create Category", href: "/admin-dashboard/categories/create", icon: "FolderPlus" },
  { title: "Users", href: "/admin-dashboard/users", icon: "Users" },
  { title: "Payment History", href: "/admin-dashboard/payments", icon: "CreditCard" },
  { title: "Bookings", href: "/admin-dashboard/bookings", icon: "Calendar" },
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
