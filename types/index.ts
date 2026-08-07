// ==========================================
// User & Auth Types
// ==========================================

export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  phoneNumber?: string;
  phone?: string;
  profilePhoto?: string;
  avatar?: string;
  address?: string;
  isVerified?: boolean;
  isBanned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ==========================================
// Category Types
// ==========================================

export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  serviceCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// Service Types
// ==========================================

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  images?: string[];
  categoryId: string;
  category?: Category;
  startingPrice: number;
  averageRating: number;
  totalReviews: number;
  technicianCount: number;
  duration?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
  page?: number;
  limit?: number;
}

// ==========================================
// Technician Types
// ==========================================

export interface TechnicianProfile {
  id: string;
  userId: string;
  user?: User;
  bio?: string;
  address?: string;
  location?: string;
  skills: string[];
  experience: number;
  certifications: string[];
  hourlyRate: number;
  coverImage?: string;
  completedJobs: number;
  averageRating: number;
  totalReviews: number;
  isVerified: boolean;
  latitude?: number;
  longitude?: number;
  availabilities?: Availability[];
  bookings?: Booking[];
  reviews?: Review[];
  services?: Service[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTechnicianProfileInput {
  address: string;
  bio?: string;
  skills: string[];
  experience?: number;
  hourlyRate?: number;
  certifications?: string[];
  location?: string;
}

export interface UpdateTechnicianProfileInput {
  address?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  certifications?: string[];
  location?: string;
}

export interface TechnicianFilters {
  search?: string;
  skill?: string;
  location?: string;
  minRating?: number;
  minExperience?: number;
  sortBy?: "rating" | "experience" | "price_asc" | "price_desc" | "jobs";
  page?: number;
  limit?: number;
}

// ==========================================
// Availability Types
// ==========================================

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Availability {
  id: string;
  technicianId: string;
  date: string;
  dayOfWeek: number;
  timeSlots: TimeSlot[];
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SetAvailabilityInput {
  date: string;
  dayOfWeek: number;
  timeSlots: { startTime: string; endTime: string }[];
  isBlocked?: boolean;
}

// ==========================================
// Booking Types
// ==========================================

export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Booking {
  id: string;
  customerId: string;
  customer?: User;
  technicianId: string;
  technician?: TechnicianProfile;
  serviceId: string;
  service?: Service;
  bookingDate: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  paymentStatus: PaymentStatus;
  payment?: Payment;
  review?: Review;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  serviceId: string;
  technicianId: string;
  bookingDate: string;
  timeSlotId: string;
  notes?: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ==========================================
// Payment Types
// ==========================================

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethod = "STRIPE" | "SSLCOMMERZ";

export interface Payment {
  id: string;
  bookingId: string;
  booking?: Booking;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiatePaymentInput {
  bookingId: string;
  method: PaymentMethod;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ==========================================
// Review Types
// ==========================================

export interface Review {
  id?: string;
  bookingId?: string;
  booking?: Booking;
  customerId?: string;
  customer?: User;
  technicianId?: string;
  technician?: TechnicianProfile;
  serviceId?: string;
  service?: Service | string;
  customerName?: string;
  avatar?: string;
  date?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface ReviewFilters {
  serviceId?: string;
  technicianId?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

// ==========================================
// Admin Types
// ==========================================

export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalTechnicians: number;
  activeTechnicians: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  pendingPayments: number;
  totalCategories: number;
  totalServices: number;
  averageRating: number;
  monthlyRevenue: { month: string; revenue: number }[];
  bookingsByStatus: { status: BookingStatus; count: number }[];
}

export interface UserFilters {
  search?: string;
  role?: UserRole | string;
  status?: UserStatus | string;
  isBanned?: boolean;
  page?: number;
  limit?: number;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errorMessages?: { path: string; message: string }[];
  stack?: string;
}
