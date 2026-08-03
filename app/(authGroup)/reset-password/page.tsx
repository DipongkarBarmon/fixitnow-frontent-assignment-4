import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "../_components/resetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password - FixItNow",
  description: "Set a new password for your FixItNow account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-50 dark:bg-neutral-950">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/2 -top-1/2 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute -left-1/4 bottom-0 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/10" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Suspense needed for useSearchParams inside ResetPasswordForm */}
        <Suspense
          fallback={
            <div className="h-96 w-full max-w-md animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
