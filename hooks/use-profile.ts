import { useMutation } from "@tanstack/react-query";
import { apiPatch } from "@/lib/axios-client";
import { API_ROUTES } from "@/constants";
import type { User, ApiResponse } from "@/types";

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  address?: string;
}

/** Update the current user's profile. Call setUser() in the component's onSuccess. */
export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      apiPatch<ApiResponse<User>>(API_ROUTES.USERS.PROFILE, data),
  });
}
