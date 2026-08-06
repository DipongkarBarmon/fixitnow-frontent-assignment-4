import type { Metadata } from "next";
import { CreateCategoryForm } from "@/app/(dashboardGroup)/admin-dashboard/_components/createCategoryForm";

export const metadata: Metadata = {
  title: "Create Category | Admin Dashboard - FixItNow",
  description: "Create and publish a new service category for the FixItNow platform.",
};

export default function CreateCategoryPage() {
  return <CreateCategoryForm />;
}
