import type { Metadata } from "next";
import { DashboardServicesClient } from "./_components/dashboard-services-client";
import { getAllServiceAction } from "@/app/(publicGroup)/_actions/serviceAction";

export const metadata: Metadata = {
  title: "Services | Dashboard",
  description: "Browse and book professional home services directly from your dashboard.",
};

export default async function DashboardServicesPage() {
  const result = await getAllServiceAction();
  let initialServices = result.success && result.data ? result.data : [];
  if (initialServices && !Array.isArray(initialServices) && Array.isArray((initialServices as any).data)) {
    initialServices = (initialServices as any).data;
  }

  return <DashboardServicesClient initialServices={initialServices as any[]} />;
}
