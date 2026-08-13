"use client";

import Link from "next/link";
import { Star, Users, ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency, formatRating } from "@/utils/format";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900 dark:hover:shadow-blue-900/20",
        className
      )}
    >
      {/* Top Gradient Highlight on Hover */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-6 space-y-4">
        {/* Header: Title and Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Wrench className="size-5" />
            </div>
            <h3 className="font-bold text-lg leading-tight text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 line-clamp-2">
              {service.name || (service as any).title || "Service"}
            </h3>
          </div>
          {service.category && (
            <Badge
              variant="secondary"
              className="shrink-0 bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {service.category.name}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="flex-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
          {service.description || "No description provided for this service."}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <Star className="size-3.5 fill-amber-500 text-amber-500" />
            <span>{formatRating(service.averageRating)}</span>
            <span className="font-normal opacity-70">({service.totalReviews})</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-1 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            <Users className="size-3.5" />
            <span>{service.technicianCount} techs</span>
          </div>
        </div>

        {/* Footer: Price & Action */}
        <div className="mt-auto flex items-end justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
              Starting from
            </span>
            <p className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {formatCurrency(service.startingPrice || (service as any).price || 0)}
            </p>
          </div>
          <Button asChild className="group/btn rounded-xl shadow-sm transition-all hover:shadow-md">
            <Link href={`/booking?serviceId=${service.id}`}>
              Book Now
              <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
      </div>
      
      <div className="space-y-2 py-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>

      <div className="mt-auto flex items-end justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-28" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}
