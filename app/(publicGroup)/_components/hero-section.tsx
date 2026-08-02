"use client";

import Link from "next/link";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/shared/container";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-40 -top-40 size-[500px] rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/5" />
        <div className="absolute -left-40 bottom-0 size-[400px] rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-600/5" />
        <div className="absolute left-1/2 top-1/4 size-[300px] -translate-x-1/2 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      <Container className="relative py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
            <Sparkles className="size-3.5" />
            Trusted by 10,000+ homeowners
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
            Find & Book{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Expert Technicians
            </span>{" "}
            Near You
          </h1>

          {/* Subtitle */}
          <p className="mb-10 text-lg text-neutral-600 dark:text-neutral-400 sm:text-xl">
            Connect with verified professionals for plumbing, electrical,
            cleaning, painting, and more. Get instant quotes and real-time
            tracking.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mb-8 flex max-w-xl items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg shadow-neutral-200/50 dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search services... (e.g., plumbing, AC repair)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
              />
            </div>
            <Button type="submit" size="lg" className="shrink-0">
              Search
            </Button>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>Popular:</span>
            {["Plumbing", "Electrical", "AC Repair", "Cleaning"].map((tag) => (
              <Link
                key={tag}
                href={`/services?search=${tag.toLowerCase()}`}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-700 dark:hover:text-blue-400"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link href="/services">
                Browse Services
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/register?role=technician">Become a Technician</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
