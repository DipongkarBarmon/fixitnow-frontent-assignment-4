import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Auth Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["CUSTOMER", "TECHNICIAN"], {
      error: "Please select a role",
    }),
    phone: z
      .string()
      .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Profile Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().max(500, "Address is too long").optional().or(z.literal("")),
  avatar: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Booking Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  technicianId: z.string().min(1, "Technician is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  timeSlotId: z.string().min(1, "Time slot is required"),
  notes: z.string().max(1000, "Notes must be at most 1000 characters").optional(),
});

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Review Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  bookingId: z.string().min(1, "Booking reference is required"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .min(1, "Comment is required")
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must be at most 1000 characters"),
});

export type CreateReviewFormValues = z.infer<typeof createReviewSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Technician Profile Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const technicianProfileSchema = z.object({
  bio: z.string().max(2000, "Bio must be at most 2000 characters").optional(),
  skills: z
    .array(z.string().min(1))
    .min(1, "Please add at least one skill")
    .max(20, "Maximum 20 skills allowed"),
  experience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience value seems too high"),
  hourlyRate: z
    .number()
    .min(1, "Hourly rate must be at least 1")
    .max(100_000, "Hourly rate seems too high"),
  location: z.string().max(200, "Location is too long").optional(),
  certifications: z
    .array(z.string().min(1))
    .max(20, "Maximum 20 certifications allowed")
    .optional(),
});

export type TechnicianProfileFormValues = z.infer<typeof technicianProfileSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Search / Filter Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const serviceFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "rating", "newest", "popular"])
    .optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type ServiceFilterValues = z.infer<typeof serviceFilterSchema>;

export const technicianFilterSchema = z.object({
  search: z.string().optional(),
  skill: z.string().optional(),
  location: z.string().optional(),
  minRating: z.number().min(1).max(5).optional(),
  minExperience: z.number().min(0).optional(),
  sortBy: z
    .enum(["rating", "experience", "price_asc", "price_desc", "jobs"])
    .optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type TechnicianFilterValues = z.infer<typeof technicianFilterSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Category Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(60, "Category name is too long"),
  icon: z.string().optional(),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),
  slug: z.string().optional(),
  image: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

export const categoryFormSchema = categorySchema;

export type CategoryFormValues = z.infer<typeof categorySchema>;
export type CategoryFormInput = CategoryFormValues;

