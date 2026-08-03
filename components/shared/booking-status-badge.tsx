import { cn } from "@/lib/utils";
import { BOOKING_STATUS_CONFIG } from "@/constants";
import type { BookingStatus } from "@/types";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = BOOKING_STATUS_CONFIG[status] ?? {
    label: status,
    color: "text-neutral-700 dark:text-neutral-400",
    bgColor: "bg-neutral-100 dark:bg-neutral-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
