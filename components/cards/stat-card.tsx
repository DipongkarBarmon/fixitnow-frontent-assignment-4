import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  iconColor = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-100 dark:bg-blue-900/30",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-white p-5 transition-colors dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn("flex size-10 items-center justify-center rounded-lg", iconBg)}>
          <Icon className={cn("size-5", iconColor)} />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-neutral-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      </div>
    </div>
  );
}
