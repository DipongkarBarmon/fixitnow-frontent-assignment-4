"use server";

import { cookies } from "next/headers";

export type RegisterActionState = {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "TECHNICIAN";
  phoneNumber?: string;
  phone?: string;
  profilePhoto?: string;
};

export const registerAction = async (formData: RegisterActionState) => {
  const { name, email, password, role, phoneNumber, phone, profilePhoto } =
    formData;

  const payload = {
    name,
    email,
    password,
    role,
    phone: phone || phoneNumber,
    phoneNumber: phoneNumber || phone,
    profilePhoto: profilePhoto,
  };

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    let result;
    try {
      result = await res.json();
    } catch {
      return {
        success: false,
        message: `Backend returned invalid response (${res.status} ${res.statusText})`,
      };
    }

    if (result.success && result.data?.accessToken) {
      const cookieStore = await cookies();
      const isProduction = process.env.NODE_ENV === "production";

      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      });

      if (result.data?.refreshToken) {
        cookieStore.set("refreshToken", result.data.refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    }

    return result;
  } catch (error: any) {
    console.error("[registerAction] Connection failed:", error?.message || error);
    return {
      success: false,
      message:
        "Unable to connect to the backend server. Please make sure the backend is running at " +
        backendUrl,
    };
  }
};

