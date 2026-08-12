import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import BookingClient from "./_components/booking-client";

export const metadata: Metadata = {
  title: "Book a Service | FixItNow",
  description: "Book a qualified technician for your home service needs.",
};

export default function BookingPage() {
  return (
    <section className="py-12 bg-neutral-50 min-h-screen dark:bg-neutral-950">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Book a Service
            </h1>
            <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
              Select a technician and schedule a time that works for you.
            </p>
          </div>
          
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-10">
            <Suspense
              fallback={
                <div className="flex animate-pulse flex-col items-center justify-center py-20">
                  <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />
                  <p className="text-neutral-500">Loading booking flow...</p>
                </div>
              }
            >
              <BookingClient />
            </Suspense>
          </div>
        </div>
      </Container>
    </section>
  );
}
