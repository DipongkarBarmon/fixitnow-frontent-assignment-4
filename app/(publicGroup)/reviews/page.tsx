import type { Metadata } from "next";
import { Star, Quote } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/format";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read real customer reviews from FixItNow users across Bangladesh.",
};

const overallStats = {
  average: 4.8,
  total: 12_450,
  breakdown: [
    { stars: 5, count: 8900, pct: 71 },
    { stars: 4, count: 2800, pct: 23 },
    { stars: 3, count: 550, pct: 4 },
    { stars: 2, count: 140, pct: 1 },
    { stars: 1, count: 60, pct: 1 },
  ],
};

const reviews = [
  {
    id: "1",
    customerName: "Farhan Ahmed",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan",
    rating: 5,
    service: "Plumbing Repair",
    technician: "Karim Ahmed",
    date: "2025-07-28",
    comment:
      "Karim arrived exactly on time and fixed our leaking pipe within an hour. Very professional, explained everything he was doing, and left the area clean. Highly recommend!",
    verified: true,
  },
  {
    id: "2",
    customerName: "Nasrin Sultana",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin",
    rating: 5,
    service: "Deep House Cleaning",
    technician: "Nasir Khan",
    date: "2025-07-25",
    comment:
      "Our apartment was spotless after the cleaning team left. They were thorough, professional, and finished faster than expected. Will definitely book again for monthly cleaning!",
    verified: true,
  },
  {
    id: "3",
    customerName: "Rajib Hossain",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajib",
    rating: 5,
    service: "Electrical Wiring",
    technician: "Rafiq Islam",
    date: "2025-07-20",
    comment:
      "Rafiq upgraded our entire home wiring system over two days. Excellent work, very knowledgeable, and the pricing was transparent with no surprises. 10/10.",
    verified: true,
  },
  {
    id: "4",
    customerName: "Mithila Akter",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mithila",
    rating: 4,
    service: "AC Maintenance",
    technician: "Sumon Das",
    date: "2025-07-18",
    comment:
      "Good service overall. Sumon serviced all 3 ACs efficiently. Just a minor delay in arrival (about 30 mins) but he communicated beforehand. The ACs are running much better now.",
    verified: true,
  },
  {
    id: "5",
    customerName: "Arif Khan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arif",
    rating: 5,
    service: "Interior Painting",
    technician: "Anwar Hossain",
    date: "2025-07-15",
    comment:
      "Anwar and his team painted our 3-bedroom apartment beautifully. Finished in 2 days as promised. The wall prep was excellent, and the color matching was perfect. Great value!",
    verified: true,
  },
  {
    id: "6",
    customerName: "Rima Begum",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rima",
    rating: 5,
    service: "Furniture Assembly",
    technician: "Jamal Uddin",
    date: "2025-07-10",
    comment:
      "Jamal assembled our new bedroom furniture set (6 pieces) in just 3 hours. Very skilled, brought all his own tools, and didn't leave a scratch on the floor. Outstanding!",
    verified: true,
  },
  {
    id: "7",
    customerName: "Shakil Ahmed",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shakil",
    rating: 4,
    service: "Plumbing Repair",
    technician: "Karim Ahmed",
    date: "2025-07-05",
    comment:
      "Fixed the bathroom leak quickly. Karim is knowledgeable and friendly. The only reason I'm giving 4 stars is the booking app showed one price but the final cost was slightly higher due to parts.",
    verified: true,
  },
  {
    id: "8",
    customerName: "Lila Chowdhury",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lila",
    rating: 5,
    service: "Deep Cleaning",
    technician: "Nasir Khan",
    date: "2025-07-01",
    comment:
      "Best cleaning service I've ever used. Our move-out cleaning was so thorough that we got our full security deposit back from the landlord. Would recommend to anyone moving out!",
    verified: true,
  },
  {
    id: "9",
    customerName: "Tanvir Hassan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir",
    rating: 5,
    service: "Electrical",
    technician: "Rafiq Islam",
    date: "2025-06-28",
    comment:
      "Had a power outage issue in the kitchen. Rafiq diagnosed and fixed it in 45 minutes. Very systematic approach. This is how a professional should work!",
    verified: true,
  },
];

export default function ReviewsPage() {
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
                {overallStats.average}
              </p>
              <StarRating rating={overallStats.average} size="lg" />
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Based on {overallStats.total.toLocaleString()} reviews
              </p>
            </div>

            {/* Breakdown */}
            <div className="w-full max-w-sm flex-1 space-y-2">
              {overallStats.breakdown.map(({ stars, count, pct }) => (
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
            {reviews.map((review) => (
              <div
                key={review.id}
                className="relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
              >
                <Quote className="absolute right-6 top-6 size-8 text-neutral-100 dark:text-neutral-800" />

                {/* Stars */}
                <StarRating rating={review.rating} size="sm" className="mb-3" />

                {/* Comment */}
                <p className="mb-5 text-sm text-neutral-700 line-clamp-5 dark:text-neutral-300">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Service info */}
                <div className="mb-4 flex gap-2">
                  <Badge variant="secondary" className="text-xs">{review.service}</Badge>
                  {review.verified && (
                    <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400">
                      ✓ Verified
                    </Badge>
                  )}
                </div>

                {/* Customer */}
                <div className="flex items-center gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <Avatar className="size-9">
                    <AvatarImage src={review.avatar} alt={review.customerName} />
                    <AvatarFallback>{getInitials(review.customerName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {review.customerName}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Served by {review.technician}
                    </p>
                  </div>
                  <p className="ml-auto shrink-0 text-xs text-neutral-400">
                    {new Date(review.date).toLocaleDateString("en-BD", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
