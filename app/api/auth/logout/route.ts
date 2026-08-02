import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/api-client";

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
