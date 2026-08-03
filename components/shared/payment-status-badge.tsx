import { cn } from "@/lib/utils";
import { PAYMENT_STATUS_CONFIG } from "@/constants";
import type { PaymentStatus } from "@/types";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = PAYMENT_STATUS_CONFIG[status] ?? {
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
