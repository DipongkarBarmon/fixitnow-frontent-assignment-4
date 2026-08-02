"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeMap = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-6",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.floor(displayRating);
        const isHalf =
          !isFilled &&
          starValue === Math.ceil(displayRating) &&
          displayRating % 1 >= 0.25;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "transition-colors",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizeMap[size],
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : isHalf
                    ? "fill-amber-400/50 text-amber-400"
                    : "fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
