"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI. If omitted, the default error card is shown. */
  fallback?: ReactNode;
  /** Called when an error is caught. Use for logging/monitoring. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Label shown on the reset button. Defaults to "Try Again". */
  resetLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Class component — required because React error boundaries must be classes
// ─────────────────────────────────────────────────────────────────────────────

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
    this.props.onError?.(error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    const { error } = this.state;

    return (
      <DefaultErrorFallback
        error={error}
        reset={this.reset}
        resetLabel={this.props.resetLabel}
      />
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Default fallback UI
// ─────────────────────────────────────────────────────────────────────────────

interface DefaultErrorFallbackProps {
  error: Error | null;
  reset: () => void;
  resetLabel?: string;
}

function DefaultErrorFallback({
  error,
  reset,
  resetLabel = "Try Again",
}: DefaultErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/30 dark:bg-red-950/20">
      {/* Icon */}
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
        <AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
      </div>

      {/* Heading */}
      <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-white">
        Something went wrong
      </h2>

      {/* Message */}
      <p className="mb-1 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
        An unexpected error occurred. Please try again or go back to the home
        page.
      </p>

      {/* Error detail (development only) */}
      {process.env.NODE_ENV === "development" && error?.message && (
        <code className="mb-5 mt-3 block max-w-lg rounded-md bg-red-100 px-3 py-2 text-left text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
          {error.message}
        </code>
      )}

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <Home className="mr-2 size-4" />
          Go Back
        </Button>
        <Button size="sm" onClick={reset}>
          <RefreshCw className="mr-2 size-4" />
          {resetLabel}
        </Button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
