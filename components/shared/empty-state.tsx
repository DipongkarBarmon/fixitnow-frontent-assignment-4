import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
        <Icon className="size-8 text-neutral-400 dark:text-neutral-500" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
