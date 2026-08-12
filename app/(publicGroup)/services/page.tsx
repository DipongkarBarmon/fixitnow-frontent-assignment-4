import type { Metadata } from "next";
import { ServicesPageClient } from "./_components/services-page-client";
import { getAllServiceAction } from "../_actions/serviceAction";

export const metadata: Metadata = {
  title: "Services",
  description: "Browse all professional home services available on FixItNow.",
};

export default async function ServicesPage() {
  const result = await getAllServiceAction();
  let initialServices = result.success && result.data ? result.data : [];
  if (initialServices && !Array.isArray(initialServices) && Array.isArray((initialServices as any).data)) {
    initialServices = (initialServices as any).data;
  }

  return <ServicesPageClient initialServices={initialServices as any[]} />;
}
