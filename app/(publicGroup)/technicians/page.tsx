import type { Metadata } from "next";
import { TechniciansPageClient } from "./_components/technicians-page-client";

export const metadata: Metadata = {
  title: "Technicians - FixItNow",
  description:
    "Browse and filter verified expert technicians for plumbing, electrical, cleaning, and more home services.",
};

export default function TechniciansPage() {
  return <TechniciansPageClient />;
}
