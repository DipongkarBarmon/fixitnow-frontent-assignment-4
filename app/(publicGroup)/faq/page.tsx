import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about FixItNow — bookings, payments, technicians, and more.",
};

const faqCategories = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is FixItNow?",
        a: "FixItNow is Bangladesh's leading home service marketplace that connects homeowners with verified, skilled technicians for plumbing, electrical, cleaning, painting, and many other home services.",
      },
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the top navigation, choose whether you're a customer or technician, fill in your details, and your account will be ready in minutes.",
      },
      {
        q: "Is FixItNow available in my city?",
        a: "We currently operate in Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barishal, Comilla, and Narayanganj. We're expanding to new cities regularly.",
      },
      {
        q: "How do I search for a service?",
        a: "Use the search bar on the homepage or browse by category. You can filter results by price, rating, location, and technician experience.",
      },
    ],
  },
  {
    category: "Bookings",
    items: [
      {
        q: "How do I book a service?",
        a: "Browse services, select one you need, choose an available technician, pick a date and time slot, add any notes, and confirm your booking. You'll receive a confirmation email immediately.",
      },
      {
        q: "Can I reschedule or cancel a booking?",
        a: "Yes. Go to your dashboard → My Bookings, find the booking, and use the Reschedule or Cancel option. Cancellations made 24+ hours before the appointment are free of charge.",
      },
      {
        q: "What happens if a technician doesn't show up?",
        a: "This is rare, but if it happens, contact our support immediately. We'll arrange an alternative technician at no extra cost or issue a full refund.",
      },
      {
        q: "How far in advance can I book?",
        a: "You can book up to 30 days in advance. For same-day bookings, availability depends on the technician's schedule.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept credit/debit cards, bKash, Nagad, Rocket, and SSLCommerz. All payments are processed securely through our encrypted payment gateway.",
      },
      {
        q: "When will I be charged?",
        a: "You're charged after the service is completed and you confirm satisfaction. For large jobs, a deposit may be required at booking.",
      },
      {
        q: "How do I get a refund?",
        a: "Refunds are processed within 3–5 business days for cancelled bookings. For disputed services, contact support within 48 hours of service completion.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use bank-grade SSL encryption and never store full card details on our servers. All payments are processed through certified payment gateways.",
      },
    ],
  },
  {
    category: "Technicians",
    items: [
      {
        q: "How are technicians verified?",
        a: "Every technician goes through NID verification, background checks, skill assessments, and reference verification before being listed on our platform.",
      },
      {
        q: "How are technicians rated?",
        a: "After each completed service, customers can leave a star rating (1–5) and a written review. Only verified bookings can leave reviews.",
      },
      {
        q: "Can I request a specific technician?",
        a: "Yes! If you've worked with a technician before and were happy with their service, you can directly book them again from their profile.",
      },
      {
        q: "What if I'm unhappy with the service quality?",
        a: "We stand behind every service. Contact support within 48 hours. We'll investigate and either arrange a free redo or issue a refund.",
      },
    ],
  },
  {
    category: "For Technicians",
    items: [
      {
        q: "How do I join as a technician?",
        a: "Register with the 'Technician' role, complete your profile with skills and certifications, submit verification documents, and our team will review within 2–3 business days.",
      },
      {
        q: "How do I get paid?",
        a: "Earnings are transferred to your bKash, bank account, or mobile banking within 24 hours of service completion. There are no delays or holds.",
      },
      {
        q: "What is FixItNow's commission?",
        a: "We charge a 10% platform fee per completed booking. There are no monthly fees, subscription charges, or hidden deductions.",
      },
      {
        q: "Can I set my own availability?",
        a: "Yes. From your technician dashboard, you can set daily availability, block dates, define working hours, and manage your schedule completely.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-16 dark:from-neutral-950 dark:to-neutral-900">
        <Container className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/40">
              <HelpCircle className="size-7 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            Everything you need to know about FixItNow. Can&apos;t find the answer you&apos;re
            looking for? Reach out to our support team.
          </p>
        </Container>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10">
            {faqCategories.map(({ category, items }) => (
              <div key={category}>
                <div className="mb-4 flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {category}
                  </Badge>
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {items.map(({ q, a }, i) => (
                    <AccordionItem
                      key={i}
                      value={`${category}-${i}`}
                      className="rounded-xl border border-neutral-200 bg-white px-5 dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <AccordionTrigger className="text-left font-medium text-neutral-900 hover:no-underline dark:text-white">
                        {q}
                      </AccordionTrigger>
                      <AccordionContent className="text-neutral-600 dark:text-neutral-400">
                        {a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Still have questions? */}
          <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
            <h2 className="mb-3 text-2xl font-bold">Still have questions?</h2>
            <p className="mb-6 text-blue-100">
              Our support team is available Saturday through Thursday, 9am to 6pm.
            </p>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href="/contact">
                Contact Support <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
