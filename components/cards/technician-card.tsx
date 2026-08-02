"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/shared/star-rating";
import { cn } from "@/lib/utils";
import { formatCurrency, getAvatarUrl } from "@/utils/format";
import type { TechnicianProfile } from "@/types";

interface TechnicianCardProps {
  technician: TechnicianProfile;
  className?: string;
}

export function TechnicianCard({ technician, className }: TechnicianCardProps) {
  const name = technician.user?.name || "Technician";
  const avatar = technician.user?.avatar || getAvatarUrl(name);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <Image
            src={avatar}
            alt={name}
            width={64}
            height={64}
            className="size-16 rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-700"
          />
          {technician.isVerified && (
            <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 size-5 fill-blue-500 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <StarRating rating={technician.averageRating} size="sm" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              ({technician.totalReviews})
            </span>
          </div>
          {technician.location && (
            <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              <MapPin className="size-3" />
              <span className="truncate">{technician.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {technician.skills.slice(0, 3).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-xs font-normal"
          >
            {skill}
          </Badge>
        ))}
        {technician.skills.length > 3 && (
          <Badge variant="outline" className="text-xs font-normal">
            +{technician.skills.length - 3}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1">
          <Briefcase className="size-3.5" />
          <span>{technician.experience} yrs</span>
        </div>
        <span>•</span>
        <span>{technician.completedJobs} jobs</span>
      </div>

      {/* Bottom */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            From
          </span>
          <p className="text-lg font-bold text-neutral-900 dark:text-white">
            {formatCurrency(technician.hourlyRate)}
            <span className="text-xs font-normal text-neutral-500">/hr</span>
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/technicians/${technician.id}`}>View Profile</Link>
        </Button>
      </div>
    </div>
  );
}

export function TechnicianCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="mt-4 flex items-center justify-between pt-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}
