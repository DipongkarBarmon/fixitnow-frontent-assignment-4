"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/shared/star-rating";
import { EmptyState } from "@/components/shared/empty-state";
import { Star } from "lucide-react";

const reviews = [
  { id: "1", service: "Plumbing Repair", technician: "Karim Ahmed", rating: 5, comment: "Excellent service! Fixed the leak quickly and professionally.", date: "Jul 29, 2026" },
  { id: "2", service: "Electrical Wiring", technician: "Rafiq Islam", rating: 4, comment: "Good work overall. Arrived on time and completed the job efficiently.", date: "Jul 26, 2026" },
];

export default function ReviewsPage() {
  if (reviews.length === 0) {
    return <EmptyState icon={Star} title="No reviews yet" description="Complete a booking to leave a review" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">My Reviews</h1>
        <p className="text-neutral-500">Reviews you&apos;ve left for services</p>
      </div>
      <div className="space-y-4">
        {reviews.map((r) => (
          <Card key={r.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{r.service}</CardTitle>
                <span className="text-sm text-neutral-500">{r.date}</span>
              </div>
              <p className="text-sm text-neutral-500">Technician: {r.technician}</p>
            </CardHeader>
            <CardContent>
              <StarRating rating={r.rating} size="sm" className="mb-2" />
              <p className="text-neutral-600 dark:text-neutral-400">{r.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
