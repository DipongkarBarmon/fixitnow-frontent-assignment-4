import type { Metadata } from "next";
import ContactPageClient from "./_components/contact-page-client";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with FixItNow support. We're here to help with any questions about our home service marketplace.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
