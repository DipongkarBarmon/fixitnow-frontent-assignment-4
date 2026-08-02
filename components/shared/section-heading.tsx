import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 space-y-2",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
