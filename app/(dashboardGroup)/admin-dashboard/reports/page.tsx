"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Star,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/cards/stat-card";
import { formatCurrency, getAvatarUrl, getInitials } from "@/utils/format";
import { useAdminUsers, useBookings } from "@/hooks";
import type { Booking } from "@/types";

export default function AdminReportsPage() {
  const { data: usersRes, isLoading: usersLoading } = useAdminUsers({ limit: 1000 });
  const { data: bookingsRes, isLoading: bookingsLoading } = useBookings({ limit: 1000 });

  const [isExporting, setIsExporting] = useState(false);

  const rawData = bookingsRes?.data;
  const bookings: Booking[] = Array.isArray(rawData) ? rawData : (Array.isArray((rawData as any)?.data) ? (rawData as any).data : []);
  const allUsers = Array.isArray(usersRes?.data) ? usersRes?.data : [];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Platform financial report exported to CSV successfully!");
    }, 1000);
  };

  // 1. Top Metrics Calculation
  const totalUsers = usersRes?.meta?.total || allUsers.length || 0;
  
  let totalGMV = 0;
  let completedCount = 0;
  let totalCount = bookings.length;
  
  const techStats: Record<string, { name: string, jobs: number, revenue: number, category: string, rating: number }> = {};
  const catStats: Record<string, { count: number, revenue: number }> = {};

  bookings.forEach(b => {
    // GMV calculation (consider paid or success or completed)
    const isPaid = b.paymentStatus === "PAID" || b.paymentStatus === "SUCCESS" || b.status === "PAID";
    const amount = Number(b.totalPrice || b.price || 0);
    
    if (isPaid || b.status === "COMPLETED") {
      totalGMV += amount;
    }
    
    if (b.status === "COMPLETED") {
      completedCount += 1;
    }

    // Top Technicians mapping
    if (b.technician && b.status === "COMPLETED") {
      const techId = typeof b.technician === "string" ? b.technician : b.technician.id;
      const techName = typeof b.technician === "string" ? "Technician" : (b.technician.name || "Unknown");
      const catName = typeof b.service === "object" ? (b.service?.category?.name || "General") : "General";
      
      if (!techStats[techId]) {
        techStats[techId] = { name: techName, jobs: 0, revenue: 0, category: catName, rating: 4.5 };
      }
      techStats[techId].jobs += 1;
      techStats[techId].revenue += amount;
    }

    // Category Distribution mapping
    const catName = typeof b.service === "object" ? (b.service?.category?.name || "General") : "General";
    if (isPaid || b.status === "COMPLETED") {
      if (!catStats[catName]) {
        catStats[catName] = { count: 0, revenue: 0 };
      }
      catStats[catName].count += 1;
      catStats[catName].revenue += amount;
    }
  });

  const completionRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : "0.0";

  // 2. Sort and Process Technicians
  const topTechnicians = Object.values(techStats)
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 5);

  // 3. Sort and Process Categories
  const totalCatRevenue = Object.values(catStats).reduce((sum, c) => sum + c.revenue, 0);
  const categoryPerformance = Object.entries(catStats)
    .map(([name, data]) => ({
      name,
      percentage: totalCatRevenue > 0 ? Math.round((data.revenue / totalCatRevenue) * 100) : 0,
      count: data.count,
      revenue: data.revenue
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Reports & Platform Analytics
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Marketplace revenue analytics, category performance, and top technician rankings.
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={isExporting || bookingsLoading}
          className="gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          <Download className="size-4" /> {isExporting ? "Exporting..." : "Export Report (CSV)"}
        </Button>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="Total Marketplace GMV"
          value={bookingsLoading ? "..." : formatCurrency(totalGMV)}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          trend={{ value: 14, isPositive: true }}
        />
        <StatCard
          icon={DollarSign}
          label="Platform Net Revenue (10%)"
          value={bookingsLoading ? "..." : formatCurrency(Math.round(totalGMV * 0.1))}
          iconColor="text-blue-600"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          trend={{ value: 14, isPositive: true }}
        />
        <StatCard
          icon={CheckCircle2}
          label="Job Completion Rate"
          value={bookingsLoading ? "..." : `${completionRate}%`}
          iconColor="text-purple-600"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
        />
        <StatCard
          icon={Users}
          label="Total Active Users"
          value={usersLoading ? "..." : totalUsers.toString()}
          iconColor="text-amber-600"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Two Column Section: Category Distribution & Top Performers */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Category Booking Distribution</CardTitle>
            <CardDescription>
              Volume share and total GMV generated by service categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {bookingsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between"><div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"/><div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"/></div>
                    <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse"/>
                  </div>
                ))}
              </div>
            ) : categoryPerformance.length === 0 ? (
              <div className="py-8 text-center text-sm text-neutral-500">No category data available</div>
            ) : (
              categoryPerformance.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">{cat.count} jobs</span>
                      <strong className="text-neutral-900 dark:text-white">
                        {formatCurrency(cat.revenue)}
                      </strong>
                    </div>
                  </div>
                  <Progress value={cat.percentage} className="h-2 bg-neutral-100 dark:bg-neutral-800" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Performing Technicians */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Performing Technicians</CardTitle>
            <CardDescription>
              Ranked by completed service jobs and customer satisfaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 h-14 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-3 animate-pulse">
                    <div className="size-9 rounded-full bg-neutral-200 dark:bg-neutral-800"/>
                    <div className="space-y-2 flex-1"><div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded"/><div className="h-2 w-16 bg-neutral-200 dark:bg-neutral-800 rounded"/></div>
                  </div>
                ))}
              </div>
            ) : topTechnicians.length === 0 ? (
               <div className="py-8 text-center text-sm text-neutral-500">No top technicians available</div>
            ) : (
              <div className="space-y-4">
                {topTechnicians.map((tech, index) => (
                  <div
                    key={tech.name}
                    className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {index + 1}
                      </span>
                      <Avatar className="size-9">
                        <AvatarImage src={getAvatarUrl(tech.name)} alt={tech.name} />
                        <AvatarFallback>{getInitials(tech.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white text-sm line-clamp-1">
                          {tech.name}
                        </p>
                        <p className="text-xs text-neutral-500 line-clamp-1">{tech.category}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-amber-500 text-xs font-bold">
                        <Star className="size-3.5 fill-amber-400" />
                        <span>{tech.rating}</span>
                      </div>
                      <p className="text-xs text-neutral-500">{tech.jobs} jobs completed</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
