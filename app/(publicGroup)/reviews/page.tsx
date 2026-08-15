import type { Metadata } from "next";
import { Star, Quote } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/format";

import { getAllReviewsAction } from "./_actions/reviewAction";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read real customer reviews from FixItNow users across Bangladesh.",
};

export default async function ReviewsPage() {
  const reviews = await getAllReviewsAction();
  
  // Calculate stats dynamically if there are reviews, otherwise fallback
  const total = reviews.length || 1;
  const average = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / total).toFixed(1)
    : "4.8";
    
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return {
      stars,
      count,
      pct: reviews.length > 0 ? Math.round((count / total) * 100) : 0,
    };
  });
  
  // Fallback data for empty state to keep the UI looking good
  const displayStats = {
    average: reviews.length > 0 ? Number(average) : 4.8,
    total: reviews.length > 0 ? total : 0,
    breakdown: reviews.length > 0 ? breakdown : [
      { stars: 5, count: 0, pct: 0 },
      { stars: 4, count: 0, pct: 0 },
      { stars: 3, count: 0, pct: 0 },
      { stars: 2, count: 0, pct: 0 },
      { stars: 1, count: 0, pct: 0 },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50 py-16 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <Container className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/40">
              <Star className="size-7 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
            Customer Reviews
          </h1>
          <p className="mx-auto max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            Real feedback from real customers across Bangladesh. See why thousands of homeowners
            trust FixItNow for their home service needs.
          </p>
        </Container>
      </section>

      {/* Overall Rating */}
      <section className="border-b border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
        <Container>
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            {/* Big number */}
            <div className="flex-shrink-0 text-center">
              <p className="text-7xl font-extrabold text-neutral-900 dark:text-white">
                {displayStats.average}
              </p>
              <StarRating rating={displayStats.average} size="lg" />
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Based on {displayStats.total.toLocaleString()} reviews
              </p>
            </div>

            {/* Breakdown */}
            <div className="w-full max-w-sm flex-1 space-y-2">
              {displayStats.breakdown.map(({ stars, count, pct }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-5 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {stars}
                  </span>
                  <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs text-neutral-500 dark:text-neutral-400">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              {[
                { label: "Would Recommend", value: "98%" },
                { label: "On-Time Arrival", value: "94%" },
                { label: "Quality of Work", value: "97%" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <p className="text-xl font-bold text-neutral-900 dark:text-white">{value}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <Container>
          <SectionHeading
            title="What Our Customers Say"
            subtitle="Verified reviews from completed bookings"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <div
                key={review.id || i}
                className="relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
              >
                <Quote className="absolute right-6 top-6 size-8 text-neutral-100 dark:text-neutral-800" />

                {/* Stars */}
                <StarRating rating={review.rating || 5} size="sm" className="mb-3" />

                {/* Comment */}
                <p className="mb-5 text-sm text-neutral-700 line-clamp-5 dark:text-neutral-300">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Service info */}
                <div className="mb-4 flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {typeof review.service === 'object' ? review.service?.name : review.service || "Service"}
                  </Badge>
                  {review.id && (
                    <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400">
                      ✓ Verified
                    </Badge>
                  )}
                </div>

                {/* Customer */}
                <div className="flex items-center gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <Avatar className="size-9">
                    <AvatarImage src={review.customer?.avatar || review.avatar} alt={review.customer?.name || review.customerName || "Customer"} />
                    <AvatarFallback>{getInitials(review.customer?.name || review.customerName || "Customer")}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {review.customer?.name || review.customerName || "Verified Customer"}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Served by {review.technician?.user?.name || review.technician?.name || "Technician"}
                    </p>
                  </div>
                  <p className="ml-auto shrink-0 text-xs text-neutral-400">
                    {new Date(review.createdAt || review.date || Date.now()).toLocaleDateString("en-BD", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="col-span-full py-12 text-center text-neutral-500">
                <p>No reviews available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
