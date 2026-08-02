import type { Metadata } from "next";
import { ServicesPageClient } from "./_components/services-page-client";

export const metadata: Metadata = {
  title: "Services",
  description: "Browse all professional home services available on FixItNow.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
