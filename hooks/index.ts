/**
 * Central barrel export for all custom hooks.
 * Import from "@/hooks" instead of individual files.
 */

// Auth
export { useAuth } from "./use-auth";

// Data hooks
export {
  useServices,
  useServiceDetail,
  useFeaturedServices,
  useCreateService,
  useUpdateService,
} from "./use-services";

export {
  useCategories,
  useCategoryDetail,
} from "./use-categories";

export {
  useTechnicians,
  useTechnicianDetail,
  useMyTechnicianProfile,
  useTopRatedTechnicians,
} from "./use-technicians";

export {
  useBookings,
  useBookingDetail,
  useCreateBooking,
  useUpdateBookingStatus,
  useCancelBooking,
} from "./use-bookings";

export {
  useReviews,
  useReviewsByService,
  useCreateReview,
} from "./use-reviews";
