import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/api-client";

const BACKEND_URL = process.env.BACKEND_API_URL;

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ success: false, data: null });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({ success: true, data: data.data });
    }

    return NextResponse.json({ success: false, data: null });
  } catch {
    return NextResponse.json({ success: false, data: null });
  }
}
