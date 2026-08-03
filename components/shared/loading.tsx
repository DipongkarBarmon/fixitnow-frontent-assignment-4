import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ─────────────────────────────────────────────────────────────────────────────
// Spinner
// ─────────────────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizes = {
  sm: "size-4 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-4",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-neutral-200 border-t-blue-600 dark:border-neutral-700 dark:border-t-blue-400",
        spinnerSizes[size],
        className
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline loading indicator
// ─────────────────────────────────────────────────────────────────────────────

interface LoadingProps {
  text?: string;
  className?: string;
  size?: SpinnerProps["size"];
}

/**
 * Inline loading state — use inside cards, sections, or dialogs.
 */
export function Loading({ text = "Loading…", className, size = "md" }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12",
        className
      )}
    >
      <Spinner size={size} />
      {text && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{text}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Full-page loading overlay
// ─────────────────────────────────────────────────────────────────────────────

interface PageLoadingProps {
  text?: string;
}

/**
 * Full-viewport loading screen — use in `loading.tsx` files.
 */
export function PageLoading({ text = "Loading…" }: PageLoadingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-neutral-950">
      {/* Animated logo mark */}
      <div className="relative flex size-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
        <span className="text-2xl font-extrabold text-white">F</span>
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-emerald-400">
          <span className="size-2 animate-ping rounded-full bg-emerald-300" />
        </span>
      </div>
      <Spinner size="lg" />
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {text}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton Variants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Skeleton for a service / technician card.
 */
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton grid of N cards — for listing pages.
 */
interface CardGridSkeletonProps {
  count?: number;
  columns?: number;
  className?: string;
}

export function CardGridSkeleton({
  count = 6,
  columns = 3,
  className,
}: CardGridSkeletonProps) {
  const gridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid gap-6",
        gridCols[columns] ?? gridCols[3],
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for a table row.
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-neutral-100 py-3 dark:border-neutral-800">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

/**
 * Skeleton for a full table.
 */
export function TableSkeleton({
  rows = 8,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-700">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 bg-neutral-200 dark:bg-neutral-700" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

/**
 * Skeleton for a Stat Card.
 */
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <Skeleton className="size-10 rounded-lg" />
        <Skeleton className="h-4 w-12 rounded" />
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

