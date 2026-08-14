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
  useTechnicianCreateService,
  useUpdateService,
  useDeleteService,
} from "./use-services";

export {
  useCategories,
  useCategoryDetail,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./use-categories";

export {
  useTechnicians,
  useTechnicianDetail,
  useMyTechnicianProfile,
  useTopRatedTechnicians,
  useCreateTechnicianProfile,
  useUpdateTechnicianProfile,
} from "./use-technicians";

export {
  useBookings,
  useBookingDetail,
  useCreateBooking,
  useUpdateBookingStatus,
  useCancelBooking,
  useAcceptBooking,
  useDeclineBooking,
  useStartWorkingBooking,
  useCompleteBooking,
} from "./use-bookings";

export {
  useReviews,
  useReviewsByService,
  useCreateReview,
} from "./use-reviews";

export {
  usePayments,
  usePaymentById,
  useInitiatePayment,
} from "./use-payments";

export {
  useAvailability,
  useSetAvailability,
  useRemoveAvailability,
} from "./use-availability";

export {
  useAdminStats,
  useAdminUsers,
  useAdminUserDetail,
  useUpdateUserStatus,
  useBanUser,
  useUnbanUser,
  useDeleteUser,
} from "./use-admin";

export { useUpdateProfile } from "./use-profile";

