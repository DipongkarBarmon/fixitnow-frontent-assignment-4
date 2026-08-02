import type { Metadata } from "next";
import { RegisterForm } from "../_components/registerForm";

export const metadata: Metadata = { title: "Register - FixItNow", description: "Create your FixItNow account." };

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-50 dark:bg-neutral-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-1/2 -top-1/2 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />
        <div className="absolute -left-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <RegisterForm />
      </div>
    </div>
  );
}
