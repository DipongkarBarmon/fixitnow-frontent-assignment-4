"use client";

import Link from "next/link";
import { MapPin, Briefcase, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/shared/star-rating";
import { cn } from "@/lib/utils";
import { formatCurrency, getSafeAvatarUrl, getInitials } from "@/utils/format";
import type { TechnicianProfile } from "@/types";

interface TechnicianCardProps {
  technician: TechnicianProfile;
  className?: string;
}

export function TechnicianCard({ technician, className }: TechnicianCardProps) {
  const name = technician.user?.name || "Technician";
  const rawPhoto =
    technician.user?.profilePhoto ||
    technician.user?.avatar ||
    (technician as any).profilePhoto ||
    (technician as any).avatar;
  const avatar = getSafeAvatarUrl(rawPhoto, name);
  const rating = Number(technician.averageRating || 5.0);
  const totalReviews = Number(technician.totalReviews ?? technician.reviews?.length ?? 0);
  const location = technician.address || technician.location || "Dhaka, Bangladesh";
  const skills = Array.isArray(technician.skills) && technician.skills.length > 0
    ? technician.skills
    : ["General Maintenance"];
  const experience = Number(technician.experience || 3);
  const completedJobs = Number(technician.completedJobs || 0);
  const hourlyRate = Number(technician.hourlyRate || 500);
  const isVerified = Boolean(technician.isVerified || technician.user?.isVerified);
  const profileId = technician.id || technician.userId;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <Avatar className="size-16 rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-700">
            <AvatarImage src={avatar} alt={name} className="object-cover" />
            <AvatarFallback className="font-semibold text-neutral-700 dark:text-neutral-300">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          {isVerified && (
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
            <StarRating rating={rating} size="sm" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              ({totalReviews})
            </span>
          </div>
          {location && (
            <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              <MapPin className="size-3" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {skills.slice(0, 3).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-xs font-normal"
          >
            {skill}
          </Badge>
        ))}
        {skills.length > 3 && (
          <Badge variant="outline" className="text-xs font-normal">
            +{skills.length - 3}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1">
          <Briefcase className="size-3.5" />
          <span>{experience} yrs</span>
        </div>
        <span>•</span>
        <span>{completedJobs} jobs</span>
      </div>

      {/* Bottom */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            From
          </span>
          <p className="text-lg font-bold text-neutral-900 dark:text-white">
            {formatCurrency(hourlyRate)}
            <span className="text-xs font-normal text-neutral-500">/hr</span>
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/technicians/${profileId}`}>View Profile</Link>
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
