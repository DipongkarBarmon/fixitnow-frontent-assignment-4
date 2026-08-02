"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image || "/placeholder-service.jpg"}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {service.category && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 bg-white/90 text-neutral-900 backdrop-blur-sm dark:bg-neutral-900/90 dark:text-white"
          >
            {service.category.name}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white line-clamp-1">
          {service.name}
        </h3>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {service.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {service.averageRating.toFixed(1)}
            </span>
            <span>({service.totalReviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-4" />
            <span>{service.technicianCount} techs</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Starting from
            </span>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatCurrency(service.startingPrice)}
            </p>
          </div>
          <Button asChild size="sm" className="group/btn">
            <Link href={`/services/${service.id}`}>
              Book Now
              <ArrowRight className="ml-1 size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
