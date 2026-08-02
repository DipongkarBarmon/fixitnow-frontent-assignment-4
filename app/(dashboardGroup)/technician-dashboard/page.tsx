"use client";

import { Calendar, CreditCard, Clock, CheckCircle2, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/cards/stat-card";
import { formatCurrency } from "@/utils/format";
import { useAuth } from "@/providers/auth-provider";

export default function TechnicianDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome, {user?.name || "Technician"}! 🔧</h1>
        <p className="mt-1 text-emerald-100">Here&apos;s your performance overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Monthly Earnings" value={formatCurrency(15000)} iconColor="text-emerald-600" iconBg="bg-emerald-100 dark:bg-emerald-900/30" trend={{ value: 12, isPositive: true }} />
        <StatCard icon={Calendar} label="Upcoming Jobs" value="5" iconColor="text-blue-600" iconBg="bg-blue-100 dark:bg-blue-900/30" />
        <StatCard icon={Clock} label="Pending Requests" value="3" iconColor="text-amber-600" iconBg="bg-amber-100 dark:bg-amber-900/30" />
        <StatCard icon={Star} label="Average Rating" value="4.8" iconColor="text-purple-600" iconBg="bg-purple-100 dark:bg-purple-900/30" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { service: "Plumbing Repair", customer: "Mohammad Ali", date: "Aug 03, 2026", time: "10:00 AM", status: "ACCEPTED", amount: 1500 },
              { service: "Pipe Replacement", customer: "Sarah Khan", date: "Aug 05, 2026", time: "2:00 PM", status: "PENDING", amount: 2500 },
            ].map((job, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 gap-2">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{job.service}</p>
                  <p className="text-sm text-neutral-500">Customer: {job.customer} • {job.date} at {job.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-neutral-900 dark:text-white">{formatCurrency(job.amount)}</span>
                  <Badge variant="secondary" className={job.status === "ACCEPTED" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}>{job.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={CheckCircle2} label="Completed This Month" value="18" iconColor="text-emerald-600" iconBg="bg-emerald-100 dark:bg-emerald-900/30" />
        <StatCard icon={CreditCard} label="Total Earnings" value={formatCurrency(120000)} iconColor="text-blue-600" iconBg="bg-blue-100 dark:bg-blue-900/30" />
      </div>
    </div>
  );
}
