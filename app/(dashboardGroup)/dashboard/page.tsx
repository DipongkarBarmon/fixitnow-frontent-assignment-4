"use client";

import { Calendar, CreditCard, Clock, CheckCircle2, Star, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/cards/stat-card";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { useAuth } from "@/providers/auth-provider";
import { useBookings } from "@/hooks";
import { formatDate, formatCurrency } from "@/utils/format";

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <Skeleton className="mb-3 h-10 w-10 rounded-lg" />
      <Skeleton className="mb-1 h-7 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useBookings({ limit: 5 });

  const bookings = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  // Use a broader fetch to count reviews – approximate from existing data
  const reviewCount = bookings.filter((b) => b.review).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="mt-1 text-blue-100">
          Here&apos;s what&apos;s happening with your bookings today.
        </p>
        <Button asChild variant="secondary" className="mt-4 gap-2 text-blue-700">
          <Link href="/services">
            Book a Service <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={Calendar}
              label="Total Bookings"
              value={String(total)}
              iconColor="text-blue-600"
              iconBg="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={String(completed)}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100 dark:bg-emerald-900/30"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={String(pending)}
              iconColor="text-amber-600"
              iconBg="bg-amber-100 dark:bg-amber-900/30"
            />
            <StatCard
              icon={Star}
              label="Reviews Given"
              value={String(reviewCount)}
              iconColor="text-purple-600"
              iconBg="bg-purple-100 dark:bg-purple-900/30"
            />
          </>
        )}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/bookings">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-4 dark:border-neutral-800">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              <AlertTriangle className="size-4 shrink-0" />
              Could not load bookings. Please refresh.
            </div>
          ) : bookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              No bookings yet.{" "}
              <Link href="/services" className="font-medium text-blue-600 hover:underline">
                Book your first service →
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/dashboard/bookings/${booking.id}`}
                  className="flex items-center justify-between rounded-lg border border-neutral-100 p-4 transition-colors hover:border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-neutral-900 dark:text-white">
                      {booking.service?.name ?? "Service"}
                    </p>
                    <p className="truncate text-sm text-neutral-500">
                      {booking.technician?.user?.name ?? "Technician"} •{" "}
                      {formatDate(booking.bookingDate)} •{" "}
                      {formatCurrency(booking.totalPrice)}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} className="ml-3 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: "/dashboard/bookings", Icon: Calendar, color: "blue", title: "My Bookings", desc: "View and manage your bookings" },
          { href: "/dashboard/payments", Icon: CreditCard, color: "emerald", title: "Payments", desc: "View your payment history" },
          { href: "/dashboard/reviews", Icon: Star, color: "purple", title: "Reviews", desc: "Leave reviews for services" },
        ].map(({ href, Icon, color, title, desc }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-xl border border-neutral-200 p-5 transition-colors hover:border-${color}-300 hover:bg-${color}-50/50 dark:border-neutral-800 dark:hover:border-${color}-800 dark:hover:bg-${color}-950/20`}
          >
            <Icon className={`mb-3 size-8 text-${color}-600`} />
            <h3 className="font-semibold text-neutral-900 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm text-neutral-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}