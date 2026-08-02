"use client";

import { Users, Calendar, CreditCard, TrendingUp, ShieldCheck, FolderTree, Star } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 text-white sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard 🛡️</h1>
        <p className="mt-1 text-neutral-300">Platform overview and management controls.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value="2,450" iconColor="text-blue-600" iconBg="bg-blue-100 dark:bg-blue-900/30" trend={{ value: 8, isPositive: true }} />
        <StatCard icon={ShieldCheck} label="Active Technicians" value="185" iconColor="text-emerald-600" iconBg="bg-emerald-100 dark:bg-emerald-900/30" trend={{ value: 5, isPositive: true }} />
        <StatCard icon={Calendar} label="Total Bookings" value="8,320" iconColor="text-purple-600" iconBg="bg-purple-100 dark:bg-purple-900/30" trend={{ value: 12, isPositive: true }} />
        <StatCard icon={TrendingUp} label="Total Revenue" value={formatCurrency(1250000)} iconColor="text-amber-600" iconBg="bg-amber-100 dark:bg-amber-900/30" trend={{ value: 15, isPositive: true }} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Customers" value="2,265" iconColor="text-indigo-600" iconBg="bg-indigo-100 dark:bg-indigo-900/30" />
        <StatCard icon={CreditCard} label="Pending Payments" value="23" iconColor="text-red-600" iconBg="bg-red-100 dark:bg-red-900/30" />
        <StatCard icon={FolderTree} label="Categories" value="8" iconColor="text-teal-600" iconBg="bg-teal-100 dark:bg-teal-900/30" />
        <StatCard icon={Star} label="Avg. Rating" value="4.7" iconColor="text-amber-600" iconBg="bg-amber-100 dark:bg-amber-900/30" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent Bookings</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { customer: "Ali Hassan", service: "AC Repair", tech: "Sumon Das", status: "PENDING" },
                { customer: "Nadia Islam", service: "Plumbing", tech: "Karim Ahmed", status: "COMPLETED" },
                { customer: "Rahim Khan", service: "Electrical", tech: "Rafiq Islam", status: "IN_PROGRESS" },
              ].map((b, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <div><p className="text-sm font-medium">{b.customer}</p><p className="text-xs text-neutral-500">{b.service} • {b.tech}</p></div>
                  <span className="text-xs font-medium">{b.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Platform Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Services Listed", value: "320" },
                { label: "Bookings This Month", value: "847" },
                { label: "Revenue This Month", value: formatCurrency(125000) },
                { label: "New Users This Month", value: "156" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">{item.label}</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
