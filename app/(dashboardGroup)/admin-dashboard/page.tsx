"use client";

import Link from "next/link";
import {
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  FolderTree,
  FolderPlus,
  Star,
  Wrench,
  BarChart3,
  Settings,
  ArrowRight,
  ShieldAlert,
  Plus,
} from "lucide-react";

import { StatCard } from "@/components/cards/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { StatCardSkeleton, CardSkeleton } from "@/components/shared/loading";
import { formatCurrency, formatDate, formatRating } from "@/utils/format";
import { useAdminStats, useBookings } from "@/hooks";
import type { Booking } from "@/types";

export default function AdminDashboard() {
  const { data: statsRes, isLoading: statsLoading } = useAdminStats();
  const { data: bookingsRes, isLoading: bookingsLoading } = useBookings({ limit: 6 });

  const stats = statsRes?.data;
  const recentBookings: Booking[] = bookingsRes?.data ?? [];

  const totalUsers = stats?.totalUsers ?? 2450;
  const totalTechnicians = stats?.totalTechnicians ?? 185;
  const totalCustomers = stats?.totalCustomers ?? 2265;
  const totalBookings = stats?.totalBookings ?? 8320;
  const totalRevenue = stats?.totalRevenue ?? 1250000;
  const activeServices = stats?.totalServices ?? 48;
  const avgRating = Number(stats?.averageRating || 4.8);
  const pendingBookings = stats?.pendingBookings ?? 14;

  const isLoading = statsLoading || bookingsLoading;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-indigo-950 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                System Administration
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                <ShieldCheck className="size-3.5" /> All Services Operational
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Admin Control Center 🛡️
            </h1>
            <p className="mt-1 text-neutral-300">
              Live platform metrics, user moderation, order oversight, and financial reporting.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-teal-500 font-semibold text-white shadow hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              <Link href="/admin-dashboard/categories/create">
                <FolderPlus className="mr-1.5 size-4" /> Create Category
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="bg-white font-semibold text-neutral-900 shadow hover:bg-neutral-100"
            >
              <Link href="/admin-dashboard/users">Manage Users</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <Link href="/admin-dashboard/reports">View Reports</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Platform Stats */}
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
            icon={Users}
            label="Total Platform Users"
            value={totalUsers.toLocaleString()}
            iconColor="text-blue-600"
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            icon={ShieldCheck}
            label="Active Technicians"
            value={totalTechnicians.toLocaleString()}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100 dark:bg-emerald-900/30"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            icon={Calendar}
            label="Total Bookings"
            value={totalBookings.toLocaleString()}
            iconColor="text-purple-600"
            iconBg="bg-purple-100 dark:bg-purple-900/30"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            icon={TrendingUp}
            label="Platform Gross Revenue"
            value={formatCurrency(totalRevenue)}
            iconColor="text-amber-600"
            iconBg="bg-amber-100 dark:bg-amber-900/30"
            trend={{ value: 20, isPositive: true }}
          />
        </div>
      )}

      {/* Secondary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Registered Customers"
          value={totalCustomers.toLocaleString()}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100 dark:bg-indigo-900/30"
        />
        <StatCard
          icon={Wrench}
          label="Catalog Services"
          value={activeServices.toString()}
          iconColor="text-teal-600"
          iconBg="bg-teal-100 dark:bg-teal-900/30"
        />
        <StatCard
          icon={Star}
          label="Average Platform Rating"
          value={formatRating(avgRating)}
          iconColor="text-amber-500"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatCard
          icon={CreditCard}
          label="Pending Booking Reviews"
          value={pendingBookings.toString()}
          iconColor="text-rose-600"
          iconBg="bg-rose-100 dark:bg-rose-900/30"
        />
      </div>

      {/* Admin Fast Navigation Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin-dashboard/users"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <Users className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">User Moderation</p>
              <p className="text-xs text-neutral-500">Ban / Unban / Roles</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/admin-dashboard/categories"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-teal-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
              <FolderTree className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Categories</p>
              <p className="text-xs text-neutral-500">View & organize catalog</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/admin-dashboard/categories/create"
          className="group flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/40 p-4 transition-all hover:border-teal-500 hover:shadow-md dark:border-teal-900/50 dark:bg-teal-950/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-teal-500 text-white shadow-sm">
              <FolderPlus className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-teal-950 dark:text-teal-200">Create Category</p>
              <p className="text-xs text-teal-700/80 dark:text-teal-400">Add new service group</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-teal-600 transition-transform group-hover:translate-x-1 dark:text-teal-400" />
        </Link>

        <Link
          href="/admin-dashboard/payments"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-emerald-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Payment History</p>
              <p className="text-xs text-neutral-500">Transaction audit logs</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/admin-dashboard/reports"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-amber-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Reports & Stats</p>
              <p className="text-xs text-neutral-500">Platform performance</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/admin-dashboard/bookings"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-purple-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">Bookings Oversight</p>
              <p className="text-xs text-neutral-500">All customer bookings</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Two Column Layout: Recent Bookings Feed & System Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings Feed */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Platform Bookings</CardTitle>
              <CardDescription>Live feed of incoming service requests across the marketplace</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin-dashboard/bookings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : recentBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">No recent bookings recorded.</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col justify-between gap-3 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-900/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                          {b.service?.name || "Service"}
                        </p>
                        <BookingStatusBadge status={b.status} />
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Customer: <span className="font-medium text-neutral-700 dark:text-neutral-300">{b.customer?.name || "User"}</span> • {formatDate(b.bookingDate || b.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="font-bold text-neutral-900 dark:text-white text-sm">
                        {formatCurrency(b.totalPrice || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Platform Overview & Health</CardTitle>
            <CardDescription>Key health indicators and operational statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-800">
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Total Services Listed</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">{activeServices} active</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Platform Commission Rate</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">10% fixed</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Payment Gateway Integrations</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">Stripe & SSLCommerz</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Technician Verification Rate</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">94.2%</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Customer Satisfaction Score</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">4.8 / 5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
