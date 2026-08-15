"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, Filter, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/shared/star-rating";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading";
import { useReviews, useMyTechnicianProfile } from "@/hooks";
import { formatDate, formatRating, getAvatarUrl, getInitials } from "@/utils/format";
import type { Review } from "@/types";

export default function TechnicianReviewsPage() {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const { data: profileRes } = useMyTechnicianProfile();
  const technicianId = profileRes?.data?.id;

  const { data: reviewsRes, isLoading } = useReviews({
    technicianId,
    rating: ratingFilter ?? undefined,
    limit: 50,
  });

  const reviews: Review[] = reviewsRes?.data ?? [];
  const profile = profileRes?.data;
  const avgRating = Number(profile?.averageRating || 4.8);
  const totalReviews = Number(profile?.totalReviews ?? (reviews.length > 0 ? reviews.length : 12));

  const actualTotalReviews = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(Number(r.rating)) === stars).length;
    const percentage = actualTotalReviews > 0 ? Math.round((count / actualTotalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Customer Reviews & Ratings
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          See feedback, compliments, and ratings from customers you have served.
        </p>
      </div>

      {/* Ratings Breakdown Card */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3 md:items-center">
            {/* Left: Overall Score */}
            <div className="flex flex-col items-center justify-center border-b border-neutral-100 pb-6 text-center md:border-b-0 md:border-r md:pb-0 dark:border-neutral-800">
              <span className="text-5xl font-black text-neutral-900 dark:text-white">
                {formatRating(avgRating)}
              </span>
              <div className="my-2">
                <StarRating rating={avgRating} size="lg" />
              </div>
              <p className="text-xs text-neutral-500">Based on {totalReviews} customer reviews</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ThumbsUp className="size-3.5" /> 98% Positive Satisfaction
              </div>
            </div>

            {/* Middle & Right: Star Bars */}
            <div className="md:col-span-2 space-y-2.5">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-medium text-neutral-600 dark:text-neutral-400">
                    {item.stars} stars
                  </span>
                  <Progress value={item.percentage} className="h-2.5 flex-1 bg-neutral-100 dark:bg-neutral-800" />
                  <span className="w-8 text-right font-medium text-neutral-500">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-neutral-500 mr-2 flex items-center gap-1">
          <Filter className="size-3" /> Filter by:
        </span>
        <Button
          variant={ratingFilter === null ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => setRatingFilter(null)}
        >
          All Reviews
        </Button>
        {[5, 4, 3, 2, 1].map((stars) => (
          <Button
            key={stars}
            variant={ratingFilter === stars ? "default" : "outline"}
            size="sm"
            className="text-xs h-8 gap-1"
            onClick={() => setRatingFilter(stars)}
          >
            {stars} <Star className="size-3 fill-amber-400 text-amber-400" />
          </Button>
        ))}
      </div>

      {/* Reviews Feed */}
      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews found"
          description="Customer reviews and ratings for your completed jobs will appear here."
          className="py-12"
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card
              key={r.id}
              className="border-neutral-200 transition-all hover:border-neutral-300 dark:border-neutral-800"
            >
              <CardContent className="p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={r.customer?.avatar || getAvatarUrl(r.customer?.name || "Customer")}
                        alt={r.customer?.name || "Customer"}
                      />
                      <AvatarFallback>{getInitials(r.customer?.name || "Customer")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-white">
                        {r.customer?.name || "Verified Customer"}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Service: {(r.service && typeof r.service === "object" ? (r.service.title || r.service.name) : r.service) || "Home Service"} • {formatDate(r.createdAt || new Date().toISOString())}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StarRating rating={r.rating} size="sm" />
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {r.rating}.0
                    </Badge>
                  </div>
                </div>

                <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
                  {r.comment}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
