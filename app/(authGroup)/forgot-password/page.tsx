import type { Metadata } from "next";
import { ForgotPasswordForm } from "../_components/forgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password - FixItNow" };

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-50 dark:bg-neutral-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-1/2 -top-1/2 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-600/10" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
