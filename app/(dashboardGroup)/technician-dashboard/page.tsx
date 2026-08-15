"use client";

import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
  Wrench,
  ArrowRight,
  User,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/cards/stat-card";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCardSkeleton, CardSkeleton } from "@/components/shared/loading";
import { formatCurrency, formatDate, formatRating } from "@/utils/format";
import { useAuth } from "@/providers/auth-provider";
import {
  useBookings,
  useMyTechnicianProfile,
  useUpdateBookingStatus,
} from "@/hooks";
import type { Booking } from "@/types";

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const { data: profileRes, isLoading: profileLoading } = useMyTechnicianProfile();
  const { data: bookingsRes, isLoading: bookingsLoading } = useBookings({ limit: 1000 });
  const updateStatusMutation = useUpdateBookingStatus();

  const profile = profileRes?.data;
  const rawData = bookingsRes?.data;
  const bookings: Booking[] = Array.isArray(rawData) ? rawData : (Array.isArray((rawData as any)?.data) ? (rawData as any).data : []);

  // Calculate live statistics
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const acceptedBookings = bookings.filter((b) => b.status === "ACCEPTED");
  const inProgressBookings = bookings.filter((b) => b.status === "IN_PROGRESS");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");

  const upcomingJobs = bookings.filter(
    (b) => b.status === "ACCEPTED" || b.status === "PENDING" || b.status === "IN_PROGRESS"
  );

  const totalEarnings = completedBookings.reduce((sum, b) => sum + (Number(b.totalPrice || b.price) || 0), 0);
  
  // Calculate this month's earnings
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyEarnings = completedBookings.reduce((sum, b) => {
    const d = new Date(b.createdAt);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      return sum + (Number(b.totalPrice || b.price) || 0);
    }
    return sum;
  }, 0);

  const avgRating = Number(profile?.averageRating || 0);
  const totalCompleted = profile?.completedJobs ?? completedBookings.length;

  const handleStatusChange = async (bookingId: string, status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED") => {
    try {
      await updateStatusMutation.mutateAsync({ id: bookingId, status });
      toast.success(`Booking marked as ${status.replace("_", " ")}`);
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  const isLoading = profileLoading || bookingsLoading;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                Technician Portal
              </span>
              {profile?.isVerified && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-medium text-emerald-200 backdrop-blur-sm">
                  <ShieldCheck className="size-3.5" /> Verified Pro
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {user?.name || "Technician"}! 🔧
            </h1>
            <p className="mt-1 text-emerald-100">
              Manage your upcoming service orders, adjust your schedule, and track your revenue.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="secondary"
              className="bg-white font-semibold text-emerald-800 shadow hover:bg-neutral-100"
            >
              <Link href="/technician-dashboard/bookings">View All Bookings</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <Link href="/technician-dashboard/availability">Edit Schedule</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={TrendingUp}
            label="Monthly Revenue"
            value={formatCurrency(monthlyEarnings)}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100 dark:bg-emerald-900/30"
            trend={{ value: 14, isPositive: true }}
          />
          <StatCard
            icon={Calendar}
            label="Active Jobs"
            value={upcomingJobs.length.toString()}
            iconColor="text-blue-600"
            iconBg="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            icon={Clock}
            label="Pending Requests"
            value={pendingBookings.length.toString()}
            iconColor="text-amber-600"
            iconBg="bg-amber-100 dark:bg-amber-900/30"
          />
          <StatCard
            icon={Star}
            label="Customer Rating"
            value={formatRating(avgRating)}
            iconColor="text-purple-600"
            iconBg="bg-purple-100 dark:bg-purple-900/30"
          />
        </div>
      )}

      {/* Quick Actions Shortcuts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/technician-dashboard/bookings"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Bookings</p>
              <p className="text-xs text-neutral-500">Accept & track jobs</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/technician-dashboard/availability"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-emerald-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Availability</p>
              <p className="text-xs text-neutral-500">Calendar & slots</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/technician-dashboard/services"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-amber-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
              <Wrench className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">My Services</p>
              <p className="text-xs text-neutral-500">Manage catalog</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/technician-dashboard/earnings"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-purple-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Earnings</p>
              <p className="text-xs text-neutral-500">Payout history</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Upcoming & Active Jobs Section */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Upcoming & Active Jobs</CardTitle>
            <CardDescription>
              Service requests requiring your attention or scheduled for today
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/technician-dashboard/bookings">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : upcomingJobs.length === 0 ? (
            <EmptyState
              title="No upcoming jobs scheduled"
              description="New booking requests from customers will appear here."
              actionLabel="View All Bookings"
              actionHref="/technician-dashboard/bookings"
              className="py-10"
            />
          ) : (
            <div className="space-y-3">
              {upcomingJobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 transition-colors hover:bg-neutral-50 sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {job.service?.title || job.service?.name || "Home Service"}
                      </p>
                      <BookingStatusBadge status={job.status} />
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Customer:{" "}
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {job.customer?.name || "Customer"}
                      </span>{" "}
                      • {formatDate(job.bookingDate || job.createdAt)}
                      {job.timeSlot ? ` at ${job.timeSlot}` : ""}
                    </p>
                    {job.notes && (
                      <p className="text-xs italic text-neutral-400">Note: {job.notes}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(Number(job.totalPrice || job.price || 0))}
                    </span>

                    {/* Quick action buttons according to status */}
                    {job.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => handleStatusChange(job.id, "ACCEPTED")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => handleStatusChange(job.id, "DECLINED")}
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {job.status === "ACCEPTED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900 dark:text-purple-300 dark:hover:bg-purple-950"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleStatusChange(job.id, "IN_PROGRESS")}
                      >
                        Mark In Progress
                      </Button>
                    )}

                    {job.status === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleStatusChange(job.id, "COMPLETED")}
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secondary Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={CheckCircle2}
          label="Total Completed Jobs"
          value={totalCompleted.toString()}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          icon={CreditCard}
          label="Total Lifetime Earnings"
          value={formatCurrency(totalEarnings)}
          iconColor="text-blue-600"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={User}
          label="Experience Level"
          value={`${profile?.experience || 0} Years`}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100 dark:bg-indigo-900/30"
        />
      </div>
    </div>
  );
}
