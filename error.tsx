"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-neutral-950">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
        Something went wrong!
      </h2>
      <p className="mb-6 max-w-md text-neutral-600 dark:text-neutral-400">
        We encountered an unexpected error. Please try again or contact support if the problem persists.
      </p>
      <Button onClick={reset} className="gap-2">
        <RefreshCw className="size-4" />
        Try Again
      </Button>
    </div>
  );
}