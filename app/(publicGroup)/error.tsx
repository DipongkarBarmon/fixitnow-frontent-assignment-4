"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export default function PublicError({
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
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
        Something went wrong!
      </h2>
      <p className="mb-6 max-w-md text-neutral-600 dark:text-neutral-400">
        We encountered an unexpected error. Please try again or contact support
        if the problem persists.
      </p>
      <Button onClick={reset} className="gap-2">
        <RefreshCw className="size-4" />
        Try Again
      </Button>
    </Container>
  );
}
