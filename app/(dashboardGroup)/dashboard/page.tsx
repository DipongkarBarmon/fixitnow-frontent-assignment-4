"use client";

import { Calendar, CreditCard, Clock, CheckCircle2, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/cards/stat-card";
import { useAuth } from "@/providers/auth-provider";

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {user?.name || "User"}! 👋</h1>
        <p className="mt-1 text-blue-100">Here&apos;s what&apos;s happening with your bookings today.</p>
        <Button asChild variant="secondary" className="mt-4 gap-2 text-blue-700">
          <Link href="/services">Book a Service <ArrowRight className="size-4" /></Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Total Bookings" value="12" iconColor="text-blue-600" iconBg="bg-blue-100 dark:bg-blue-900/30" />
        <StatCard icon={CheckCircle2} label="Completed" value="8" iconColor="text-emerald-600" iconBg="bg-emerald-100 dark:bg-emerald-900/30" />
        <StatCard icon={Clock} label="Pending" value="3" iconColor="text-amber-600" iconBg="bg-amber-100 dark:bg-amber-900/30" />
        <StatCard icon={Star} label="Reviews Given" value="6" iconColor="text-purple-600" iconBg="bg-purple-100 dark:bg-purple-900/30" />
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
          <Button asChild variant="ghost" size="sm"><Link href="/dashboard/bookings">View All</Link></Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { service: "Plumbing Repair", tech: "Karim Ahmed", date: "Aug 02, 2026", status: "PENDING", statusColor: "bg-amber-100 text-amber-700" },
              { service: "AC Maintenance", tech: "Sumon Das", date: "Jul 28, 2026", status: "COMPLETED", statusColor: "bg-emerald-100 text-emerald-700" },
              { service: "Electrical Wiring", tech: "Rafiq Islam", date: "Jul 25, 2026", status: "COMPLETED", statusColor: "bg-emerald-100 text-emerald-700" },
            ].map((booking, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{booking.service}</p>
                  <p className="text-sm text-neutral-500">{booking.tech} • {booking.date}</p>
                </div>
                <Badge variant="secondary" className={booking.statusColor}>{booking.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/bookings" className="rounded-xl border border-neutral-200 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-neutral-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20">
          <Calendar className="mb-3 size-8 text-blue-600" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">My Bookings</h3>
          <p className="mt-1 text-sm text-neutral-500">View and manage your bookings</p>
        </Link>
        <Link href="/dashboard/payments" className="rounded-xl border border-neutral-200 p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-neutral-800 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20">
          <CreditCard className="mb-3 size-8 text-emerald-600" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">Payments</h3>
          <p className="mt-1 text-sm text-neutral-500">View your payment history</p>
        </Link>
        <Link href="/dashboard/reviews" className="rounded-xl border border-neutral-200 p-5 transition-colors hover:border-purple-300 hover:bg-purple-50/50 dark:border-neutral-800 dark:hover:border-purple-800 dark:hover:bg-purple-950/20">
          <Star className="mb-3 size-8 text-purple-600" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">Reviews</h3>
          <p className="mt-1 text-sm text-neutral-500">Leave reviews for services</p>
        </Link>
      </div>
    </div>
  );
}