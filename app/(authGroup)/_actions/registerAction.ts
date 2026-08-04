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
  const { name, email, password, role, phoneNumber, phone, profilePhoto} = formData;

  const payload = {
    name,
    email,
    password,
    role,
    phone: phone || phoneNumber,
    phoneNumber: phoneNumber || phone,
    profilePhoto: profilePhoto 
  };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (result.success && result.data?.accessToken) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });

    if (result.data?.refreshToken) {
      cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
  }

  return result;
};
