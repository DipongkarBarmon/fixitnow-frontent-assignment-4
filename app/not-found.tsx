"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-neutral-950">
      <div className="mb-6">
        <span className="text-8xl font-extrabold text-neutral-200 dark:text-neutral-800">404</span>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="mb-8 max-w-md text-neutral-600 dark:text-neutral-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
          Go Back
        </Button>
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="size-4" />
            Home Page
          </Link>
        </Button>
      </div>
    </div>
  );
}
